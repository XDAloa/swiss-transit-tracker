import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Connection, FavoriteRoute, Station, TransitService } from './transit.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private readonly transit = inject(TransitService);
  from = 'Zürich HB';
  to = 'Bern';
  date = 'today';
  stations: Station[] = [];
  connections: Connection[] = [];
  favorites: FavoriteRoute[] = [];
  stationField: 'from' | 'to' | null = null;
  loadingStations = false;
  loadingConnections = false;
  loadingFavorites = false;
  error = '';
  searched = false;

  ngOnInit(): void {
    this.loadFavorites();
    this.searchConnections();
  }

  get hasFavorite(): boolean {
    return this.favorites.some((favorite) =>
      favorite.fromStation.toLocaleLowerCase() === this.from.toLocaleLowerCase()
      && favorite.toStation.toLocaleLowerCase() === this.to.toLocaleLowerCase());
  }

  onStationInput(field: 'from' | 'to', value: string): void {
    this[field] = value;
    this.stationField = field;
    if (value.trim().length < 2) {
      this.stations = [];
      return;
    }
    this.loadingStations = true;
    this.transit.getStations(value).pipe(finalize(() => this.loadingStations = false))
      .subscribe({
        next: (result) => this.stations = this.normalizeStations(result),
        error: () => this.stations = []
      });
  }

  selectStation(station: Station): void {
    if (this.stationField) this[this.stationField] = station.name;
    this.stations = [];
    this.stationField = null;
  }

  closeSuggestions(): void {
    setTimeout(() => { this.stations = []; this.stationField = null; }, 150);
  }

  swapStations(): void {
    [this.from, this.to] = [this.to, this.from];
  }

  searchConnections(): void {
    if (!this.from.trim() || !this.to.trim()) {
      this.error = 'Bitte Start- und Zielbahnhof auswählen.';
      return;
    }
    this.error = '';
    this.searched = true;
    this.loadingConnections = true;
    this.transit.getConnections(this.from, this.to, this.date === 'today' ? undefined : this.date)
      .pipe(finalize(() => this.loadingConnections = false))
      .subscribe({
        next: (result) => this.connections = this.normalizeConnections(result),
        error: () => { this.connections = []; this.error = 'Verbindungen konnten nicht geladen werden.'; }
      });
  }

  loadFavorites(): void {
    this.loadingFavorites = true;
    this.transit.getFavorites().pipe(finalize(() => this.loadingFavorites = false))
      .subscribe({ next: (favorites) => this.favorites = favorites, error: () => this.error = 'Favoriten konnten nicht geladen werden.' });
  }

  addFavorite(): void {
    if (this.hasFavorite) return;
    this.transit.addFavorite({ fromStation: this.from, toStation: this.to }).subscribe({
      next: (favorite) => this.favorites = [favorite, ...this.favorites],
      error: () => this.error = 'Favorit konnte nicht gespeichert werden.'
    });
  }

  removeFavorite(favorite: FavoriteRoute): void {
    if (!favorite.id) return;
    this.transit.deleteFavorite(favorite.id).subscribe({
      next: () => this.favorites = this.favorites.filter((item) => item.id !== favorite.id),
      error: () => this.error = 'Favorit konnte nicht gelöscht werden.'
    });
  }

  useFavorite(favorite: FavoriteRoute): void {
    this.from = favorite.fromStation;
    this.to = favorite.toStation;
    this.searchConnections();
  }

  formatDelay(delay?: number): string {
    return delay ? `+${delay} Min.` : 'Pünktlich';
  }

  private normalizeStations(payload: unknown): Station[] {
    const values = Array.isArray(payload) ? payload : this.arrayFromPayload(payload, ['stations', 'locations', 'results']);
    return values.map((item) => typeof item === 'string' ? { name: item } : {
      name: String((item as Record<string, unknown>)['name'] ?? (item as Record<string, unknown>)['label'] ?? ''),
      id: String((item as Record<string, unknown>)['id'] ?? ''),
      canton: String((item as Record<string, unknown>)['canton'] ?? '')
    }).filter((station) => station.name);
  }

  private normalizeConnections(payload: unknown): Connection[] {
    const values = Array.isArray(payload) ? payload : this.arrayFromPayload(payload, ['connections', 'journeys', 'results']);
    return values.map((raw) => {
      const item = raw as Record<string, unknown>;
      const departureTime = String(item['departureTime'] ?? item['departure'] ?? item['fromTime'] ?? item['time'] ?? '--:--');
      const arrivalTime = String(item['arrivalTime'] ?? item['arrival'] ?? item['toTime'] ?? '--:--');
      return {
        id: String(item['id'] ?? ''),
        departureTime, arrivalTime,
        from: String(item['from'] ?? this.from),
        to: String(item['to'] ?? this.to),
        platform: String(item['platform'] ?? item['track'] ?? ''),
        duration: String(item['duration'] ?? this.durationBetween(departureTime, arrivalTime)),
        delay: Number(item['delay'] ?? item['delayMinutes'] ?? 0),
        line: String(item['line'] ?? item['service'] ?? item['number'] ?? '—'),
        changes: Number(item['changes'] ?? 0)
      };
    });
  }

  private arrayFromPayload(payload: unknown, keys: string[]): unknown[] {
    if (!payload || typeof payload !== 'object') return [];
    const record = payload as Record<string, unknown>;
    for (const key of keys) if (Array.isArray(record[key])) return record[key] as unknown[];
    return [];
  }

  private durationBetween(start: string, end: string): string {
    const parse = (value: string) => {
      const match = value.match(/(\d{1,2}):(\d{2})/);
      return match ? Number(match[1]) * 60 + Number(match[2]) : 0;
    };
    const minutes = Math.max(0, parse(end) - parse(start));
    return minutes ? `${Math.floor(minutes / 60)} h ${minutes % 60} min` : '—';
  }
}
