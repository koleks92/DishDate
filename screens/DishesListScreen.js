import { Text, View, StyleSheet } from "react-native";
import DishesList from "../components/DishesList";
import { useCallback, useContext, useState } from "react";
import { DDContext } from "../store/ContextStore";
import { useFocusEffect } from "@react-navigation/native";

function DishesListScreen({ route, navigation }) {
    const { edit } = route.params || {};
    const { loadUserDishes } = useContext(DDContext);

    const [userDishes, setUserDishes] = useState([]);

    const editButtonHandler = (dish) => {
        navigation.navigate("EditDishesScreen", { edit: true, dish: dish });
    };

    useFocusEffect(
        useCallback(() => {
            if (edit) {
                const getUserDishes = async () => {
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
                };
                getUserDishes();
            }
        }, [edit]) // Dependencies for memoized callback
    );

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
