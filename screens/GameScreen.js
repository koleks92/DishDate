import { View, StyleSheet, Text } from "react-native";

function GameScreen({ route }) {
    const dishes = route.params.dishes;

    return (
        <View style={styles.container}>
            <Text>Game Screen</Text>
        </View>
    );
}

export default GameScreen;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
