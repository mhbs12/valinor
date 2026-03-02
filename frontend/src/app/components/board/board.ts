import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { TaskService, Column, Task } from '../../services/task';
import { Column as ColumnComponent } from '../column/column';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [FormsModule, ColumnComponent, DragDropModule],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board implements OnInit {
  columns = signal<Column[]>([]);
  newColumnName = signal('');
  isAddingColumn = signal(false);

  distributedColumns = computed(() => {

    //Distribui as colunas em 4 faixas seguindo a logica masonry
    const lanes: Column[][] = [[], [], [], []];
    this.columns().forEach((col, index) => {
      lanes[index % 4].push(col);
    });
    return lanes;
  });

  //Determina em qual faixa adicionar a nova coluna baseado na quantidade de colunas existentes
  addColumnButtonLane = computed(() => this.columns().length % 4);

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadBoard();
  }

  loadBoard() {
    this.taskService.getBoard().subscribe({
      next: (data) => this.columns.set(data),
      error: (err) => console.error('Error fetching board:', err),
    });
  }

  addColumn() {
    const name = this.newColumnName().trim();
    if (!name) return;

    this.taskService.createColumn(name).subscribe({
      next: (newColumn) => {
        //Adiciona a nova coluna ao array de colunas e cria um array vazio para as tarefas se já nao houver um.
        const columnWithTasks = { ...newColumn, tasks: newColumn.tasks || [] };
        this.columns.update(columns => [...columns, columnWithTasks]);
        this.newColumnName.set('');
        this.isAddingColumn.set(false);
      },
      error: (err) => console.error('Error creating column:', err)
    });
  }

  addTask(columnId: string, text: string) {
    this.taskService.createTask(text, columnId).subscribe({
      next: (newTask) => {
        this.columns.update(columns => 
          columns.map(col => 
            col.id === columnId 
              ? { ...col, tasks: [...col.tasks, newTask] } 
              : col
          )
        );
      },
      error: (err) => console.error('Error creating task:', err)
    });
  }

  cancelColumnAddition() {
    this.newColumnName.set('');
    this.isAddingColumn.set(false);
  }

  deleteTask(taskId: string) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.columns.update(columns => 
          columns.map(col => ({
            ...col,
            tasks: col.tasks.filter(t => t.id !== taskId)
          }))
        );
      },
      error: (err) => console.error('Error deleting task:', err)
    });
  }

  deleteColumn(columnId: string) {
    if (!confirm('Are you sure you want to delete this column and all its tasks?')) return;

    this.taskService.deleteColumn(columnId).subscribe({
      next: () => {
        this.columns.update(columns => columns.filter(col => col.id !== columnId));
      },
      error: (err) => console.error('Error deleting column:', err)
    });
  }

  updateColumnName(columnId: string, newName: string) {
    this.taskService.updateColumn(columnId, newName).subscribe({
      next: (updatedColumn) => {
        this.columns.update(columns => 
          columns.map(col => col.id === columnId ? { ...col, name: updatedColumn.name } : col)
        );
      },
      error: (err) => console.error('Error updating column name:', err)
    });
  }

  //Atualiza a ordem das tarefas quando elas são movidas entre colunas
  onTaskMoved(event: CdkDragDrop<Task[]>, columnId: string) {
    if (event.previousContainer === event.container && event.previousIndex === event.currentIndex) {
      return;
    }

    const movedTask = event.item.data;

    this.columns.update((columns) => {
      const newColumns = columns.map((col) => ({
        ...col,
        tasks: [...col.tasks],
      }));

      const sourceColumn = newColumns.find((c) => c.id === event.previousContainer.id);
      const targetColumn = newColumns.find((c) => c.id === event.container.id);

      
      if (sourceColumn && targetColumn) {//Verifica se as colunas de origem e destino existem
        if (sourceColumn === targetColumn) {//Se for na mesma coluna
          moveItemInArray(sourceColumn.tasks, event.previousIndex, event.currentIndex);
        } else {//Se for em colunas diferentes
          transferArrayItem(
            sourceColumn.tasks,
            targetColumn.tasks,
            event.previousIndex,
            event.currentIndex
          );
        }
      }
      return newColumns;
    });
    
    const targetColumnId = event.container.id;

    this.taskService//Atualiza a posição da tarefa no backend
      .updateTaskPosition(movedTask.id, targetColumnId, event.currentIndex)
      .subscribe({
        next: () => console.log('Position saved to SQLite successfully!'),
        error: (err) => {
          console.error('Error saving to database, reloading board...', err);
          this.loadBoard();
        },
      });
  }
}
