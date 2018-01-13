import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/map'
import { error } from 'util';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Promise } from 'q';

@Injectable()
export class AuthService {
  
  private baseUrl: string = 'https://movie-tracker-backend.herokuapp.com/';
  private jsonHeader: Headers = new Headers({ 'Content-Type': 'application/json' });

  private loggedInUsername: string;
  private isLoggedIn: boolean;

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getAccessToken(): string {
    return localStorage.getItem('accessToken');
  }

  setAccessToken(value: string): void {
    localStorage.setItem('accessToken', value);
  }
  
  setNewAccessTokenWithRefreshToken() {
    let url: string = `${this.baseUrl}/refresh-token`;
    const authHeader: Headers = new Headers({ 'Authorization': `Bearer ${this.getRefreshToken()}` });
    return this.http.get(url, { headers: authHeader }).toPromise();
  }

  getRefreshToken(): string {
    return localStorage.getItem('refreshToken');
  }

  setRefreshToken(value: string): void {
    localStorage.setItem('refreshToken', value);
  }

  setIsLoggedIn(value: boolean): void {
    this.isLoggedIn = value;
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  getLoggedInUserName(): string {
    return this.loggedInUsername;
  }

  setLoggedInUserName(value: string): void {
    this.loggedInUsername = value;
  }

  sendApiKeyRequest() {
    let url: string = `${this.baseUrl}/api-key`;
    const authHeader: Headers = new Headers({ 'Authorization': `Bearer ${this.getAccessToken()}` });
    return this.http.get(url, { headers: authHeader }).toPromise();
  }

  setApiKey(): void {
    this.sendApiKeyRequest()
      .then((response) => {
        let responseDict = JSON.parse(response.text())
        localStorage.setItem('apiKey', responseDict.apiKey);
      })
      .catch((response) => {
        
      })
  }

  getApiKey(): string {
    return localStorage.getItem('apiKey');
  }

  constructor(private http: Http, private router: Router) { }

  login(user) {
    let url: string = `${this.baseUrl}/login`;
    return this.http.post(url, user, { headers: this.jsonHeader }).toPromise();
  }

  logoutAccess() {
    const authHeader: Headers = new Headers({ 'Authorization': `Bearer ${this.getAccessToken()}` });
    let url: string = `${this.baseUrl}/logout-access`;
    return this.http.delete(url, { headers: authHeader }).toPromise();
  }

  logoutRefresh() {
    const authHeader: Headers = new Headers({ 'Authorization': `Bearer ${this.getRefreshToken()}` });
    let url: string = `${this.baseUrl}/logout-refresh`;
    return this.http.delete(url, { headers: authHeader }).toPromise();
  }

  deletAccount() {
    const authHeader: Headers = new Headers({ 'Authorization': `Bearer ${this.getAccessToken()}` });
    let url: string = `${this.baseUrl}/account`;
    return this.http.delete(url, { headers: authHeader }).toPromise();
  }

  register(user) {
    let url: string = `${this.baseUrl}/register`;
    return this.http.post(url, user, { headers: this.jsonHeader }).toPromise();
  }
}
