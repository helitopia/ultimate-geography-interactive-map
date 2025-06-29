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

export type MapRegion = Region & {
    svg: SVGPathElement
    enableHandlers: () => void;
    disableHandlers: () => void;
};

export const AnkiDroidJS: any = (window as any).AnkiDroidJS;
export const _typeAnsPress: any = (window as any)._typeAnsPress;
export const showAnswer: any = (window as any).showAnswer;

// ================= TEMPORARY types (will be replaced with imported d.ts) =================
export interface WorldSchema {
    commonTerritories?: {
        [k: string]: string;
    };
    regions: {
        [k: string]: Region;
    };
    height: number;
    width: number;
}
export interface Region {
    regionName: string;
    area: string;
    disputedRegions?: [DisputedRegion, ...DisputedRegion[]];
}
export interface DisputedRegion {
    controlType: "CONTROLLED" | "CLAIMED";
    area: {
        referenceType?: "regionReference" | "territoryReference";
        id: string;
    };
}

// === Schema V2 ===
export interface WorldSchemaV2 {
    commonTerritories?: {
        [k: string]: string;
    };
    regions: {
        [k: string]: RegionV2;
    };
    height: number;
    width: number;
}
export interface RegionV2 {
    regionName: string;
    areas: {
        "high-res": { areaSVG: string}
    };
    disputedRegions?: [DisputedRegion, ...DisputedRegion[]];
}

export type MapRegionV2 = RegionV2 & {
    svg: SVGPathElement
    enableHandlers: () => void;
    disableHandlers: () => void;
};