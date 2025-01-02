import { Text, View, StyleSheet, Button } from "react-native";

function DishesScreen({ navigation }) {
    return (
        <View style={styles.root}>
            <Text>DishesScreen</Text>
            <Button
                title="New Dish"
                onPress={() => {
                    navigation.navigate("EditDishesScreen", { edit: false });
                }}
            />
            <Button
                title="Edit Dish"
                onPress={() => {
                    navigation.navigate("EditDishesScreen", { edit: true });
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
