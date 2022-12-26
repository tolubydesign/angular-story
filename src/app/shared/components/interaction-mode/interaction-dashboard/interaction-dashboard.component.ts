import { Component, OnInit } from '@angular/core';
import { falsy } from '@models/tree.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { URLParameters } from '@helpers/parameter';
import { PlotService } from '@services/plot/plot.service';
import { Subscription } from 'rxjs';
import { Plot } from '@models/plot';

@Component({
  selector: 'app-interaction-dashboard',
  templateUrl: './interaction-dashboard.component.html',
  styleUrls: ['./interaction-dashboard.component.scss']
})
export class InteractionDashboardComponent implements OnInit {

  parameterId: string | falsy;
  parameters = new URLParameters(this.activatedRoute);
  StorySubscription: Subscription | undefined;
  story: Plot | falsy = undefined;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private plotService: PlotService,
  ) { }

  ngOnInit(): void {
    this.getParameters();
    
    // Get selected story.
    this.StorySubscription = this.plotService.GetStory().subscribe(
      (data: Plot[]) => {
        this.getStory(data);
      }
    );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.StorySubscription?.unsubscribe();
  }

  /**
   * @description Get id from url. Page route
   * @return {Promise<void>}
   */
  async getParameters() {
    await this.parameters.getParametersID()
    this.parameterId = this.parameters.parameterId;
  }

  async getStory(stories: Plot[]) {
    // loop through and find selected id
    if (!stories || stories.length < 1) return new Error("ERROR Stories cant be ");

    this.story = stories.find((s, index) => s.id === this.parameterId);
    return null
  }

}
