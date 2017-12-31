import React from 'react';
import { SafeAreaView, StackNavigator, TabNavigator } from 'react-navigation';
import { StyleSheet, Text, View, ScrollView, Button, StatusBar } from 'react-native';

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

const HomeScreen = ({ navigation }) => (
  <ScrollView style={styles.container} >
  <SafeAreaView forceInset={{ horizontal: 'always' }}>
  <View >
    <Text style={styles.welcome}>
      Home Screen
    </Text>
  </View>
    
  </SafeAreaView>
</ScrollView>
);


export default HomeScreen;
