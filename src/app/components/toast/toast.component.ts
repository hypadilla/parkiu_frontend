import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  @Input() messages: string[] = [];

  remove(index: number): void {
    this.messages.splice(index, 1);
  }
}
