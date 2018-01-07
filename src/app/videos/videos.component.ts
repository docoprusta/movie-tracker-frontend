import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { VideoService } from '../services/video.service';
import { Video } from '../models/video';
import { Observable } from 'rxjs/Rx';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { Router } from '@angular/router';
import * as TitleParser from 'parse-torrent-name';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {
  private videosSubscription;
  private apiKey: string;
  public videos = new Array<Video>();
  public closeDateAsc: boolean = true;
  public closeDateDes: boolean;
  public titleAsc: boolean;
  public titleDes: boolean;
  public seasonAsc: boolean;
  public seasonDes: boolean;
  public episodeAsc: boolean;
  public episodeDes: boolean;
  public lastPositionAsc: boolean;
  public lastPositionDes: boolean;
  public durationAsc: boolean;
  public durationDes: boolean;

  constructor(private authService: AuthService, private videoService: VideoService, private router: Router) {}

  minTwoDigits(n): string {
    return (n < 10 ? '0' : '') + n;
  }

  secondsToTimeString(secondsString: string): string {
    let secondsInt = +secondsString;
    let hours = Math.floor(+secondsInt / 3600);
    secondsInt %= 3600;
    let minutes = Math.floor(secondsInt / 60);
    let seconds = secondsInt % 60;
    return `${this.minTwoDigits(hours)}:${this.minTwoDigits(minutes)}:${this.minTwoDigits(seconds)}`;
  }

  initVideos() {
    this.videoService.initVideos().subscribe((response) => {
      const responseDict = JSON.parse(response.text());

      let videos: Video[] = [];

      for (var i = 0; i < responseDict.length; i++) {
        let newVideo = new Video();
        newVideo.imageUrl = responseDict[i].imageUrl;
        newVideo.closeDate = responseDict[i].closeDate;
        newVideo.duration = this.secondsToTimeString(responseDict[i].duration);
        newVideo.lastPosition = this.secondsToTimeString(responseDict[i].lastPosition);
        newVideo.fullTitle = responseDict[i].title;
        const parsedTitle = TitleParser(responseDict[i].title)
        newVideo.title = parsedTitle.title;
        newVideo.season = parsedTitle.season;
        newVideo.episode = parsedTitle.episode;

        videos.push(newVideo);
      }

      this.videos = videos;
    })
  }

  subscribeForVideos() {
    const jwtHelper = new JwtHelper();
    const decodedToken = jwtHelper.decodeToken(this.authService.getAccessToken());
    
    this.videosSubscription = this.videoService.getVideos()
    .subscribe((response) => {

      const jwtHelper = new JwtHelper();
      const decodedToken = jwtHelper.decodeToken(this.authService.getAccessToken());
      if ((decodedToken.exp - Math.round(+Date.now()/1000)) <= 5) {
        this.authService.setNewAccessTokenWithRefreshToken()
        .then((response) => {
          let responseDict = JSON.parse(response.text());
          this.authService.setAccessToken(responseDict.accessToken);
          this.authService.setIsLoggedIn(true);
        })
        .catch((response) => {
          // this.authService.setIsLoggedIn(false);
        })
      }
      const responseDict = JSON.parse(response.text());

      let videos: Video[] = [];

      for (var i = 0; i < responseDict.length; i++) {
        let newVideo = new Video();
        newVideo.imageUrl = responseDict[i].imageUrl;
        newVideo.closeDate = responseDict[i].closeDate;
        newVideo.duration = this.secondsToTimeString(responseDict[i].duration);
        newVideo.lastPosition = this.secondsToTimeString(responseDict[i].lastPosition);
        newVideo.fullTitle = responseDict[i].title;
        const parsedTitle = TitleParser(responseDict[i].title);
        newVideo.title = parsedTitle.title;
        newVideo.season = parsedTitle.season;
        newVideo.episode = parsedTitle.episode;

        videos.push(newVideo);
      }

      let thisVideosCopy = this.videos.map(x => Object.assign({}, x));
      let videosCopy = videos.map(x => Object.assign({}, x));
      thisVideosCopy.sort((x, y) => {
        if (x.closeDate < y.closeDate) {
          return -1;
        }
        if (x.closeDate > y.closeDate) {
          return 1;
        }
        return 0;
      })
      videosCopy.sort((x, y) => {
        if (x.closeDate < y.closeDate) {
          return -1;
        }
        if (x.closeDate > y.closeDate) {
          return 1;
        }
        return 0;
      })

      if (JSON.stringify(thisVideosCopy) !== JSON.stringify(videosCopy)) {
        this.videos = videos;
        this.sortBySelected();
      }
    })
  }

  ngOnInit() {
    const jwtHelper = new JwtHelper();
    const decodedToken = jwtHelper.decodeToken(this.authService.getAccessToken());
    this.authService.setLoggedInUserName(decodedToken.identity);
    if ((decodedToken.exp - Math.round(+Date.now()/1000)) <= 5) {
      this.authService.setNewAccessTokenWithRefreshToken()
      .then((response) => {
        let responseDict = JSON.parse(response.text())
        this.authService.setAccessToken(responseDict.accessToken);
        this.authService.setIsLoggedIn(true);
      })
      .catch((response) => {
        // this.authService.setIsLoggedIn(false);
      })
    }

    this.authService.sendApiKeyRequest()
    .then((response) => {
      this.authService.setIsLoggedIn(true);
      this.initVideos();
      this.subscribeForVideos();
    })
    .catch((response) => {
      this.authService.setNewAccessTokenWithRefreshToken()
      .then((response) => {
        let responseDict = JSON.parse(response.text())
        this.authService.setAccessToken(responseDict.accessToken);
        this.authService.setIsLoggedIn(true);
        this.initVideos();
        this.subscribeForVideos();
      })
      .catch((response) => {
        // this.authService.setIsLoggedIn(false);
      })
    })
  }

  ngOnDestroy() {
    if (this.videosSubscription != null) {
      this.videosSubscription.unsubscribe();
    }
  }

  closeDateClicked() {
    if (this.closeDateAsc) {
      this.sortByDateDes();
    }
    else if (this.closeDateDes) {
       this.sortByDateAsc();
    } else {
      this.sortByDateAsc();
    }
    this.setEveryOtherSortingBooleanToFalse("closeDate");
  }

  seasonClicked() {
    if (this.seasonAsc) {
      this.sortBySeasonDes();
    }
    else if (this.seasonDes) {
       this.sortBySeasonAsc();
    } else {
      this.sortBySeasonAsc();
    }
    this.setEveryOtherSortingBooleanToFalse("season");
  }

  episodeClicked() {
    if (this.episodeAsc) {
      this.sortByEpisodeDes();
    }
    else if (this.episodeDes) {
       this.sortByEpisodeAsc();
    } else {
      this.sortByEpisodeAsc();
    }
    this.setEveryOtherSortingBooleanToFalse("episode");
  }


  titleClicked() {
    if (this.titleAsc) {
      this.sortByTitleDes();
    } 
    else if (this.titleDes) {
      this.sortByTitleAsc();
    } else {
      this.sortByTitleAsc();
    }
    this.setEveryOtherSortingBooleanToFalse("title");    
  }

  lastPositionClicked() {
    if (this.lastPositionAsc) {
      this.sortByLastPostitionDes();
    } else if (this.lastPositionDes) {
      this.sortByLastPostitionAsc();
    } else {
      this.sortByLastPostitionAsc();
    }
    this.setEveryOtherSortingBooleanToFalse("lastPosition");        
  }

  durationClicked() {
    if (this.durationAsc) {
      this.sortByDurationDes();
    } else if (this.durationDes) {
      this.sortByDurationAsc();
    } else {
      this.sortByDurationAsc();
    }
    this.setEveryOtherSortingBooleanToFalse("duration");        
  }

  sortByDateAsc() {
    this.videos.sort((x, y) => {
      if (x.closeDate < y.closeDate) {
        return 1;
      }
      if (x.closeDate > y.closeDate) {
        return -1;
      }
      return 0;
    })
    this.closeDateAsc = true;
    this.closeDateDes = false;
  }

  sortByDateDes() {
    this.videos.sort((x, y) => {
      if (x.closeDate < y.closeDate) {
        return -1;
      }
      if (x.closeDate > y.closeDate) {
        return 1;
      }
      return 0;
    })
    this.closeDateAsc = false;
    this.closeDateDes = true;
  }

  sortByTitleAsc() {
    this.videos.sort((x, y) => {
      if (x.fullTitle < y.fullTitle) {
        return 1;
      }
      if (x.fullTitle > y.fullTitle) {
        return -1;
      }
      return 0;
    })
    this.titleAsc = true;
    this.titleDes = false;
  }

  sortByTitleDes() {
    this.videos.sort((x, y) => {
      if (x.fullTitle < y.fullTitle) {
        return -1;
      }
      if (x.fullTitle > y.fullTitle) {
        return 1;
      }
      return 0;
    })
    this.titleAsc = false;
    this.titleDes = true;
  }

  sortBySeasonAsc() {
    this.videos.sort((x, y) => {
      if (x.season < y.season) {
        return 1;
      }
      if (x.season > y.season) {
        return -1;
      }
      return 0;
    })
    this.seasonAsc = true;
    this.seasonDes = false;
  }

  sortBySeasonDes() {
    this.videos.sort((x, y) => {
      if (x.season < y.season) {
        return -1;
      }
      if (x.season > y.season) {
        return 1;
      }
      return 0;
    })
    this.seasonAsc = false;
    this.seasonDes = true;
  }

  sortByEpisodeAsc() {
    this.videos.sort((x, y) => {
      if (x.episode < y.episode) {
        return 1;
      }
      if (x.episode > y.episode) {
        return -1;
      }
      return 0;
    })
    this.episodeAsc = true;
    this.episodeDes = false;
  }

  sortByEpisodeDes() {
    this.videos.sort((x, y) => {
      if (x.episode < y.episode) {
        return -1;
      }
      if (x.episode > y.episode) {
        return 1;
      }
      return 0;
    })
    this.episodeAsc = false;
    this.episodeDes = true;
  }

  sortByLastPostitionAsc() {
    this.videos.sort((x, y) => {
      if (x.lastPosition < y.lastPosition) {
        return 1;
      }
      if (x.lastPosition > y.lastPosition) {
        return -1;
      }
      return 0;
    })
    this.lastPositionAsc = true;
    this.lastPositionDes = false;
  }

  sortByLastPostitionDes() {
    this.videos.sort((x, y) => {
      if (x.lastPosition < y.lastPosition) {
        return -1;
      }
      if (x.lastPosition > y.lastPosition) {
        return 1;
      }
      return 0;
    })
    this.lastPositionAsc = false;
    this.lastPositionDes = true;
  }

  sortByDurationAsc() {
    this.videos.sort((x, y) => {
      if (x.duration < y.duration) {
        return 1;
      }
      if (x.duration > y.duration) {
        return -1;
      }
      return 0;
    })
    this.durationAsc = true;
    this.durationDes = false;
  }

  sortByDurationDes() {
    this.videos.sort((x, y) => {
      if (x.duration < y.duration) {
        return -1;
      }
      if (x.duration > y.duration) {
        return 1;
      }
      return 0;
    })
    this.durationAsc = false;
    this.durationDes = true;
  }

  sortBySelected() {
    if (this.closeDateAsc) {
      this.sortByDateAsc();
    } else if (this.closeDateDes) {
      this.sortByDateDes();      
    } else if (this.titleAsc) {
      this.sortByTitleAsc();
    } else if (this.titleDes) {
      this.sortByTitleDes();
    } else if (this.lastPositionAsc) {
      this.sortByLastPostitionAsc();
    } else if (this.lastPositionDes) {
      this.sortByLastPostitionDes();
    } else if (this.durationAsc) {
      this.sortByDurationAsc();
    } else if (this.durationDes) {
      this.sortByDurationDes();
    }
  }

  setEveryOtherSortingBooleanToFalse(selectedSortingBoolean: string) {
    switch (selectedSortingBoolean) {
      case "episode":
        this.closeDateAsc = false;
        this.closeDateDes = false;
        this.titleAsc = false;
        this.titleDes = false;
        this.lastPositionAsc = false;
        this.lastPositionDes = false;
        this.durationAsc = false;
        this.durationDes = false;
        this.seasonAsc = false;
        this.seasonDes = false;
        break;
      case "season":
        this.closeDateAsc = false;
        this.closeDateDes = false;
        this.titleAsc = false;
        this.titleDes = false;
        this.lastPositionAsc = false;
        this.lastPositionDes = false;
        this.durationAsc = false;
        this.durationDes = false;
        this.episodeAsc = false;
        this.episodeDes = false;
        break;
      case "closeDate":
        this.titleAsc = false;
        this.titleDes = false;
        this.lastPositionAsc = false;
        this.lastPositionDes = false;
        this.durationAsc = false;
        this.durationDes = false;
        this.seasonAsc = false;
        this.seasonDes = false;
        this.episodeAsc = false;
        this.episodeDes = false;
        break;
      case "title":
        this.closeDateAsc = false;
        this.closeDateDes = false;
        this.lastPositionAsc = false;
        this.lastPositionDes = false;
        this.durationAsc = false;
        this.durationDes = false;
        this.seasonAsc = false;
        this.seasonDes = false;
        this.episodeAsc = false;
        this.episodeDes = false;
        break;
      case "lastPosition":
        this.titleAsc = false;
        this.titleDes = false;
        this.closeDateAsc = false;
        this.closeDateDes = false;
        this.durationAsc = false;
        this.durationDes = false;
        this.seasonAsc = false;
        this.seasonDes = false;
        this.episodeAsc = false;
        this.episodeDes = false;
        break;
      case "duration":
        this.closeDateAsc = false;
        this.closeDateDes = false;
        this.titleAsc = false;
        this.titleDes = false;
        this.lastPositionAsc = false;
        this.lastPositionDes = false;
        this.seasonAsc = false;
        this.seasonDes = false;
        this.episodeAsc = false;
        this.episodeDes = false;
        break;
    }
  }
}
