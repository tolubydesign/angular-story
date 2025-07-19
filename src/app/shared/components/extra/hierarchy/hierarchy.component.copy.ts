import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, WritableSignal, input, signal, HostListener } from '@angular/core';
import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import { Falsy, Subscription } from 'rxjs';
import { HierarchyNode, Selection, svg, drag, ValueFn, tree, TreeLayout, hierarchy, select, HierarchyPointNode } from 'd3';
import * as uuid from 'uuid';
import * as d3 from 'd3';
import { BaseType } from 'd3-selection';
import { PlotService } from '@services/plot/plot.service';
import { Plot, PlotContent } from '@models/plot';
import StoryEditor from '@lib/editor';
import { StoriesService } from '@services/stories.service';
import { NotificationService } from '@services/notification.service';
import { NodeFormComponent } from '../../editor-mode/node-form/node-form.component';

type RootType = HierarchyNode<Plot | Falsy> | undefined | null | { children: any[]; x0: any; y0: any } | any;

// @Component({
//   imports: [JsonPipe, NodeFormComponent, NgIf, CommonModule],
//   selector: 'app-hierarchy',
//   templateUrl: './hierarchy.component.html',
//   styleUrls: ['./hierarchy.component.scss'],
// })
// export class HierarchyComponent implements OnInit, OnDestroy {
//   @ViewChild('D3HierarchyInputRef') D3HierarchyInputRef: ElementRef | undefined;
//   content = input<Plot>();
//   private _HierarchySubscriber?: Subscription;
//   mutatedPlot?: Plot;
//   plot: WritableSignal<Plot | undefined> = signal(this.content());

//   // page size related
//   isMobile: boolean = false;
//   navBarWidth = 68;
//   innerWidth: number = window.innerWidth - this.navBarWidth;
//   innerHeight: number = window.innerHeight;
//   mobileWidth: number = 760;

//   // Board related
//   storyEditor?: StoryEditor;
//   private _editedSubscription?: Subscription;
//   narrativeEdited?: boolean;
//   graphRefreshed: boolean = false;
//   name = 'd3-tree-hierarchy-wrapper';
//   d3SVGBoardName = 'd3-svg';
//   HierarchyElement = `div#${this.name}`;

//   // ************** Generate the tree diagram	 ***************** //
//   width = 2500;
//   height = 2000;
//   createSvg: any = svg;

//   // declares a tree layout and assigns the size
//   // Controls the look of the graph/D3-table
//   treeMap: TreeLayout<unknown> = tree();
//   // treeMap: d3.TreeLayout<unknown> = d3.tree().size([this.width, this.height]);

//   margin = { top: 100, right: 50, bottom: 100, left: 50 };
//   // viewerWidth = this.width - this.margin.left - this.margin.right;
//   // viewerHeight = this.height - this.margin.top - this.margin.bottom;
//   duration = 750;
//   i = 0;
//   root: RootType = {
//     children: [],
//     x0: 0,
//     y0: 0,
//   };

//   // append the svg object to the body of the page
//   svg: Selection<SVGGElement, HierarchyNode<PlotContent> | unknown, HTMLElement, any> | undefined = undefined;
//   // svg: Selection<Element, any, HTMLElement, any> = undefined;

//   // Node related
//   interactiveNodeButton = 42;
//   nodeEnterRectWidth = 42;
//   nodeEnterRectHeight = this.nodeEnterRectWidth / 3;
//   nodeEnterRectRepoX = (this.nodeEnterRectWidth - this.nodeEnterRectWidth * 2) / 2;
//   nodeEnterRectRepoY = (this.nodeEnterRectHeight - this.nodeEnterRectHeight * 2) / 2;
//   x: any;
//   y: any;

//   constructor(private plotService: PlotService, private storiesService: StoriesService, private notificationService: NotificationService) {}

//   ngOnInit(): void {
//     this.isMobile = this.innerWidth < this.mobileWidth;

//     this.plot.set(this.content());
//     const plotContent = this.plot();
//     console.log('On init plot-content', plotContent);
//     console.log('On init plot-content');
//     if (plotContent && plotContent?.id) {
//       console.log('On init setting things up');

//       // TODO: pass session storage information like id
//       // call session storage
//       // if session storage has data. apply it to Board. If ID's dont match use source instead

//       // apply data to Board
//       this.storyEditor = new StoryEditor(plotContent.id, plotContent);

//       if (!this.storyEditor) return this.notificationService.notifyUser("Board couldn't be made.");
//       if (this.storyEditor?.errorMessage) return this.notificationService.notifyUser(this.storyEditor.errorMessage);

//       this._editedSubscription = this.storyEditor.edited.subscribe((state: boolean) => {
//         this.narrativeEdited = state;
//       });
//     }

//     this.init();
//   }

//   ngOnDestroy(): void {
//     this._HierarchySubscriber?.unsubscribe();
//     this._editedSubscription?.unsubscribe();
//     console.log('ON DESTROY');
//     select(this.HierarchyElement).selectAll('*').remove();
//   }

//   // @HostListener is applied to the onWindowResize function
//   @HostListener('window:resize', ['$event'])
//   /**
//    * Event fires on page resize.
//    * @param event
//    */
//   onWindowResize(event: Event) {
//     const { target } = event;
//     if ((target as Window)?.innerWidth && (target as Window)?.innerHeight) {
//       this.innerWidth = (target as Window).innerWidth - this.navBarWidth * 4;
//       this.innerHeight = (target as Window).innerHeight;
//     }
//     this.isMobile = this.innerWidth < this.mobileWidth;
//   }

//   init() {}

//   Box(x: any, y: any, width: number, height: number) {
//     this.x = x;
//     this.y = y;
//     this.width = width;
//     this.height = height;
//   }

//   createClasses(classes: any) {
//     if (!this.svg) {
//       return this.notificationService.notifyUser('Svg not found');
//     }

//     let g = this.svg
//       ?.selectAll('g.class')
//       .data(classes)
//       .enter()
//       .append('g')
//       .attr('id', function (d: any) {
//         return d.classname + 'Class';
//       })
//       .attr('class', 'class')
//       .attr('transform', function (d: any) {
//         return 'translate(' + d.x + ',' + d.y + ')';
//       });

//     g.append('rect')
//       .attr('width', function (d: any) {
//         return d.width;
//       })
//       .attr('fill', 'none')
//       .attr('stroke', 'black')
//       .attr('stroke-width', 1);

//     const classNameG = g.append('g').attr('class', 'classname');
//     const classNameRects = classNameG
//       .append('rect')
//       .attr('width', function (d: any) {
//         return d.width;
//       })
//       .attr('fill', 'none')
//       .attr('stroke', 'black')
//       .attr('stroke-width', 1);

//     const classNameTexts = classNameG
//       .append('text')
//       .attr('font-size', 12)
//       // .call(
//       //   this.multilineText()
//       //     .verticalAlign('top')
//       //     .paddingTop(4)
//       //     .paddingBottom(4)
//       //     .text(function (d: any) {
//       //       return d.classname;
//       //     });
//       // );

//     const adjustHeight = (rects: any, texts: any, paddingTop: number, paddingBottom: number) => {
//       let i;
//       let n = rects.length,
//         rect,
//         text,
//         height;
//       for (i = 0; i < n; i++) {
//         rect = rects[i];
//         text = texts[i];
//         height = text.getBBox().height + paddingTop + paddingBottom;
//         select(rect).attr('height', height);
//       }
//     };

//     // adjustHeight(classNameRects[0], classNameTexts[0], 4, 4);
//     adjustHeight(classNameRects, classNameTexts, 4, 4);

//     var attributesG = g
//       .append('g')
//       .attr('class', 'attributes')
//       .attr('transform', function (this, d) {
//         if (!this || this === null || this === undefined) {
//           return 'translate(0,' + 0 + ')';
//         }
//         const classNameG = select(this)?.node().previousSibling;
//         const height = classNameG?.height;
//         return 'translate(0,' + height + ')';
//       });
//     var attributesRects = attributesG
//       .append('rect')
//       .attr('width', function (d: { width: any }) {
//           return d.width;
//         })
//       .attr('stroke', 'black')
//       .attr('stroke-width', 1);

//     const attributesTexts = attributesG
//       .append('text')
//       .attr('font-size', 12)
//       .call(
//         this.multilineText()
//           .text(function (d: { attributes: any }) {
//             return d.attributes;
//           })
//           .verticalAlign('top')
//           .horizontalAlign('left')
//           .paddingTop(4)
//           .paddingLeft(4)
//       );

//     // adjustHeight(attributesRects[0], attributesTexts[0], 4, 4);
//     adjustHeight(attributesRects[0], attributesTexts, 4, 4);

//     var methodsG = g.append('g')
//       .attr('class', 'methods')
//       .attr('transform', function (this: SVGRectElement, d: any) {
//         var attributesG = select(this).node().previousSibling,
//           classNameText = attributesG?.previousSibling,
//           classNameBBox = classNameText?.getBBox(),
//           attributesBBox = attributesG?.getBBox();
//         return 'translate(0,' + (classNameBBox.height + attributesBBox.height) + ')';
//       });
//     var methodsRects = methodsG.append('rect')
//     .attr('width', function(this: SVGRectElement, d: any) {
//         return d.width;
//       })
//       .attr('fill', 'none')
//       .attr('stroke', 'black')
//       .attr('stroke-width', 1);

//     var methodsTexts = methodsG
//       .append('text')
//       .attr('font-size', 12)
//       .call(
//         this.multilineText()
//           .text(function (d: { methods: any }) {
//             return d.methods;
//           })
//           .verticalAlign('top')
//           .horizontalAlign('left')
//           .paddingTop(4)
//           .paddingLeft(4)
//       );
//     adjustHeight(methodsRects[0], methodsTexts[0], 4, 4);

//     svg.selectAll('g.class').each(function (d: any, i: any) {
//       var classG = d3.select(this),
//         classRect = classG.node().firstChild,
//         classNameG = classRect.nextSibling,
//         attributesG = classNameG.nextSibling,
//         methodsG = attributesG.nextSibling,
//         height = classNameG.getBBox().height + attributesG.getBBox().height + methodsG.getBBox().height;
//       d3.select(classRect).attr('height', height);
//     });

//     var boxes = {};
//     svg.selectAll('g.class').each(function (d: { classname: string | number; x: any; y: any }, i: any) {
//       var classG = d3.select(this),
//         bbox = classG.node().getBBox();
//       boxes[d.classname] = new d3.classDiagram.Box(d.x, d.y, bbox.width, bbox.height);
//     });

//     return boxes;
//   }

//   Diagram() {
//     const addMarkers = (defs: any) => {
//       defs
//         .append('marker')
//         .attr('id', 'filledTriangle')
//         .attr('viewBox', '0 0 10 10')
//         .attr('refX', 10)
//         .attr({
//           id: 'filledTraiangle',
          
//           refY: 5,
//           markerWidth: 10,
//           markerHeight: 10,
//           orient: 'auto',
//         })
//         .append('path')
//         .attr({
//           d: 'M10 5 0 0 0 10Z',
//           'fill-rule': 'evenodd',
//           stroke: 'none',
//           fill: 'black',
//         });

//       defs
//         .append('marker')
//         .attr({
//           id: 'triangle',
//           viewBox: '0 0 10 10',
//           refX: 10,
//           refY: 5,
//           markerWidth: 10,
//           markerHeight: 10,
//           orient: 'auto',
//         })
//         .append('path')
//         .attr({
//           d: 'M10 5 0 0 0 10 Z M8 5 1 8.4 1 1.6Z',
//           'fill-rule': 'evenodd',
//           stroke: 'none',
//           fill: 'black',
//         });

//       defs
//         .append('marker')
//         .attr({
//           id: 'arrowhead',
//           viewBox: '0 0 10 10',
//           refX: 10,
//           refY: 5,
//           markerWidth: 10,
//           markerHeight: 10,
//           orient: 'auto',
//         })
//         .append('path')
//         .attr({
//           d: 'M10 5 0 10 0 8.7 6.8 5.5 0 5.5 0 4.5 6.8 4.5 0 1.3 0 0Z',
//           stroke: 'none',
//           fill: 'black',
//         });

//       defs
//         .append('marker')
//         .attr({
//           id: 'diamond',
//           viewBox: '0 0 16 10',
//           refX: 16,
//           refY: 5,
//           markerWidth: 16,
//           markerHeight: 10,
//           orient: 'auto',
//         })
//         .append('path')
//         .attr({
//           d: 'M-1 5 7.5 0 16 5 7.5 10Z M1.3 5 7.5 8.7 14 5 7.5 1.3Z',
//           'fill-rule': 'evenodd',
//           stroke: 'none',
//           fill: 'black',
//         });

//       defs
//         .append('marker')
//         .attr({
//           id: 'filledDiamond',
//           viewBox: '0 0 16 10',
//           refX: 16,
//           refY: 5,
//           markerWidth: 16,
//           markerHeight: 10,
//           orient: 'auto',
//         })
//         .append('path')
//         .attr({
//           d: 'M-1 5 7.5 0 16 5 7.5 10Z',
//           stroke: 'none',
//           fill: 'black',
//         });
//     };

//     const createClasses = this.createClasses;
//     const Box = this.Box;

//     this.Box.prototype.midX = function () {
//       return this.x + this.width / 2;
//     };
//     this.Box.prototype.rightX = function () {
//       return this.x + this.width;
//     };
//     this.Box.prototype.midY = function () {
//       return this.y + this.height / 2;
//     };
//     this.Box.prototype.bottomY = function () {
//       return this.y + this.height;
//     };

//     function createConnectors(connectors: any) {
//       var line = svg
//         .line()
//         .x(function (d: { x: any }) {
//           return d.x;
//         })
//         .y(function (d: { y: any }) {
//           return d.y;
//         });


//       svg
//         .selectAll('path.connector')
//         .data(connectors)
//         .enter()
//         .append('path')
//         .each((d: { points: any; markerEnd: string }, i: any) => {
//           var path = select(this);
//           path
//           .attr('class', 'connector')
//           .attr('d', line(d.points))
//           .attr('stroke', 'black')
//           .attr('fill', 'none')

//           if (d.markerEnd) {
//             path.attr('marker-end', 'url(#' + d.markerEnd + ')');
//           }
//         });

//       svg.selectAll('path.connector')
//       .attr('stroke-dasharray', function (d: { [x: string]: string }) {
//           var path = select(this),
//             totalLength = path.node().getTotalLength(),
//             marker = svg.select('#' + d['markerEnd'])[0][0],
//             markerWidth = marker.markerWidth.baseVal.value;
//           return '' + (totalLength - markerWidth) + ' ' + markerWidth;
//       })
//       .attr('stroke-dashoffset', 0);
//     }

//     return {
//       Box: Box,
//       addMarkers: addMarkers,
//       createClasses: createClasses,
//       createConnectors: createConnectors,
//     };
//   }

//   multilineText() {
//     let lineHeight = 1.4;
//     let horizontalAlign: 'left' | 'center' | 'right' = 'center'; // 'left', 'center', or 'right'
//     let verticalAlign: 'center' | 'top' | 'bottom' = 'center'; // 'top', 'center', or 'bottom'
//     let paddingTop = 10;
//     let paddingBottom = 10;
//     let paddingLeft = 10;
//     let paddingRight = 10;
//     let textAnchorsByHorizontalAlign = {
//       center: 'middle',
//       left: 'start',
//       right: 'end',
//     };
//     let text = function (d: any) {
//       return d.text;
//     };
//     let width = function (d: any) {
//       return d.width;
//     };
//     let height = function (d: any) {
//       return d.height;
//     };

//     function my(selection: Selection<SVGTextElement, unknown, SVGGElement, unknown>) {
//       selection.each(function (d, i) {
//         var textElem = select(this),
//           lines,
//           lineCount,
//           lineI,
//           line;

//         lines = result(d, text);
//         if (typeof lines === 'string') {
//           lines = lines.split(/\n/);
//         }
//         if (lines === undefined) {
//           return;
//         }
//         lineCount = lines.length;

//         textElem
//           .attr('text-anchor', textAnchorsByHorizontalAlign[horizontalAlign])
//           .attr('fill', 'black')
//           .attr('transform', function (d) {
//             return 'translate(' + translateX(d) + ',' + translateY(d) + ')';
//           });

//         for (lineI = 0; lineI < lineCount; lineI++) {
//           line = lines[lineI];
//           textElem.append('tspan').attr('x', 0).attr('y', lineTspanY(lineI, lineCount)).attr('dy', lineTspanAttrs()).text(line);
//         }
//       });
//     }

//     function translateX(d: unknown) {
//       var w = result(d, width);
//       switch (horizontalAlign) {
//         case 'center':
//           return w / 2;
//         case 'left':
//           return paddingLeft;
//         case 'right':
//           return w - paddingRight;
//       }
//     }

//     function translateY(d: unknown) {
//       var h = result(d, height);
//       switch (verticalAlign) {
//         case 'center':
//           return h / 2;
//         case 'top':
//           return paddingTop;
//         case 'bottom':
//           return h - paddingBottom;
//       }
//     }

//     function lineTspanY(lineI: number, lineCount: number) {
//       var y;
//       switch (verticalAlign) {
//         case 'center':
//           y = (lineI - (lineCount - 1) / 2) * lineHeight;
//           break;
//         case 'top':
//           y = lineI * lineHeight;
//           break;
//         case 'bottom':
//           y = -(lineCount - 1 - lineI) * lineHeight;
//           break;
//       }
//       return y ? y + 'em' : 0;
//     }

//     function lineTspanAttrs(): string | number {
//       // switch (verticalAlign) {
//       //   case 'center':
//       //     return { dy: '.35em' };
//       //   case 'top':
//       //     return { dy: '1em' };
//       //   case 'bottom':
//       //     return { dy: 0 };
//       // }
//       switch (verticalAlign) {
//         case 'center':
//           return '.35em';
//         case 'top':
//           return '1em';
//         case 'bottom':
//           return 0;
//         default:
//           return 0;
//       }
//     }

//     const result = (d: any, property: object) => {
//       return typeof property === 'function' ? property(d) : property;
//     };

//     my.lineHeight = function (value: number) {
//       if (!arguments.length) return lineHeight;
//       lineHeight = value;
//       return my;
//     };

//     my.horizontalAlign = function (value: 'left' | 'center' | 'right') {
//       if (!arguments.length) return horizontalAlign;
//       horizontalAlign = value;
//       return my;
//     };

//     my.verticalAlign = function (value: 'center' | 'top' | 'bottom') {
//       if (!arguments.length) return verticalAlign;
//       verticalAlign = value;
//       return my;
//     };

//     my.paddingTop = function (value: number) {
//       if (!arguments.length) return paddingTop;
//       paddingTop = value;
//       return my;
//     };

//     my.paddingRight = function (value: number) {
//       if (!arguments.length) return paddingRight;
//       paddingRight = value;
//       return my;
//     };

//     my.paddingBottom = function (value: number) {
//       if (!arguments.length) return paddingBottom;
//       paddingBottom = value;
//       return my;
//     };

//     my.paddingLeft = function (value: number) {
//       if (!arguments.length) return paddingLeft;
//       paddingLeft = value;
//       return my;
//     };

//     my.width = function (value: (d: any) => any) {
//       if (!arguments.length) return width;
//       width = value;
//       return my;
//     };

//     my.height = function (value: (d: any) => any) {
//       if (!arguments.length) return height;
//       height = value;
//       return my;
//     };

//     my.text = (value: (d: any) => any) => {
//       if (!arguments.length) return text;
//       text = value;
//       return my;
//     };

//     // return my;

//     return {
//       text,
//       height,
//       width,
//       paddingLeft: my.paddingLeft,
//       paddingBottom: my.paddingBottom,
//       paddingRight: my.paddingRight,
//       paddingTop: my.paddingTop,
//       verticalAlign: my.verticalAlign,
//       horizontalAlign: my.horizontalAlign,
//       lineHeight: my.lineHeight,
//     };
//   }
// }

/**
 * @description Creates a curved (diagonal) path from parent to the child nodes
 * @param {any} s
 * @param {any} d
 * @returns {any} path
 */
function diagonal(s: any, d: any) {
  const path = `M ${s.x} ${s.y} C ${(s.x + d.x) / 2} ${s.y}, ${(s.x + d.x) / 2} ${d.y}, ${d.x} ${d.y}`;
  return path;
}
