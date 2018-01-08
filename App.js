/**
 * @flow
 */

import React, { Component } from 'react';
import { Button, ScrollView, NativeModules,NativeEventEmitter, Alert } from 'react-native';
import { SafeAreaView, StackNavigator, TabNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';
import Mapbox from '@mapbox/react-native-mapbox-gl';



import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import { Icon } from 'native-base';

import {RNHyperTrack as RNHyperTrackImport} from 'react-native-hypertrack';

var RNHyperTrack = NativeModules.RNHyperTrack;

const locationEmitter = new NativeEventEmitter(RNHyperTrack);

const subscription = locationEmitter.addListener(
  'location.changed',
);

var DeviceInfo = require('react-native-device-info');
var uid = DeviceInfo.getUniqueID();
var getDeviceName = DeviceInfo.getDeviceName();

const TabNav = TabNavigator(
  {
    MainTab: {
      screen: HomeScreen,
      path: '/',
      navigationOptions: {
        title: 'Welcome',
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            name={focused ? 'ios-home' : 'ios-home-outline'}
            style={{ fontSize: 26, color: tintColor }}
          />
        ),
      },
    },
    ProfileTab: {
      screen: ProfileScreen,
      path: '/profile',
      navigationOptions: {
        title: 'User Profile',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            name={focused ? 'ios-settings' : 'ios-settings-outline'}
            style={{ fontSize:26, color: tintColor }}
          />
        ),
      },
    },
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);

const StackNav = StackNavigator({
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: {
      title: 'Login Screen',
    },
  },
  Root: {
    screen: TabNav,
  },
});

class App extends Component {

  constructor() {
    super();
    this.unsubscriber = null;
    this.state = {
      user: null,
    };
    RNHyperTrack.initialize('pk_test_6b8e7439a5cb031f03b3771e1bd822e10a400d94');
    Mapbox.setAccessToken('pk.eyJ1IjoiZHVyZ2FwcmFzYWQ4MTQiLCJhIjoiY2pia2gzbnpoMzB0ZzJxbHAzejJoYm53ciJ9.kQgl-u3sv0Ih0CNBYIkm1A');
  }

  /**
   * Listen for any auth state changes and update component state
   */
  componentDidMount() {

              // Call this method to check location authorization status.
              RNHyperTrack.locationAuthorizationStatus().then((status) => {
                // Handle locationAuthorizationStatus API promise here
                console.log('locationAuthorizationStatus: ', status);
                RNHyperTrack.requestLocationAuthorization("title", "message");
              });
        
              // Call this method to check location services are enabled or not.
              RNHyperTrack.locationServicesEnabled().then(
                (callback) => {
                  // Handle locationServicesEnabled API callback here
                  console.log('locationServicesEnabled: ', callback);
                  if(!callback) {
                  Alert.alert("Alert, Enable Location Service","Please enable location services")                    
                  }
                }
              );
        
              // Call this method to check if Motion Activity API is available on the device
              // NOTE: Motion Authorization is required only for iOS. This API will return an error in Android.
              RNHyperTrack.canAskMotionPermissions().then(
                (callback) => {
                  // Handle canAskMotionPermissions API callback here
                  console.log('canAskMotionPermissions: ', callback);
                  RNHyperTrack.requestMotionAuthorization();
                }
              );
    

    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      
      if(user){
        this.setState({ user: user._user });

        RNHyperTrack.getOrCreateUser(
          user._user.email,
          user._user.uid,
          user._user.uid
      ).then(
          (success) => {
              // success callback
              console.log(success);

              RNHyperTrack.startTracking().then(
                (success) => {
                    // success callback
                    console.log(success);
                }, (error) => {
                    // error callback
                    console.log(error);
                }
            );
          }, (error) => {
              // error callback
              console.log(error);
          }
      );



        console.log(user._user);
      }else {
        console.log("Not Logged In");
        this.setState({ user: null });
        RNHyperTrack.stopTracking();

      }
      
    });
  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
    subscription.remove();
  }

  render() {
    return (this.state.user)?(<TabNav navigation={this.props.navigation}/>):(<StackNav navigation={this.props.navigation}/>);
  }
}

export default App;




// Todo: 
// 1 Need to create Forgot password page.
// 2 Add forgot password to StackNav
// 3 create db with user, team info, is_manager. If is_manager == true, then dont track.
// 4 write hypertrack  id to user db.
// 5 extract current location using id from rest api https://docs.hypertrack.com/gettingstarted/location.html
// 6 extract placeline for user. 
// 7 set intial bounds of the map based on team info.
// 


