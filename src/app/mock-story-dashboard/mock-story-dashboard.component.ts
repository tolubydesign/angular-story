import { Component, OnInit, Pipe } from '@angular/core';
import { map, concatAll, filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

// class and interface
import { MockStoryStructure } from '../data/mock-story-structure';

// service
import { StoryService } from '../services/story.service';

@Component({
  selector: 'app-mock-story-dashboard',
  templateUrl: './mock-story-dashboard.component.html',
  styleUrls: ['./mock-story-dashboard.component.scss']
})

// tslint:disable-next-line: use-pipe-transform-interface
@Pipe({
  name: 'merge'
})

export class MockStoryDashboardComponent implements OnInit {

  nextPosition = 'next';
  previousPosition = 'previous';
  currentPosition: number = null;
  dialogue: string = null;
  playerChoiceDialogue: any[] = null;
  /* reader choices that can be picked */
  currentChoices: number[] = null;
  // currentTextChoices: string[] = null;
  storyNarrative: any = null;
  collections = null;
  decisions: any[] = null;
  summaries: any[] = null;


  constructor(
    private storyService: StoryService,
  ) { }

  ngOnInit() {
    this.storyService.showChoices();
    this.getCurrentStoryPosition();
    this.setDialogue();
    this.localJsonStory();
  }

  loopingCount(total: number) {
    return new Array(total);
  }

  /* gets the current story position. story position is set to json id */
  getCurrentStoryPosition() {
    this.currentPosition = this.storyService.currentStoryPosition;
  }

  /* set dialogue summaries. refers to what choices the reader can pick */
  setDialogue() {
    this.dialogue = this.storyService.choices[this.currentPosition].summary;
  }

  /* set the current story options the reader can decide on picking */
  /*
  setCurrentChoices() {
    this.storyService.updateDialogueChoices();
    this.currentChoices = this.storyService.optionalChoices;
    this._options = this.storyService.options;
    const elements = this._options;
    console.log({ elements });
    // this.currentTextChoices = this.storyService.optionalTextChoices;
    // this.currentTextChoices = this.storyService.optionalTextChoices
  }
  */

  navigateDialogue(element: string) {
    this.storyService.switchStoryPosition(element);
    // update whole of program
    this.updateDialogue();
  }

  // getNextPosition() {
  //   this.storyService.switchStoryPosition(null, true);
  //   this.updateDialogue();
  // }

  // getPreviousPosition() {
  //   this.storyService.switchStoryPosition(true, null);
  //   this.updateDialogue();
  // }

  updateDialogue() {
    this.getCurrentStoryPosition();
    this.setDialogue();
    this.localJsonStory();
  }

  localJsonStory() {
    this.storyService.getLocalJsonStory()
      .pipe(
        map(res => {
          // console.log(res[this.currentPosition].options);
          const decisions = res[this.currentPosition].options.decisions;
          const summary = res[this.currentPosition].options.summary;
          const option = {...decisions, ...summary};
          this.decisions = decisions;
          this.summaries = summary;
          this.functioning(decisions, summary);
          return res;
        }),
      ).subscribe(
        val => { console.log('data gathering'); },
        error => { console.log('data collection error occurred : ', error); },
        () => console.log('information gathered')
      );
  }

  functioning(decisions: any, summary: any ) {
    const arr = [];
    decisions.forEach((elt: number, i: string) => {
      arr.push({ state: elt, name: summary[i] });
    });
    this.collections = arr;
    console.log({arr});
  }

}

