import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { CategoryService } from '../../../core/services/category.service';
import { ModalService } from '../../../core/services/modal.service';
import { Category, CategoryRequest, CategoryType } from '../../../core/models/category.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-category-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-category-modal.html',
})
export class AddCategoryModal implements OnInit {
  private categoryService = inject(CategoryService);
  modalService = inject(ModalService);

  CategoryType = CategoryType;
  name = '';
  selectedType: CategoryType | null = null;

  @Input() categoryToEdit: Category | null = null;

  ngOnInit() {
    if (this.categoryToEdit) {
      this.name = this.categoryToEdit.name;
      this.selectedType = this.categoryToEdit.type;
    }
  }

  onSubmit() {
    if (!this.selectedType) {
      return;
    }

    const request: CategoryRequest = {
      name: this.name,
      type: this.selectedType,
    };

    const action = this.categoryToEdit
      ? this.categoryService.editCategory(this.categoryToEdit.id, request)
      : this.categoryService.createCategory(request);

    action.subscribe({
      next: (category) => {
        this.modalService.notifyCategorySaved();
        this.modalService.closeCategoryModal();
      },
      error: (error) => {
        console.error('Błąd podczas zapisywania konta: ', error);
      },
    });
  }
}
