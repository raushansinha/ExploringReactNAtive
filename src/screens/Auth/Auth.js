import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    Dimensions,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import DefaultInput from '../../components/UI/DefaultInput/DefaultInput';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import MainText from '../../components/UI/MainText/MainText';
import ButtonWithBackgroung from '../../components/UI/ButtonWithBackground/ButtonWithBackground';
import backGroundImage from '../../assets/background.jpg'

import Validate from '../../utility/validation/validation';

import { tryAuth, authAutoSignIn } from '../../store/actions/index';


class AuthScreen extends Component {
    // state = {
    //     respStyles: {
    //         pwdContainerDirection: Dimensions.get("window").height > 500 ? "column" : "row",
    //         pdwContainerJustifyContent: Dimensions.get("window").height > 500 ? "flex-start" : "space-between",
    //         pwdWrapperWidth: Dimensions.get("window").height > 500 ? "100%" : "45%"
    //     }
    // };

    state = {
        viewMode: Dimensions.get("window").height > 500 ? "portrait" : "landscape",
        authMode: 'login',
        controls: {
            email: {
                value: "",
                valid: false,
                validationRules: {
                    isEmail: true
                },
                touched: false
            },
            password: {
                value: "",
                valid: false,
                validationRules: {
                    minLength: 6
                },
                touched: false
            },
            confirmPassword: {
                value: "",
                valid: false,
                validationRules: {
                    equalTo: 'password'
                },
                touched: false
            }
        }
    };

    constructor(props) {
        super(props);

        // Dimensions.addEventListener("change", (dims) => {
        //     this.setState({
        //         respStyles: {
        //             pwdContainerDirection: Dimensions.get("window").height > 500 ? "column" : "row",
        //             pdwContainerJustifyContent: Dimensions.get("window").height > 500 ? "flex-start" : "space-between",
        //             pwdWrapperWidth: Dimensions.get("window").height > 500 ? "100%" : "45%"
        //         }
        //     });
        // });

        Dimensions.addEventListener("change", this.updateStyles);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener("change", this.updateStyles);
    }

    componentWillMount() {
        this.props.onAutoSignIn();
    }

    updateStyles = (dims) => {
        this.setState({
            viewMode: dims.window.height > 500 ? "portrait" : "landscape"
        });
    }

    authHandler = () => {
        const authData = {
            email: this.state.controls.email.value,
            password: this.state.controls.password.value
        }
        if (this.state.controls.email.valid &&
            this.state.controls.password.valid &&
            (this.state.controls.confirmPassword.valid || this.state.authMode === 'login')) {
            this.props.onAuthTry(authData, this.state.authMode);
        }
    }

    switchAuthModeHandler = () => {
        this.setState((prevState) => {
            return {
                authMode: prevState.authMode === 'login' ? "signup" : 'login'
            };
        });
    }

    updateInputState = (key, value) => {
        let connectedValue = {};
        if (this.state.controls[key].validationRules.equalTo) {
            const equalControl = this.state.controls[key].validationRules.equalTo;
            const equalValue = this.state.controls[equalControl].value;
            connectedValue = {
                equalTo: equalValue
            };
        }

        if (key === "password") {
            connectedValue = {
                ...connectedValue,
                equalTo: value
            };
        }
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    confirmPassword: {
                        ...prevState.controls.confirmPassword,
                        valid:
                            key === "password"
                                ? Validate(
                                    prevState.controls.confirmPassword.value,
                                    prevState.controls.confirmPassword.validationRules,
                                    connectedValue
                                )
                                : prevState.controls.confirmPassword.valid
                    },
                    [key]: {
                        ...prevState.controls[key],
                        value: value,
                        valid: Validate(
                            value,
                            prevState.controls[key].validationRules,
                            connectedValue
                        ),
                        touched: true
                    }
                }
            };
        })
    }

    dismissKeyboard = () => {
        Keyboard.dismiss();
    }

    render() {
        let headtingText = null;
        let confirmPasswordControl = null;

        let submitButton = (
            <ButtonWithBackgroung
                        onPress={this.authHandler} color="#29aaf4"
                        disabled={
                            this.state.controls.email.valid &&
                                this.state.controls.password.valid &&
                                (this.state.controls.confirmPassword.valid || this.state.authMode === 'login') ? false : true
                        }
                    >
                        Submit
                    </ButtonWithBackgroung>
        );

        if (this.props.isLoading) {
            submitButton = <ActivityIndicator />
        }

        if (this.state.viewMode === "portrait") {
            headtingText = (
                <MainText>
                    <HeadingText>Please Log In</HeadingText>
                </MainText>
            );
        }

        if (this.state.authMode === 'signup') {
            confirmPasswordControl = (
                <View style={this.state.viewMode === "portrait" ? styles.portraitPasswordWrapper : styles.landscapePasswordWrapper}>
                    <DefaultInput
                        placeholder="Confirm Password"
                        style={styles.input}
                        value={this.state.controls.confirmPassword.value}
                        valid={this.state.controls.confirmPassword.valid}
                        touched={this.state.controls.confirmPassword.touched}
                        onChangeText={(val) => this.updateInputState('confirmPassword', val)}
                        secureTextEntry
                    />
                </View>
            );
        }

        return (
            <ImageBackground source={backGroundImage} style={styles.backgroungImage}>
                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    {headtingText}
                    <ButtonWithBackgroung
                        color="#29aaf4"
                        onPress={this.switchAuthModeHandler}
                    >
                        Switch to {this.state.authMode === 'login' ? "sign up" : 'login'}
                    </ButtonWithBackgroung>
                    <TouchableWithoutFeedback onPress={this.dismissKeyboard}>

                        <View style={styles.inputContainer}>
                            <DefaultInput
                                placeholder="Your E-mail Address"
                                style={styles.input}
                                value={this.state.controls.email.value}
                                valid={this.state.controls.email.valid}
                                touched={this.state.controls.email.touched}
                                onChangeText={(val) => this.updateInputState('email', val)}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                            />
                            {/* <View style={{
                            flexDirection: this.state.respStyles.pwdContainerDirection,
                            justifyContent: this.state.respStyles.pdwContainerJustifyContent
                        }}>
                            <View style={{
                                width: this.state.respStyles.pwdWrapperWidth
                            }}>
                                <DefaultInput placeholder="Password" style={styles.input} />
                            </View>
                            <View style={{
                                width: this.state.respStyles.pwdWrapperWidth
                            }}>
                                <DefaultInput placeholder="Confirm Password" style={styles.input} />
                            </View>
                        </View> */}

                            <View style={this.state.viewMode === "portrait" || this.state.authMode === 'login' ? styles.portraitPasswordContainer : styles.landscapePasswordContainer}>
                                <View style={this.state.viewMode === "portrait" || this.state.authMode === 'login' ? styles.portraitPasswordWrapper : styles.landscapePasswordWrapper}>
                                    <DefaultInput
                                        placeholder="Password"
                                        style={styles.input}
                                        value={this.state.controls.password.value}
                                        valid={this.state.controls.password.valid}
                                        touched={this.state.controls.password.touched}
                                        onChangeText={(val) => this.updateInputState('password', val)}
                                        secureTextEntry
                                    />
                                </View>
                                {confirmPasswordControl}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                    {/* <Button title="Submit" onPress={this.LoginHandler} /> */}
                    {submitButton}
                </KeyboardAvoidingView>
            </ImageBackground>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    input: {
        backgroundColor: "#eee",
        borderColor: "#bbb"
    },
    inputContainer: {
        width: "80%"
    },
    backgroungImage: {
        width: "100%",
        flex: 1
    },
    portraitPasswordContainer: {
        flexDirection: "column",
        justifyContent: "flex-start"
    },
    landscapePasswordContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    portraitPasswordWrapper: {
        width: "100%"
    },
    landscapePasswordWrapper: {
        width: "45%"
    }
})

const mapStateToProps = state => {
    return {
        isLoading: state.ui.isLoading
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onAuthTry: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
        onAutoSignIn: () => dispatch(authAutoSignIn())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen)