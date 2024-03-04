import { Routes } from "@angular/router";
import { EditorComponent } from "@components/editor-mode/editor/editor.component";
import { InteractionComponent } from "@components/interaction-mode/interaction/interaction.component";
import { NotFoundComponent } from '@pages/not-found/not-found.component';
import { InteractionDashboardComponent } from '@shared/components/interaction-mode/interaction-dashboard/interaction-dashboard.component';
import { EditingComponent } from '@shared/components/editor-mode/editing/editing.component'
import { RegisterComponent } from "@pages/register/register.component";
import { LoginComponent } from "@pages/login/login.component";
import { MainComponent } from "@pages/main/main.component";

export const routes: Routes = [
  // Create. Main, Login, Register.
  { path: "", component: MainComponent },
  { path: "editor", component: EditorComponent },
  { path: "interact", component: InteractionComponent },
  { path: 'interact/:id', component: InteractionDashboardComponent },
  { path: 'editor/:id', component: EditingComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];
