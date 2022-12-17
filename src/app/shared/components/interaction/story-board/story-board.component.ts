import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Plot, PlotContent } from '@models/plot';
import { falsy } from '@models/tree.model';
import Board from '@lib/story-board';

@Component({
  selector: 'app-story-board',
  templateUrl: './story-board.component.html',
  styleUrls: ['./story-board.component.scss']
})
export class StoryBoardComponent implements OnInit {
  @Input() fullStory: Plot | falsy = undefined;

  board: Board | falsy = undefined;
  description: string = '';
  title: string = '';
  optionalSelection: PlotContent[] = [];
  narrative: PlotContent | undefined = undefined;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log('changes', changes);
  }

  ngOnInit(): void {
    // Initialise Board
    this.initialization();
  }

  initialization(): void {
    if (this.fullStory) {
      this.board = new Board(this.fullStory);
    }

    if (!this.board) {
      console.warn("Initialization of board was unsuccessful.");
      return
    }

    // Assign title and description
    this.title = this.board.title;
    this.description = this.board.description;
    this.narrative = this.board.state;

    console.table([
      ['title', this.board.title],
      ['description', this.board.description],
      ['story', this.board.story],
      ['state', this.board.state],
    ]);

    (this.narrative) ? this.updateBoard(this.narrative) : new Error('Board state cant be updated.');
  }

  selectionOption(option: PlotContent) {
    console.log("fn selectionOption", option);
    this.updateBoard(option)
  }

  updateBoard(option: PlotContent) {
    this.narrative = this.board?.SelectOption(option).state;
  }
}
