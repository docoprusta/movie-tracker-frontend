import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class VideoService {

  constructor(private http: Http, private authService: AuthService) { }

  initVideos() {
    const authHeader: Headers =
      new Headers({ 'Authorization': `Bearer ${this.authService.getAccessToken()}` });
    const url: string = `${this.authService.getBaseUrl()}/videos`;
    return this.http.get(url, { headers: authHeader });
  }

  getVideos(): Observable<any> {
    const authHeader: Headers =
      new Headers({ 'Authorization': `Bearer ${this.authService.getAccessToken()}` });
    const url: string = `${this.authService.getBaseUrl()}/videos`;

    return Observable.interval(5000)
      .switchMap(() => this.http.get(url, { headers: new Headers({ 'Authorization': `Bearer ${this.authService.getAccessToken()}` }) }));
  }
}
