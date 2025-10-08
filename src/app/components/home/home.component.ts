import { Component, ElementRef, HostListener, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  @ViewChildren('projectCard', { read: ElementRef }) projectCards!: QueryList<ElementRef>;
  showScrollTopButton = false;
  aboutInView = false;
  titleInView = false;
  isVideoEditing = true;

  langSelection: any[] = [];
  translations: any = {};
  actLang = 'English';

  // Form mezők
  name = '';
  email = '';
  phone = '';
  message = '';
  subject = '';
  success = false;

  // Projektek
  webProjects: any[] = [];
  videoProjects: any[] = [];

  // Fordításokhoz
  welcomeTitle!: string;
  welcomeSubtitle!: string;
  aboutCardTitle!: string;
  aboutCardSubtitle!: string;
  workCardTitle!: string;
  workCardSubtitle!: string;
  contactCardTitle!: string;
  contactCardSubtitle!: string;
  aboutTitle!: string;
  aboutParagraph1!: string;
  aboutParagraph2!: string;
  aboutParagraph3!: string;
  aboutParagraph4!: string;
  skillsTitle!: string;
  workTitle!: string;
  workSwitchEditing!: string;
  workSwitchDevelopment!: string;
  workEditingTitle!: string;
  workEditingDesc!: string;
  workDevTitle!: string;
  workDevDesc!: string;
  contactTitle!: string;
  formName!: string;
  formEmail!: string;
  formSubject!: string;
  formMessage!: string;
  formSend!: string;
  formSuccess!: string;

  constructor(
    private config: ConfigService,
    private el: ElementRef,
    private messagesService: MessagesService
  ) {
    this.loadContent();
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      this.actLang = savedLanguage === 'en' ? 'English' : savedLanguage === 'de' ? 'Deutsch' : 'Magyar';
      this.config.changeLanguage(savedLanguage);
    }
  }

  get projects() {
    return this.isVideoEditing ? this.videoProjects : this.webProjects;
  }

  ngAfterViewInit(): void {
    this.initIntersectionObserver();
    this.initTypingAnimation();

    this.projectCards.changes.subscribe(() => {
      this.runCardAnimation();
    });

    setTimeout(() => this.runCardAnimation(), 100);
  }

  toggleSwitch() {
    this.projectCards.forEach(card => {
      card.nativeElement.classList.add('fade-out');
    });

    setTimeout(() => {
      this.isVideoEditing = !this.isVideoEditing;
    }, 200);
  }


  private runCardAnimation() {
    if (!this.projectCards || this.projectCards.length === 0) return;

    this.projectCards.forEach((card, index) => {
      const el = card.nativeElement as HTMLElement;
      el.classList.remove('in-view', 'fade-out');
      el.style.animationDelay = `${index * 0.15}s`;
      setTimeout(() => el.classList.add('in-view'), 10);
    });

    setTimeout(() => (this.titleInView = true), 100);
  }

  private initIntersectionObserver() {
    const aboutSection = this.el.nativeElement.querySelector('.about-section');
    if (!aboutSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => (this.aboutInView = entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(aboutSection);
  }

  private initTypingAnimation() {
    const typedEl: HTMLElement | null = document.querySelector('.typed');
    if (!typedEl) return;

    const itemsAttr = typedEl.getAttribute('data-typed-items');
    if (!itemsAttr) return;

    const items = itemsAttr.split(',').map(s => s.trim());
    let itemIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeSpeed = 90;
    const backSpeed = 45;
    const delayBetween = 1200;

    const type = () => {
      const current = items[itemIndex];
      if (!isDeleting) {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(type, delayBetween);
        } else {
          setTimeout(type, typeSpeed);
        }
      } else {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          itemIndex = (itemIndex + 1) % items.length;
          setTimeout(type, 400);
        } else {
          setTimeout(type, backSpeed);
        }
      }
    };

    type();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollTopButton = scrollTop > 100;
  }

  toggleLanguage() {
    if (this.actLang === 'Magyar') {
      this.langChange({ text: 'English', sign: 'en' });
    } else {
      this.langChange({ text: 'Magyar', sign: 'hu' });
    }
  }

  langChange(lang: any) {
    this.actLang = lang.text;
    this.config.changeLanguage(lang.sign);
    localStorage.setItem('selectedLanguage', lang.sign);
  }

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSubmit() {
    if (!this.name || !this.email || !this.message || !this.subject) return;

    this.messagesService.sendMessage({
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message
    }).subscribe({
      next: () => {
        this.success = true;
        this.name = this.email = this.subject = this.message = '';
      },
      error: (err) => {
        console.error('Hiba az üzenet küldése közben:', err);
        alert('Az üzenet küldése sikertelen.');
      }
    });
  }

  loadContent() {
    this.config.getContent().subscribe(content => {
      this.translations = content;
      this.webProjects = content.webProjects || [];
      this.videoProjects = content.videoProjects || [];
      this.langSelection = content.langSelection || [];

      Object.assign(this, {
        welcomeTitle: content.welcomeTitle,
        welcomeSubtitle: content.welcomeSubtitle,
        aboutCardTitle: content.aboutCardTitle,
        aboutCardSubtitle: content.aboutCardSubtitle,
        workCardTitle: content.workCardTitle,
        workCardSubtitle: content.workCardSubtitle,
        contactCardTitle: content.contactCardTitle,
        contactCardSubtitle: content.contactCardSubtitle,
        aboutTitle: content.aboutTitle,
        aboutParagraph1: content.aboutParagraph1,
        aboutParagraph2: content.aboutParagraph2,
        aboutParagraph3: content.aboutParagraph3,
        aboutParagraph4: content.aboutParagraph4,
        skillsTitle: content.skillsTitle,
        workTitle: content.workTitle,
        workSwitchEditing: content.workSwitchEditing,
        workSwitchDevelopment: content.workSwitchDevelopment,
        workEditingTitle: content.workEditingTitle,
        workEditingDesc: content.workEditingDesc,
        workDevTitle: content.workDevTitle,
        workDevDesc: content.workDevDesc,
        contactTitle: content.contactTitle,
        formName: content.formName,
        formEmail: content.formEmail,
        formSubject: content.formSubject,
        formMessage: content.formMessage,
        formSend: content.formSend,
        formSuccess: content.formSuccess
      });
    });
    
  }
}
