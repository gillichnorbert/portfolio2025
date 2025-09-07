import { Component, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { MessagesService } from '../../messages.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  showScrollTopButton = false;
  aboutInView = false;
  titleInView = false;
  isVideoEditing = true;
    name = '';
  email = '';
  phone = '';
  message = '';
  subject = '';
  success = false;

  webProjects = [
    {
      title: 'Master of Ceremonies',
      description: 'Description of Web Project 1',
      image: "https://ceremoniamestercsaba.hu/assets/img/boritokep.png",
      link: 'https://ceremoniamestercsaba.hu'
    },
    {
      title: 'SafeCard Webshop',
      description: 'Description of Web Project 2',
      image: 'https://safecard.hu/assets/images/IMG_9915.png',
      link: 'https://safecard.hu/'
    },
    {
      title: 'GitHub',
      description: 'Description of Web Project 2',
      image: 'https://opengraph.githubassets.com/8c759607149e1a096e11cdf9877cdfa3ba8cf36725bb34bc090cce93efd0285d/0xBYTESHIFT/fp16',
      link: 'https://github.com/gillichnorbert'
    }
  ];

    videoProjects = [
    {
      title: 'Short Form Videos',
      description: "Creative short videos that quickly capture the viewer’s attention.",
      image: 'assets/images/shortform.png',
      link: '/shortform'
    },
    {
      title: 'Television',
      description: 'Worked as an editor on "Ázsia Express" in 2023, gaining experience in editing both game and reality TV content.',
      image: 'https://media.port.hu/images/001/593/002.webp',
      link: 'https://tv2play.hu/azsia_expressz/4/videok'
    },
    {
      title: 'Music Video',      
      description: 'Served as director, editor, and creative lead, handling all aspects of production to bring the artistic vision to life.',    
      image: 'assets/images/burberry.png',
      link: 'https://youtu.be/zxTy-kzTKJs'
    }];
  
  constructor(private el: ElementRef, private messagesService: MessagesService) {}

    get projects() {
    return this.isVideoEditing ? this.videoProjects : this.webProjects;
  }

  

  ngAfterViewInit() {
    setTimeout(() => this.titleInView = true, 100);
    const aboutSection = this.el.nativeElement.querySelector('.about-section');
    const observer = new IntersectionObserver(
      ([entry]) => {
        this.aboutInView = entry.isIntersecting;
      },
      { threshold: 0.3 }
    );
    if (aboutSection) {
      observer.observe(aboutSection);
    }
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

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  scrollToBottom(): void {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
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

}