import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const listItem = (props) => (
    <TouchableOpacity onPress={props.onItemPressed}>
         <View style={styles.listItemStyle} >
            <Image 
                style={styles.imageStyle}
                source={props.placeImage} 
                resizeMode="contain"
            />
            <Text>{props.placeName}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    listItemStyle: {
        width: "100%",
        padding: 10,
        backgroundColor: "#eee",
        flexDirection:"row",
        alignItems: "center"
    },
    imageStyle: {
        marginRight: 8,
        height: 40,
        width: 40
    }
});

export default listItem;