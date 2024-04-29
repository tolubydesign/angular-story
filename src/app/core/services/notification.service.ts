import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Notification = {
  message: string,
  action?: string
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  milliseconds: number = 1000;
  private _NotificationText = new BehaviorSubject<Notification>({ message: "", action: undefined });
  text = this._NotificationText.asObservable()
  timer: ReturnType<typeof setTimeout> = setTimeout(() => { }, this.milliseconds);

  constructor() { }

  notifyUser(message: string, action?: string) {
    this._NotificationText.next({ message, action });
  }
}
