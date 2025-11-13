import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.html',
  styleUrls: ['./calculator.css']
})
export class CalculatorComponent implements OnInit {

  modules: any[] = [];
  tasks: any[] = [];
  estimates: any = {};
  groupedTasks: { [moduleId: number]: any[] } = {};

  // чекбоксы — что считаем
  options = {
    mobile: false,
    backend: false,
    frontend: false,
    admin: false
  };

  loading = true;

  totals = {
    mobile: 0,
    backend: 0,
    frontend: 0,
    admin: 0,
    totalMin: 0,
    totalMax: 0
  };

  constructor(private supabase: SupabaseService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    console.log('CalculatorComponent ngOnInit стартовал');
    try {
      this.modules = await this.supabase.getModules();
      this.tasks = await this.supabase.getTasks();
      // группируем задачи по модулям
      this.groupedTasks = this.tasks.reduce((acc: any, task: any) => {
      if (!acc[task.id_module]) acc[task.id_module] = [];
        acc[task.id_module].push({ ...task, selected: false });
        return acc;
      }, {});

      this.estimates = await this.supabase.getEstimates();
    } catch (e) {
      console.error('Ошибка загрузки данных в ngOnInit:', e);
    } finally {
      this.loading = false;
      console.log('loading теперь:', this.loading);
      this.cdr.detectChanges();    // 💥 вот это заставляет Angular перерендериться
    }
  }

  roundTo10k(value: number) {
    return Math.round(value / 10000) * 10000;
  }

  calculate() {
  this.totals = {
    mobile: 0,
    backend: 0,
    frontend: 0,
    admin: 0,
    totalMin: 0,
    totalMax: 0
  };

  for (const moduleId in this.groupedTasks) {
    for (const task of this.groupedTasks[moduleId]) {

      if (!task.selected) continue;

      const tid = task.id;

      // mobile
      if (this.options.mobile) {
        const row = this.estimates['mobile_app_est']
          ?.find((x: any) => x.id_task === tid);
        if (row) this.totals.mobile += Number(row.cost);
      }

      // backend
      if (this.options.backend) {
        const row = this.estimates['backend_app_est']
          ?.find((x: any) => x.id_task === tid);
        if (row) this.totals.backend += Number(row.cost);
      }

      // frontend
      if (this.options.frontend) {
        const row = this.estimates['frontend_app_est']
          ?.find((x: any) => x.id_task === tid);
        if (row) this.totals.frontend += Number(row.cost);
      }

      // admin
      if (this.options.admin) {
        const row = this.estimates['admin_panel_est']
          ?.find((x: any) => x.id_task === tid);
        if (row) this.totals.admin += Number(row.cost);
      }
    }
  }

  // Итоговые суммы
  const sum =
    this.totals.mobile +
    this.totals.backend +
    this.totals.frontend +
    this.totals.admin;

  const min = sum * 0.7;
  const max = sum * 1.3;

  this.totals.totalMin = this.roundTo10k(min);
  this.totals.totalMax = this.roundTo10k(max);
 }
}