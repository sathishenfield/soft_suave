import { Component } from '@angular/core';
import { WebsocketService } from 'src/app/service/websocket.service';

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.css']
})
export class WebsocketComponent {
  messages: string[] = [];
  message: string = '';

  constructor(private webSocketService: WebsocketService) {}

  ngOnInit() {
    this.webSocketService.connect();
    this.webSocketService.subscribeToMessages((message) => {
      this.messages.push(message);
    });
  }

  sendMessage() {
    this.webSocketService.sendMessage(this.message);
    this.message = '';
  }

  ngOnDestroy() {
    this.webSocketService.disconnect();
  }
}
