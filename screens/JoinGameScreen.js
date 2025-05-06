import { useContext, useState, useRef, useEffect } from "react";
import {
    Text,
    View,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { DDContext } from "../store/ContextStore";
import Background from "../components/UI/Background";
import Sizes from "../constants/Sizes";
import Colors from "../constants/Colors";
import InputField from "../components/UI/InputField";
import ButtonMain from "../components/UI/ButtonMain";
import Loading from "../components/UI/Loading";
import BackContainer from "../components/UI/BackContainer";

function JoinGameScreen({ navigation }) {
    const [gameId, setGameId] = useState("");

    const { databaseCheckGameId } = useContext(DDContext);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Root view fade in animation
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, []);

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
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
                    <Background />
                    <View>
                        <BackContainer />
                    </View>
                    <View style={styles.joinGameContainer}>
                        <View>
                            <Text style={styles.gameIdText}>Game ID:</Text>
                        </View>
                        <View style={styles.inputFieldContainer}>
                            <InputField
                                value={gameId}
                                onChangeText={setGameId}
                                placeholder="Enter Game ID"
                                keyboardType={"numeric"}
                                maxLength={6}
                            />
                        </View>
                        <ButtonMain
                            text="Join Game"
                            onPress={joinGameHandler}
                        />
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default JoinGameScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        alignItems: "center",
    },
    joinGameContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
