import { Component } from "@angular/core";
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from "@core/navigation/navigation.component";
import { SnackBarNotificationComponent } from "@core/snack-bar-notification/snack-bar-notification.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, SnackBarNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = "angular-story";
}
