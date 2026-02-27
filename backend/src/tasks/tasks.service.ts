import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {

  private tarefas: Task[] = [];
  
  //Recebe a nova tarefa, guarda dentro do array 'tarefas[]' e vincula um id
  create(texto: string, coluna: 'A Fazer' | 'Em Progresso' | 'Concluído') {
    const novaTarefa: Task = {
      id: Date.now().toString(),
      texto,
      coluna,
      ordem: this.tarefas.length,
    };
    this.tarefas.push(novaTarefa);
    return novaTarefa;
  }

  //Informa todo o array 'tarefas[]' para o front desenhar
  findAll() {
    return this.tarefas;
  }

  //Atualiza a coluna que a tarefa está para a nova localizacao utilizando o id
  updatePosition(id: string, novaColuna: any, novaOrdem: number) {
    const tarefa = this.tarefas.find(t => t.id === id);
    if (tarefa) {
      tarefa.coluna = novaColuna;
      tarefa.ordem = novaOrdem;
    }
    return tarefa;
  }
}