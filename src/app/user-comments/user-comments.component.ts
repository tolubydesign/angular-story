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
  pageTitle = 'Collection of Comments';
  private commentUrl = 'https://jsonplaceholder.typicode.com/comments';

  results: any;
  itemsOnDisplay = 3;

  comments$: Observable<Comment[]>;
  commentArray: any;
  buttonValues = [];
  usersOnDisplay = [];
  numericalNumber: number;

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
    console.log(`buttonValues :: ${this.buttonValues}`);
  }

  onButton(e: any) {
    console.log(e);
    const value = e.target.innerText;
    this.usersOnDisplay.push(value);
    this.numericalNumber = value;
    this.showComments();
    this.reloadButtonValues();
  }

  createRandomNumber() {
    this.firstDisplayValue = Math.floor(Math.random() * 100);
    this.secondDisplayValue = Math.floor(Math.random() * 100);
    this.thirdDisplayValue = Math.floor(Math.random() * 100);
    this.fourthDisplayValue = Math.floor(Math.random() * 100);
  }

  reloadButtonValues() {
    this.createRandomNumber();
    this.buttonValues = [
      this.firstDisplayValue,
      this.secondDisplayValue,
      this.thirdDisplayValue,
      this.fourthDisplayValue,
    ];
  }

  getComments() {
    return this.httpService.get(this.commentUrl)
      .pipe(
        map(data => {
          // console.log(data[2]);
          // this.results = data;
          this.results = [
            data[this.firstDisplayValue],
            // data[this.secondDisplayValue],
            // data[this.thirdDisplayValue],
            // data[this.fourthDisplayValue],
          ];
        })
      )
      .subscribe(() => {
        // console.log(result);
      });
  }
  showComments() {
    console.log(this.usersOnDisplay);
    return this.httpService.get(this.commentUrl)
    .pipe(
      map(info => {
        this.usersOnDisplay = [
          info[this.numericalNumber]
        ];
      })
    ).subscribe(() => {
    });
  }

}
