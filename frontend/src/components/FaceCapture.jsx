// src/components/FaceCapture.js
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const FaceCapture = () => {
  const videoRef = useRef();
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      setIsModelLoaded(true);
    };

    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Error accessing webcam: ", err));
  };

  const captureFace = async () => {
    const detections = await faceapi.detectSingleFace(videoRef.current).withFaceLandmarks().withFaceDescriptor();
    if (detections) {
      localStorage.setItem("userFaceDescriptor", JSON.stringify(detections.descriptor));
      alert("Face data saved!");
    } else {
      alert("Face not detected, please try again.");
    }
  };

  useEffect(() => {
    if (isModelLoaded) {
      startVideo();
    }
  }, [isModelLoaded]);

  return (
    <div>
      <h2>Capture Your Face</h2>
      <video ref={videoRef} autoPlay muted width="720" height="560" />
      <button onClick={captureFace} disabled={!isModelLoaded}>
        Save Face Data
      </button>
    </div>
  );
};

export default FaceCapture;
