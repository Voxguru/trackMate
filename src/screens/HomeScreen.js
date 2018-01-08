import React,  {Component} from 'react';
import { SafeAreaView, StackNavigator, TabNavigator } from 'react-navigation';
import { StyleSheet, View, ScrollView, StatusBar, NativeModules, Animated } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, H1, H2, H3, Text } from 'native-base';
import PropTypes from 'prop-types';
import Mapbox from '@mapbox/react-native-mapbox-gl';

import MultiSelect from 'react-native-multiple-select';

import firebase from 'react-native-firebase';
// import CurrentLocation from '../component/CurrentLocation';

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
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'orange',
    transform: [{ scale: 0.6 }],
  },
});
// let currentLoc = ;




export default class HomeScreen extends Component {

  constructor (props) {
    super(props);

    this.state = {
      route: null,
      currentPoint: [],
      routeSimulator: null,
      centered: false,
      data:undefined,
      selectedItems: [],
      items: [],
    };

    // this.onStart = this.onStart.bind(this);
    this.items = [];

  }


  async componentDidMount (){
    const endpoint = 'https://api.hypertrack.com/api/v1/users/'; 
    const option = {
      method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'token sk_test_57de6a84eaffe7a6dcef44a9412d06f2a6f6124d',      
    },
    }
    const response = await fetch(endpoint, option); 
    const data = await response.json(); 
    const items = data.results.filter(results => (results.availability_status == "online" && results.is_connected== true));
    const coordinates = [];

    items.forEach(function(item){
      coordinates.push(item.last_location.geojson.coordinates)
    });

    this.setState({ 
        data, 
        items,
        coordinates
      }); 
  // console.log(this.state.data);
  console.log(coordinates);
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
    console.log(selectedItems);
  };


  onAnnotationSelected (activeIndex, feature) {
    if (this.state.activeIndex === activeIndex) {
      return;
    }

    this._scaleIn = new Animated.Value(0.6);
    Animated.timing(this._scaleIn, { toValue: 1.0, duration: 200 }).start();
    this.setState({ activeAnnotationIndex: activeIndex });

    if (this.state.previousActiveAnnotationIndex !== -1) {
      this.map.moveTo(feature.geometry.coordinates, 500);
    }
  }

  onAnnotationDeselected (deselectedIndex) {
    let nextState = {};

    if (this.state.activeAnnotationIndex === deselectedIndex) {
      nextState.activeAnnotationIndex = -1;
    }

    this._scaleOut = new Animated.Value(1);
    Animated.timing(this._scaleOut, { toValue: 0.6, duration: 200 }).start();
    nextState.previousActiveAnnotationIndex = deselectedIndex;
    this.setState(nextState);
  }


  renderAnnotations  () {
    const items = [];

    if(this.state.coordinates){
      for (let i = 0; i < this.state.coordinates.length; i++) {
        const coordinate = this.state.coordinates[i];
        const title = `Longitude: ${this.state.coordinates[i][0]} Latitude: ${this.state.coordinates[i][1]}`;
        const id = `pointAnnotation${i}`;
  
        let animationStyle = {};
        if (i === this.state.activeAnnotationIndex) {
          animationStyle.transform = [{ scale: this._scaleIn }];
        } else if (i === this.state.previousActiveAnnotationIndex) {
          animationStyle.transform = [{ scale: this._scaleOut }];
        }
  
        items.push(
          <Mapbox.PointAnnotation
            key={id}
            id={id}
            title='Test'
            selected={i === 0}
            onSelected={(feature) => this.onAnnotationSelected(i, feature)}
            onDeselected={() => this.onAnnotationDeselected(i)}
            coordinate={coordinate}>
  
            <View style={styles.annotationContainer}>
              <Animated.View style={[styles.annotationFill, animationStyle]} />
            </View>
  
            <Mapbox.Callout title={title} />
          </Mapbox.PointAnnotation>
        );
      }
  
      return items;
    } else {
      return null
    }

  }

  onPressLearnMore = () =>{
    console.log(this.state.data.results[11].name);
  }


  render () {
    const { selectedItems } = this.state;
    return (
      <View style={{flex:1}}>
        <Mapbox.MapView
          ref={(ref) => this.map = ref}
          styleURL={Mapbox.StyleURL.Street}
          zoomLevel={12}
          compassEnabled={true}
          style={{flex:1}}>
          {this.renderAnnotations()}
          {    }
        </Mapbox.MapView>
        <View style={{position: 'absolute', top: '10%', width: '100%'}}>
        {/* <Button onPress={this.onPressLearnMore}>
          <H1>Click</H1>
        </Button> */}
          <MultiSelect
          items={this.state.items}
          uniqueKey="id"
          ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={selectedItems}
          selectText="Show other Users"
          searchInputPlaceholderText="Search Items..."
          onChangeInput={ (text)=> console.log(text)}
          altFontFamily="Roboto"
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        />
        </View>
      </View>
    )
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
