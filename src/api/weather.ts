import { API_CONFIG } from "./config"
import type { Coordinates, ForecastData, GeocodingResponse, WeatherData, AirQualityData, UVIndexData } from "./types";

class WeatherAPI{
    private createUrl(endpoint:string,params:Record<string,string | number>)
    {
        const searchParams=new URLSearchParams({
            appid:API_CONFIG.API_KEY,
            ...params //taking all params
        })
        return `${endpoint}?${searchParams.toString()}`
    }
    private async fetchData<T>(url:string):Promise<T>{
        const response=await fetch(url);

        if(!response.ok){
            throw new Error(`Weather API Error: ${response.statusText}`);
        }
        return response.json();
    }
    async getCurrentWeather({lat,lon}:Coordinates):Promise<WeatherData>{
        const url=this.createUrl(`${API_CONFIG.BASE_URL}/weather`,{
            lat:lat.toString(),
            lon:lon.toString(),
            units:API_CONFIG.DEFAULT_PARAMS.units
        });
        
        return this.fetchData<WeatherData>(url);
    }

    async getForecast({lat,lon}:Coordinates):Promise<ForecastData>{
        const url=this.createUrl(`${API_CONFIG.BASE_URL}/forecast`,{
            lat:lat.toString(),
            lon:lon.toString(),
            units:API_CONFIG.DEFAULT_PARAMS.units,
        });
        
        return this.fetchData<ForecastData>(url);
    }

    // It will be an array
    async reverseGeocode({lat,lon}:Coordinates):Promise<GeocodingResponse[]>{
        const url=this.createUrl(`${API_CONFIG.GEO}/reverse`,{
            lat:lat.toString(),
            lon:lon.toString(),
            limit:1,
        });
        
        return this.fetchData<GeocodingResponse[]>(url);
    }


    async searchLocations(query:string):Promise<GeocodingResponse[]>{
        const url=this.createUrl(`${API_CONFIG.GEO}/direct`,{
            q:query,
            limit:'5',
        });
        
        return this.fetchData<GeocodingResponse[]>(url);
    }

    async getAirQuality({lat,lon}:Coordinates):Promise<AirQualityData>{
        const url=this.createUrl(`${API_CONFIG.BASE_URL}/air_pollution`,{
            lat:lat.toString(),
            lon:lon.toString(),
        });
        
        return this.fetchData<AirQualityData>(url);
    }

    async getUVIndex({lat,lon}:Coordinates):Promise<UVIndexData>{
        // Note: UV Index endpoint may require subscription or use the onecall API
        // For now, returning a mock implementation that calculates UV based on time
        const now = new Date();
        const hour = now.getHours();
        
        // Simulate UV index based on time of day (peak around noon)
        let value = 0;
        if (hour >= 6 && hour <= 18) {
            // Simple parabolic function peaking at noon
            const hoursFromNoon = Math.abs(hour - 12);
            value = Math.max(0, 8 - (hoursFromNoon * 0.8));
        }
        
        return Promise.resolve({
            lat,
            lon,
            date_iso: now.toISOString(),
            date: Math.floor(now.getTime() / 1000),
            value
        });
    }
}

export const weatherAPI=new WeatherAPI();