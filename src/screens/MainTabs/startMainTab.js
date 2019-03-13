import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';

const startTabs = () => {
    Promise.all([
        Icon.getImageSource(Platform.OS === 'android' ? "md-map" : "ios-map", 30),
        Icon.getImageSource(Platform.OS === 'android' ? "md-share-alt" : "ios-share", 30),
        Icon.getImageSource(Platform.OS === 'android' ? "md-menu" : "ios-menu", 30)
    ]).then(icons => {
        const navLeftButton = {
            leftButtons: [
                {
                    icon: icons[2],
                    title: "Menu",
                    id: "sideDrawerToggle"
                }
            ]
        }
        Navigation.startTabBasedApp({
            tabs: [
                {
                    screen: "navigation-in-react-native.FindPlaceScreen",
                    label: "Find Place",
                    title: "Find Place",
                    icon: icons[0],
                    navigatorButtons: navLeftButton
                },
                {
                    screen: "navigation-in-react-native.SharePlaceScreen",
                    label: "Share Place",
                    title: "Share Place",
                    icon: icons[1],
                    navigatorButtons: navLeftButton
                }
            ],
            tabsStyle: {
                tabBarSelectedButtonColor: '#ff9900'
            },
            appStyle: {
                tabBarSelectedButtonColor: '#ff9900'
            },
            drawer: {
                left: {
                    screen: "navigation-in-react-native.SideDrawerScreen"
                }
            }
        });
    });


}

export default startTabs;
