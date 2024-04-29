import { Component, OnInit } from '@angular/core';
import { SummaryDisplayCardComponent } from '@components/ui/summary-display-card/summary-display-card.component';
import { CommonModule, NgFor } from '@angular/common';
import { FakeCardContent } from '@models/recent';
import { StoriesService } from '@core/services/stories.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-continue-card-row',
  standalone: true,
  imports: [SummaryDisplayCardComponent, NgFor, CommonModule],
  templateUrl: './continue-card-row.component.html',
  styleUrl: './continue-card-row.component.scss'
})
export class ContinueCardRowComponent implements OnInit {
  content: FakeCardContent[] = []
  private _FetchRecentVisits?: Subscription;
  private _Other?: Subscription;

  constructor(
    private storiesService: StoriesService
  ) { }

  ngOnInit() {
    this.requestContent()
  }

  ngOnDestroy(): void {
    // UNSUBSCRIBE
    this._FetchRecentVisits?.unsubscribe();
    this._Other?.unsubscribe();
  }

  requestContent() {
    this._FetchRecentVisits = this.storiesService.fetchRecentVisited().subscribe()

    this._Other = this.storiesService.recentExperiences.subscribe((resp) => {
      this.content.push(...resp)
    })
  }
}
