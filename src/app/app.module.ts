import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/* angular material */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

/* router */
import { AppRoutingModule } from './app-routing.module';

/* requests */
import { HttpClientModule } from '@angular/common/http';

/* components */
import { AppComponent } from './app.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { NavButtonComponent } from './shared/components/nav-button/nav-button.component';
import { CharacterPortraitComponent } from './shared/components/character-portrait/character-portrait.component';
import { NarrativeComponent } from './shared/components/narrative/narrative.component';
import { StartScreenComponent } from './shared/components/start-screen/start-screen.component';
import { InteractionComponent } from './shared/components/interaction/interaction.component';
import { EditorComponent } from './shared/components/editor/editor.component';

/* graph component */
import { NgxEchartsModule } from 'ngx-echarts';
import { PanelComponent } from './shared/components/panel/panel.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ButtonComponent,
    NavButtonComponent,
    CharacterPortraitComponent,
    NarrativeComponent,
    StartScreenComponent,
    InteractionComponent,
    EditorComponent,
    PanelComponent
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
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

/* angular material */
export class PizzaPartyAppModule { }

