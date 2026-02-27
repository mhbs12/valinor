import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Task {
  id: string;
  texto: string;
  coluna: 'A Fazer' | 'Em Progresso' | 'Concluído';
  ordem: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/tasks';

  getTasks() {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(texto: string, coluna: 'A Fazer' | 'Em Progresso' | 'Concluído') {
    return this.http.post<Task>(this.apiUrl, { texto, coluna });
  }

  updateTaskPosition(id: string, novaColuna: string, novaOrdem: number) {
    return this.http.patch(`${this.apiUrl}/${id}/position`, { novaColuna, novaOrdem });
  }
}