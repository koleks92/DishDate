import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import Sizes from "../constants/Sizes";
import Colors from "../constants/Colors";

function CustomSelect({
    data,
    placeholder,
    multichoice,
    onSelect,
    selected,
    maxSelect,
}) {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(multichoice ? [] : null);

    useEffect(() => {
        if (selected) {
            if (multichoice) {
                setSelectedItem([...selected]);
            } else {
                setSelectedItem(selected);
            }
        }
    }, [selected]);

    const handleSelect = (item) => {
        if (multichoice) {
            if (maxSelect && selectedItem.length >= maxSelect) {
                const isSelected = selectedItem.some(
                    (selected) => selected.id === item.id
                );
                if (isSelected) {
                    updated = selectedItem.filter(
                        (selected) => selected.id !== item.id
                    );
                } else {
                    return;
                }
            }
            let updated;
            const isSelected = selectedItem.some(
                (selected) => selected.id === item.id
            );
            if (isSelected) {
                updated = selectedItem.filter(
                    (selected) => selected.id !== item.id
                );
            } else {
                updated = [...selectedItem, item];
            }
            setSelectedItem(updated);
            onSelect?.(updated.length === 0 ? null : updated);
        } else {
            setSelectedItem(item);
            onSelect?.(item);
            setOpen(false);
        }
    };

    const itemToRender = (item) => {
        const isSelected = multichoice
            ? selectedItem.some((selected) => selected.id === item.id)
            : selectedItem?.id === item.id;

        return (
            <Pressable
                style={[styles.item, isSelected && styles.selectedItem]}
                onPress={() => handleSelect(item)}
            >
                <Text style={styles.itemText}>{item.name}</Text>
            </Pressable>
        );
    };

    return (
        <View style={styles.root}>
            <View style={styles.shadow}>
                <Pressable style={styles.button} onPress={() => setOpen(!open)}>
                    <Text style={styles.placeholderText}>
                        {multichoice
                            ? selectedItem.length > 0
                                ? selectedItem
                                      .map((item) => item.name)
                                      .join(", ")
                                : placeholder
                            : selectedItem?.name || placeholder}
                    </Text>
                </Pressable>
            </View>
            <View>
                {open && (
                    <ScrollView
                        contentContainerStyle={styles.content}
                        style={styles.dropdown}
                    >
                        {data.map((item) => (
                            <View key={item.id}>{itemToRender(item)}</View>
                        ))}
                    </ScrollView>
                )}
            </View>
        </View>
    );
}

export default CustomSelect;

const styles = StyleSheet.create({
    root: {
        marginBottom: Sizes.buttonMarginBottom,
        zIndex: 10,
    },
    shadow: {
        width: Sizes.buttonWidth,
        height: Sizes.buttonHeight,
        backgroundColor: Colors.black,
        transform: [
            { translateX: 6 }, // Move horizontally
            { translateY: 6 }, // Move vertically
        ],
    },
    button: {
        width: Sizes.buttonWidth,
        height: Sizes.buttonHeight,
        backgroundColor: Colors.white,
        borderColor: Colors.black,
        borderWidth: 3,
        transform: [
            { translateX: -6 }, // Move horizontally
            { translateY: -6 }, // Move vertically
        ],
        justifyContent: "center",
        alignItems: "center",
    },

    dropdown: {
        position: "absolute",
        top: Sizes.buttonHeight * 0.1, // small gap below button
        maxHeight: Sizes.buttonHeight * 4,
        width: Sizes.buttonWidth,
    },

    content: {
        justifyContent: "center",
        alignItems: "center",
    },

    item: {
        width: Sizes.buttonWidth * 0.9,
        height: Sizes.buttonHeight * 0.9,
        backgroundColor: Colors.white,
        borderColor: Colors.black,
        borderWidth: 0,
        justifyContent: "center",
        alignItems: "center",
    },

    selectedItem: {
        borderWidth: 3,
    },

    placeholderText: {
        fontSize: Sizes.inputTextSize,
        color: Colors.black,
        textAlign: "center",
        fontFamily: "Tektur-Bold",
    },
    itemText: {
        fontSize: Sizes.inputTextSize,
        color: Colors.black,
        textAlign: "center",
        fontFamily: "Tektur-Bold",
    },
});
