import {CommonColors, CommonConfig, CommonElements, CommonPanZoomConfig, UserConfig} from "./type";
import {filterObjValidBooleans, filterObjValidColors} from "./util";

let userConfig: UserConfig = JSON.parse(sessionStorage.getItem("userConfig"));

export const commonConfig: CommonConfig = {
    interactiveEnabled: true,
    interactiveMobileEnabled: true,
    autoAnswerEnabled: true,
    ...filterObjValidBooleans(userConfig.commonFeatures),

    isMobile: document.documentElement.classList.contains("mobile"),
    regionCode: document.currentScript.dataset.regionCode,
    cardSide: document.currentScript.dataset.cardSide,
    questionCardSideName: "question",
    answerCardSideName: "answer",
    selectedRegionSessionKey: "selectedRegion",
    interactiveMapSvgId: "svgMap"
}

export const commonColors: CommonColors = {
    region: "#fdfbe5",
    selectedRegion: "#e7f3ea",
    incorrectRegionHighlight: "#c02637",
    correctRegionHighlight: "#329446",
    background: "#b3dff5",
    border: "#757674",
    ...filterObjValidColors(userConfig.commonColors)
};

export const commonElements: CommonElements = {
    interactiveMapContainer: document.querySelector(".value--map"),
    staticMap: document.querySelector(".value--image"),
    hiddenTextarea: document.querySelector("textarea#typeans")
};

export const commonPanZoomConfig: CommonPanZoomConfig = {
    zoomScaleSensitivity: 0.5,
    maxZoom: 10000,
};