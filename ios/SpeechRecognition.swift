//
//  SpeecRecognitionBridge.swift
//  MLReacto
//
//  Created by Vlad Miller on 03/10/2019.
//

import Foundation
import Speech

@available(iOS 10.0, *)
@objc(SpeechRecognition)
class SpeechRecognition: RCTEventEmitter {
  lazy private var audioEngine = AVAudioEngine()
  lazy private var speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))!
  private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
  private var recognitionTask: SFSpeechRecognitionTask?
  
  override func supportedEvents() -> [String]! {
    return ["SRStart", "SRStop", "SRResult"]
  }
  
  // Issue request for speech recognition
  @objc func acquirePermissions(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    SFSpeechRecognizer.requestAuthorization { authStatus in
      switch authStatus {
      case .authorized:
        resolve(nil)
      case .notDetermined:
        reject("denied", "User denied access to speech recognition feature", nil)
      case .denied:
        reject("denied", "Speech recognition not yet authorized", nil)
      case .restricted:
        reject("denied", "Speech recognition restricted on this device", nil)
      @unknown default:
        reject("denied", "We have absolutely no clue what happened and ahy", nil)
      }
    }
  }
  
  // Open mic and start listening
  @objc func toListen(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    // Cancel the previous task if it's running.
    recognitionTask?.cancel()
    self.recognitionTask = nil
    
    // initialize audio session
    let audioSession = AVAudioSession.sharedInstance()
    
    do {
      try audioSession.setCategory(.record, mode: .measurement, options: .duckOthers)
      try audioSession.setActive(true, options: .notifyOthersOnDeactivation)
    } catch {
      reject("error", "Cannot setup audio session", error)
    }
    
    let inputNode = audioEngine.inputNode
    
    // create speech recognition request
    recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
    guard let recognitionRequest = recognitionRequest else { fatalError("Unable to create a SFSpeechAudioBufferRecognitionRequest object") }
    recognitionRequest.shouldReportPartialResults = true
    
    // Configure the microphone input.
    let recordingFormat = inputNode.outputFormat(forBus: 0)
    inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { (buffer: AVAudioPCMBuffer, when: AVAudioTime) in
        self.recognitionRequest?.append(buffer)
    }
    
    do {
      audioEngine.prepare()
      try audioEngine.start()
    } catch {
      reject("error", "Cannot initialize mic", error)
    }
    
    recognitionTask = speechRecognizer.recognitionTask(with: recognitionRequest) {
      result, error in
      var isFinal = false
      
      if let result = result {
        isFinal = result.isFinal
        self.sendEvent(withName: "SRResult", body: result.bestTranscription.formattedString)
      }
      
      if error != nil || isFinal {
        // Stop recognizing speech if there is a problem.
        self.audioEngine.stop()
        inputNode.removeTap(onBus: 0)

        self.recognitionRequest = nil
        self.recognitionTask = nil

        self.sendEvent(withName: "SRStop", body: nil)
      }
    }

    self.sendEvent(withName: "SRStart", body: nil)
    resolve(nil)
  }
  
  // Stop listening
  @objc func orNotToListen(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    audioEngine.stop()
    recognitionRequest?.endAudio()
    
    resolve(nil)
  }
  

}
