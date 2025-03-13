import { View, StyleSheet, Text, Button } from "react-native";
import { supabase } from "../util/supabase";
import { generate6DigitNumber } from "../util/extras";
import { useContext, useEffect, useState } from "react";
import { DDContext } from "../store/ContextStore";
import DishSelector from "../components/gameMode/DishSelector";

function GameScreen({ route, navigation }) {

    const [dishes, setDishes] = useState(route.params.dishes || null);
    const [gameRoom, setGameRoom] = useState(null);
    const [gameId, setGameId] = useState(route.params.gameId || null);
    const [isLoading, setIsLoading] = useState(false);
    const [newGame, setNewGame] = useState(route.params.newGame);
    const [gameMode, setGameMode] = useState("waiting");

    const { session, databaseCheckGameId, fetchGameResults } = useContext(DDContext);

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

        setGameRoom(data);
        setDishes(data[0].dishes);

        setIsLoading(false);

    }
 
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
            setGameRoom(data);
        }
        setIsLoading(false);
    };

    // Save result to the database
    const saveResults = async (results) => {
        let status = "open";
        if (
            gameRoom[0].player1_id === session["user"]["id"] &&
            gameRoom[0].status === "open"
        ) {
            console.log("Saving results for player 1");

            const player2_results = await fetchGameResults(gameId, 2);
            if (player2_results.player2_results) {
                status = "closed";
            }

            const { data, error } = await supabase
                .from("GameRoom")
                .update([
                    {
                        player1_results: results,
                        status: status
                    },
                ])
                .eq("game_id", gameId)
                .select();

        } else if (gameRoom[0].status == "open" && gameRoom[0].player2_id === null) {
            console.log("Saving results for player 2", session["user"]["id"]);

            const player1_results = await fetchGameResults(gameId, 1);
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
                .eq("game_id", gameId)
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
        navigation.replace("GameResultsScreen", { gameId: gameId });
    };

    if (isLoading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (gameMode === "waiting") {
        return (
            <View style={styles.container}>
                <Text>Game Screen</Text>
                <Text>Game ID: {gameId}</Text>
                <Button
                    title="Start Game"
                    onPress={() => {
                        gameModeHandler(1);
                    }}
                />
            </View>
        );
    }

    if (gameMode === "playing") {
        return (
            <View style={styles.container}>
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
    container: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
