import { Injectable } from '@angular/core';
import { Comment } from '../data/Comment';
import { HttpClient } from '@angular/common/http';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { catchError,  map, tap, } from 'rxjs/operators';
import { COMMENT_DATA } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})

export class UserCommentsService {

  private commentUrl = 'https://jsonplaceholder.typicode.com/comments';
  numericalNumbers: any;


  constructor(
    private httpService: HttpClient,
    private messageService: MessageService,
  ) { }

  private log(message: string) {
    this.messageService.add(`${ message }`);
  }

  getLocalComments(): Observable<Comment[]> {
    return of(COMMENT_DATA);
    // return this.httpService.get<Comment[]>(this.commentUrl).pipe(
    //   tap(_ => this.log(`got comment`)),
    //   catchError(this.handleError('something went wrong', []))
    // );
  }

  getServerComments(): Observable<Comment[]> {
    return this.httpService.get<Comment[]>(this.commentUrl);
    // return this.httpService.get<Comment[]>(this.commentUrl).pipe(
    //   map(info => { this.numericalNumbers.forEach( () => {
    //       try {
    //         this.usersOnDisplay = [
    //           info[ value - 1 ],
    //         ];
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     });
    //   })
    // ).subscribe(() => {});
  }
}
