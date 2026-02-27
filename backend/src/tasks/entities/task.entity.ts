export class Task {
  id: string;
  texto: string;
  coluna: 'A Fazer' | 'Em Progresso' | 'Concluído';
  ordem: number;
}

