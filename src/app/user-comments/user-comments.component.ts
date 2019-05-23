import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { of, interval, Subscription, Observable } from 'rxjs';

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
  // comments: Comment[];
  pageTitle = 'Collection of Comments';
  // time: number;

  constructor(private httpService: HttpClient) {  }
  comments$: Observable<Comment[]>;
  // Observable<string[]>

  ngOnInit() {
    this.comments$ = this.httpService.get<Comment[]>('https://jsonplaceholder.typicode.com/comments');

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

  kill() {
    // this.time.unsubscribe();
  }



}
