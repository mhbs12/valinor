import { Component, input, output } from '@angular/core';
import { Card } from '../card/card';
import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-column',
  imports: [Card, CdkDropList, CdkDrag],
  templateUrl: './column.html',
  styleUrl: './column.css',
})
export class Column {
  tituloDaColuna = input<string>('');
  listaDeTarefas = input<any[]>([]);

  foiSolto = output<CdkDragDrop<string[]>>();

  aoSoltar(event: CdkDragDrop<string[]>) {
    this.foiSolto.emit(event);
  }
}
