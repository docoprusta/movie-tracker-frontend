import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Clipboard } from 'ts-clipboard';
import { JwtHelper } from 'angular2-jwt';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(public authService: AuthService,
    private router: Router) {
  }

  ngOnInit() {
    if (this.authService.getAccessToken() != null && this.authService.getAccessToken() != "") {
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
              this.authService.setIsLoggedIn(false);
            })
        })
    }
  }

  logout() {
    this.authService.logoutAccess()
      .then((response) => {
        this.authService.setIsLoggedIn(false);
        this.authService.setAccessToken("");
      })
      .catch((response) => {
        this.authService.setIsLoggedIn(false);
      })

    this.authService.logoutRefresh()
      .then((response) => {
        this.authService.setIsLoggedIn(false);
        this.authService.setRefreshToken("");
      })
      .catch((response) => {
        this.authService.setIsLoggedIn(false);
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
}
