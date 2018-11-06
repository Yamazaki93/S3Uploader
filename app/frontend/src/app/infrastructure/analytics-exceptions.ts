import { ErrorHandler, Injectable } from '@angular/core';
import { AnalyticsService } from './services/analytics.service';
@Injectable()
export class AnalyticsExceptionHandler implements ErrorHandler {
    constructor(
        private analytics: AnalyticsService
    ) { }
    handleError(error) {
        this.analytics.exception(`UIException`);
        throw error;
    }
}
