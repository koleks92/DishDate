import { useContext, useState } from "react";
import { Text, View, StyleSheet, TextInput, Button } from "react-native";
import { DDContext } from "../store/ContextStore";
import Background from "../components/UI/Background";
import Sizes from "../constants/Sizes";
import Colors from "../constants/Colors";
import InputField from "../components/UI/InputField";
import ButtonMain from "../components/UI/ButtonMain";

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
    };

    return (
        <View style={styles.root}>
            <Background />
            <Text style={styles.gameIdText}>Game ID:</Text>
            <View style={styles.inputFieldContainer}>
                <InputField
                    value={gameId}
                    onChangeText={setGameId}
                    placeholder="Enter Game ID"
                    keyboardType={"numeric"}
                    maxLength={6}
                />
            </View>
            <ButtonMain text="Join Game" onPress={joinGameHandler} />
        </View>
    );
}

export default JoinGameScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    gameIdText: {
        fontSize: Sizes.gameIdTextSize,
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        marginBottom: Sizes.gameIdTextMargin,
    },
    inputFieldContainer: {
        marginBottom: Sizes.buttonHeight,

    },
});
