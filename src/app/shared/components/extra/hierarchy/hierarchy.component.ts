import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, WritableSignal, input, signal, HostListener } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
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
interface RootType extends HierarchyNode<PlotContent> {
  x: Unknown;
  index: number;
  x0?: number;
  y0?: number;
  y?: number;
  node?: {
    width: number;
    height: number;
  };
  // index: number;
  // x0: Unknown;
  // y0: Unknown;
  // x: Unknown;
  // y: Unknown;
  _children?: RootType[];
  // children?: RootType;
}

@Component({
  imports: [JsonPipe, NodeFormComponent, CommonModule],
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss'],
})
export class HierarchyComponent implements OnInit, OnDestroy {
  @ViewChild('D3HierarchyInputRef') D3HierarchyInputRef?: ElementRef;
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
  margin = { top: 20, right: 90, bottom: 30, left: 90 };
  width = 1060 - this.margin.left - this.margin.right;
  height = 1000 - this.margin.top - this.margin.bottom;
  createSvg: any = svg;

  // Specify the charts’ dimensions. The height is variable, depending on the layout.
  // width = 928;
  marginTop = 10;
  marginRight = 10;
  marginBottom = 10;
  marginLeft = 40;

  // declares a tree layout and assigns the size
  // Controls the look of the graph/D3-table
  treeMap: TreeLayout<unknown | any> = tree().size([this.height, this.width]);
  // treeMap: d3.TreeLayout<unknown> = d3.tree().size([this.width, this.height]);

  duration = 750;
  padding = 1;
  i = 0;

  // Rows are separated by dx pixels, columns by dy pixels. These names can be counter-intuitive
  // (dx is a height, and dy a width). This because the tree must be viewed with the root at the
  // “bottom”, in the data domain. The width of a column is based on the tree’s height.
  // root = d3.hierarchy(data);
  container: Selection<BaseType, unknown, HTMLElement, any> | undefined;
  base: RootType | undefined;
  nodes: HierarchyPointNode<any>[] | undefined;
  dx: number | undefined;
  dy: number | undefined = this.width / this.padding;
  // declares a tree layout and assigns the size
  // Controls the look of the graph/D3-table
  tree: TreemapLayout<unknown | any> | undefined;
  // diagonal: Link<Unknown, DefaultLinkObject, Unknown> | undefined = linkHorizontal()
  //   .x((d: Unknown) => d.y)
  //   .y((d: Unknown) => d.x);
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
  links?: HierarchyPointNode<any>[];
  rectHeight: number = 80;
  rectWidth: number = 200;

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
      console.log('on window resize using target', { event });
      this.innerWidth = (target as Window).innerWidth - this.navBarWidth * 4;
      this.innerHeight = (target as Window).innerHeight;
    }

    if (!target && (event as unknown as HTMLElement)?.clientWidth && (event as unknown as HTMLElement)?.clientHeight) {
      console.log('on window resize using non-target', { event });
      this.innerWidth = (event as unknown as HTMLElement)?.clientWidth - this.navBarWidth * 4;
      this.innerHeight = (event as unknown as HTMLElement)?.clientHeight;
    }

    console.log('inner width', this.innerWidth);
    console.log('inner height', this.innerHeight);
    this.resizeCanvas();
    this.isMobile = this.innerWidth < this.mobileWidth;
  }

  init() {
    const content = this.plot();
    this.container = d3.select(this.HierarchyElement);
    // Create the SVG container, a layer for the links and a layer for the nodes.
    this.svg = this.container
      .append('svg')
      .attr('id', this.boardId)
      .attr('width', this.width + this.margin.right + this.margin.left)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12);

    // declares a tree layout and assigns the size
    this.treeMap = d3
      .tree()
      .size([this.height, this.width])
      .separation(function (a, b) {
        return (a.parent == b.parent ? 2 : 1) / a.depth; // Example: more separation for deeper levels
      });

    // Assigns parent, children, height, depth
    this.base = d3.hierarchy(content?.content, (d) => d?.children) as RootType;
    // this.base.sort((a, b) => d3.descending(a.height, b.height));
    this.base.x0 = this.height / 2;
    this.base.y0 = 0;

    // Collapse after the second level
    this.base.children?.forEach((child: RootType) => {
      return this.collapse(child);
    });

    this.render(null, this.base, this.svg);
  }

  render(event: any, source: RootType, cSVG: CanvasSelection) {
    if (!this.base || !this.svg || !this.container) {
      return;
    }
    // Assigns the x and y position for the nodes
    const treeData = this.treeMap(this.base);

    // Compute the new tree layout.
    this.nodes = treeData.descendants();
    this.links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    // Attach node width and height.
    this.nodes.forEach((d: HierarchyPointNode<any>) => {
      d.data.node = { width: this.rectWidth, height: this.rectHeight };
      d.y = d.depth * 180;
    });

    // Update the nodes...
    const node = this.svg
      .append('g')
      .selectAll('g')
      .data(this.nodes, (d: Unknown, i: number) => {
        return i;
      });

    // Enter any new modes at the parent's previous position.
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'graph__node')
      .attr('transform', function (d) {
        // console.log('transform node d', d);
        // if (d.depth > 1) {
        //   return 'translate(' + (d.y + 50) + ',' + d.x + ')';
        // }
        return 'translate(' + d.y + ',' + d.x + ')';
      })
      .attr('cursor', 'pointer')
      .on('click', (pointer: PointerEvent, d: HierarchyPointNode<RootType & PlotContent>) => this.openNode(pointer, d));

    nodeEnter
      .append('rect')
      .attr('class', 'node')
      .attr('width', (d) => d.data.node.width)
      .attr('height', (d) => d.data.node.height)
      .attr('x', 0)
      .attr('y', (d) => (d.data.node.height / 2) * -1)
      .attr('rx', '5')
      .style('fill', function (d) {
        return d.data.fill ?? '#fff';
      });

    nodeEnter
      .append('rect')
      .attr('class', 'node__create-button')
      .attr('width', (d) => (d.depth > 0 ? 20 : 0))
      .attr('height', (d) => (d.depth > 0 ? 20 : 0))
      .attr('x', (d) => (d.depth > 0 ? (d?.data?.node?.width ? d.data.node.width + 10 : 0) : 0))
      .attr('y', (d) => (d.depth > 0 ? (d.data.node.height / 2) * -1 : 0))
      .attr('rx', '5')
      .attr('cursor', (d) => (d.depth > 0 ? 'pointer' : 'default'))
      .style('fill', 'green')
      .on('click', (pointer: PointerEvent, d: HierarchyPointNode<RootType & PlotContent>) => this.createNode(pointer, d));

    nodeEnter
      .append('rect')
      .attr('class', 'node__delete-button')
      .attr('width', (d) => (d.depth > 0 ? 20 : 0))
      .attr('height', (d) => (d.depth > 0 ? 20 : 0))
      .attr('x', (d) => (d.depth > 0 ? (d?.data?.node?.width ? d.data.node.width + 10 : 0) : 0))
      .attr('y', (d) => (d.depth > 0 ? ((d.data.node.height / 3) * -1) + 20 : 0))
      .attr('rx', '5')
      .attr('cursor', (d) => (d.depth > 0 ? 'pointer' : 'default'))
      .style('fill', 'red')
      .on('click', (pointer: PointerEvent, d: HierarchyPointNode<RootType & PlotContent>) => {
        this.deleteNode(pointer, d);
      });

    // Add labels for the nodes
    nodeEnter
      .append('text')
      .attr('class', 'node__text')
      .attr('dy', '-.35em')
      .attr('x', () => 13)
      .attr('text-anchor', () => 'start')
      .text(function (d) {
        return d.data.name;
      })
      .append('tspan')
      .attr('dy', '1.75em')
      .attr('x', function (d) {
        return 13;
      })
      .attr('font-size', 11)
      .text(function (d: HierarchyPointNode<RootType & PlotContent>) {
        const textLimit = 32;
        if (d.data.description && d.data.description.length > textLimit) {
          return d.data.description?.slice(0, textLimit) + '...';
        } else if (d.data.description && d.data.description.length < textLimit) {
          return d.data.description;
        }

        return 'No description provided.';
      });

    // Remove any exiting nodes
    var nodeExit = node
      .exit()
      .transition()
      .duration(this.duration)
      .attr('transform', function (d) {
        return 'translate(' + source.y + ',' + source.x + ')';
      })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle').attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text').style('fill-opacity', 1e-6);

    // Update the links...
    const link = this.svg
      .selectAll('path.link')
      .data(this.links, (d: Unknown) => {
        return d.id;
      })
      .enter()
      .insert('path', 'g')
      .attr('data-type', 'node__link')
      .attr('class', 'link')
      .attr('d', (d) => {
        // var o = { x: source.x0, y: source.y0 } as HierarchyPointNode<RootType>;
        return this.curvedDiagonal(d, d.parent);
      })
      .attr('stroke', 'black')
      // with multiple points defined, if you leave out fill:none,
      // the overlapping space defined by the points is filled with
      // the default value of 'black'
      .attr('fill', 'none');

    // Remove any exiting links
    link
      .exit()
      .transition()
      .duration(this.duration)
      .attr('d', (d) => {
        const o = { x: source.x, y: source.y } as HierarchyPointNode<RootType>;
        return this.curvedDiagonal(o, o);
      })
      .remove();

    // Calculate max x and y to determine required SVG dimensions
    const maxX = d3.max(this.nodes, (d) => d.y + (d.data.node.width || 0)); // Adjust based on node size if applicable
    const maxY = d3.max(this.nodes, (d) => d.x + (d.data.node.height || 0)); // Adjust based on node size if applicable

    // Set SVG width and height
    this.svg.attr('width', maxX + this.margin.right + this.margin.left).attr('height', maxY + this.margin.top + this.margin.bottom);

    // Store the old positions for transition.
    this.nodes.forEach((d: HierarchyPointNode<RootType>) => {
      d.data.x0 = d.x;
      d.data.y0 = d.y;
    });

    console.log('render complete');

    // Access the native DOM element
    // const element = this.D3HierarchyInputRef?.nativeElement;
    // Size canvas
    // this.onWindowResize(element);
  }

  // Collapse the node and all it's children
  collapse(d: RootType) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(this.collapse);
    }
  }

  // Creates a curved (diagonal) path from parent to the child nodes
  curvedDiagonal(s: HierarchyPointNode<any>, d: HierarchyPointNode<any> | null) {
    const path = `M ${s.y} ${s.x}
            C ${(s.y + (d?.y ?? 0)) / 2} ${s.x},
              ${(s.y + (d?.y ?? 0)) / 2} ${d?.x ?? 0},
              ${d?.y ?? 0} ${d?.x ?? 0}`;

    return path;
  }

  clear() {
    console.log('clear function called');
    select(this.HierarchyElement).selectAll('*').remove();
  }

  openNode(pointer: PointerEvent, node: HierarchyPointNode<RootType & PlotContent>) {
    console.log('open node', node);

    // find node in database
    // open overlay with the relevant information.
  }

  deleteNode(pointer: PointerEvent, d: HierarchyPointNode<RootType & PlotContent>) {
    console.log('delete node', d);
    // find node by id in database
    // remove node from database
    // render
  }

  createNode(pointer: PointerEvent, d: HierarchyPointNode<RootType & PlotContent>) {
    console.log('create node', d);
    // find node by id in database
    // open pop up. take in information.
    // append node to database. use parent as
    // render diagram
  }

  resizeCanvas() {
    if (!this.svg || !this.nodes || !this.treeMap) {
      console.log('resize canvas failure');
      return;
    }
    const { top, bottom, left, right } = this.margin;
    // console.log('resize canvas - svg', this.svg);
    // this.svg.attr('width', this.width - left - right).attr('height', this.height - top - bottom);

    // Calculate max x and y to determine required SVG dimensions
    const maxX = d3.max(this.nodes, (d) => d.y + (d.data.node.width || 0)); // Adjust based on node size if applicable
    const maxY = d3.max(this.nodes, (d) => d.x + (d.data.node.height || 0)); // Adjust based on node size if applicable

    // Set SVG width and height
    this.svg.attr('width', maxX + right + left).attr('height', maxY + top + bottom);
    this.treeMap.size([maxX, maxY]);
  }

  generateSVG = (): Selection<SVGGElement, unknown, HTMLElement, any> | undefined | void => {
    // Not implemented.
    return
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

  /**
   * Node event. Add a child node to selected node.
   */
  addNode(event: any, d: HierarchyNode<any>): void {
    console.log("function call add node, d:", d);

    this.plotService.selectInstance({
      instance: {
        id: uuid.v4(),
        name: "Name of node",
        description: "Description of node",
        children: undefined,
      },
      parentInstanceId: d.data.id
    });
  }

  /**
   * Node event. Remove node from graph.
   */
  removeNode(event: any, d: HierarchyNode<Plot>): void {
    if (this.storyEditor) {
      this.storyEditor.removeNode(d.data.id);
      // Note: update graph
      this.initialiseComponent(true);
    } else {
      this.notificationService.notifyUser("Point to could not be removed. Graph has errored out.");
    }
  }

  /**
   * Node event. Edit node on graph
   */
  editNode(event: any, d: any): void {
    this.plotService.selectInstance({
      instance: d.data,
    });
  }
}
