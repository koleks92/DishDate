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

    // DishesList sizes
    dishesListTitleSize: scrH * 0.03,
    dishesListDescriptionSize: scrH * 0.025,
    dishesListMargin: scrH * 0.03,

    // CustomSlider sizes
    sliderWidth: scrW * 0.6,
    sliderHeight: scrH * 0.04,
    railHeight: scrH * 0.03,
    tickHeight: scrH * 0.06,
    tickWidth: scrW * 0.08,
    tickTextSize: scrH * 0.025,

    // GameScreen sizes
    gameIdTextSize: scrH * 0.04,
    gameIdTextNumberSize: scrH * 0.05,
    gameIdTextMargin: scrH * 0.02,

    // DishView sizes
    dishViewHeight: scrH * 0.7,
    dishViewWidth: scrW * 0.8,
    dishViewPadding: scrH * 0.02,
    dishNameTextSize: scrH * 0.04,
    dishCuisineTextSize: scrH * 0.03,
    dishDescriptionTextSize: scrH * 0.02,
    dishViewTextMarginBottom: scrH * 0.02,
}