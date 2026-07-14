import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  CategoryType = CategoryType;
  name = '';
  selectedType: CategoryType | null = null;

  // błędy:
  nameError = '';
  selectedTypeError = '';

  @Input() categoryToEdit: Category | null = null;

  validateCategoryForm(): boolean {
    this.nameError = '';
    this.selectedTypeError = '';
    let isValid = true;

    if (!this.name.trim()) {
      this.nameError = 'Nazwa jest wymagana.';
      isValid = false;
    }

    if (this.selectedType == null) {
      this.selectedTypeError = 'Musisz wybrać kategorię.';
      isValid = false;
    }

    return isValid;
  }

  ngOnInit() {
    if (this.categoryToEdit) {
      this.name = this.categoryToEdit.name;
      this.selectedType = this.categoryToEdit.type;
    }
  }

  onSubmit() {
    const formValid = this.validateCategoryForm();

    if (!formValid) {
      this.cdr.detectChanges();
      return;
    }

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

    alert('Kategoria zapisana.');
  }
}
