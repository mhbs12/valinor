import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: string;
  text: string;
  order: number;
  columnId: string;
}

export interface Column {
  id: string;
  name: string;
  order: number;
  tasks: Task[];
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getBoard(): Observable<Column[]> {
    return this.http.get<Column[]>(this.apiUrl);
  }

  createTask(text: string, columnId: string): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, { text, columnId });
  }

  createColumn(name: string): Observable<Column> {
    return this.http.post<Column>(`${this.apiUrl}/column`, { name });
  }

  updateTaskPosition(taskId: string, newColumnId: string, newOrder: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${taskId}/position`, {
      columnId: newColumnId,
      order: newOrder,
    });
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${taskId}`);
  }

  deleteColumn(columnId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/column/${columnId}`);
  }

  updateColumn(columnId: string, name: string): Observable<Column> {
    return this.http.patch<Column>(`${this.apiUrl}/column/${columnId}`, { name });
  }
}
