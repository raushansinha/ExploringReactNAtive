import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

class PickLocation extends Component {

    state = {
        focusedLocation: {
            latitude: 36.3256648,
            longitude: -94.2436278,
            latitudeDelta: 0.0122,
            longitudeDelta: Dimensions.get("window").width / Dimensions.get("window").height * 0.0122
        },
        locationChosen : false
    }

    pickLocationHandler = (event) => {
        const coordinate = event.nativeEvent.coordinate;

        this.map.animateToRegion({
            ...this.state.focusedLocation,
            latitude: coordinate.latitude,
            longitude: coordinate.longitude
        })

        this.setState( prevState => {
            return {
                focusedLocation: {
                    ...prevState.focusedLocation,
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude
                },
                locationChosen: true
            };
        });
        this.props.onLocationPick({
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
            latitudeDelta: 0.0122,
            longitudeDelta: Dimensions.get("window").width / Dimensions.get("window").height * 0.0122
        });
    }

    getCurrentLocationHandler = () => {
        navigator.geolocation.getCurrentPosition( pos => {
            const cordsEvent = {
                nativeEvent: {
                    coordinate: {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }
                }
            }

            this.pickLocationHandler(cordsEvent);
        },
        err => {
          //  console.log(err);
            alert("Failed to fetch location, please pick manually")
        })
    }
    render() {

        marker = null;

        if(this.state.locationChosen) {
            marker = <MapView.Marker coordinate={this.state.focusedLocation} />
        }

        return (
            <View style={styles.container}>
                <MapView 
                    style = {styles.map}
                    initialRegion={this.state.focusedLocation}
                    //region={this.state.focusedLocation}
                    onPress={this.pickLocationHandler}
                    ref={ref => this.map = ref}
                > 
                    {marker}
                </MapView>
                <View style={styles.button}>
                    <Button title="Locate Me"  onPress={this.getCurrentLocationHandler}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center"
    },
    map: {
        width: "100%",
        height: 250
    },
    button: {
        margin: 8
    }
});

export default PickLocation;