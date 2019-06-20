import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOCK_STORY_DATA } from '../data/mock-story-data';

// structure
import { MockStoryStructure } from '../data/mock-story-structure';


@Injectable({
  providedIn: 'root'
})
export class StoryService {

  currentStoryPosition: number = null;
  dialogue = '';
  constructor() { }

  getLocalDialogue(): Observable<MockStoryStructure[]> {
    return of(MOCK_STORY_DATA);
  }

  switchStoryPosition(previous: number, current: number, next: number, ) {
    this.currentStoryPosition = next;
  }
}
