import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '@environment/environment';
import { BehaviorSubject, catchError, finalize, Observable, tap } from "rxjs";
import { NotificationService } from "@services/notification.service";
import { handleServiceError } from "@shared/utils/error-notification-handler";
import { UserCredentials } from "@models/user.models";
import { setUserCredential, getUserCredentials } from "@helpers/session.storage";
import { HTTPSuccessResponse } from "@shared/models/http.model";
import { isPlatformBrowser } from "@angular/common";

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
    @Inject(PLATFORM_ID) public platformId: object
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
    let session: Storage | undefined = undefined;
    if (isPlatformBrowser(this.platformId)) {
      session = sessionStorage;
    } else {
      return false;
    };
    const { email, token } = getUserCredentials(true, session);
    return !!(email && token);
  }
}
