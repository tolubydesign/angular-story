import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-nav-button',
  templateUrl: './nav-button.component.html',
  styleUrls: ['./nav-button.component.scss']
})
export class NavButtonComponent implements OnInit {

  @Input() navigationButton: string;
  // @Input() nextPosition: string;
  // @Input() previousPosition: string;

  constructor(
  ) { }

  ngOnInit() {
  }

}
