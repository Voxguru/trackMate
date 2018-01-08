import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text, H1 } from 'native-base';
import LogOut from '../component/LogOut'
import CurrentLocation from '../component/CurrentLocation'



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

const ManagerScreen = () => (
  <View style={styles.container}>
    <H1>
      Profile Screen
    </H1>
    <CurrentLocation />
    <LogOut />


  </View>
);

ManagerScreen.navigationOptions = {
  title: 'Manager Screen',
};

export default ManagerScreen;
