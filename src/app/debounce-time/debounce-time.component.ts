import { Component } from '@angular/core';
import { debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'app-debounce-time',
  templateUrl: './debounce-time.component.html',
  styleUrls: ['./debounce-time.component.css']
})
export class DebounceTimeComponent {
  ngAfterViewInit() {
    const keyup$ = fromEvent(document.getElementById('search')!, 'keyup');
    keyup$.pipe(
      debounceTime(1000) // Extract the value of the input field
    ).subscribe(value => {
      const inputElement = value.target as HTMLInputElement;
      const value2 = inputElement.value;
      console.log(`Search term: ${value2}`);
    });
  }
}
