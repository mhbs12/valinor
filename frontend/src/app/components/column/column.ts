import { Component, input } from '@angular/core';
import { Card } from '../card/card'
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-column',
  imports: [Card, CdkDropList, CdkDrag],
  templateUrl: './column.html',
  styleUrl: './column.css',
})
export class Column {
  tituloDaColuna = input<string>('');
  listaDeTarefas = input<string[]>([]);

  tarefaMovida(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      // Se soltou na mesma coluna (só reordenou para cima ou para baixo)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Se arrastou para uma coluna diferente
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
