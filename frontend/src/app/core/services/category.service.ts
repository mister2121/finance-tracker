import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category, CategoryRequest, CategoryType } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);

  getCategories() {
    return this.http.get<{ id: string; name: string; type: CategoryType }[]>(
      'http://localhost:8080/api/categories',
    );
  }

  createCategory(request: CategoryRequest) {
    return this.http.post<Category>('http://localhost:8080/api/categories', request);
  }

  editCategory(id: string, request: CategoryRequest) {
    return this.http.put<Category>(`http://localhost:8080/api/categories/${id}`, request);
  }

  deleteCategory(id: string) {
    return this.http.delete(`http://localhost:8080/api/categories/${id}`);
  }
}
