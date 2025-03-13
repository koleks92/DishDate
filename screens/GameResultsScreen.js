import { useEffect, useState } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { supabase } from "../util/supabase";

function GameResultScreen({ route, navigation }) {
    const [gameId, setGameId] = useState(route.params.gameId);
    const [waiting, setWaiting] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [gameRoom, setGameRoom] = useState(null);

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
        const { data, error } = await supabase
            .from("GameRoom")
            .select("*")
            .eq("game_id", gameId);

        if (error) {
            console.error("Error fetching data:", error.message);
            return null;
        }

        console.log("Game Room data:", data[0].status);

        setGameRoom(data[0]);
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

        console.log("Notification data:", data);

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
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (waiting) {
        return (
            <View style={styles.container}>
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
            <View style={styles.container}>
                <Text>Game Result Screen</Text>
                <Text>Game ID: {gameId}</Text>
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
    container: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
