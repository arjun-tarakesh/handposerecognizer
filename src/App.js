import React, {useRef} from "react";
import * as tf from "@tensorflow/tfjs"
import * as handpose from "@tensorflow-models/handpose"
import Webcam from "react-webcam"
import { drawHand } from "./utils";
// import logo from './logo.svg';
import './App.css';


function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const runHandPose = async () => {
    const net = await handpose.load()
    console.log("loaded");
    // loop and detect hand so that it can draw
    setInterval(() => {
      detect(net);
    }, 100);
  }

  const detect = async (net) => {
    //check if data is available
    if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4){
     // Getting Video Properties
     const video = webcamRef.current.video;
     const videoWidth = webcamRef.current.video.videoWidth;
     const videoHeight = webcamRef.current.video.videoHeight;

     // Setting video width makes use of the wbcam's use ref
     webcamRef.current.video.width = videoWidth; 
     webcamRef.current.video.height = videoHeight;

     // Set canvas height and width
     canvasRef.current.width = videoWidth;
     canvasRef.current.height = videoHeight;

     // Make Detections
     const hand = await net.estimateHands(video);
     console.log(hand);

     //draw
     const ctx = canvasRef.current.getContext("2d");
     drawHand(hand, ctx)
    }

  }

  runHandPose();

  return (
    <div className="App"
    ><div className="container">
      <h1>Hand pose Recognizer</h1>
      <p>Please wait for 30-60s for modules to load</p>
      <p>(might lag in between)</p>
      <button className="Button"><a href="https://github.com/tensorflow/tfjs-models/tree/master/handpose" target="_blank">TensorFlowJS model</a></button>
      <button className="Button"><a href="https://github.com/arjun-tarakesh/handposerecognizer" target="_blank">Github Repo</a></button>
      </div>
      
      <Webcam ref={webcamRef}
          style={{
            
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop :"50px",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
            
          }} />

        <canvas
          ref={canvasRef}
          style={{
            
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
        </div>
    
  );
}

export default App;
