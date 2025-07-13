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
    defaultRegion: string;
    hoveredRegion: string;
    selectedRegion: string;
    correctRegion: string;
    incorrectRegion: string;
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
    commonColors: CommonColors;
}

export type MapConfig = {
    paths: RegionsConfig,
    height: number;
    width: number;
}

export type RegionsConfig = Record<string, RegionConfig>;

export type RegionConfig = {
    name: string;
    path: string;
}