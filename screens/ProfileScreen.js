import { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    Button,
    ActivityIndicator,
} from "react-native";
import { supabase } from "../util/supabase";

function ProfileScreen() {
    const [userName, setUserName] = useState("No name");
    const [userEmail, setUserEmail] = useState("No email");
    const [userAvatar, setUserAvatar] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);

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

            setIsLoading(false);

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
                <ActivityIndicator size="large" color="blue" />
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <Text>{userEmail}</Text>
            <TextInput
                placeholder="Enter new name"
                value={userName}
                onChangeText={setUserName}
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            />
            {userAvatar && (
                <Image source={{ uri: userAvatar }} style={styles.image} />
            )}
            <Button
                title={updateLoading ? "Updating..." : "Save"}
                onPress={handleUpdateName}
                disabled={updateLoading}
            />
        </View>
    );
}

export default ProfileScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 200,
        height: 200,
    },
});
