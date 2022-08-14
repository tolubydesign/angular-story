import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlotContent } from '@models/plot';
import * as d3 from "d3";
import { HierarchyNode, Selection, svg } from 'd3';
// import { treeData, flare } from "@models/tree-data.model";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-dendrogram',
  templateUrl: './dendrogram.component.html',
  styleUrls: ['./dendrogram.component.scss']
})
export class DendrogramComponent implements OnInit {
  /**
   * Example gathered and modified from: 
   * https://codesandbox.io/s/treemap-developer-forked-zrzcm?file=/src/Treemap/Treemap.tsx:3649-3652 && 
   * https://codesandbox.io/examples/package/@types/d3
   * 
   * https://bl.ocks.org/d3noob/8326869
   * https://observablehq.com/@bumbeishvili/vertical-collapsible-d3-flextree
   * 
   * https://codepen.io/VividD/pen/AbZbdx
   * 
   * https://typescript.hotexamples.com/examples/d3/-/tree/typescript-tree-function-examples.html
   * 
   */
  constructor(private sanitizer: DomSanitizer) { }

  treeData: any = ({
    "name": "A",
    "size": [100, 100],
    "children": [
      {
        "name": "BA",
        "size": [100, 50],
        "children": [
          { "name": "BAA", "size": [100, 50] },
          {
            "name": "BAB",
            "size": [100, 50],
            "children": [
              { "name": "BABA", "size": [100, 50] },
              { "name": "BABB", "size": [100, 50] }
            ]
          },
          { "name": "BAC", "size": [200, 50] },
        ]
      },
      {
        "name": "BB",
        "size": [100, 75],
        "children": [
          { "name": "BBA", "size": [50, 50] },
          { "name": "BBB", "size": [50, 50] }
        ]
      }
    ]
  })

  name = "d3-graph"
  d3Element = `svg#${this.name}`;

  // ************** Generate the tree diagram	 *****************
  width = 960;
  height = 500;
  createSvg: any = svg;

  margin = { top: 20, right: 40, bottom: 50, left: 75 };
  viewerWidth = this.width - this.margin.left - this.margin.right;
  viewerHeight = this.height - this.margin.top - this.margin.bottom;

  // append the svg object to the body of the page
  svg: Selection<any, any, HTMLElement, any> | undefined = undefined;
  // svg: Selection<Element, any, HTMLElement, any> = undefined;
  graph: Selection<any, any, HTMLElement, any> | undefined = undefined;

  duration = 750;
  i = 0;
  root: HierarchyNode<any> | any = d3.hierarchy(this.treeData, (d) => {
    return d.children;
  });


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.createCanvas().then(() => this.initialize());
  }

  // flexLayout = flextree.flextree();

  // declares a tree layout and assigns the size
  treeMap = d3.tree().size([this.height, this.width]);

  /**
   * Function creates svg graph
   * @returns svg ; the graph and attching it to a local value
   */
  async createCanvas() {
    // append the svg object to the body of the page
    this.svg = d3.select(this.d3Element)
      .append("svg")
      .attr("width", this.width + this.margin.right + this.margin.left)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    return
  }

  initialize() {
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
      d._children = d.children
      d._children.forEach(this.collapse)
      d.children = null
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

    console.log("click", d);
    // this.update(d);
  }

  update(source: any) {
    // Assigns the x and y position for the nodes
    // var treeData = this.flexLayout(this.root);

    // Assigns the x and y position for the nodes
    const treeData = this.treeMap(this.root);

    // Compute the new tree layout.
    let nodes = treeData.descendants();
    let links = treeData.descendants().slice(1);
    /** INITIAL ATTEMPT START */
    // Compute the new tree layout.
    // let nodes = this.treeMap.nodes(this.root).reverse()
    // let links = this.treeMap.links(nodes);
    /** END */

    // ****************** Nodes section ***************************

    // Update the nodes...
    if (!this.svg) {
      console.warn("Error occurred. this.svg = unknown");
      new Error('(this) Graph')
      return;
    }

    // Normalize for fixed-depth.
    nodes.forEach(function (d) { d.y = d.depth * 100; });


    // Declare the nodes…
    // var node = this.svg.selectAll(`#${this.name} g.node`).data(nodes, (d: any) => { return d.id || (d.id = ++this.i); });
    let node: any = this.svg.selectAll(`#${this.name} g.node`).data(nodes, (d: any) => { return d.id || (d.id = ++this.i) });

    // Enter any new modes at the parent's previous position.
    let nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", (d: any) => {
        return "translate(" + d.x + "," + d.y + ")";
        // return "translate(" + source.x + "," + source.y + ")";
      })
      .on('click', this.click);

    // Add Circle for the nodes
    nodeEnter.append("circle")
      .attr("r", 10)
      .style("fill", (d: any) => {
        return d.children ? "lightsteelblue" : "#fff";
      });

    nodeEnter.append("text")
      .attr("y", (d: any) => {
        return d.children || d._children ? -18 : 18;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text((d: any) => { return d.name; })
      .style("fill-opacity", 1);

    /** NEW */
    // Add labels for the nodes
    nodeEnter.append('text')
      .attr('pointer-events', 'none')
      .attr('dy', '0.35em')
      .text((d: any) => {
        return d.data.name;
      })
      .attr('text-anchor', 'middle')



    /** UPDATE (DON'T REALLY KNOW WHAT) */
    // 
    let nodeUpdate = nodeEnter.merge(node)
      .attr("fill", "#fff")
      .attr("stroke", "steelblue")
      .attr("stroke-width", "3px;")
      .style('font', '12px sans-serif')

    console.log("node update ", nodeUpdate)
    // Update the node attributes and style
    // NOT CRITICAL
    nodeUpdate.select('circle.node')
      .attr('r', 20)
      .style("fill", (d: any) => {
        console.log("node update ", d)
        return d.children ? "lightsteelblue" : "#fff";
      })
      .attr('cursor', 'pointer');

    // // ****************** links section ***************************

    // Update the links...
    // Declare the links…
    let link = this.svg.selectAll("path.link")
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
      .attr('stroke', 'black')
      .attr('fill', 'transparent')

      // .attr('d', this.diagonal)
      // .attr('d', d3.linkVertical())
      .attr('d', (d: any, al: any) => {
        // console.log("link.enter():(d|al|le)", {d}, {al});
        return this.diagonal(d.parent ? d.parent : source, d) as any
      })
  }

  // Creates a curved (diagonal) path from parent to the child nodes
  diagonal(s: any, d: any) {
    console.log("FN:diagonal:(s|d)", `M${s.x} ${s.y}  C${d ? (s.x + d.x) : ''} ${s.y}, ${d ? (s.x + d.x) / 2 : ''} ${d ? d.y : ''}, ${d ? d.x : ''} ${d ? d.y : ''}`)
    console.log("FN:diagonal:(s|d)", { s }, { d }, "\n");

    const path = `M ${s.x} ${s.y}     C ${(s.x + d.x) / 2} ${s.y}, ${(s.x + d.x) / 2} ${d.y}, ${d.x} ${d.y}`
    return path

    return d3.link(d3.curveBumpY)
      .x(d => d[0])
      .y(d => d[0]);

    return "M" + d.y + "," + d.x
      + "C" + (d.y + d.parent.y) / 2 + "," + d.x
      + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
      + " " + d.parent.y + "," + d.parent.x;


  }
}
