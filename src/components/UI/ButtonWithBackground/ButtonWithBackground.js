import React from 'react';
import { 
    TouchableOpacity, 
    TouchableNativeFeedback, 
    Text, 
    View, 
    StyleSheet,
    Platform } from 'react-native';
import PlaceDetail from '../../../screens/PlaceDetail/PlaceDetail';

const buttonWithBackgroung = (props) => {
    const content = (
        <View style={[
            styles.button, 
            { backgroundColor: props.color }, 
            props.disabled ? styles.disabled : null
        ]}>
            <Text style={props.disabled ? styles.disabledText : null}>{props.children}</Text>
        </View>);
    
    if(props.disabled) {
        return content;
    }
    
    if(Platform.OS === "android") {
        return(
            <TouchableNativeFeedback onPress={props.onPress}>
                {content}
            </TouchableNativeFeedback>
        );
    }

    return(
        <TouchableOpacity onPress={props.onPress}>
            {content}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "black",
        margin: 8,
        padding: 5,
    },
    disabled:{
        backgroundColor: "#eee",
        borderColor: "#aaa"
    },
    disabledText:{
        color: "#aaa"
    }
});

export default buttonWithBackgroung;
