import { PlotService } from "@services/plot/plot.service";
import { Component, OnInit } from "@angular/core";
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from "@angular/router";
import { Subscription } from "rxjs";
import { Plot } from "@models/plot";
import { StoriesService } from "@services/stories.service";
import { HTTPSuccessResponse } from "@services/stories.service";
import { OptionalSelectionCardComponent } from "@shared/components/ui/optional-selection-card/optional-selection-card.component";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";

@Component({
  standalone: true,
  imports: [
    OptionalSelectionCardComponent,
    RouterLink, RouterModule, CommonModule, RouterOutlet, RouterLinkActive, HttpClientModule,
    MatButtonModule, MatDividerModule, MatIconModule
  ],
  selector: "app-interaction",
  templateUrl: "./interaction.component.html",
  styleUrls: ["./interaction.component.scss"],
})
export class InteractionComponent implements OnInit {
  private _FetchStoriesSubscription?: Subscription;
  stories: Plot[] = [];

  constructor(
    private plotService: PlotService,
    private router: Router,
    private storiesService: StoriesService,
  ) { }

  ngOnInit(): void {
    this.fetchStoriesContent();
  }

  ngOnDestroy(): void {
    // UNSUBSCRIBE
    this._FetchStoriesSubscription?.unsubscribe();
  }

  fetchStoriesContent(): void {
    this._FetchStoriesSubscription = this.storiesService.fetchAllStories()
      .subscribe((response: HTTPSuccessResponse<Plot[]>) => {
        this.stories = response.data
      })
  }

  /**
   * @description Story interaction button. 
   * @param id ID of user selected narrative.
   */
  interact(id: string) {
    this.plotService.UpdateStoryBehavior(id);
    // direct user to panel dashboard
    this.router.navigate([`/interact/${id}`]);
  }
}
