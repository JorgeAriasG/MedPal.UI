import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoodDatabaseComponent } from './components/food-database/food-database.component';
import { DietPlanEditorComponent } from './components/diet-plans/diet-plan-editor.component';
import { DietPlanDetailComponent } from './components/diet-plans/diet-plan-detail.component';

const routes: Routes = [
  { path: 'foods', component: FoodDatabaseComponent },
  { path: 'diet-plans/new', component: DietPlanEditorComponent },
  { path: 'diet-plans/edit/:id', component: DietPlanEditorComponent },
  { path: 'diet-plans/:id', component: DietPlanDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NutritionRoutingModule {}
