import { Text, View, StyleSheet, Animated } from "react-native";
import DishesList from "../components/DishesList";
import { useCallback, useContext, useState, useRef, useEffect } from "react";
import { DDContext } from "../store/ContextStore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Background from "../components/UI/Background";
import Loading from "../components/UI/Loading";
import CustomAlert from "../components/UI/CustomAlert";
import Colors from "../constants/Colors";
import { set } from "date-fns";

function DishesListScreen({ route, navigation }) {
    const { edit } = route.params || {};
    const { loadUserDishes } = useContext(DDContext);

    const [isLoading, setIsLoading] = useState(true);
    const [userDishes, setUserDishes] = useState([]);

    const [alert, setAlert] = useState({});
    const [alertVisible, setAlertVisible] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const editButtonHandler = (dish) => {
        navigation.navigate("EditDishesScreen", { edit: true, dish: dish });
    };

    // Root view fade in animation
    useEffect(() => {
        if (!isLoading) {
            setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }).start();
            }, 700);
        }
    }, [isLoading]);

    useFocusEffect(
        useCallback(() => {
            if (edit) {
                const getUserDishes = async () => {
                    const data = await loadUserDishes();

                    setUserDishes(data);

                    setTimeout(() => {
                        if (data.length === 0) {
                            setAlert({
                                title: "Ups",
                                message:
                                    "There are no dishes in the database. Please add some.",
                                type: "info",
                            });

                            setTimeout(() => {
                                setAlertVisible(true);
                            }, 500);
                        }

                        setIsLoading(false);
                    }, 500);
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
            <View style={styles.root}>
                <CustomAlert
                    visible={alertVisible}
                    message={alert.message}
                    title={alert.title}
                    type={alert.type}
                    onClose={() => {
                        setAlertVisible(false);
                        navigation.goBack();
                    }}
                />
                <Background />
                {userDishes.length > 0 ? (
                    <DishesList
                        dishes={userDishes}
                        editButton={edit}
                        editButtonHandler={editButtonHandler}
                    />
                ) : (
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <Text style={styles.backupText}>
                            There are no dishes in the database
                        </Text>
                        <Text style={styles.backupText}>Please add some.</Text>
                    </Animated.View>
                )}
            </View>
        );
    }
}

export default DishesListScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    backupText: {
        fontFamily: "Tektur-Bold",
        fontSize: 24,
        color: Colors.black,
        textAlign: "center",
    },
});
