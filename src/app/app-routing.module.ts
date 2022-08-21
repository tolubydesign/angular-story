import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
/** COMPONENTS */
import { StartScreenComponent } from "./shared/components/start-screen/start-screen.component";
import { EditorComponent } from "./shared/components/editor/editor.component";
import { InteractionComponent } from "./shared/components/interaction/interaction.component";
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { DashboardPanelComponent } from './shared/components/dashboard-panel/dashboard-panel.component';

const routes: Routes = [
  { path: "", component: StartScreenComponent },
  { path: "editor", component: EditorComponent },
  { path: "interaction", component: InteractionComponent },
  { path: "panel", component: DashboardPanelComponent },
  { path: "panel/:id", component: DashboardPanelComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
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
