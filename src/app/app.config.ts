import { ApplicationConfig, Injectable, importProvidersFrom } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy, provideRouter } from '@angular/router';
import { routes } from '@app/app.routes';
import { Title, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }
  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`My Application | ${title}`);
    }
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {provide: TitleStrategy, useClass: TemplatePageTitleStrategy},
    // importProvidersFrom(AppRoutingModule),
    provideHttpClient(),
    provideClientHydration(),
  ]
};
