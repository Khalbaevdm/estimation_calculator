import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase.client';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  constructor() {}

  // Таблица module
  async getModules() {
    const { data, error } = await supabase
      .from('module')
      .select('id, name, sort')
      .order('sort', { ascending: true });

    if (error) {
      console.error('Ошибка получения module:', error);
      throw error;
    }

    return data;
  }

  // Таблица task
  async getTasks() {
    const { data, error } = await supabase
      .from('task')
      .select('id, id_module, name, description')
      .order('id_module', { ascending: true })
      .order('id', { ascending: true });

    if (error) {
      console.error('Ошибка получения task:', error);
      throw error;
    }

    return data;
  }

  // Все est-таблицы: mobile / backend / frontend / admin
  async getEstimates() {
    const tables = [
      'mobile_app_est',
      'backend_app_est',
      'frontend_app_est',
      'admin_panel_est'
    ];

    const result: any = {};

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('id_task, hours, cost');

      if (error) {
        console.error(`Ошибка получения ${table}:`, error);
        throw error;
      }

      result[table] = data;
    }

    return result;
  }
}