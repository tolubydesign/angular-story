import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlotContent } from '@models/plot';
import * as d3 from "d3";
import { treeData } from "@models/tree-data.model";
// import {JSDOM} from "jsdom";
// import {select, selectAll} from "d3-selection";
// import {geoPath} from "d3-geo";
import { visualizationData } from "@models/tangled-tree-visualization-data";
import { svg } from 'd3';

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
   */
  constructor() { }

  ngOnInit() {
    this.initSvg();
  }

  private svg: any;
  private tree: any;
  private elementName = "svg#dendrogram"
  // data: any = (dataJson as any).default;
  margin = { top: 50, bottom: 50, right: 10, left: 20 };
  barHeight = 20;
  width = 960;
  private height = Math.max(500, this.barHeight + this.margin.top + this.margin.bottom);
  // private D3Transition = d3.transition().duration(750).ease(d3.easeLinear);

  treeVisualizationData = visualizationData

  treeVisualizationHTMLDiagram: Promise<Document> | undefined;

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
      // console.log("d3 selection:", el);
      const outside = d3.select(this.elementName).selectAll("*")
        .empty();

      if (outside) {
        this.resetAllCircleStyle();
      }
    });
  }

  /**
   * Function to reset circles. To be done when the state of the graph changes.
   * Changes occurs when click or visual changes are requried
   * @returns d3-circle-change
   */
  resetAllCircleStyle() {
    return d3.selectAll("circle").transition().style("stroke", "unset");
  };

  drawTree(treeData: PlotContent) {
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
      .attr("height", height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(40,0)")
  };

  buildGroup = () => {
    return this.svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  };

  /**
   * Set/Build the links, lines, connecting the node.
   * Set stlying of links here. Issues with svg
   * @param group 
   * @param nodes 
   * @returns 
   */
  buildLinksBetweenNodes(group: any, nodes: any) {

    return group.selectAll(".node-link")
      .data(nodes.descendants().slice(1))
      .enter()
      .append("path")
      .attr("class", "node-link")
      .attr("style", `fill: none;
      stroke: rgba(50, 50, 93, 0.5);
      stroke-width: 2px;`)
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
    node.append("circle")
      .attr("r", 5)
      .on("click", (element: unknown, val: unknown, index: number) => this.handleClickOnEntity(element, val, index));

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
      .text((d: any) => (d.data && d.data.name) ? d.data.name : null)
  };

  handleClickOnEntity(element: any, val: any, i: number) {
    console.log("handleClickOnEntity", element, val, i)
    this.resetAllCircleStyle();
    d3.select(element)
      .transition()
      .delay((d, i) => i * 50)
      .style("stroke", "green");
    // .style("stroke", "#d63031")
    // .attr("r", 5 * 1.2)
    // .transition()
    // .attr("r", 5);
  }

  color = d3.scaleOrdinal(d3.schemeDark2);
  background_color = 'white';

  renderChart (options: any = {}) {
    options.color ||= (d: any, i: any) => this.color(i)
    
    const tangleLayout = this.constructTangleLayout(JSON.parse(JSON.stringify(this.treeVisualizationData)), options);
  
    const diagram =  svg(
      `<svg width="${tangleLayout.layout.width}" height="${
        tangleLayout.layout.height
      }" style="background-color: ${this.background_color}">
      <style>
        text {
          font-family: sans-serif;
          font-size: 10px;
        }
        .node {
          stroke-linecap: round;
        }
        .link {
          fill: none;
        }
      </style>
    
      ${tangleLayout.bundles.map((b: any, i: number) => {
        let d = b.links
          .map(
            (l: any) => `
          M${l.xt} ${l.yt}
          L${l.xb - l.c1} ${l.yt}
          A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
          L${l.xb} ${l.ys - l.c2}
          A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
          L${l.xs} ${l.ys}`
          )
          .join("");
        return `
          <path class="link" d="${d}" stroke="${this.background_color}" stroke-width="5"/>
          <path class="link" d="${d}" stroke="${options.color(b, i)}" stroke-width="2"/>
        `;
      })}
    
      ${tangleLayout.nodes.map(
        (n: any) => `
        <path class="selectable node" data-id="${
          n.id
        }" stroke="black" stroke-width="8" d="M${n.x} ${n.y - n.height / 2} L${
          n.x
        } ${n.y + n.height / 2}"/>
        <path class="node" stroke="white" stroke-width="4" d="M${n.x} ${n.y -
          n.height / 2} L${n.x} ${n.y + n.height / 2}"/>
    
        <text class="selectable" data-id="${n.id}" x="${n.x + 4}" y="${n.y -
          n.height / 2 -
          4}" stroke="${this.background_color}" stroke-width="2">${n.id}</text>
        <text x="${n.x + 4}" y="${n.y -
          n.height / 2 -
          4}" style="pointer-events: none;">${n.id}</text>
      `
      )}
    
      </svg>`
    );

    this.treeVisualizationHTMLDiagram = diagram;
    return diagram
  }

  constructTangleLayout(levels: any, options: any = {}) {
    // precompute level depth
    levels.forEach((l: any, i: any) => l.forEach((n: any, index: number) => (n.level = i)));

    var nodes = levels.reduce((a: any, x: any) => a.concat(x), []);
    var nodes_index: any = {};
    nodes.forEach((d: any) => (nodes_index[d.id] = d));

    // objectification
    nodes.forEach((d: any) => {
      d.parents = (d.parents === undefined ? [] : d.parents).map(
        (p: any) => nodes_index[p]
      );
    });

    // precompute bundles
    levels.forEach((l: any, i: number) => {
      var index: any = {};
      l.forEach((n: any) => {
        if (n.parents.length == 0) {
          return;
        }

        var id = n.parents
          .map((d: any) => d.id)
          .sort()
          .join('-X-');
        if (id in index) {
          index[id].parents = index[id].parents.concat(n.parents);
        } else {
          const minValue: any = d3.min(n.parents, (p: any) => p.level)
          if (minValue) {
            index[id] = { id: id, parents: n.parents.slice(), level: i, span: i - minValue };
          }
        }
        n.bundle = index[id];
      });
      l.bundles = Object.keys(index).map((k: any) => index[k]);
      l.bundles.forEach((b: any, i: number) => (b.i = i));
    });

    var links: any = [];
    nodes.forEach((d: any) => {
      d.parents.forEach((p: any) =>
        links.push({ source: d, bundle: d.bundle, target: p })
      );
    });

    var bundles = levels.reduce((a: any, x: any) => a.concat(x.bundles), []);

    // reverse pointer from parent to bundles
    bundles.forEach((b: any) =>
      b.parents.forEach((p: any) => {
        if (p.bundles_index === undefined) {
          p.bundles_index = {};
        }
        if (!(b.id in p.bundles_index)) {
          p.bundles_index[b.id] = [];
        }
        p.bundles_index[b.id].push(b);
      })
    );

    nodes.forEach((n: any) => {
      if (n.bundles_index !== undefined) {
        n.bundles = Object.keys(n.bundles_index).map(k => n.bundles_index[k]);
      } else {
        n.bundles_index = {};
        n.bundles = [];
      }
      n.bundles.sort((a: any, b: any) => d3.descending(d3.max(a, (d: any) => d.span), d3.max(b, (d: any) => d.span)))
      n.bundles.forEach((b: any, i: any) => (b.i = i));
    });

    links.forEach((l: any) => {
      if (l.bundle.links === undefined) {
        l.bundle.links = [];
      }
      l.bundle.links.push(l);
    });

    // layout
    const padding = 8;
    const node_height = 22;
    const node_width = 70;
    const bundle_width = 14;
    const level_y_padding = 16;
    const metro_d = 4;
    const min_family_height = 22;

    options.c ||= 16;
    const c = options.c;
    options.bigc ||= node_width + c;

    nodes.forEach(
      (n: any) => (n.height = (Math.max(1, n.bundles.length) - 1) * metro_d)
    );

    var x_offset = padding;
    var y_offset = padding;
    levels.forEach((l: any) => {
      x_offset += l.bundles.length * bundle_width;
      y_offset += level_y_padding;
      l.forEach((n: any, i: number) => {
        n.x = n.level * node_width + x_offset;
        n.y = node_height + y_offset + n.height / 2;

        y_offset += node_height + n.height;
      });
    });

    var i = 0;
    levels.forEach((l: any) => {
      l.bundles.forEach((b: any) => {
        const maxedValue: string | undefined = d3.max(b.parents, (d: any) => d.x);

        if (maxedValue) {
          b.x = maxedValue + node_width + (l.bundles.length - 1 - b.i) * bundle_width;
        }
        b.y = i * node_height;
      });

      i += l.length;
    });

    links.forEach((l: any) => {
      l.xt = l.target.x;
      l.yt =
        l.target.y +
        l.target.bundles_index[l.bundle.id].i * metro_d -
        (l.target.bundles.length * metro_d) / 2 +
        metro_d / 2;
      l.xb = l.bundle.x;
      l.yb = l.bundle.y;
      l.xs = l.source.x;
      l.ys = l.source.y;
    });

    // compress vertical space
    var y_negative_offset = 0;
    levels.forEach((l: any) => {
      const minValue = d3.min(l.bundles, (b: any) => d3.min(b.links, (link: any) => link.ys - 2 * c - (link.yt + c))) 

      if (minValue) {
        y_negative_offset +=
        -min_family_height +
        minValue || 0;
      }


      l.forEach((n: any) => (n.y -= y_negative_offset));
    });

    // very ugly, I know
    links.forEach((l: any) => {
      l.yt =
        l.target.y +
        l.target.bundles_index[l.bundle.id].i * metro_d -
        (l.target.bundles.length * metro_d) / 2 +
        metro_d / 2;
      l.ys = l.source.y;
      l.c1 = l.source.level - l.target.level > 1 ? Math.min(options.bigc, l.xb - l.xt, l.yb - l.yt) - c : c;
      l.c2 = c;
    });

    let maxWidth = d3.max(nodes, (n: any) => n.x)
    let maxHeight = d3.max(nodes, (n: any) => n.y);

    var layout = {
      width: "0",
      height: "0",
      node_height,
      node_width,
      bundle_width,
      level_y_padding,
      metro_d
    };

    if (maxWidth && maxHeight) {
      layout = {
        width: maxWidth + node_width + 2 * padding,
        height: maxHeight + node_height / 2 + 2 * padding,
        node_height,
        node_width,
        bundle_width,
        level_y_padding,
        metro_d
      };
    }

    return { levels, nodes, nodes_index, links, bundles, layout };
  }
}
