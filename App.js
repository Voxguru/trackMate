/**
 * @flow
 */

import React, { Component } from 'react';
import { Button, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView, StackNavigator, TabNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import { Icon } from 'native-base';


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
  }

  /**
   * Listen for any auth state changes and update component state
   */
  componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user });
    });
  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  render() {
    return <StackNav navigation={this.props.navigation}/>;
  }
}

export default App;