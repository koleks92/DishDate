import { useState } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import ButtonLogo from "./ButtonLogo";
import Ionicons from "@expo/vector-icons/Ionicons";
import Sizes from "../../constants/Sizes";

function CustomAlert({ message, type, visible, onClose }) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.shadow}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>{message.title}</Text>
                        <Text style={styles.modalText}>{message.message}</Text>
                        <ButtonLogo
                            text={
                                <Ionicons
                                    name="close-sharp"
                                    size={Sizes.buttonLogoSize}
                                />
                            }
                            onPress={onClose}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default CustomAlert;

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
        marginBottom: Sizes.modalTextMargin
    },
    modalText: {
        fontSize: Sizes.modalTextSize,
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        textAlign: "center",
        marginBottom: Sizes.modalTextMargin

    }
});
