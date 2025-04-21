import { View, Text, StyleSheet, Button } from "react-native";
import DishView from "./DishView";
import { useState } from "react";

function DishSelector({ dishes, dishesResultHandler }) {
    const [results, setResults] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < dishes.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Handle end of dishes
            dishesResultHandler(results)
        }
    };

    const handleYes = () => {
        setResults((prevResults) => {
            const existingIndex = prevResults.findIndex(
                (result) => result.dish === dishes[currentIndex]
            );
            return [
                ...prevResults,
                { dish: dishes[currentIndex], answer: true },
            ];
        });
        handleNext();
    };

    const handleNo = () => {
        setResults((prevResults) => {
            const existingIndex = prevResults.findIndex(
                (result) => result.dish === dishes[currentIndex]
            );

            return [
                ...prevResults,
                { dish: dishes[currentIndex], answer: false },
            ];
        });
        handleNext();
    };

    const currentDish = dishes[currentIndex];

    return (
        <View style={styles.root}>
            <View style={styles.dishContainer}>
                <DishView dish={currentDish} />
            </View>
            <View style={styles.buttonsContainer}>
                <Button title="Yes" onPress={handleYes} />
                <Button title="No" onPress={handleNo} />
            </View>
            {results.length === dishes.length && (
                <Button
                    title="Finish"
                    onPress={() => dishesResultHandler(results)}
                />
            )}
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
        flexDirection: "row",
    },
});
