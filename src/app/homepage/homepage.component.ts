import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router/src/interfaces';
import { Observable } from 'rxjs/Observable';
import { Clipboard } from 'ts-clipboard';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) { }

  private isDataAvailable: boolean;

  ngOnInit() {}
}
