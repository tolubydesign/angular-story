import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { BehaviorSubject, catchError, finalize, Observable, tap } from "rxjs";
import { NotificationService } from "@services/notification.service";
import { handleServiceError } from "@shared/utils/error-notification-handler";
import { UserCredentials } from "@models/user.models";
import { setUserCredential, getUserCredentials } from "@helpers/session.storage";
import { HTTPSuccessResponse } from "@shared/models/http.model";

type UserRegisterInfo = {
  email: string,
  password: string,
  forename: string,
  surname: string
}

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

  login({ email, password }: { email: string, password: string }): Observable<HTTPSuccessResponse<UserCredentials> | HttpErrorResponse> {
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

  register({email, password, forename, surname }: UserRegisterInfo): Observable<HTTPSuccessResponse<UserCredentials> | HttpErrorResponse> {
    const url = `${this._url}/register`;

    return this.http.post<UserCredentials>(url, { 
      email, 
      password, 
      "name": forename,
      "surname": surname,
      "username": ""
    })
      .pipe(catchError(this.handleError(this.notificationService)))

      .pipe(finalize(() => {
        console.log("User Registration request finished");
      }))

      .pipe(tap((response: HTTPSuccessResponse<UserCredentials>) => {
        console.log('register request response', response);
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
    const { email, token } = getUserCredentials();
    return !!(email && token);
  }
}
