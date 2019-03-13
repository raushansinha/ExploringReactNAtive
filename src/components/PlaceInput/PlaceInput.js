import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import DefaultInput from '../UI/DefaultInput/DefaultInput';

const placeInput = (props) => (
    <View style={styles.inputButtonContainer}>
        <DefaultInput
            placeholder="Place name"
            onChangeText={props.onChangeText}
            value={props.placeData.value}
            valid={props.placeData.valid}
            touched={props.placeData.touched}
        />
    </View>
);


const styles = StyleSheet.create({
    inputButtonContainer: {
        //flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    }
});


export default placeInput;