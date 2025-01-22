import {
    Text,
    View,
    StyleSheet,
    TextInput,
    Button,
    Image,
    Platform,
    Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState, useContext } from "react";
import { supabase } from "../util/supabase";
import { DDContext } from "../store/ContextStore";

function EditDishesScreen({ route }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [imageURL, setImageURL] = useState("");

    const { session } = useContext(DDContext);

    // Get edit form the route
    const { edit } = route.params || {};

    // Request permission for camera and media library
    const requestPermission = async () => {
        if (Platform.OS !== "web") {
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                alert(
                    "Sorry, we need camera roll permissions to make this work!"
                );
            }
        }
    };

    useEffect(() => {
        requestPermission();
    }, []);

    // Save dish
    const saveDish = async () => {
        if (!name || !description) {
            Alert.alert("Error", "Missing name, description or image");
            return;
        }

        // Check if not already in database
        const inDatabase = await databaseCheck();

        if (inDatabase) {
            Alert.alert("Error", `Dish named ${name} is already in database`);
            return;
        }

        // Save image to storage
        await saveImageToStorage();

        // Save to database
        await saveDishToDatabase();
    };

    // Check if name is not already in database !
    const databaseCheck = async () => {
        const { data, error } = await supabase
            .from("UsersDishes")
            .select("*") // Specify which columns to retrieve, e.g., "*" for all columns
            .eq("user_id", session["user"]["id"]) // Filter where user_id matches
            .eq("name", name); // Filter where name matches

        if (error) {
            console.error("Error fetching data:", error.message);
            return null;
        }

        return data ? true : false;
        
    };

    // Save dish to Supabase database
    const saveDishToDatabase = async () => {
        if (!session["user"]["id"]) {
            return;
        }

        try {
            const { data, error } = await supabase
                .from("UsersDishes") // Table name
                .insert([
                    {
                        user_id: session["user"]["id"],
                        name: name,
                        description: description,
                        image: imageURL,
                    },
                ]);

            if (error) {
                console.error("Error saving data:", error.message);
            } else {
                console.log("Data saved successfully:", data);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    // Save image to Supabase storage
    const saveImageToStorage = async () => {
        if (!image) {
            Alert.alert("Error", "Missing image");
            return;
        }

        const fileName = `${session["user"]["id"]}/${name}.jpeg`;

        // Create new FormData to upload to supabase
        const formData = new FormData();

        // Append the file to the FormData
        formData.append("file", {
            uri: image.uri, // File URI from Image Picker or other sources
            name: fileName, // A unique file name (e.g., "image.jpg")
            type: image.mimeType || "image/jpeg", // File MIME type (e.g., "image/png")
        });

        const { data, error } = await supabase.storage
            .from("dishesImages")
            .upload(fileName, formData);

        const filePath = data.path;

        if (error) {
            console.error("Error uploading file:", error);
            return;
        } else {
            console.log("Sucessfully send to storage");
            // Get image URL
            const { data } = supabase.storage
                .from("dishesImages")
                .getPublicUrl(filePath);
            setImageURL(data.publicUrl);
            return;
        }
    };

    // Pick image from the library handler
    const pickImageHandler = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    // Function to open the camera
    const openCameraHandler = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
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
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter name"
                />
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter description"
                />
                <Button
                    title="Pick an image from camera roll"
                    onPress={pickImageHandler}
                />
                <Button title="Take a picture" onPress={openCameraHandler} />
                {image && (
                    <Image source={{ uri: image.uri }} style={styles.image} />
                )}

                <Button
                    title="Save"
                    onPress={() => {
                        saveDish();
                    }}
                />
            </View>
        );
    }
}

export default EditDishesScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "50%",
        height: "50%",
    },
});
