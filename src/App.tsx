/**
 * @format
 */

import * as React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  StatusBar,
  NativeModules,
} from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'

const { SpeechAPI } = NativeModules

const App: React.FC = () => (
  <>
    <StatusBar barStyle="dark-content" />
    <SafeAreaView>
      <View style={styles.body}>
        <Text style={styles.title}>Hello world!</Text>

        <Text style={styles.subtitle}>
          I am a TypeScript-based React Native application.
        </Text>

        <Button
          title="Call to RN Module"
          onPress={() => SpeechAPI.helloWorld()}
        />
      </View>
    </SafeAreaView>
  </>
)

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    marginTop: 32,
    paddingHorizontal: 24,
  },

  title: {
    color: Colors.dark,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },

  subtitle: {
    textAlign: 'center',
  },
})

export default App
