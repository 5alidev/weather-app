import { configureStore } from "@reduxjs/toolkit";

// import my reducer slice
import FetchWeatherReducer from "./features/fetchWeatherDataSlice";

export const store = configureStore({
  reducer: { FetchWeatherReducer },
});
