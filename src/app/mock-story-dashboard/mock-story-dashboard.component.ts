import { Component, OnInit } from '@angular/core';
import { map, concatAll, filter } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';

// class and interface
import { MockStoryStructure } from '../data/mock-story-structure';

// service
import { StoryService } from '../services/story.service';

@Component({
  selector: 'app-mock-story-dashboard',
  templateUrl: './mock-story-dashboard.component.html',
  styleUrls: ['./mock-story-dashboard.component.scss']
})

export class MockStoryDashboardComponent implements OnInit {

  currentPosition: number = null;
  narrative: string = null;
  title: string = null;
  /* reader choices that can be picked */
  readerChoices = null;
  decisions: any[] = null;
  summaries: any[] = null;
  jsonSubscription$: Subscription = null;


  constructor(
    private storyService: StoryService,
  ) { }

  ngOnInit() {
    this.storyService.completeStory();
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
  setDialogue(): any {
    this.storyService.componentData()
      .pipe(
        map(res => res )
      )
      .subscribe(
        data => {
          this.narrative = data[this.currentPosition].story;
          this.title = data[this.currentPosition].title;
          return data;
        }
      );
  }

  navigateDialogue(element: string) {
    this.storyService.switchStoryPosition(element);
    // update whole of program
    this.updateDialogue();
  }

  updateDialogue() {
    this.getCurrentStoryPosition();
    this.setDialogue();
    this.localJsonStory();
  }

  /* an action a reader has decide to pick */
  onReaderDecision(action: any) {
    let chosenAction = Number(action.target.value);
    console.log({ action });
    console.log(action.target.value);
    this.storyService.updateNarrative(chosenAction);
    this.updateDialogue();
    // console.log({selectedAction});
  }

  /* set the current story options the reader can decide on picking */
  localJsonStory() {
    this.jsonSubscription$ = this.storyService.componentData()
      .pipe(
        map(res => {
          const decisions = res[this.currentPosition].options.decisions;
          const summary = res[this.currentPosition].options.summary;
          this.decisions = decisions;
          this.summaries = summary;
          this.assignReaderOptions(decisions, summary);
          return res;
        }),
      ).subscribe(
        val => val,
        error => { console.log('data collection error occurred : ', error); },
        () => {
          console.log('information gathered');
          this.disconnectSubscription();
        }
      );
  }

  assignReaderOptions(decisions: any, summary: any) {
    let combinedArrays = [];
    decisions.forEach((decisionsValue: number, index: string) => {
      combinedArrays.push({ decision: decisionsValue, summary: summary[index] });
    });
    this.readerChoices = combinedArrays;
    console.log(this.readerChoices);
    /* reset array to allow for new values to be inputted */
    combinedArrays = [];
  }

  disconnectSubscription() {
    this.jsonSubscription$.unsubscribe();
  }

  update(a: number) {
    return a;
  }

}

