import { Component, OnInit } from '@angular/core';
import 'hammerjs';

/* data */
// TODO: replace with *API
import { DETAILS } from '../references/story-dialogue';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  details = DETAILS;

  // props -- responses
  // optionOne = 'YES';
  // optionTwo = 'NO';

  optionSetOne = 'yes';
  optionSetTwo = 'no';

  onOption( value: string) {
    console.log({value});
    if (value = 'firstValue') {
      this.initialFunction();
    } else if (value = 'secondValue') {
      this.secondaryFunction();
    } else { return; }
  }

  initialFunction() {
    console.log(' initial function called');
  }
  secondaryFunction() {
    console.log(' secondary function called');
  }

  constructor() { }

  ngOnInit() {
  }

}
