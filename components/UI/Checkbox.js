import { StyleSheet, View, Text, Pressable } from "react-native";
import Sizes from "../../constants/Sizes";
import Colors from "../../constants/Colors";

function Checkbox({ label, checked, onPress }) {
    return (
        <View style={styles.root}>
            <View style={styles.shadow}>
                <Pressable onPress={onPress}>
                    <View style={styles.checkbox}>
                        {checked ? <View style={styles.checkboxTrue} /> : <></>}
                    </View>
                </Pressable>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.label}>{label}</Text>
            </View>
        </View>
    );
}

export default Checkbox;

const styles = StyleSheet.create({
    root: {
        width: Sizes.buttonWidth,
        height: Sizes.buttonHeight,
        marginBottom: Sizes.buttonMarginBottom,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    shadow: {
        backgroundColor: Colors.black,
        transform: [
            { translateX: 6 }, // Move horizontally
            { translateY: 6 }, // Move vertically
        ],
    },
    checkbox: {
        width: Sizes.checkbox,
        height: Sizes.checkbox,
        borderWidth: 3,
        borderColor: Colors.primary500,
        backgroundColor: Colors.white,
        transform: [
            { translateX: -6 }, // Move horizontally
            { translateY: -6 }, // Move vertically
        ],
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonPressed: {
        transform: [
            { scale: 0.95 },
            { translateX: 6 }, // Move horizontally
            { translateY: 6 }, // Move vertically]
        ],
    },
    checkboxTrue: {
        margin: "auto",
        width: Sizes.checkbox - Sizes.checkbox / 3,
        height: Sizes.checkbox - Sizes.checkbox / 3,
        backgroundColor: Colors.black,
    },
    label: {
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        fontSize: Sizes.buttonTextSize,
        textAlign: "center",
    },
});
