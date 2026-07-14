import { Pipe, PipeTransform } from '@angular/core';
import { CategoryType } from '../models/category.model';

@Pipe({
  name: 'categoryTypeLabel',
  standalone: true,
})
export class CategoryTypeLabelPipe implements PipeTransform {
  transform(type: CategoryType): string {
    switch (type) {
      case CategoryType.INCOME:
        return 'PRZYCHÓD';
      case CategoryType.EXPENSE:
        return 'WYDATEK';
      default:
        return type;
    }
  }
}
