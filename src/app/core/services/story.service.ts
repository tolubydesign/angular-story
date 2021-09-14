import { Injectable } from '@angular/core';
import { Observable, of, Subscription, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { map, tap, retry } from 'rxjs/operators';
import { MockStoryStructure } from '@models/mock-story-structure';
import { computeMsgId } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  currentStoryPosition = new BehaviorSubject<number>(0);
  currentStoryPosition$ = this.currentStoryPosition.asObservable();

  completeStoryUrl = './assets/data/story.json';
  storyScript$: Subscription = null;

  fullNarrative = new BehaviorSubject<MockStoryStructure[]>(null);
  fullNarrative$ = this.fullNarrative.asObservable();

  // fullNarrative: object[] = null;

  constructor(
    private http: HttpClient,
  ) { }

  navigateNarrative(event: string) {
    let position = this.currentStoryPosition.getValue();
    let narrative = this.fullNarrative.getValue();

    if (event === 'previous') {
      if (position > 0) {
        console.log('position', position);
        this.updateCurrentPosition(position - 1)
      } else {
        return;
      }

    } else if (event === 'next') {
      if (position < narrative.length - 1) {
        console.log('', position);
        this.updateCurrentPosition(position + 1)
      } else {
        return;
      }

    } else {
      console.log('no more text to pass');
    }
  }

  getStory() {
    return this.http.get<MockStoryStructure[]>(this.completeStoryUrl).pipe(
      tap((res: MockStoryStructure[]) => {
        this.fullNarrative.next(res);
        console.log(this.fullNarrative.getValue());
        return res;
      })
    )
  }

  componentData(): Observable<MockStoryStructure[]> {
    return this.http.get<MockStoryStructure[]>(this.completeStoryUrl);
  }

  updateNarrative(position: number) {
    console.log('updateNarrative', position);
    // this.currentStoryPosition = a - 1;
    this.updateCurrentPosition(position - 1)
  }

  updateCurrentPosition(position: number) {
    this.currentStoryPosition.next(position)
  }
}
