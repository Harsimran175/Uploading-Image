import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform, 
  ActivityIndicator,
} from 'react-native';

// Required dependency for Firebase
import firebase from 'firebase'
//Required to add seprate config file
//Need to create firebase database(add email id for UserId) for this
//Add config dependency 
import db from './config'

// Required dependency for upload Image
import * as ImagePicker from 'expo-image-picker';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {              // creating states for image/uploading//userId
      image: '',
      uploading: false,
      userId:"jasmeen7866@gmail.com"
    };
  }
  componentDidMount() {
        this.fetchImage(this.state.userId);
  }
  
  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.uploadImage(uri, this.state.userId);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    // Get the download URL
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: "#" });
      });
  };


  render() {
    return (
      <View style={styles.container}>
      <Text style={{fontSize:20,color:"green",margin:30,fontWeight:"bold"}}>Select and Uploading Image</Text>
        <Image
          source={{ uri: this.state.image }}
          style={{ width: 300, height: 300,borderRadius:30 }}
        />
        <TouchableOpacity style={{backgroundColor:"green",borderRadius:20,width:150,height:50,justifyContent:"center"}}onPress={this.selectPicture}>
          <Text style={{fontSize:16,color:"green",margin:30,fontWeight:"bold",color:"white",textAlign:"center",justifyContent:"center"}}>Choose Picture</Text>
        </TouchableOpacity>

        {!this.state.uploading ? (
          <TouchableOpacity  style={{marginTop:10,backgroundColor:"green",borderRadius:20,width:150,height:50,justifyContent:"center"}} onPress={this.uploadImageToDB}>
            <Text style={{fontSize:16,color:"green",margin:30,fontWeight:"bold",color:"white",textAlign:"center",justifyContent:"center"}}>Upload</Text>
          </TouchableOpacity>
        ) : (
          <ActivityIndicator size={'large'} color="black" />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
  },
});
