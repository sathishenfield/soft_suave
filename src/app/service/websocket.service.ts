import { Injectable } from '@angular/core';
import { StompConfig, StompRService, StompService } from '@stomp/ng2-stompjs';
import { catchError, throwError } from 'rxjs';
import * as SockJS from 'sockjs-client';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private stompClient: StompService;

  constructor(private stompService: StompRService) {
    this.stompClient = stompService;
    this.stompClient.config = this.stompConfig();
  }

  private stompConfig(): StompConfig {
    return {
      url: () => new SockJS('http://localhost:8080/ws'),
      headers: {
        // Optional headers
      },
      heartbeat_in: 0, // Set to 0 to disable
      heartbeat_out: 20000, // Every 20 seconds
      reconnect_delay: 5000,
      debug: true, // Set to true for debug logging
    };
  }

  connect() {
    this.stompClient.initAndConnect();
  }

  sendMessage(message: string) {
    this.stompClient.publish({ destination: '/app/sendMessage', body: message });
  }

  subscribeToMessages(callback: (message: string) => void) {
    this.stompClient.subscribe('/topic').pipe(
      catchError(err => {
        console.log(err);
        return throwError(() => new Error(err['name']));
      })
    ).subscribe((msg) => {
        callback(msg.body);
      });
  }

  disconnect() {
    this.stompClient.disconnect();
  }
}
