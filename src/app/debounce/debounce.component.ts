import { Component } from '@angular/core';
import { debounce,  fromEvent, interval } from 'rxjs';

@Component({
  selector: 'app-debounce',
  templateUrl: './debounce.component.html',
  styleUrls: ['./debounce.component.css']
})
export class DebounceComponent {

  ngAfterViewInit() {
    const keyup$ = fromEvent(document.getElementById('search')!, 'keyup');
    keyup$.pipe(
      debounce(() => interval(1000)) // Extract the value of the input field
    ).subscribe(value => {
      const inputElement = value.target as HTMLInputElement;
      const value2 = inputElement.value;
      console.log(`Search term: ${value2}`);
    });
  }
}

// Apply the debounceTime operator

