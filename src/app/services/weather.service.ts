import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private API_KEY = '3da99dd8dbf6d4a44ff7b2ef8e97d029'; // Replace with your OpenWeather API key

  constructor(private http: HttpClient) {}

  getWeatherByCity(cityName: string): Observable<any> {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${this.API_KEY}`;
    return this.http.get(url);
  }

  getWeatherByLocation(lat: number, lon: number): Observable<any> {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.API_KEY}`;
    return this.http.get(url);
  }
  getThreeDayForecast(lat: number, lon: number): Observable<any> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=24&appid=${this.API_KEY}`;
    return this.http.get(url);
  }
  
}