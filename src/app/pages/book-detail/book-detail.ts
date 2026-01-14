import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BookService } from '../../services/book';
import { Book } from '../../models/book';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-detail.html',
  styleUrls: ['./book-detail.css']
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'Identifiant de livre manquant.';
      this.isLoading = false;
      return;
    }

    this.bookService.getBookDetails(id).subscribe({
      next: (data) => {
        // L’API Open Library renvoie un objet "work" qui peut ne pas
        // correspondre exactement à notre interface Book, on fait donc
        // un mapping minimal et on garde les champs existants si présents.
        this.book = {
          key: data.key ?? `/works/${id}`,
          title: (data as any).title ?? this.book?.title,
          description: typeof (data as any).description === 'string'
            ? (data as any).description
            : (data as any).description?.value,
          first_publish_year: (data as any).first_publish_year,
          cover_i: (data as any).covers?.[0] ?? this.book?.cover_i,
          author_name: (data as any).authors
            ? (data as any).authors.map((a: any) => a?.name).filter(Boolean)
            : this.book?.author_name,
          isbn: this.book?.isbn,
          coverImage: this.book?.coverImage
        };
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les détails du livre. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }
}

