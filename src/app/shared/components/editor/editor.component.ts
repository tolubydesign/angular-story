import { Component, OnInit } from "@angular/core";
import { PlotService } from "@services/plot/plot.service";
import { Subscription, Observable } from "rxjs";
import { Plot } from "@models/plot";
import { Router } from "@angular/router";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnInit {
  plotSubscription: Subscription | undefined;
  storyEdits: Plot[] | null = null;

  selectedPlot: string | undefined;

  constructor(private plotService: PlotService, private router: Router) { }

  ngOnInit(): void {
    this.populateList();
  }

  ngOnDestroy(): void {
    this.plotSubscription ? this.plotSubscription.unsubscribe() : undefined;
  }

  populateList(): void {
    this.plotSubscription = this.plotService.GetStory().subscribe((plot: any) => {
      this.storyEdits = plot;
    });
  }

  deletePlot(editID: string) {
    console.log("delete", editID);
  }

  editPlot(id: string) {
    // direct user to panel dashboard.
    this.router.navigate([`/panel/${id}`])
  }
}
