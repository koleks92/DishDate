import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { DDContext } from "../store/ContextStore";
import { supabase } from "../util/supabase";
import GamesList from "../components/GamesList";

function GamesListScreen() {
    const { session } = useContext(DDContext);

    const [isLoading, setIsLoading] = useState(true);
    const [gamesList, setGamesList] = useState([]);

    // Fetch users games list
    useEffect(() => {
        const fetchGamesList = async () => {
            const { data, error } = await supabase
                .from("GameRoom")
                .select("*")
                .or(
                    `player1_id.eq.${session.user.id},player2_id.eq.${session.user.id}`
                );

            setGamesList(data);

            if (error) {
                console.error("Error fetching data:", error.message);
                return null;
            }

            setIsLoading(false);
        };

        fetchGamesList();
    }, []);

    

    if (isLoading) {
        return (
            <View style={styles.root}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <GamesList gamesList={gamesList} />
        </View>
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
});
