import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { ViewChild } from '@angular/core';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { Form } from '@angular/forms';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  user: User = new User();
  authError: boolean;
  fatalError: boolean;

  constructor(
    private auth: AuthService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService
  ) { }

  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  sendLoginRequest(): void {
    this.auth.login(this.user)
    .then((response) => {
      let responseDict = JSON.parse(response.text())
      this.auth.setAccessToken(responseDict.accessToken);
      this.auth.setRefreshToken(responseDict.refreshToken);
      this.auth.setApiKey();
      this.auth.setLoggedInUserName(this.user.username);
      this.router.navigateByUrl('/');
      this.auth.setIsLoggedIn(true);
      this.spinnerService.hide();
    })
    .catch((response) => {
      this.spinnerService.hide();
      if (response.status === 401) {
        this.authError = true;
      } else {
        this.fatalError = true;
      }
    });
  }

  onPasswordInputFocus() {
    this.authError = false;
    this.fatalError = false;
  }

  onUsernameInputFocus() {
    this.authError = false;
    this.fatalError = false;
  }

  onLogin(): void {
    this.spinnerService.show();
    this.captcha.reset();
    this.captcha.execute();
  }

  onCaptchaResponse(): void {
    this.user.reCaptchaResponse = this.captcha.getResponse().toString();
    this.sendLoginRequest();
  }

  ngOnInit() { }

}
