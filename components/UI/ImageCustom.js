import { View, StyleSheet, Text, Animated } from "react-native";
import Sizes from "../../constants/Sizes";
import Colors from "../../constants/Colors";
import { useEffect, useRef, useState } from "react";
import { Image } from "expo-image";

function ImageCustom({ source, empty }) {
    const blurhash = "U1RVHG-nfQ-n~Sj@fQkCfQfQfQfQ^~jFfQj@";

    return (
        <View style={styles.root}>
            <Animated.View style={styles.shadow} />
            {empty ? (
                <View style={styles.imageEmpty}>
                    <Text style={styles.imageText}>No Image</Text>
                </View>
            ) : (
                <Image
                    source={source}
                    style={styles.image}
                    contentFit="cover"
                    transition={50}
                    placeholder={{ blurhash }}
                />
            )}
        </View>
    );
}

export default ImageCustom;

const styles = StyleSheet.create({
    root: {
        width: Sizes.imageSize,
        height: Sizes.imageSize,
        marginBottom: Sizes.buttonMarginBottom,
        justifyContent: "center",
    },
    shadow: {
        width: Sizes.imageSize,
        height: Sizes.imageSize,
        position: "absolute",
        backgroundColor: Colors.black,
        transform: [
            { translateX: 6 }, // Move horizontally
            { translateY: 6 }, // Move vertically
        ],
    },
    image: {
        width: Sizes.imageSize,
        height: Sizes.imageSize,
        borderColor: Colors.black,
        borderWidth: 3,
        opacity: 1,
    },
    imageEmpty: {
        width: Sizes.imageSize,
        height: Sizes.imageSize,
        borderColor: Colors.black,
        borderWidth: 3,

        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.backgroundButton,
    },
    imageText: {
        fontFamily: "Tektur-Bold",
        fontSize: Sizes.editImageTextSize,
        color: Colors.black,
        textAlign: "center",
    },
});
