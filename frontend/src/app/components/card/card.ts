import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  //Recebe o texto da tarefa para exibir
  text = input<string>('');
  
  //Avisa o componente pai (Column) que o botão de deletar foi clicado
  onDelete = output<void>();

  delete() {
    this.onDelete.emit();
  }
}
