import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

/* angular material */
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";

/* router */
import { AppRoutingModule } from "./app-routing.module";

/* requests */
import { HttpClientModule } from "@angular/common/http";

/* graph component */
// import { NgxEchartsModule } from 'ngx-echarts';

/* components */
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./shared/components/dashboard/dashboard.component";
import { ButtonComponent } from "./shared/components/button/button.component";
import { NavButtonComponent } from "./shared/components/nav-button/nav-button.component";
import { CharacterPortraitComponent } from "./shared/components/character-portrait/character-portrait.component";
import { NarrativeComponent } from "./shared/components/narrative/narrative.component";
import { StartScreenComponent } from "./shared/components/start-screen/start-screen.component";
import { InteractionComponent } from "./shared/components/interaction/interaction.component";
import { EditorComponent } from "./shared/components/editor/editor.component";
import { PanelComponent } from "./shared/components/panel/panel.component";
import { DagreComponent } from "./shared/components/d3/dagre/dagre.component";
import { SankeyComponent } from "./shared/components/d3/sankey/sankey.component";
import { DendrogramComponent } from "./shared/components/d3/dendrogram/dendrogram.component";
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { DashboardPanelComponent } from './shared/components/dashboard-panel/dashboard-panel.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { HierarchyComponent } from './shared/components/hierarchy/hierarchy.component';

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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

/* angular material */
export class PizzaPartyAppModule { }
