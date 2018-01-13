import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { VideosComponent } from './videos/videos.component';

import { AuthService } from './services/auth.service';
import { VideoService } from './services/video.service';
import { AppRoutingModule } from './/app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    HomepageComponent,
    NotFoundComponent,
    VideosComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ReCaptchaModule,
    AppRoutingModule,
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [AuthService, VideoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
