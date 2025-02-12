import { StyleSheet, View, Text, Image } from "react-native";

function DishView({ dish }) {
        return (
        <View style={styles.root}>
            <Text>{dish.name}</Text>
            <Text>{dish.cuisine_id}</Text>
            <Text>{dish.description}</Text>
            <Image
                source={{ uri: dish.image }}
                style={styles.image}
                resizeMode="contain" // Or "cover", "stretch", etc. as needed
            />
        </View>
    );
}

export default DishView;

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "50%",
        height: "50%",
    },
});
