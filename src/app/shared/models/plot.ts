export type Plot = {
  id: string;
  creator: string;
  title: string;
  description: string;
  status: 'public' | 'private';
  published?: boolean;
  group?: string[] | number[];
  content: PlotContent;
};

export type PlotContent = {
  id: string;
  name: string;
  description?: string;
  children?: PlotContent[];
  graphics?: BoardGraphic;
  characters?: BoardCharacter[];
};

export type PlotInstanceType = 'edit' | 'create';

export type BoardGraphic = {
  backgroundImage: string;
};

export type BoardCharacter = {
  name: string;
  image: string;
};
