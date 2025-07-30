import { Component, NgZone,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../core/service.service';
 import {
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
    name: string = '';
    password:string='';
  user: SocialUser | null = null;
  loggedIn: boolean = false;
  constructor(private authService: SocialAuthService, private router: Router, private zone: NgZone, private ServiceService: ServiceService) {}

  ngAfterViewInit(): void {
  if (typeof google !== 'undefined') {
    this.initializeGoogleLogin();
  } else {
    setTimeout(() => this.ngAfterViewInit(), 100);
  }
}

initializeGoogleLogin(): void {
  google.accounts.id.initialize({
    client_id: '893222406055-lgsugm5sr3h09po7uuc1flg002onr5h1.apps.googleusercontent.com',
    callback: (response: any) => this.handleCredentialResponse(response),
    ux_mode: 'popup',
  });
  google.accounts.id.renderButton(
    document.getElementById('myGoogleButton'),
    {
      // theme: 'outline',
      size: 'large',
      text: 'Login _with',
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
}
