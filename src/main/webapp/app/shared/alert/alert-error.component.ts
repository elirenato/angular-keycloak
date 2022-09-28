import { Component, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { AlertError, ErrorResponseItem } from './alert-error.model';
import { Alert, AlertService } from 'app/core/util/alert.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';

@Component({
  selector: 'jhi-alert-error',
  templateUrl: './alert-error.component.html',
})
export class AlertErrorComponent implements OnDestroy {
  alerts: Alert[] = [];
  errorListener: Subscription;
  httpErrorListener: Subscription;

  constructor(private alertService: AlertService, private eventManager: EventManager, private translateService: TranslateService) {
    this.errorListener = eventManager.subscribe('angularkeycloakApp.error', (response: EventWithContent<unknown> | string) => {
      const errorResponse = (response as EventWithContent<AlertError>).content;
      this.addErrorAlert(errorResponse.message, errorResponse.key, errorResponse.params);
    });

    this.httpErrorListener = eventManager.subscribe('angularkeycloakApp.httpError', (response: EventWithContent<unknown> | string) => {
      const httpErrorResponse = (response as EventWithContent<HttpErrorResponse>).content;
      const errorResponse = httpErrorResponse.error;
      switch (httpErrorResponse.status) {
        // connection refused, server not reachable
        case 0:
          this.addErrorAlert('Server not reachable', 'error.server.not.reachable');
          break;
        case 404:
          this.addErrorAlert('Not found', 'error.url.not.found');
          break;
        default:
          if (errorResponse?.errorId) {
            console.error(errorResponse.errorId);
          }
          if (errorResponse.errors?.length) {
            errorResponse.errors.forEach((item: ErrorResponseItem) => {
              if (item.path && httpErrorResponse.status === 400) {
                const fieldName = this.translateService.instant(`angularkeycloakApp.${item.path}`);
                item.path = 'error.validationExceptionOnField';
                item.translationParams = {
                  fieldName,
                  detail: item.message.charAt(0).toUpperCase() + item.message.slice(1), // already transalated by backend
                };
              }
              this.addErrorAlert(item.message, item.path, item.translationParams);
            });
          } else if (errorResponse?.message != null) {
            this.addErrorAlert(errorResponse.message, errorResponse.message);
          } else {
            this.addErrorAlert(errorResponse, errorResponse);
          }
          break;
      }
    });
  }

  setClasses(alert: Alert): { [key: string]: boolean } {
    const classes = { 'jhi-toast': Boolean(alert.toast) };
    if (alert.position) {
      return { ...classes, [alert.position]: true };
    }
    return classes;
  }

  ngOnDestroy(): void {
    this.eventManager.destroy(this.errorListener);
    this.eventManager.destroy(this.httpErrorListener);
  }

  close(alert: Alert): void {
    alert.close?.(this.alerts);
  }

  private addErrorAlert(message?: string, translationKey?: string, translationParams?: { [key: string]: unknown }): void {
    this.alertService.addAlert({ type: 'danger', message, translationKey, translationParams }, this.alerts);
  }
}
