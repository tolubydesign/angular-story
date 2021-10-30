import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from "d3";
import { treeData } from "@models/tree-data.model";
// import {JSDOM} from "jsdom";
// import {select, selectAll} from "d3-selection";
// import {geoPath} from "d3-geo";
import * as dataJson from '../../../../../assets/data/dendrogram.json';
import { PlotContent } from '@models/plot';

@Component({
  selector: 'app-dendrogram',
  templateUrl: './dendrogram.component.html',
  styleUrls: ['./dendrogram.component.scss']
})
export class DendrogramComponent implements OnInit {
  /**
   * Example gathered and modified from: 
   *  https://codesandbox.io/s/treemap-developer-forked-zrzcm?file=/src/Treemap/Treemap.tsx:3649-3652 && 
   *  https://codesandbox.io/examples/package/@types/d3
   * 
   * 
   */
  constructor() { }

  ngOnInit() {
    this.initSvg();
  }

  private svg;
  private tree;
  private elementName = "svg#dendrogram"
  data: any = (dataJson as any).default;
  margin = { top: 50, bottom: 50, right: 10, left: 20 };
  barHeight = 20;
  width = 960;
  private height = Math.max(500, this.barHeight + this.margin.top + this.margin.bottom);

  /**
   * Function creates svg graph
   * @returns svg ; the graph and attching it to a local value
   */
  async createCanvas() {
    // append the svg object to the body of the page
    return this.svg = d3.select(this.elementName)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", "translate(40,0)")
  }

  /**
   * Initalise and call functions to fraw graph
   * @returns null;
   */
  initSvg() {
    this.tree = this.buildTreeMap(this.width, this.height);
    this.drawTree(treeData);
    d3.select(this.elementName).on("click", (el) => {
      const outside = d3.select(this.elementName).selectAll("*")
        .empty();

      if (outside) {
        this.resetAllCircleStyle();
      }
    });
  }

  resetAllCircleStyle() {
    return d3.selectAll("circle").transition().style("stroke", "#6c5ce7");
  };

  equalToEventTarget(info: any) {
    console.log("(equalToEventTarget)", info, d3)
    // return info === d3.event.target;
    return info;
  }

  drawTree(treeData: PlotContent) {
    // console.log("(drawTree)", treeData);

    const nodes = this.tree(this.buildNodesHierarchy(treeData));
    this.svg = this.buildSvgContainer(this.width, this.height);
    const group = this.buildGroup();
    this.buildLinksBetweenNodes(group, nodes);
    this.buildNode(group, nodes);
  };

  buildTreeMap(width: number, height: number) {
    console.log("(buildTreeMap)", width, height)
    return d3.tree().size([height, width]);
  };

  buildNodesHierarchy(nodes: any): any {
    //  assigns the data to a hierarchy using parent-child relationships
    return d3.hierarchy(nodes, (d: any) => {
      if (d && d.children) {
        return d.children;
      }
    });
  };

  buildSvgContainer = (width: number, height: number) => {
    return d3.select(this.elementName)
      .attr("width", width + this.margin.left + this.margin.right)
      .attr("height", height + this.margin.top + this.margin.bottom);
  };

  buildGroup = () => {
    return this.svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  };

  buildLinksBetweenNodes(group: any, nodes: any) {
    return group.selectAll(".link")
      .data(nodes.descendants().slice(1))
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", (d: any) => {
        return "M" + d.y + "," + d.x + "C" + (d.y + d.parent.y) / 2 + "," + d.x +
          " " + (d.y + d.parent.y) / 2 + "," + d.parent.x + " " + d.parent.y +
          "," + d.parent.x
      });
  };

  buildNode(group: any, nodes: any) {
    // adds each node as a group
    let node = group
      .selectAll(".node")
      .data(nodes.descendants())
      .enter()
      .append("g")
      .attr("class", function (d: any) {
        return "node" + (d.children ? " node--internal" : " node--leaf");
      })
      .attr("transform", function (d: any) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // adds the circle to the node
    node.append("circle").attr("r", 5).on("click", (element, val, index) => this.handleClickOnEntity(element, val, index));

    // adds the text to the node
    node
      .append("text")
      .attr("dy", ".25em")
      .attr("x", function (d: any) {
        return d.children ? -13 : 13;
      })
      .style("text-anchor", function (d: any) {
        return d.children ? "end" : "start";
      })
      .text((d: any) => (d.data && d.data.name) ? d.data.name : null )
  };

  handleClickOnEntity(rf: any, d: any, i: number) {
    // this.resetAllCircleStyle();
    d3.select(rf).transition()
      .style("stroke", "#d63031")
      .attr("r", 5 * 1.2)
      .transition()
      .attr("r", 5);
  }

}
