import { StyleSheet, View, Animated, Modal } from "react-native";
import Background from "./Background";
import { useRef, useEffect } from "react";
import Sizes from "../../constants/Sizes";
import Colors from "../../constants/Colors";

function Loading({ visible }) {
    const animatedValue = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 0.6,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0.4,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        );
        loop.start();
        return () => loop.stop(); // Cleanup on unmount
    }, []);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
        >
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
        </Modal>
    );
}

export default Loading;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background,
        position: "absolute", // <--- Helps stack over existing UI
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999, // <--- Ensure it's above everything
    },
    image: {
        width: Sizes.scrW * 0.8,
        height: Sizes.scrH * 0.8,
        resizeMode: "contain",
    },
});
