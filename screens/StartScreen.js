import { useContext, useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    Platform,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { DDContext } from "../store/ContextStore";
import { supabase } from "../util/supabase";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../util/Push";

function StartScreen({ navigation }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

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
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    useEffect(() => {
        // Push Notifications
        if (session && !session.user.is_anonymous) {
            registerForPushNotificationsAsync()
                .then((token) => {
                    saveExpoPushToken(session.user.id, token);
                })
                .catch((error) => console.error(error));

            notificationListener.current =
                Notifications.addNotificationReceivedListener(
                    (notification) => {
                        console.log(notification);
                    }
                );

            responseListener.current =
                Notifications.addNotificationResponseReceivedListener(
                    (response) => {
                        const notificationData =
                            response.notification.request.content.data;
                        if (notificationData.gameId) {
                            navigation.replace("GameResultsScreen", {
                                gameId: notificationData.gameId,
                            });
                        }
                    }
                );

            return () => {
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
            };
        }
    }, [session]);

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
                // handle other errors
            }
        }
    };

    // Handle anonymous SignIn
    const handleAnonymousSignIn = async () => {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signInAnonymously();

        setLoading(false);
    };

    // Handle SignUp
    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in both fields");
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
            if (!session)
                Alert.alert("Please check your inbox for email verification!");
            setLoading(false);
        }
    };

    // Handle SignIn
    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in both fields");
            return;
        } else {
            setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) Alert.alert(error.message);
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <View style={styles.root}>
                <View style={styles.emailContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* Password Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Button
                        onPress={handleSignUp}
                        title="Sign Up"
                        disabled={loading}
                    />
                    <Button
                        onPress={handleSignIn}
                        title="Sign In"
                        disabled={loading}
                    />
                </View>
                <View style={styles.socialContainer}>
                    <Button
                        onPress={handleAnonymousSignIn}
                        disabled={loading}
                        title="Anonymous SignIn"
                    />
                    <Button onPress={handleGoogleSignIn} title="Google" />
                    {Platform.OS === "ios" && (
                        <View>
                            <AppleAuthentication.AppleAuthenticationButton
                                buttonType={
                                    AppleAuthentication
                                        .AppleAuthenticationButtonType.SIGN_IN
                                }
                                buttonStyle={
                                    AppleAuthentication
                                        .AppleAuthenticationButtonStyle.BLACK
                                }
                                cornerRadius={5}
                                style={styles.button}
                                onPress={() => {
                                    handleAppleSignIn();
                                }}
                            />
                        </View>
                    )}
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.root}>
                <Button
                    title="New Game"
                    onPress={() => {
                        navigation.navigate("NewGameScreen");
                    }}
                />
                <Button
                    title="Join Game"
                    onPress={() => {
                        navigation.navigate("JoinGameScreen");
                    }}
                />
                <Button title="SignOut" onPress={handleSignOut} />
                {!session.user.is_anonymous && (
                    <>
                        <Button
                            title="Profile"
                            onPress={() => {
                                navigation.navigate("ProfileScreen");
                            }}
                        />
                        <Button
                            title="Dishes"
                            onPress={() => {
                                navigation.navigate("DishesScreen");
                            }}
                        />
                    </>
                )}
            </View>
        );
    }
}

export default StartScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        width: 200,
        height: 44,
    },
});
