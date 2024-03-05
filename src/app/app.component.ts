import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavigationComponent } from "@core/navigation/navigation.component";
import { SnackBarNotificationComponent } from "@core/snack-bar-notification/snack-bar-notification.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [NavigationComponent, SnackBarNotificationComponent, CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = "angular-story";
  navExpanded = false;
}
