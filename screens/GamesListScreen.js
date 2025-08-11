import { useContext, useEffect, useState, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { DDContext } from "../store/ContextStore";
import { supabase } from "../util/supabase";
import GamesList from "../components/GamesList";
import Background from "../components/UI/Background";
import Loading from "../components/UI/Loading";
import BackContainer from "../components/UI/BackContainer";
import CustomAlert from "../components/UI/CustomAlert";
import { set } from "date-fns";

function GamesListScreen({ navigation }) {
    const { session } = useContext(DDContext);

    const [isLoading, setIsLoading] = useState(true);
    const [gamesList, setGamesList] = useState([]);

    const [alert, setAlert] = useState({});
    const [alertVisible, setAlertVisible] = useState(false);

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

    // Get gamesList
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

    useEffect(() => {
        if (gamesList.length === 0) {
            setAlert({
                title: "No Games Found",
                message: "You have not participated in any games yet.",
                type: "info",
            });
            setAlertVisible(true);
        }
        }, [gamesList]);

    // On game click handler
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
            <CustomAlert
                visible={alertVisible}
                message={alert.message}
                title={alert.title}
                type={alert.type}
                onClose={() => {
                    setAlertVisible(false);
                    navigation.goBack();
                }}
            />
            <Background />
            <View>
                <BackContainer />
            </View>
            <View style={styles.gamesListContainer}>
                <GamesList
                    gamesList={gamesList}
                    handleGamePress={handleGamePress}
                />
            </View>
        </Animated.View>
    );
}

export default GamesListScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        alignItems: "center",
    },
    gamesListContainer: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: Sizes.gameListTitleSize,
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        marginBottom: Sizes.gameListTitleMargin,
    },
});
