/** @format */

import * as React from 'react'
import { NativeModules, NativeEventEmitter } from 'react-native'
import { View, Text, Button, SafeAreaView, StyleSheet } from 'react-native'

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

  React.useEffect(() => {
    const srStartSubscription = calendarManagerEmitter.addListener(
      'SRStart',
      () => console.log('Speech Recognition started'),
    )

    const srStopSubscription = calendarManagerEmitter.addListener(
      'SRStop',
      () => console.log('Speech Recognition stopped'),
    )

    const srResultSubscription = calendarManagerEmitter.addListener(
      'SRResult',
      response => console.log(response),
    )

    return () => {
      srStartSubscription.remove()
      srStopSubscription.remove()
      srResultSubscription.remove()
    }
  }, [])

  const startRecognition = async (): Promise<void> => {
    try {
      await SpeechRecognition.acquirePermissions()
      await SpeechRecognition.toListen()

      setListening(true)
    } catch (rejection) {
      console.error('Oh, snap', rejection)
    }
  }

  const stopRecognition = async (): Promise<void> => {
    try {
      await SpeechRecognition.orNotToListen()

      setListening(false)
    } catch (rejection) {
      console.error('Oh, poop', rejection)
    }
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.intro}>
          This is a sample application which shows how to integrate iOS ML Core
          framework into React Native
        </Text>

        {!listening ? (
          <Button title="Listen & Recognize" onPress={startRecognition} />
        ) : (
          <Button title="Stop it!" onPress={stopRecognition} />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
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
