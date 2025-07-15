import { Component, NgZone,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../core/service.service';
 import {
   GoogleLoginProvider,
   SocialAuthService,
   SocialUser,
} from '@abacritt/angularx-social-login';
import { jwtDecode } from 'jwt-decode';
declare const google: any;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent  {
  user: SocialUser | null = null;
  loggedIn: boolean = false;
  constructor(private authService: SocialAuthService, private router: Router, private zone: NgZone,private ServiceService:ServiceService) {}

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: '893222406055-lgsugm5sr3h09po7uuc1flg002onr5h1.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
      ux_mode: 'popup', 
    });

    google.accounts.id.renderButton(
      document.getElementById('myGoogleButton'),
      {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        logo_alignment: 'left',
      }
    );
  }

  handleCredentialResponse(response: any): void {
    if (response.credential) {
      const user: any = jwtDecode(response.credential);
      console.log('[Google user decoded]', user);
      localStorage.setItem('user', JSON.stringify(user));
      this.zone.run(() => {
        this.router.navigate(['/student-detail']);
      });
    } else {
      console.warn('[No credential received]');
    }
  }


//  ngOnInit() {
//     this.authService.authState.subscribe((user: SocialUser | null) => {
//   console.log('[AUTH STATE]', user);
//   if (user) {
//     this.ServiceService.user = user;
//     this.zone.run(() => this.router.navigate(['/dashboard']));
//   } else {
//     console.warn('[NO USER]');
//   }
// });
//   }

}
