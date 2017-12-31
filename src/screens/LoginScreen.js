import React from 'react';
import PropTypes from 'prop-types';
import { Button, StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';

import {SafeAreaView, StackNavigator, TabNavigator, NavigationActions} from 'react-navigation';
import HomeScreen from './HomeScreen'

import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';

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


// const {navigation} = this.props.navigation;

// const resetAction = NavigationActions.reset({
//   index: 0,
//   actions: [
//     NavigationActions.navigate({ routeName: 'Root' }),
//     NavigationActions.navigate({ routeName: 'LoginScreen' }),
//   ],
// });

const LoginScreen = ({ navigation }) => (

  <Container style={{backgroundColor: '#F5FCFF'}}>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input />
            </Item>
          </Form>
        </Content>
      </Container>
  // <View style={styles.container}>
  //   <Text style={styles.welcome}>
  //     Screen A
  //   </Text>
  //   <Text style={styles.instructions}>
  //     This is great
  //   </Text>
  //   <Button
  //     onPress={() => navigation.dispatch({type: 'Navigation/RESET', index: 0, actions: [{ type: 'Navigate', routeName:'Root'}]})
  //     }
  //     title="Log in"
  //   />
  // </View>
);


// dispatch({type: 'Reset', index: 0, actions: [{ type: 'Navigate', routeName:'Home'}]})
// LoginScreen.propTypes = {
//     navigation: PropTypes.object.isRequired,
//   };

LoginScreen.navigationOptions = {
  title: 'Log In',
};

export default LoginScreen;
