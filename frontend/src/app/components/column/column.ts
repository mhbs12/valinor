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
  id = input<string>('');
  columnTitle = input<string>('');
  taskList = input<Task[]>([]);

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

  handleDrop(event: CdkDragDrop<Task[]>) {
    this.onDrop.emit(event);
  }

  deleteTask(taskId: string) {
    this.onDeleteTask.emit(taskId);
  }

  deleteColumn() {
    this.onDeleteColumn.emit();
  }
}
