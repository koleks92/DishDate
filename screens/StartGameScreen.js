import { useState, useContext, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { DDContext } from "../store/ContextStore";
import SelectDropdown from "react-native-select-dropdown";

// Select dishes for the game
// Create a new game with the selected dishes

function StartGameScreen({ navigation }) {
    const [choice, setChoice] = useState(null);
    const [numOfDishes, setNumOfDishes] = useState(0);
    const [selectedDishes, setSelectedDishes] = useState();
    const [selectedDishesChoice, setSelectedDishesChoice] = useState([]);
    const [disabledIndexes, setDisabledIndexes] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [userDishes, setUserDishes] = useState([]);

    const { loadUserDishes, dishes } = useContext(DDContext);

    let dishesDatabaseChoice = [
        { title: "Standard Dishes", choice: 0},
        { title: "My Dishes", choice: 1},
        { title: "Mix Dishes", choice: 2},
    ];

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

    useEffect(() => {
        if (selectedDishesChoice == 0) {
            setSelectedDishes(dishes);
        } else if (selectedDishesChoice == 1) {
            setSelectedDishes(userDishes);
        } else {
            setSelectedDishes(dishes.concat(userDishes));
        }
    }, [selectedDishesChoice]);

    // Get user dishes from the database
    const getUserDishes = async () => {
        setIsLoading(true);
        const data = await loadUserDishes();

        // Set disabled if no user dishes or less than 5 user dishes
        if (!data || data.length === 0) {
            setDisabledIndexes([1, 2]);
        } else if (data.length < 5) {
            setDisabledIndexes([1]);
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
                    <SelectDropdown
                        data={dishesDatabaseChoice}
                        disabledIndexes={disabledIndexes}
                        onSelect={(selectedItem, index) => {
                            setSelectedDishesChoice(selectedItem.choice);
                        }}
                        renderButton={(selectedItem) => {
                            return (
                                <View style={styles.dropdownButtonStyle}>
                                    <Text style={styles.dropdownButtonTxtStyle}>
                                        {(selectedItem && selectedItem.title) ||
                                            "Select Dishes"}
                                    </Text>
                                </View>
                            );
                        }}
                        renderItem={(item, index, isSelected) => {
                            console.log(item); // Check the value of item.disabled

                            return (
                                <View
                                    style={{
                                        ...styles.dropdownItemStyle,
                                        ...(isSelected && {
                                            backgroundColor: "#D2D9DF",
                                        }),
                                        ...(item.disabled && {
                                            backgroundColor: "#CCCCCC",
                                        }),
                                    }}
                                >
                                    <Text style={styles.dropdownItemTxtStyle}>
                                        {item.title}
                                    </Text>
                                </View>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={styles.dropdownMenuStyle}
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
    dropdownButtonStyle: {
        width: 200,
        height: 50,
        backgroundColor: "#E9ECEF",
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "500",
        color: "#151E26",
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: "#E9ECEF",
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "500",
        color: "#151E26",
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});
