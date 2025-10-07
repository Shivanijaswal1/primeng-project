import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeatureModule } from './feature/feature.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { DialogService } from 'primeng/dynamicdialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { HighlightPipe } from './shared/pipe/highlight.pipe';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FeatureModule,
    BrowserAnimationsModule,
    FormsModule,
    MultiSelectModule,
    SelectButtonModule,
    AuthModule,
    SharedModule,

  ],
  providers: [
    HighlightPipe,
    DialogService,
    provideHttpClient(),
    ConfirmationService,
    MessageService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '893222406055-lgsugm5sr3h09po7uuc1flg002onr5h1.apps.googleusercontent.com',
              {
                oneTapEnabled: false,
                prompt: 'select_account',
              }
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
