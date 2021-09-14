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
import { DashboardComponent } from './dashboard/dashboard.component';
import { ButtonComponent } from './button/button.component';
import { NavButtonComponent } from './nav-button/nav-button.component';
import { CharacterPortraitComponent } from './character-portrait/character-portrait.component';
import { NarrativeComponent } from './narrative/narrative.component';
import { StartScreenComponent } from './shared/components/start-screen/start-screen.component';
import { InteractionComponent } from './shared/components/interaction/interaction.component';
import { EditorComponent } from './shared/components/editor/editor.component';

/* graph component */
import { NgxEchartsModule } from 'ngx-echarts';

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
    EditorComponent
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

