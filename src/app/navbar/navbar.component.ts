import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Clipboard } from 'ts-clipboard';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { JwtHelper } from 'angular2-jwt';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private apiKey: string;

  constructor(public authService: AuthService,
    private router: Router,
    public toastr: ToastsManager,
    vcr: ViewContainerRef) {
      this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    const jwtHelper = new JwtHelper();
    const decodedToken = jwtHelper.decodeToken(this.authService.getAccessToken());
    this.authService.setLoggedInUserName(decodedToken.identity);
    this.authService.sendApiKeyRequest()
      .then((response) => {
        this.authService.setIsLoggedIn(true);
      })
      .catch((response) => {
        this.authService.setNewAccessTokenWithRefreshToken()
          .then((response) => {
            let responseDict = JSON.parse(response.text());
            this.authService.setAccessToken(responseDict.accessToken);
            this.authService.setIsLoggedIn(true);
          })
          .catch((response) => {
            // this.authService.setIsLoggedIn(false);
          })
      })
  }

  logout() {
    this.authService.logoutAccess()
      .then((response) => {
        this.authService.setIsLoggedIn(false);
        this.authService.setAccessToken("");
      })
      .catch((response) => {

      })

    this.authService.logoutRefresh()
      .then((response) => {
        this.authService.setRefreshToken("");
      })
      .catch((response) => {

      })
  }

  logoutClicked() {
    this.logout();
    this.router.navigateByUrl('/');
  }

  deleteClicked() {
    this.authService.deletAccount()
      .then((response) => {

      })
      .catch((response) => {

      })
    this.logout();
    this.router.navigateByUrl('/');
  }

  showSuccess() {
    this.toastr.success('Api key has been copied to the clipboard!', 'Success!');
  }

  apiKeyClicked() {
    this.apiKey = this.authService.getApiKey();

    Clipboard.copy(this.apiKey);
    this.showSuccess();
  }

}
