import { useEffect, useState } from "react";
import { Modal, View, StyleSheet, Platform } from "react-native";
import Colors from "../../constants/Colors";
import ButtonLogo from "./ButtonLogo";
import Ionicons from "@expo/vector-icons/Ionicons";
import Sizes from "../../constants/Sizes";
import ImageCustom from "./ImageCustom";
import ButtonMain from "./ButtonMain";
import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import CustomAlert from "./CustomAlert";
import { useNavigation } from "@react-navigation/native";

function ImageModal({ visible, onSave, sessionImage }) {
    const [image, setImage] = useState(sessionImage || "");

    const [alert, setAlert] = useState({});
    const [alertVisible, setAlertVisible] = useState(false);

    const navigation = useNavigation();

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
                setAlert({
                    title: "Ups",
                    message: "We need camera and media library permissions!",
                    type: "info",
                });
                setAlertVisible(true);
            }
        }
    };

    // Compress and resize
    const compressImage = async (uri) => {
        const context = ImageManipulator.manipulate(uri);

        context.resize({ width: 700, height: 700 });

        const newImage = await context.renderAsync();

        const result = await newImage.saveAsync({
            format: SaveFormat.PNG,
        });

        return result.uri;
    };

    // Pick image from the library handler
    const pickImageHandler = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.6,
        });

        if (!result.canceled) {
            const newImage = await compressImage(result.assets[0].uri);

            setImage(newImage);
        }
    };

    // Function to open the camera
    const openCameraHandler = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.6,
        });

        if (!result.canceled) {
            const newImage = await compressImage(result.assets[0].uri);

            setImage(newImage);
        }
    };

    const handleOnSave = () => {
        onSave(image);
    };

    return (
        <>
            <CustomAlert
                visible={alertVisible}
                message={alert.message}
                title={alert.title}
                type={alert.type}
                onClose={() => {setAlertVisible(false)
                    navigation.goBack();
                }}
            />
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
        </>
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
