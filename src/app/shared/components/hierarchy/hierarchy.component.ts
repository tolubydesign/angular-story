import { PlotService } from '@services/plot/plot.service';
import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import { HierarchyNode, Selection, svg } from "d3";
import { BehaviorSubject, Falsy, Subscription } from 'rxjs';
import { Plot } from '@models/plot';

@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss']
})
export class HierarchyComponent implements OnInit {

  constructor(private plotService: PlotService) { }
  name = "d3-hierarchy";
  HierarchyElement = `div#${this.name}`;
  // ************** Generate the tree diagram	 *****************
  width = 1100;
  height = 500;
  createSvg: any = svg;

  margin = { top: 100, right: 50, bottom: 100, left: 50 };
  // viewerWidth = this.width - this.margin.left - this.margin.right;
  // viewerHeight = this.height - this.margin.top - this.margin.bottom;

  // append the svg object to the body of the page
  svg: Selection<any, any, HTMLElement, any> | undefined = undefined;
  // svg: Selection<Element, any, HTMLElement, any> = undefined;
  graph: Selection<any, any, HTMLElement, any> | undefined = undefined;

  duration = 750;
  i = 0;
  root: HierarchyNode<any> | undefined | null | { children: any[], x0: any, y0: any } | any = {
    children: [], x0: 0, y0: 0
  };

  // declares a tree layout and assigns the size
  treeMap = d3.tree().size([this.height, this.width]);

  // SUBSCRIBER.
  hierarchySubscriber: Subscription | undefined = undefined;

  ngOnInit(): void {
    // Get information from store.
    this.InitialiseComponent();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    // Unsubscribe
    this.hierarchySubscriber?.unsubscribe
  }

  InitialiseComponent() {
    console.log("fn:InitialiseComponent");
    this.root = null

    this.plotService.storySubject.subscribe((v) => {
      console.log(`observer: ${v}`);
      if (v && v.content) {
        // Initialise d3 hierarchy graph.
        this.root = d3.hierarchy(v.content, (d) => d.children);
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.createCanvas().then(() => this.initialize());
      }
    })

    // this.hierarchySubscriber = this.plotService.storySubject.subscribe({
    //   next: (v: Plot | undefined): void => {
    //   },
    // });
  }


  /**
   * Function creates svg graph
   * @returns svg ; the graph and attaching it to a local value
   */
  async createCanvas() {
    // append the svg object to the body of the page
    this.svg = d3
      .select(this.HierarchyElement)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      // .attr("width", this.width + this.margin.right + this.margin.left)
      // .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );

    return;
  }

  initialize() {
    console.log("fn:initialize")
    // if (this.root) return;

    if (!this.root) {
      // Collapse after second level
      this.root.children.forEach(this.collapse);
      this.root.x0 = 0;
      this.root.y0 = 0;
    }

    if (this.root) this.update(this.root);
  }

  // Collapse the node and all it's children
  collapse(d: any) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(this.collapse);
      d.children = null;
    }
  }

  // (function) Toggle children on click.
  click(event: any, d: any) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }

    console.log("function click", d);
  }

  update(source: any) {

    if (!this.root) return;
    // Assigns the x and y position for the nodes
    // var treeData = this.flexLayout(this.root);

    // Assigns the x and y position for the nodes
    const treeData = this.treeMap(this.root);

    // Compute the new tree layout.
    let nodes = treeData.descendants();
    let links = treeData.descendants().slice(1);

    // ****************** Nodes section ***************************
    // Update the nodes...
    if (!this.svg) {
      console.warn("Error occurred. this.svg = unknown");
      new Error("(this) Graph");
      return;
    }

    // Normalize for fixed-depth.
    // Line below determines the height difference between rows.
    nodes.forEach((d) => {
      return (d.y = d.depth * 120);
    });

    // Declare the nodes…
    // let node: any = this.svg.selectAll(`#${this.name} g.node`).data(nodes, (d: any) => { return d.id || (d.id = ++this.i) });
    let node: any = this.svg.selectAll(`g.node`).data(nodes, (d: any) => {
      return d.id || (d.id = ++this.i);
    });

    // Enter any new modes at the parent's previous position.
    let nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => {
        return "translate(" + d.x + "," + d.y + ")";
        // return "translate(" + source.x + "," + source.y + ")";
      })
      .on("click", this.click);

    // Add Circle for the nodes
    nodeEnter
      .append("circle")
      .attr("r", 20)
      .attr("stroke", "steelblue")
      .style("fill", (d: any) => {
        return d.children ? "lightsteelblue" : "#fff";
      })
      .attr("stroke-width", "3px;");

    // Add labels to nodes
    nodeEnter
      .append("text")
      .attr("pointer-events", "none")
      // .attr("y", (d: any) => {
      //   return d.children || d._children ? -18 : 18;
      // })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text((d: any) => {
        return d.data.name;
      })
      .style("fill-opacity", 1)
      .attr("text-anchor", "middle")
      .attr("fill", "#000")
      .style("font", "12px sans-serif");

    /** UPDATE (DON'T REALLY KNOW WHAT) */
    // // ****************** links section ***************************
    // Update the links...
    // Declare the links…
    let link = this.svg
      .selectAll("path.link")
      // .data(links, (d: any) => {
      //   return d.id ? d.id : d.target.id;
      // });
      .data(links, (d: any) => {
        return d.id ? d.id : d.target.id;
      });

    // Enter the links.
    link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("stroke", "black")
      .attr("fill", "transparent")

      // .attr('d', this.diagonal)
      // .attr('d', d3.linkVertical())
      .attr("d", (d: any, al: any) => {
        // console.log("link.enter():(d|al|le)", {d}, {al});
        return this.diagonal(d.parent ? d.parent : source, d) as any;
      });
  }

  // Creates a curved (diagonal) path from parent to the child nodes
  diagonal(s: any, d: any) {
    const path = `M ${s.x} ${s.y} C ${(s.x + d.x) / 2} ${s.y}, ${(s.x + d.x) / 2
      } ${d.y}, ${d.x} ${d.y}`;
    return path;
  }

}
