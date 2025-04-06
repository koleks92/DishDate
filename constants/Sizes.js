import { Dimensions } from "react-native";

const scrH = Dimensions.get("screen").height;
const scrW = Dimensions.get("screen").width;

export const Sizes = {
    scrH: scrH,
    scrW: scrW,
    buttonInsidePadding: scrH * 0.015,
    buttonTextSize: scrH * 0.025,
    buttonWidth: scrW * 0.6,
    buttonHeight: scrW * 0.16,
    buttonMarginBottom: scrH * 0.015,
}