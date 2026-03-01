import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  text = input<string>('');
  onDelete = output<void>();

  delete() {
    this.onDelete.emit();
  }
}
