import { Component, OnInit } from '@angular/core';
import { PlotService } from '@services/plot/plot.service';
import { Subscription, Observable } from 'rxjs';
import { Plot } from '@models/plot';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  plotSubscription: Subscription;
  storyEdits: Plot[] | null = null;
  
  plotSelectionSubscription: Subscription;
  selectedPlot: string = null;

  constructor(
    private plotService: PlotService,
  ) { }

  ngOnInit(): void {
    this.getPlot();
    // subscribe to values in service
    this.plotSelectionSubscription = this.plotService.subject
      .subscribe((selection: string) => this.selectedPlot = selection)
  }

  ngOnDestroy(): void {
    this.plotSubscription.unsubscribe();
    this.plotSelectionSubscription.unsubscribe();
  }

  getPlot(): void {
    this.plotSubscription = this.plotService
      .getPlot().subscribe(
        (plot: any) => {
          console.log('plot', plot);
          this.storyEdits = plot;
        }, (error: Error) => {
          console.error(error);
        }, () => {
          // action completed
        }
      )

  }

  deletePlot(editID: string) {
    console.log('delete', editID);
  }

  editPlot(editID: string) {
    this.plotService.selectPlot(editID);
  }

}
