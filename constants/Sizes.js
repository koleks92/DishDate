import { Dimensions } from "react-native";

const scrH = Dimensions.get("screen").height;
const scrW = Dimensions.get("screen").width;

export default Sizes = {
    scrH: scrH,
    scrW: scrW,
    buttonTextSize: scrH * 0.025,
    inputTextSize: scrH * 0.02,
    buttonLogoSize: scrH * 0.04,
    buttonWidth: scrW * 0.6,
    buttonHeight: scrW * 0.16,
    buttonMarginBottom: scrH * 0.015,
}