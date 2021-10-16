import { Injectable } from '@angular/core';
import { Observable, of, Subscription, BehaviorSubject, Subject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// import { HttpErrorResponse } from '@angular/common/http';
import { map, tap, retry, catchError } from 'rxjs/operators';
import { Plot, PlotContent } from '@models/plot';
import { PlotModel } from "@models/plot.model";

@Injectable({
  providedIn: 'root'
})
export class PlotService {

  Plot: PlotModel;

  // BEHAVIOUR SUBJECT
  plotData = new BehaviorSubject<Plot[]>(null);
  plotData$ = this.plotData.asObservable();

  // SUBJECT
  subject = new Subject(); // Plot 

  constructor(
    private http: HttpClient,
  ) { }

  /** getPlot is created by outside component. Should only be called once. */
  // get plot form mock api. Will be converted to live when ready. API and all
  getPlot() {
    return this.http.get<Plot[]>("assets/data/story-editor.json")
      .pipe(
        catchError((err) => {
          console.log('error caught in service')
          console.warn(err);
          //Handle the error here
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

  async closePanel() {
    return this.subject.next(null)
  }

  selectPlot(plotID) {
    /** 
     * Pass the handling of finding the correct `subject` to the relevant Class.
     * For cleaner code. */
    return this.subject.next(this.Plot.selectPlot(plotID));
  }

  setNodesAndLinks() {
    const content = this.Plot.selectedPlot.content;
    return this.Plot.setNodesAndLinks(content);
  }
}
