import { Text, View, StyleSheet } from "react-native";

function EditDishesScreen() {
    return (
        <View style={styles.root}>
            <Text>EditDishesScreen</Text>
        </View>
    )
}

export default EditDishesScreen;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})