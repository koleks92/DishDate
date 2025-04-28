import { useContext, useEffect, useState } from "react";
import {
    Text,
    View,
    Button,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { supabase } from "../util/supabase";
import DishesList from "../components/DishesList";
import Background from "../components/UI/Background";
import { DDContext } from "../store/ContextStore";
import Colors from "../constants/Colors";
import { format } from "date-fns";


function GameResultScreen({ route, navigation }) {
    const [id, setId] = useState(route.params.id);
    const [waiting, setWaiting] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [gameRoom, setGameRoom] = useState(null);
    const [matchingResults, setMatchingResults] = useState(null);
    const [username, setUsername] = useState(null);
    const [date, setDate] = useState(null);

    const { fetchUserName, session, setNotification } = useContext(DDContext);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchGameRoomHandler(id);
            setIsLoading(false);
        }, 1000); // Wait 1 second

        return () => clearTimeout(timer); // Cleanup on unmount
    }, [id]);

    useEffect(() => {
        if (gameRoom) {
            gameStatusCheck();
        }
    }, [gameRoom]);

    const fetchGameRoomHandler = async (id) => {
        console.log("Fetching game room");
        const { data, error } = await supabase
            .from("GameRoom")
            .select("*")
            .eq("id", id);

        if (error) {
            console.error("Error fetching data:", error.message);
            return null;
        }

        createResultsArray(data[0]);
        getUserNames(data[0]);
        setGameRoom(data[0]);
    };

    const getUserNames = async (gameRoom) => {
        const player1Name = await fetchUserName(gameRoom.player1_id);
        const player2Name = await fetchUserName(gameRoom.player2_id);

        if (session.user.id === gameRoom.player1_id) {
            setUsername(player2Name);
        }
        if (session.user.id === gameRoom.player2_id) {
            setUsername(player1Name);
        }
    };

    // Create results array
    const createResultsArray = (results) => {
        const player1Results = results.player1_results.filter(
            (result) => result.answer === true
        );
        const player2Results = results.player2_results.filter(
            (result) => result.answer === true
        );

        const matches = player1Results
            .filter((player1Result) =>
                player2Results.some(
                    (player2Result) =>
                        player2Result.dish.id === player1Result.dish.id
                )
            )
            .map((result) => result.dish);

        setMatchingResults(matches);
    };

    // Check game status
    const gameStatusCheck = () => {
        if (gameRoom.status === "closed" && gameRoom.notificationSend === false) {
            // Send notification to players
            sendNotifications(gameRoom);

            // Update gameRoom notification
            setNotification(gameRoom.id);

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

        console.log("Sending!");

        const { data, error } = await supabase
            .from("Notifications")
            .select("player1_token, player2_token, gameroom_id")
            .eq("gameroom_id", gameRoom.id)
            .eq("player1_token", player1_token)
            .eq("player2_token", player2_token);

        if (data.length === 0) {
            await supabase.from("Notifications").insert([
                {
                    player1_token: player1_token,
                    player2_token: player2_token,
                    gameroom_id: gameRoom.id,
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
                <Background />
                <Text style={styles.title}>Game with {username}</Text>
                <Text style={styles.date}>{format(new Date(gameRoom.created_at), "do MMMM yyyy")}</Text>
                <DishesList dishes={matchingResults} />
                <Button
                    title="Back to Start"
                    onPress={() => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "StartScreen" }],
                        });
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
    },
    title: {
        fontSize: Sizes.gameResultsTitleSize,
        fontFamily: "Tektur-Bold",
        color: Colors.black,
    },
    date: {
        fontSize: Sizes.gameResultsDateSize,
        fontFamily: "Tektur-Regular",
        color: Colors.black,
        marginBottom: Sizes.gameResultsTextMargin,
    },
});
