import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ResolveEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavigationComponent } from "@core/navigation/navigation.component";
import { SnackBarNotificationComponent } from "@core/snack-bar-notification/snack-bar-notification.component";
import { invalidNavigationBarRoutes } from "./app.routes";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [NavigationComponent, SnackBarNotificationComponent, CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = "narration";
  navExpanded = false;
  displayNavigation = true;

  constructor(
    private router: Router
  ) {
    router.events.subscribe((event) => {
      if (event instanceof ResolveEnd) {
        this.checkRouteAllowsNavigation(event);
      }
    });
  }

  /**
   * Check route url. Based on the url provided this function will disable the navigational bar.
   * @param event Event_2 - Router Event
   */
  checkRouteAllowsNavigation(event: ResolveEnd): void {
    (invalidNavigationBarRoutes.includes(event.url)) ? this.displayNavigation = false : this.displayNavigation = true;
  }
}
