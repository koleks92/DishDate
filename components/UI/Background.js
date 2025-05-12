import {
    Animated,
    Easing,
    ImageBackground,
    StyleSheet,
} from "react-native";
import React, { useEffect, useRef } from "react";
import backgroundImage from "../../assets//Images/background/logos_20.png";

const INPUT_RANGE_START = 0;
const INPUT_RANGE_END = 1;
const OUTPUT_RANGE_START = -100; // Move the entire image
const OUTPUT_RANGE_END = 0; // Bring it back smoothly
const ANIMATION_TO_VALUE = 1;
const ANIMATION_DURATION = 25000;

function Background() {
    const initialValue = 0;
    const translateValue = useRef(new Animated.Value(initialValue)).current;

    useEffect(() => {
        const translate = () => {
            Animated.loop(
                Animated.sequence([
                    // Move forward (left to right, top to bottom)
                    Animated.timing(translateValue, {
                        toValue: ANIMATION_TO_VALUE,
                        duration: ANIMATION_DURATION,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    // Move backward (right to left, bottom to top)
                    Animated.timing(translateValue, {
                        toValue: 0,
                        duration: ANIMATION_DURATION,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        translate();
    }, [translateValue]);

    const translateAnimation = translateValue.interpolate({
        inputRange: [INPUT_RANGE_START, INPUT_RANGE_END],
        outputRange: [OUTPUT_RANGE_START, OUTPUT_RANGE_END],
    });

    return (
        <Animated.View style={[styles.background, { transform: [{ translateX: translateAnimation }, { translateY: translateAnimation }] }]}>
            <ImageBackground source={backgroundImage} style={styles.backgroundImage} />
        </Animated.View>
    );
}

export default Background;

const styles = StyleSheet.create({
    background: {
        position: "absolute",
        width: 2000,
        height: 2000,
        top: 0,
        transform: [
            {
                translateX: 0,
            },
            {
                translateY: 0,
            },
        ],
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "repeat", // Make sure the image repeats properly
    },
});
