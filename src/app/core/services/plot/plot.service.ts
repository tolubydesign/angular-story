import { Injectable } from '@angular/core';
import { Observable, of, Subscription, BehaviorSubject, Subject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// import { HttpErrorResponse } from '@angular/common/http';
import { map, tap, retry, catchError } from 'rxjs/operators';
import { Plot, PlotContent } from '@models/plot';
import { PlotModel } from "@models/plot.model";
import { data } from '@models/tree-data.model';

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

  storyBehavior = new BehaviorSubject<PlotContent | undefined>(undefined);
  storyBehavior$ = this.storyBehavior.asObservable();

  // SUBJECT
  // 
  subject = new Subject(); // Plot 

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

  GetStory() {
    return this.http.get<PlotContent>("")
      .pipe(
        map((res: any) => {
          // (!) For later use.
          // if (!res.response) {
          //   throw new Error('No value provided.');
          // }
          
          // Using dummy data for the time
          this.dummyTree;

          console.log("Get Story:res", res)
          this.storyBehavior.next(res);

          return res;
        }),

        catchError((error: Error) => {
          return of([])
        })
      )
  }

  async closePanel() {
    return this.subject.next(null)
  }

  selectPlot(plotID: string) {
    /** 
     * Pass the handling of finding the correct `subject` to the relevant Class.
     * For cleaner code. */
    return this.subject.next(this.Plot?.selectPlot(plotID));
  }

  setNodesAndLinks() {
    const content = this.Plot?.selectedPlot?.content;
    if (content) {
      this.Plot?.setNodesAndLinks(content);
    }
  }
}
