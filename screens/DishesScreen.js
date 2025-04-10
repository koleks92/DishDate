import { Text, View, StyleSheet, Button } from "react-native";
import Background from "../components/UI/Background";
import ButtonMain from "../components/UI/ButtonMain";

function DishesScreen({ navigation }) {
    return (
        <View style={styles.root}>
            <Background />
            <ButtonMain
                text="New Dish"
                onPress={() => {
                    navigation.navigate("EditDishesScreen", { edit: false });
                }}
            />
            <ButtonMain
                text="Edit Dish"
                onPress={() => {
                    navigation.navigate("DishesListScreen", { edit: true });
                }}
            />
            
        </View>
    );
}

export default DishesScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
