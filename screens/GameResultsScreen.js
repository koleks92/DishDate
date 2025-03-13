import { useEffect, useState } from "react";
import { Text, View, Button, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from "../util/supabase";
import DishesList from "../components/DishesList";

function GameResultScreen({ route, navigation }) {
    const [gameId, setGameId] = useState(route.params.gameId);
    const [waiting, setWaiting] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [gameRoom, setGameRoom] = useState(null);
    const [matchingResults, setMatchingResults] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchGameRoomHandler(gameId);
            setIsLoading(false);
        }, 1000); // Wait 1 second

        return () => clearTimeout(timer); // Cleanup on unmount
    }, []);

    useEffect(() => {
        if (gameRoom) {
            gameStatusCheck();
        }
    }, [gameRoom]);

    const fetchGameRoomHandler = async (gameId) => {
        console.log("Fetching game room");
        const { data, error } = await supabase
            .from("GameRoom")
            .select("*")
            .eq("game_id", gameId);

        if (error) {
            console.error("Error fetching data:", error.message);
            return null;
        }
        createResultsArray(data[0]);
        setGameRoom(data[0]);
    };

    // Create results array
    const createResultsArray = (results) => {
        const resultsArray = results.player1_results
            .filter(
                (p1) =>
                    p1.answer === true &&
                    results.player2_results.some(
                        (p2) => p2.answer === true && p2.dish.id === p1.dish.id
                    )
            )
            .map((p1) => p1.dish);
        setMatchingResults(resultsArray);
    };

    // Check game status
    const gameStatusCheck = () => {
        if (gameRoom.status === "closed") {
            // Send notification to players
            sendNotifications(gameRoom);

            setWaiting(false);
        } else if (gameRoom.status === "open") {
            setWaiting(true);
        }
    };

    const getExpoToken = async (userId) => {
        const { data, error } = await supabase
            .from("ExpoPushTokens")
            .select("expo_push_token")
            .eq("user_id", userId);

        if (error) {
            console.error("Error fetching data:", error.message);
            return null;
        }

        return data[0].expo_push_token;
    };

    // Send notification to another players
    const sendNotifications = async (gameRoom) => {
        const player1_token = await getExpoToken(gameRoom.player1_id);
        const player2_token = await getExpoToken(gameRoom.player2_id);

        const { data, error } = await supabase
            .from("Notifications")
            .select("player1_token, player2_token, game_id")
            .eq("game_id", gameRoom.game_id)
            .eq("player1_token", player1_token)
            .eq("player2_token", player2_token);

        if (data.length === 0) {
            await supabase.from("Notifications").insert([
                {
                    player1_token: player1_token,
                    player2_token: player2_token,
                    game_id: gameId,
                },
            ]);
        } else {
        }
    };

    if (isLoading) {
        return (
            <View style={styles.root}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (waiting) {
        return (
            <View style={styles.root}>
                <Text>Waiting for the other player to finish</Text>
                <Text>Game ID: {gameId}</Text>
                <Button
                    title="Back to Start"
                    onPress={() => {
                        navigation.navigate("StartScreen");
                    }}
                />
            </View>
        );
    } else {
        return (
            <View style={styles.root}>
                <Text>Game Result Screen</Text>
                <Text>Game ID: {gameId}</Text>
                <DishesList dishes={matchingResults} />
                <Button
                    title="Back to Start"
                    onPress={() => {
                        navigation.navigate("StartScreen");
                    }}
                />
            </View>
        );
    }
}

export default GameResultScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: "10%"
    },
});
