import { useContext, useEffect, useState, useRef } from "react";
import { View, StyleSheet, Alert, Platform, Pressable } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { DDContext } from "../store/ContextStore";
import { supabase } from "../util/supabase";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../util/Push";
import Background from "../components/UI/Background";
import ButtonMain from "../components/UI/ButtonMain";
import ButtonLogo from "../components/UI/ButtonLogo";
import Sizes from "../constants/Sizes";
import InputField from "../components/UI/InputField";
import Ionicons from "@expo/vector-icons/Ionicons";
import Logo from "../components/UI/Logo";
import Colors from "../constants/Colors";
import CustomAlert from "../components/UI/CustomAlert";
import { set } from "date-fns";

function StartScreen({ navigation }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState({});

    const notificationListener = useRef();
    const responseListener = useRef();

    // Context Stores
    const {
        handleSignOut,
        loadDishesHandler,
        session,
        setSession,
        loadCuisinesHandler,
        saveExpoPushToken,
    } = useContext(DDContext);

    // Get dishes from database
    useEffect(() => {
        setIsLoading(true);
        loadDishesHandler();
        loadCuisinesHandler();

        // Configure Google Cloud SignIn
        GoogleSignin.configure({
            webClientId:
                "602018707783-ddo4gqideosf5ajktskbpgea6su94tlp.apps.googleusercontent.com",
            iosClientId:
                "602018707783-iobmkug410uncofs1m5fdpgjvb2f85hg.apps.googleusercontent.com",
        });

        // Handle session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                upsertUser(session.user);
            }
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                upsertUser(session.user);
            }
        });
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!session || !session.user) {
            console.log(
                "Session not available yet, skipping push token registration."
            );
            return; // Exit early if session is not ready
        }

        if (notificationListener.current) {
            Notifications.removeNotificationSubscription(
                notificationListener.current
            );
        }
        if (responseListener.current) {
            Notifications.removeNotificationSubscription(
                responseListener.current
            );
        }

        registerForPushNotificationsAsync()
            .then((token) => {
                saveExpoPushToken(session.user.id, token);
            })
            .catch((error) => console.error(error));

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                console.log(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    const notificationData =
                        response.notification.request.content.data;
                    if (notificationData.gameroomId) {
                        navigation.navigate("GameResultsScreen", {
                            id: notificationData.gameroomId,
                        });
                    }
                }
            );
    }, [session]);

    // Function to upsert user info into Users table
    const upsertUser = async (user) => {
        const { id, email, user_metadata } = user;
        const name = user_metadata?.name || "";
        const avatar_url = user_metadata?.avatar_url || "";

        const { error } = await supabase.from("users").upsert([
            {
                id,
                email,
                name,
                avatar_url,
            },
        ]);

        if (error) {
            console.error("Error inserting user:", error);
        }
    };

    // Handle Google Sign In
    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            if (userInfo.data.idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: "google",
                    token: userInfo.data.idToken,
                });
                if (error) {
                    console.error("Supabase sign-in error:", error);
                }
            } else {
                throw new Error("No ID token present in Google response!");
            }
        } catch (error) {
            console.error("Google Sign-In error:", error);
        }
    };

    // Handle Apple Sign in
    const handleAppleSignIn = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            if (credential.identityToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: "apple",
                    token: credential.identityToken,
                });
                if (error) {
                    console.error("Supabase sign-in error:", error);
                }
            }
        } catch (e) {
            if (e.code === "ERR_REQUEST_CANCELED") {
                // handle that the user canceled the sign-in flow
            } else {
                console.error("Apple Sign-In error:", error);
            }
        }
    };

    // Handle SignUp
    const handleSignUp = async () => {
        if (!email || !password) {
            setModalVisible(true);
            setModalMessage({
                title: "Ups!",
                message: "Please fill in both fields",
            });
            return;
        } else {
            setLoading(true);
            const {
                data: { session },
                error,
            } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) Alert.alert(error.message);
            if (!session) setModalVisible(true);
            setModalMessage({
                title: "Ups!",
                message: "Please check your inbox for email verification!",
            });
            setLoading(false);
        }
    };

    // Handle SignIn
    const handleSignIn = async () => {
        if (!email || !password) {
            setModalVisible(true);
            setModalMessage({
                title: "Ups!",
                message: "Please fill in both fields",
            });
            return;
        } else {
            setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                setModalVisible(true);
                setModalMessage({
                    title: "Ups!",
                    message: error.message,
                });
            }
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.root}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <Background />
            <CustomAlert
                visible={modalVisible}
                message={modalMessage}
                onClose={() => setModalVisible(false)}
            />
            {session && (
                <View style={styles.profileContainer}>
                    <Pressable onPress={handleSignOut}>
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
            )}
            <View style={styles.mainContainer}>
                <View styles={styles.logoContainer}>
                    <Logo />
                </View>

                {!session ? (
                    <View>
                        <InputField
                            placeholder={"Email"}
                            value={email}
                            onChangeText={setEmail}
                        />
                        <InputField
                            placeholder={"Password"}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                        />
                        <ButtonMain text="Sign In" onPress={handleSignIn} />
                        <ButtonMain text="Sign Up" onPress={handleSignUp} />
                        <View style={styles.socialContainer}>
                            <ButtonLogo
                                text={
                                    <Ionicons
                                        name="logo-google"
                                        size={Sizes.buttonLogoSize}
                                    />
                                }
                                onPress={handleGoogleSignIn}
                            />
                            {Platform.OS === "ios" && (
                                <ButtonLogo
                                    text={
                                        <Ionicons
                                            name="logo-apple"
                                            size={Sizes.buttonLogoSize}
                                        />
                                    }
                                    onPress={handleAppleSignIn}
                                />
                            )}
                        </View>
                    </View>
                ) : (
                    <View>
                        <ButtonMain
                            text="New Game"
                            onPress={() => navigation.navigate("NewGameScreen")}
                        />
                        <ButtonMain
                            text="Join Game"
                            onPress={() =>
                                navigation.navigate("JoinGameScreen")
                            }
                        />
                        <ButtonMain
                            text="My Dishes"
                            onPress={() => navigation.navigate("DishesScreen")}
                        />
                    </View>
                )}
            </View>
        </View>
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
        justifyContent: "space-evenly",
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
