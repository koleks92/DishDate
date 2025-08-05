import { useState, useContext, useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
} from "react-native";
import { DDContext } from "../store/ContextStore";
import Background from "../components/UI/Background";
import ButtonMain from "../components/UI/ButtonMain";
import CustomSelect from "../components/UI/CustomSelect";
import CustomSlider from "../components/UI/CustomSlider";
import CustomAlert from "../components/UI/CustomAlert";
import Loading from "../components/UI/Loading";
import BackContainer from "../components/UI/BackContainer";

function NewGameScreen({ navigation }) {
    const [choice, setChoice] = useState(null);
    const [numOfDishes, setNumOfDishes] = useState(15);
    const [availableDishes, setAvailableDishes] = useState();

    const [isLoading, setIsLoading] = useState(true);
    const [userDishes, setUserDishes] = useState([]);

    const [availableCuisines, setAvailableCuisines] = useState([]);

    const [selectedCuisine, setSelectedCuisine] = useState(null);
    const [selectedDishes, setSelectedDishes] = useState({
        name: "Standard Dishes",
        id: 0,
    });

    const [newGameDishes, setNewGameDishes] = useState([]);

    const [alert, setAlert] = useState({});
    const [alertVisible, setAlertVisible] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [openSelectId, setOpenSelectId] = useState(null);

    const {
        loadUserDishes,
        dishes,
        cuisinesList,
        loadDishesByCuisines,
        loadUserDishesByCuisines,
    } = useContext(DDContext);

    // Initial loading, getUserDishies
    useEffect(() => {
        getUserDishes(); // Wait for state to be updated
    }, []);

    useEffect(() => {
        getAvailableCuisines(); // Now safe to use updated userDishes

        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, [userDishes]);

    // Root view fade in animation
    useEffect(() => {
        if (!isLoading) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [isLoading]);

    // If dishes array created, navigate to GameScreen
    useEffect(() => {
        if (newGameDishes.length > 0) {
            navigation.navigate("GameScreen", {
                dishes: newGameDishes,
                newGame: true,
            });
        }
    }, [newGameDishes]);

    // Handle outside press to close select dropdowns
    const handleOutsidePress = () => {
        if (openSelectId) setOpenSelectId(null);
    };

    // Get user dishes from the database
    const getUserDishes = async () => {
        const data = await loadUserDishes();

        const dishes = [
            { name: "Standard Dishes", id: 0 },
            { name: "My Dishes", id: 1 },
            { name: "Mix Dishes", id: 2 },
        ];

        // Set disabled if no user dishes or less than 5 user dishes
        if (!data || data.length === 0) {
            setAvailableDishes([dishes[0]]);
        } else if (data.length < 5) {
            setAvailableDishes([dishes[0], dishes[2]]);
        } else {
            setAvailableDishes(dishes);
        }

        setUserDishes(data);
    };

    // Set cuisines list
    const getAvailableCuisines = async () => {
        const allDishes = dishes.concat(userDishes);

        const filteredCuisines = cuisinesList.filter((cuisine) => {
            return allDishes.some((dish) => dish.cuisine_id === cuisine.id);
        });

        setAvailableCuisines(filteredCuisines);
    };

    // Validate number of dishes
    const validateNumOfDishes = () => {
        if (numOfDishes < 5 || numOfDishes > 25) {
            setAlert({
                title: "Ups",
                message: "Number of dishes must be between 5 and 25",
                type: "info",
            });
            setAlertVisible(true);
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
        let standardDishesArray = [];
        let userDishesArray = [];
        let selectedCuisinesIds = [];

        // Validate number of dishes
        if (validateNumOfDishes()) {
            if (selectedCuisine === null) {
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

            if (selectedDishes.id === 0) {
                // Only standard dishes
                if (standardDishesArray.length < numOfDishes) {
                    setAlert({
                        title: "Ups",
                        message: "Not enough dishes in selected cuisine!",
                        type: "info",
                    });
                    setAlertVisible(true);
                    setIsLoading(false);
                    return;
                }
                const dishesArray = createDishesArray(
                    standardDishesArray,
                    numOfDishes
                );
                setNewGameDishes(dishesArray);
            } else if (selectedDishes.id === 1) {
                // Only user dishes
                if (userDishesArray.length < numOfDishes) {
                    setAlert({
                        title: "Ups",
                        message: "Not enough dishes in selected cuisine!",
                        type: "info",
                    });
                    setAlertVisible(true);
                    setIsLoading(false);
                    return;
                }
                const dishesArray = createDishesArray(
                    userDishesArray,
                    numOfDishes
                );
                setNewGameDishes(dishesArray);
            } else if (selectedDishes.id === 2) {
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
                    setAlert({
                        title: "Ups",
                        message: "Not enough dishes in selected cuisine!",
                        type: "info",
                    });
                    setAlertVisible(true);
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
    };

    if (isLoading) {
        return (
            <View style={styles.root}>
                <Loading visible={isLoading} />
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
                <Background />
                <CustomAlert
                    visible={alertVisible}
                    message={alert.message}
                    title={alert.title}
                    type={alert.type}
                    onClose={() => setAlertVisible(false)}
                />
                <View>
                    <BackContainer />
                </View>
                <View style={styles.newGameContainer}>
                    <CustomSlider
                        sliderValueHandler={(val) => setNumOfDishes(val)}
                    />
                    <View style={styles.zIndexFix}>
                        <CustomSelect
                            data={availableDishes}
                            onSelect={selectedDishesHandler}
                            selected={selectedDishes}
                            placeholder="Select dishes"
                            isOpen={openSelectId === "dishes"}
                            onToggle={() =>
                                setOpenSelectId(
                                    openSelectId === "dishes" ? null : "dishes"
                                )
                            }
                        />
                    </View>
                    <CustomSelect
                        data={availableCuisines}
                        onSelect={selectedCuisineHandler}
                        selected={selectedCuisine}
                        placeholder="All cuisines"
                        multichoice={true}
                        maxSelect={6}
                        isOpen={openSelectId === "cuisines"}
                        onToggle={() =>
                            setOpenSelectId(
                                openSelectId === "cuisines" ? null : "cuisines"
                            )
                        }
                    />
                    <ButtonMain
                        text="Start Game"
                        onPress={createNewGameHandler}
                    />
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

export default NewGameScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        alignItems: "center",
    },
    newGameContainer: {
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
    zIndexFix: {
        zIndex: 11,
    },
});
