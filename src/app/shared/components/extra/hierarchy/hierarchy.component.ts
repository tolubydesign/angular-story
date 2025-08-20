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
  // _children?: RootType[];
  // children?: RootType;
}

@Component({
  imports: [JsonPipe, NodeFormComponent, NgIf, CommonModule],
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss'],
})
export class HierarchyComponent implements OnInit, OnDestroy {
  generateSVG() {
    throw new Error('Method not implemented.');
  }
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
  margin = { top: 20, right: 90, bottom: 30, left: 90 };
  width = 960 - this.margin.left - this.margin.right;
  height = 500 - this.margin.top - this.margin.bottom;
  createSvg: any = svg;

  // Specify the charts’ dimensions. The height is variable, depending on the layout.
  // width = 928;
  marginTop = 10;
  marginRight = 10;
  marginBottom = 10;
  marginLeft = 40;

  // declares a tree layout and assigns the size
  // Controls the look of the graph/D3-table
  treeMap: TreeLayout<unknown | any> = tree();
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
  rectHeight?: number;
  rectWidth?: number;

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
    console.log('generate SVG function called');

    const content = this.plot();
    this.container = d3.select(this.HierarchyElement);
    // Create the SVG container, a layer for the links and a layer for the nodes.
    this.svg = this.container
      .append('svg')
      .attr('id', this.boardId)
      .attr('width', this.width + this.margin.right + this.margin.left)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('font-family', 'sans-serif')
      .attr('font-size', 16);

    // declares a tree layout and assigns the size
    this.treeMap = d3.tree().size([this.height, this.width]);

    // Assigns parent, children, height, depth
    this.base = d3.hierarchy(content?.content, (d) => d?.children) as RootType;
    // this.base.sort((a, b) => d3.descending(a.height, b.height));
    this.base.x0 = this.height / 2;
    this.base.y0 = 0;

    // Collapse the node and all it's children
    function collapse(d: any) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    // Collapse after the second level
    this.base.children?.forEach(collapse);

    this.render(null, this.base, this.svg);
  }

  render(event: any, source: RootType, cSVG: CanvasSelection) {
    if (!this.base || !this.svg) {
      return;
    }
    // Assigns the x and y position for the nodes
    var treeData = this.treeMap(this.base);

    // Compute the new tree layout.
    this.nodes = treeData.descendants();
    this.links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    this.nodes.forEach(function (d) {
      d.y = d.depth * 180;
    });

    // Update the nodes...
    const node = this.svg.selectAll('g.node').data(this.nodes, function (d: Unknown, i: number) {
      return d.id || (d.id = ++i);
    });

    // Enter any new modes at the parent's previous position.
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', function (d) {
        return 'translate(' + source.y0 + ',' + source.x0 + ')';
      })
      .on('click', this.click);

    this.rectHeight = 60;
    this.rectWidth = 120;

    nodeEnter
      .append('rect')
      .attr('class', 'node')
      .attr('width', this.rectWidth)
      .attr('height', this.rectHeight)
      .attr('x', 0)
      .attr('y', (this.rectHeight / 2) * -1)
      .attr('rx', '5')
      .style('fill', function (d) {
        return d.data.fill;
      });

    // Add labels for the nodes
    nodeEnter
      .append('text')
      .attr('dy', '-.35em')
      .attr('x', function (d) {
        return 13;
      })
      .attr('text-anchor', function (d) {
        return 'start';
      })
      .text(function (d) {
        return d.data.name;
      })
      .append('tspan')
      .attr('dy', '1.75em')
      .attr('x', function (d) {
        return 13;
      })
      .text(function (d) {
        return d.data.subname;
      });

    // UPDATE Delete below
    const nodeUpdate = nodeEnter.merge(node as Unknown);

    // Transition to the proper position for the node
    nodeUpdate
      .transition()
      .duration(this.duration)
      .attr('transform', function (d) {
        return 'translate(' + d.y + ',' + d.x + ')';
      });

    // Update the node attributes and style
    nodeUpdate
      .select('circle.node')
      .attr('r', 10)
      .style('fill', function (d) {
        return d.children ? 'lightsteelblue' : '#fff';
      })
      .attr('cursor', 'pointer');

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
    var link = this.svg.selectAll('path.link').data(this.links, (d: Unknown) => {
      return d.id;
    });

    // Enter any new links at the parent's previous position.
    var linkEnter = link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('d', (d) => {
        var o = { x: source.x0, y: source.y0 };
        return this.curvedDiagonal(o, o);
      });

    // UPDATE Delete bellow
    var linkUpdate = linkEnter.merge(link as Unknown);

    // Transition back to the parent element position
    linkUpdate
      .transition()
      .duration(this.duration)
      .attr('d', (d) => {
        return this.curvedDiagonal(d, d.parent);
      });

    // Remove any exiting links
    var linkExit = link
      .exit()
      .transition()
      .duration(this.duration)
      .attr('d', (d) => {
        var o = { x: source.x, y: source.y };
        return this.curvedDiagonal(o, o);
      })
      .remove();

    // Store the old positions for transition.
    this.nodes.forEach((d: HierarchyPointNode<any> | any) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  click() {
    console.log('click');
  }

  // Creates a curved (diagonal) path from parent to the child nodes
  curvedDiagonal(s: Unknown, d: Unknown) {
    const path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;

    return path;
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
