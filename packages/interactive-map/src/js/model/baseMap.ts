import {commonConfig, commonElements, commonPanZoomConfig} from "../config";
import svgPanZoom from "svg-pan-zoom";
import Region from "./region";

export default class BaseMap {
    protected readonly mapContainer: Element = commonElements.interactiveMapContainer;
    protected readonly mapSvgElement: Element = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    protected readonly regions: Region[] = [];

    public init(): void {
        this.initSvgElement();
        this.setupRegionPaths();
        svgPanZoom(`#${commonConfig.interactiveMapSvgId}`, {...commonPanZoomConfig})
    }

    protected initSvgElement(): void {
        throw new Error("Method 'initSvgElement' must be implemented.");
    }

    protected setupRegionPaths(): void {
        throw new Error("Method 'setupRegionPaths' must be implemented.");
    }
}