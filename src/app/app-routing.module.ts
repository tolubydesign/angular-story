import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
/** COMPONENTS */
import { StartScreenComponent } from "./shared/components/pages/start-screen/start-screen.component";
import { EditorComponent } from "./shared/components/editor-mode/editor/editor.component";
import { InteractionComponent } from "./shared/components/interaction-mode/interaction/interaction.component";
import { NotFoundComponent } from './shared/components/pages/not-found/not-found.component';
import { DashboardPanelComponent } from './shared/components/extra/dashboard-panel/dashboard-panel.component';
import { InteractionDashboardComponent } from '@shared/components/interaction-mode/interaction-dashboard/interaction-dashboard.component';
import { EditingComponent } from '@shared/components/editor-mode/editing/editing.component'

// TODO: Refactor routing names
// TODO: Combine "editor"/"editing" routes to just 'edit' and 'edit/:id
// TODO: Rethink route names
// TODO: [?] Alter folder structure
const routes: Routes = [
  { path: "", component: StartScreenComponent },
  { path: "editor", component: EditorComponent },
  { path: "interaction", component: InteractionComponent },
  { path: 'dashboard', component: InteractionDashboardComponent },
  { path: 'dashboard/:id', component: InteractionDashboardComponent },
  { path: 'editing', component: EditingComponent },
  { path: 'editing/:id', component: EditingComponent },
  
  // 404 must be last
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
// export class AppRoutingModule { }
