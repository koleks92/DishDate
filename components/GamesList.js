import { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { format } from "date-fns";
import Sizes from "../constants/Sizes";
import { DDContext } from "../store/ContextStore";
import Colors from "../constants/Colors";

function GamesList({ gamesList, handleGamePress }) {
    // State to store player names for each game
    const [playersNames, setPlayersNames] = useState({});
    const { session, fetchUserName } = useContext(DDContext);

    // UseEffect to set the player names once the gamesList is loaded
    useEffect(() => {
        const fetchPlayerNames = async () => {
            const updatedNames = {};

            for (const game of gamesList) {
                if (game.status === "closed") {
                    const player1Name = await fetchUserName(game.player1_id);
                    const player2Name = await fetchUserName(game.player2_id);

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
                        player: "Not finished",
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
                    <View style={styles.dateTextContainer}>
                        <Text style={styles.dateText}>
                            {format(new Date(item.created_at), "dd-MM-yyyy")}
                        </Text>
                    </View>
                    <View style={styles.playerTextContainer}>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={styles.playerText}
                        >
                            {player ? player : "Loading player..."}
                        </Text>
                    </View>
                </Pressable>
            </View>
        );
    };

    return (
        <FlatList
            data={gamesList}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.gamesListContainer}
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
        position: "relative",
    },
    gamesListContainer: {
        flexGrow: 1,
        marginTop: Sizes.gameListContainerMargin,
        alignContent: "center",
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
        position: "absolute",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: Sizes.gameListItemWidth,
        height: Sizes.gameListItemHeight,
        top: 0,
        left: 0,
        padding: Sizes.gameListItemPadding,
        backgroundColor: "#f0f0f0",
        borderWidth: 3,
        backgroundColor: Colors.backgroundButton,
    },
    dateTextContainer: {
        width: "45%",
        alignItems: "left",
    },
    dateText: {
        fontFamily: "Tektur-Bold",
        fontSize: Sizes.gameListItemTextSize,
        color: Colors.black,
    },
    playerTextContainer: {
        width: "55%",
        alignItems: "center",
    },
    playerText: {
        fontFamily: "Tektur-Bold",
        fontSize: Sizes.gameListItemTextSize,
        color: Colors.black,
    },
});

export default GamesList;
