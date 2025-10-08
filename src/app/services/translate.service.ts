import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  private content = new Subject<any>();
  public langSign = 'hu';

  constructor(private http: HttpClient, private meta: Meta, private title: Title) { 
    this.loadContent();
  }

  changeLanguage(langSign: string) {
    this.langSign = langSign;
    this.loadContent();

    // <html lang="..."> beállítása
    document.documentElement.lang = langSign;

    // SEO meta frissítés
    if (langSign === 'hu') {
      this.title.setTitle('Gillich Norbert | Webfejlesztő és Videóvágó');
      this.meta.updateTag({
        name: 'description',
        content: 'Gillich Norbert portfóliója – webfejlesztés Angular és Firebase alapokon, valamint professzionális videóvágás szolgáltatások.'
      });
      this.meta.updateTag({ name: 'og:locale', content: 'hu_HU' });
      this.meta.updateTag({ name: 'keywords', content: 'webfejlesztő, videóvágó, Angular fejlesztő, Final Cut Pro, freelancer, Budapest' });
    } else {
      this.title.setTitle('Gillich Norbert | Web Developer & Video Editor');
      this.meta.updateTag({
        name: 'description',
        content: 'Portfolio of Gillich Norbert – frontend development with Angular and Firebase, and professional video editing services.'
      });
      this.meta.updateTag({ name: 'og:locale', content: 'en_GB' });
      this.meta.updateTag({ name: 'keywords', content: 'web developer, video editor, Angular, Firebase, Final Cut Pro, freelancer, Hungary' });
    }
  }

  loadContent() {
    this.http.get(`/assets/lang_${this.langSign}.json`).subscribe(
      (res) => {
        this.content.next(res);
      }
    );
  }

  getContent(): Subject<any> {
    return this.content;
  }
}
