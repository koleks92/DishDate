import { useContext } from "react";
import BackContainer from "../components/UI/BackContainer";
import Background from "../components/UI/Background";
import { Text, View, StyleSheet } from "react-native";
import Sizes from "../constants/Sizes";
import Colors from "../constants/Colors";
import ImageCustom from "../components/UI/ImageCustom";
import { DDContext } from "../store/ContextStore";

function DishScreen({ route }) {
    const { dish } = route.params;

    const { cuisinesList } = useContext(DDContext);

    // Get the cuisine name based on the cuisine_id from supabase
    const getCuisineName = (cuisineId) => {
        const cuisine = cuisinesList.find((c) => c.id === cuisineId);
        return cuisine ? cuisine.name : "Unknown";
    };

    return (
        <View style={styles.root}>
            <Background />
            <View>
                <BackContainer />
            </View>
            <View style={styles.dishContainer}>
                <View style={styles.titleTextContainer}>
                    <Text style={styles.titleText}>{dish.name}</Text>
                </View>
                <View style={styles.cuisineTextContainer}>
                    <Text style={styles.cuisineText}>
                        {getCuisineName(dish.cuisine_id)}
                    </Text>
                </View>
                <View style={styles.descriptionTextContainer}>
                    <Text style={styles.descriptionText}>
                        {dish.description}
                    </Text>
                </View>
                <View style={styles.imageContainer}>
                    <ImageCustom source={{ uri: dish.image }} />
                </View>
            </View>
        </View>
    );
}

export default DishScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    dishContainer: {
        flex: 1,
        alignItems: "center",
    },
    titleTextContainer: {},
    titleText: {
        fontFamily: "Tektur-Bold",
        fontSize: Sizes.dishTextTitle,
        color: Colors.black,
    },
    cuisineTextContainer: {},
    cuisineText: {
        fontFamily: "Tektur-Regular",
        fontSize: Sizes.dishTextDescription,
        color: Colors.black,
    },
    descriptionTextContainer: {
        margin: Sizes.dishDescriptionMargin,
    },
    descriptionText: {
        fontFamily: "Tektur-Regular",
        fontSize: Sizes.dishTextDescription,
        textAlign: "justify",
        color: Colors.black,
    },
});
