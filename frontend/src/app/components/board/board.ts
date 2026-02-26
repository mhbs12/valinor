import { Component } from '@angular/core';
import { Column } from '../column/column';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  imports: [Column, CdkDropListGroup],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  colunas = [
  { 
    titulo: 'A Fazer', 
    tarefas: ['Estudar Angular', 'Configurar NestJS', 'Ler a documentação'] 
  },
  { 
    titulo: 'Fazendo', 
    tarefas: ['Criar os Cards do Kanban'] 
  },
  { 
    titulo: 'Feito', 
    tarefas: ['Instalar o Node', 'Criar os componentes'] 
  }
];
}
