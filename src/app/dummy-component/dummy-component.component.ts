import { Component, OnInit } from '@angular/core';
import { UserCommentsService } from '../services/user-comments.service';
import { Comment } from '../references/Comment';
import { MatButtonModule } from '@angular/material/button';
import { COMMENT_DATA } from '../references/mock-data';
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
  ) { }

  ngOnInit() {
    this.getServerUsers();
    this.currentDay = this.userCommentsService.getCurrentDate();
    this.service = this.userCommentsService.data;
  }

  getLocalUsers(): void {
    this.userCommentsService.getLocalComments().subscribe(
      data => this.localComments = data
    );
  }

  getServerUsers() {
    this.serverComments = this.userCommentsService.getServerComments();
    this.service = this.userCommentsService.data;
  }
}
