import {GlobalConfig} from "./type";

export const globalConfig: GlobalConfig = {
    interactiveMapModeEnabled: true,
    interactiveMapModeForMobileEnabled: true,
    isMobileDevice: document.documentElement.classList.contains("mobile"),

    interactiveMapContainerRetrievalFunc: () => document.querySelector(".value--map"),
    staticMapRetrievalFunc: () => document.querySelector(".value--image"),

    cardSide: document.currentScript.dataset.cardSide,
    questionCardSideName: "question",
    answerCardSideName: "answer",

    colors: {
        defaultRegion: "#fdfbe5",
        hoveredRegion: "#f7f4c5",
        selectedRegion: "#f7f4c5",
        incorrectRegion: "#a232e3",
        correctRegion: "#c12838",
        background: "#b3dff5",
        border: "#757674"
    },

    selectedRegionSessionKey: "selectedRegion",
    autoAnswerEnabled: true,

    hiddenTextarea: document.querySelector("textarea#typeans")
}