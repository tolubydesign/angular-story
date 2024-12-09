import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MiniNavbarComponent } from '@core/mini-navbar/mini-navbar.component';

@Component({
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MiniNavbarComponent],
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
