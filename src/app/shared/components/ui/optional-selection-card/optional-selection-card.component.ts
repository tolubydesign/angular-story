import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Plot } from '@models/plot';
import { falsy } from '@models/tree.model';
import { PlotService } from "@services/plot/plot.service";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatCard, MatCardActions, MatCardContent, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { CommonModule, NgFor, NgForOf, NgIf } from '@angular/common';

@Component({
    imports: [MatCard, MatCardSubtitle, MatCardTitle, MatCardContent, MatCardActions, NgIf, CommonModule, NgFor, NgForOf],
    selector: 'app-optional-selection-card',
    templateUrl: './optional-selection-card.component.html',
    styleUrls: ['./optional-selection-card.component.scss']
})
export class OptionalSelectionCardComponent implements OnInit {

  @Input() stories: Plot[] = []; // decorate the property with @Input()
  @Input() primaryText: falsy | string = null;
  @Input() secondaryText: falsy | string = null;

  @Output() PrimaryClick = new EventEmitter<string>();
  @Output() SecondaryClick = new EventEmitter<string>();

  paramId: string | falsy = undefined;
  selectedPlot: Plot | falsy = undefined;

  constructor(
    private plotService: PlotService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getParameterID();
  }

  ngOnDestroy(): void {
  }

  onPrimaryClick(item: Plot) {
    this.PrimaryClick.emit(item.id)
  }

  onSecondaryClick(item: Plot) {
    this.SecondaryClick.emit(item.id)
  };

  /**
   * @description Get id from url. Page route
   * @return void
   */
  getParameterID(): void {
    // Route
    this.activatedRoute.paramMap.subscribe((value: ParamMap | { params: { id: string } } | any) => {
      if (value && value.params && value.params.id) {
        this.paramId = value.params.id;

        // Check if parameter and set-story match 
        // We have the relevant parameter id. Make a request to back-end.
        this.matchStoryId(value.params.id)
      }
    });
  }

  /**
   * @description Check that id matches what is available 
   * @param id 
   */
  matchStoryId(id: string | falsy) {
    (id) ? this.plotService.UpdateStoryBehavior(id) : new Error('URL parameter ID could not be found.');
  }
}
