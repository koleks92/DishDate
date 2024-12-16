import { Text, View, StyleSheet } from "react-native";

function ProfileScreen() {
    return (
        <View style={styles.root}>
            <Text>ProfileScreen</Text>
        </View>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})