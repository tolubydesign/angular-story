import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  Observable,
  BehaviorSubject,
  distinctUntilChanged,
  tap,
  catchError,
  finalize,
} from "rxjs";
import { Plot, PlotContent } from '@shared/models/plot';
import { NotificationService } from '@services/notification.service';
import * as uuid from "uuid";
import { environment } from '@environment/environment';
import { FakeCardContent } from '@models/recent';
import { handleServiceError } from '@shared/utils/error-notification-handler';
import { HTTPSuccessResponse } from '@shared/models/http.model';

export const fakeCardContent: FakeCardContent = {
  title: "Title",
  description: "Description of content",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ac varius mi. Curabitur viverra nunc eget ullamcorper venenatis.",
  image: {
    url: '/assets/images/false-content-card-placeholder.jpg', // or data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=
    alt: 'Information describing the image being passed.'
  }
}

const blankJson = '/assets/data/blank.json';

@Injectable({
  providedIn: 'root'
})
export class StoriesService {
  private _url = environment.BASE_API_URL;
  private _loading = new BehaviorSubject<boolean>(false);
  isLoading = this._loading.asObservable().pipe(distinctUntilChanged());

  private _AllStoriesSubject = new BehaviorSubject<Plot[] | undefined>(undefined);
  stories = this._AllStoriesSubject.asObservable().pipe(distinctUntilChanged());

  // Current Narrative that's being edited
  private _EditingStorySubject = new BehaviorSubject<Plot | undefined>(undefined);
  editingStory = this._EditingStorySubject.asObservable().pipe(distinctUntilChanged());
  // ID of the current
  private _EditingStoryIDSubject = new BehaviorSubject<string>("");
  editingStoryId = this._EditingStoryIDSubject.asObservable().pipe(distinctUntilChanged());

  // Recent Narratives the user has engaged in.
  private _RecentExperiencesSubject = new BehaviorSubject<FakeCardContent[]>([]);
  recentExperiences = this._RecentExperiencesSubject.asObservable().pipe(distinctUntilChanged())

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
  ) {
    http.head(this._url)
    http.options(
      this._url
    )
  }

  private handleError = handleServiceError

  /**
   * @description Request to get all stories. 
   * @returns HTTP GET request response.
   */
  fetchAllStories(): Observable<any> {
    const url = `${this._url}/list-stories`
    this._loading.next(true)
    return this.http.get<HTTPSuccessResponse<Plot[]>>(url)
      // Error Handling
      .pipe(catchError(this.handleError(this.notificationService)))

      .pipe(
        finalize(() => {
          this._loading.next(false)
          console.log("Request call 'All Story'. finalize() block executed");
        }),
      )

      .pipe(tap((response: HTTPSuccessResponse<Plot[]>) => {
        this._AllStoriesSubject.next(response.data)
        return response
      }))
  }

  /**
   * @description A request to add a new story to the back-end. 
   * @param body 
   * @returns Observable<HTTPSuccessResponse>
   */
  addStory(body: { title: string, description: string, content: any }): Observable<any> {
    const url = `${this._url}/story`;
    this._loading.next(true)
    return this.http.post<HTTPSuccessResponse>(url, body)
      // Error Handling
      .pipe(catchError(this.handleError(this.notificationService)))

      // Handle finalise
      .pipe(
        finalize(() => {
          this._loading.next(false)
          console.log("Request call 'Add Story'. finalize() block executed");
        }),
      )

      // Handle Response
      .pipe(
        tap((response: HTTPSuccessResponse) => {
          console.log("add story ::: response", response)
          return response;
        }),
      )
  }

  /**
   * @description Request to update a story based on ID provided
   * @param headers 
   * @param body 
   * @returns Observable<HTTPSuccessResponse>
   */
  updateStoryRequest({ id, description, title, body }: { id: string, description: string, title: string, body: PlotContent }): Observable<HTTPSuccessResponse> {
    const url = `${this._url}/story`

    const header = new HttpHeaders()
      .set("id", id)
      .set("description", description)
      .set("title", title);

    return this.http.put<HTTPSuccessResponse>(url, { content: body }, { headers: header })
      // Error Handling
      .pipe(catchError(this.handleError(this.notificationService)))

      // Handle finalise
      .pipe(
        finalize(() => {
          this._loading.next(false)
          console.log("Request call 'Update Story'. finalize() block executed");
        }),
      )

      // Handle Response
      .pipe(
        tap((response: HTTPSuccessResponse) => {
          console.log("update story ::: response", response)
          return response;
        }),
      )
  }

  /**
   * Remove selected narrative object.
   * @param id the narrative string
   * @returns 
   */
  deleteStoryRequest(id: string): Observable<HTTPSuccessResponse> {
    const url = `${this._url}/story`;
    const header = new HttpHeaders()
      .set("id", id)
    return this.http.delete<HTTPSuccessResponse>(url, { headers: header })
      .pipe(tap((response: HTTPSuccessResponse) => response))

      // Handle finalise
      .pipe(
        finalize(() => {
          this._loading.next(false)
          console.log("Request call 'Delete Story'. finalize() block executed");
        }),
      )
  };

  /**
   * Update what story we is being edited. Track what the user is using.
   * @param id root base story id
   * @returns
   */
  async updateEditingStory(id: string) {
    this._EditingStoryIDSubject.next(id);

    if (id === "") {
      this._EditingStorySubject.next(undefined)
      return;
    }

    if (!this._AllStoriesSubject?.value) {
      // NOTE: fetch data from database. Then 
      await this.fetchAllStories().pipe(tap((response: HTTPSuccessResponse<Plot[]>) => {
        const stories = response.data;
        // Searching for story with id
        const story = stories.find((story: Plot) => (story.id === id) ? story : undefined);
        this._EditingStorySubject.next(story)
      }));
      return;
    }

    // Note: search for story with id
    this._AllStoriesSubject.value?.find((story: Plot) => {
      if (story.id === id) this._EditingStorySubject.next(story)
    });
  };

  /**
   * @description Create a brand new story graph.
   */
  async createNewStoryGraph(): Promise<string> {
    const id = uuid.v4();
    const story: Plot = {
      id,
      description: "Description text needed",
      title: "Title of Story",
      content: {
        id: uuid.v4(),
        name: "Initial Content for story",
        description: "Description not yet provided.",
        children: undefined,
        graphics: undefined,
        characters: undefined,
      }
    }
    this._EditingStoryIDSubject.next(id);
    this._EditingStorySubject.next(story)
    return id
  }

  /**
   * Get a list of recent narrative visits that the user has interacted with
   * TODO: switch to using real api request
   */
  fetchRecentVisited(): Observable<FakeCardContent[]> {
    const content: FakeCardContent[] = []
    this._loading.next(true);
    const headers = new HttpHeaders()
      .set("id", '0000')
    const url = blankJson;
    for (let index = 0; index < 3; index++) {
      content[index] = fakeCardContent
    }

    // await timeout(6000);
    return this.http.get<FakeCardContent[]>(url, { headers: headers })
      // Error Handling
      .pipe(catchError(this.handleError(this.notificationService)))

      // Handle Response
      .pipe(tap((response: FakeCardContent[]) => {
        this._RecentExperiencesSubject.next(content);
        console.log(content)
        return content;
      }))

      // Handle finalise
      .pipe(
        finalize(() => {
          this._loading.next(false);
        })
      );
  };

  /**
   * Request to get recent content drafts the user has created.
   * Works that haven't been categorized as completed.
   * TODO: swap out function content. Use actual data.
   */
  fetchRecentDrafts() {
    const content: FakeCardContent[] = []
    this._loading.next(true);
    const headers = new HttpHeaders()
      .set("id", '0000')
    const url = blankJson;
    for (let index = 0; index < 3; index++) {
      content[index] = fakeCardContent
    }

    // await timeout(6000);
    return this.http.get<FakeCardContent[]>(url, { headers: headers })
      // Error Handling
      .pipe(catchError(this.handleError(this.notificationService)))

      // Handle Response
      .pipe(tap((response: FakeCardContent[]) => {
        this._RecentExperiencesSubject.next(content);
        console.log(content)
        return content;
      }))

      // Handle finalise
      .pipe(
        finalize(() => {
          this._loading.next(false);
        })
      );
  }

  AllStoriesState = (): Plot[] | undefined => this._AllStoriesSubject.value;
  EditingStoryState = (): Plot | undefined => this._EditingStorySubject.value;
  EditingStoryIdState = (): string | null => this._EditingStoryIDSubject.value;
  isLoadingState = (): boolean => this._loading.value;
  getRecentVisits = (): FakeCardContent[] | undefined => this._RecentExperiencesSubject.value
}

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}