import { Routes } from "@angular/router";
import { EditorComponent } from "@components/editor-mode/editor/editor.component";
import { InteractionComponent } from "@components/interaction-mode/interaction/interaction.component";
import { NotFoundComponent } from '@pages/not-found/not-found.component';
import { InteractionDashboardComponent } from '@shared/components/interaction-mode/interaction-dashboard/interaction-dashboard.component';
import { EditingComponent } from '@shared/components/editor-mode/editing/editing.component'
import { RegisterComponent } from "@pages/register/register.component";
import { LoginComponent } from "@pages/login/login.component";
import { MainComponent } from "@pages/main/main.component";
import { routeGuard } from "@core/guard/route.guard";
import { HomeComponent } from "@pages/home/home.component";

export const routes: Routes = [
  { path: "", title: 'Home', component: HomeComponent, canActivate: [routeGuard] },
  { path: "main", title: 'Main', component: MainComponent },
  { path: 'register', title: 'Register Account', component: RegisterComponent },
  { path: 'login', title: 'Login', component: LoginComponent },
  // Work pagers
  { path: "editor", title: 'Editor', component: EditorComponent, canActivate: [routeGuard] },
  { path: 'editor/:id', title: 'Interaction With ', component: EditingComponent, canActivate: [routeGuard], },
  { path: "interact", title: 'Interaction', component: InteractionComponent, canActivate: [routeGuard], },
  { path: 'interact/:id', component: InteractionDashboardComponent, canActivate: [routeGuard], },
  // 404 must be last
  { path: '404', title: 'Page Not Found', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];

export const invalidNavigationBarRoutes: string[] = ['/login', '/register'];
