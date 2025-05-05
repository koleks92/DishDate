import { useContext, useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { DDContext } from "../store/ContextStore";
import { supabase } from "../util/supabase";
import GamesList from "../components/GamesList";
import Background from "../components/UI/Background";
import Loading from "../components/UI/Loading";

function GamesListScreen({ navigation }) {
    const { session } = useContext(DDContext);

    const [isLoading, setIsLoading] = useState(true);
    const [gamesList, setGamesList] = useState([]);

    const fadeAnim = useRef(new Animated.Value(0)).current;

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

    useEffect(() => {
        const fetchGamesList = async () => {
            const { data, error } = await supabase
                .from("GameRoom")
                .select("*")
                .or(
                    `player1_id.eq.${session.user.id},player2_id.eq.${session.user.id}`
                )
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching data:", error.message);
                return;
            }



            setGamesList(data);

            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        };

        fetchGamesList();
    }, []);

    const handleGamePress = (gameId) => {
        // Navigate to the game screen with the selected gameId
        navigation.navigate("GameResultsScreen", { id: gameId });
    };

    if (isLoading) {
        return (
            <View style={styles.root}>
                <Loading visible={isLoading} />
            </View>
        );
    }

    return (
        <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
            <Background />
            <Text style={styles.title}> My Games</Text>
            <GamesList
                gamesList={gamesList}
                handleGamePress={handleGamePress}
            />
        </Animated.View>
    );
}

export default GamesListScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: Sizes.gameListTitleSize,
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        marginBottom: Sizes.gameListTitleMargin,
    },
});
