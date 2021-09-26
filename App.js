/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState, useRef} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {
  Platform,
  BackHandler,
  Dimensions,
  SafeAreaView,
  View,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';

import NetInfo from '@react-native-community/netinfo';

const BACKGROUND_COLOR = '#FFFFFF';
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const ANDROID_BAR_HEIGHT = Platform.OS === 'android' ? 8 : 30;

export default function App(props) {
  const WEBVIEW = useRef();

  const [loading, setLoading] = useState(true);
  const [backButtonEnabled, setBackButtonEnabled] = useState(false);
  const [isConnected, setConnected] = useState(true);

  // Webview content loaded
  function webViewLoaded() {
    setLoading(false);
   SplashScreen.hide();
  }

  // Webview navigation state change
  function onNavigationStateChange(navState) {
    setBackButtonEnabled(navState.canGoBack);
  }

  useEffect(() => {
    // Handle back event
    function backHandler() {
      if (backButtonEnabled) {
        WEBVIEW.current.goBack();
        return true;
      }
    }

    // Subscribe to back state vent
    BackHandler.addEventListener('hardwareBackPress', backHandler);

    // Unsubscribe
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backHandler);
  }, [backButtonEnabled]);

  useEffect(() => {
    // Subscribe for net state
    const netInfroSubscribe = NetInfo.addEventListener(state => {
      setConnected(state.isConnected);
      if (!state.isConnected) {
        alert(
          'No internet connection, please connect your device to the internet to use this application.',
        );
      }
    });

    // Clean up
    return netInfroSubscribe;
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
      }}>
      <View
        style={{
          height: ANDROID_BAR_HEIGHT,
          backgroundColor: BACKGROUND_COLOR,
        }}></View>

      {isConnected && (
        <WebView
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            width: DEVICE_WIDTH,
            height: DEVICE_HEIGHT,
          }}
          originWhitelist={['*']}
          onLoad={webViewLoaded}
          ref={WEBVIEW}
          mixedContentMode="always"
          useWebKit={true}
          geolocationEnabled={true}
          onNavigationStateChange={onNavigationStateChange}
          source={{uri: 'https://opensea.io/'}}
          onHttpError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.warn(
              'WebView received error status code: ',
              nativeEvent.statusCode,
            );
          }}

          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      )}
    </SafeAreaView>
  );
}
