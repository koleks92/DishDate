import { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import ButtonLogo from "./ButtonLogo";
import Ionicons from "@expo/vector-icons/Ionicons";
import Sizes from "../../constants/Sizes";
import InputField from "./InputField";

function NameModal({ visible, onSave, sessionName }) {
    const [name, setName] = useState(sessionName || "");
    const [invalid, setInvalid] = useState(false);

    useEffect(() => {
        if (sessionName) {
            setName(sessionName);
        }
    }, [sessionName]);

    const handleOnSave = () => {
        if (name.length == 0) {
            setInvalid(true);
            return;
        } else {
            onSave(name);
        }
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            <View style={styles.modalOverlay}>
                <View style={styles.shadow}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Choose username</Text>
                        <InputField
                            placeholder={"Enter your nickname"}
                            value={name}
                            onChangeText={setName}
                            invalid={invalid}
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

export default NameModal;

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
