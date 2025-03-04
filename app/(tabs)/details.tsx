import React, { useEffect, useRef, useState } from "react";
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
import { API_URL, API_KEY } from "@env";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";

export default function DetailsScreen() {
  const { city } = useLocalSearchParams();
  const [weather, setWeather] = useState<WeatherResponse[]>([]);
  const [background, setBackground] = useState("clear");
  const router = useRouter();
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

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

  const handleBackground = (mainWeather: string) => {
    setBackground(
      backgrounds[mainWeather.toLowerCase()] || backgrounds["clouds"]
    );
  };

  const fetchWeather = async (city: string) => {
    try {
      const response = await fetch(
        `${API_URL}/forecast?q=${city}&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.list) {
        setWeather(data.list.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeather([]);
    }
  };

  useEffect(() => {
    if (city) fetchWeather(city as string);
  }, [city]);

  useEffect(() => {
    if (weather.length > 0) {
      handleBackground(weather[0].weather[0].main);
    }
  }, [weather]);

  const kelvinToCelsius = (kelvin: number): string =>
    (kelvin - 273.15).toFixed(0);

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  if (weather.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>No weather data available.</Text>
      </SafeAreaView>
    );
  }

  const handleBackPress = () => {
    router.push({
      pathname: "/(tabs)",
      params: { weather: JSON.stringify(weather) },
    });
  };

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={background} style={styles.imageBackground}>
        <View style={styles.overlay}>
          <Carousel
            ref={ref}
            data={weather}
            width={300}
            height={500}
            onProgressChange={progress}
            renderItem={({ index }) => (
              <View>
                <Text style={styles.title}>
                  {city}, {weather[index].sys.country}
                </Text>
                <Image
                  source={{
                    uri: `https://openweathermap.org/img/wn/${weather[index].weather[0].icon}@2x.png`,
                  }}
                  style={styles.icon}
                />
                <Text style={styles.condition}>
                  {formatTime(weather[index].dt)}
                </Text>
                <Text style={styles.condition}>
                  {weather[index].weather[0].description}
                </Text>
                <View style={styles.infoContainer}>
                  <View style={styles.row}>
                    <Icon
                      name="temperature-three-quarters"
                      size={30}
                      color="#333"
                    />
                    <Text style={styles.info}>
                      Temperature: {kelvinToCelsius(weather[index].main.temp)}°C
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Icon name="droplet" size={24} color="#333" />
                    <Text style={styles.info}>
                      Humidity: {weather[index].main.humidity}%
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Icon name="gauge" size={24} color="#333" />
                    <Text style={styles.info}>
                      Pressure: {weather[index].main.pressure} hPa
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Icon name="wind" size={24} color="#333" />
                    <Text style={styles.info}>
                      Wind Speed: {weather[index].wind.speed} m/s (
                      {weather[index].wind.deg}°)
                    </Text>
                  </View>
                  {/* <View style={styles.row}>
                    <Icon name="sun" size={24} color="#333" />
                    <Text style={styles.info}>
                      Sunrise: {formatTime(weather[index].sys.sunrise)}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Icon name="mountain-sun" size={24} color="#333" />
                    <Text style={styles.info}>
                      Sunset: {formatTime(weather[index].sys.sunset)}
                    </Text>
                  </View> */}
                </View>
              </View>
            )}
          />
          <Pagination.Basic
            progress={progress}
            data={weather}
            dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
            containerStyle={{ gap: 5, marginTop: 10 }}
            onPress={onPressPagination}
          />
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
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
    backgroundColor: "#f5f5f5",
  },

  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for better contrast
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },

  icon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },

  condition: {
    fontSize: 20,
    fontWeight: "500",
    textTransform: "capitalize",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },

  infoContainer: {
    width: "95%",
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Transparent white for a clean effect
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },

  info: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
    marginVertical: 5,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
  },

  backButton: {
    backgroundColor: "rgba(255,255,255,0.3)", // Transparent button for smooth UI
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    marginBottom: 30,
  },

  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  paginationContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  paginationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
});
