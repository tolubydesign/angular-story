import { Component, OnDestroy, OnInit } from '@angular/core';
import { falsy } from '@models/tree.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { URLParameters } from '@helpers/parameter';
import { Subscription } from 'rxjs';
import { Plot } from '@models/plot';
import { HTTPSuccessResponse, StoriesService } from '@services/stories.service';

@Component({
  selector: 'app-interaction-dashboard',
  templateUrl: './interaction-dashboard.component.html',
  styleUrls: ['./interaction-dashboard.component.scss']
})
export class InteractionDashboardComponent implements OnInit, OnDestroy {

  parameterId: string | falsy;
  parameters = new URLParameters(this.activatedRoute);
  private _FetchStoriesSubscription?: Subscription;
  story: Plot | falsy = undefined;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private storiesService: StoriesService,
  ) { }

  ngOnInit(): void {
    this.getParameters();
    this.fetchStories();
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this._FetchStoriesSubscription?.unsubscribe();
  }

  fetchStories() {
    this._FetchStoriesSubscription = this.storiesService.fetchAllStories()
      .subscribe((response: HTTPSuccessResponse<Plot[]>) => this.getStory(response.data))
  }

  /**
   * @description Get id from url. Page route
   * @return {Promise<void>}
   */
  async getParameters(): Promise<void> {
    await this.parameters.GetIDParameter()
    this.parameterId = this.parameters.parameterId;
  }

  async getStory(stories: Plot[]) {
    // loop through and find selected id
    if (!stories || stories.length < 1) return new Error("ERROR Stories cant be ");

    this.story = stories.find((s, index) => s.id === this.parameterId);
    return null
  }

}
