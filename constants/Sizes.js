import { Dimensions } from "react-native";

const scrH = Dimensions.get("screen").height;
const scrW = Dimensions.get("screen").width;

export default Sizes = {
    // Screen sizes
    scrH: scrH,
    scrW: scrW,

    // ButtonMain/ButtonLogo/InputField sizes
    buttonTextSize: scrH * 0.025,
    buttonWidth: scrW * 0.6,
    buttonHeight: scrW * 0.16,
    buttonMarginBottom: scrH * 0.015,

    // ButtonLogo sizes
    buttonLogoSize: scrH * 0.04,

    // InputField sizes
    inputTextSize: scrH * 0.02,

    // Logo sizes
    logoSize: scrH * 0.4,
    logoContainerSize: scrH * 0.5,

    // StartScreen sizes
    profileContainerHeight: scrH * 0.05,

    // ProfileScreen sizes
    profileTextSize: scrH * 0.025,
    profileScreenMargin: scrH * 0.02,
    imageSize: scrH * 0.2,


}