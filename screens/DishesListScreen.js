import { Text, View, StyleSheet, Animated, Pressable } from "react-native";
import DishesList from "../components/DishesList";
import { useCallback, useContext, useState, useRef, useEffect } from "react";
import { DDContext } from "../store/ContextStore";
import { useFocusEffect } from "@react-navigation/native";
import Background from "../components/UI/Background";
import Loading from "../components/UI/Loading";
import Colors from "../constants/Colors";
import BackContainer from "../components/UI/BackContainer";

function DishesListScreen({ route, navigation }) {
    const { edit } = route.params || {};
    const { loadUserDishes } = useContext(DDContext);

    const [isLoading, setIsLoading] = useState(true);
    const [userDishes, setUserDishes] = useState([]);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const editButtonHandler = (dish) => {
        navigation.navigate("EditDishesScreen", { edit: true, dish: dish });
    };

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

    useFocusEffect(
        useCallback(() => {
            if (edit) {
                const getUserDishes = async () => {
                    const data = await loadUserDishes();

                    setUserDishes(data);

                    setIsLoading(false);
                };
                getUserDishes();
            }
        }, []) // Dependencies for memoized callback
    );

    if (isLoading) {
        return (
            <View style={styles.root}>
                <Loading visible={isLoading} />
            </View>
        );
    }

    if (edit) {
        return (
            <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
                <Background />
                <View>
                    <BackContainer />
                </View>
                <View style={styles.dishesListContainer}>
                    {userDishes.length > 0 ? (
                        <DishesList
                            dishes={userDishes}
                            editButton={edit}
                            editButtonHandler={editButtonHandler}
                        />
                    ) : (
                        <View styles={styles.emptyTextContainer}>
                            <Text style={styles.title}>
                                There are no dishes
                            </Text>
                            <Pressable
                                onPress={() =>
                                    navigation.navigate("EditDishesScreen")
                                }
                            >
                                <Text style={styles.subtitle}>
                                    Add one now!
                                </Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </Animated.View>
        );
    }
}

export default DishesListScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        alignItems: "center",
    },
    dishesListContainer: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
    },
    emptyTextContainer: {
        marginVertical: 20,
    },
    title: {
        fontSize: Sizes.gameListTitleSize,
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        marginBottom: Sizes.gameListTitleMargin,
        textAlign: "center",
    },
    subtitle: {
        fontSize: Sizes.gameListSubtitleSize,
        fontFamily: "Tektur-Regular",
        color: Colors.black,
        textAlign: "center",
    },
});
