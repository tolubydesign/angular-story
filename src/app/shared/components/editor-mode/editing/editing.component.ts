import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { falsy } from '@models/tree.model';
import { URLParameters } from '@helpers/parameter';
import { Plot } from '@models/plot';
import { Falsy, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { StoriesService } from '@services/stories.service';
import { LoaderComponent } from '../../ui/loader/loader.component';
import { HierarchyComponent } from '../../extra/hierarchy/hierarchy.component';
import { NgIf } from '@angular/common';

// Create Mat Icons.
const CloseIcon = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="121.31px" height="122.876px" viewBox="0 0 121.31 122.876" enable-background="new 0 0 121.31 122.876" xml:space="preserve">
  <g>
    <path fill-rule="evenodd" clip-rule="evenodd" 
      d="M90.914,5.296c6.927-7.034,18.188-7.065,25.154-0.068 c6.961,6.995,6.991,18.369,0.068,25.397L85.743,61.452l30.425,30.855c6.866,6.978,6.773,18.28-0.208,25.247 c-6.983,6.964-18.21,6.946-25.074-0.031L60.669,86.881L30.395,117.58c-6.927,7.034-18.188,7.065-25.154,0.068 c-6.961-6.995-6.992-18.369-0.068-25.397l30.393-30.827L5.142,30.568c-6.867-6.978-6.773-18.28,0.208-25.247 c6.983-6.963,18.21-6.946,25.074,0.031l30.217,30.643L90.914,5.296L90.914,5.296z">
    </path>
  </g>
</svg>
`
const THUMB_ICON =
  `
  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.` +
  `44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5` +
  `1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>
  </svg>
`;

@Component({
  standalone: true,
  imports: [LoaderComponent, HierarchyComponent, NgIf],
  selector: 'app-editing',
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.scss']
})

export class EditingComponent implements OnInit, OnDestroy {
  parameterId: string | falsy;
  parameters = new URLParameters(this.activatedRoute);
  plot: Plot | undefined;
  private _FetchStoriesSubscriber: Subscription | undefined;
  private _EditingStorySubscriber: Subscription | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private storiesService: StoriesService,
  ) {
    // Note that we provide the icon here as a string literal here due to a limitation in
    // Stackblitz. If you want to provide the icon from a URL, you can use:
    // `iconRegistry.addSvgIcon('thumbs-up', sanitizer.bypassSecurityTrustResourceUrl('icon.svg'));`
    iconRegistry.addSvgIconLiteral('thumbs-up', sanitizer.bypassSecurityTrustHtml(THUMB_ICON));
    iconRegistry.addSvgIconLiteral('close', sanitizer.bypassSecurityTrustHtml(CloseIcon));
  }

  ngOnInit(): void {
    this.initialization();
  }

  ngOnDestroy(): void {
    this._FetchStoriesSubscriber?.unsubscribe();
    this._EditingStorySubscriber?.unsubscribe();
    this.storiesService.updateEditingStory("")
  }

  // TODO: The `this.storiesService.editingStory.subscribe()` request is made twice per load.
  //          This needs to only happen once. Make sure this only happens once
  /**
   * @description Initialise component.
   * @returns async void promise
   */
  async initialization(): Promise<void> {
    this._EditingStorySubscriber = this.storiesService.editingStory.subscribe((story?: Plot) => {
      this.plot = story;
    })

    const parameterID = await this.getParameterID();
    if (parameterID instanceof Error) throw parameterID

    // fetch files if nothing is in the store.
    if (!this.storiesService.AllStoriesState()) {
      this.storiesService.fetchAllStories().subscribe(
        () => this.updateStoryParameterId(parameterID)
      )
    } else {
      this.updateStoryParameterId(parameterID)
    }
  }

  /**
   * @description Get id from url. Page route
   * @return {Promise<void>}
   */
  async getParameterID(): Promise<string | Error> {
    const parameter = await this.parameters.GetIDParameter();
    if (parameter instanceof Error) {
      console.warn(parameter.message);
      return parameter;
    }

    this.parameterId = parameter;
    return parameter;
  }

  /**
   * Update selected story. Sends update id to Stories Service
   * @param id Narrative id
   */
  updateStory(id: string) {
    this.storiesService.updateEditingStory(id);
  }

  updateStoryParameterId(id: string) {
    this.updateStory(id);
  }
}
