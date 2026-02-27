import { Component, signal, input } from '@angular/core';
import { Column } from '../column/column';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { moveItemInArray, transferArrayItem, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  imports: [Column, CdkDropListGroup, FormsModule],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  tarefasAFazer = signal<string[]>([]);
  tarefasEmProgresso = signal<string[]>([]);
  tarefasConcluidas = signal<string[]>([]);
  textoDaNovaTarefa = signal('');
  adicionarTarefa() {
    if (this.textoDaNovaTarefa().trim()) {
      this.tarefasAFazer.update((lista) => [...lista, this.textoDaNovaTarefa()]);
      this.textoDaNovaTarefa.set('');
    }
  }
  tarefaMovida(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    //Atualizando o signal
    this.tarefasAFazer.update((lista) => [...lista]);
    this.tarefasEmProgresso.update((lista) => [...lista]);
    this.tarefasConcluidas.update((lista) => [...lista]);

    console.log(
      `Movendo de: [${event.previousContainer.id}] (índice ${event.previousIndex}) ----> Para: [${event.container.id}] (índice ${event.currentIndex})`,
    );
  }
}
