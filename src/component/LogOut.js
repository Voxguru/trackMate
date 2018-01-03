import React from 'react';
import { SafeAreaView, StackNavigator, TabNavigator,NativeModules  } from 'react-navigation';
import { StyleSheet, ScrollView, StatusBar, View } from 'react-native';
import firebase from 'react-native-firebase';
import PropTypes from 'prop-types';




import { Container, Header, Content, Form, Item, Input, Label, Button, Text } from 'native-base';


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

logOut = () => {
    let self = this;
    firebase.auth().signOut()
    .then(() => { 
        console.log('Logged Out');
    })
    .catch(function (err) {
        console.log(err.message);
        return err;
      });
}

    


const LogOut = ({ logOut }) => (
    <Button bordered style={{alignSelf: 'center', marginTop: 20, width: '90%', justifyContent:'center'}}
      onPress={()=>this.logOut()}>
      <Text>Log out</Text>
    </Button>

);

LogOut.propTypes = {
  };


export default LogOut;