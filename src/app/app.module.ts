import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/* angular material */
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatCardModule } from '@angular/material';

/* router */
import { AppRoutingModule } from './app-routing.module';

/* requests */
import { HttpClientModule } from '@angular/common/http';

/* components */
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ButtonComponent } from './button/button.component';
import { UserCommentsComponent } from './user-comments/user-comments.component';
import { DummyComponentComponent } from './dummy-component/dummy-component.component';
import { MockStoryDashboardComponent } from './mock-story-dashboard/mock-story-dashboard.component';
import { MockStoryCharactersComponent } from './mock-story-characters/mock-story-characters.component';
import { MockStoryBoardComponent } from './mock-story-board/mock-story-board.component';
import { NavButtonComponent } from './nav-button/nav-button.component';
import { StoryChoiceSelectComponent } from './story-choice-select/story-choice-select.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ButtonComponent,
    UserCommentsComponent,
    DummyComponentComponent,
    MockStoryDashboardComponent,
    MockStoryCharactersComponent,
    MockStoryBoardComponent,
    NavButtonComponent,
    StoryChoiceSelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

/* angular material */
export class PizzaPartyAppModule { }

