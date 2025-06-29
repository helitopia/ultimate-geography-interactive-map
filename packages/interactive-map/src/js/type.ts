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
    hoveredRegion: string;
    selectedRegion: string;
    correctRegionHighlight: string;
    incorrectRegionHighlight: string;
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

export type MapConfig = {
    paths: RegionsConfig,
    height: number;
    width: number;
}

export type RegionsConfig = Record<string, RegionConfig>;

export type RegionConfig = {
    path: string;
    name: string;
}