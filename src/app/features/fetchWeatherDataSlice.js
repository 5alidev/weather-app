import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// axios
import axios from "axios";

const initialState = {
  data: {},
  isLoading: false,
};

// just for time, nothing to do with redux
const getTimeFromUnixTimestamp = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Ensures 12-hour format with AM/PM
  }); // This will return the time in local timezone
};

export const FetchDataThunk = createAsyncThunk(
  "weather/data",
  async (lonLat) => {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lonLat.lat}&lon=${lonLat.lon}&appid=${process.env.REACT_APP_WEATHER_API}`
    );
    const cityName = res.data.name;
    const weatherIcon = `https://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`;
    const tempInCelsius = Math.round(res.data.main.temp - 273.15);
    const feelsLike = Math.round(res.data.main.feels_like - 273.15);
    const weatherDescription = res.data.weather[0].description;
    const sunrise = getTimeFromUnixTimestamp(res.data.sys.sunrise);
    const windSpeed = res.data.wind.speed;
    const humidity = res.data.main.humidity;

    return {
      cityName,
      weatherIcon,
      tempInCelsius,
      feelsLike,
      weatherDescription,
      sunrise,
      windSpeed,
      humidity,
    };
  }
);

export const fetchWeatherDataSlice = createSlice({
  name: "fetchWeatherData",
  initialState,
  reducers: {
    showHello: (state, action) => {
      console.log("=== Hello There From fetchWeatherData ===");
      state.data = { test: "working .." };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchDataThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(FetchDataThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(FetchDataThunk.rejected, (state, action) => {
        state.isLoading = false;
        console.log("Error While Fetching the Weather Data");
      });
  },
});

export const { showHello } = fetchWeatherDataSlice.actions;
export default fetchWeatherDataSlice.reducer;
