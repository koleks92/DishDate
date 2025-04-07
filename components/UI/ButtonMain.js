import { useState } from "react";
import Colors from "../../constants/Colors";
import Sizes from "../../constants/Sizes";

const { Pressable, Text, StyleSheet, View } = require("react-native");
function ButtonMain({ text, onPress }) {
    const [buttonPressed, setButtonPressed] = useState(false);

    return (
        <View style={styles.root}>
            <View
                style={[styles.shadow, buttonPressed && styles.buttonPressed]}
            >
                <Pressable
                    style={styles.button}
                    onTouchStart={() => {
                        setButtonPressed(true);
                    }}
                    onTouchEnd={() => {
                        setButtonPressed(false);
                    }}
                    onTouchCancel={() => {
                        setButtonPressed(false);
                    }}
                    onPress={onPress}
                >
                    <View style={styles.textContainer}>
                        <Text style={styles.buttonText}>{text}</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    );
}

export default ButtonMain;

const styles = StyleSheet.create({
    root: {
        width: Sizes.buttonWidth,
        height: Sizes.buttonHeight,
        marginBottom: Sizes.buttonMarginBottom,
    },
    shadow: {
        flex: 1,
        padding: 1,
        backgroundColor: Colors.black,
        transform: [
            { translateX: 6 }, // Move horizontally
            { translateY: 6 }, // Move vertically
        ],
    },
    button: {
        flex: 1,
        backgroundColor: Colors.backgroundButton,
        borderColor: Colors.black,
        borderWidth: 3,
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
    buttonText: {
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        fontSize: Sizes.buttonTextSize,
        textAlign: "center",
    },
    buttonPressed: {
        transform: [
            { scale: 0.95 },
            { translateX: 6 }, // Move horizontally
            { translateY: 6 }, // Move vertically], // This will scale the component to 50% of its original size
        ],
        opacity: 0.9,
    },
});
