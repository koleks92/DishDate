import { View, StyleSheet } from "react-native";
import Background from "../components/UI/Background";
import ButtonMain from "../components/UI/ButtonMain";
import BackContainer from "../components/UI/BackContainer";

function DishesScreen({ navigation }) {
    return (
        <View style={styles.root}>
            <Background />
            <View>
                <BackContainer />
            </View>
            <View style={styles.dishesContainer}>
                <ButtonMain
                    text="New Dish"
                    onPress={() => {
                        navigation.navigate("EditDishesScreen", {
                            edit: false,
                        });
                    }}
                />
                <ButtonMain
                    text="Edit Dish"
                    onPress={() => {
                        navigation.navigate("DishesListScreen", { edit: true });
                    }}
                />
            </View>
        </View>
    );
}

export default DishesScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        alignItems: "center",
    },
    dishesContainer: {
        flex: 1,
        justifyContent: "center",
    },
});
