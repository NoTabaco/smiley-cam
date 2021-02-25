import React, { useState, useEffect } from "react";
import { ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Camera } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import * as FaceDetector from "expo-face-detector";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";

const { width, height } = Dimensions.get("window");

const ALBUM_NAME = "Smiley Cam";

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

  const cameraRef = React.createRef();

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
        takePhoto();
      }
    }
  };

  const takePhoto = async () => {
    try {
      if (cameraRef.current) {
        let { uri } = await cameraRef.current.takePictureAsync({
          quality: 1,
          exif: true,
        });
        if (uri) {
          savePhoto(uri);
        }
      }
    } catch (error) {
      alert(error);
      setSmileDetected(false);
    }
  };

  const savePhoto = async (uri) => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(uri);
        let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
        if (album === null) {
          album = await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync(asset, album.id, false);
        }
        setTimeout(() => {
          setSmileDetected(false);
        }, 2000);
      } else {
        setHasPermission(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (hasPermission === true) {
    return (
      <CenterView>
        <StatusBar />
        <Text>SMILE TO TAKE PHOTO</Text>
        <Camera
          style={{
            width: width - 40,
            height: height / 1.5,
            borderRadius: 10,
            overflow: "hidden",
          }}
          type={cameraType}
          onFacesDetected={smileDetected ? null : onFacesDetected}
          faceDetectorSettings={{
            detectLandmarks: FaceDetector.Constants.Landmarks.all,
            runClassifications: FaceDetector.Constants.Classifications.all,
          }}
          ref={cameraRef}
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
        <Text>Don't have permission for this</Text>
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
