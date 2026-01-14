import { Routes } from '@angular/router';
import { BookSearchComponent } from './pages/book-search/book-search';
import { BookDetailComponent } from './pages/book-detail/book-detail';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: BookSearchComponent },
  { path: 'book/:id', component: BookDetailComponent },
  { path: '**', redirectTo: '/search' } // Redirige vers /search pour les routes inconnues
];
