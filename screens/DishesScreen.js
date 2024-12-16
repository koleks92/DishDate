import { Text, View, StyleSheet } from "react-native";

function DishesScreen() {
    return (
        <View style={styles.root}>
            <Text>DishesScreen</Text>
        </View>
    )
}

export default DishesScreen;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})