import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Book } from '../models/book';

interface OpenLibraryResponse {
  docs: Book[];
  numFound: number;
  start: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'https://openlibrary.org';

  constructor(private http: HttpClient) { }

  searchBooks(query: string, page: number = 1, limit: number = 10): Observable<{books: Book[], total: number}> {
    const url = `${this.apiUrl}/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    
    return this.http.get<OpenLibraryResponse>(url).pipe(
      map(response => ({
        books: response.docs.map(book => ({
          ...book,
          coverImage: book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
            : 'assets/no-cover.svg'
        })),
        total: response.numFound
      }))
    );
  }

  getBookDetails(id: string): Observable<Book> {
    const url = `${this.apiUrl}/works/${id}.json`;
    return this.http.get<Book>(url);
  }
}
