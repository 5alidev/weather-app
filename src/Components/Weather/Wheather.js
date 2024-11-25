import { useEffect, useState } from "react";
import moment from "moment";

// for translation
import { useTranslation } from "react-i18next";

// get state, set state with redux toolkit
import { useSelector, useDispatch } from "react-redux";

// import thunk for async code
import { FetchDataThunk } from "../../app/features/fetchWeatherDataSlice";

const Weather = () => {
  // get state
  const weatherData = useSelector((state) => state.FetchWeatherReducer.data);
  // set state
  const dispatch = useDispatch();

  const [dayTime, setDayTime] = useState({ day: "", time: "" });
  const [lonLat, setLonLat] = useState({ lon: "-5.530234", lat: "31.520464" });
  const [language, setLanguage] = useState("en");

  const { t, i18n } = useTranslation();

  // define the function that finds the users geolocation
  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          // update the value of userlocation variable
          setLonLat({ lon: longitude, lat: latitude });
        },
        // if there was an error getting the users location
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
    // if geolocation is not supported by the users browser
    else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // const cancelAxiosRequest = useRef(null); //this is for the useEffect Clean Up
  useEffect(() => {
    setDayTime({
      day: moment().format("dddd"),
      time: moment().format("h:mm: a").toUpperCase(),
    });

    dispatch(FetchDataThunk(lonLat));
  }, [lonLat, dispatch]);

  const handleTranslate = () => {
    setLanguage(language === "en" ? "ar" : "en");
    i18n.changeLanguage(language);
  };

  // change dir based on language
  useEffect(() => {
    if (i18n.language === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
    }
  }, [i18n.language]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full h-screen rounded-md bg-gray-700 p-4 flex items-center flex-col justify-evenly text-gray-50 sm:w-3/4 sm:h-auto sm:gap-7 sm:shadow-md md:w-2/4">
        <div className="flex items-center gap-4 sm:justify-between sm:w-full">
          <button
            onClick={getUserLocation}
            className="flex items-center gap-1 py-3 px-5 bg-gray-800 text-gray-100 outline-none border-none cursor-pointer rounded-md transition-all ease-linear duration-300 hover:bg-gray-300 hover:text-gray-900"
          >
            <p>Get My Location</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
          </button>
          <button
            className="w-10 h-10 py-3 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center transition-all duration-300 ease-linear hover:border-solid hover:border-2 hover:border-gray-900 hover:shadow-md"
            onClick={handleTranslate}
          >
            {language.toUpperCase()}
          </button>
        </div>
        <div className="flex items-center flex-col sm:flex-row sm:w-full sm:justify-around">
          <div
            className={`flex flex-col items-center gap-1 sm:${
              language === "ar" ? "items-end" : "items-center"
            }`}
          >
            <h1 className={`text-3xl`}>{t(weatherData.cityName)}</h1>
            <h3 className="text-gray-200 font-light">
              {t(dayTime.day)}, {dayTime.time}
            </h3>
          </div>
          <img src={weatherData.weatherIcon} alt="weather icon" />
          <div
            className={`flex flex-col items-center gap-2 sm:${
              language === "ar" ? "items-end" : "items-center"
            }`}
          >
            <h2 className="text-4xl">{weatherData.tempInCelsius}°C</h2>
            <h4 className="text-gray-200 text-sm font-light">
              {t("Feels Like ")}
              <span className="text-gray-50 bold font-medium">
                {weatherData.feelsLike + " "}
                <span> °C </span>
              </span>
            </h4>
            <p className="text-gray-200 font-light">
              {t(weatherData.weatherDescription)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 sm:gap-8">
          <div className="flex flex-col items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <p>{t("Sunrise")}</p>
            <p>{weatherData.sunrise}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
              />
            </svg>

            <p>{t("Wind")}</p>
            <p>{weatherData.windSpeed}m/s</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z"
              />
            </svg>

            <p>{t("Humidity")}</p>
            <p>{weatherData.humidity}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
