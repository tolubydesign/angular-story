import { Injectable } from '@angular/core';
import { Observable, of, Subscription, BehaviorSubject, Subject, throwError, Falsy } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// import { HttpErrorResponse } from '@angular/common/http';
import { map, tap, retry, catchError } from 'rxjs/operators';
import { Plot, PlotContent, PlotInstanceType } from '@models/plot';
import { PlotModel } from "@models/plot.model";
import { data } from '@models/tree-data.model';
import * as JSON5 from 'json5'

// import json5 from "json5";
// import { readFile } from "fs/promises";

// (async () => {
//     const text = await fs.readFile("./path/to/config.json5"); // path to config.json5 from entry point

//     const config = json5.parse(text);
// })();

@Injectable({
  providedIn: 'root'
})
export class PlotService {
  dummyTree = JSON.stringify(data);

  Plot: PlotModel | null = null;
  Story: PlotContent | undefined = undefined;

  storyJSON = "assets/data/stories.json";
  storyEditorJSON = "assets/data/story-editor.json";

  // BEHAVIOR SUBJECT
  plotData = new BehaviorSubject<Plot[] | undefined>(undefined);
  plotData$ = this.plotData.asObservable();

  storyBehavior = new BehaviorSubject<Plot[]>([]);
  storyBehavior$ = this.storyBehavior.asObservable();

  storyBehaviorSubject: BehaviorSubject<Plot | Falsy> = new BehaviorSubject<Plot | Falsy>(undefined);
  selectedPointer: BehaviorSubject<PlotContent | Falsy> = new BehaviorSubject<PlotContent | Falsy>(null);

  // Edit mode. Activate to edit content text like description, name ... 
  instanceEditSubject = new BehaviorSubject<{
    // type: PlotInstanceType,
    instance: PlotContent,
    parentInstanceId?: string,
  } | undefined>(undefined);
  $instanceEditSubject = this.instanceEditSubject.asObservable();

  // SUBJECT(S)
  // storySubject: Subject<Plot | undefined> = new Subject();

  constructor(
    private http: HttpClient,
  ) { }

  /** getPlot is created by outside component. Should only be called once. */
  // get plot form mock api. Will be converted to live when ready. API and all
  getPlot() {
    return this.http.get<Plot[]>(this.storyEditorJSON)
      .pipe(catchError((err) => {
        console.log('error caught in service')
        console.warn(err);
        //Handle the error here
        throw new Error(err);
        return throwError(err); // Rethrow it back to component
      })
      )
      .pipe(
        tap((res: Plot[]) => {
          console.log("(getPlot)", res);

          this.plotData.next(res);
          /** set new class to handle data and data manipulation */
          this.Plot = new PlotModel(res);
          return res;
        })
      )
  }

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
   * @description 
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

  selectInstance({ instance, parentInstanceId }: { instance: PlotContent, parentInstanceId?: string }) {
    this.instanceEditSubject.next({ instance, parentInstanceId });
  };

  closeInstancePanel() {
    console.log("function call close instance panel.")
    this.instanceEditSubject.next(undefined);
  };
}
