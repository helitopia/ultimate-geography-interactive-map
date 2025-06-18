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
    interactiveMap: HTMLElement | null;
    staticMap: HTMLElement | null;
    hiddenTextarea: HTMLTextAreaElement | null;
};

export type ConfigObj = {
    commonConfig?: CommonConfig;
    commonColors?: CommonColors;
    commonElements?: CommonElements;
    commonMap?: object;
};