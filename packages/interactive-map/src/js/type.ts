import {InteractiveMap} from "./model/interactiveMap";

declare global {
    interface Window {
        interactiveMap?: InteractiveMap;
    }
}

export type GlobalConfig = {
    interactiveMapModeEnabled: boolean;
    interactiveMapModeForMobileEnabled: boolean;

    isMobileDevice: boolean;

    interactiveMapContainerRetrievalFunc: () => HTMLElement;
    staticMapRetrievalFunc: () => HTMLElement;

    /**
     * Note that the current card side is figured out via accessing the value of
     * data attribute of the &lt;script&gt; element invoking the program
     */
    cardSide: string;
    questionCardSideName: string;
    answerCardSideName: string;

    colors: {
        defaultRegion: string;
        hoveredRegion: string;
        selectedRegion: string;
        incorrectRegion: string;
        correctRegion: string;
        background: string;
        border: string
    }

    selectedRegionSessionKey: string;
    autoAnswerEnabled: boolean;

    hiddenTextarea: HTMLTextAreaElement;

};

export type WorldMapConfig = {
    paths: Record<string, Region>;
    height: number;
    width: number;
}

export type Region = { path: string; name: string }
export type MapRegion = Region & {
    svg: SVGPathElement
    enableHandlers: () => void;
    disableHandlers: () => void;
};

export const AnkiDroidJS: any = (window as any).AnkiDroidJS;
export const _typeAnsPress: any = (window as any)._typeAnsPress;
export const showAnswer: any = (window as any).showAnswer;