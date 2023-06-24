import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import {
  Observable,
  of, Subscription,
  BehaviorSubject,
  distinctUntilChanged,
  tap,
  catchError,
  throwError,
  finalize,
} from "rxjs";
import { Plot } from '@shared/models/plot';

export type HTTPSuccessResponse<T = any> = {
  type: string,
  data: T,
  message: string,
}

type HTTPErrorResponse = {
  errorMessage: string,
  code: number,
}

@Injectable({
  providedIn: 'root'
})
export class StoriesService {
  private _url = "http://127.0.0.1:2100";

  private _loading = new BehaviorSubject<boolean>(false);
  isLoading = this._loading.asObservable().pipe(distinctUntilChanged());

  private _AllStoriesSubject = new BehaviorSubject<Plot[] | undefined>(undefined);
  stories = this._AllStoriesSubject.asObservable().pipe(distinctUntilChanged());

  private _EditingStorySubject = new BehaviorSubject<Plot | undefined>(undefined);
  editingStory = this._EditingStorySubject.asObservable().pipe(distinctUntilChanged());
  private _EditingStoryIDSubject = new BehaviorSubject<string>("");
  editingStoryId = this._EditingStoryIDSubject.asObservable().pipe(distinctUntilChanged());

  constructor(private http: HttpClient) {
    http.head(this._url)
    http.options(
      this._url
    )
  }

  /**
   * @description Request to get all stories. 
   * @returns 
   */
  fetchAllStories(): Observable<any> {
    const url = `${this._url}/stories`
    this._loading.next(true)
    return this.http.get<HTTPSuccessResponse<Plot[]>>(url)
      // Error Handling
      .pipe(catchError(this.handleError))

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
      .pipe(catchError(this.handleError))

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
  updateStory(headers: { id: string, description: string, title: string }, body: { content: any }): Observable<HTTPSuccessResponse> {
    const url = `${this._url}/story`

    const header = new HttpHeaders()
      .set("id", headers.id)
      .set("description", headers.description)
      .set("title", headers.title);

    return this.http.put<HTTPSuccessResponse>(url, body, { headers: header })
      // Error Handling
      .pipe(catchError(this.handleError))

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
  deleteStory(id: string): Observable<HTTPSuccessResponse> {
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
  updateEditingStory(id: string) {
    this._EditingStoryIDSubject.next(id);
    console.log('function call update editing story');

    if (id === "") {
      this._EditingStorySubject.next(undefined)
      return;
    }

    if (!this._AllStoriesSubject?.value) {
      // NOTE: fetch data from database. Then search for story with id
      this.fetchAllStories().pipe(tap((response: HTTPSuccessResponse<Plot[]>) => {
        const stories = response.data;
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

  private handleError = handleError;
  AllStoriesState = (): Plot[] | undefined => this._AllStoriesSubject.value;
  EditingStoryState = (): Plot | undefined => this._EditingStorySubject.value;
  EditingStoryIdState = (): string | null => this._EditingStoryIDSubject.value;
  isLoadingState = (): boolean => this._loading.value;
}

function handleError(error: HttpErrorResponse, caught: Observable<any>) {
  console.warn(error.message);
  // throw new Error(error.message);
  if (error.status === 0) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('ERROR:', error.error);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(
      `Backend returned code "${error.status}", body was: `, error.error);
  }
  // Return an observable with a user-facing error message.
  return throwError(() => new Error('Something bad happened; please try again later.'));
}