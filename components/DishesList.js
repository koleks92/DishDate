import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet, Pressable} from "react-native";
import ImageCustom from "./UI/ImageCustom";
import Sizes from "../constants/Sizes";
import Colors from "../constants/Colors";
import { DDContext } from "../store/ContextStore";
import ButtonMain from "./UI/ButtonMain";
import { useNavigation } from "@react-navigation/native";


const DishesList = ({ dishes, editButton, editButtonHandler }) => {
    const { cuisinesList } = useContext(DDContext);

    const navigation = useNavigation();

    const getCuisineName = (cuisineId) => {
        const cuisine = cuisinesList.find((c) => c.id === cuisineId);
        return cuisine ? cuisine.name : "Unknown";
    }

    const editDish = (item) => {
        editButtonHandler(item);
    };

    const renderItem = ({ item }) => (
        <Pressable style={styles.item} onPress={() => {navigation.navigate('DishScreen', {
            dish: item
        })}}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.cuisine}>{getCuisineName(item.cuisine_id)}</Text>
            {item.image === null ? (
                <ImageCustom
                    empty={true}
                />
            ) : (
                <ImageCustom
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
        </Pressable>
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
        alignItems: "center",
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
