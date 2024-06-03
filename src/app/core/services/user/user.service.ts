import { UserCredentials } from "@shared/models/user.models";
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { BehaviorSubject, catchError, finalize, tap } from "rxjs";
import { NotificationService } from "@services/notification.service";
import { handleServiceError } from "@shared/utils/error-notification-handler";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _url = environment.BASE_API_URL;
  private _loading = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
  ) {
    http.head(this._url)
    http.options(
      this._url
    )
  }

  private handleError = handleServiceError

  login({ email, password }: { email: string, password: string }) {
    const url = `${this._url}/login`;
    return this.http.post<UserCredentials>(url, { email, password })
      .pipe(catchError(this.handleError(this.notificationService)))

      .pipe(finalize(() => {
        console.log("Login request finished");
      }))

      .pipe(tap((response: any) => {
        console.log('login request response', response);
        // save response
        return response
      }));
  }
}
