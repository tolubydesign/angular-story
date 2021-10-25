import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from "d3";
import * as dataJson from '../../../../../assets/data/dendrogram.json';

@Component({
  selector: 'app-dendrogram',
  templateUrl: './dendrogram.component.html',
  styleUrls: ['./dendrogram.component.scss']
})
export class DendrogramComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // this.renderTreeChart();
    this.createCanvas().then(() => this.drawDiagram()); 
  }

  private svg;
  private root;
  private nodes = [];
  private duration = 400;
  private diagonal = d3.linkHorizontal().x((d: any) => { return d.y; }).y((d: any) => { return d.x; });
  private graphIndex = 0
  // @ViewChild('chart2', { static: true }) private chartContainer: ElementRef;
  data: any = (dataJson as any).default;
  margin = { top: 50, bottom: 50, right: 10, left: 20 };
  barHeight = 20;
  width = 960;
  barWidth = (this.width - this.margin.left - this.margin.right) * 0.8;
  // this.nodes.length *
  private height = Math.max(500, this.barHeight + this.margin.top + this.margin.bottom);
  // element: any = this.chartContainer.nativeElement;

  async createCanvas() {
    return this.svg = d3.select("figure#dendrogram")
      .append("svg")
      .attr("width", this.width + (this.margin.top * 2))
      .attr("height", this.height + (this.margin.top * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  drawDiagram() {
    // console.log("(drawDiagram)", this.svg);
 
    this.root = d3.hierarchy(this.data);
    this.root.x0 = 0;
    this.root.y0 = 0;
    this.moveChildren(this.root);
    this.update(this.root);
  }

  /**
   * Recursive function to get the nodes for the graph
   * @param node in some cases the root graph
   */
  moveChildren(node) {
    console.log("(moveChildren)", node);
    if (node.children) {
      node.children.forEach((c) => this.moveChildren(c));
      node._children = node.children;
      node.children = null;
    }
  }

  // code https://github.com/AnandanSelvaganesan/angular-d3-tree
  renderTreeChart() {
    this.graphIndex = 0;

    this.svg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + (this.margin.top * 2))
      .attr("height", this.height + (this.margin.top * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");


    this.root = d3.hierarchy(this.data);
    this.root.x0 = 0;
    this.root.y0 = 0;
    moveChildren(this.root);
    this.update(this.root);

    // https://stackoverflow.com/questions/19423396/d3-js-how-to-make-all-the-nodes-collapsed-in-collapsible-indented-tree
    function moveChildren(node) {
      if (node.children) {
        node.children.forEach(function (c) { moveChildren(c); });
        node._children = node.children;
        node.children = null;
      }
    }
  }

  /** 
   * Toggle children on click.
   * @param d event click 
   */
  graphClick(d) {
    console.log("(graphClick)", d);
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    return this.update(d);
  }

  /**
   * set node color 
   * @param d 
   */
  color(d) {
    return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
  }

  /** 
   * @param source 
   */
  update(source) {
    console.log("(update)", source, this.root);

    // Compute the flattened node list.
    this.nodes = this.root.descendants();

    d3.select("svg").transition()
      .duration(this.duration)
      .attr("height", this.height);

    d3.select(self.frameElement).transition()
      .duration(this.duration)
      .style("height", this.height + "px");

    // Compute the "layout". TODO https://github.com/d3/d3-hierarchy/issues/67
    let index = -1;
    this.root.eachBefore((n) => {
      console.log("this.root.eachBefore", n);
      n.x = ++index * this.barHeight;
      n.y = n.depth * 20;
    });

    // Update the nodes…
    let node = this.svg.selectAll(".node")
      .data(this.nodes, (d: any) => d.id || (d.id = ++this.graphIndex));

    let nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .style("opacity", 0);


    // Enter any new nodes at the parent's previous position.
    nodeEnter.append("rect")
      .attr("y", - this.barHeight / 2)
      .attr("height", this.barHeight)
      .attr("width", this.barWidth)
      .style("fill", (event) => this.color(event))
      .on("click", (d) => this.graphClick(d));

    nodeEnter.append("text")
      .attr("dy", 5)
      .attr("dx", 5.5)
      .text(function (d: any) { return d.data.name; });

    // Transition nodes to their new position.
    nodeEnter.transition()
      .duration(this.duration)
      .attr("transform", function (d: any) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1);

    node.transition()
      .duration(this.duration)
      .attr("transform", function (d: any) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1)
      .select("rect")
      .style("fill", this.color);

    // Transition exiting nodes to the parent's new position.
    node.exit().transition()
      .duration(this.duration)
      .attr("transform", function (d: any) { return "translate(" + source.y + "," + source.x + ")"; })
      .style("opacity", 0)
      .remove();

    // Update the links…
    var link = this.svg.selectAll(".link")
      .data(this.root.links(), function (d: any) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .style('fill', 'none')
      .style('stroke', '#ccc')
      .style('stroke-width', '2px')
      .attr("d", function (d) {
        var o = { x: source.x0, y: source.y0 };
        return this.diagonal(<any>{ source: o, target: o });
      })
      .transition()
      .duration(this.duration)
      .attr("d", this.diagonal);

    // Transition links to their new position.
    link.transition()
      .duration(this.duration)
      .attr("d", this.diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(this.duration)
      .attr("d", function (d) {
        var o = { x: source.x, y: source.y };
        return this.diagonal(<any>{ source: o, target: o });
      })
      .remove();


    // Stash the old positions for transition.
    this.root.each(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

}
