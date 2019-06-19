import { Component, OnInit, Input } from '@angular/core';

import { } from '../mock-story-dashboard/mock-story-dashboard.component';

@Component({
  selector: 'app-mock-story-board',
  templateUrl: './mock-story-board.component.html',
  styleUrls: ['./mock-story-board.component.scss']
})
export class MockStoryBoardComponent implements OnInit {

  @Input() dialogue: string;

  constructor() { }

  ngOnInit() {
    console.log(this.dialogue);
    console.log(this.dialogue.length);
  }
}
