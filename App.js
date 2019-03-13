import { Navigation } from 'react-native-navigation';

import { Provider } from 'react-redux';


import AuthScreen from './src/screens/Auth/Auth';
import SharePlaceScreen from './src/screens/SharePlace/SharePlace';
import FindPlaceScreen from './src/screens/FindPlace/FindPlace';
import PlaceDetailScreen from './src/screens/PlaceDetail/PlaceDetail';
import SideDrawerScreen from './src/screens/SideDrawer/SideDrawer';

import configureStore from './src/store/configureStore';

const store = configureStore();

//Register Screen
Navigation.registerComponent(
  "navigation-in-react-native.AuthScreen",
  () => AuthScreen,
  store,
  Provider);

Navigation.registerComponent(
  "navigation-in-react-native.SharePlaceScreen",
  () => SharePlaceScreen,
  store,
  Provider);

Navigation.registerComponent(
  "navigation-in-react-native.FindPlaceScreen",
  () => FindPlaceScreen,
  store,
  Provider);

Navigation.registerComponent(
  "navigation-in-react-native.PlaceDetailScreen",
  () => PlaceDetailScreen,
  store,
  Provider);

Navigation.registerComponent(
  "navigation-in-react-native.SideDrawerScreen",
  () => SideDrawerScreen);

//Start a App
Navigation.startSingleScreenApp({
  screen: {
    screen: "navigation-in-react-native.AuthScreen",
    title: "Login"
  }
});