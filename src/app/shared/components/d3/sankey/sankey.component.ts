import { Component, OnInit } from '@angular/core';
import * as d3 from "d3"

@Component({
  selector: 'app-sankey',
  templateUrl: './sankey.component.html',
  styleUrls: ['./sankey.component.scss']
})
export class SankeyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.createSvg();
    this.drawBars();
  }

  private svg: any;
  link: any;
  graph: any;
  path: any;
  sankey: any;
  units = "Widgets";

  // set the dimensions and margins of the graph
  margin = { top: 10, right: 10, bottom: 10, left: 10 };
  width = 700 - this.margin.left - this.margin.right;
  height = 300 - this.margin.top - this.margin.bottom;

  // format variables
  formatNumber = d3.format(",.0f");    // zero decimal places
  format = (d: any) => { return this.formatNumber(d) + " " + this.units; };
  color = d3.scaleOrdinal(d3.schemeCategory10);

  /** FUNCTIONS */
  createSvg(): void {
    // append the svg object to the body of the page
    this.svg = d3.select("body").append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");

  }

  private drawBars(): void {
    // d3.json("./assets/data/sankey.json", (error: any, data: any) => {

    //   //set up graph in same style as original example but empty
    //   this.graph = { "nodes": [], "links": [] };

    //   data.forEach(function (d) {
    //     this.graph.nodes.push({ "name": d.source });
    //     this.graph.nodes.push({ "name": d.target });
    //     this.graph.links.push({
    //       "source": d.source,
    //       "target": d.target,
    //       "value": +d.value
    //     });
    //   });

    //   // return only the distinct / unique nodes
    //   // this.graph.nodes = d3.keys(d3.nest()
    //   //   .key(function (d) { return d.name; })
    //   //   .object(this.graph.nodes));

    //   // loop through each link replacing the text with its index from node
    //   this.graph.links.forEach(function (d, i) {
    //     this.graph.links[i].source = this.graph.nodes.indexOf(this.graph.links[i].source);
    //     this.graph.links[i].target = this.graph.nodes.indexOf(this.graph.links[i].target);
    //   });

    //   // now loop through each nodes to make nodes an array of objects
    //   // rather than an array of strings
    //   this.graph.nodes.forEach(function (d, i) {
    //     this.graph.nodes[i] = { "name": d };
    //   });

    //   this.sankey
    //     .nodes(this.graph.nodes)
    //     .links(this.graph.links)
    //     .layout(32);

    //   // add in the links
    //   this.link = this.svg.append("g").selectAll(".link")
    //     .data(this.graph.links)
    //     .enter().append("path")
    //     .attr("class", "link")
    //     .attr("d", this.path)
    //     .style("stroke-width", function (d) { return Math.max(1, d.dy); })
    //     .sort(function (a, b) { return b.dy - a.dy; });

    //   // add the link titles
    //   this.link.append("title")
    //     .text(function (d) {
    //       return d.source.name + " → " +
    //         d.target.name + "\n" + this.format(d.value);
    //     });

    //   // add in the nodes
    //   let node = this.svg.append("g").selectAll(".node")
    //     .data(this.graph.nodes)
    //     .enter().append("g")
    //     .attr("class", "node")
    //     .attr("transform", function (d) {
    //       return "translate(" + d.x + "," + d.y + ")";
    //     })
    //     .call(d3.drag()
    //       .subject(function (d) {
    //         return d;
    //       })
    //       .on("start", function () {
    //         this.parentNode.appendChild(this);
    //       })
    //       .on("drag", dragmove));

    //   // add the rectangles for the nodes
    //   node.append("rect")
    //     .attr("height", function (d) { return d.dy; })
    //     .attr("width", this.sankey.nodeWidth())
    //     .style("fill", function (d) {
    //       return d.color = this.color(d.name.replace(/ .*/, ""));
    //     })
    //     .style("stroke", function (d) {
    //       return d3.rgb(d.color).darker(2);
    //     })
    //     .append("title")
    //     .text(function (d) {
    //       return d.name + "\n" + this.format(d.value);
    //     });

    //   // add in the title for the nodes
    //   node.append("text")
    //     .attr("x", -6)
    //     .attr("y", function (d) { return d.dy / 2; })
    //     .attr("dy", ".35em")
    //     .attr("text-anchor", "end")
    //     .attr("transform", null)
    //     .text(function (d) { return d.name; })
    //     .filter(function (d) { return d.x < this.width / 2; })
    //     .attr("x", 6 + this.sankey.nodeWidth())
    //     .attr("text-anchor", "start");


    //   // the function for moving the nodes
    //   function dragmove(d) {
    //     console.log("(dragmove)", d)

    //     // d3.select(this)
    //     //   .attr("transform",
    //     //     "translate("
    //     //     + d.x + ","
    //     //     + (d.y = Math.max(
    //     //       0, Math.min(this.height - d.dy, d3.event.y))
    //     //     ) + ")");
    //     // this.sankey.relayout();
    //     // this.link.attr("d", this.path);
    //   }

    //   return {

    //   };
    // });
  }
}
