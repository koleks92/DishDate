import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Sizes from "../../constants/Sizes";
import Colors from "../../constants/Colors";

function CustomSelect({
    data,
    placeholder,
    multichoice,
    onSelect,
    selected,
    maxSelect,
    isOpen,
    onToggle,
}) {
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
            onToggle(false);
        }
    };

    const itemToRender = (item) => {
        const isSelected = multichoice
            ? selectedItem.some((selected) => selected.id === item.id)
            : selectedItem?.id === item.id;

        return (
            <View>
                <Pressable
                    style={[styles.item, isSelected && styles.selectedItem]}
                    onPress={() => handleSelect(item)}
                >
                    <Text style={styles.itemText}>{item.name}</Text>
                </Pressable>
                <View style={styles.bottomLine} />
            </View>
        );
    };

    return (
        <View style={styles.root}>
            <View style={styles.shadow}>
                <Pressable
                    style={styles.button}
                    onPress={() => {
                        onToggle();
                    }}
                >
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
                {isOpen && (
                    <ScrollView
                        contentContainerStyle={styles.content}
                        style={styles.dropdown}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled={true}
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
        zIndex: 1,
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
        left: Sizes.buttonWidth * 0.05, // small gap to the left of button
        top: Sizes.buttonHeight * 0.1, // small gap below button
        maxHeight: Sizes.buttonHeight * 4,
        width: Sizes.buttonWidth * 0.9,
        borderWidth: 3,
    },
    content: {
        justifyContent: "center",
        alignItems: "center",
    },
    item: {
        width: Sizes.buttonWidth * 0.9,
        height: Sizes.buttonHeight * 0.9,
        backgroundColor: Colors.white,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    bottomLine: {
        bottom: 0,
        height: 2,
        width: "100%",
        backgroundColor: Colors.black,
    },
    selectedItem: {
        backgroundColor: Colors.backgroundButton,
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
