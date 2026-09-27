import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Station {
  id?: string;
  name: string;
  canton?: string;
}

export interface Connection {
  id?: string;
  departureTime: string;
  arrivalTime: string;
  from: string;
  to: string;
  platform?: string;
  duration?: string;
  delay?: number;
  line?: string;
  changes?: number;
}

export interface FavoriteRoute {
  id?: string;
  fromStation: string;
  toStation: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class TransitService {
  private readonly http = inject(HttpClient);

  getStations(query = ''): Observable<Station[] | unknown> {
    const params = query.trim() ? new HttpParams().set('query', query.trim()) : undefined;
    return this.http.get<Station[] | unknown>('/api/stations', { params });
  }

  getConnections(from: string, to: string, date?: string): Observable<Connection[] | unknown> {
    let params = new HttpParams().set('from', from).set('to', to);
    if (date) params = params.set('date', date);
    return this.http.get<Connection[] | unknown>('/api/connections', { params });
  }

  getFavorites(): Observable<FavoriteRoute[]> {
    return this.http.get<FavoriteRoute[]>('/api/favorites');
  }

  addFavorite(route: Pick<FavoriteRoute, 'fromStation' | 'toStation'>): Observable<FavoriteRoute> {
    return this.http.post<FavoriteRoute>('/api/favorites', route);
  }

  deleteFavorite(id: string): Observable<void> {
    return this.http.delete<void>(`/api/favorites/${encodeURIComponent(id)}`);
  }
}
