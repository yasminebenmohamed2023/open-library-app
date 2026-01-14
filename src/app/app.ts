import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, Event, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    main {
      flex: 1;
      padding: 1rem 0;
    }
    
    .navbar {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    footer {
      background-color: #f8f9fa;
      padding: 1rem 0;
      margin-top: auto;
      border-top: 1px solid #e9ecef;
    }
    
    .spinner-border {
      width: 3rem;
      height: 3rem;
    }
  `]
})
export class App implements OnInit, AfterViewInit {
  title = 'Recherche de Livres';
  currentYear = new Date().getFullYear();
  isLoaded = false;
  isScrolled = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Marquer comme chargé après un court délai pour s'assurer que tout est initialisé
    setTimeout(() => {
      this.isLoaded = true;
    }, 100);
  }

  ngAfterViewInit(): void {
    // Initialiser les animations au scroll
    this.initScrollAnimations();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Gérer le sticky header avec effet de scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        this.isScrolled = true;
      } else {
        navbar.classList.remove('scrolled');
        this.isScrolled = false;
      }
    }
  }

  initScrollAnimations(): void {
    // Observer pour les animations au scroll (fade-in)
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observer tous les éléments avec la classe animate-on-scroll
    setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
      });
    }, 500);
  }

  onActivate(event: Event): void {
    // Smooth scroll vers le haut lors du changement de route
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Réinitialiser les animations au scroll après changement de route
    setTimeout(() => {
      this.initScrollAnimations();
    }, 300);
    
    // Forcer la détection des changements si nécessaire
    if (!(event instanceof NavigationEnd)) {
      return;
    }
  }
}
