import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadService {
  private _Loading = new BehaviorSubject<boolean>(false);
  loadState = this._Loading.asObservable();
  constructor() { }

  startLoading() {
    this._Loading.next(true);
  }

  stopLoading() {
    this._Loading.next(false);
  }
}
