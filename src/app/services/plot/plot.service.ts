import { Injectable } from '@angular/core';
import { Observable, of, Subscription, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { map, tap, retry } from 'rxjs/operators';
import { Plot } from '@models/plot';
// import { uuid } from 'uuidv4'; 
// import { atob } from 'atob';


@Injectable({
  providedIn: 'root'
})
export class PlotService {

  fullPlot = './../../../assets/data/story-editor.json';

  plotData = new BehaviorSubject<Plot[]>(null);
  plotData$ = this.plotData.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  getPlot() {
    return this.http.get<Plot[]>(this.fullPlot).pipe(
      tap((res: Plot[]) => {
        this.plotData.next(res);
        console.log('(getPlot)', this.plotData.getValue());
        return res;
      })
    )
  }


}