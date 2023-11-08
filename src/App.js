import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

// 0. Import depdendencies
import * as tf from "@tensorflow/tfjs"
import * as speech from "@tensorflow-models/speech-commands"


const App = () => {
// 1. Create model and action states
const [model, setModel] = useState(null)
const [action, setAction] = useState(null)
const [labels, setLabels] = useState(null) 

// 2. Create Recognizer
const loadModel = async () =>{
  const recognizer = await speech.create("BROWSER_FFT")
  console.log('Model Loaded')
  await recognizer.ensureModelLoaded();
  console.log(recognizer.wordLabels())
  setModel(recognizer)
  setLabels(recognizer.wordLabels())
}

useEffect(()=>{loadModel()}, []); 

// 
function argMax(arr){
  return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

// 3. Listen for Actions
const recognizeCommands = async () =>{
  console.log('Listening for commands')
  model.listen(result=>{

    var abcd = labels[argMax(Object.values(result.scores))]
    console.log(abcd)

    if(abcd == "stop")
      window.close();

      if(abcd == "up")
        scrollUp();

      if(abcd == "go")
        scrollDown();

    //console.log(result.spectrogram)
    setAction(labels[argMax(Object.values(result.scores))])
  }, {includeSpectrogram:true, probabilityThreshold:0.8})
  //setTimeout(()=>model.stopListening(), 10e3)
}

function scrollDown() {
  window.setTimeout(() => {
  }, 5000);
  window.scrollBy(0, 75);
  console.log("down");
  //alert("pageXOffset: " + window.scrollX + ", scrollY: " + window.scrollY);
}

function scrollUp() {
  window.scrollBy(0, -75);
  //alert("pageXOffset: " + window.scrollX + ", scrollY: " + window.scrollY);
  console.log("up");
  window.setTimeout(() => {
  }, 5000);
}

  return (
    <div className="App">
          <Button variant="outline-primary" onClick={recognizeCommands}>Command</Button>
          {action ? <div id="action">{action}</div>:<div>No Action Detected</div> }
    </div>
  );
}

export default App;