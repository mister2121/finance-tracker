import { ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { ModalService } from '../../core/services/modal.service';
import { CategoryService } from '../../core/services/category.service';
import { Category, CategoryType } from '../../core/models/category.model';
import { CommonModule } from '@angular/common';
import { AddCategoryModal } from './add-category-modal/add-category-modal';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, AddCategoryModal],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  modalService = inject(ModalService);
  private categorySerivce = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  categories: Category[] = [];
  CategoryType = CategoryType;
  selectedCategory: Category | null = null;

  constructor() {
    effect(() => {
      const saved = this.modalService.categorySaved();

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
        setTimeout(() => {
          this.cdr.detectChanges();
        });
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

  deleteCategory(id: string) {
    const confirmed = confirm(
      'Czy na pewno chcesz usunąć kategorię? Tej operacji nie można cofnąć.',
    );
    if (!confirmed) {
      return;
    }

    this.categorySerivce.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: () => alert('Nie udało się usunąć kategorii.'),
    });

    alert('Transakcja usunięta.');
  }

  openEditModal(category: Category) {
    this.modalService.openCategoryForEdit(category);
    this.closeActionSheet();
  }

  openActionSheet(category: Category) {
    this.selectedCategory = category;
  }

  closeActionSheet() {
    this.selectedCategory = null;
  }
}
