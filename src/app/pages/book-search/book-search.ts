import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book';
import { Book } from '../../models/book';

type PaginationItem = number | '...';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent implements OnInit {
  searchQuery = '';
  books: Book[] = [];
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 12;
  totalItems = 0;
  error: string | null = null;
  searchPerformed = false;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    // Chargement initial optionnel
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage) || 1;
  }

  getPaginationRange(): PaginationItem[] {
    const range: PaginationItem[] = [];
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const left = current - delta;
    const right = current + delta + 1;
    let l: number;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= left && i < right)) {
        range.push(i);
      } else if (i === left - 1 || i === right) {
        range.push('...');
      }
    }

    // Suppression des doublons de '...' consécutifs
    return range.reduce((result: PaginationItem[], item, index, array) => {
      if (index === 0 || item !== array[index - 1]) {
        result.push(item);
      }
      return result;
    }, []);
  }

  searchBooks(): void {
    if (!this.searchQuery.trim()) {
      this.error = 'Veuillez entrer un terme de recherche';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.searchPerformed = true;
    
    this.bookService.searchBooks(this.searchQuery, this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.books = response.books || [];
          this.totalItems = response.total || 0;
          this.isLoading = false;
          
          // Ajuster la page courante si nécessaire
          if (this.currentPage > 1 && this.books.length === 0) {
            this.currentPage = 1;
            this.searchBooks();
          }
        },
        error: (err) => {
          console.error('Erreur lors de la recherche:', err);
          this.error = 'Une erreur est survenue lors de la recherche. Veuillez réessayer.';
          this.isLoading = false;
          this.books = [];
          this.totalItems = 0;
        }
      });
  }

  onPageChange(page: number | string): void {
    // Vérifier si la page est un nombre valide
    if (page === '...' || page === this.currentPage) {
      return;
    }
    
    const pageNumber = page as number;
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      return;
    }
    
    this.currentPage = pageNumber;
    this.searchBooks();
    // Défilement vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pages(): number[] {
    const total = this.totalPages;
    return Array.from({ length: total }, (_, i) => i + 1);
  }
}
