import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card } from '../card/card';
import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { Task } from '../../services/task';

@Component({
  selector: 'app-column',
  imports: [Card, CdkDropList, CdkDrag, FormsModule],
  templateUrl: './column.html',
  styleUrl: './column.css',
})

export class Column {
  //Dados que vêm do componente pai (Board)
  id = input<string>('');
  columnTitle = input<string>('');
  taskList = input<Task[]>([]);

  //Eventos que avisam o pai (Board) sobre ações do usuário
  onDrop = output<CdkDragDrop<Task[]>>();
  onDeleteTask = output<string>();
  onDeleteColumn = output<void>();
  onUpdateColumn = output<string>();
  onAddTask = output<string>();

  isEditing = signal(false);
  editName = signal('');
  isAddingTask = signal(false);
  newTaskText = signal('');

  startEditing() {
    this.editName.set(this.columnTitle());
    this.isEditing.set(true);
  }

  saveEditing() {
    const newName = this.editName().trim();
    if (newName && newName !== this.columnTitle()) {
      this.onUpdateColumn.emit(newName);
    }
    this.isEditing.set(false);
  }

  cancelEditing() {
    this.isEditing.set(false);
  }

  //Emite evento para criar tarefa e limpa o formulário
  saveNewTask() {
    const text = this.newTaskText().trim();
    if (text) {
      this.onAddTask.emit(text);
    }
    this.newTaskText.set('');
    this.isAddingTask.set(false);
  }

  cancelTaskAddition() {
    this.newTaskText.set('');
    this.isAddingTask.set(false);
  }

  //Repassa o evento de drag-and-drop do Angular CDK para o pai
  handleDrop(event: CdkDragDrop<Task[]>) {
    this.onDrop.emit(event);
  }

  //Repassa o pedido de exclusão da tarefa para o pai
  deleteTask(taskId: string) {
    this.onDeleteTask.emit(taskId);
  }

  //Repassa o pedido de exclusão da coluna para o pai
  deleteColumn() {
    this.onDeleteColumn.emit();
  }
}
