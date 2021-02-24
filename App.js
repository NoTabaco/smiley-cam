import React, { useState, useEffect } from "react";
import { ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Camera } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import * as FaceDetector from "expo-face-detector";

const { width, height } = Dimensions.get("window");

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: cornflowerblue;
`;

const Text = styled.Text`
  color: white;
  font-size: 22px;
`;

const IconBar = styled.View`
  margin-top: 40px;
`;

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setcameraType] = useState(Camera.Constants.Type.front);
  const [smileDetected, setSmileDetected] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const switchCameraType = () => {
    setcameraType(
      cameraType === Camera.Constants.Type.front
        ? Camera.Constants.Type.back
        : Camera.Constants.Type.front
    );
  };

  const onFacesDetected = ({ faces }) => {
    const face = faces[0];
    if (face) {
      if (face.smilingProbability > 0.7) {
        setSmileDetected(true);
        console.log("take photo");
      }
    }
  };

  if (hasPermission === true) {
    return (
      <CenterView>
        <StatusBar />
        <Camera
          style={{
            width: width - 40,
            height: height / 1.5,
            borderRadius: 10,
            overflow: "hidden",
          }}
          onFacesDetected={smileDetected ? null : onFacesDetected}
          faceDetectorSettings={{
            detectLandmarks: FaceDetector.Constants.Landmarks.all,
            runClassifications: FaceDetector.Constants.Classifications.all,
          }}
          type={cameraType}
        />
        <IconBar>
          <TouchableOpacity onPress={switchCameraType}>
            <MaterialIcons
              name={
                cameraType === Camera.Constants.Type.front
                  ? "camera-rear"
                  : "camera-front"
              }
              size={50}
              color="white"
            />
          </TouchableOpacity>
        </IconBar>
      </CenterView>
    );
  } else if (hasPermission === false) {
    return (
      <CenterView>
        <Text>No access to camera</Text>
      </CenterView>
    );
  } else if (hasPermission === null) {
    return <CenterView />;
  } else {
    return (
      <CenterView>
        <ActivityIndicator />;
      </CenterView>
    );
  }
}
