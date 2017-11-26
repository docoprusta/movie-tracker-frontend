import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/map'
import { error } from 'util';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router  } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.loggedIn;
  }

  private baseUrl: string = 'http://localhost:5000';
  private jsonHeader: Headers = new Headers({ 'Content-Type': 'application/json' });

  private loggedInUsername: string;
  private loggedIn: boolean;
  private accessToken: string;
  private refreshToken: string;
  private apiKey: string;
  
  getBaseUrl(): string {
    return this.baseUrl;
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  setAccessToken(value: string): void {
    this.accessToken = value;
  }

  setRefreshToken(value: string): void {
    this.refreshToken = value;
  }

  setLoggedIn(value: boolean): void {
    this.loggedIn = value;
  }

  getLoggedIn(): boolean {
    return this.loggedIn;
  }

  getLoggedInUserName(): string {
    return this.loggedInUsername;
  }

  setLoggedInUserName(value: string): void {
    this.loggedInUsername = value;
  }

  setApiKey(): void {
    let url: string = `${this.baseUrl}/api-key`;
    const authHeader: Headers = new Headers({ 'Authorization': `Bearer ${this.accessToken}` });

    this.http.get(url, { headers: authHeader }).toPromise()
      .then((response) => {
        let responseDict = JSON.parse(response.text())
        this.apiKey = responseDict.apiKey;
      })
      .catch((response) => {
        let responseDict = JSON.parse(response.text())
        this.apiKey = responseDict.apiKey;
      })
  }

  getApiKey(): string {
    console.log(this.apiKey);
    return this.apiKey;
  }

  constructor(private http: Http, private router: Router) { }

  login(user): Promise<any> {
    let url: string = `${this.baseUrl}/login`;
    return this.http.post(url, user, { headers: this.jsonHeader }).toPromise();
  }

  logoutAccess(): Promise<any> {
    console.log(this.accessToken);
    const authHeader: Headers = new Headers({ 'Authorization': `Bearer ${this.accessToken}` });
    let url: string = `${this.baseUrl}/logout-access`;
    return this.http.delete(url, { headers: authHeader }).toPromise();
  }

  logoutRefresh(): Promise<any> {
    const authHeader: Headers = new Headers({ 'Authorization': `Bearer ${this.refreshToken}` });
    let url: string = `${this.baseUrl}/logout-refresh`;
    return this.http.delete(url, { headers: authHeader}).toPromise();
  }

  deletAccount(): Promise<any> {
    const authHeader: Headers = new Headers({ 'Authorization': `Bearer ${this.accessToken}` });
    let url: string = `${this.baseUrl}/account`;
    return this.http.delete(url, { headers: authHeader}).toPromise();
  }

  register(user): Promise<any> {
    let url: string = `${this.baseUrl}/register`;
    return this.http.post(url, user, { headers: this.jsonHeader }).toPromise();
  }
}
