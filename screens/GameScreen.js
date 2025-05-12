import { View, StyleSheet, Text, Animated, Share } from "react-native";
import { supabase } from "../util/supabase";
import { generate6DigitNumber } from "../util/extras";
import { useContext, useEffect, useState, useRef } from "react";
import { DDContext } from "../store/ContextStore";
import DishSelector from "../components/gameMode/DishSelector";
import Background from "../components/UI/Background";
import Sizes from "../constants/Sizes";
import ButtonMain from "../components/UI/ButtonMain";
import Loading from "../components/UI/Loading";
import GameInfo from "../components/gameMode/GameInfo";
import BackContainer from "../components/UI/BackContainer";

function GameScreen({ route, navigation }) {
    const [dishes, setDishes] = useState(route.params.dishes || null);
    const [gameRoom, setGameRoom] = useState(null);
    const [gameId, setGameId] = useState(route.params.gameId || null);
    const [isLoading, setIsLoading] = useState(true);
    const [newGame, setNewGame] = useState(route.params.newGame);
    const [gameMode, setGameMode] = useState("waiting");

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const secondFadeAnim = useRef(new Animated.Value(0)).current;

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

    // Root view fade in animation
    useEffect(() => {
        if (!isLoading) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [isLoading]);

    // Second view fade in animation
    useEffect(() => {
        if (gameMode === "playing") {
            Animated.timing(secondFadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        }
    }, [gameMode]);

    // Join existing game
    const joinExistingGame = async (gameId) => {
        const { data, error } = await supabase
            .from("GameRoom")
            .select("*")
            .eq("game_id", gameId)
            .eq("status", "open");

        setGameRoom(data[0]);
        setDishes(data[0].dishes);

        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };

    // Create new game
    const createNewGame = async (dishes) => {
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
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
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

    if (isLoading) {
        return (
            <View style={styles.root}>
                <Loading visible={isLoading} />
            </View>
        );
    }
    if (gameMode === "waiting") {
        return (
            <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
                <Background />
                <View>
                    <BackContainer />
                </View>
                <View style={styles.gameContainer}>
                    <GameInfo gameId={gameId} />
                    <View style={styles.seperator} />
                    <ButtonMain
                        text={"Start Game"}
                        onPress={() => {
                            gameModeHandler(1);
                        }}
                    />
                </View>
            </Animated.View>
        );
    }

    if (gameMode === "playing") {
        return (
            <Animated.View style={[styles.root, { opacity: secondFadeAnim }]}>
                <Background />
                <DishSelector
                    dishes={dishes}
                    dishesResultHandler={dishesResultHandler}
                />
            </Animated.View>
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
    gameContainer: {
        flex: 1,
        justifyContent: "center",
    },
    seperator: {
        height: Sizes.buttonHeight,
    },
});
