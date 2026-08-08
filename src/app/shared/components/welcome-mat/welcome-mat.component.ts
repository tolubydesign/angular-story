import { StoriesService } from '@core/services/stories.service';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { getUserCredentials } from '../../helpers/session.storage';

@Component({
  selector: 'app-welcome-mat',
  imports: [MatButtonModule],
  templateUrl: './welcome-mat.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './welcome-mat.component.scss',
})
export class WelcomeMatComponent {
  username = signal<string>('');
  constructor(private router: Router, private storiesService: StoriesService) {
    // showcase username
    const { username } = getUserCredentials(true, sessionStorage);
    console.log('welcome comp. username', username);
    this.username.set(username?.trim() ?? '');
  }

  /**
   * Redirect to create a new story, in edit more.
   */
  async createContent(): Promise<void> {
    // TODO: call loading component
    const id = await this.storiesService.createNewStoryGraph();
    // TODO: cancel loading component
    this.router.navigate([`/editor/${id}`]);
  }
}
