import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather',
  standalone: false,
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent implements OnInit {
  cityName: string = '';
  weatherData: any = null; // Stores the current weather data
  threeDayForecast: any[] = []; // Stores the 3-day weather forecast data
  loading: boolean = false; // Loading spinner state

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {}

  /**
   * Fetches weather data based on the entered city name.
   */
  getWeatherByCity(): void {
    if (!this.cityName) return;

    this.loading = true; // Show loading spinner
    this.weatherService.getWeatherByCity(this.cityName).subscribe(
      (data) => {
        this.weatherData = data;
        this.getForecast(data.coord.lat, data.coord.lon);
        this.loading = false; // Hide loading spinner
      },
      (error) => {
        console.error('Error fetching weather by city:', error);
        this.loading = false; // Hide loading spinner
        alert('Failed to fetch weather data. Please try again.');
      }
    );
  }

  /**
   * Fetches weather data based on the user's current location.
   */
  useMyLocation(): void {
    if (navigator.geolocation) {
      this.loading = true; // Show loading spinner
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.weatherService.getWeatherByLocation(latitude, longitude).subscribe(
            (data) => {
              this.weatherData = data;
              this.getForecast(latitude, longitude);
              this.loading = false; // Hide loading spinner
            },
            (error) => {
              console.error('Error fetching weather by location:', error);
              this.loading = false; // Hide loading spinner
              alert('Failed to fetch weather data for your location.');
            }
          );
        },
        (error) => {
          console.error('Geolocation error:', error);
          this.loading = false; // Hide loading spinner
          alert('Failed to get your location. Please try again.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }

  /**
   * Fetches the 3-day weather forecast based on latitude and longitude.
   * @param lat Latitude of the location
   * @param lon Longitude of the location
   */
  getForecast(lat: number, lon: number): void {
    this.weatherService.getThreeDayForecast(lat, lon).subscribe(
      (forecastData) => {
        const dailyData = forecastData.list.reduce((acc: any, item: any) => {
          const date = item.dt_txt.split(' ')[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(item);
          return acc;
        }, {});

        // Format forecast data for display
        this.threeDayForecast = Object.entries(dailyData)
          .slice(0, 3)
          .map(([date, values]: any) => ({
            date,
            morning: values[0]?.main.temp || null,
            afternoon: values[3]?.main.temp || null,
            evening: values[6]?.main.temp || null,
            iconMorning: values[0]?.weather[0]?.icon || null,
            iconAfternoon: values[3]?.weather[0]?.icon || null,
            iconEvening: values[6]?.weather[0]?.icon || null,
          }));
      },
      (error) => {
        console.error('Error fetching 3-day forecast:', error);
        alert('Failed to fetch the 3-day weather forecast. Please try again.');
      }
    );
  }
}
