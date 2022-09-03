import { Plot, PlotContent } from "@models/plot"; 
import { Falsy } from "rxjs";

export type falsy = undefined | null;

export class Tree {
  initialTree: PlotContent | Falsy  = undefined;

  constructor(tree: Plot[]) {
  }
}