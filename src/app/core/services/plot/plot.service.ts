import { Injectable } from '@angular/core';
import { Observable, of, Subscription, BehaviorSubject, Subject, throwError, Falsy } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// import { HttpErrorResponse } from '@angular/common/http';
import { map, tap, retry, catchError } from 'rxjs/operators';
import { Plot, PlotContent, PlotInstanceType } from '@models/plot';
import { PlotModel } from "@models/plot.model";
import { data } from '@models/tree-data.model';
import * as JSON5 from 'json5';
import * as uuid from "uuid";

@Injectable({
  providedIn: 'root'
})
export class PlotService {
  dummyTree = JSON.stringify(data);

  Plot: PlotModel | null = null;
  Story: PlotContent | undefined = undefined;

  storyJSON = "assets/data/stories.json";
  databaseUrl = ""

  // BEHAVIOR SUBJECT
  plotData = new BehaviorSubject<Plot[] | undefined>(undefined);
  plotData$ = this.plotData.asObservable();

  storyBehavior = new BehaviorSubject<Plot[]>([]);
  storyBehavior$ = this.storyBehavior.asObservable();

  storyBehaviorSubject: BehaviorSubject<Plot | Falsy> = new BehaviorSubject<Plot | Falsy>(undefined);
  selectedPointer: BehaviorSubject<PlotContent | Falsy> = new BehaviorSubject<PlotContent | Falsy>(null);

  // Edit mode. Activate to edit content text like description, name ... 
  instanceEditSubject = new BehaviorSubject<{
    instance: PlotContent,
    parentInstanceId?: string,
  } | undefined>(undefined);
  $instanceEditSubject = this.instanceEditSubject.asObservable();

  // SUBJECT(S)
  // storySubject: Subject<Plot | undefined> = new Subject();

  constructor(
    private http: HttpClient,
  ) { }

  GetStory(): Observable<Plot[]> {
    return this.http.get<PlotContent>(this.storyJSON)
      // Error  
      .pipe(
        catchError((error: Error, caught: Observable<any>) => {
          console.warn("Getting Stories Error:", error.message);
          throw new Error(error.message);
          return ([])
        })
      )
      // Request 
      .pipe(
        tap((res: Plot[]) => {
          console.info("Getting Stories map", res);
          return res;
        })
      )
  }

  /**
   * Request to get all Stories. These are false data. Stored in `/data`.
   * @param {string} id 
   * @returns {void}
   */
  UpdateStoryBehavior(id: string): void {
    console.log('function call update story behavior.')
    // update store
    this.GetStory().subscribe((response: Plot[]) => {
      (response && response.length) ? this.storyBehaviorSubject.next(response.find((ob: Plot) => ob.id === id)) : null
    });
  }

  /**
   * Create a brand new story graph.
   * @param id uuid of Story 
   */
  createStoryGraph(id: string) {
    const newStory: Plot = {
      id,
      description: "",
      title: "-",
      content: {
        id: uuid.v4(),
        name: "brand new",
        description: "-",
        children: undefined,
        graphics: undefined,
        characters: undefined,
      }
    }
    this.storyBehaviorSubject.next(newStory);
  }

  selectInstance({ instance, parentInstanceId }: { instance: PlotContent, parentInstanceId?: string }) {
    this.instanceEditSubject.next({ instance, parentInstanceId });
  };

  closeInstancePanel() {
    this.instanceEditSubject.next(undefined);
  };
}
