import { Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

// structure
import { MockStoryStructure } from '../data/mock-story-structure';

// data
import { MOCK_STORY_DATA } from '../data/mock-story-data';

// components
import { MockStoryDashboardComponent } from '../mock-story-dashboard/mock-story-dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  currentStoryPosition = 0;
  completeStoryUrl = './assets/data/story.json';
  // TODO: update and compress code
  completeStory$: Subscription = null;
  fullNarrative: object[] = null;
  narrativeData$: object = [];

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
        return;
      }
    } else if (event === 'next') {
      if (this.currentStoryPosition < this.fullNarrative.length - 1) {
        console.log(this.currentStoryPosition);
        this.currentStoryPosition = this.currentStoryPosition + 1;
      } else {
        // console.log('reached limit: largest');
        return;
      }
    } else {
      console.log('no more text to pass');
    }
  }

  completeStory() {
    this.currentStoryPosition = 0;
    this.completeStory$ = this.httpClient.get(this.completeStoryUrl)
      .pipe(
        map(res => res)
      )
      .subscribe(
        (data: any[]) => {
          this.fullNarrative = data;
          console.log('full narrative', this.fullNarrative);
          // return data;
          throw Error;
        },
        (error: any) => {
          console.log('an error has occurred', error);
        },
        () => {
          this.completeStory$.unsubscribe();
          console.log('(service) narrative colleted');
        }
      );
  }

  componentData(): Observable<MockStoryStructure[]> {
    return this.narrativeData$ = this.httpClient.get<MockStoryStructure[]>(this.completeStoryUrl);
  }

  updateNarrative(a: number) {
    console.log('new narrative position', {a});
    this.currentStoryPosition = a - 1;
  }
}
