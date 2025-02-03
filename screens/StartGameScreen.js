import { useState, useContext, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { DDContext } from "../store/ContextStore";

// Finish getting the user dishes from the database
// Select dishes for the game
// Create a new game with the selected dishes

function StartGameScreen({ navigation }) {
    const [choice, setChoice] = useState(null);
    const [numOfDishes, setNumOfDishes] = useState();
    const [selectedDishes, setSelectedDishes] = useState();

    const [isLoading, setIsLoading] = useState(false);
    const [userDishes, setUserDishes] = useState([]);

    const { loadUserDishes, dishes } = useContext(DDContext);


    const newGameHandler = () => {
        setChoice(1);
    };

    const joinGameHandler = () => {
        setChoice(2);
    };

    useEffect(() => {
        if (choice === 1) {
            getUserDishes();
        }
    }, [choice]);

    // Get user dishes from the database
    const getUserDishes = async () => {
        setIsLoading(true);
        const data = await loadUserDishes();

        // Check if `userDishes` is empty after loading
        if (!data || data.length === 0) {
            Alert.alert(
                "Error",
                "There are no dishes in the database. Please add some."
            );
            navigation.goBack();
        }
        setUserDishes(data);
        setIsLoading(false);
    };

    // Validate number of dishes
    const validateNumOfDishes = () => {
        if (numOfDishes < 5 || numOfDishes > 25) {
            Alert.alert("Error", "Number of dishes must be between 5 and 25");
            return false;
        } else {
            return true;
        }
    };

    // Create new game
    const createNewGameHandler = () => {
        if (validateNumOfDishes()) {
            console.log("Creating new game with", numOfDishes, "dishes");
        }
    };

    if (!choice) {
        return (
            <View style={styles.root}>
                <Button title="New Game" onPress={newGameHandler} />
                <Button title="Join Game" onPress={joinGameHandler} />
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.root}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (choice == 1) {
        return (
            <View style={styles.root}>
                <View>
                    <TextInput
                        value={numOfDishes}
                        keyboardType="numeric" // Show numeric keyboard
                        onChangeText={setNumOfDishes}
                        placeholder="Enter number of dishes ( 5 - 25 )"
                    />
                    <Button title="Start Game" onPress={createNewGameHandler} />
                </View>
            </View>
        );
    }

    if (choice == 2) {
        return (
            <View style={styles.root}>
                <Text>Join Game</Text>
            </View>
        );
    }
}

export default StartGameScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
