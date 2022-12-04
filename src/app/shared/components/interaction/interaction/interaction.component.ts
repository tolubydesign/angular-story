import { PlotService } from "@services/plot/plot.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Plot } from "@models/plot";
import { falsy } from "@models/tree.model";

@Component({
  selector: "app-interaction",
  templateUrl: "./interaction.component.html",
  styleUrls: ["./interaction.component.scss"],
})
export class InteractionComponent implements OnInit {
  StorySubscription: Subscription | undefined;
  story: Plot[] = [];

  constructor(
    private plotService: PlotService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('Component - interaction');
    this.populate();
  }

  ngOnDestroy(): void {
    // UNSUBSCRIBE
    this.StorySubscription?.unsubscribe();
  }

  populate(): void {
    this.StorySubscription = this.plotService.GetStory()
      .subscribe(
        (database: Plot[] | undefined) => (database) ? this.story = database : this.story = []
      );
  }

  interact(id: string) {
    // direct user to panel dashboard

    // this.router.navigate([`/panel/${id}`])
  }
}
