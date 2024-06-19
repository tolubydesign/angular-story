import { Component, OnDestroy, OnInit } from '@angular/core';
import { falsy } from '@models/tree.model';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { URLParameters } from '@helpers/parameter';
import { Subscription } from 'rxjs';
import { Plot } from '@models/plot';
import { StoriesService } from '@services/stories.service';
import { StoryBoardComponent } from '../story-board/story-board.component';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { HTTPSuccessResponse } from '@models/http.model';

@Component({
  standalone: true,
  imports: [
    StoryBoardComponent, NgIf, CommonModule,
    RouterLink, RouterModule, RouterOutlet, RouterLinkActive, HttpClientModule,
    MatButtonModule, MatDividerModule, MatIconModule
  ],
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
