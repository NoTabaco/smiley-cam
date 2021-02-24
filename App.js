import React, { useState, useEffect } from "react";
import { ActivityIndicator, Dimensions } from "react-native";
import { Camera } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import styled from "styled-components/native";

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

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === true) {
    return (
      <CenterView>
        <Camera
          style={{
            width: width - 40,
            height: height / 1.5,
            borderRadius: 10,
            overflow: "hidden",
          }}
          type={Camera.Constants.Type.front}
        />
        <StatusBar />
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
