import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PanelComponent } from '../panel/panel.component';

@Component({
  standalone: true,
  imports: [PanelComponent],
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.scss']
})
export class DashboardPanelComponent implements OnInit {

  constructor(private location: Location, private router: Router) { }

  ngOnInit(): void {
  }

  back(): void {
    // this.router.navigate("..");
    this.router.navigate(['/editor'])
    // this.location.back()
  }

}
