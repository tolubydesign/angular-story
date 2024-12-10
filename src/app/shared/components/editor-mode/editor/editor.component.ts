import { Component, OnInit } from "@angular/core";
import { StoriesService } from "@services/stories.service";
import { Subscription } from "rxjs";
import { Plot } from "@models/plot";
import { Router, RouterLink, RouterLinkActive, RouterModule } from "@angular/router";
import { OptionalSelectionCardComponent } from "../../ui/optional-selection-card/optional-selection-card.component";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { HTTPSuccessResponse } from "@models/http.model";

@Component({
    imports: [
        OptionalSelectionCardComponent,
        RouterLink, RouterModule, RouterLinkActive,
        MatButtonModule, MatDividerModule, MatIconModule
    ],
    selector: "app-editor",
    templateUrl: "./editor.component.html",
    styleUrls: ["./editor.component.scss"]
})
export class EditorComponent implements OnInit {
  private _AllStoriesSubscription: Subscription | undefined;
  private _GetStoriesSubscription: Subscription | undefined;
  private _FetchDataSubscription: Subscription | undefined;
  stories: Plot[] = [];
  cards: Plot[] = [];

  constructor(
    private router: Router,
    private storiesService: StoriesService
  ) { }

  ngOnInit(): void {
    this.connectSubscription();
  }

  ngOnDestroy(): void {
    // UNSUBSCRIBE
    this._GetStoriesSubscription?.unsubscribe();
    this._FetchDataSubscription?.unsubscribe();
    this._AllStoriesSubscription?.unsubscribe();
  }

  connectSubscription(): void {
    this.populateList();
  };

  populateList(): void {
    this._FetchDataSubscription = this.storiesService.fetchAllStories().subscribe(
      (response: HTTPSuccessResponse) => {
        this.cards = response?.data;
        return response;
      }
    );

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
    // this.plotService.UpdateStoryBehavior(id);
    // direct user to panel dashboard.
    this.router.navigate([`/editor/${id}`])
  }

  /**
   * @description Redirect to create a new story, in edit more.
   * @return {Promise<void>} 
   */
  async createStory(): Promise<void> {
    // TODO: call loading component
    const id = await this.storiesService.createNewStoryGraph()
    // TODO: cancel loading component
    this.router.navigate([`/editor/${id}`])
  }
}
