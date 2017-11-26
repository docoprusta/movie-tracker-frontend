import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logoutAccess()
    .then((response) => {
      this.authService.setLoggedIn(false);
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

}
