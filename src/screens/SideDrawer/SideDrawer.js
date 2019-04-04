import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';

import { authLogout } from '../../store/actions/index';

export class SideDrawer extends Component {

    logoutHandler = () => {
        this.props.onAppLogout;
    }

    render() {
        return (
            <View
                style={[
                    styles.container,
                    {width: Dimensions.get("window").width * 0.8}
                ]}
            >
                <TouchableOpacity onPress={this.props.onLogout}>
                    <View style={styles.drawerItem}>
                        <Icon name={Platform.OS === 'android' ? "md-log-out" : "ios-log-out"} size={30} color="#aaa" style={styles.drawerItemIcon} />
                        <Text> Sign Out</Text>
                    </View>
                </TouchableOpacity>
            </View>


        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: "white"
    },
    drawerItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eee",
        padding: 10
    },
    drawerItemIcon: {
        marginRight: 10
    }
});

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(authLogout())
    };
};

export default connect(null, mapDispatchToProps)(SideDrawer);
