import { useContext, useState } from "react";
import { Text, View, StyleSheet, TextInput, Button } from "react-native";
import { DDContext } from "../store/ContextStore";

function JoinGameScreen({ navigation }) {
    const [gameId, setGameId] = useState("");

    const { databaseCheckGameId } = useContext(DDContext);

    function isSixDigits(value) {
        return /^\d{6}$/.test(value);
      }

    const joinGameHandler = async () => {
        if (isSixDigits(gameId)) {
            // Check if game code exists
            if (await databaseCheckGameId(gameId)) {
                // Join game
                navigation.navigate("GameScreen", {
                    gameId: gameId,
                    newGame: false,
                });
            } else {
                alert("Game not found or already finished");
            }
        } else {
            alert("Game code must be 6 digits");
        }
    }

    return (
        <View style={styles.root}>
            <Text>Join Game</Text>
            <TextInput value={gameId} onChangeText={setGameId} placeholder="Enter Game Code" />
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