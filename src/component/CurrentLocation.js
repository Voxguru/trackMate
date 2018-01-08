import React from 'react';
import { SafeAreaView, StackNavigator, TabNavigator } from 'react-navigation';
import { StyleSheet, ScrollView, StatusBar, View, NativeModules } from 'react-native';
import firebase from 'react-native-firebase';
import PropTypes from 'prop-types';


import { Container, Header, Content, Form, Item, Input, Label, Button, Text, Icon } from 'native-base';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});


loc = () => {
  var RNHyperTrack = NativeModules.RNHyperTrack;
  
  RNHyperTrack.getCurrentLocation().then((success) => {
    // Handle getCurrentLocation API success here
    console.log('getCurrentLocation success: ', success)
    currentLoc = [success.latitude, success.longitude];
}, (error) => {
    // Handle getCurrentLocation API error here
    console.log('getCurrentLocation error: ', error)
})
}

    


const CurrentLocations = ({ loc }) => (
    <Button bordered style={{alignSelf: 'center', marginTop: 20, width: '10%', justifyContent:'center',}}
      onPress={()=>loc()}>
     <Icon name='locate' style={{fontSize: 30, color: 'red'}} />
    </Button>

);

// CurrentLocations.propTypes = {
//   loc: PropTypes.func.isRequired
//   };


export default CurrentLocations;