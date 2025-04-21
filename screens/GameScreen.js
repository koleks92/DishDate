import {
    View,
    StyleSheet,
    Text,
    Button,
    ActivityIndicator,
    Share,
} from "react-native";
import { supabase } from "../util/supabase";
import { generate6DigitNumber } from "../util/extras";
import { useContext, useEffect, useState } from "react";
import { DDContext } from "../store/ContextStore";
import DishSelector from "../components/gameMode/DishSelector";
import Background from "../components/UI/Background";
import Colors from "../constants/Colors";
import Sizes from "../constants/Sizes";
import ButtonMain from "../components/UI/ButtonMain";
import ButtonLogo from "../components/UI/ButtonLogo";
import Ionicons from "@expo/vector-icons/Ionicons";


function GameScreen({ route, navigation }) {
    const [dishes, setDishes] = useState(route.params.dishes || null);
    const [gameRoom, setGameRoom] = useState(null);
    const [gameId, setGameId] = useState(route.params.gameId || null);
    const [isLoading, setIsLoading] = useState(false);
    const [newGame, setNewGame] = useState(route.params.newGame);
    const [gameMode, setGameMode] = useState("waiting");

    const { session, databaseCheckGameId, fetchGameResults } =
        useContext(DDContext);

    useEffect(() => {
        if (newGame) {
            console.log("Creating new game");
            createNewGame(dishes);
        } else {
            console.log("Joining existing game");
            joinExistingGame(gameId);
        }
    }, []);

    // Join existing game
    const joinExistingGame = async (gameId) => {
        setIsLoading(true);

        const { data, error } = await supabase
            .from("GameRoom")
            .select("*")
            .eq("game_id", gameId)
            .eq("status", "open");

        setGameRoom(data[0]);
        setDishes(data[0].dishes);

        setIsLoading(false);
    };

    // Create new game
    const createNewGame = async (dishes) => {
        setIsLoading(true);

        let gameId;
        let gameIdExists = true; // Initialize to true to enter the loop at least once

        while (gameIdExists) {
            gameId = generate6DigitNumber();
            gameIdExists = await databaseCheckGameId(gameId); // Check if the new gameId already exists
            if (gameIdExists === null) {
                // Handle potential error from databaseCheckGameId
                console.error(
                    "Error while checking game ID, exiting game creation"
                );
                return null;
            }
        }

        const { data, error } = await supabase
            .from("GameRoom")
            .insert([
                {
                    player1_id: session["user"]["id"],
                    status: "open",
                    dishes: dishes,
                    game_id: gameId,
                },
            ])
            .select();

        if (error) {
            console.error("Error insering data:", error.message);
            return null;
        }

        if (data) {
            setGameId(gameId);
            setGameRoom(data[0]);
        }
        setIsLoading(false);
    };

    // Save result to the database
    const saveResults = async (results) => {
        let status = "open";
        if (
            gameRoom.player1_id === session["user"]["id"] &&
            gameRoom.status === "open"
        ) {
            console.log("Saving results for player 1");

            const player2_results = await fetchGameResults(gameRoom.id, 2);
            if (player2_results.player2_results) {
                status = "closed";
            }

            const { data, error } = await supabase
                .from("GameRoom")
                .update([
                    {
                        player1_results: results,
                        status: status,
                    },
                ])
                .eq("id", gameRoom.id)
                .select();
        } else if (gameRoom.status == "open" && gameRoom.player2_id === null) {
            console.log("Saving results for player 2", session["user"]["id"]);

            const player1_results = await fetchGameResults(gameRoom.id, 1);
            if (player1_results.player1_results) {
                console.log("Player 1 results already exist");
                status = "closed";
            }

            const { data, error } = await supabase
                .from("GameRoom")
                .update([
                    {
                        player2_id: session["user"]["id"],
                        player2_results: results,
                        status: status,
                    },
                ])
                .eq("id", gameRoom.id)
                .select();
        }
    };

    // Start game button handler
    const gameModeHandler = (mode) => {
        if (mode == 0) {
            setGameMode("waiting");
        } else if (mode == 1) {
            setNewGame(false);
            setGameMode("playing");
        }
    };

    // Dishes result handler
    const dishesResultHandler = (results) => {
        // Save the results to the database
        saveResults(results);
        // Check the game status
        navigation.replace("GameResultsScreen", { id: gameRoom.id });
    };

    // Sharing
    const handleShareGameId = async () => {
        try {
            const result = await Share.share({
                message:
                    "DishDate new game is waiting for you!\n" +
                    "Game ID is: " +
                    gameId,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.root}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    if (gameMode === "waiting") {
        return (
            <View style={styles.root}>
                <Background />
                <Text style={styles.gameIdText}>Game ID:</Text>
                <Text style={styles.gameIdTextNumber}>{gameId}</Text>
                <ButtonLogo
                    text={
                        <Ionicons
                            name="share-social-sharp"
                            size={Sizes.buttonLogoSize}
                        />
                    }
                    onPress={handleShareGameId}
                />
                <View style={styles.seperator} />
                <ButtonMain
                    text={"Start Game"}
                    onPress={() => {
                        gameModeHandler(1);
                    }}
                />
            </View>
        );
    }

    if (gameMode === "playing") {
        return (
            <View style={styles.root}>
                <DishSelector
                    dishes={dishes}
                    dishesResultHandler={dishesResultHandler}
                />
            </View>
        );
    }
}

export default GameScreen;

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
    },
    gameIdTextNumber: {
        fontSize: Sizes.gameIdTextNumberSize,
        fontFamily: "Tektur-Bold",
        color: Colors.black,
    },
    seperator: {
        height: Sizes.buttonHeight,
    },
});
