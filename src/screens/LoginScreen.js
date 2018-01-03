import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, KeyboardAvoidingView, Alert } from 'react-native';
import firebase from 'react-native-firebase';

import HomeScreen from './HomeScreen'

import { Container, Header, Content, Form, Item, Input, Label, Button, Text } from 'native-base';

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

let email, password = '';




export default class LoginScreen extends Component { 
  constructor(props){
    super();
    this.unsubscribe = {};
    this.state = {
      email: '',
      password: '',
      secureTextEntry: true
    };
  }

  onLogin = () => {
    if(this.state.email != '' && this.state.password != ''){
     firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
        console.log('User signin success');
      })
      .catch((err) => {
        console.log(err);
        // Alert.alert('Check mail!','Incorrent SignIn Credentials');
      });
    } else {
      // Alert.alert("Oops!","Please check your username/password.")
    }
  }

  render() { 
    return (
      <Container style={{backgroundColor: '#F5FCFF'}}>
      <Content>
        <Form>
          <Item floatingLabel>
            <Label>Username</Label>
            <Input onChangeText={(email) => {this.setState({email})}} keyboardType={'email-address'} autoCapitalize={'none'}/>
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input secureTextEntry onChangeText={(password) => {this.setState({password})}}/>
          </Item>
        </Form>
        <Button bordered style={{alignSelf: 'center', marginTop: 20, width: '90%', justifyContent:'center'}}
          onPress={(email, password) => this.onLogin()}>
          <Text>Log in</Text>
        </Button>
      </Content>
    </Container>
    )
  }

}



LoginScreen.navigationOptions = {
  title: 'Log In',
};

