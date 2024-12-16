import { Text, View, StyleSheet, Button } from "react-native";

function GameScreen() {
    const newGameHandler = () => {
        console.log("New Game");
    };

    const joinGameHandler = () => {
        console.log("Join Game");
    };

    return (
        <View style={styles.root}>
            <Button title="New Game" onPress={newGameHandler} />
            <Button title="Join Game" onPress={joinGameHandler} />
        </View>
    )
}

export default GameScreen;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})