import { Plot, PlotContent } from "@models/plot";

export default class Board {
  readonly initialObject: Plot | undefined = undefined;
  readonly story: PlotContent | undefined = undefined;
  readonly title: string = '';
  readonly description: string = '';
  readonly storyId: string = '';

  state: PlotContent | undefined = undefined;
  previousState: PlotContent | undefined = undefined;

  level: number = 0;

  constructor(
    story: Plot
  ) {
    this.initialObject = story;
    this.title = story.title;
    this.description = story.description;
    this.storyId = story.id

    this.story = story.content;
    this.state = story.content;
    this.level = 0;

    console.log("Board constructor", this.initialObject);
  }

  /**
   * @description Read the full story object;
   * @returns { Plot }
   * @example
   * Board.ReadFullStory();
   */
  ReadFullStory(): Plot | undefined {
    return this.initialObject
  }

  /**
   * @description Read the current state;
   * @returns { PlotContent }
   * @example
   * Board.ReadCurrentState();
   */
  ReadCurrentState(): PlotContent | undefined {
    return this.state;
  }

  /**
   * @description Select narrative path to follow. User choice
   * @param selection { any }
   */
  SelectOption(selection: PlotContent): {state: PlotContent, level: number} {
    this.previousState = this.state
    this.state = selection;
    this.level++;

    const state = this.state;
    const level = this.level;

    return {
      state,
      level,
    }
  }

  /**
   * @description Find a specific story moment.
   * @param { unknown }
   * @returns {PlotContent}
   */
  findNarrativeState(): PlotContent | undefined {

    return this.state
  }
}
