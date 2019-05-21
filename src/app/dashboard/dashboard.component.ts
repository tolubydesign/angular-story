import { Component, OnInit } from '@angular/core';
import 'hammerjs';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})

export class DashboardComponent implements OnInit {

  memorize = 'something';

  constructor() { }

  ngOnInit() {
  }

}
