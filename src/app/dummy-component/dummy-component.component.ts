import { Component, OnInit } from '@angular/core';
import { UserCommentsService } from '../services/user-comments.service';
import { Comment } from '../data/Comment';
import { MatButtonModule } from '@angular/material/button';
import { COMMENT_DATA } from '../data/mock-data';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dummy-component',
  templateUrl: './dummy-component.component.html',
  styleUrls: ['./dummy-component.component.scss']
})
export class DummyComponentComponent implements OnInit {

  localComments: Comment[];
  serverComments: any;
  currentDay: any;
  service: any;

  constructor(
    private userCommentsService: UserCommentsService,
    // private _http: requestService
  ) { }

  ngOnInit() {
    this.getServerUsers();
    this.currentDay = this.userCommentsService.getCurrentDate();
    this.service = this.userCommentsService.data;

    // this.serverComments = this.getServerUsers().map( res => this.serverComments = res )
  }

  getLocalUsers(): void {
    this.userCommentsService.getLocalComments().subscribe(
      data => this.localComments = data
    );
  }

  getServerUsers() {
    this.serverComments = this.userCommentsService.getServerComments();
    this.service = this.userCommentsService.data;

    // this.userCommentsService.getServerComments().pipe(
    //   (data) => { this.serverComments = data; });

    // this.userCommentsService.getServerComments()
    //   // .pipe(map(data => this.serverComments = data));
    //   .subscribe((data) => {
    //     console.log(data);
    //     this.serverComments = data;
    //   }
    //   );
  }
}
