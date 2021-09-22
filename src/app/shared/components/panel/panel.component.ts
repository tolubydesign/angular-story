import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  selectedPlot: string = null;
  
  constructor() { }

  ngOnInit(): void {
  }

}
