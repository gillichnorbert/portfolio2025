import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Player from '@vimeo/player';
import { VideosService } from '../../services/videos.service';

@Component({
  selector: 'app-shortform',
  templateUrl: './shortform.component.html',
  styleUrls: ['./shortform.component.css']
})
export class ShortformComponent implements AfterViewInit {

  videos: { id: number; url: SafeResourceUrl }[] = [];
  private sanitizer = inject(DomSanitizer);

  @ViewChildren('videoIframe') iframes!: QueryList<ElementRef<HTMLIFrameElement>>;
  private players = new Map<HTMLIFrameElement, Player>();
  currentIndex = 0;

  constructor(private videosService: VideosService) {
    this.loadVideos();
  }

  // 🔹 Videók lekérése a service-ből
  loadVideos() {
    this.videosService.getVideos().subscribe((data: any) => {
      if (data) {
        this.videos = Object.keys(data).map((key, index) => ({
          id: index + 1,
          url: this.sanitizer.bypassSecurityTrustResourceUrl(data[key].url)
        }));
      }
    });
  }

  ngAfterViewInit() {
    // Figyeljük a változásokat, mert a videók aszinkron töltődnek
    this.iframes.changes.subscribe(() => {
      this.iframes.forEach(iframeRef => {
        const player = new Player(iframeRef.nativeElement);
        this.players.set(iframeRef.nativeElement, player);
      });
      this.playCurrentVideo();
    });
  }

  playCurrentVideo() {
    this.iframes.forEach((iframeRef, index) => {
      const player = this.players.get(iframeRef.nativeElement);
      if (index === this.currentIndex) {
        iframeRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
        player?.play().catch(() => {});
      } else {
        player?.pause().catch(() => {});
      }
    });
  }

  nextVideo() {
    if (this.currentIndex < this.videos.length - 1) {
      this.currentIndex++;
      this.playCurrentVideo();
    }
  }

  prevVideo() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.playCurrentVideo();
    }
  }

  get isPrevDisabled(): boolean {
    return this.currentIndex === 0;
  }

  get isNextDisabled(): boolean {
    return this.currentIndex === this.videos.length - 1;
  }

  backToHome() {
    window.location.href = '/home';
  }
}
