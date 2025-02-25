import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WeatherResponse } from "@/weather.interface";
import Icon from "react-native-vector-icons/FontAwesome6";

export default function DetailsScreen() {
  // Get the weather parameter from the URL.
  // It should be a stringified JSON.
  const { weather: weatherParam } = useLocalSearchParams();
  const weather: WeatherResponse | null = weatherParam
    ? JSON.parse(weatherParam as string)
    : null;

  // Helper to convert Kelvin to Celsius.
  const kelvinToCelsius = (kelvin: number): string =>
    (kelvin - 273.15).toFixed(0);

  // Helper to format Unix timestamps to a readable time.
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

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

  if (!weather) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>No weather data available.</Text>
      </SafeAreaView>
    );
  }

  const router = useRouter();

  const handleBackPress = () => {
    if (weather) {
      router.push({
        pathname: "/(tabs)",
        params: { weather: JSON.stringify(weather) },
      });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgrounds[weather.weather[0].main.toLowerCase()]}
        style={styles.imageBackground}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>
            {weather.name}, {weather.sys.country}
          </Text>
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`,
            }}
            style={styles.icon}
          />
          <Text style={styles.condition}>{formatTime(weather.dt)}</Text>
          <Text style={styles.condition}>{weather.weather[0].description}</Text>
          <View style={styles.infoContainer}>
            <View style={styles.row}>
              <Icon name="temperature-three-quarters" size={30} color="#333" />
              <Text style={styles.info}>
                Temperature: {kelvinToCelsius(weather.main.temp)}°C
              </Text>
            </View>
            <View style={styles.row}>
              <Icon name="droplet" size={24} color="#333" />
              <Text style={styles.info}>
                Humidity: {weather.main.humidity}%
              </Text>
            </View>
            <View style={styles.row}>
              <Icon name="gauge" size={24} color="#333" />
              <Text style={styles.info}>
                Pressure: {weather.main.pressure} hPa
              </Text>
            </View>
            <View style={styles.row}>
              <Icon name="wind" size={24} color="#333" />
              <Text style={styles.info}>
                Wind Speed: {weather.wind.speed} m/s ({weather.wind.deg}°)
              </Text>
            </View>
            {weather.main.sea_level && (
              <View style={styles.row}>
                <Icon name="water" size={24} color="#333" />
                <Text style={styles.info}>
                  Sea Level: {weather.main.sea_level} hPa
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <Icon name="sun" size={24} color="#333" />
              <Text style={styles.info}>
                Sunrise: {formatTime(weather.sys.sunrise)}
              </Text>
            </View>
            <View style={styles.row}>
              <Icon name="mountain-sun" size={24} color="#333" />
              <Text style={styles.info}>
                Sunset: {formatTime(weather.sys.sunset)}
              </Text>
            </View>
            <View style={styles.row}>
              <Icon name="earth-asia" size={24} color="#333" />
              <Text style={styles.info}>
                Location: {weather.coord.lat.toFixed(2)},{" "}
                {weather.coord.lon.toFixed(2)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Text style={styles.backButtonText}>Back</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Slightly lighter overlay for better visibility
    paddingHorizontal: 20,
    paddingTop: 50, // More padding at the top for spacing
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  icon: {
    width: 120,
    height: 120,
    // marginVertical: 15,
  },
  condition: {
    fontSize: 22,
    textTransform: "capitalize",
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 15,
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Slightly transparent for blending
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "flex-start",
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
    marginVertical: 5,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    gap: 10,
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 30,
  },
  backButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
