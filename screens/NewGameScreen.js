import { useState, useContext, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { DDContext } from "../store/ContextStore";
import CuisinesList from "../components/CuisinesList";
import DishesSelectList from "../components/DishesSelectList";

// Fix user dishes filerting, now return empty array !

function NewGameScreen({ navigation }) {
    const [choice, setChoice] = useState(null);
    const [numOfDishes, setNumOfDishes] = useState(0);
    const [disabledIndexes, setDisabledIndexes] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [userDishes, setUserDishes] = useState([]);

    const [selectedCuisine, setSelectedCuisine] = useState(null);
    const [selectedDishes, setSelectedDishes] = useState([]);

    const [newGameDishes, setNewGameDishes] = useState([]);

    const {
        loadUserDishes,
        dishes,
        cuisinesList,
        loadDishesByCuisines,
        loadUserDishesByCuisines,
    } = useContext(DDContext);

    useEffect(() => {
        getUserDishes();
    }, []);

    useEffect(() => {
        if (newGameDishes.length > 0) {
            navigation.navigate("GameScreen", {
                dishes: newGameDishes,
                newGame: true,
            });
        }
    }, [newGameDishes]);

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

    // Selected cuisine handler
    const selectedCuisineHandler = (selectedCuisine) => {
        setSelectedCuisine(selectedCuisine);
    };

    // Selected dishes handler
    const selectedDishesHandler = (selectedDishes) => {
        setSelectedDishes(selectedDishes);
    };

    // Create dishes array
    const createDishesArray = (dishes, length) => {
        if (dishes.length < length) {
            return dishes;
        } else {
            let dishesArray = [];
            for (let i = 0; i < length; i++) {
                let randomDish;
                do {
                    const randomIndex = Math.floor(
                        Math.random() * dishes.length
                    );
                    randomDish = dishes[randomIndex];
                } while (dishesArray.includes(randomDish)); // Check if already in the array

                dishesArray.push(randomDish);
            }
            return dishesArray;
        }
    };

    // Create new game
    const createNewGameHandler = async () => {
        setIsLoading(true);

        let standardDishesArray = [];
        let userDishesArray = [];
        let selectedCuisinesIds = [];

        // Validate number of dishes
        if (validateNumOfDishes()) {
            if (selectedCuisine === 999) {
                // Get all standard dishes
                standardDishesArray = dishes;
                userDishesArray = userDishes;
            } else {
                // Get cuisines Ids
                selectedCuisinesIds = selectedCuisine.map(
                    (cuisine) => cuisine.id
                );

                // Get standard dishes by cuisine
                const standardDishesByCuisine = await loadDishesByCuisines(
                    selectedCuisinesIds
                );
                if (standardDishesByCuisine) {
                    standardDishesArray = standardDishesByCuisine;
                }

                // Get user dishes by cuisine
                const userDishesByCuisine = await loadUserDishesByCuisines(
                    selectedCuisinesIds
                );
                if (userDishesByCuisine) {
                    userDishesArray = userDishesByCuisine;
                }
            }

            if (selectedDishes === 0) {
                // Only standard dishes
                if (standardDishesArray.length < numOfDishes) {
                    Alert.alert("Error", "Not enough dishes in selected cuisine!");
                    setIsLoading(false);
                    return;
                }
                const dishesArray = createDishesArray(
                    standardDishesArray,
                    numOfDishes
                );
                setNewGameDishes(dishesArray);
            } else if (selectedDishes === 1) {
                // Only user dishes
                if (userDishesArray.length < numOfDishes) {
                    Alert.alert("Error", "Not enough dishes in selected cuisine!");
                    setIsLoading(false);
                    return;
                }
                const dishesArray = createDishesArray(
                    userDishesArray,
                    numOfDishes
                );
                setNewGameDishes(dishesArray);
            } else if (selectedDishes === 2) {
                // Mix dishes
                const dishesArrayUser = createDishesArray(
                    userDishesArray,
                    numOfDishes
                );
                const dishesArrayStandard = createDishesArray(
                    standardDishesArray,
                    numOfDishes
                );
                const mixedDishes = dishesArrayUser.concat(dishesArrayStandard);
                if (mixedDishes.length < numOfDishes) {
                    Alert.alert("Error", "Not enough dishes in selected cuisine!");
                    setIsLoading(false);
                    return;
                }
                const mixedDishesArray = createDishesArray(
                    mixedDishes,
                    numOfDishes
                );
                setNewGameDishes(mixedDishesArray);
            }
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <View style={styles.root}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <TextInput
                value={numOfDishes}
                keyboardType="numeric" // Show numeric keyboard
                onChangeText={setNumOfDishes}
                placeholder="Enter number of dishes ( 5 - 25 )"
            />
            <DishesSelectList
                selectedDishesHandler={selectedDishesHandler}
                disabledIndexes={disabledIndexes}
            />
            <CuisinesList
                cuisinesList={cuisinesList}
                selectedCuisineHandler={selectedCuisineHandler}
                multiselect={true}
            />
            <Button title="Start Game" onPress={createNewGameHandler} />
        </View>
    );
}

export default NewGameScreen;

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
