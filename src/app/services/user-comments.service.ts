import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';

// data
import { COMMENT_DATA } from '../data/mock-data';
import { MOCK_STORY_DATA } from '../data/mock-story-data';

// class and interface
import { MockStoryStructure } from '../data/mock-story-structure';
import { Comment } from '../data/Comment';

@Injectable({
  providedIn: 'root'
})

export class UserCommentsService {

  private commentUrl = 'https://jsonplaceholder.typicode.com/comments';
  numericalNumbers: any;
  data: any;


  constructor(
    private httpService: HttpClient,
    private messageService: MessageService,
  ) { }

  private log(message: string) {
    this.messageService.add(`${message}`);
  }

  getLocalComments(): Observable<Comment[]> {
    return of(COMMENT_DATA);
    // return this.httpService.get<Comment[]>(this.commentUrl).pipe(
    //   tap(_ => this.log(`got comment`)),
    //   catchError(this.handleError('something went wrong', []))
    // );
  }

  getLocalStoryLayout(): Observable<MockStoryStructure[]> {
    return of(MOCK_STORY_DATA);
  }

  getServerComments() {
    return this.httpService.get(this.commentUrl).pipe(
      map((res) => {
        this.data = res;
        // console.log(this.data);
      }))
      .subscribe(() => { });
  }

  getCurrentDate() {
    const newDate = new Date();
    return newDate;
  }
}
