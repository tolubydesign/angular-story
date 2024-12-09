import { PlotService } from '@services/plot/plot.service';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import * as d3 from "d3";
import { HierarchyNode, Selection, svg, drag, ValueFn } from "d3";
import { BaseType } from 'd3-selection';
import { Falsy, Subscription } from 'rxjs';
import { Plot, PlotContent } from '@models/plot';
import StoryEditor from "@lib/story-editor";
import * as uuid from "uuid";
import { StoriesService } from '@services/stories.service';
import { NotificationService } from '@services/notification.service';
import { NodeFormComponent } from '../../editor-mode/node-form/node-form.component';

type RootType = HierarchyNode<Plot | Falsy> | undefined | null | { children: any[], x0: any, y0: any } | any;

@Component({
    imports: [JsonPipe, NodeFormComponent, NgIf, CommonModule],
    selector: 'app-hierarchy',
    templateUrl: './hierarchy.component.html',
    styleUrls: ['./hierarchy.component.scss']
})
export class HierarchyComponent implements OnInit, OnDestroy {

  // Note.
  // `plot` is a is a "prop" 
  // TODO: [optional] rename `plot` to `narrative`
  @Input({required: true}) plot?: Plot = undefined;
  @ViewChild('D3HierarchyInputRef') D3HierarchyInputRef: ElementRef | undefined;
  private _HierarchySubscriber?: Subscription;

  mutatedPlot?: Plot;

  constructor(
    private plotService: PlotService,
    private storiesService: StoriesService,
    private notificationService: NotificationService,
  ) { }

  storyEditor?: StoryEditor;
  private _editedSubscription?: Subscription;
  narrativeEdited?: boolean;
  graphRefreshed: boolean = false;
  name = "d3-hierarchy";
  HierarchyElement = `div#${this.name}`;

  ngOnInit(): void {
    if (this.plot) {
      this.storyEditor = new StoryEditor(this.plot.id, this.plot);

      if (!this.storyEditor) return this.notificationService.notifyUser("Board couldn't be made.");
      if (this.storyEditor?.errorMessage) return this.notificationService.notifyUser(this.storyEditor.errorMessage)

      this._editedSubscription = this.storyEditor.edited.subscribe((state: boolean) => {
        this.narrativeEdited = state
      });
    }

    this.initialiseComponent();
  }

  ngOnDestroy(): void {
    this._HierarchySubscriber?.unsubscribe();
    this._editedSubscription?.unsubscribe();
  }

  // ************** Generate the tree diagram	 ***************** //
  width = 2500;
  height = 2000;
  createSvg: any = svg;

  // declares a tree layout and assigns the size
  // Controls the look of the graph/D3-table
  treeMap: d3.TreeLayout<unknown> = d3.tree().size([this.width, this.height]);

  margin = { top: 100, right: 50, bottom: 100, left: 50 };
  // viewerWidth = this.width - this.margin.left - this.margin.right;
  // viewerHeight = this.height - this.margin.top - this.margin.bottom;
  duration = 750;
  i = 0;
  root: RootType = {
    children: [], x0: 0, y0: 0
  };

  // append the svg object to the body of the page
  svg: Selection<SVGGElement, HierarchyNode<PlotContent> | unknown, HTMLElement, any> | undefined = undefined;
  // svg: Selection<Element, any, HTMLElement, any> = undefined;

  // Node related
  nodeEnterRectWidth = 42;
  nodeEnterRectHeight = this.nodeEnterRectWidth;
  nodeEnterRectRepoX = (this.nodeEnterRectWidth - (this.nodeEnterRectWidth * 2)) / 2;
  nodeEnterRectRepoY = (this.nodeEnterRectHeight - (this.nodeEnterRectHeight * 2)) / 2;

  /**
   * @description Get information from store. Start up D3 graph.
   * @returns
   */
  initialiseComponent(updatingGraph: boolean = false): void {
    this.root = null;
    const proxy = this.storyEditor?.boardProxy;
    // NOTE: if the new id is different to the session storage id. Go with the new id.    
    const sessionStorageId: string | undefined = proxy?.story?.id;
    const sessionStoragePlot: Plot | undefined = proxy?.story;
    const plotIdProp = this.plot?.id;

    if (!this.plot || !this.storyEditor) {
      this.notificationService.notifyUser("Plot or Story Editor can not be found.");
      console.warn("ERROR Story Editor:", this.storyEditor);
      console.warn("ERROR Plot:", this.plot);
      return;
    }

    if (plotIdProp !== sessionStorageId) {
      // Note.
      // Working with the prop-plot. There is a different plot to what has been stored.
      // Update session storage plot with prop-plot
      this.mutatedPlot = this.plot
    } else {
      // Initialise Editor
      this.plot = JSON.parse(JSON.stringify(sessionStoragePlot))
      this.mutatedPlot = this.plot;
    }

    this.buildD3Tree().then((canvas: Selection<SVGGElement, unknown, HTMLElement, any> | undefined | void) => {
      if (canvas && updatingGraph) this.graphRefreshed = true;
    })
  }

  /**
   * Sub-function - Initialise the D3 graph. This function will call the necessary function to create the D3 canvas and 
   * add the data needed to build the graph.
   * If there exists a graph. It will be wiped and reset.
   */
  buildD3Tree = async (): Promise<Selection<SVGGElement, unknown, HTMLElement, any> | undefined | void> => {
    // Initialise d3 hierarchy graph.
    // this.root = d3.hierarchy(this.mutatedPlot.content, (d) => d.children);

    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.treeMap.size();
    if (this.svg) {
      this.svg.remove();
      const SVG = document.getElementById("d3-svg");
      this.D3HierarchyInputRef?.nativeElement.removeChild(SVG);
    }

    const svg = await this.createCanvas();
    // Initialise d3 hierarchy graph.
    if (!this.mutatedPlot) return this.notificationService.notifyUser("Mutated plot is undefined.");

    this.root = d3.hierarchy(this.mutatedPlot.content, (d: PlotContent) => d.children);
    this.update(this.root);
    return svg;
  }

  /**
   * @description Create svg graph.
   * @returns svg graph
   */
  async createCanvas(): Promise<Selection<SVGGElement, unknown, HTMLElement, any>> {
    // this.treeMap = d3.tree().size([this.width, this.height]);

    // append the svg object to the body of the page
    return this.svg = d3.select(this.HierarchyElement)
      .append("svg")
      .attr("id", "d3-svg")
      .attr("width", this.width)
      .attr("height", this.height)
      // .attr("width", this.width + this.margin.right + this.margin.left)
      // .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );
  }

  /**
   * @description Initialise/Update/Rebuild data graph.
   * @param source RootType 
   * @returns 
   */
  update(source: RootType) {
    if (!source) {
      return this.notificationService.notifyUser("Graph board couldn't be updated.")
    };

    // Assigns the x and y position for the nodes
    const treeData = this.treeMap(source);

    let nodes: HierarchyNode<unknown>[] = treeData.descendants();
    let links: d3.HierarchyPointNode<unknown>[] = treeData.descendants().slice(1);

    // ****************** Nodes section ***************************
    // Update the nodes...
    if (!this.svg) {
      this.notificationService.notifyUser("Graph couldn't be built");
      return;
    }

    // Normalize for fixed-depth.
    // Line below determines the height difference between rows.
    nodes.forEach((d: any) => {
      return (d.y = d.depth * 120);
    });

    // Declare the nodes…
    // let node: any = this.svg.selectAll(`#${this.name} g.node`).data(nodes, (d: any) => { return d.id || (d.id = ++this.i) });
    let node: Selection<BaseType, HierarchyNode<unknown>, SVGGElement, unknown> = this.svg.selectAll(`g.node`).data(nodes, (d: any) => {
      return d.id || (d.id = ++this.i);
    });

    // Enter any new modes at the parent's previous position.
    let nodeEnter: Selection<SVGGElement, d3.HierarchyNode<unknown>, SVGGElement, unknown> = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => {
        return "translate(" + d.x + "," + d.y + ")";
        // return "translate(" + source.x + "," + source.y + ")";
      })
    // .call(drag)
    // .on("click", (a, b) => this.click(a, b));

    // Append various node elements
    this.createNodes(nodeEnter);

    /**
     * LABEL
     * Add labels to nodes.
     */
    nodeEnter.append("text")
      .attr("pointer-events", "none")
      // .attr("y", (d: any) => {
      //   return d.children || d._children ? -18 : 18;
      // })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("class", "node--text")
      .text((d: any) => d.data.name)
      .style("fill-opacity", 1)
      .attr("text-anchor", "middle")
      .attr("fill", "#000")
      .style("font-size", "10px")
      .style('font-family', '"Roboto-Mono", "Helvetica Neue", sans-serif');

    /** UPDATE (DON'T REALLY KNOW WHAT) */
    // // ****************** links section ***************************
    /**
     * Update the links...
     * Declare the links…
     */
    let link = this.svg
      .selectAll("path.link")
      // .data(links, (d: any) => {
      //   return d.id ? d.id : d.target.id;
      // });
      .data(links, (d: any) => {
        return d.id ? d.id : d.target.id;
      });

    // Enter the links.
    link.enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("stroke", "black")
      .attr("fill", "transparent")

      // .attr('d', this.diagonal)
      // .attr('d', d3.linkVertical())
      .attr("d", (d: any, al: any) => {
        return diagonal(d.parent ? d.parent : source, d) as any;
      });
  }

  /**
 * @description Node event
 * @param event 
 * @param d 
 */
  click(event: any, d: d3.HierarchyNode<Plot> | any) {
    // (function) Toggle children on click
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
  }

  /**
   * @description Node event. Add a child node to selected node.
   * @param { SVGRectElement } this
   * @param { * } event 
   * @param { HierarchyNode<unknown | Plot | PlotContent> } d 
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
   * @description Node event. Remove node from graph.
   * @param {any} event 
   * @param {HierarchyNode<Plot>} d 
   * @param {SVGRectElement} this
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
   * Save narrative data to Session Storage.
   */
  saveStateInSession() {
    if (!this.storyEditor) return this.notificationService.notifyUser("Board could not be saved. Graph board could not be accessed");

    const isSaved = this.storyEditor.boardProxy.saveSession();
    const story = this.storyEditor?.boardProxy?.story;

    if (!story) return this.notificationService.notifyUser("Board information couldn't be captured.");
    if (!isSaved) return this.notificationService.notifyUser("Changes could not be saved.");

    if (story && isSaved) {
      const { id, title, description, content } = story;

      this.storiesService.updateStoryRequest(
        { id, description, title, body: content },
      ).subscribe((response) => {
        this.graphRefreshed = !!response;
      });
    };
  }

  /**
   * @description Node event. Edit node on graph
   * @param { SVGRectElement } this
   * @param { * } event 
   * @param { HierarchyNode<unknown | Plot | PlotContent> } d
   */
  editNode(event: any, d: any): void {
    this.plotService.selectInstance({
      instance: d.data,
    });
  }

  /**
   * @description 
   * @param {d3.Selection} nodeEnter 
   */
  createNodes(nodeEnter: Selection<SVGGElement, d3.HierarchyNode<unknown>, SVGGElement, unknown>) {
    /**
     * CIRCLE.
     * Add Circle for the nodes.
     */
    // nodeEnter
    //   .append("circle")
    //   .attr("r", 20)
    //   .attr("stroke", "steelblue")
    //   .style("fill", (d: any) => {
    //     return d.children ? "lightsteelblue" : "#fff";
    //   })
    //   .attr("stroke-width", "3px;");

    /**
     * RECTANGLE
     * Replaces circle, above
     */
    nodeEnter.append('rect')
      .attr('width', this.nodeEnterRectWidth).attr('height', this.nodeEnterRectHeight).attr('stroke-width', '3px')
      // (below) reposition box/rectangle
      .attr("x", this.nodeEnterRectRepoX).attr('y', this.nodeEnterRectRepoY)
      .style('stroke', 'blue').style('fill', (d: any) => d.children ? "lightsteelblue" : "#fff")
      .attr('class', 'cursor-pointer')
      .attr('data-node-type', 'button-edit-node')
      .on("click", (event: any, d: HierarchyNode<unknown>) => {
        this.editNode(event, d);
      });

    /**
      * RECTANGLE
      * interactive button
      */
    // Add child node
    nodeEnter.append('rect')
      .attr('width', this.nodeEnterRectWidth / 3).attr('height', this.nodeEnterRectHeight / 3).attr('stroke-width', '2px')
      .attr('rx', 100)
      .attr("x", `${(this.nodeEnterRectWidth / 3) / 2}`).attr('y', this.nodeEnterRectWidth - 10)
      .style('fill', '#22a422')
      .attr('class', 'cursor-pointer')
      .attr('data-node-type', 'button-add-node')
      .on("click", (event: any, d: HierarchyNode<unknown>) => this.addNode(event, d));

    // to delete child node   
    nodeEnter.append('rect')
      .attr('width', this.nodeEnterRectWidth / 3).attr('height', this.nodeEnterRectHeight / 3).attr('stroke-width', '2px')
      .attr('rx', 100)
      .attr("x", `${-Math.abs((this.nodeEnterRectWidth) / 2)}`).attr('y', this.nodeEnterRectWidth - 10)
      .style('fill', 'rgb(123, 28, 28)')
      .attr('class', 'cursor-pointer')
      .attr('data-node-type', 'button-remove-node')
      .on("click", (event: any, d: HierarchyNode<unknown>) => this.removeNode(event, d as HierarchyNode<Plot>));

    // TODO: add icon or text inside of interactive button. Highlight that element is intractable
    // nodeEnter.append('text')
    // .attr('writing-mode', "tb")
    // .attr("x", `${-Math.abs((nodeEnterRectWidth / 3) / 2)}`).attr('y', nodeEnterRectWidth - 10)
    // .text('+')
  }

  updateNodeContent({ form }: { form: any }) {
    if (!this.storyEditor) return this.notificationService.notifyUser("Editor cant be found. No update was made.");
    if (!this.storyEditor?.getBoardProxyStory()) return this.notificationService.notifyUser("Editor Error board.");

    this.storyEditor.setNodeContent(form, undefined)

    // Note: update graph
    this.initialiseComponent(true);
  }

  addNodeContent({ form, parentNodeId }: { form: any, parentNodeId: string }) {
    if (!this.storyEditor) return this.notificationService.notifyUser("Editor cant be found. No update was made.");
    if (!this.storyEditor?.getBoardProxyStory()) return this.notificationService.notifyUser("Editor Error board.");

    // Update story editor
    this.storyEditor.appendAdditionalNodeContent(
      parentNodeId,
      form
    )

    // Note: update graph
    this.initialiseComponent(true);
  }
}

/**
 * @description Creates a curved (diagonal) path from parent to the child nodes
 * @param {any} s 
 * @param {any} d 
 * @returns {any} path
 */
function diagonal(s: any, d: any) {
  const path = `M ${s.x} ${s.y} C ${(s.x + d.x) / 2} ${s.y}, ${(s.x + d.x) / 2
    } ${d.y}, ${d.x} ${d.y}`;
  return path;
}

// const drag = {

//   function ondragstart() {
//     d3.select(this).attr("stroke", "black");
//   }

//   function dragged(event, d) {
//     d3.select(this).raise().attr("cx", d.x = event.x).attr("cy", d.y = event.y);
//   }

//   function dragended() {
//     d3.select(this).attr("stroke", null);
//   }

//   return d3.drag()
//       .on("start", dragstarted)
//       .on("drag", dragged)
//       .on("end", dragended);
// }