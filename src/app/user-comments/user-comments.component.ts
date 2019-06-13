import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { of, interval, Subscription, Observable, } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from '../services/message.service';
import { map } from 'rxjs/operators';
import { Comment } from '../data/Comment';

@Component({
  selector: 'app-user-comments',
  templateUrl: './user-comments.component.html',
  styleUrls: ['./user-comments.component.sass']
})
export class UserCommentsComponent implements OnInit {
  
  /* data */
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
  numericalNumbers = [];

  constructor(private httpService: HttpClient, private messageService: MessageService) { }

  ngOnInit() {
    this.getComments();
    this.comments$ = this.httpService.get<Comment[]>(this.commentUrl);
    this.commentArray = this.comments$;
    this.createRandomNumber();
    console.log('buttonValues', this.buttonValues);
  }

  onButton(e: any) {
    const value = (Number(e.target.innerText));
    // this.numericalNumber = value;
    this.numericalNumbers.push(value);
    this.showComments();
    this.reloadButtonValues();
  }

  createRandomNumber() {
    this.firstDisplayValue = Math.floor(Math.random() * 100);
    // this.preventZeroValues(this.firstDisplayValue);

    this.secondDisplayValue = Math.floor(Math.random() * 100);
    // this.preventZeroValues(this.secondDisplayValue);

    this.thirdDisplayValue = Math.floor(Math.random() * 100);
    // this.preventZeroValues(this.thirdDisplayValue);

    this.fourthDisplayValue = Math.floor(Math.random() * 100);
    // this.preventZeroValues(this.fourthDisplayValue);

    this.buttonValues = [
      Number(this.firstDisplayValue),
      Number(this.secondDisplayValue),
      Number(this.thirdDisplayValue),
      Number(this.fourthDisplayValue),
    ];
  }

  reloadButtonValues() {
    this.createRandomNumber();
  }

  preventZeroValues(e: number) {
    e === 0 ? e = 1 : e = Math.floor(Math.random() * 100);
  }

  getComments() {
    return this.httpService.get(this.commentUrl)
    .pipe(
      map(data => {
        this.results = [
          data[this.firstDisplayValue],
          // data[this.secondDisplayValue],
          // data[this.thirdDisplayValue],
          // data[this.fourthDisplayValue],
        ];
      })
    )
    .subscribe(() => {});
  }

  showComments() {
    return this.httpService.get(this.commentUrl)
    .pipe(
      map(info => {
        // TODO: create for-loop that throws out different items (using numbers) from 'info' then push that info to local array
        // TODO: have this be run through a service worker
        this.numericalNumbers.forEach( (value, i) => {
          try {
            this.usersOnDisplay = [
              info[ value - 1 ],
            ];
          } catch (error) {
            console.log(error);
          }
        });
      })
    ).subscribe(() => {});
  }

}
