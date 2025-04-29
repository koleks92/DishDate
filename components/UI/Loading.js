import { StyleSheet, View, Animated, Easing } from "react-native";
import Background from "./Background";
import { useRef } from "react";
import Sizes from "../../constants/Sizes";
Easing
function Loading() {
    const animatedValue = useRef(new Animated.Value(0.8)).current;

    Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
      

    return (
        <View style={styles.root}>
            <Background />
            <Animated.Image
                source={require("../../assets/Images/LogoTextTransparent.png")}
                style={[
                    styles.image,
                    {
                        transform: [{ scale: animatedValue }],
                        opacity: animatedValue,
                    },
                ]}
            />
        </View>
    );
}

export default Loading;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: Sizes.scrW * 0.8,
        height: Sizes.scrH * 0.8,
        resizeMode: "contain",
    },
});
