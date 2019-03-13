import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { deletePlace } from '../../store/actions/index';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

class PlaceDetail extends Component {
    state = {
        viewMode: Dimensions.get("window").height > 500 ? "portrait" : "landscape"
    };

    constructor(props) {
        super(props);
        Dimensions.addEventListener("change", this.updateStyles);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener("change", this.updateStyles);
    }

    updateStyles = (dims) => {
        this.setState({
            viewMode: dims.window.height > 500 ? "portrait" : "landscape"
        });
    }

    placeDeletedHandler = () => {
        this.props.onDeletePlace(this.props.selectedPlace.key);
        this.props.navigator.pop();
    };

    render() {
        return (
            <View style={[
                styles.container, 
                this.state.viewMode === "portrait" ? styles.portraitContainer : styles.landscapeContainer
            ]}>
                <View style={styles.subContainer}>
                    <Image
                        source={this.props.selectedPlace.image}
                        style={styles.imageStyle}
                    />
                </View>
                <View style={styles.subContainer}>
                    <MapView
                        style = {[styles.map, this.state.viewMode === "portrait" ? styles.portraitMap : styles.landscapeMap ]}
                        initialRegion={this.props.selectedPlace.location}
                    >
                        <MapView.Marker coordinate={this.props.selectedPlace.location} />
                    </MapView>
                </View>
                <View style={styles.subContainer}>
                    <View>
                        <Text style={styles.textStyle}>{this.props.selectedPlace.name}</Text>
                    </View>
                    <View>
                        {/* <Button title="Delete" color="red" onPress={props.onItemDeleted}/> */}
                        <TouchableOpacity onPress={this.placeDeletedHandler}>
                            <View style={styles.deleteButton}>
                                <Icon size={30} name={Platform.OS === 'android' ? "md-trash" : "ios-trash"} color="red" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 25,
        flex: 1
    },
    portraitContainer: {
        flexDirection: "column"
    },
    landscapeContainer: {
        flexDirection: "row"
    },
    subContainer: {
        flex: 1,
    },
    imageStyle: {
        width: "100%",
        height: "100%"
    },
    textStyle: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 28
    },
    deleteButton: {
        alignItems: "center"
    },
    map: {
        width: "100%",
        height: "100%",
    },
    portraitMap: {
        marginTop: 5
    },
    landscapeMap: {
        marginLeft: 5
    }
});

const mapDispatchToProps = dispatch => {
    return {
        onDeletePlace: (key) => dispatch(deletePlace(key)),
    };
};

export default connect(null, mapDispatchToProps)(PlaceDetail);
