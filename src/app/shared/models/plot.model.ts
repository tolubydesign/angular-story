import { Plot, PlotContent } from "@models/plot";
import { GraphNode, GraphLink } from "@models/nodes-links";

export class PlotModel {
  originalValue: Plot[];

  private nodes: GraphNode[] = [];
  private links: GraphLink[] = [];

  public selectedPlot: Plot | null = null;

  constructor(data: Plot[]) {
    this.originalValue = data;
    this.initialize()
  }

  initialize(): void {
    console.log("(initialize)", this.originalValue);
    this.selectedPlot = null;
    /** attach nodes and links */
  }

  /**
   * Function sets the nodes and links
   * 
   */
  setNodesAndLinks(nodes: PlotContent[]): void {

    nodes.forEach((node: PlotContent) => {
      this.nodes.push({
        id: node.id,
        label: node.name
      });
      // if (node.id)
      if (node.children) {
        // this.setNodesAndLinks(node.children);
      }
    });

    console.log("(setNodesAndLinks)", this.selectedPlot, this.nodes);
  }

  /**
   * Function returns a plot a user has selected. 
   * @param ID STRING
   * @returns 
   */
  selectPlot(ID: string): Plot | null {
    // console.log("(selectPlot)", ID)
    // Loop though plot to find the selected plot 
    this.originalValue.forEach(val => {
      if (val.id === ID) {
        this.selectedPlot = val;
      }
    });

    return this.selectedPlot ? this.selectedPlot : null;
  }

  clearNodes(): void {
    this.nodes = []
  }

  clearLinks(): void {
    this.links = []
  }
}