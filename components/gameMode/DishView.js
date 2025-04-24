import { useContext } from "react";
import { StyleSheet, View, Text, Animated } from "react-native";
import { DDContext } from "../../store/ContextStore";
import Sizes from "../../constants/Sizes";
import Colors from "../../constants/Colors";
import ImageCustom from "../UI/ImageCustom";

function DishView({ dish, backgroundColor }) {
    const { cuisinesList } = useContext(DDContext);

    const cuisine = cuisinesList.find(
        (cuisine) => cuisine.id === dish.cuisine_id
    );

    return (
        <View style={styles.root}>
            <View style={styles.shadow}>
                <Animated.View style={[styles.container, { backgroundColor }]}>
                    <View style={styles.textContainer}>
                        <Text style={styles.nameText}>{dish.name}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.cuisineText}>{cuisine.name}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.descriptionText}>
                            {dish.description}
                        </Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <ImageCustom source={{ uri: dish.image }} />
                    </View>
                </Animated.View>
            </View>
        </View>
    );
}

export default DishView;

const styles = StyleSheet.create({
    root: {
        width: Sizes.dishViewWidth,
        height: Sizes.dishViewHeight,
    },
    shadow: {
        flex: 1,
        backgroundColor: Colors.black,
        transform: [
            { translateX: 6 }, // Move horizontally
            { translateY: 6 }, // Move vertically
        ],
    },
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundButton,
        borderColor: Colors.black,
        borderWidth: 3,
        transform: [
            { translateX: -6 }, // Move horizontally
            { translateY: -6 }, // Move vertically
        ],
        padding: Sizes.dishViewPadding,
    },
    textContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: Sizes.dishViewTextMarginBottom,
    },
    nameText: {
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        fontSize: Sizes.dishNameTextSize,
        textAlign: "center",
    },
    cuisineText: {
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        fontSize: Sizes.dishCuisineTextSize,
        textAlign: "center",
    },
    descriptionText: {
        fontFamily: "Tektur-Regular",
        color: Colors.black,
        fontSize: Sizes.dishDescriptionTextSize,
        textAlign: "center",
    },
    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
