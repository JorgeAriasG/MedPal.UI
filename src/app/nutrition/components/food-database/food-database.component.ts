import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { IFoodItem, FoodCategory } from '../../models';
import { NutritionService } from '../../services/nutrition.service';

@Component({
  selector: 'app-food-database',
  templateUrl: './food-database.component.html',
  styleUrls: ['./food-database.component.css'],
  standalone: false,
})
export class FoodDatabaseComponent implements OnInit, OnDestroy {
  items: IFoodItem[] = [];
  filtered: IFoodItem[] = [];
  searchControl = new FormControl('');
  selectedCategory: string | null = null;

  categories: { key: FoodCategory; label: string }[] = [
    { key: 'dairy', label: 'Lácteos' },
    { key: 'meat-poultry', label: 'Carnes y aves' },
    { key: 'fish-seafood', label: 'Pescados y mariscos' },
    { key: 'eggs', label: 'Huevos' },
    { key: 'legumes', label: 'Leguminosas' },
    { key: 'cereals-grains', label: 'Cereales y granos' },
    { key: 'vegetables', label: 'Verduras' },
    { key: 'fruits', label: 'Frutas' },
    { key: 'nuts-seeds', label: 'Semillas y nueces' },
    { key: 'oils-fats', label: 'Aceites y grasas' },
    { key: 'sugars-sweets', label: 'Azúcares y dulces' },
    { key: 'beverages', label: 'Bebidas' },
  ];

  private destroy$ = new Subject<void>();

  constructor(private nutritionService: NutritionService) {}

  ngOnInit(): void {
    this.nutritionService.getAllFoods()
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.items = items;
        this.applyFilter();
      });

    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(() => this.applyFilter());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterByCategory(category: string | null): void {
    this.selectedCategory = category;
    this.applyFilter();
  }

  private applyFilter(): void {
    const q = (this.searchControl.value || '').toLowerCase();
    this.filtered = this.items.filter((item) => {
      const matchesSearch = !q || item.name.toLowerCase().includes(q);
      const matchesCategory = !this.selectedCategory || item.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  getCategoryLabel(category: string): string {
    const found = this.categories.find(c => c.key === category);
    return found ? found.label : category;
  }

  trackById(_index: number, item: IFoodItem): number | undefined {
    return item.id;
  }
}
