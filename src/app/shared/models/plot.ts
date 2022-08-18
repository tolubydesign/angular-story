export interface Plot {
  id: string;
  title: string;
  description: string;
  content: PlotContent[];
}

export interface PlotContent {
  id: string;
  name: string;
  description?: string;
  children?: PlotContent[];
}
