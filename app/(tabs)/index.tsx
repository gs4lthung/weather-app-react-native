import { WeatherResponse } from "@/weather.interface";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { API_URL, API_KEY } from "@env";
export default function HomeScreen() {
  const router = useRouter();

  const [city, setCity] = useState("Ho Chi Minh");
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [background, setBackground] = useState("clear");

  const backgrounds: { [key: string]: any } = {
    clear: require("../../assets/images/clear.png"),
    clouds: require("../../assets/images/clouds.png"),
    drizzle: require("../../assets/images/drizzle.png"),
    dust: require("../../assets/images/dust.png"),
    fog: require("../../assets/images/fog.png"),
    haze: require("../../assets/images/haze.png"),
    mist: require("../../assets/images/mist.png"),
    rain: require("../../assets/images/rain.png"),
    sand: require("../../assets/images/sand.png"),
    smoke: require("../../assets/images/smoke.png"),
    snow: require("../../assets/images/snow.png"),
    squall: require("../../assets/images/squall.png"),
    tornado: require("../../assets/images/tornado.png"),
    thunderstorm: require("../../assets/images/thunderstorm.png"),
  };

  // Fetch weather data for the given city.
  const fetchWeather = (city: string) => {
    fetch(
      `${API_URL}?q=${city}&appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setWeather(data);
        handleBackground(data.weather[0].main);
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
        setWeather(null);
      });
  };

  // Initial fetch when the component mounts.
  useEffect(() => {
    fetchWeather(city);
  }, []);

  // Set the background based on the main weather condition.
  const handleBackground = (mainWeather: string) => {
    switch (mainWeather) {
      case "Clear":
        setBackground("clear");
        break;
      case "Clouds":
        setBackground("clouds");
        break;
      case "Drizzle":
        setBackground("drizzle");
        break;
      case "Dust":
        setBackground("dust");
        break;
      case "Fog":
        setBackground("fog");
        break;
      case "Haze":
        setBackground("haze");
        break;
      case "Mist":
        setBackground("mist");
        break;
      case "Rain":
        setBackground("rain");
        break;
      case "Sand":
        setBackground("sand");
        break;
      case "Smoke":
        setBackground("smoke");
        break;
      case "Snow":
        setBackground("snow");
        break;
      case "Squall":
        setBackground("squall");
        break;
      case "Tornado":
        setBackground("tornado");
        break;
      case "Thunderstorm":
        setBackground("thunderstorm");
        break;
      default:
        setBackground("clouds");
        break;
    }
  };

  // Navigate to the details page
  const handleDetailsPress = () => {
    if (weather) {
      router.push({
        pathname: "/details",
        params: { weather: JSON.stringify(weather) },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgrounds[background]}
        style={styles.imageBackground}
      >
        <View style={styles.overlay}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter city name"
              placeholderTextColor="#ccc"
              value={city}
              onChangeText={setCity}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => fetchWeather(city)}
            >
              <Icon name="search" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Weather Info */}
          <View style={styles.weatherInfo}>
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${weather?.weather[0].icon}.png`,
              }}
              style={styles.weatherIcon}
            />
            <Text style={styles.temperature}>
              {weather?.main?.temp
                ? `${(weather.main.temp - 273.15).toFixed(0)}°C`
                : "N/A"}
            </Text>
            <Text style={styles.condition}>{weather?.weather[0].main}</Text>
            <Text style={styles.location}>
              {weather?.name}
              {weather?.sys?.country ? ", " : ""} {weather?.sys?.country}
            </Text>
          </View>

          {/* Weather Details */}
          <View style={styles.weatherDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>
                {weather?.main?.humidity ? `${weather.main.humidity}%` : "N/A"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Wind Speed</Text>
              <Text style={styles.detailValue}>
                {weather?.wind?.speed ? `${weather.wind.speed} km/h` : "N/A"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Min Temp</Text>
              <Text style={styles.detailValue}>
                {weather?.main?.temp_min
                  ? `${(weather.main.temp_min - 273.15).toFixed(0)}°C`
                  : "N/A"}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Max Temp</Text>
              <Text style={styles.detailValue}>
                {weather?.main?.temp_max
                  ? `${(weather.main.temp_max - 273.15).toFixed(0)}°C`
                  : "N/A"}
              </Text>
            </View>
          </View>

          {/* Details Button */}
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={handleDetailsPress}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    justifyContent: "space-between",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 25,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "white",
  },
  searchButton: {
    padding: 8,
  },
  weatherInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  weatherIcon: {
    width: 150,
    height: 150,
  },
  temperature: {
    fontSize: 72,
    fontWeight: "bold",
    color: "white",
  },
  condition: {
    fontSize: 24,
    color: "white",
    marginBottom: 5,
  },
  location: {
    fontSize: 18,
    color: "white",
  },
  weatherDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  detailItem: {
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "white",
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  detailsButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 30,
  },
  detailsButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
