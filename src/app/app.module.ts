import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from '@angular/core';

/* angular material */
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

/* router */
import { AppRoutingModule } from "./app-routing.module";

/* requests */
import { HttpClientModule } from "@angular/common/http";

/* graph component */
// import { NgxEchartsModule } from 'ngx-echarts';

/* form */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* components */
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./shared/components/interaction-mode/dashboard/dashboard.component";
import { ButtonComponent } from "./shared/components/ui/button/button.component";
import { NavButtonComponent } from "./shared/components/ui/nav-button/nav-button.component";
import { CharacterPortraitComponent } from "./shared/components/ui/character-portrait/character-portrait.component";
import { NarrativeComponent } from "./shared/components/interaction-mode/narrative/narrative.component";
import { StartScreenComponent } from "./shared/components/pages/start-screen/start-screen.component";
import { InteractionComponent } from "./shared/components/interaction-mode/interaction/interaction.component";
import { EditorComponent } from "./shared/components/editor-mode/editor/editor.component";
import { PanelComponent } from "./shared/components/extra/panel/panel.component";
import { DagreComponent } from "./shared/components/extra/d3-components/dagre/dagre.component";
import { SankeyComponent } from "./shared/components/extra/d3-components/sankey/sankey.component";
import { DendrogramComponent } from "./shared/components/extra/d3-components/dendrogram/dendrogram.component";
import { NotFoundComponent } from './shared/components/pages/not-found/not-found.component';
import { DashboardPanelComponent } from './shared/components/extra/dashboard-panel/dashboard-panel.component';
import { LoaderComponent } from './shared/components/ui/loader/loader.component';
import { HierarchyComponent } from './shared/components/extra/hierarchy/hierarchy.component';
import { OptionalSelectionCardComponent } from './shared/components/ui/optional-selection-card/optional-selection-card.component';
import { InteractionDashboardComponent } from './shared/components/interaction-mode/interaction-dashboard/interaction-dashboard.component';
import { StoryBoardComponent } from './shared/components/interaction-mode/story-board/story-board.component';
import { EditingComponent } from './shared/components/editor-mode/editing/editing.component';
import { NodeFormComponent } from './shared/components/editor-mode/node-form/node-form.component';
import { SnackBarNotificationComponent } from './core/snack-bar-notification/snack-bar-notification.component';

@NgModule({
  declarations: [
    // Components
    AppComponent,
    DashboardComponent,
    ButtonComponent,
    NavButtonComponent,
    CharacterPortraitComponent,
    NarrativeComponent,
    StartScreenComponent,
    InteractionComponent,
    EditorComponent,
    PanelComponent,
    DagreComponent,
    SankeyComponent,
    DendrogramComponent,
    NotFoundComponent,
    DashboardPanelComponent,
    LoaderComponent,
    HierarchyComponent,
    OptionalSelectionCardComponent,
    InteractionDashboardComponent,
    StoryBoardComponent,
    EditingComponent,
    NodeFormComponent,
    SnackBarNotificationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatListModule,
    HttpClientModule,
    MatIconModule,
    // NgxEchartsModule.forRoot({
    //   echarts: () => import('echarts')
    // }),
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

/* angular material */
export class PizzaPartyAppModule { }
