import { Component, signal, input, inject } from '@angular/core';
import { Column } from '../column/column';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { moveItemInArray, transferArrayItem, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskService, Task } from '../../services/task';

@Component({
  selector: 'app-board',
  imports: [Column, CdkDropListGroup, FormsModule],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  private taskService = inject(TaskService);

  tarefasAFazer = signal<Task[]>([]);
  tarefasEmProgresso = signal<Task[]>([]);
  tarefasConcluidas = signal<Task[]>([]);
  textoDaNovaTarefa = signal('');

  //Busca no backend ao carregar a pagina.
  ngOnInit() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tarefasAFazer.set(tasks.filter(t => t.coluna === 'A Fazer'));
      this.tarefasEmProgresso.set(tasks.filter(t => t.coluna === 'Em Progresso'));
      this.tarefasConcluidas.set(tasks.filter(t => t.coluna === 'Concluído'));
    });
  }

  //Adiciona o texto digitado na coluna 'A Fazer' e salva a info no backend
  adicionarTarefa() {
    const texto = this.textoDaNovaTarefa().trim();
    if (texto) {
      this.taskService.createTask(texto, 'A Fazer').subscribe((novaTarefa) => {
        this.tarefasAFazer.update(lista => [...lista, novaTarefa]);
        this.textoDaNovaTarefa.set('');
      });
    }
  }

  tarefaMovida(event: CdkDragDrop<Task[]>) {
    //Reorganiza o array na mesma coluna
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      //Troca para o array correto em colunas diferentes
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      //Salva as posiçoes corretamente no backend
      const tarefaMovida = event.container.data[event.currentIndex];
      const novaColuna = event.container.id;
      const novaOrdem = event.currentIndex;
      this.taskService.updateTaskPosition(tarefaMovida.id, novaColuna, novaOrdem).subscribe();
    }

    //Atualizando o signal
    this.tarefasAFazer.update((lista) => [...lista]);
    this.tarefasEmProgresso.update((lista) => [...lista]);
    this.tarefasConcluidas.update((lista) => [...lista]);

    //Debug
    console.log(
      `Movendo de: [${event.previousContainer.id}] (índice ${event.previousIndex}) ----> Para: [${event.container.id}] (índice ${event.currentIndex})`,
    );
  }
}
