import { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    Button,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
} from "react-native";
import { supabase } from "../util/supabase";
import Background from "../components/UI/Background";
import Sizes from "../constants/Sizes";
import Colors from "../constants/Colors";
import InputField from "../components/UI/InputField";
import ButtonMain from "../components/UI/ButtonMain";
import ImageCustom from "../components/UI/ImageCustom";
import Loading from "../components/UI/Loading";
import BackContainer from "../components/UI/BackContainer";

function ProfileScreen({ navigation }) {
    const [userName, setUserName] = useState("No name");
    const [userEmail, setUserEmail] = useState("No email");
    const [userAvatar, setUserAvatar] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();
            let metadata = user.user_metadata;

            if (metadata) {
                setUserName(metadata.name);
                setUserEmail(metadata.email);
                setUserAvatar(metadata.avatar_url);
            }

            setTimeout(() => {
                setIsLoading(false);
            }, 500);

            if (error) {
                console.error("Error fetching user data:", error.message);
                return null;
            }
        };

        fetchUserData();
    }, []);

    const handleUpdateName = async () => {
        setUpdateLoading(true);

        const { data, error } = await supabase.auth.updateUser({
            data: { name: userName }, // Updating metadata
        });

        setTimeout(() => {
            setUpdateLoading(false);
        }, 500);

        if (error) {
            Alert.alert("Error", error.message);
        } else {
            Alert.alert("Success", "Name updated successfully!");
            console.log("Updated user:", data);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.root}>
                <Loading />
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.root}>
                <Background />
                <View>
                    <BackContainer />
                </View>
                <View style={styles.profileContainer}>
                    <View style={styles.userEmailContainer}>
                        <Text style={styles.userEmailText}>{userEmail}</Text>
                    </View>
                    <View style={styles.userNameContainer}>
                        <InputField
                            placeholder="Enter new name"
                            value={userName}
                            onChangeText={setUserName}
                        />
                    </View>
                    {userAvatar ? (
                        <ImageCustom
                            source={{ uri: userAvatar }}
                            style={styles.image}
                        />
                    ) : (
                        <ImageCustom empty={true} />
                    )}
                    <View style={styles.buttonsContainer}>
                        <ButtonMain
                            text={updateLoading ? "Updating..." : "Update Name"}
                            onPress={handleUpdateName}
                            disabled={updateLoading}
                        />
                        <View style={styles.Seperator} />
                        <ButtonMain
                            text="My Dishes"
                            onPress={() => {
                                navigation.navigate("DishesListScreen", {
                                    edit: true,
                                });
                            }}
                        />
                        <ButtonMain
                            text="My Games"
                            onPress={() => {
                                navigation.navigate("GamesListScreen");
                            }}
                        />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

export default ProfileScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        alignItems: "center",
    },
    profileContainer: {
        flex: 1,
        justifyContent: "center"
    },
    userEmailContainer: {
        marginBottom: Sizes.profileScreenMargin,
    },
    userEmailText: {
        fontFamily: "Tektur-Bold",
        fontSize: Sizes.profileTextSize,
        color: Colors.black,
    },
    Seperator: {
        height: Sizes.buttonHeight,
    },
});
