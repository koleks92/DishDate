import { useEffect, useState } from "react";
import { Modal, View, StyleSheet, Platform } from "react-native";
import Colors from "../../constants/Colors";
import ButtonLogo from "./ButtonLogo";
import Ionicons from "@expo/vector-icons/Ionicons";
import Sizes from "../../constants/Sizes";
import ImageCustom from "./ImageCustom";
import ButtonMain from "./ButtonMain";
import * as ImagePicker from "expo-image-picker";


function ImageModal({ visible, onSave, sessionImage }) {
    const [image, setImage] = useState(sessionImage || "");

    useEffect(() => {
        if (sessionImage) {
            setImage(sessionImage);
        }
    }, [sessionImage]);

    useEffect(() => {
        requestPermission();
    }, []);

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

    // Pick image from the library handler
    const pickImageHandler = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
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
            setImage(result.assets[0].uri);
        }
    };

    const handleOnSave = () => {
        onSave(image);
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            <View style={styles.modalOverlay}>
                <View style={styles.shadow}>
                    <View style={styles.modal}>
                        {image ? (
                            <ImageCustom source={{ uri: image }} />
                        ) : (
                            <ImageCustom empty={true} />
                        )}
                        <ButtonMain
                            text="Pick an image"
                            onPress={pickImageHandler}
                        />
                        <ButtonMain
                            text="Take a picture"
                            onPress={openCameraHandler}
                        />
                        <View style={styles.questionButtonContainer}>
                            <ButtonLogo
                                text={
                                    <Ionicons
                                        name="checkmark-sharp"
                                        size={Sizes.buttonLogoSize}
                                    />
                                }
                                onPress={() => {
                                    handleOnSave();
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default ImageModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    shadow: {
        backgroundColor: Colors.black,
        transform: [
            { translateX: 6 }, // Move horizontally
            { translateY: 6 }, // Move vertically
        ],
    },
    modal: {
        backgroundColor: Colors.backgroundButton,
        borderColor: Colors.black,
        borderWidth: 3,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        transform: [
            { translateX: -6 }, // Move horizontally
            { translateY: -6 }, // Move vertically
        ],
    },
    modalTitle: {
        fontSize: Sizes.modalTitleSize,
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        textAlign: "center",
        marginBottom: Sizes.modalTextMargin,
    },
    modalText: {
        fontSize: Sizes.modalTextSize,
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        textAlign: "center",
        marginBottom: Sizes.modalTextMargin,
    },
    questionButtonContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: Sizes.modalTextMargin,
    },
});
