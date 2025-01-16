import { Text, View, StyleSheet, TextInput, Button, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";

function EditDishesScreen({ route }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');

    // Get edit form the route
    const { edit } = route.params || {};

    // Save dish
    const saveDish = () => {
        console.log("Save TODO")
    }

    // Take picture handler
    const takePictureHandler = async () => {
        console.log("TODO")
    }

    // Pick image from the library handler
    const pickImageHandler = async () => {
        
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images', 'videos'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };

    if (edit) {
        return (
            <View style={styles.root}>
                <Text>Edit Dish</Text>
                <Text>TODO</Text>
            </View>
        );
    } else {
        return (
            <View style={styles.root}>
                <Text>New Dish</Text>
                <TextInput value={name} onChangeText={setName} placeholder="Enter name" />
                <TextInput value={description} onChangeText={setDescription} placeholder="Enter description" />
                <Button title="Pick an image from camera roll" onPress={pickImageHandler} />
                <Button title="Take a picture" onPress={takePictureHandler} />
                {image && <Image source={{ uri: image }} style={styles.image} />} 

                <Button title="Save" onPress={() => { saveDish }} />

            </View>
        );
    }
}

export default EditDishesScreen;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: "50%",
        height: "50%"
    }
})