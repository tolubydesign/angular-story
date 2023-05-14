import { Component, OnInit } from "@angular/core";
import { PlotService } from "@services/plot/plot.service";
import { Subscription, Observable, tap, map } from "rxjs";
import { Plot } from "@models/plot";
import { Router } from "@angular/router";
import * as uuid from "uuid";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnInit {
  GetStoriesSubscription: Subscription | undefined;
  storyEdits: Plot[] = [];

  constructor(private plotService: PlotService, private router: Router) { }

  ngOnInit(): void {
    this.populateList();
  }

  ngOnDestroy(): void {
    // UNSUBSCRIBE
    this.GetStoriesSubscription?.unsubscribe();
  }

  populateList(): void {
    this.GetStoriesSubscription = this.plotService.GetStory().subscribe((database: Plot[] | undefined) => {
      if (database) this.storyEdits = database;
    });
  }

  deletePlot(editID: string) {
    console.log("delete", editID);
  }

  /**
   * @description Modify an existing plot 
   * @param { string } id The specific ID node
   * 
   */
  editPlot(id: string) {
    this.plotService.UpdateStoryBehavior(id);
    // direct user to panel dashboard.
    this.router.navigate([`/editing/${id}`])
  }

  /**
   * @description Redirect to create a new story, in edit more.
   * @return {void} 
   */
  createStory(): void {
    // Utilize uuid v4 => uuid.v4();
    const id = uuid.v4();
    this.plotService.createStoryGraph(id)
    this.router.navigate([`/editing/${id}`])
  }
}
