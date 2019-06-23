import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

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

  nextPosition = 'next';
  previousPosition = 'previous';
  currentPosition: number = null;
  dialogue: string = null;
  playerChoiceDialogue: any[] = null;
  /* reader choices that can be picked */
  currentChoices: number[] = null;
  // currentTextChoices: string[] = null;
  options = null;

  constructor(
    private storyService: StoryService,
  ) { }

  ngOnInit() {
    this.storyService.showChoices();
    this.getCurrentStoryPosition();
    this.setDialogue();
    console.log('current dialogue option', this.dialogue);
    this.setCurrentChoices();
    console.log('options in mock', this.options);
    console.log('!');
    this.storyService.getLocalJsonStory();
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
  setCurrentChoices() {
    this.storyService.updateDialogueChoices();
    this.currentChoices = this.storyService.optionalChoices;
    this.options = this.storyService.options;
    let elements = this.options;
    console.log({elements})
    // this.currentTextChoices = this.storyService.optionalTextChoices;
    // this.currentTextChoices = this.storyService.optionalTextChoices
  }

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
    this.setCurrentChoices();
  }
}
