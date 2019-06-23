import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOCK_STORY_DATA } from '../data/mock-story-data';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

// structure
import { MockStoryStructure } from '../data/mock-story-structure';

// data 


@Injectable({
  providedIn: 'root'
})
export class StoryService {

  currentStoryPosition = 0;
  dialogue = '';
  choices: any[] = null;
  // totalChoices = this.choices.length;
  optionalChoices: number[] = null;
  // total choices but is the summary
  optionalTextChoices: string[] = null;
  options: (number | string)[] = null;

  jsonStoryUrl = './assets/data/story.json';
  storyNarrative: any = null;

  constructor(
    private httpClient: HttpClient,
  ) { }

  getLocalDialogue(): Observable<MockStoryStructure[]> {
    return of(MOCK_STORY_DATA);
  }

  switchStoryPosition(event: string) {
    if (event === 'previous') {
      if (this.currentStoryPosition > 0) {
        console.log(this.currentStoryPosition);
        this.currentStoryPosition = this.currentStoryPosition - 1;
      } else {
        // console.log('reached limit: smallest');
      }
    } else if (event === 'next') {
      if (this.currentStoryPosition < this.choices.length - 1) {
        console.log(this.currentStoryPosition);
        this.currentStoryPosition = this.currentStoryPosition + 1;
      } else {
        // console.log('reached limit: largest');
      }
    } else {
      console.log('no more text to pass');
    }
  }

  showChoices() {
    return of(MOCK_STORY_DATA).subscribe(
      data => {
        this.choices = data;
        console.log('service choices', this.choices);
      }
    );
  }

  updateDialogueChoices() {
    const options: (number | string)[] = this.choices[this.currentStoryPosition].options;
    // const decisionsTest: any[] = this.choices;
    // this.optionalChoices = decisions;
    // console.log('d1', { decisions }, 'd2', { decisionsTest });
    this.options = options;
    /* resetting optionalTextChoices */
    // this.optionalTextChoices = [];
    // decisionsTest.forEach((element, index) => {
    //   this.optionalTextChoices.push(element.summary);
    // });
    // console.log('123', this.choices[this.currentStoryPosition].decisions);
  }

  getLocalJsonStory() {
    // return this.httpClient.get("./assets/story.json").subscribe(
    return this.httpClient.get(this.jsonStoryUrl).subscribe(
      res => {
        this.storyNarrative = res;
      },
      error => console.log({error}),
      () => {
        console.log('information collected');
        console.log(this.storyNarrative[this.currentStoryPosition]);
      }
    );
      // .do(data => console.log(data));
  }
}
