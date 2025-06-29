import {GlobalConfig} from "./type";

export const globalConfig: GlobalConfig = {
    interactiveMapModeEnabled: true,
    interactiveMapModeForMobileEnabled: true,
    isMobileDevice: document.documentElement.classList.contains("mobile"),

    interactiveMapContainer: document.querySelector(".value--map"),
    staticMap: document.querySelector(".value--image"),

    cardSide: document.currentScript.dataset.cardSide,
    questionCardSideName: "question",
    answerCardSideName: "answer",

    colors: {
        defaultRegion: "#fdfbe5",
        hoveredRegion: "#f7f4c5",
        selectedRegion: "#f7f4c5",
        border: "#757674"
    },

    selectedRegionSessionKey: "selectedRegion",
    autoAnswerEnabled: true,

    hiddenTextarea: document.querySelector("textarea#typeans")
}