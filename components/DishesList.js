import React from "react";
import { View, Text, FlatList, StyleSheet, Image, Button } from "react-native";

const DishesList = ({ dishes, editButton, editButtonHandler }) => {
    const editDish = (item) => {
        editButtonHandler(item);
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.title}>{item.description}</Text>
            <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="contain"
            />
            {editButton && (
                <Button
                    title="Edit"
                    style={styles.button}
                    onPress={() => {
                        editDish(item);
                    }}
                />
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={dishes}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
    },
    item: {
        flex: 1,
        padding: 10,
        fontSize: 18,
        margin: 20,
        width: 200,
    },
    title: {
        fontSize: 18,
    },
    image: {
        width: 200, // Set a fixed width
        height: 150, // Set a fixed height
        borderRadius: 10, // Optional: round the corners
    },
});

export default DishesList;
