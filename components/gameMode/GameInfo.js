import { View, Share, Text, StyleSheet} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ButtonLogo from "../UI/ButtonLogo";


function GameInfo({gameId}) {
    // Sharing
    const handleShareGameId = async () => {
        try {
            const result = await Share.share({
                message:
                    "dishdate://\n" +
                    "DishDate new game is waiting for you!\n" +
                    "Game ID is: " +
                    gameId,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            console.log("Error sharing game ID:", error.message);
        }
    };

    return (
        <View style={styles.root}>
            <Text style={styles.gameIdText}>Game ID:</Text>
            <Text style={styles.gameIdTextNumber}>{gameId ? gameId : "Not avaliable"}</Text>
            <ButtonLogo
                text={
                    <Ionicons
                        name="share-social-sharp"
                        size={Sizes.buttonLogoSize}
                    />
                }
                onPress={handleShareGameId}
            />
        </View>
    );
}

export default GameInfo;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    gameIdText: {
            fontSize: Sizes.gameIdTextSize,
            fontFamily: "Tektur-Bold",
            color: Colors.black,
        },
        gameIdTextNumber: {
            fontSize: Sizes.gameIdTextNumberSize,
            fontFamily: "Tektur-Bold",
            color: Colors.black,
        }
    })
