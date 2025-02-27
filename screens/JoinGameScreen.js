import { useContext, useState } from "react";
import { Text, View, StyleSheet, TextInput, Button } from "react-native";
import { DDContext } from "../store/ContextStore";

function JoinGameScreen() {
    const [gameCode, setGameCode] = useState("");

    const { session, databaseCheckGameId } = useContext(DDContext);

    function isSixDigits(value) {
        return /^\d{6}$/.test(value);
      }

    const joinGameHandler = () => {
        if (isSixDigits(gameCode)) {
            // Check if game code exists
            if (databaseCheckGameId(gameCode)) {
                // Join game
                navigation.navigate("GameScreen", {
                    dishes: newGameDishes,
                    newGame: false,
                });
            } else {
                alert("Game not found");
            }
        } else {
            alert("Game code must be 6 digits");
        }
    }

    return (
        <View style={styles.root}>
            <Text>Join Game</Text>
            <TextInput value={gameCode} onChangeText={setGameCode} placeholder="Enter Game Code" />
            <Button title="Join Game" onPress={joinGameHandler} />
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