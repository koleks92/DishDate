import { View, StyleSheet, Text, Button } from "react-native";
import { supabase } from "../util/supabase";
import { generate6DigitNumber } from "../util/extras";
import { useContext, useEffect, useState } from "react";
import { DDContext } from "../store/ContextStore";
import DishSelector from "../components/gameMode/DishSelector";

function GameScreen({ route }) {
    const dishes = route.params.dishes;

    const [gameRoom, setGameRoom] = useState(null)
    const [gameId, setGameId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [newGame, setNewGame] = useState(route.params.newGame);
    const [gameMode, setGameMode] = useState('waiting');

    const { session } = useContext(DDContext);

    useEffect(() => {
        if (newGame) {
            console.log("Creating new game")
            createNewGame(dishes);
        }
    }, [])

    // Database check for gameID
    const databaseCheckGameId = async (gameId) => {
        const { data, error } = await supabase
            .from("GameRoom")
            .select("*")
            .eq("game_id", gameId)
            .eq("status", "open");

        if (error) {
            console.error("Error fetching data:", error.message);
            return null;
        }

        return data && data.length > 0; // Return true if gameId exists, false otherwise
    };

    // Create new game
    const createNewGame = async (dishes) => {
        setIsLoading(true)

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

        const { data, error } = await supabase.from("GameRoom").insert([
            {
                player1_id: session["user"]["id"],
                status: "open",
                dishes: dishes,
                game_id: gameId
            },
        ]).select();

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

    // Start game button handler
    const gameModeHandler = (mode) => {
        if (mode == 0) {
            setGameMode('waiting')
        } else if (mode == 1) {
            setNewGame(false)
            setGameMode('playing')
        } else if (mode == 2){
            setGameMode('finished')
        }
    }

    // Dishes result handler
    const dishesResultHandler = (results) => {
        console.log(results)
    }

    if (isLoading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }

    if (gameMode === 'waiting') {
        return (
            <View style={styles.container}>
                <Text>Game Screen</Text>
                <Text>Game ID: {gameId}</Text>
                <Button title="Start Game" onPress={() => {gameModeHandler(1)}}/>
            </View>
        );
    }

    if (gameMode === 'playing') {
        return (
            <View style={styles.container}>
                <DishSelector dishes={dishes} dishesResultHandler={dishesResultHandler}/>
            </View>
        )
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
