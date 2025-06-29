import {commonColors, commonConfig, commonElements, commonPanZoomConfig} from "../config";
import svgPanZoom from "svg-pan-zoom";
import Region from "./region";
import worldMap from "../world.json";
import {MapConfig} from "../type";

export default class BaseMap {
    protected readonly mapContainer: Element = commonElements.interactiveMapContainer;
    protected readonly mapSvgElement: Element = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    protected readonly mapConfig: MapConfig = worldMap;
    protected readonly regions: Region[] = [];

    public init(): void {
        this.initSvgElement();
        this.setUpRegions();
        this.setUpPanZoomActions();
    }

    protected initSvgElement(): void {
        const mapSvgElement = this.mapSvgElement;
        mapSvgElement.setAttribute("id", commonConfig.interactiveMapSvgId);
        mapSvgElement.setAttribute("style", `background-color: ${commonColors.background};`);
        mapSvgElement.setAttribute("width", this.mapConfig.width.toString());
        mapSvgElement.setAttribute("height", this.mapConfig.height.toString());
        this.mapContainer.append(mapSvgElement);
    }

    protected setUpRegions(): void {
        for (const regionCode in this.mapConfig.paths)
            this.regions.push(this.setUpRegion(regionCode));

        this.mapSvgElement.append(...this.regions.map(region => region.svgPath));
    }

    protected setUpRegion(regionCode: string): Region {
        throw new Error("Not implemented");
    }

    protected setUpPanZoomActions(): void {
        svgPanZoom(`#${commonConfig.interactiveMapSvgId}`, {...commonPanZoomConfig})
    }
}