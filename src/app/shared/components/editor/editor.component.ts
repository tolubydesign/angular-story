import { Component, OnInit } from "@angular/core";
import { PlotService } from "@services/plot/plot.service";
import { Subscription, Observable } from "rxjs";
import { Plot } from "@models/plot";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnInit {
  plotSubscription: Subscription | undefined;
  storyEdits: Plot[] | null = null;

  plotSelectionSubscription: Subscription | undefined;
  selectedPlot: string | undefined;

  constructor(private plotService: PlotService) {}

  ngOnInit(): void {
    this.getPlot();
    // subscribe to values in service
    this.plotSelectionSubscription = this.plotService.subject.subscribe(
      (selection: string | unknown | undefined) =>
        (this.selectedPlot = selection as string)
    );
  }

  ngOnDestroy(): void {
    this.plotSubscription ? this.plotSubscription.unsubscribe() : undefined;
    this.plotSelectionSubscription
      ? this.plotSelectionSubscription.unsubscribe()
      : undefined;
  }

  getPlot(): void {
    this.plotSubscription = this.plotService.getPlot().subscribe(
      (plot: any) => {
        // console.info('plot', plot);
        this.storyEdits = plot;
      },
      (error: Error) => {
        console.error(error);
      },
      () => {
        // action completed
      }
    );
  }

  deletePlot(editID: string) {
    console.log("delete", editID);
  }

  editPlot(editID: string) {
    this.plotService.selectPlot(editID);
  }
}
