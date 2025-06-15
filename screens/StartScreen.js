import { useContext, useEffect, useState, useRef } from "react";
import {
    View,
    StyleSheet,
    Alert,
    Platform,
    Pressable,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Animated,
} from "react-native";
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
import Loading from "../components/UI/Loading";
import NameModal from "../components/UI/NameModal";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
    duration: 400,
    fade: true,
});

function StartScreen({ navigation }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [alert, setAlert] = useState({});
    const [alertVisible, setAlertVisible] = useState(false);

    const [name, setName] = useState("");
    const [nameModalVisible, setNameModalVisible] = useState(false);

    const notificationListener = useRef();
    const responseListener = useRef();

    const fadeAnim = useRef(new Animated.Value(0)).current;

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


    // Root view fade in animation
    useEffect(() => {
        if (!isLoading) {
            // Hide the splash screen after the initial loading
            SplashScreen.hideAsync();
            // Start the fade-in animation
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [isLoading]);

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
        setIsLoading(true);
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

        await fetchUserName();

        setNameModalVisible(true);
    };

    // Handle Apple Sign in
    const handleAppleSignIn = async () => {
        setIsLoading(true);
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

        await fetchUserName();

        setNameModalVisible(true);
    };

    // Handle SignUp
    const handleSignUp = async () => {
        setIsLoading(true);
        if (!email || !password) {
            setAlertVisible(true);
            setAlert({
                title: "Ups!",
                message: "Please fill in both fields",
                type: "info",
            });
            return;
        } else {
            const {
                data: { session },
                error,
            } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) Alert.alert(error.message);
            if (!session) {
                setAlertVisible(true);
                setAlert({
                    title: "Ups!",
                    message: "Please check your inbox for email verification!",
                    type: "info",
                });
            }
        }

        await fetchUserName();

        setNameModalVisible(true);
    };

    // Handle SignIn
    const handleSignIn = async () => {
        setIsLoading(true);
        if (!email || !password) {
            setAlertVisible(true);
            setAlert({
                title: "Ups!",
                message: "Please fill in both fields",
                type: "info",
            });
            return;
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                setAlertVisible(true);
                setAlert({
                    title: "Ups!",
                    message: error.message,
                    type: "info",
                });
            }
        }
        await fetchUserName();

        setNameModalVisible(true);
    };

    // Handle SignOut
    const handleSignOutHandler = async () => {
        setIsLoading(true);
        await handleSignOut();
        setIsLoading(false);
    };

    // Handle custom name save
    const handleNameModalSave = async (name) => {
        const { data, error } = await supabase.auth.updateUser({
            data: { name: name }, // Updating metadata
        });

        setNameModalVisible(false);

        setIsLoading(false);

        return;
    };

    // Get user name from database
    const fetchUserName = async () => {
        const { data: user } = await supabase.auth.getUser();

        if (user) {
            const userId = user.user.id;

            const { data, error } = await supabase
                .from("users")
                .select("name")
                .eq("id", userId)
                .single();

            if (error) {
                console.error("Error fetching name:", error.message);
            } else {
                setName(data.name);
            }
        }
    };

    if (isLoading) {
        return (
            <View style={styles.root}>
                <Loading visible={isLoading} />
                <NameModal
                    visible={nameModalVisible}
                    onSave={handleNameModalSave}
                    sessionName={name}
                />
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
                    <CustomAlert
                        visible={alertVisible}
                        message={alert.message}
                        title={alert.title}
                        type={alert.type}
                        onClose={() => setAlertVisible(false)}
                    />

                    {session && (
                        <View style={styles.profileContainer}>
                            <Pressable onPress={handleSignOutHandler}>
                                <Ionicons
                                    name="log-out-outline"
                                    color={Colors.black}
                                    size={Sizes.profileContainerHeight}
                                />
                            </Pressable>
                            <Pressable
                                onPress={() =>
                                    navigation.navigate("ProfileScreen")
                                }
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
                                <ButtonMain
                                    text="Sign In"
                                    onPress={handleSignIn}
                                />
                                <ButtonMain
                                    text="Sign Up"
                                    onPress={handleSignUp}
                                />
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
                        )}
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
