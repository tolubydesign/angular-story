import { StoriesService, fakeCardContent } from '@core/services/stories.service';
import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SummaryDisplayCardComponent } from '@components/ui/summary-display-card/summary-display-card.component';
import { FakeCardContent } from '@models/recent';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-draft-card-row',
  standalone: true,
  imports: [SummaryDisplayCardComponent, NgFor, MatButtonModule],
  templateUrl: './draft-card-row.component.html',
  styleUrl: './draft-card-row.component.scss'
})
export class DraftCardRowComponent {
  content: FakeCardContent[] = []
  private _FetchDraftsSubject?: Subscription;
  private _Other?: Subscription;

  ngOnInit() {
    this.requestContent()
    // this.populateContent()
  }

  constructor(
    private storiesService: StoriesService
  ) { }

  ngOnDestroy(): void {
    // UNSUBSCRIBE
    this._FetchDraftsSubject?.unsubscribe();
  }

  requestContent() {
    this._FetchDraftsSubject = this.storiesService.recentExperiences.subscribe((resp) => {
      this.content.push(...resp)
    })
  }

  /**
   * Make HTTP call to server to request more content.
   * Implement pagination style request.
   */
  loadMoreDrafts() {
    for (let index = 0; index < 3; index++) {
      this.content.push(fakeCardContent)
    }
  }
}
