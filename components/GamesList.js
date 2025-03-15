import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { supabase } from "../util/supabase";
import { format } from "date-fns";

function GamesList({ gamesList }) {
    // State to store player names for each game
    const [playersNames, setPlayersNames] = useState({});

    // Get player name asynchronously
    const getPlayerName = async (playerId) => {
        const { data, error } = await supabase
            .from("users") // or your custom users table
            .select("*")
            .eq("id", playerId);

        if (error) {
            console.error("Error fetching data:", error.message);
            return "No name";
        }

        return data[0]?.name || "No name";
    };

    // UseEffect to set the player names once the gamesList is loaded
    useEffect(() => {
        const fetchPlayerNames = async () => {
            const updatedNames = {};

            for (const game of gamesList) {
                const player1Name = await getPlayerName(game.player1_id);
                const player2Name = await getPlayerName(game.player2_id);

                updatedNames[game.id] = {
                    player1: player1Name,
                    player2: player2Name
                };
            }

            setPlayersNames(updatedNames);
        };

        fetchPlayerNames();
    }, [gamesList]);

    return (
        <View style={styles.root}>
            <Text>Games List</Text>
            <FlatList
                data={gamesList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const { player1, player2 } = playersNames[item.id] || {};

                    return (
                        <Pressable
                            onPress={() => console.log(item.id)}
                            style={styles.item}
                        >
                            <Text>
                                {format(new Date(item.created_at), "do MMMM yyyy")}
                            </Text>
                            <Text>{player1 ? player1 : "Loading player1..."}</Text>
                            <Text>{player2 ? player2 : "Loading player2..."}</Text>
                            <Text>{item.status}</Text>
                        </Pressable>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 16,
    },
    item: {
        flex: 1,
        flexDirection: "column",
        marginBottom: 16,
        padding: 12,
        backgroundColor: "#f0f0f0",
    },
});

export default GamesList;
