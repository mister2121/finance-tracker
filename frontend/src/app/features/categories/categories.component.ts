import { ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { ModalService } from '../../core/services/modal.service';
import { CategoryService } from '../../core/services/category.service';
import { Category, CategoryType } from '../../core/models/category.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [CommonModule],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  modalService = inject(ModalService);
  private categorySerivce = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  categories: Category[] = [];
  CategoryType = CategoryType;

  constructor() {
    effect(() => {
      const saved = this.modalService.accountsSaved();

      if (saved > 0) {
        this.loadCategories();
      }
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categorySerivce.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  get expenseCategories() {
    return this.categories
      .filter((c) => c.type === CategoryType.EXPENSE)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  get incomeCategories() {
    return this.categories
      .filter((c) => c.type === CategoryType.INCOME)
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
