import { Component, OnInit } from "@angular/core";
import { PlotService } from "@services/plot/plot.service";
import { HTTPSuccessResponse, StoriesService } from "@services/stories.service";
import { Subscription, Observable, tap, map } from "rxjs";
import { Plot } from "@models/plot";
import { Router } from "@angular/router";
import * as uuid from "uuid";
import { HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnInit {
  private _AllStoriesSubscription: Subscription | undefined;
  private _GetStoriesSubscription: Subscription | undefined;
  private _FetchDataSubscription: Subscription | undefined;
  stories: Plot[] = [];
  cards: Plot[] = [];

  constructor(
    private plotService: PlotService,
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

    // this._FetchDataSubscription = this.storiesService.fetchAllStories().subscribe((response) => {
    //   console.log("(!!!) stories service fetch all stories subscribe", response)
    //   const fullList = response.data
    //   const newStory = {
    //     title: "website request title",
    //     description: "website request description",
    //     content: {
    //       id: uuid.v4(),
    //       name: "Nam blandit magna vel lacinia",
    //       description: "In aliquet nisi a.",
    //       children: [
    //         {
    //           id: uuid.v4(),
    //           name: "Porttitor quis ultrices tortor",
    //           description: "Quisque blandit magna vel lacinia fringilla. Mauris sit amet gravida tellus.",
    //           children: null
    //         },
    //         {
    //           id: uuid.v4(),
    //           name: "2 Porttitor quis ultrices tortor",
    //           description: "2 Quisque blandit magna vel lacinia fringilla. Mauris sit amet gravida tellus.",
    //           children: [
    //             {
    //               id: uuid.v4(),
    //               name: "Porttitor quis ultrices tortor",
    //               description: "Quisque blandit magna vel lacinia fringilla. Mauris sit amet gravida tellus.",
    //               children: null
    //             },
    //           ]
    //         }
    //       ]
    //     }
    //   }

    //   this.storiesService.addStory(newStory).subscribe((response) => {
    //     console.log("(!!!) stories service add story subscribe", response.data)
    //     console.log("(!!!) stories service add story subscribe", fullList[fullList.length - 1]);
    //     const lastStory = fullList[fullList.length - 1];
    //     const storyId = lastStory.story_id
    //     const headers = {
    //       id: storyId,
    //       description: "UPDATED website request description",
    //       title: "UPDATED website request title"
    //     };

    //     const body = { content: newStory.content }
    //     this.storiesService.updateStory(headers, body).subscribe((response) => {
    //       console.log("(!!!) stories service update story subscribe", response);
    //       console.log("(!!!) stories service update story subscribe ::: lastStory", lastStory);

    //       this.storiesService.deleteStory(storyId).subscribe(() => {
    //         console.log("(!!!) stories service delete story subscribe", response);
    //       })
    //     })
    //   })
    // })

    // this._GetStoriesSubscription = this.plotService.GetStory().subscribe((database: Plot[] | undefined) => {
    //   if (database) this.cards = database;
    // });
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
    this.router.navigate([`/editing/${id}`])
  }

  /**
   * @description Redirect to create a new story, in edit more.
   * @return {Promise<void>} 
   */
  async createStory(): Promise<void> {
    // TODO: call loading component
    const id = await this.storiesService.createNewStoryGraph()
    // TODO: cancel loading component
    this.router.navigate([`/editing/${id}`])
  }
}
