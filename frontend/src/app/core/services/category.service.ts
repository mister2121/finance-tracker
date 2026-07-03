import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CategoryType } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);

  getCategories() {
    return this.http.get<{ id: string; name: string; type: CategoryType }[]>(
      'http://localhost:8080/api/categories',
    );
  }
}
