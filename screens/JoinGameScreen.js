import { Text, View, StyleSheet } from "react-native";

function JoinGameScreen() {
    return (
        <View style={Styl}>
            <Text>Join Game</Text>
        </View>
    )
}

export default JoinGameScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})