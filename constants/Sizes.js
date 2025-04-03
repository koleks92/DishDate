import { Dimensions } from "react-native";

const scrH = Dimensions.get("screen").height;
const scrW = Dimensions.get("screen").width;

export const Sizes = {
    scrH: scrH,
    scrW: scrW,
    buttonInsidePadding: scrH * 0.015,
    
}