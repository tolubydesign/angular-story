import { Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
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

  currentStoryPosition: number = null;
  dialogue = '';
  choices: any = null;
  optionalChoices: number[] = null;
  subscription$: Subscription = null;
  localStoryAddress = './assets/data/story.json';


  constructor(
    private httpClient: HttpClient,
  ) { }

  // getLocalDialogue(): Observable<MockStoryStructure[]> {
  //   return of(MOCK_STORY_DATA);
  // }

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
    this.currentStoryPosition = 0;
    this.subscription$ = this.httpClient.get(this.localStoryAddress).subscribe(
      (data: any) => {
        console.log({ data });
        this.choices = data;
        return data;
      },
      error => {
        console.log('error collecting narrative', error);
      },
      () => {
        console.log('story narrative collected');
      },
    );

    // return of(MOCK_STORY_DATA)
    //   .pipe(
    //     map(res => res)
    //   ).subscribe(
    //     data => {
    //       this.choices = data;
    //       console.log('service choices', this.choices);
    //     },
    //     error => {
    //       console.log('error collecting narrative', error);
    //     },
    //     () => { console.log('story narrative collected'); },
    //   );
  }

  getLocalJsonStory(): Observable<object> {
    return this.httpClient.get(this.localStoryAddress);
  }

  disconnectSubscription() {
    this.subscription$.unsubscribe();
  }

}
