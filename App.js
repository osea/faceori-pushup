import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
const io = require('socket.io-client');
import * as ScreenOrientation from 'expo-screen-orientation';

const SocketEndpoint = 'http://192.168.0.11:5000/test';
var dists = [130, 140, 150, 160, 170, 190, 200, 225, 250, 275, 300, 325, 360, 400, 440, 480, 500];


async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }

export default class App extends React.Component {
  state = {
    isConnected: false,
		imageUrl: "https://osea.github.io/faceori.github.io/sport/push-up/pushup-1.png",
    data: null,
    screenWidth: null,
    screenHeight: null 
	}

  componentDidMount() {
    
    
    changeScreenOrientation();
    
    var{w,h} = Dimensions.get('window');
    
    () => {
      this.setState({screenWidth:w})
      this.setState({screenHeight:h})
      console.log("-----------------------")
      console.log(this.state.screenWidth)
      console.log(this.state.screenHeight)
    }

    const socket = io(SocketEndpoint, {
      transports: ['websocket']
    });

    socket.on('connect', () => {
      this.setState({ isConnected: true });
    });

    socket.on('disconnect', () => {
      this.setState({ isConnected: false });
    });

    socket.on('result', data => {
      
      this.setState({data:data.distance});
      var i = 0;
      var filePath = null;

      for (i = 0; i < 17; i++){
        if(data.distance < dists[i]){
          
          filePath = "https://osea.github.io/faceori.github.io/sport/push-up/pushup-" + (i+1).toString() + ".png";
          this.setState({imageUrl:filePath});
          console.log(this.state.imageUrl)
          break;
        }
      }
      
    });
  }

  componentWillUnmout() {
    console.log("disconnect.");
    this.didFocusSubscription.remove();
    
  }

  render() {
    return (
        <View style = {styles.container}>
        <Image  resizeMode={'cover'} style={{backgroundColor: '#000', width: '120%', height: 250 }}  source={{ uri: this.state.imageUrl }} />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});
