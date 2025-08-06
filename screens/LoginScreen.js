import { useContext, useEffect, useState, useRef } from "react";
import {
    View,
    StyleSheet,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Animated,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { DDContext } from "../store/ContextStore";
import { supabase } from "../util/supabase";
import { registerForPushNotificationsAsync } from "../util/Push";
import Background from "../components/UI/Background";
import ButtonMain from "../components/UI/ButtonMain";
import ButtonLogo from "../components/UI/ButtonLogo";
import Sizes from "../constants/Sizes";
import InputField from "../components/UI/InputField";
import Ionicons from "@expo/vector-icons/Ionicons";
import Logo from "../components/UI/Logo";
import CustomAlert from "../components/UI/CustomAlert";
import Loading from "../components/UI/Loading";
import * as Network from "expo-network";

// Google Client IDS
const webClientId =
    "602018707783-ddo4gqideosf5ajktskbpgea6su94tlp.apps.googleusercontent.com";
const iosClientId =
    "602018707783-iobmkug410uncofs1m5fdpgjvb2f85hg.apps.googleusercontent.com";

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [alert, setAlert] = useState({});
    const [alertVisible, setAlertVisible] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Context Stores
    const {
        loadDishesHandler,
        session,
        setSession,
        loadCuisinesHandler,
        saveExpoPushToken,
        initialNotification,
        setInitialNotification,
    } = useContext(DDContext);

    useEffect(() => {
        async function prepare() {
            const networkState = await Network.getNetworkStateAsync();

            // if (__DEV__) {
            //     networkState.isInternetReachable = false;
            // }

            // Check if the device is connected to the internet
            if (!networkState.isInternetReachable) {
                setAlertVisible(true);
                setAlert({
                    title: "No Internet",
                    message:
                        "Please check your internet connection and restart application.",
                    type: "info",
                });
                setIsLoading(true);
                return;
            }

            GoogleSignin.configure({
                webClientId,
                iosClientId,
            });

            supabase.auth.getSession().then(({ data: { session } }) => {
                setSession(session);
            });

            supabase.auth.onAuthStateChange((_event, session) => {
                if (_event != "USER_UPDATED") {
                    setSession(session);
                }
            });
        }

        prepare();

        // Start the fade-in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, []);


    useEffect(() => {
        if (session) {
            setIsLoading(true);
            setupUser();
            setIsLoading(false);
            navigation.navigate("StartScreen");
        }
    }, [session]);

    const setupUser = async () => {
        await loadDishesHandler();
        await loadCuisinesHandler();
        await insertUser(session?.user);
        await registerPushToken();
    };

    // Register push token for notifications
    const registerPushToken = async () => {
        if (!session) {
            console.log(
                "No session found, skipping push notification registration."
            );
            return;
        }

        const token = await registerForPushNotificationsAsync();
        if (token) {
            saveExpoPushToken(session.user.id, token);
        }
    };

    // Function to insert user info into Users table
    const insertUser = async (user) => {
        if (!user) return;

        const { id, email, user_metadata } = user;
        const avatar_url = user_metadata?.avatar_url || "";

        // Use name if present, else use the part of the email before '@'
        const name = user_metadata?.name?.trim()
            ? user_metadata.name
            : email?.split("@")[0] || "";

        // Check if user already exists
        const { data: existingUser, error: fetchError } = await supabase
            .from("users")
            .select("id")
            .eq("id", id)
            .single();

        if (existingUser) {
            return; // Already exists, skip insert
        }

        const { error } = await supabase.from("users").insert([
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
            } else {
                throw new Error("No identity token received from Apple.");
            }
        } catch (e) {
            if (e.code === "ERR_REQUEST_CANCELED") {
                console.log("Apple sign-in cancelled by user.");
            } else {
                console.error("Apple Sign-In error:", e);
            }
        }
    };

    // Handle SignUp
    const handleSignUp = async () => {
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

            if (error) {
                setAlertVisible(true);
                setAlert({
                    title: "Ups!",
                    message: error.message,
                    type: "info",
                });
            }
        }
    };

    // Handle SignIn
    const handleSignIn = async () => {
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
    };

    if (isLoading) {
        return (
            <View style={styles.root}>
                {isLoading && !alertVisible && <Loading visible={true} />}

                {alertVisible && (
                    <>
                        <Background />
                        <CustomAlert
                            visible={true}
                            message={alert.message}
                            title={alert.title}
                            type={alert.type}
                            onClose={() => setAlertVisible(false)}
                        />
                    </>
                )}
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

                    <View style={styles.mainContainer}>
                        <View styles={styles.logoContainer}>
                            <Logo />
                        </View>

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
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default LoginScreen;

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
