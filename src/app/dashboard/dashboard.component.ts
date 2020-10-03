import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { StoryService } from '../services/story.service';
import 'hammerjs';
import { MockStoryStructure } from '../references/mock-story-structure';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  narrativePosition: number;
  narrative: string;
  title: string;

  /* reader choices that can be picked */
  choices;
  decisions: any[];
  summaries: any[];

  getStorySubscription: Subscription;
  narrativeSubscription: Subscription;

  constructor(
    private storyService: StoryService,
  ) { }

  ngOnInit() {
    this.getStory();
  }

  ngOnDestroy(): void {
    this.getStorySubscription.unsubscribe();
    this.narrativeSubscription.unsubscribe();
  }

  getStory() {
    this.getStorySubscription = this.storyService.getStory().subscribe(
      (story: MockStoryStructure[]) => {
        console.log('story', story);
      }, (error: any) => {
        console.log('an error has occurred', error);
      }, () => {
        this.setCurrentStoryPosition();
        this.setDialogue();
        this.updateStory();
      }
    );
  }

  loopingCount(total: number) {
    return new Array(total);
  }

  setCurrentStoryPosition() {
    this.narrativeSubscription = this.storyService.currentStoryPosition$.subscribe(
      (res: number) => { this.narrativePosition = res },
      (error: Error) => { console.warn(error) },
    )
  }

  updateDialogue() {
    this.updateStory();
  }

  /* an action a reader has decide to pick */
  makeChoice(action: number) {
    this.storyService.updateNarrative(action);
    this.updateDialogue();
    this.setDialogue();
  }

  /* set or update the current story options the reader can decide on picking */
  updateStory() {
    let narrative = this.storyService.fullNarrative.getValue();
    this.decisions = narrative[this.narrativePosition].options.decisions;
    this.summaries = narrative[this.narrativePosition].options.summary;
    this.assignReaderOptions(this.decisions, this.summaries);
  }

  setDialogue(): void {
    let narrative = this.storyService.fullNarrative.getValue();
    console.log('setDialogue.narrative', narrative);

    this.narrative = narrative[this.narrativePosition].story;
    this.title = narrative[this.narrativePosition].title;
  }

  assignReaderOptions(decisions: any, summary: any) {
    this.choices = [];
    decisions.forEach((decisionsValue: number, index: string) => {
      this.choices.push({ decision: decisionsValue, summary: summary[index] });
    });

    console.log('choices', this.choices);
  }

}
