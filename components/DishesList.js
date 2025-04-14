import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet, Image, Button } from "react-native";
import CustomImage from "./UI/ImageCustom";
import Sizes from "../constants/Sizes";
import Colors from "../constants/Colors";
import { DDContext } from "../store/ContextStore";
import ButtonMain from "./UI/ButtonMain";

const DishesList = ({ dishes, editButton, editButtonHandler }) => {
    const { cuisinesList } = useContext(DDContext);

    const getCuisineName = (cuisineId) => {
        const cuisine = cuisinesList.find((c) => c.id === cuisineId);
        return cuisine ? cuisine.name : "Unknown";
    }

    const editDish = (item) => {
        editButtonHandler(item);
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.cuisine}>{getCuisineName(item.cuisine_id)}</Text>
            {item.image === null ? (
                <CustomImage
                    empty={true}
                />
            ) : (
                <CustomImage
                    source={{ uri: item.image }}
                />
            )}
            {editButton && (
                <ButtonMain
                    text="Edit"
                    onPress={() => {
                        editDish(item);
                    }}
                />
            )}
        </View>
    );

    return (
        <View style={styles.root}>
            <FlatList
                contentContainerStyle={styles.container}
                data={dishes}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        width: "100%",
    },
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    item: {
        marginBottom: Sizes.dishesListMargin,
    },
    title: {
        fontFamily: "Tektur-Bold",
        fontSize: Sizes.dishesListTitleSize,
        color: Colors.black,
        textAlign: "center",
    },
    cuisine: {
        fontFamily: "Tektul-Regular",
        fontSize: Sizes.dishesListDescriptionSize,
        color: Colors.black,
        textAlign: "center",

    }
});

export default DishesList;
