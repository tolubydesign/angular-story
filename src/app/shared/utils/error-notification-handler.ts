import { HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { NotificationService } from "@services/notification.service";

/**
 * Reusable Error handler service function.
 * Error message is sent to Notification Service.
 * @param notificationService
 * 
 * @param error
 * @param caught
 * @returns 
 */
export const handleServiceError = (notificationService: NotificationService) => (error: HttpErrorResponse, caught: Observable<any>): Observable<never> => {
  notificationService.notifyUser(error.message);

  if (error.status === 0) {
    // A client-side or network error occurred. Handle it accordingly.
    console.warn('client-side or network error', error.error);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.warn(`Backend returned code "${error.status}", body was: `, error.error);
  }

  // Return an observable with a user-facing error message.
  return throwError(() => error);
};
