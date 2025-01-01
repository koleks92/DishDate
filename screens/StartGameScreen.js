import { useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { TextInput } from "react-native-gesture-handler";

function StartGameScreen({ navigation }) {
    const [choice, setChoice] = useState(null);
    const [numOfDishes, setNumOfDishes] = useState();
    const [dishes, setDishes] = useState();



    const newGameHandler = () => {
        setChoice(1);
    };

    const joinGameHandler = () => {
        setChoice(2);
    };

    if (!choice) {
        return (
            <View style={styles.root}>
                <Button title="New Game" onPress={newGameHandler} />
                <Button title="Join Game" onPress={joinGameHandler} />
            </View>
        );
    }

    if (choice == 1) {
        return (
            <View style={styles.root}>
                <View>
                    <TextInput
                        value={numOfDishes}
                        keyboardType="numeric" // Show numeric keyboard
                        onChangeText={setNumOfDishes}
                        placeholder="Enter number of dishes"
                    />
                </View>
            </View>
        );
    }

    if (choice == 2) {
        return (
            <View style={styles.root}>
                <Text>Join Game</Text>
            </View>
        );
    }
}

export default StartGameScreen;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
