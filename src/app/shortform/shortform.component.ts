import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Player from '@vimeo/player';

@Component({
  selector: 'app-shortform',
  templateUrl: './shortform.component.html',
  styleUrls: ['./shortform.component.css']
})
export class ShortformComponent implements AfterViewInit {

  videos: { id: number; url: SafeResourceUrl }[];
  private sanitizer = inject(DomSanitizer);

  @ViewChildren('videoIframe') iframes!: QueryList<ElementRef<HTMLIFrameElement>>;
  private players = new Map<HTMLIFrameElement, Player>();
  currentIndex = 0;

  constructor() {
    this.videos = [
      { id: 1, url: this.sanitizer.bypassSecurityTrustResourceUrl('https://player.vimeo.com/video/1116347038?muted=1&autopause=0') },
      { id: 2, url: this.sanitizer.bypassSecurityTrustResourceUrl('https://player.vimeo.com/video/1116347050?muted=1&autopause=0') },
      { id: 3, url: this.sanitizer.bypassSecurityTrustResourceUrl('https://player.vimeo.com/video/1116347056?muted=1&autopause=0') }
    ];
  }

  ngAfterViewInit() {
    this.iframes.forEach(iframeRef => {
      const player = new Player(iframeRef.nativeElement);
      this.players.set(iframeRef.nativeElement, player);
    });

    this.playCurrentVideo();
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
