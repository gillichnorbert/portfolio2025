import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'https://gn-portfolio-default-rtdb.europe-west1.firebasedatabase.app';

  getVideos() {
    return this.http.get(`${this.apiUrl}/videos.json`);
  }
}
