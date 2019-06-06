import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { of, interval, Subscription, Observable, } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from '../services/message.service';
import { map } from 'rxjs/operators';

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}


@Component({
  selector: 'app-user-comments',
  templateUrl: './user-comments.component.html',
  styleUrls: ['./user-comments.component.sass']
})
export class UserCommentsComponent implements OnInit {

  firstDisplayValue = null;
  secondDisplayValue = null;
  thirdDisplayValue = null;
  fourthDisplayValue = null;
  arrayOfDisplayNumbers = [];
  pageTitle = 'Collection of Comments';
  private commentUrl = 'https://jsonplaceholder.typicode.com/comments';

  results: any;
  itemsOnDisplay = 3;

  comments$: Observable<Comment[]>;
  commentArray: any;
  buttonValues = [];
  usersOnDisplay = [];

  constructor(private httpService: HttpClient, private messageService: MessageService) { }

  ngOnInit() {
    this.getComments();
    this.comments$ = this.httpService.get<Comment[]>(this.commentUrl);
    this.commentArray = this.comments$;
    console.log(this.results);
    this.createRandomNumber();
    this.buttonValues = [
      this.firstDisplayValue,
      this.secondDisplayValue,
      this.thirdDisplayValue,
      this.fourthDisplayValue,
    ];
    console.log(this.buttonValues);
    // this.comments$.subscribe(
    //   data => {
    //     this.comments  = data;
    //   }
    // )

    //   data => {
    //     this.comments = data as string [];
    //   },
    //   (err: HttpErrorResponse) => {
    //     console.log( err.message );
    //   }
    // );
    // this.time = interval(1000).subscribe(
    //   res => console.log(res)
    // );
  }

  onButton(e) {
    const value = e.target.innerText;
    console.log(e);
    console.log(value);
    this.usersOnDisplay.push(value);
  }

  createRandomNumber() {
    this.firstDisplayValue = Math.floor(Math.random() * 100);
    this.secondDisplayValue = Math.floor(Math.random() * 100);
    this.thirdDisplayValue = Math.floor(Math.random() * 100);
    this.fourthDisplayValue = Math.floor(Math.random() * 100);
  }

  getComments() {
    return this.httpService.get(this.commentUrl)
      .pipe(
        map(data => {
          console.log(data[2]);
          // this.results = data;
          this.results = [
            data[this.firstDisplayValue],
            data[this.secondDisplayValue],
            data[this.thirdDisplayValue],
            data[this.fourthDisplayValue]
          ];
        })
      )
      .subscribe(result => {
        console.log(result);
      });
  }

}
