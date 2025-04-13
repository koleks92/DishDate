import { Dimensions } from "react-native";

const scrH = Dimensions.get("screen").height;
const scrW = Dimensions.get("screen").width;

export default Sizes = {
    // Screen sizes
    scrH: scrH,
    scrW: scrW,

    // ButtonMain/ButtonLogo/InputField/Image sizes
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
    imageSize: scrW * 0.6,

    // ImageCustom sizes
    editImageTextSize: scrH * 0.03,

    // Modal sizes
    modalTitleSize: scrH * 0.03,
    modalTextSize: scrH * 0.025,
    modalTextMargin: scrH * 0.02,



}