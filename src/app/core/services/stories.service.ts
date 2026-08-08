import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, distinctUntilChanged, tap, catchError, finalize } from 'rxjs';
import { Plot, PlotContent } from '@shared/models/plot';
import { NotificationService } from '@services/notification.service';
import { createId } from '@paralleldrive/cuid2';
import { environment } from '@environment/environment';
import { handleServiceError } from '@shared/utils/error-notification-handler';
import { HTTPSuccessResponse } from '@shared/models/http.model';
import { getUserCredentials } from '../../shared/helpers/session.storage';

@Injectable({
  providedIn: 'root',
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
  private _EditingStoryIDSubject = new BehaviorSubject<string>('');
  editingStoryId = this._EditingStoryIDSubject.asObservable().pipe(distinctUntilChanged());

  // Recent Narratives the user has engaged in.
  private _RecentActivitiesSubject = new BehaviorSubject<Plot[]>([]);
  recentExperiences = this._RecentActivitiesSubject.asObservable().pipe(distinctUntilChanged());

  // ...
  private _publishedWorksSubject = new BehaviorSubject<Plot[]>([]);
  userPublishedWork = this._publishedWorksSubject.asObservable().pipe(distinctUntilChanged());

  // ...
  private _draftedWorksSubject = new BehaviorSubject<Plot[]>([]);
  userDraftedWork = this._draftedWorksSubject.asObservable().pipe(distinctUntilChanged());

  constructor(private http: HttpClient, private notificationService: NotificationService) {
    http.head(this._url);
    http.options(this._url);
  }

  private handleError = handleServiceError;

  /**
   * @description Request to get all stories.
   * @returns HTTP GET request response.
   */
  fetchAllStories(): Observable<HTTPSuccessResponse<Plot[]>> {
    console.log('fetchAllStories >>');
    const url = `${this._url}/stories`;
    this._loading.next(true);

    // get user token
    const session = getUserCredentials(true, sessionStorage);
    console.log('fetch activities . session storage', session);
    const headers = new HttpHeaders().set('Token', `Bearer ${session.token}`);
    return (
      this.http
        .get<HTTPSuccessResponse<Plot[]>>(url, { headers })
        // Error Handling
        .pipe(catchError(this.handleError(this.notificationService)))

        .pipe(
          finalize(() => {
            this._loading.next(false);
            console.log("Request call 'All Story'. finalize() block executed");
          })
        )

        .pipe(
          tap((response: HTTPSuccessResponse<Plot[]>) => {
            this._AllStoriesSubject.next(response.data);
            return response;
          })
        )
    );
  }

  /**
   * @description A request to add a new story to the back-end.
   * @param body
   * @returns Observable<HTTPSuccessResponse>
   */
  addStory(body: { title: string; description: string; content: any }): Observable<any> {
    console.log('addStory >>');
    const url = `${this._url}/story`;
    this._loading.next(true);
    return (
      this.http
        .post<HTTPSuccessResponse>(url, body)
        // Error Handling
        .pipe(catchError(this.handleError(this.notificationService)))

        // Handle finalise
        .pipe(
          finalize(() => {
            this._loading.next(false);
            console.log("Request call 'Add Story'. finalize() block executed");
          })
        )

        // Handle Response
        .pipe(
          tap((response: HTTPSuccessResponse) => {
            console.log('add story ::: response', response);
            return response;
          })
        )
    );
  }

  /**
   * @description Request to update a story based on ID provided
   * @param headers
   * @param body
   * @returns Observable<HTTPSuccessResponse>
   */
  updateStoryRequest({ id, description, title, body }: { id: string; description: string; title: string; body: PlotContent }): Observable<HTTPSuccessResponse> {
    const url = `${this._url}/story`;
    const header = new HttpHeaders().set('id', id).set('description', description).set('title', title);

    return (
      this.http
        .put<HTTPSuccessResponse>(url, { content: body }, { headers: header })
        // Error Handling
        .pipe(catchError(this.handleError(this.notificationService)))

        // Handle finalise
        .pipe(
          finalize(() => {
            this._loading.next(false);
            console.log("Request call 'Update Story'. finalize() block executed");
          })
        )

        // Handle Response
        .pipe(
          tap((response: HTTPSuccessResponse) => {
            console.log('update story ::: response', response);
            return response;
          })
        )
    );
  }

  /**
   * Remove selected narrative object.
   * @param id the narrative string
   * @returns
   */
  deleteStoryRequest(id: string): Observable<HTTPSuccessResponse> {
    const url = `${this._url}/story`;
    const header = new HttpHeaders().set('id', id);
    return (
      this.http
        .delete<HTTPSuccessResponse>(url, { headers: header })
        .pipe(tap((response: HTTPSuccessResponse) => response))

        // Handle finalise
        .pipe(
          finalize(() => {
            this._loading.next(false);
            console.log("Request call 'Delete Story'. finalize() block executed");
          })
        )
    );
  }

  /**
   * Update what story we is being edited. Track what the user is using.
   * @param id root base story id
   * @returns
   */
  async updateEditingStory(id: string) {
    this._EditingStoryIDSubject.next(id);

    if (id === '') {
      this._EditingStorySubject.next(undefined);
      return;
    }

    if (!this._AllStoriesSubject?.value) {
      // NOTE: fetch data from database. Then
      await this.fetchAllStories().pipe(
        tap((response: HTTPSuccessResponse<Plot[]>) => {
          const stories = response.data;
          // Searching for story with id
          const story = stories.find((story: Plot) => (story.id === id ? story : undefined));
          this._EditingStorySubject.next(story);
        })
      );
      return;
    }

    // Note: search for story with id
    this._AllStoriesSubject.value?.find((story: Plot) => {
      if (story.id === id) this._EditingStorySubject.next(story);
    });
  }

  /**
   * @description Create a brand new story graph.
   */
  async createNewStoryGraph(id?: string): Promise<string | undefined> {
    const session = getUserCredentials(true, sessionStorage);
    if (!session.id) {
      // couldn't get session storage or user id. either way, there's a serious problem
      console.warn('Issue getting session storage');
      // TODO: warning
      this.notificationService.notifyUser('Error getting user information');
      return undefined;
    }

    const story: Plot = {
      id: id ?? createId(),
      description: 'Description text needed',
      title: 'Title of Story',
      creator: session.id,
      status: 'private',
      content: {
        id: createId(),
        name: 'Initial Content for story',
        description: 'Description not yet provided.',
        children: [
          {
            id: createId(),
            name: 'secondary',
            description: 'secondary description',
            children: [
              {
                id: createId(),
                name: 'tertiary',
                description: 'tertiary description',
              },
              {
                id: createId(),
                name: 'tertiary',
                description: 'tertiary description',
              },
            ],
          },
          {
            id: createId(),
            name: 'secondary',
            description: 'secondary description',
            children: [
              {
                id: createId(),
                name: 'tertiary',
                description: 'tertiary description',
              },
              {
                id: createId(),
                name: 'tertiary',
                description: 'tertiary description',
              },
            ],
          },
        ],
        graphics: undefined,
        characters: undefined,
      },
    };

    this._EditingStoryIDSubject.next(story.id);
    this._EditingStorySubject.next(story);
    return story.id;
  }

  /**
   * Get user activity. Content they have
   */
  fetchActivity(): Observable<HTTPSuccessResponse<Plot[]>> {
    const url = `${this._url}/activities`;
    this._loading.next(true);
    // let content: Plot[] = [];
    const session = getUserCredentials(true, sessionStorage);
    // console.log('fetch activities . session storage', session);
    const headers = new HttpHeaders().set('Token', `Bearer ${session.token}`).set('Id', session.id ?? '');
    // console.log('fetch activities . http headers', headers);

    return (
      this.http
        .get<HTTPSuccessResponse>(url, { headers })
        // Error Handling
        .pipe(catchError(this.handleError(this.notificationService)))

        // Handle finalise
        .pipe(
          finalize(() => {
            this._loading.next(false);
            console.log("Request call 'Update Story'. finalize() block executed");
          })
        )

        // Handle Response
        .pipe(
          tap((response: HTTPSuccessResponse<Plot[]>) => {
            console.log('fetch activities. user activities ::: response', response);
            // content = response.data;
            const drafted: Plot[] = [];
            const published: Plot[] = [];

            // sort
            // divide between drafts (belonging to user and not published), recent interactions (not belonging to user), completed (published works)
            response.data.forEach((plot) => {
              console.log('fetch activities. user activities ::: published', plot.published);
              return !!plot?.published ? published.push(plot) : drafted.push(plot);
            });
            this._publishedWorksSubject.next(published);
            this._draftedWorksSubject.next(drafted);
            return response;
          })
        )
    );
  }

  // get data for single story.
  getStoryRequest(id: string): Observable<HTTPSuccessResponse<Plot>> {
    console.info('getStoryRequest ...');
    const url = `${this._url}/story`;
    this._loading.next(true);

    // get user token
    const session = getUserCredentials(true, sessionStorage);
    const headers = new HttpHeaders().set('Token', `Bearer ${session.token}`).set('id', id);
    return (
      this.http
        .get<HTTPSuccessResponse<Plot>>(url, { headers })
        // Error Handling
        .pipe(
          catchError((err: any, caught: Observable<HTTPSuccessResponse<Plot>>) => {
            console.log(`get story with id:${id} not found`);
            if (err?.error?.message && err?.message) err.message = err?.error?.message;
            return this.handleError(this.notificationService)(err, caught);
          })
        )

        .pipe(
          finalize(() => {
            this._loading.next(false);
          })
        )

        .pipe(
          tap((response: HTTPSuccessResponse<Plot>) => {
            // update current active story
            this._EditingStoryIDSubject.next(response.data.id);
            this._EditingStorySubject.next(response.data);
            return response;
          })
        )
    );
  }
  AllStoriesState = (): Plot[] | undefined => this._AllStoriesSubject.value;
  EditingStoryState = (): Plot | undefined => this._EditingStorySubject.value;
  EditingStoryIdState = (): string | null => this._EditingStoryIDSubject.value;
  isLoadingState = (): boolean => this._loading.value;
  getRecentActivities = (): Plot[] | undefined => this._RecentActivitiesSubject.value;

  getUserPublishedWorks = (): Plot[] | undefined => this._publishedWorksSubject.value;
  getUserDraftedWorks = (): Plot[] | undefined => this._draftedWorksSubject.value;
}
