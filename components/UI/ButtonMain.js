import { useState } from "react";
import Colors from "../../constants/Colors";
import { Sizes } from "../../constants/Sizes";

const { Pressable, Text, StyleSheet, View } = require("react-native");
function ButtonMain({ text, onPress }) {
    const [buttonPressed, setButtonPressed] = useState(false);

    return (
        <View style={[styles.root, buttonPressed && styles.buttonPressed ]}>
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
                onPress={() => console.log("Button Pressed")}
            >
                <Text style={styles.buttonText}>{text}</Text>
            </Pressable>
        </View>
    );
}

export default ButtonMain;

const styles = StyleSheet.create({
    root: {
        padding: 1,
        backgroundColor: Colors.black,
        transform: [
            { translateX: 6 }, // Move horizontally
            { translateY: 6 }, // Move vertically
        ],
    },
    button: {
        backgroundColor: Colors.backgroundButton,
        borderColor: Colors.black,
        borderWidth: 3,
        padding: Sizes.buttonInsidePadding,
        transform: [
            { translateX: -6 }, // Move horizontally
            { translateY: -6 }, // Move vertically
        ],
    },
    buttonText: {
        color: Colors.black,
        fontSize: 16,
        textAlign: "center",
    },
    buttonPressed: {
        transform: [{ scale: 0.95 },{ translateX: 6 }, // Move horizontally
            { translateY: 6 }, // Move vertically], // This will scale the component to 50% of its original size
    ],
opacity: 0.9,
    }
});
