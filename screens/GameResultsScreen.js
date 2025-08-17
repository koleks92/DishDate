import { useContext, useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, Animated } from "react-native";
import { supabase } from "../util/supabase";
import DishesList from "../components/DishesList";
import Background from "../components/UI/Background";
import { DDContext } from "../store/ContextStore";
import Colors from "../constants/Colors";
import { format, set } from "date-fns";
import ButtonMain from "../components/UI/ButtonMain";
import Loading from "../components/UI/Loading";
import GameInfo from "../components/gameMode/GameInfo";
import BackContainer from "../components/UI/BackContainer";

function GameResultScreen({ route, navigation }) {
    const [id, setId] = useState(route.params.id);
    const [waiting, setWaiting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [gameRoom, setGameRoom] = useState(null);
    const [matchingResults, setMatchingResults] = useState(null);
    const [username, setUsername] = useState(null);

    const { fetchUserName, session, setNotification } = useContext(DDContext);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const secondFadeAnim = useRef(new Animated.Value(0)).current;

    // Root view fade in animation
    useEffect(() => {
        if (!isLoading) {
            if (waiting) {
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }).start();
            }

            if (!waiting) {
                Animated.timing(secondFadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }).start();
            }
        }
    }, [isLoading, waiting]);

    // Initial loding, fetching GameRoom
    useEffect(() => {
        setTimeout(() => {
            fetchGameRoomHandler(id);
            setIsLoading(false);
        }, 1000);
    }, []);

    // Refresh GameRoom function
    const refreshGameRoom = async () => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            fetchGameRoomHandler(id);
            setIsLoading(false);
        }, 1000); // Wait 1 second

        if (gameRoom.status === "closed") {
            setWaiting(false);
        }

        return () => clearTimeout(timer); // Cleanup on unmount
    };

    // Fetch GameRoom and create Results, get usernames etc.
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

        console.log("Game room data:", data[0].status);

        gameStatusCheck(data[0]);
        setGameRoom(data[0]);

        if (data[0].status === "closed") {
            createResultsArray(data[0]);
            getUserNames(data[0]);
            setWaiting(false);
        }
    };

    // Get user names from the database
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
    const gameStatusCheck = (room) => {
        if (room.status === "closed" && room.notificationSend === false) {
            // Send notification to players
            sendNotifications(room);

            // Update gameRoom notification
            setNotification(room.id);

            setWaiting(false);
        } else if (room.status === "open") {
            // Send to GameScreen if player 1 (creator) never finished
            if (!room.player1_results) {
                navigation.navigate("GameScreen", { gameId: room.game_id });
            }
            setWaiting(true);
        } else if (room.status === "closed") {
            setWaiting(false);
        }
    };

    // Get Expo Token for push notifications
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
                <Loading visible={isLoading} />
            </View>
        );
    }

    if (waiting) {
        return (
            <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
                <Background />
                <View>
                    <BackContainer goStart={true} />
                </View>
                <View style={styles.gameResultsContainer}>
                    <Text style={styles.waitingText}>
                        Waiting for the other player
                    </Text>
                    <View style={styles.gameInfoContainer}>
                        <GameInfo gameId={gameRoom?.game_id} />
                    </View>
                    <ButtonMain
                        text="Refresh"
                        onPress={() => {
                            refreshGameRoom();
                        }}
                    />
                </View>
            </Animated.View>
        );
    } else {
        return (
            <Animated.View style={[styles.root, { opacity: secondFadeAnim }]}>
                <Background />
                <View>
                    <BackContainer goStart={true} />
                </View>
                <View style={styles.gameResultsContainer}>
                    <Text style={styles.title}>Game with {username}</Text>
                    <Text style={styles.date}>
                        {gameRoom?.created_at
                            ? format(
                                  new Date(gameRoom.created_at),
                                  "do MMMM yyyy"
                              )
                            : ""}
                    </Text>
                    <DishesList dishes={matchingResults} />
                </View>
            </Animated.View>
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
    gameResultsContainer: {
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
    waitingText: {
        fontSize: Sizes.gameResultsWaitingTextSize,
        fontFamily: "Tektur-Bold",
        textAlign: "center",
        color: Colors.black,
        marginBottom: Sizes.gameResultsWaitingTextMargin,
    },
    gameInfoContainer: {
        marginBottom: Sizes.buttonHeight,
    },
});
