import { StyleSheet, Pressable, View } from "react-native";
import Sizes from "../../constants/Sizes";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

function BackContainer({ goStart }) {
    const navigation = useNavigation();

    return (
        <View style={styles.root}>
            <Pressable
                onPress={() => {
                    goStart ? navigation.navigate("StartScreen"): navigation.goBack() ;
                }}
            >
                <Ionicons
                    name="chevron-back-outline"
                    color={Colors.black}
                    size={Sizes.backContainerHeight}
                />
            </Pressable>

            <></>
        </View>
    );
}

export default BackContainer;

const styles = StyleSheet.create({
    root: {
        width: Sizes.scrW * 0.9,
        height: Sizes.backContainerHeight,
        alignContent: "center",
        justifyContent: "space-between",
        flexDirection: "row",
    },
});
