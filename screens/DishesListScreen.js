import { Text, View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import DishesList from "../components/DishesList";
import { useCallback, useContext, useState, useEffect } from "react";
import { DDContext } from "../store/ContextStore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

function DishesListScreen({ route, navigation }) {
    const { edit } = route.params || {};
    const { loadUserDishes } = useContext(DDContext);
    
    const [isLoading, setIsLoading] = useState(false);
    const [userDishes, setUserDishes] = useState([]);

    const editButtonHandler = (dish) => {
        navigation.navigate("EditDishesScreen", { edit: true, dish: dish });
    };

    
    useFocusEffect(
        useCallback(() => {
            if (edit) {
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
                getUserDishes();
            }
        }, []) // Dependencies for memoized callback
    );

    if (isLoading) {
        return (
            <View style={styles.root}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (edit) {
        return (
            <View style={styles.root}>
                <DishesList
                    dishes={userDishes}
                    editButton={edit}
                    editButtonHandler={editButtonHandler}
                />
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
});
