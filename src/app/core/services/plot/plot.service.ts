import { Injectable } from '@angular/core';
import { Observable, of, Subscription, BehaviorSubject, Subject, throwError, Falsy } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// import { HttpErrorResponse } from '@angular/common/http';
import { map, tap, retry, catchError } from 'rxjs/operators';
import { Plot, PlotContent } from '@models/plot';
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

  // BEHAVIOR SUBJECT
  plotData = new BehaviorSubject<Plot[] | undefined>(undefined);
  plotData$ = this.plotData.asObservable();
  storyBehavior = new BehaviorSubject<Plot[]>([]);
  storyBehavior$ = this.storyBehavior.asObservable();
  storyBehaviorSubject: BehaviorSubject<Plot | Falsy> = new BehaviorSubject<Plot | Falsy>(undefined);
  selectedPointer: BehaviorSubject<PlotContent | Falsy> = new BehaviorSubject<PlotContent | Falsy>(null);
  

  // SUBJECT(S)
  // storySubject: Subject<Plot | undefined> = new Subject();

  constructor(
    private http: HttpClient,
  ) { }

  /** getPlot is created by outside component. Should only be called once. */
  // get plot form mock api. Will be converted to live when ready. API and all
  getPlot() {
    return this.http.get<Plot[]>("assets/data/story-editor.json")
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
    return this.http.get<PlotContent>("assets/data/stories.json")
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
          console.log("Getting Stories map", res);
          return res;
        })
      )
    // return this.http.get<PlotContent>("assets/data/stories.json")
    //   .pipe(
    //     map((res: any) => {
    //       // Error handling
    //       // (!) For later use.
    //       // if (!res.response) {
    //       //   throw new Error('No value provided.');
    //       // }
    //       this.storyBehavior.next(res);
    //       console.log("Getting Stories map", res);
    //       return res;
    //     }),

    //     catchError((error: Error, caught: Observable<any>) => {
    //       console.warn("Getting Stories Error:", error.message);
    //       return of([])
    //     })
    //   )
  }

  UpdateStorySubject() {

  }

  Initialization() {

  }
  // setNodesAndLinks() {
  //   const content = this.Plot?.selectedPlot?.content;
  //   if (content) {
  //     this.Plot?.setNodesAndLinks(content);
  //   }
  // }
}
