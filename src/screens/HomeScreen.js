import React from 'react';
import { SafeAreaView, StackNavigator, TabNavigator } from 'react-navigation';
import { StyleSheet, View, ScrollView, StatusBar } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, H1, H2, H3, Text } from 'native-base';
import PropTypes from 'prop-types';
import Mapbox from '@mapbox/react-native-mapbox-gl';

import firebase from 'react-native-firebase';

Mapbox.setAccessToken('pk.eyJ1IjoiZHVyZ2FwcmFzYWQ4MTQiLCJhIjoiY2pia2gzbnpoMzB0ZzJxbHAzejJoYm53ciJ9.kQgl-u3sv0Ih0CNBYIkm1A');
// import LogOut from '../component/LogOut'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});


const HomeScreen = ({ navigation }) => (

//   <Container>

//   <Content contentContainerStyle={styles.container}>

//   </Content>



// </Container>
<View style={{flex:1}}>
<Mapbox.MapView
            styleURL={Mapbox.StyleURL.Street}
            zoomLevel={15}
            centerCoordinate={[78.448288, 17.437462]}
            style={{flex:1}}>
  </Mapbox.MapView>
</View>
);

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default HomeScreen;
