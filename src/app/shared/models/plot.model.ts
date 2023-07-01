import { Plot, PlotContent } from "@models/plot";
import { GraphNode, GraphLink } from "@models/nodes-links";

export class PlotModel {
  plots: Plot[];

  private nodes: GraphNode[] = [];
  private links: GraphLink[] = [];

  public selectedPlot: Plot | null = null;

  constructor(data: Plot[]) {
    this.plots = data;
    this.initialize();
  }

  initialize(): void {
    console.info("initialize", this.plots);
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
        label: node.name,
      });
      // if (node.id)
      if (node.children) {
        // this.setNodesAndLinks(node.children);
      }
    });

    console.log("(set nodes and links)", this.selectedPlot, this.nodes);
  }

  /**
   * Function returns a plot a user has selected.
   * @param ID STRING
   * @returns
   */
  selectPlot(ID: string): Plot | null {
    // Loop though plot to find the selected plot
    this.plots.forEach((val) => {
      if (val.id === ID) {
        this.selectedPlot = val;
      }
    });

    return this.selectedPlot ? this.selectedPlot : null;
  }

  clearNodes(): void {
    this.nodes = [];
  }

  clearLinks(): void {
    this.links = [];
  }
}
