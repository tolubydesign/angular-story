import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService, Notification } from '@services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-snack-bar-notification',
  templateUrl: './snack-bar-notification.component.html',
  styleUrls: ['./snack-bar-notification.component.scss'],
})
export class SnackBarNotificationComponent implements OnInit, OnDestroy {
  duration = 5;
  private _notificationSubscription: Subscription | undefined;

  constructor(
    private notificationService: NotificationService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this._notificationSubscription = this.notificationService.text.subscribe(({ message, action }: Notification) => {
      this.openSnackBar(message, action);
    })
  }

  ngOnDestroy(): void {
    this._notificationSubscription?.unsubscribe();
  }

  openSnackBar(message: string, action: string = 'Dismiss') {
    if (message.length > 1) {
      this._snackBar.open(message, action, {
        duration: this.duration * 1000,
      });
    } else {
      this._snackBar?.dismiss();
    }
  }
}

@Component({
  selector: 'snack-bar-component-notification',
  template: "",
  styles: [
    `
    .example-pizza-party {
      color: hotpink;
    }
  `,
  ],
  standalone: true,
})
export class SnackBarComponentNotification { }
