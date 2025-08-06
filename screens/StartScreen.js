import { useEffect, useState, useRef, useContext } from "react";
import {
    View,
    StyleSheet,
    Platform,
    Pressable,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Animated,
} from "react-native";
import { supabase } from "../util/supabase";
import Background from "../components/UI/Background";
import ButtonMain from "../components/UI/ButtonMain";
import Sizes from "../constants/Sizes";
import Ionicons from "@expo/vector-icons/Ionicons";
import Logo from "../components/UI/Logo";
import Colors from "../constants/Colors";
import Loading from "../components/UI/Loading";
import { DDContext } from "../store/ContextStore";
import * as Notifications from "expo-notifications";

function StartScreen({ navigation }) {
    const [isLoading, setIsLoading] = useState(false);

    const { session, initialNotification, setInitialNotification } =
        useContext(DDContext);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!session?.user) {
            navigation.navigate("LoginScreen");
            return;
        }

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [session]);

    useEffect(() => {
        // Check for initial notification
        const checkInitialNotification = async () => {
            const response =
                await Notifications.getLastNotificationResponseAsync();
            if (response) {
                const notificationData =
                    response.notification.request.content.data;
                if (notificationData.gameroomId) {
                    setInitialNotification(true);
                    console.log("Initial notification data:", notificationData);
                    // Navigate to GameResultsScreen with the gameroomId
                    navigation.push("GameResultsScreen", {
                        id: notificationData.gameroomId,
                    });
                }
            }
        };

        if (!initialNotification) {
            checkInitialNotification();
        }

        const notificationListener =
            Notifications.addNotificationReceivedListener((notification) => {
                const notificationData = notification.request.content.data;
                if (notificationData.gameroomId) {
                    setInitialNotification(true);
                    navigation.navigate("GameResultsScreen", {
                        id: notificationData.gameroomId,
                    });
                }
            });

        // Notification tap listener
        const responseListener =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    const notificationData =
                        response.notification.request.content.data;
                    if (notificationData.gameroomId) {
                        setInitialNotification(true);
                        navigation.push("GameResultsScreen", {
                            id: notificationData.gameroomId,
                        });
                    }
                }
            );

        return () => {
            responseListener.remove();
        };
    }, [initialNotification]);

    // Handle SignOut
    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log("Error: ", error);
        }
    };

    // Handle SignOut
    const handleSignOutHandler = async () => {
        setIsLoading(true);
        await handleSignOut();
        navigation.navigate("LoginScreen");
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <View style={styles.root}>
                <Loading visible={isLoading} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
                    <Background />

                    <View style={styles.profileContainer}>
                        <Pressable onPress={handleSignOutHandler}>
                            <Ionicons
                                name="log-out-outline"
                                color={Colors.black}
                                size={Sizes.profileContainerHeight}
                            />
                        </Pressable>
                        <Pressable
                            onPress={() => navigation.navigate("ProfileScreen")}
                        >
                            <Ionicons
                                name="person-outline"
                                color={Colors.black}
                                size={Sizes.profileContainerHeight * 0.9}
                            />
                        </Pressable>
                    </View>
                    <View style={styles.mainContainer}>
                        <View styles={styles.logoContainer}>
                            <Logo />
                        </View>

                        <View>
                            <ButtonMain
                                text="New Game"
                                onPress={() =>
                                    navigation.navigate("NewGameScreen")
                                }
                            />
                            <ButtonMain
                                text="Join Game"
                                onPress={() =>
                                    navigation.navigate("JoinGameScreen")
                                }
                            />
                            <ButtonMain
                                text="My Dishes"
                                onPress={() =>
                                    navigation.navigate("DishesScreen")
                                }
                            />
                            <ButtonMain
                                text="My Games"
                                onPress={() => {
                                    navigation.navigate("GamesListScreen");
                                }}
                            />
                        </View>
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default StartScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    button: {
        width: 200,
        height: 44,
    },
    seperator: {
        height: Sizes.buttonHeight,
    },
    profileContainer: {
        width: Sizes.scrW * 0.9,
        height: Sizes.profileContainerHeight,
        alignContent: "center",
        justifyContent: "space-between",
        flexDirection: "row",
    },
    mainContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
    },
    socialContainer: {
        width: Sizes.buttonWidth,
        alignContent: "center",
        justifyContent: "space-evenly",
        flexDirection: "row",
    },
    logoContainer: {
        height: Sizes.logoContainerSize,
        width: Sizes.logoContainerSize,
    },
});
