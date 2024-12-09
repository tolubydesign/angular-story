import { StoriesService } from '@core/services/stories.service';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-welcome-mat',
    imports: [MatButtonModule],
    templateUrl: './welcome-mat.component.html',
    styleUrl: './welcome-mat.component.scss'
})
export class WelcomeMatComponent {

  constructor(
    private router: Router,
    private storiesService: StoriesService
  ) { }

  /**
   * Redirect to create a new story, in edit more.
   */
  async createContent(): Promise<void> {
    // TODO: call loading component
    const id = await this.storiesService.createNewStoryGraph()
    // TODO: cancel loading component
    this.router.navigate([`/editor/${id}`]);
  }
}

