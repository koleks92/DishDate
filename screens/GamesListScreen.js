import { View, Text, StyleSheet } from "react-native";


function GamesListScreen() {
    return (
        <View style={styles.root}>
            <Text>Games List</Text>
        </View>
    );
}

export default GamesListScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});