import { Component, OnInit } from '@angular/core';
import 'hammerjs';

/* data */
// TODO: replace with *API
import { DETAILS } from '../data/story-dialogue';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})

export class DashboardComponent implements OnInit {

  details = DETAILS;

  // props -- responses
  // optionOne = 'YES';
  // optionTwo = 'NO';
  options = ['yes', 'no'];
  
  onOptionButton(c, d) {
    console.log({c});
    console.log({d});
  }

  constructor() { }

  ngOnInit() {
  }

}
