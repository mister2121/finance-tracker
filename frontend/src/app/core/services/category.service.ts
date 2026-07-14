import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category, CategoryRequest, CategoryType } from '../models/category.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);

  getCategories() {
    return this.http.get<{ id: string; name: string; type: CategoryType }[]>(
      `${environment.apiUrl}/api/categories`,
    );
  }

  createCategory(request: CategoryRequest) {
    return this.http.post<Category>(`${environment.apiUrl}/api/categories`, request);
  }

  editCategory(id: string, request: CategoryRequest) {
    return this.http.put<Category>(`${environment.apiUrl}/api/categories/${id}`, request);
  }

  deleteCategory(id: string) {
    return this.http.delete(`${environment.apiUrl}/api/categories/${id}`);
  }
}
