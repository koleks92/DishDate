import { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { supabase } from "../util/supabase";
import { format } from "date-fns";
import Sizes from "../constants/Sizes";
import { DDContext } from "../store/ContextStore";
import Colors from "../constants/Colors";

function GamesList({ gamesList, handleGamePress }) {
    // State to store player names for each game
    const [playersNames, setPlayersNames] = useState({});
    const { session } = useContext(DDContext);

    // Get player name asynchronously
    const getPlayerName = async (playerId) => {
        const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", playerId);
        
        if (error) {
            console.error("Error fetching player name:", error.message);
            return "Error";
        }
        
        return data[0]?.name;
    };
    
    // UseEffect to set the player names once the gamesList is loaded
    useEffect(() => {
        console.log("GamesList useEffect");
        const fetchPlayerNames = async () => {
            const updatedNames = {};
            
            for (const game of gamesList) {
                if (game.status === "closed") {
                    const player1Name = await getPlayerName(game.player1_id);
                    const player2Name = await getPlayerName(game.player2_id);
                    console.log("Player1 name:", player1Name);
                    console.log("Player2 name:", player2Name);
                    if (game.player1_id === session.user.id) {
                        updatedNames[game.id] = {
                            player: player2Name,
                        };
                    } else if (game.player2_id === session.user.id) {
                        updatedNames[game.id] = {
                            player: player1Name,
                        };
                    }
                } else if (game.status === "open") {
                    updatedNames[game.id] = {
                        player: "Not finished yet",
                    };
                }
            }

            setPlayersNames(updatedNames);
        };

        fetchPlayerNames();
    }, []);

    const renderGameView = (item) => {

        const { player } = playersNames[item.id] || {};

        return (
            <View style={styles.rootItem}>
                <View style={styles.shadow} />
                <Pressable
                    onPress={() => {
                        handleGamePress(item.id);
                    }}
                    style={styles.item}
                >
                    <Text style={styles.text}>
                        {format(new Date(item.created_at), "do MMMM yyyy")}
                    </Text>
                    <Text style={styles.text}>
                        {player ? player : "Loading player2..."}
                    </Text>
                </Pressable>
            </View>
        );
    };

    return (
        <FlatList
            data={gamesList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
                return renderGameView(item);
            }}
        />
    );
}

const styles = StyleSheet.create({
    rootItem: {
        width: Sizes.gameListItemWidth + 6, // add 6px for shadow
        height: Sizes.gameListItemHeight, // add 6px for shadow
        marginBottom: Sizes.gameListItemMargin,
        position: "relative", // <- important
    },
    shadow: {
        position: "absolute",
        top: 6, // move down
        left: 6, // move right
        width: "100%",
        height: "100%",
        backgroundColor: Colors.black,
    },
    item: {
        position: "absolute", // << YOU FORGOT THIS
        flexDirection: "row", // ✅ you can use it
        justifyContent: "space-around", // or whatever you want
        alignItems: "center", // typical
        width: Sizes.gameListItemWidth,
        height: Sizes.gameListItemHeight,
        top: 0,
        left: 0,
        padding: Sizes.gameListItemPadding,
        backgroundColor: "#f0f0f0",
        borderWidth: 3,
        backgroundColor: Colors.backgroundButton,
    },
    text: {
        fontFamily: "Tektur-Bold",
        fontSize: Sizes.gameListItemTextSize,
        color: Colors.black,
    },
});

export default GamesList;
