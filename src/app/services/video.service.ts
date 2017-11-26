import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Headers, Http } from '@angular/http';

@Injectable()
export class VideoService {

  constructor(private http: Http, private authService: AuthService) { }

  getVideos(): Promise<any> {
    const authHeader: Headers = 
      new Headers({ 'Authorization': `Bearer ${this.authService.getAccessToken()}` });
    const url: string = `${this.authService.getBaseUrl()}/videos`;
    return this.http.get(url, { headers: authHeader }).toPromise();
  }

}
