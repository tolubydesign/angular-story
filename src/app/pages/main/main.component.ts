import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { WelcomeMatComponent } from '@components/welcome-mat/welcome-mat.component';
import { ContinueCardRowComponent } from '@components/card-row/continue-card-row/continue-card-row.component';
import { DraftCardRowComponent } from '@components/card-row/draft-card-row/draft-card-row.component';
import { StoriesService } from '@core/services/stories.service';
import { Plot } from '@models/plot';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  imports: [MatCardModule, RouterModule, WelcomeMatComponent, ContinueCardRowComponent, DraftCardRowComponent],
  templateUrl: './main.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './main.component.scss',
})
export class MainComponent {
  published = signal<Plot[]>([]);
  drafted = signal<Plot[]>([]);
  private _UserActivities?: Subscription;

  constructor(private storiesService: StoriesService) {}

  ngOnInit() {
    this._UserActivities = this.storiesService.fetchActivity().subscribe((response) => {
      this.drafted.set(this.storiesService.getUserDraftedWorks() ?? []);
      this.published.set(this.storiesService.getUserPublishedWorks() ?? []);
    });
    this.requestContent();
  }

  ngOnDestroy(): void {
    // UNSUBSCRIBE
    this._UserActivities?.unsubscribe();
  }

  requestContent() {}
}
