import { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Pressable,
    KeyboardAvoidingView,
    Platform,
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
import ImageModal from "../components/UI/ImageModal";
import CustomAlert from "../components/UI/CustomAlert";

function ProfileScreen({ navigation }) {
    const [userName, setUserName] = useState("No name");
    const [userEmail, setUserEmail] = useState("No email");
    const [userAvatar, setUserAvatar] = useState(null);
    const [userId, setUserId] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [alert, setAlert] = useState({});
    const [alertVisible, setAlertVisible] = useState(false);

    const [imageModalVisible, setImageModalVisible] = useState(false);

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (user) {
                setUserId(user.id);
            }

            const { data: userData, error: errorUser } = await supabase
                .from("users")
                .select("id, name, email, avatar_url")
                .eq("id", user.id)
                .single();

            if (userData) {
                setUserName(userData.name || "No name");
                setUserEmail(userData.email || "No email");
                setUserAvatar(userData.avatar_url || null);
            }

            setTimeout(() => {
                setIsLoading(false);
            }, 500);

            if (error || errorUser) {
                console.error(
                    "Error fetching user data:",
                    error.message || errorUser.message
                );
                return null;
            }
        };

        fetchUserData();
    }, []);

    // Handle update name in the database
    const handleUpdateName = async () => {
        setUpdateLoading(true);

        const { data, error } = await supabase
            .from("users")
            .update({
                name: userName,
            })
            .eq("id", userId);

        setTimeout(() => {
            setUpdateLoading(false);
        }, 500);

        if (error) {
            console.error("Error updating user name:", error.message);
        } else {
            setAlertVisible(true);
            setAlert({
                title: "Yay!",
                message: "Name updated successfully!",
                type: "info",
            });
            return;
        }
    };

    // Get publicUrl
    const getPublicUrl = async (filepath) => {
        const { data } = supabase.storage
            .from("profileimages")
            .getPublicUrl(filepath);
        return data.publicUrl;
    };

    // Save image to storage
    const saveAvatarToStorage = async (image) => {
        const fileName = `${userId}/avatar_${Date.now()}.jpeg`;

        // Create new FormData to upload to supabase
        const formData = new FormData();

        // Append the file to the FormData
        formData.append("file", {
            uri: image, // File URI from Image Picker or other sources
            name: fileName, // A unique file name (e.g., "image.jpg")
            type: image.mimeType || "image/jpeg", // File MIME type (e.g., "image/png")
        });

        const { data, error } = await supabase.storage
            .from("profileimages")
            .upload(fileName, formData, {
                upsert: true,
            });

        const filePath = data.path;

        if (error) {
            console.error("Error uploading file:", error);
            return;
        } else {
            console.log("Sucessfully send to storage");
            // Get image URL
            const publicUrl = await getPublicUrl(filePath);

            return publicUrl;
        }
    };

    // Handle image update
    const handleUpdateImage = async (image) => {
        if (image === userAvatar || !image) {
            setImageModalVisible(false);
            return;
        } else {
            // Save new image
            const publicURL = await saveAvatarToStorage(image);

            const { data, error } = await supabase
            .from("users")
            .update({
                avatar_url: publicURL,
            })
            .eq("id", userId);

            if (error) {
                setAlertVisible(true);
                setAlert({
                    title: "Ups!",
                    message: "There was an error, try again!",
                    type: "info",
                });
                return;
            } else {
                setUserAvatar(publicURL);
            }

            // Close modal
            setImageModalVisible(false);
        }
    };

    // On delete account handler
    const onDeleteHandler = async () => {
        setAlertVisible(true);
        setAlert({
            title: "Are you sure?",
            message: "This will delete your account and all your data!",
            type: "question",
        });
    };

    // Delete account function
    const deleteAccount = async () => {
        try {
            // Step 1: Call RPC to handle cleanup in other tables
            const { error: rpcError } = await supabase.rpc("delete_user");

            if (rpcError) {
                console.error(
                    "Error deleting account via RPC:",
                    rpcError.message
                );
                showErrorAlert();
                return;
            }

            // Step 2: Delete from users table
            const { error: deleteError } = await supabase
                .from("users")
                .delete()
                .eq("id", userId);

            if (deleteError) {
                console.error(
                    "Error deleting from users table:",
                    deleteError.message
                );
                showErrorAlert();
                return;
            }

            console.log("User deleted successfully!");
            await supabase.auth.signOut();
            navigation.navigate("LoginScreen");
        } catch (err) {
            console.error("Unexpected error:", err);
            showErrorAlert();
        }
    };

    // Show error alert
    function showErrorAlert() {
        setAlertVisible(true);
        setAlert({
            title: "Ups!",
            message: "There was an error, try again!",
            type: "info",
        });
    }

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
                <CustomAlert
                    visible={alertVisible}
                    message={alert.message}
                    title={alert.title}
                    type={alert.type}
                    onClose={() => setAlertVisible(false)}
                    // For delete account
                    onYes={async () => {
                        setAlertVisible(false);
                        await deleteAccount();
                    }}
                />
                <ImageModal
                    visible={imageModalVisible}
                    onSave={handleUpdateImage}
                    sessionImage={userAvatar}
                />
                <View>
                    <BackContainer
                        deleteButton={true}
                        onDelete={onDeleteHandler}
                    />
                </View>
                <View>
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
                    <ButtonMain
                        text={updateLoading ? "Updating..." : "Update Name"}
                        onPress={handleUpdateName}
                        disabled={updateLoading}
                    />
                    <Pressable
                        onPress={() => {
                            setImageModalVisible(true);
                        }}
                    >
                        {userAvatar ? (
                            <ImageCustom
                                source={{
                                    uri: `${userAvatar}?t=${Date.now()}`,
                                }}
                                style={styles.image}
                            />
                        ) : (
                            <ImageCustom empty={true} />
                        )}
                    </Pressable>
                    <View style={styles.buttonsContainer}>
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
