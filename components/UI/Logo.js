import { Pressable, StyleSheet, Animated } from "react-native";
import Sizes from "../../constants/Sizes";
import { useRef } from "react";


function Logo() {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const logoBounceAnimation = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0.8,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1.1,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1.05,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 200,
                useNativeDriver: true,
              }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
    };
    return (
        <Pressable onPress={() => {logoBounceAnimation()}}>
            <Animated.Image
                source={require("../../assets/Images/LogoTextTransparent.png")} // for local images
                style={[styles.image, { transform: [{ scale: scaleAnim }] }]}
                />
        </Pressable>
    );
}

export default Logo;

const styles = StyleSheet.create({
    image: {
        width: Sizes.logoSize,
        height: Sizes.logoSize * 0.9,
        resizeMode: "cover",
    },
});
