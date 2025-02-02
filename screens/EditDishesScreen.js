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

function EditDishesScreen({ route, navigation }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

    const { session } = useContext(DDContext);

    // Get edit form the route
    let { edit, dish } = route.params || {};

    // Request permission for camera and media library
    const requestPermission = async () => {
        if (Platform.OS !== "web") {
            const { status: cameraStatus } =
                await ImagePicker.requestCameraPermissionsAsync();
            const { status: libraryStatus } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (cameraStatus !== "granted" || libraryStatus !== "granted") {
                alert(
                    "Sorry, we need camera roll permissions to make this work!"
                );
            }
        }
    };

    useEffect(() => {
        requestPermission();
    }, []);

    useEffect(() => {
        if (edit && dish) {
            setName(dish.name);
            setDescription(dish.description);
            setImage({ uri: dish.image });
        }
    }, [edit]);

    // Delete dish
    const deleteDish = async () => {
        // Show confirm alert
        const confirm = await showConfirmAlert();

        if (!confirm) {
            return;
        }

        // Remove image from storage
        await removeImageFromStorage(dish.image);

        // Delete dish from database
        const { data, error } = await supabase
            .from("UsersDishes")
            .delete()
            .eq("id", dish.id);

        if (error) {
            console.error("Error deleting data:", error.message);
        } else {
            console.log("Data deleted successfully:", data);
        }

        Alert.alert("Deleted!", `Dish named ${name} was sucessfully deleted`);

        navigation.goBack();
    };

    // Update dish
    const updateDish = async () => {
        if (!name || !description) {
            Alert.alert("Error", "Missing name, description or image");
            return;
        }

        // Check if not already in database
        const inDatabase = await databaseCheck(dish.id);

        if (inDatabase) {
            Alert.alert("Error", `Dish named ${name} is already in database`);
            return;
        }

        let imageURL = image.uri;

        // Remove old image if new image is selected
        if (dish.image != image.uri) {
            await removeImageFromStorage(dish.image);
            imageURL = await saveImageToStorage();
            setImage({ uri: imageURL });
        }

        // Update dish in database
        const { data, error } = await supabase
            .from("UsersDishes")
            .update({
                name: name,
                description: description,
                image: imageURL,
            })
            .eq("id", dish.id);

        if (error) {
            console.error("Error updating data:", error.message);
        } else {
            console.log("Data updated successfully:", data);
        }

        Alert.alert("Updated!", `Dish named ${name} was sucessfully updated`);

        navigation.goBack();
    };

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
        const imageURL = await saveImageToStorage();

        // Save to database
        await saveDishToDatabase(imageURL);

        Alert.alert("Saved!", `Dish named ${name} was sucessfully saved`);

        navigation.goBack();
    };

    // Check if name is not already in database
    const databaseCheck = async (id) => {
        let data, error;

        if (!id) {
            ({ data, error } = await supabase
                .from("UsersDishes")
                .select("*")
                .eq("user_id", session["user"]["id"])
                .eq("name", name));
        } else {
            ({ data, error } = await supabase
                .from("UsersDishes")
                .select("*")
                .eq("user_id", session["user"]["id"])
                .eq("name", name)
                .neq("id", id));
        }

        if (error) {
            console.error("Error fetching data:", error.message);
            return null;
        }

        return data && data.length > 0; // Return true if duplicate exists, else false
    };

    // Save dish to Supabase database
    const saveDishToDatabase = async (imageURL) => {
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

        const fileName = `${session["user"]["id"]}/${name}-${image.fileSize}.jpeg`;

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
            const publicUrl = await getPublicUrl(filePath);

            return publicUrl;
        }
    };

    // Remove image from supabase storage
    const removeImageFromStorage = async (publicURL) => {
        const imagePath = extractFilePath(publicURL);

        const { data, error } = await supabase.storage
            .from("dishesImages")
            .remove([imagePath]);

        if (error) {
            console.error("Error removing file:", error);
            return;
        } else {
            console.log("Sucessfully removed from storage");
        }
    };

    const extractFilePath = (publicURL) => {
        const baseURL = `${supabase.storageUrl}/object/public/dishesImages/`; // Your storage bucket URL
        return publicURL.replace(baseURL, ""); // Remove the base URL to get the file path
    };

    // Get publicUrl
    const getPublicUrl = async (filepath) => {
        const { data } = supabase.storage
            .from("dishesImages")
            .getPublicUrl(filepath);
        return data.publicUrl;
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

    const showConfirmAlert = () => {
        return new Promise((resolve) => {
            Alert.alert(
                "Delete",
                `Are you sure you want to delete ${dish.name}?`, // Message
                [
                    {
                        text: "No",
                        style: "cancel",
                        onPress: () => resolve(false), // Return false when user cancels
                    },
                    {
                        text: "Yes",
                        onPress: () => resolve(true), // Return true when user confirms
                    },
                ],
                { cancelable: true }
            );
        });
    };

    // EDIT DISHES MODE
    if (edit) {
        return (
            <View style={styles.root}>
                <Text>Edit Dish</Text>
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
                <View style={{ flexDirection: "row" }}>
                    <Button
                        title="Update"
                        onPress={() => {
                            updateDish();
                        }}
                    />
                    <Button title="Delete" onPress={deleteDish} />
                </View>
            </View>
        );

        // ADD NEW DISH MODE
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
