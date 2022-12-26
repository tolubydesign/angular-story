import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Plot, PlotContent } from '@models/plot';
import { falsy } from '@models/tree.model';
import Board from '@lib/story-board';
import { Router } from '@angular/router';

@Component({
  selector: 'app-story-board',
  templateUrl: './story-board.component.html',
  styleUrls: ['./story-board.component.scss']
})
export class StoryBoardComponent implements OnInit {
  @Input() fullStory: Plot | falsy = undefined;

  id: string = '';
  board: Board | falsy = undefined;
  description: string = '';
  title: string = '';
  optionalSelection: PlotContent[] = [];
  narrative: PlotContent | undefined = undefined;
  level: number = 0

  constructor(private router: Router) { }

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
      this.id = this.fullStory.id;
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

  updateBoard(option: PlotContent): Error | undefined {
    if (!this.board) return new Error('Error. Attempted to update Board. Cant find board.')
    const {state, level}: {state: any, level: any} = this.board.SelectOption(option);
    
    this.narrative = state;
    this.level = level;
    return
  }

  reload(): void {
    if (this.fullStory) {
      this.board = new Board(this.fullStory);
      this.selectionOption(this.fullStory.content);
    } else {
      new Error('Story not fund.')
    }
  }

}
