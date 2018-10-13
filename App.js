import React from 'react';
import { StyleSheet, Text, View, Animated,PermissionsAndroid  } from 'react-native';
import { API_KEY } from './utils/WeatherAPIKey';
import Weather from './components/Weather';



export default class App extends React.Component {


  state = {
    isLoading: true,
    temperature: 0,
    weatherCondition: null,
    name:null,
    error: null
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.fetchWeahter(position.coords.latitude, position.coords.longitude);
      },
      error => {
        this.setState({
          error: 'Error Getting Weather Condtions'
        });
      }
    );
    async function requestCameraPermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': 'Current Location Permission',
            'message': 'Weather App need the Current Location to access the app'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the Current Location")
        } else {
          console.log("Location permission denied")
        }
      } catch (err) {
        console.warn(err)
      }
    }
  }

  fetchWeahter(lat, lon) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
      .then(res => res.json())
      .then(json => {
        // console.log(json);
        this.setState({
          temperature: json.main.temp,
          weatherCondition: json.weather[0].main,
          name:json.name,
          isLoading: false
        });
      });
  }

  render() {
    const { isLoading, weatherCondition, temperature } = this.state;
    return (
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Fetching The Weather</Text>
          </View>
        ) : (
          <Weather weather={this.state.weatherCondition} temperature={this.state.temperature} name={this.state.name} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDE4'
  },
  loadingText: {
    fontSize: 30
  }
});
