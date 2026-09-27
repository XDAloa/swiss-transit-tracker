import { Component } from '@angular/core';

interface Connection {
  time: string;
  departure: string;
  arrival: string;
  duration: string;
  changes: number;
  status: 'On time' | 'Delayed';
  line: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Swiss Transit Tracker';
  from = 'Zürich HB';
  to = 'Bern';
  date = 'Today';
  connections: Connection[] = [
    { time: '14:32', departure: 'Zürich HB', arrival: 'Bern', duration: '56 min', changes: 0, status: 'On time', line: 'IC 8' },
    { time: '14:59', departure: 'Zürich HB', arrival: 'Bern', duration: '59 min', changes: 0, status: 'On time', line: 'IC 1' },
    { time: '15:32', departure: 'Zürich HB', arrival: 'Bern', duration: '56 min', changes: 0, status: 'Delayed', line: 'IC 8' }
  ];
  searched = false;

  swapStations(): void {
    [this.from, this.to] = [this.to, this.from];
  }

  search(): void {
    this.searched = true;
  }
}
