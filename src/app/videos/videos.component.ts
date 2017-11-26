import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { VideoService } from '../services/video.service';
import { Video } from '../models/video';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {
  private apiKey: string;
  private video = new Video();
  constructor(private authService: AuthService, private videoService: VideoService) { }

  ngOnInit() {
    this.videoService.getVideos()
    .then((response) => {
      const responseDict = JSON.parse(response.text());
      console.log(responseDict);
      this.video.closeDate = responseDict[0].closeDate;
      this.video.duration = responseDict[0].duration;
      this.video.lastPosition = responseDict[0].lastPosition;
      this.video.title = responseDict[0].title;
    })
    .catch()

    console.log(this.video);
  }

  ShowApiKeyClicked() {
    this.apiKey = this.authService.getApiKey();
  }

}
