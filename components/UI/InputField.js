import { View, StyleSheet, TextInput } from "react-native";
import Colors from "../../constants/Colors";
import Sizes from "../../constants/Sizes";

function InputField({ placeholder, value, onChangeText, secureTextEntry }) {
    return (
        <View style={styles.root}>
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                style={styles.textInput}
                autoCapitalize="none"
            />
        </View>
    );
}

export default InputField;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 1,
        backgroundColor: Colors.black,
        transform: [
            { translateX: 6 }, // Move horizontally
            { translateY: 6 }, // Move vertically
        ],
    },
    textInput: {
        flex: 1,
        backgroundColor: Colors.white,
        borderColor: Colors.black,
        borderWidth: 3,
        padding: Sizes.buttonInsidePadding,
        fontFamily: "Tektur-Bold",
        color: Colors.black,
        fontSize: Sizes.inputTextSize,
        textAlign: "center",
        transform: [
            { translateX: -6 }, // Move horizontally
            { translateY: -6 }, // Move vertically
        ],
    },
});
