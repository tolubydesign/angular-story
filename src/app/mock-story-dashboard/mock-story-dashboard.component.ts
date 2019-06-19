import { Component, OnInit } from '@angular/core';

// class and interface
import { MockStoryStructure } from '../data/mock-story-structure';

@Component({
  selector: 'app-mock-story-dashboard',
  templateUrl: './mock-story-dashboard.component.html',
  styleUrls: ['./mock-story-dashboard.component.scss']
})
export class MockStoryDashboardComponent implements OnInit {

  dialogue = `Consequat do sunt nisi reprehenderit. Esse labore sunt nostrud 
  aliquip aute tempor consequat nulla aliqua dolore ad ad. Laboris exercitation 
  ullamco anim mollit minim est exercitation occaecat reprehenderit excepteur sit.`;

  constructor() { }

  ngOnInit() {
  }

  loopingCount(total: number) {
    return new Array(total);
  }
}
