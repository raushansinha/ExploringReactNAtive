import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';

import PlaceInput from '../../components/PlaceInput/PlaceInput';
import MainText from '../../components/UI/MainText/MainText';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import PickImage from '../../components/PickImage/PickImage';
import PickLocation from '../../components/PickLocation/PickLocation';

import { addPlace, placeAdded } from '../../store/actions/index';
import Validate from '../../utility/validation/validation';
import { startAddPlace } from '../../store/actions/index';


class SharePlaceScreen extends Component {

    static navigatorStyle = {
        navBarButtonColor: "orange"
    }

    constructor(props) {
        super(props);

        this.props.navigator.setOnNavigatorEvent(this.navigatorEventHandler);
    }

    componentWillMount() {
        this.reset();
    }

    reset = () => {
        this.setState({
            controls: {
                placeName: {
                    value: "",
                    valid: false,
                    validationRules: {
                        notEmpty: true
                    },
                    touched: false
                },
                location: {
                    value: null,
                    valid: false
                },
                image: {
                    value: null,
                    valid: true
                }
            }
        });
    }

    componentDidUpdate() {
        if(this.props.placeAdded) {
            this.props.navigator.switchToTab({tabIndex: 0});
            //this.props.onStartAddPlace();
        }
    }

    onNavigatorEvent = event => {
        if(event.type === "ScreenChangedEvent") {
            if(event.id === "willAppear") {
                this.props.onStartAddPlace();
            }
        }
    }

    navigatorEventHandler = event => {
        //  console.log(event);
        if (event.type === "NavBarButtonPress") {
            if (event.id === "sideDrawerToggle") {
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
        }
    }

    updateInputState = (key, value) => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    [key]: {
                        ...prevState.controls[key],
                        value: value,
                        valid: Validate(
                            value,
                            prevState.controls[key].validationRules,
                        ),
                        touched: true
                    }
                }
            };
        });
    };

    placeAddedHandler = () => {
        //if (this.state.controls.placeName.value.trim() !== "") {
        this.props.onAddPlace(
            this.state.controls.placeName.value,
            this.state.controls.location.value,
            this.state.controls.image.value
        );
        //}
        this.reset();
        this.imagePicker.reset();
        this.locationPicker.reset();

        //this.props.navigator.switchToTab({tabIndex : 0});
    }

    locationPickedHandler = (location) => {
        this.setState((prevState) => {
            return {
                controls: {
                    ...prevState.controls,
                    location: {
                        value: location,
                        valid: true
                    }
                }
            }
        });
    }

    pickImageHandler = (image) => {
        this.setState((prevState) => {
            return {
                controls: {
                    ...prevState.controls,
                    image: {
                        value: image,
                        valid: true
                    }
                }
            }
        });
    }

    render() {
        submitButton = (
            <Button
                title="Share the place!"
                color={
                    this.state.controls.placeName.valid
                        && this.state.controls.location.valid
                        && this.state.controls.image.valid ? "#841584" : "#aaa"}
                onPress={this.placeAddedHandler}
                disabled={!this.state.controls.placeName.valid
                    || !this.state.controls.location.valid
                    || !this.state.controls.image.valid}
            />
        );

        if (this.props.isLoading) {
            submitButton = <ActivityIndicator />
        }

        return (
            <ScrollView>
                <View style={styles.container}>
                    <MainText>
                        <HeadingText>Share a place with us!</HeadingText>
                    </MainText>
                    <PickImage 
                        onImagePicked={this.pickImageHandler} 
                        ref={ ref => this.imagePicker = ref} 
                    />
                    <PickLocation 
                        onLocationPick={this.locationPickedHandler} 
                        ref={ref => this.locationPicker = ref}
                    />
                    <PlaceInput
                        placeData={this.state.controls.placeName}
                        onChangeText={(val) => this.updateInputState('placeName', val)}
                    />

                    <View style={styles.button}>
                        {submitButton}
                    </View>

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    button: {
        margin: 8
    },
    buttonStyle: {
        width: "25%",
        backgroundColor: "blue"
    },
    placeHolder: {
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "#eee",
        width: "80%",
        height: 150
    },
    previewImage: {
        width: "100%",
        height: "100%"
    }
});


const mapStateToProps = state => {
    return {
        isLoading: state.ui.isLoading,
        placeAdded: state.places.placeAdded
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onAddPlace: (name, location, image) => dispatch(addPlace(name, location, image)),
        onStartAddPlace: () => dispatch(startAddPlace()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SharePlaceScreen);