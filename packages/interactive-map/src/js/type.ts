export type CommonConfig = {
    interactiveEnabled: boolean;
    interactiveMobileEnabled: boolean;
    autoAnswerEnabled: boolean;
    isMobile: boolean;
    regionCode: string;
    cardSide: string;
    questionCardSideName: string;
    answerCardSideName: string;
    selectedRegionSessionKey: string;
    interactiveMapSvgId: string;
};

export type CommonColors = {
    region: string;
    selectedRegion: string;
    incorrectRegionHighlight: string;
    correctRegionHighlight: string;
    background: string;
    border: string;
};

export type CommonElements = {
    interactiveMapContainer: HTMLElement;
    staticMap: HTMLElement;
    hiddenTextarea: HTMLTextAreaElement;
};

export type CommonPanZoomConfig = {
    zoomScaleSensitivity: number;
    maxZoom: number;
}

export type UserConfig = {
    commonFeatures: {
        interactiveEnabled: string;
        interactiveMobileEnabled: string;
        autoAnswerEnabled: string;
        toolTipEnabled: string;
    };
    commonColors: {
        region: string;
        selectedRegion: string;
        incorrectRegionHighlight: string;
        correctRegionHighlight: string;
        background: string;
        border: string;
    };
}