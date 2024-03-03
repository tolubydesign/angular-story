import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from "./shared/components/ui/button/button.component";
import { NavButtonComponent } from "./shared/components/ui/nav-button/nav-button.component";
import { NarrativeComponent } from "./shared/components/interaction-mode/narrative/narrative.component";
import { PanelComponent } from "./shared/components/extra/panel/panel.component";
import { DagreComponent } from "./shared/components/extra/d3-components/dagre/dagre.component";
import { SankeyComponent } from "./shared/components/extra/d3-components/sankey/sankey.component";
import { DendrogramComponent } from "./shared/components/extra/d3-components/dendrogram/dendrogram.component";
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardPanelComponent } from './shared/components/extra/dashboard-panel/dashboard-panel.component';
import { OptionalSelectionCardComponent } from './shared/components/ui/optional-selection-card/optional-selection-card.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        ButtonComponent,
        NavButtonComponent,
        NarrativeComponent,
        PanelComponent,
        DagreComponent,
        SankeyComponent,
        DendrogramComponent,
        NotFoundComponent,
        DashboardPanelComponent,
    ],
    providers: [],
    bootstrap: [],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatCardModule,
        MatListModule,
        HttpClientModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatInputModule,
        MatFormFieldModule,
        OptionalSelectionCardComponent,
        RouterModule
    ]
})
export class AppModule { }
