import { View, Text, StyleSheet, Button } from "react-native";
import DishView from "./DishView";
import { useState } from "react";

function DishSelector({ dishes, dishesResult }) {
    const [results, setResults] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            // Handle end of dishes
            console.log("No more dishes");
        }
    };

    const handleNext = () => {
        if (currentIndex < dishes.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Handle end of dishes
            console.log("No more dishes");
        }
    };

    const handleYes = () => {};

    const handleNo = () => {};

    const currentDish = dishes[currentIndex];

    return (
        <View style={styles.root}>
            <View style={styles.buttonsContainer}>
                <Button title="Previous" onPress={handlePrevious} />
                <Button title="Next" onPress={handleNext} />
            </View>
            <View style={styles.dishContainer}>
                <DishView dish={currentDish} />
            </View>
            <View style={styles.buttonsContainer}>
                <Button title="Yes" onPress={handleYes} />
                <Button title="No" onPress={handleNo} />
            </View>
        </View>
    );
}

export default DishSelector;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    dishContainer: {
        display: "flex",
        flex: 5,
    },
    buttonsContainer: {
        display: "flex",
        flex: 2,
        flexDirection: "row",
    },
});
