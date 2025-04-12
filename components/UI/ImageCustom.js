import { View, StyleSheet, Image, Text } from "react-native";
import Sizes from "../../constants/Sizes";
import Colors from "../../constants/Colors";

function ImageCustom({ source, empty }) {
    return (
        <View style={styles.root}>
            <View style={styles.shadow}>
                {empty ? (
                    <View style={styles.imageEmpty}>
                        <Text
                            style={styles.imageText}
                        >
                            No Image
                        </Text>
                    </View>
                ) : (
                    <Image
                        source={source}
                        style={styles.image}
                        resizeMode="contain"
                    />
                )}
            </View>
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
        flex: 1,
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
        transform: [
            { translateX: -6 }, // Move horizontally
            { translateY: -6 }, // Move vertically
        ],
    },
    imageEmpty: {
        width: Sizes.imageSize,
        height: Sizes.imageSize,
        borderColor: Colors.black,
        borderWidth: 3,
        transform: [
            { translateX: -6 }, // Move horizontally
            { translateY: -6 }, // Move vertically
        ],
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.backgroundButton,
    },
    imageText: {
        fontFamily: "Tektur-Bold",
                fontSize: Sizes.editImageTextSize,
                color: Colors.black,
                textAlign: "center",
    }
});
