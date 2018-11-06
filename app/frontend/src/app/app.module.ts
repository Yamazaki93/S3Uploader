import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '../../node_modules/@angular/common';
import { FormsModule } from '../../node_modules/@angular/forms';
import { SimpleNotificationsModule, NotificationAnimationType } from '../../node_modules/angular2-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { AngularDraggableModule } from 'angular2-draggable';
import { JobViewModule } from './job-view/job-view.module';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TreeViewModule } from './tree-view/tree-view.module';
import { AwsAccountsModule } from './aws-accounts/aws-accounts.module';
import { SideHeaderComponent } from './side-header/side-header.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { RequestTrackingModule } from './request-tracking/request-tracking.module';
import { FolderBrowserModule } from './folder-browser/folder-browser.module';
import { FolderBrowserComponent } from './folder-browser/folder-browser/folder-browser.component';
import { HistoriesModule } from './histories/histories.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { AnalyticsExceptionHandler } from './infrastructure/analytics-exceptions';

const routes: Routes = [
  { path: 'home', component: WelcomePageComponent },
  { path: 'settings', component: SettingsPageComponent },
  {
    path: 'browse', children: [
      {
        path: '**', component: FolderBrowserComponent
      },
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    SideHeaderComponent,
    WelcomePageComponent,
    SettingsPageComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: true, useHash: true }
    ),
    FormsModule,
    SimpleNotificationsModule.forRoot({
      position: [
        'top',
        'right'
      ],
      timeOut: 0,
      // showProgressBar: false,
      icons: {
        // tslint:disable-next-line:max-line-length
        success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.7 5.3c-0.4-0.4-1-0.4-1.4 0l-10.3 10.3-4.3-4.3c-0.4-0.4-1-0.4-1.4 0s-0.4 1 0 1.4l5 5c0.2 0.2 0.4 0.3 0.7 0.3s0.5-0.1 0.7-0.3l11-11c0.4-0.4 0.4-1 0-1.4z"></path></svg>',
        // tslint:disable-next-line:max-line-length
        error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.4 12l5.3-5.3c0.4-0.4 0.4-1 0-1.4s-1-0.4-1.4 0l-5.3 5.3-5.3-5.3c-0.4-0.4-1-0.4-1.4 0s-0.4 1 0 1.4l5.3 5.3-5.3 5.3c-0.4 0.4-0.4 1 0 1.4 0.2 0.2 0.4 0.3 0.7 0.3s0.5-0.1 0.7-0.3l5.3-5.3 5.3 5.3c0.2 0.2 0.5 0.3 0.7 0.3s0.5-0.1 0.7-0.3c0.4-0.4 0.4-1 0-1.4l-5.3-5.3z"></path></svg>',
        // tslint:disable-next-line:max-line-length
        alert: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 1c-6.1 0-11 4.9-11 11s4.9 11 11 11 11-4.9 11-11-4.9-11-11-11zM12 21c-5 0-9-4-9-9s4-9 9-9c5 0 9 4 9 9s-4 9-9 9z"></path><path d="M12 7c-0.6 0-1 0.4-1 1v4c0 0.6 0.4 1 1 1s1-0.4 1-1v-4c0-0.6-0.4-1-1-1z"></path><path d="M11.3 15.3c-0.2 0.2-0.3 0.4-0.3 0.7s0.1 0.5 0.3 0.7c0.2 0.2 0.4 0.3 0.7 0.3s0.5-0.1 0.7-0.3c0.2-0.2 0.3-0.5 0.3-0.7s-0.1-0.5-0.3-0.7c-0.4-0.4-1-0.4-1.4 0z"></path></svg>',
        // tslint:disable-next-line:max-line-length
        info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 1c-6.1 0-11 4.9-11 11s4.9 11 11 11 11-4.9 11-11-4.9-11-11-11zM12 21c-5 0-9-4-9-9s4-9 9-9c5 0 9 4 9 9s-4 9-9 9z"></path><path d="M12 11c-0.6 0-1 0.4-1 1v4c0 0.6 0.4 1 1 1s1-0.4 1-1v-4c0-0.6-0.4-1-1-1z"></path><path d="M11.3 7.3c-0.2 0.2-0.3 0.4-0.3 0.7s0.1 0.5 0.3 0.7c0.2 0.2 0.4 0.3 0.7 0.3s0.5-0.1 0.7-0.3c0.2-0.2 0.3-0.4 0.3-0.7s-0.1-0.5-0.3-0.7c-0.4-0.4-1-0.4-1.4 0z"></path></svg>',
        // tslint:disable-next-line:max-line-length
        warn: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23 17.5l-8.4-14.2c-0.4-0.7-1.1-1.2-1.9-1.4s-1.6-0.1-2.3 0.3c-0.4 0.2-0.8 0.6-1 1 0 0 0 0 0 0l-8.4 14.3c-0.8 1.4-0.3 3.3 1.1 4.1 0.4 0.3 0.9 0.4 1.4 0.4h17c0.8 0 1.6-0.3 2.1-0.9 0.6-0.6 0.9-1.3 0.9-2.1-0.1-0.5-0.2-1.1-0.5-1.5zM21.2 19.7c-0.2 0.2-0.5 0.3-0.7 0.3h-17c-0.2 0-0.3 0-0.5-0.1-0.5-0.3-0.6-0.9-0.4-1.4l8.5-14.1c0.1-0.1 0.2-0.3 0.3-0.3 0.5-0.3 1.1-0.1 1.4 0.3l8.5 14.1c0.1 0.1 0.1 0.3 0.1 0.5 0.1 0.3-0.1 0.5-0.2 0.7z"></path><path d="M12 8c-0.6 0-1 0.4-1 1v4c0 0.6 0.4 1 1 1s1-0.4 1-1v-4c0-0.6-0.4-1-1-1z"></path><path d="M11.3 16.3c-0.2 0.2-0.3 0.4-0.3 0.7s0.1 0.5 0.3 0.7c0.2 0.2 0.4 0.3 0.7 0.3s0.5-0.1 0.7-0.3c0.2-0.2 0.3-0.5 0.3-0.7s-0.1-0.5-0.3-0.7c-0.4-0.4-1-0.4-1.4 0z"></path></svg>'
      },
      showProgressBar: false,
      animate: NotificationAnimationType.Fade,
      theClass: 'top-noti'
    }),
    BrowserAnimationsModule,
    AngularDraggableModule,
    InfrastructureModule,
    TreeViewModule,
    JobViewModule,
    AwsAccountsModule,
    AwsS3Module,
    RequestTrackingModule,
    FolderBrowserModule,
    HistoriesModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: AnalyticsExceptionHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
