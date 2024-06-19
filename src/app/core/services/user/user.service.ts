import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { BehaviorSubject, catchError, finalize, tap } from "rxjs";
import { NotificationService } from "@services/notification.service";
import { handleServiceError } from "@shared/utils/error-notification-handler";
import { UserCredentials } from "@models/user.models";
import { setUserCredential, getUserCredentials } from "@helpers/session.storage";
import { HTTPSuccessResponse } from "@shared/models/http.model";

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

      .pipe(tap((response: HTTPSuccessResponse<UserCredentials>) => {
        console.log('login request response', response);
        setUserCredential({
          username: response.data.username,
          token: response.data.token,
          email: response.data.email,
          role: response.data.role,
        })
        return response
      }));
  }

  isLoggedIn(): boolean {
    const { email, role, token, username } = getUserCredentials();
    if (email && role && token && username) {
      return true
    };
    return false
  }
}
