import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, WritableSignal, input, signal, HostListener } from '@angular/core';
import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import { Falsy, Subscription } from 'rxjs';
import {
  HierarchyNode,
  Selection,
  svg,
  drag,
  ValueFn,
  tree,
  TreeLayout,
  hierarchy,
  select,
  HierarchyPointNode,
  Link,
  Transition,
  TransitionLike,
  BaseType,
  HierarchyLink,
  TreemapLayout,
  linkHorizontal,
  DefaultLinkObject,
  treemap,
} from 'd3';
import * as uuid from 'uuid';
import * as d3 from 'd3';
// import { BaseType } from 'd3-selection';
import { PlotService } from '@services/plot/plot.service';
import { Plot, PlotContent } from '@models/plot';
import StoryEditor from '@lib/editor';
import { StoriesService } from '@services/stories.service';
import { NotificationService } from '@services/notification.service';
import { NodeFormComponent } from '../../editor-mode/node-form/node-form.component';

type Unknown = any;
type CanvasSelection = Selection<SVGGElement | any, undefined | unknown, HTMLElement | null | any, undefined>;
// Selection<SVGSVGElement, undefined, null, undefined>
interface RootType extends HierarchyNode<PlotContent | undefined> {
  x: Unknown;
  index: number;
  x0?: number;
  y0?: number;
  y?: number;
  // index: number;
  // x0: Unknown;
  // y0: Unknown;
  // x: Unknown;
  // y: Unknown;
  // _children: RootType[] | undefined;
}

@Component({
  imports: [JsonPipe, NodeFormComponent, NgIf, CommonModule],
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss'],
})
export class HierarchyComponent implements OnInit, OnDestroy {
  @ViewChild('D3HierarchyInputRef') D3HierarchyInputRef: ElementRef | undefined;
  content = input<Plot>();
  private _HierarchySubscriber?: Subscription;
  mutatedPlot?: Plot;
  plot: WritableSignal<Plot | undefined> = signal(this.content());

  // page size related
  isMobile: boolean = false;
  navBarWidth = 68;
  innerWidth: number = window.innerWidth - this.navBarWidth;
  innerHeight: number = window.innerHeight;
  mobileWidth: number = 760;

  // Board related
  storyEditor?: StoryEditor;
  private _editedSubscription?: Subscription;
  narrativeEdited?: boolean;
  graphRefreshed: boolean = false;
  name = 'tree-hierarchy-wrapper';
  boardId = 'svg-board-canvas';
  HierarchyElement = `div#${this.name}`;

  // ************** Generate the tree diagram	 ***************** //
  width = 2500;
  height = 2000;
  createSvg: any = svg;

  // Specify the charts’ dimensions. The height is variable, depending on the layout.
  // width = 928;
  marginTop = 10;
  marginRight = 10;
  marginBottom = 10;
  marginLeft = 40;

  // declares a tree layout and assigns the size
  // Controls the look of the graph/D3-table
  treeMap: TreeLayout<unknown> = tree();
  // treeMap: d3.TreeLayout<unknown> = d3.tree().size([this.width, this.height]);

  margin = { top: 20, right: 120, bottom: 20, left: 120 };
  duration = 750;
  padding = 1;
  i = 0;

  // Rows are separated by dx pixels, columns by dy pixels. These names can be counter-intuitive
  // (dx is a height, and dy a width). This because the tree must be viewed with the root at the
  // “bottom”, in the data domain. The width of a column is based on the tree’s height.
  // root = d3.hierarchy(data);
  container: Selection<BaseType, unknown, HTMLElement, any> | undefined;
  base: RootType | undefined;
  nodes: RootType[] | undefined;
  dx: number | undefined;
  dy: number | undefined = this.width / this.padding;
  // declares a tree layout and assigns the size
  // Controls the look of the graph/D3-table
  tree: TreemapLayout<unknown | any> | undefined;
  diagonal: Link<Unknown, DefaultLinkObject, Unknown> | undefined;
  // diagonal: Link<any, d3.DefaultLinkObject, [number, number]> | undefined;
  curve = d3.line().curve(d3.curveNatural);

  // Compute the extent of the tree. Note that x and y are swapped here
  // because in the tree layout, x is the breadth, but when displayed, the
  // tree extends right rather than down.
  x0: number = Infinity;
  x1: number = -this.x0;
  circleWidth = 10;
  circleRadius = 5;
  circleHeight = 10;
  nodeSize = 30;

  svg: CanvasSelection | undefined;
  link: Selection<BaseType | SVGPathElement, HierarchyLink<PlotContent | undefined>, SVGGElement, unknown> | any;
  node: Selection<Unknown, RootType, SVGGElement, unknown> | undefined;
  gLink: CanvasSelection | undefined;
  gNode: CanvasSelection | undefined;
  nodeEnter: Selection<SVGGElement | any, RootType, SVGGElement, undefined> | undefined;
  transition: Transition<SVGGElement, undefined, null, undefined> | undefined;
  // append the svg object to the body of the page
  // svg: Selection<SVGGElement, HierarchyNode<PlotContent> | unknown, HTMLElement, any> | undefined = undefined;
  // svg: Selection<Element, any, HTMLElement, any> = undefined;

  // Node related
  interactiveNodeButton = 42;
  nodeEnterRectWidth = 42;
  nodeEnterRectHeight = this.nodeEnterRectWidth / 3;
  nodeEnterRectRepoX = (this.nodeEnterRectWidth - this.nodeEnterRectWidth * 2) / 2;
  nodeEnterRectRepoY = (this.nodeEnterRectHeight - this.nodeEnterRectHeight * 2) / 2;
  x: any;
  y: any;

  constructor(private plotService: PlotService, private storiesService: StoriesService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.isMobile = this.innerWidth < this.mobileWidth;

    this.plot.set(this.content());
    const plotContent = this.plot();
    console.log('On init plot-content', plotContent);

    if (plotContent && plotContent?.id) {
      console.log('On init. setting up');
      // apply data to Board
      this.storyEditor = new StoryEditor(plotContent.id, plotContent);
      if (!this.storyEditor) return this.notificationService.notifyUser("Board couldn't be made.");
      if (this.storyEditor?.errorMessage) return this.notificationService.notifyUser(this.storyEditor.errorMessage);

      this._editedSubscription = this.storyEditor.edited.subscribe((state: boolean) => {
        this.narrativeEdited = state;
      });

      this.init();
    }
  }

  ngOnDestroy(): void {
    this._HierarchySubscriber?.unsubscribe();
    this._editedSubscription?.unsubscribe();
    console.log('ON DESTROY');
    select(this.HierarchyElement).selectAll('*').remove();
  }

  // @HostListener is applied to the onWindowResize function
  @HostListener('window:resize', ['$event'])
  /**
   * Event fires on page resize.
   * @param event
   */
  onWindowResize(event: Event) {
    console.log('on window resize');
    const { target } = event;
    if ((target as Window)?.innerWidth && (target as Window)?.innerHeight) {
      this.innerWidth = (target as Window).innerWidth - this.navBarWidth * 4;
      this.innerHeight = (target as Window).innerHeight;
      this.resizeCanvas();
    }
    this.isMobile = this.innerWidth < this.mobileWidth;
  }

  init() {
    const content = this.plot();
    console.log('init function called');

    this.base = d3.hierarchy(content?.content).eachBefore(
      (
        (i) => (d) =>
          ((d as any).index = i++)
      )(0)
    ) as RootType;
    this.base.sort((a, b) => d3.descending(a.height, b.height));
    this.base.x0 = this.height / 2;
    this.base.y0 = 0;
    this.nodes = this.base.descendants();

    // Compute the layout.
    // this.dx = 10;
    // this.dy = this.width / ((this.base as any).height + 1);
    this.dx = 10;
    this.dy = this.width / (this.base.height + this.padding);
    // tree().nodeSize([this.dx, this.dy])(this.base as HierarchyNode<unknown>);

    // Center the tree.
    this.base.each((d) => {
      if (d.x > this.x1) this.x1 = d.x;
      if (d.x < this.x0) this.x0 = d.x;
    });

    // Compute the default height.
    if (this.height === undefined) this.height = this.x1 - this.x0 + this.dx * 2;

    const curve = d3.curveBumpX;
    // Use the required curve
    if (typeof curve !== 'function') throw new Error(`Unsupported curve`);

    // Compute the adjusted height of the tree.
    // this.height = (this.nodes.length + 1) * this.nodeSize;

    this.generateSVG();
  }

  generateSVG() {
    console.log('generate SVG function called');
    if (!this.dx || !this.dy || !this.base) {
      console.log('generate svg error');
      return;
    }

    // Alt to: d3.layout.tree().size([height, width]);
    this.tree = treemap().size([this.height, this.width]).padding(20);

    const nodeSpacing = 60;
    // Alt to: d3.svg.diagonal()
    this.diagonal = linkHorizontal()
      .x((d: Unknown) => d.y)
      .y((d: Unknown) => d.x);

    this.container = d3.select(this.HierarchyElement);
    // Create the SVG container, a layer for the links and a layer for the nodes.
    this.svg = this.container
      .append('svg')
      .attr('id', this.boardId)
      .attr('viewBox', [(this.dy * this.padding) / 2, this.x0 - this.dx, this.width, this.height])
      // .attr('viewBox', [-this.nodeSize / 2, (-this.nodeSize * 3) / 2, this.width, this.height])
      .attr('width', this.width + this.margin.right + this.margin.left)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('style', 'max-width: 100%; height: auto; font: 16px sans-serif; overflow: visible;')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 16);

    const former = () => {
      // this.tree = d3.treemap().size([this.width, this.height]).padding(4).round(true);
      // this.tree(this.base as HierarchyNode<unknown>);
      // // this.svg
      // //   .append('g')
      // //   .attr('fill', 'none')
      // //   .attr('stroke', '#555')
      // //   .attr('stroke-opacity', 0.4)
      // //   .attr('stroke-linecap', null)
      // //   .attr('stroke-linejoin', null)
      // //   .attr('stroke-width', 1.5)
      // //   .selectAll('path')
      // //   .data(this.base.links())
      // //   .join('path')
      // //   .attr('d', () => '');
      // this.link = this.svg
      //   .append('g')
      //   .attr('fill', 'none')
      //   .attr('stroke', '#555')
      //   .attr('stroke-opacity', 0.4)
      //   .attr('stroke-linecap', null)
      //   .attr('stroke-linejoin', null)
      //   .attr('stroke-width', 1.5)
      //   .selectAll('path')
      //   .data(this.base.links())
      //   .join('path')
      //   .attr('d', (m) => {
      //     const curve = d3.curveBumpX;
      //     const drawer = d3
      //       .link(curve)
      //       .x((d: Unknown) => d.y)
      //       .y((d: Unknown) => d.x);
      //     // console.log('drawer', { drawer });
      //     // console.log('drawer.xx', drawer.source());
      //     // console.log('mm', m);
      //     const o = { x: drawer.x(), y: drawer.y() };
      //     return drawer.source() as Unknown;
      //   });
      // console.log('root links', this.base.links());
      // // this.link = this.svg
      // //   .append('g')
      // //   .attr('fill', 'none')
      // //   .attr('stroke', '#999')
      // //   .selectAll()
      // //   .data(this.base.links())
      // //   .join('path')
      // //   .attr(
      // //     'd',
      // //     (d: HierarchyLink<Unknown>) => `
      // //     M${d.source.depth * this.nodeSize},${((d.source as Unknown)?.index ?? d.source.depth + 1) * this.nodeSize}
      // //     V${((d.target as Unknown).index ?? d.target.depth + 1) * this.nodeSize}
      // //     h${this.nodeSize}
      // //   `
      // //   );
      // //   const nodes = svg.selectAll("g")
      // // .data(root.descendants())
      // // .enter()
      // // .append("g")
      // // .attr("transform", d => `translate(${d.x0},${d.y0})`);
      // // Set Node
      // this.node = this.svg
      //   .append('g')
      //   .attr('data-element-identifier', 'node-group')
      //   .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
      //   // .attr('transform', (...all) => {
      //   //   console.log('transform A d', all);
      //   //   return '';
      //   // })
      //   .selectAll()
      //   .data(this.base.descendants())
      //   .join('g')
      //   .attr('data-node-depth', (d) => d.depth)
      //   .attr('data-node-index', (d) => d.index)
      //   .attr('data-element-identifier', 'graph-node')
      //   .attr('transform', (d: Unknown) => {
      //     console.log('transform d', d);
      //     return `translate(${d.x ? d.x : 0},${d.y ?? 0})`;
      //   });
      // this.node
      //   .append('rect')
      //   .attr('width', (d: Unknown) => (d.x1 ?? 0) - (d.x0 ?? 0))
      //   .attr('height', (d: Unknown) => (d.y1 ?? 0) - (d.y0 ?? 0))
      //   .attr('fill', 'lightblue')
      //   .attr('stroke', 'white');
      // // this.node
      // //   .append('circle')
      // //   .attr('cx', (d) => d.depth * this.nodeSize)
      // //   .attr('r', 4)
      // //   .attr('fill', (d) => (d.children ? null : '#999'));
      // this.node
      //   .append('text')
      //   .attr('x', (d: Unknown) => ((d.x1 ?? 1) - (d.x0 ?? 1)) / 2)
      //   .attr('y', (d: Unknown) => ((d.y1 ?? 1) - (d.y0 ?? 1)) / 2)
      //   .attr('dy', '0.35em')
      //   .attr('text-anchor', 'middle')
      //   .text((d: Unknown) => d.data.name);
      // // name
      // // this.node
      // //   .append('text')
      // //   .attr('dy', '0.32em')
      // //   .attr('dx', '.5em')
      // //   .attr('x', (d) => d.depth * this.nodeSize + 6)
      // //   // text size
      // //   .attr('style', 'font-size: 1rem')
      // //   .attr('class', 'tree--node')
      // //   .text((d) => d.data?.name ?? 'unset name');
      // console.log('this.svg data:', this.svg);
      // console.log('this.base data:', this.base);
    };

    console.log('root has data');
    // this.update(null, this.base);
    this.render(null, this.base, this.svg);
  }

  render(event: any, source: RootType, svg: CanvasSelection) {
    if (!this.svg || !this.base || !this.tree || !this.diagonal) {
      console.log(`error render svg: ${this.svg} | base: ${this.base} | tree: ${this.tree}`);
      return;
    }

    const links = this.base.links();

    console.log('links links', links);
    // Normalize for fixed-depth.
    this.nodes?.forEach(function (d) {
      d.y = d.depth * 180;
    });

    // Update the nodes…
    // Set Node
    this.node = this.svg
      .append('g')
      .selectAll('g')
      .data(source.descendants())
      .join('g')
      .attr('data-element-identifier', 'node__span')
      .attr('data-node-depth', (d) => d.depth)
      .attr('data-node-index', (d) => d.index)
      .attr('transform', (d) => `translate(${d.y},${d.x})`);

    // this.node = this.svg
    //   .append('g')
    //   .attr('data-element-identifier', 'node-group')
    //   // .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')

    //   // .attr('transform', (...all) => {
    //   //   console.log('transform A d', all);
    //   //   return '';
    //   // })
    //   .selectAll()
    //   .data(source.descendants())
    //   .join('g')
    //   .attr('data-node-depth', (d) => d.depth)
    //   .attr('data-node-index', (d) => d.index)
    //   .attr('data-element-identifier', 'graph-node')
    //   .attr('transform', (d: Unknown) => {
    //     console.log('transform d', d);
    //     return `translate(${d.x ?? 0},${d.y ?? 0})`;
    //   });

    // this.node
    //   .append('rect')
    //   .attr('width', (d: Unknown) => d.x1 - d.x0)
    //   .attr('height', (d: Unknown) => d.y1 - d.y0)
    //   .attr('fill', 'lightblue')
    //   .attr('stroke', 'white');

    // Text
    this.node
      .append('text')
      .attr('dy', '0.32em')
      .attr('dy', '0.32em')
      .attr('x', (d) => (d.children ? -6 : 6))
      .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
      .attr('paint-order', 'stroke')
      .attr('style', 'font-size: 16px ')
      .text((d: Unknown) => d.data.name);

    // this.node
    //   .append('text')
    //   .attr('x', (d: Unknown) => ((d.x1 ?? 1) - (d.x0 ?? 1)) / 2)
    //   .attr('y', (d: Unknown) => ((d.y1 ?? 1) - (d.y0 ?? 1)) / 2)
    //   .attr('dy', '0.35em')
    //   .attr('text-anchor', 'middle')
    //   .attr('style', 'font-size: 16px ')
    //   .text((d: Unknown) => d.data.name);

    // Enter any new nodes at the parent's previous position.
    const enter = this.node
      .enter()
      .append('g')
      .attr('class', 'node')
      // .attr('transform', function (d) {
      //   return 'translate(' + source.y0 + ',' + source.x0 + ')';
      // })
      .on('click', this.click);

    // enter
    //   .append('text')
    //   .attr('x', function (d) {
    //     return d.children ? -10 : 10;
    //   })
    //   .attr('dy', '.35em')
    //   .attr('text-anchor', function (d) {
    //     return d.children ? 'end' : 'start';
    //   })
    //   .text(function (d) {
    //     return d.name;
    //   })
    //   .style('fill-opacity', 1e-6);

    // // Transition exiting nodes to the parent's new position.
    // const update = this.node
    //   .transition()
    //   .duration(this.duration)
    //   .attr('transform', function (d) {
    //     return 'translate(' + (d.y ?? 0) + ',' + (d.x ?? 0) + ')';
    //   });

    // // Update the links…
    // var link = this.svg.selectAll('path.link').data(links, function (d: any) {
    //   return d.target.id;
    // });

    // // Enter any new links at the parent's previous position.
    // link
    //   .enter()
    //   .insert('path', 'g')
    //   .attr('class', 'node__path')
    //   .attr('d', function (d) {
    //     const curv = d3.curveBumpX;
    //     const drawer = d3
    //       .link(curv)
    //       .x((b: Unknown) => b.y)
    //       .y((b: Unknown) => b.x);
    //     console.log('drawer', { drawer });
    //     console.log('drawer.xx', drawer.source());
    //     console.log('d -- d', d);

    //     const curve = d3.line().curve(d3.curveNatural);
    //     const result = curve([]);

    //     const o = { x: drawer.x(), y: drawer.y() };

    //     // const curve = d3.line().curve(d3.curveNatural);
    //     // const points = [ [drawer.target()]]

    //     return drawer.toString();

    //     // var o = { x: source.x0, y: source.y0 };
    //     // return this.diagonal({ source: o, target: o });
    //   });

    console.log('root links', source.links());
    console.log('this.svg data:', this.svg);
    console.log('this.base data:', this.base);
  }

  click() {
    console.log('click');
  }

  clear() {
    console.log('clear function called');
    select(this.HierarchyElement).selectAll('*').remove();
  }

  resizeCanvas() {
    if (this.svg) this.svg.attr('width', this.width + this.margin.right + this.margin.left).attr('height', this.height + this.margin.top + this.margin.bottom);
  }

  update(event: any, source: any) {
    console.log('function update');
    if (!this.base || !this.svg || !this.tree || !this.node || !this.link) {
      return;
    }

    const duration = event?.altKey ? 2500 : 250; // hold the alt key to slow down the transition
    const nodes = this.base.descendants().reverse();
    const links = this.base.links();
    // Compute the new tree layout.
    this.tree(this.base as HierarchyNode<unknown>);
  }

  /**
   * Sub-function - Initialise the D3 graph. This function will call the necessary function to create the D3 canvas and
   * add the data needed to build the graph.
   * If there exists a graph. It will be wiped and reset.
   */
  buildD3Tree = async (): Promise<Selection<SVGGElement, unknown, HTMLElement, any> | undefined | void> => {
    // Initialise d3 hierarchy graph.
    // this.base = d3.hierarchy(this.mutatedPlot.content, (d) => d.children);

    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.treeMap.size();
    if (this.svg) {
      this.svg.remove();
      const SVG = document.getElementById('d3-svg');
      this.D3HierarchyInputRef?.nativeElement.removeChild(SVG);
    }

    // const canvas = await this.createCanvas();
    const canvas = this.generateSVG();
    // this.svg = canvas;
    console.log('build d3 tree CANVAS', canvas);
    console.log('build d3 tree mutated plot content', this.mutatedPlot);
    // Initialise d3 hierarchy graph.
    if (!this.mutatedPlot) return this.notificationService.notifyUser('Mutated plot is undefined.');

    // this.base = d3.hierarchy(this.mutatedPlot.content, (d: PlotContent) => d.children);
    // this.update(null, this.base);
    return canvas;
  };

  /**
   * @description Create svg graph.
   * @returns svg graph
   */
  async createCanvas(): Promise<Selection<SVGGElement, unknown, HTMLElement, any>> {
    // this.treeMap = d3.tree().size([this.width, this.height]);

    // append the svg object to the body of the page
    return (
      d3
        .select(this.HierarchyElement)
        .append('svg')
        .attr('id', 'd3-svg')
        .attr('width', this.width)
        .attr('height', this.height)
        // .attr("width", this.width + this.margin.right + this.margin.left)
        // .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
    );
  }

  /**
   * @description Get information from store. Start up D3 graph.
   * @returns
   */
  initialiseComponent(updatingGraph: boolean = false): void {
    this.base = undefined;
    const content = this.plot();

    // const proxy = this.storyEditor?.boardProxy;
    // // NOTE: if the new id is different to the session storage id. Go with the new id.
    // const sessionStorageId: string | undefined = proxy?.story?.id;
    // const sessionStoragePlot: Plot | undefined = proxy?.story;
    // const plotIdProp = content?.id;

    if (!this.plot()) {
      this.notificationService.notifyUser('Plot content not found.');
      console.warn('ERROR Plot:', this.plot());
      return;
    } else if (!this.storyEditor) {
      this.notificationService.notifyUser('Story Editor not found.');
      console.warn('ERROR Story Editor:', this.storyEditor);
      return;
    }

    this.mutatedPlot = this.plot();
    this.buildD3Tree().then((canvas: Selection<SVGGElement, unknown, HTMLElement, any> | undefined | void) => {
      if (canvas && updatingGraph) this.graphRefreshed = true;
    });
  }

  updateNodeContent({ form }: { form: Unknown }) {
    if (!this.storyEditor) return this.notificationService.notifyUser('Editor cant be found. No update was made.');
    if (!this.storyEditor?.getBoardProxyStory()) return this.notificationService.notifyUser('Editor Error board.');

    this.storyEditor.setNodeContent(form, undefined);

    // Note: update graph
    this.initialiseComponent(true);
  }

  addNodeContent({ form, parentNodeId }: { form: Unknown; parentNodeId: string }) {
    if (!this.storyEditor) return this.notificationService.notifyUser('Editor cant be found. No update was made.');
    if (!this.storyEditor?.getBoardProxyStory()) return this.notificationService.notifyUser('Editor Error board.');

    // Update story editor
    this.storyEditor.appendAdditionalNodeContent(parentNodeId, form);

    // Note: update graph
    this.initialiseComponent(true);
  }

  /**
   * Save narrative data to Session Storage.
   */
  saveStateInSession() {
    console.log('save state in session');
    //   if (!this.storyEditor) return this.notificationService.notifyUser('Board could not be saved. Graph board could not be accessed');

    //   const isSaved = this.storyEditor.boardProxy.saveSession();
    //   const story = this.storyEditor?.boardProxy?.story;

    //   if (!story) return this.notificationService.notifyUser("Board information couldn't be captured.");
    //   if (!isSaved) return this.notificationService.notifyUser('Changes could not be saved.');

    //   if (story && isSaved) {
    //     const { id, title, description, content } = story;

    //     this.storiesService.updateStoryRequest({ id, description, title, body: content }).subscribe((response) => {
    //       this.graphRefreshed = !!response;
    //     });
    //   }
  }
}
