import { Component, OnInit } from '@angular/core';
import { UserCommentsService } from '../services/user-comments.service';
import { Comment } from '../data/Comment';
import { COMMENT_DATA } from '../data/mock-data';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dummy-component',
  templateUrl: './dummy-component.component.html',
  styleUrls: ['./dummy-component.component.sass']
})
export class DummyComponentComponent implements OnInit {

  localComments: Comment[];
  serverComments: any;

  constructor(
    private userCommentsService: UserCommentsService
  ) { }

  ngOnInit() {
    this.getServerUsers();
  }

  getLocalUsers(): void {
    this.userCommentsService.getLocalComments().subscribe(
      data => this.localComments = data
    );
  }

  getServerUsers() {
    this.userCommentsService.getServerComments()
    // .pipe(map(data => this.serverComments = data));
    .subscribe(
      (data) => this.serverComments = {data}
    );
  }
}
