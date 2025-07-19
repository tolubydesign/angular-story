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
type RootType = HierarchyNode<PlotContent | undefined> & {
  index?: number;
  // index: number;
  // x0: Unknown;
  // y0: Unknown;
  // x: Unknown;
  // y: Unknown;
  // _children: RootType[] | undefined;
};

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
  name = 'd3-tree-hierarchy-wrapper';
  d3SVGBoardName = 'd3-svg';
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

  margin = { top: 100, right: 50, bottom: 100, left: 50 };
  // viewerWidth = this.width - this.margin.left - this.margin.right;
  // viewerHeight = this.height - this.margin.top - this.margin.bottom;
  duration = 750;
  i = 0;

  // Rows are separated by dx pixels, columns by dy pixels. These names can be counter-intuitive
  // (dx is a height, and dy a width). This because the tree must be viewed with the root at the
  // “bottom”, in the data domain. The width of a column is based on the tree’s height.
  // root = d3.hierarchy(data);
  container: Selection<BaseType, unknown, HTMLElement, any> | undefined;
  base: RootType | undefined;
  nodes: RootType[] | undefined;
  dx: number | undefined;
  dy: number | undefined;
  tree: TreeLayout<unknown> | any | undefined;
  diagonal: Link<Unknown, d3.DefaultLinkObject, Unknown> | undefined;
  // diagonal: Link<any, d3.DefaultLinkObject, [number, number]> | undefined;

  // Compute the extent of the tree. Note that x and y are swapped here
  // because in the tree layout, x is the breadth, but when displayed, the
  // tree extends right rather than down.
  x0: number = Infinity;
  x1: number = -this.x0;
  circleWidth = 10;
  circleRadius = 5;
  circleHeight = 10;
  nodeSize = 20;

  svg: CanvasSelection | undefined;
  link: Selection<SVGPathElement | null, HierarchyLink<PlotContent | undefined>, SVGGElement, unknown> | undefined;
  node: Selection<SVGGElement | null, RootType, SVGGElement, unknown> | undefined;
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
    const { target } = event;
    if ((target as Window)?.innerWidth && (target as Window)?.innerHeight) {
      this.innerWidth = (target as Window).innerWidth - this.navBarWidth * 4;
      this.innerHeight = (target as Window).innerHeight;
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
    );
    this.dx = 10;
    this.dy = this.width / ((this.base as any).height + 1);
    this.nodes = this.base.descendants();
    // Create a tree layout.
    // this.tree = d3.cluster().nodeSize([this.dx, this.dy]);

    // Sort the tree and apply the layout.
    // this.base.sort((a, b) => d3.ascending(a?.data?.name, b.data?.name));
    // this.tree(this.base);

    // Compute the extent of the tree. Note that x and y are swapped here
    // because in the tree layout, x is the breadth, but when displayed, the
    // tree extends right rather than down.
    this.x0 = Infinity;
    this.x1 = -this.x0;

    // this.base.eachBefore(
    //   (
    //     (i) => (d) =>
    //       (d.index = i++)
    //   )(0)
    // );
    this.base.each((d) => console.log('each d', d));
    this.base.eachAfter((d) => console.log('each after d', d));
    // this.base.each((d: RootType | any) => {
    //   if (d.x > this.x1) this.x1 = d.x;
    //   if (d.x < this.x0) this.x0 = d.x;
    // });

    // Compute the adjusted height of the tree.
    this.height = this.x1 - this.x0 + this.dx * 2;

    this.generateSVG();
  }

  generateSVG() {
    console.log('generate SVG function called');
    if (!this.dx || !this.dy || !this.base) {
      return;
    }

    this.container = d3.select(this.HierarchyElement);
    // Create the SVG container, a layer for the links and a layer for the nodes.
    this.svg = this.container
      .append('svg')
      .attr('id', this.d3SVGBoardName)
      .attr('width', this.width)
      .attr('height', this.height)
      // .attr('viewBox', [-this.dy / 3, this.x0 - this.dx, this.width, this.height])
      .attr('viewBox', [-this.nodeSize / 2, -this.nodeSize * 3 / 2, this.width, this.height])
      .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif; overflow: visible;');
    // this.svg = d3
    //   .select(this.HierarchyElement)
    //   .append('svg')
    //   .attr('id', this.d3SVGBoardName)
    //   .attr('width', this.width)
    //   .attr('height', this.height)
    //   .attr('viewBox', [-this.dy / 3, this.x0 - this.dx, this.width, this.height])
    //   .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;');

    console.log('root links', this.base.links());
    this.link = this.svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .selectAll()
      .data(this.base.links())
      .join('path')
      .attr(
        'd',
        (d) => `
        M${(d.source.depth) * this.nodeSize},${((d.source as Unknown)?.index ?? d.source.depth + 1) * this.nodeSize}
        V${((d.target as Unknown)?.index ?? d.target.depth + 1) * this.nodeSize}
        h${this.nodeSize}
      `
      );

    this.node = this.svg
      .append('g')
      .selectAll()
      .data(this.nodes as RootType[])
      .join('g')
      .attr('transform', (d) => `translate(0,${(d.index ?? (d.depth + 1)) * this.nodeSize})`);
    // this.gLink = this.svg.append('g').attr('fill', 'none').attr('stroke', '#555').attr('stroke-opacity', 0.4).attr('stroke-width', 1.5);
    // this.gNode = this.svg.append('g').attr('cursor', 'pointer').attr('pointer-events', 'all');

    this.node
      .append('circle')
      .attr('cx', (d) => d.depth * this.nodeSize)
      .attr('r', 2.5)
      .attr('fill', (d) => (d.children ? null : '#999'));

    this.node
      .append('text')
      .attr('dy', '0.32em')
      .attr('x', (d) => d.depth * this.nodeSize + 6)
      .text((d) => d.data?.name ?? 'name not set');

    this.node.append('title').text((d) =>
      d
        .ancestors()
        .reverse()
        .map((d) => d.data?.name ?? 'name unknown')
        .join('/')
    );

    console.log('this.svg data:', this.svg);
    console.log('this.base data:', this.base);

    if (this.base) {
      console.log('root has data');
      this.update(null, this.base);
    }
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
    this.tree(this.base);

    // let left = this.base;
    // let right = this.base;

    // this.base.eachBefore((node: any) => {
    //   if (node.x < left.x) left = node;
    //   if (node.x > right.x) right = node;
    // });

    // const transition = this.svg.transition().duration(duration).attr('height', this.height);
    // .attr('viewBox', [-this.dy / 3, this.x0 - this.dx, this.width, this.height])
    // .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes…
    // const node = this.node.selectAll('g').data(nodes, (d: any) => d.id);

    // Enter any new nodes at the parent's previous position.
    // const nodeEnter = node.enter()
    //     .attr("transform", (d: any) => {
    //       return `translate(${d.y},${d.x})`
    //     })
    //     .attr("fill-opacity", 0)
    //     .attr("stroke-opacity", 0)
    //     .on("click", (event, d) => {
    //       console.log('node:enter:click:d', d);
    //       console.log('node:enter:click:event', event);
    //       d.children = d.children ?? [];
    //       this.update(event, d);
    //     });

    //     nodeEnter.append("circle")
    //     .attr("r", 2.5)
    //     .attr("fill", d => d.children ? "#555" : "#999")
    //     .attr("stroke-width", 10);

    // nodeEnter.append("text")
    //     .attr("dy", "0.31em")
    //     .attr("x", d => d.children ? -6 : 6)
    //     .attr("text-anchor", d => d.children ? "end" : "start")
    //     .text(d => d.data?.name ?? 'name not provided')
    //     .attr("stroke-linejoin", "round")
    //     .attr("stroke-width", 3)
    //     .attr("stroke", "white")
    //     .attr("paint-order", "stroke");
  }

  // updateOld(event: any, source: RootType) {
  //   if (!this.base || !this.svg || !this.tree || !this.gNode || !this.gLink || !this.diagonal) {
  //     return;
  //   }

  //   const duration = event?.altKey ? 2500 : 250; // hold the alt key to slow down the transition
  //   const nodes = this.base.descendants().reverse();
  //   const links = this.base.links();

  //   // Compute the new tree layout.
  //   this.tree(this.base as HierarchyNode<unknown>);

  //   let left: RootType = this.base;
  //   let right = this.base;

  //   // this.base.eachBefore((node: Unknown) => {
  //   //   if (node?.x < left.x) left = node;
  //   //   if (node?.x > right.x) right = node;
  //   // });

  //   // const height = right.x - left.x + this.marginTop + this.marginBottom;

  //   const transition = this.svg
  //     .transition()
  //     .duration(duration)
  //     .attr('height', this.height)
  //     // .attr('viewBox', [-this.marginLeft, left.x - this.marginTop, this.width, this.height])
  //     .attr('viewBox', `${-this.marginLeft} ${left.x - this.marginTop} ${this.width} ${this.height}`);
  //     // .tween('resize', () => {
  //     //   return null
  //     // })

  //   // Update the nodes…
  //   const node = this.gNode.selectAll('g').data(nodes, (d: Unknown) => d.id);

  //   // Enter any new nodes at the parent's previous position.
  //   this.nodeEnter = node
  //     .enter()
  //     .append('g')
  //     .attr('transform', (d) => {
  //       return `translate(${source.y0},${source.x0})`;
  //     })
  //     .attr('fill-opacity', 0)
  //     .attr('stroke-opacity', 0)
  //     .on('click', (event, d) => {
  //       // d.children = d.children ? null : d._children;
  //       d.children = d.children ? undefined : d._children;
  //       this.update(event, d);
  //     });

  //   this.nodeEnter
  //     .append('circle')
  //     .attr('r', 2.5)
  //     .attr('fill', (d) => (d._children ? '#555' : '#999'))
  //     .attr('stroke-width', 10);

  //   this.nodeEnter
  //     .append('text')
  //     .attr('dy', '0.31em')
  //     .attr('x', (d) => (d._children ? -6 : 6))
  //     .attr('text-anchor', (d) => (d._children ? 'end' : 'start'))
  //     .text((d) => d?.data?.title.slice(0, 4) ?? 'title not set')
  //     .attr('stroke-linejoin', 'round')
  //     .attr('stroke-width', 3)
  //     .attr('stroke', 'white')
  //     .attr('paint-order', 'stroke');

  //   // Transition nodes to their new position.
  //   // const nodeUpdate = node
  //   //   .merge(this.nodeEnter as Unknown)
  //   //   .transition(transition as unknown as string)
  //   //   .attr('transform', (d) => `translate(${d.y},${d.x})`)
  //   //   .attr('fill-opacity', 1)
  //   //   .attr('stroke-opacity', 1);

  //   // // Transition exiting nodes to the parent's new position.
  //   // const nodeExit = node
  //   //   .exit()
  //   //   .transition(transition as unknown as string)
  //   //   .remove()
  //   //   .attr('transform', (d) => `translate(${source.y},${source.x})`)
  //   //   .attr('fill-opacity', 0)
  //   //   .attr('stroke-opacity', 0);

  //   // Update the links…
  //   // const link = this.gLink.selectAll('path').data(links, (d: Unknown) => d.target.id);

  //   // //
  //   // const diagonal = this.diagonal;

  //   // Enter any new links at the parent's previous position.
  //   // const linkEnter = link
  //   //   .enter()
  //   //   .append('path')
  //   //   .attr('d', (d) => {
  //   //     const o = { x: source.x0, y: source.y0 };
  //   //     return diagonal({ source: o, target: o } as Unknown);
  //   //   });

  //   // Transition links to their new position.
  //   // link
  //   //   .merge(
  //   //     linkEnter as unknown as
  //   //       | Selection<BaseType, HierarchyLink<Plot | undefined>, SVGGElement, undefined>
  //   //       | TransitionLike<BaseType, HierarchyLink<Plot | undefined>>
  //   //   )
  //   //   .transition(transition as unknown as string)
  //   //   .attr('d', diagonal as Unknown);

  //   // // Transition exiting nodes to the parent's new position.
  //   // link
  //   //   .exit()
  //   //   .transition(transition as unknown as string)
  //   //   .remove()
  //   //   .attr('d', (d) => {
  //   //     const o = { x: source.x, y: source.y };
  //   //     return diagonal({ source: o, target: o } as Unknown);
  //   //   });

  //   // // Stash the old positions for transition.
  //   // this.base.eachBefore((d) => {
  //   //   d.x0 = d.x;
  //   //   d.y0 = d.y;
  //   // });
  // }

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
