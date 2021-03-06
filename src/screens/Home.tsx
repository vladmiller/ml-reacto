/** @format */

import * as React from 'react'
import { NativeModules, NativeEventEmitter } from 'react-native'
import {
  View,
  Text,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native'

const { SpeechRecognition } = NativeModules
const calendarManagerEmitter = new NativeEventEmitter(SpeechRecognition)

/**
 * The structure of this screen is the following:
 *
 * - A simple intro (1 sentence) explaining what is going on
 * - A custom button to start/stop recognition,
 *  button will have an UI animation to show that we're registering text
 * - A view which will display all recognized words
 */

const HomeScreen: React.FC = () => {
  const [listening, setListening] = React.useState<boolean>(false)
  const [text, setText] = React.useState<string>('')

  React.useEffect(() => {
    const subscriptions = [
      calendarManagerEmitter.addListener('SRStart', () =>
        console.log('Speech Recognition started'),
      ),

      calendarManagerEmitter.addListener('SRStop', () => stopRecognition()),

      calendarManagerEmitter.addListener('SRResult', response =>
        setText(response),
      ),
    ]

    return () => {
      subscriptions.forEach(s => s.remove())
    }
  }, [])

  const startRecognition = async (): Promise<void> => {
    setText('')

    try {
      await SpeechRecognition.acquirePermissions()
      await SpeechRecognition.toListen()

      setListening(true)
    } catch (rejection) {
      console.error('Oh, snap', rejection)
    }
  }

  const stopRecognition = (): void => {
    SpeechRecognition.orNotToListen()
    setListening(false)
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.intro}>
            This is a sample application which shows how to integrate iOS ML
            Core framework into React Native
          </Text>

          {!listening ? (
            <Button title="Listen & Recognize" onPress={startRecognition} />
          ) : (
            <Button title="Stop it!" onPress={stopRecognition} />
          )}

          <ScrollView>
            <Text>{text}</Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inner: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
  },

  intro: {
    fontSize: 14,
    textAlign: 'center',
  },
})

export default HomeScreen
