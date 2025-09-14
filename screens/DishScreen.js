import { useContext, useState } from "react";
import BackContainer from "../components/UI/BackContainer";
import Background from "../components/UI/Background";
import { Modal, Text, View, StyleSheet } from "react-native";
import Sizes from "../constants/Sizes";
import Colors from "../constants/Colors";
import ImageCustom from "../components/UI/ImageCustom";
import { DDContext } from "../store/ContextStore";
import ButtonLogo from "../components/UI/ButtonLogo";
import Ionicons from "@expo/vector-icons/Ionicons";
import InputField from "../components/UI/InputField";
import { supabase } from "../util/supabase";

function DishScreen({ route }) {
    const [visible, setVisible] = useState(false);
    const [reportText, setReportText] = useState("");

    const { dish } = route.params;

    const { cuisinesList } = useContext(DDContext);

    // Get the cuisine name based on the cuisine_id from supabase
    const getCuisineName = (cuisineId) => {
        const cuisine = cuisinesList.find((c) => c.id === cuisineId);
        return cuisine ? cuisine.name : "Unknown";
    };

    // On report handler
    const onReportHandler = async () => {
        if (!reportText || reportText.trim() === "") {
            return;
        } else {
            const {data, error } = await supabase.from('Dish_Bug_Report').insert([
                {
                    dish_id: dish.id,
                    report: reportText,
                }
            ]);
        }
    };

    // Close modal
    const onClose = () => {
        setVisible(false);
    };

    // Yes action in modal
    const onYes = () => {
        onReportHandler();
        setVisible(false);
    };

    return (
        <View style={styles.root}>
            <Background />
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.shadow}>
                        <View style={styles.modal}>
                            <Text style={styles.modalTitle}>Report a Bug!</Text>
                            <InputField
                                value={reportText}
                                onChangeText={setReportText}
                                placeholder="Describe the issue...
                                fx. wrong image, inappropriate content, etc."
                                maxLength={140}
                                long={true}
                            />
                            <View style={styles.questionButtonContainer}>
                                <ButtonLogo
                                    text={
                                        <Ionicons
                                            name="checkmark-sharp"
                                            size={Sizes.buttonLogoSize}
                                        />
                                    }
                                    onPress={onYes}
                                />
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
                </View>
            </Modal>
            <View>
                <BackContainer
                    reportButton={true}
                    onReport={() => setVisible(true)}
                />
            </View>
            <View style={styles.dishContainer}>
                <View style={styles.titleTextContainer}>
                    <Text style={styles.titleText}>{dish.name}</Text>
                </View>
                <View style={styles.cuisineTextContainer}>
                    <Text style={styles.cuisineText}>
                        {getCuisineName(dish.cuisine_id)}
                    </Text>
                </View>
                <View style={styles.descriptionTextContainer}>
                    <Text style={styles.descriptionText}>
                        {dish.description}
                    </Text>
                </View>
                <View style={styles.imageContainer}>
                    <ImageCustom source={{ uri: dish.image }} />
                </View>
            </View>
        </View>
    );
}

export default DishScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    dishContainer: {
        flex: 1,
        alignItems: "center",
    },
    titleText: {
        fontFamily: "Tektur-Bold",
        fontSize: Sizes.dishTextTitle,
        color: Colors.black,
    },
    cuisineText: {
        fontFamily: "Tektur-Regular",
        fontSize: Sizes.dishTextDescription,
        color: Colors.black,
    },
    descriptionTextContainer: {
        margin: Sizes.dishDescriptionMargin,
    },
    descriptionText: {
        fontFamily: "Tektur-Regular",
        fontSize: Sizes.dishTextDescription,
        textAlign: "justify",
        color: Colors.black,
    },
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
        maxWidth: "75%",
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
