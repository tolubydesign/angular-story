import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
    imports: [CommonModule],
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
