import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ResolveEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavigationComponent } from "@core/navigation/navigation.component";
import { SnackBarNotificationComponent } from "@core/snack-bar-notification/snack-bar-notification.component";
import { invalidNavigationSideBarRoutes, invalidMiniFooterRoutes } from "./app.routes";
import { FooterComponent } from "@core/footer/footer.component";
import { MiniNavbarComponent } from "@core/mini-navbar/mini-navbar.component";

@Component({
    selector: "app-root",
    imports: [NavigationComponent, SnackBarNotificationComponent, CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FooterComponent, MiniNavbarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = "narration";
  navExpanded = false;
  displayNavigation = false;
  displayFooter = false;

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof ResolveEnd) this.checkRouteAllowsNavigation(event);
    });
  }

  /**
   * Check route url. Based on the url provided this function will disable the navigational bar /footer.
   * @param event Event_2 - Router Event
   */
  checkRouteAllowsNavigation(event: ResolveEnd): void {
    // check basic navigation header
    (invalidNavigationSideBarRoutes.includes(event.url)) ? this.displayNavigation = false : this.displayNavigation = true;
    // check mini footer
    (invalidMiniFooterRoutes.includes(event.url)) ? this.displayFooter = false : this.displayFooter = true;
  }

  routeAllowsFooter(event: ResolveEnd): void {
    
  }
}
