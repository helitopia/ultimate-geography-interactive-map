import {MapRegion, Region, WorldMapConfig} from "../type";
import {globalConfig} from "../config";
import svgPanZoom from "svg-pan-zoom";
import {swapToBackSide} from "../util";

export class InteractiveMap {
    private static _isBeingPanned: boolean = false;
    private readonly svgMapElement: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    private codeToRegion: Record<string, MapRegion> = {};

    // each region object -> reference to its SVG <path> element (svg region further)
    // all SVG regions are inside <svg> element
    // One collection: with region objects
    // When render front side is invoked:
    //     enable hover and click events via region objects
    //         in svg it is done by adding event listeners to each svg region
    // When render back side is invoked:
    //    disable hover and click events via region objects
    //    highlight selected and (or) correct regions

    constructor(worldMapConfig: WorldMapConfig) {
        this.svgMapElement.setAttribute("width", String(worldMapConfig.width));
        this.svgMapElement.setAttribute("height", String(worldMapConfig.height));
        this.svgMapElement.addEventListener("mousedown", () => InteractiveMap._isBeingPanned = false)
        this.svgMapElement.addEventListener("mousemove", () => InteractiveMap._isBeingPanned = true)

        let regions: Record<string, Region> = worldMapConfig.paths;
        for (const regionCode in regions) {
            let region = regions[regionCode];
            let svgPath = document.createElementNS('http://www.w3.org/2000/svg', "path");
            svgPath.setAttribute("d", region.path);
            this.svgMapElement.append(svgPath);
            this.codeToRegion[regionCode] = {...region, svg: svgPath}
        }
    }

    public render(cardSide: string) {
        // TODO perform cleanup before rendering

        globalConfig.interactiveMapContainer.appendChild(this.svgMapElement);
        svgPanZoom(this.svgMapElement, {
            zoomScaleSensitivity: 0.5,
            maxZoom: 10000,
        })

        if (cardSide === globalConfig.questionCardSideName)
            this.renderFrontSide();
        else if (cardSide === globalConfig.answerCardSideName)
            this.renderBackSide();
        else
            throw new Error(`Unknown card side: ${cardSide}`);
    }

    private renderFrontSide() {
        for (const regionCode in this.codeToRegion) {
            const region = this.codeToRegion[regionCode];

            const svgPath = region.svg;
            svgPath.setAttribute("fill", globalConfig.colors.defaultRegion);
            svgPath.setAttribute("stroke", globalConfig.colors.border);
            svgPath.setAttribute("stroke-width", "1");
            svgPath.setAttribute("vector-effect", "non-scaling-stroke");

            svgPath.addEventListener("mouseover", () => {
                svgPath.setAttribute("fill", globalConfig.colors.hoveredRegion);
                svgPath.setAttribute("cursor", "pointer");
            });
            addEventListener("mouseout", () => {
                svgPath.setAttribute("fill", globalConfig.colors.defaultRegion);
                svgPath.setAttribute("cursor", "default");
            });

            svgPath.addEventListener("click", () => {
                if (InteractiveMap._isBeingPanned) return;
                svgPath.setAttribute("fill", globalConfig.colors.selectedRegion);
                swapToBackSide(regionCode);
            });
        }
    }

    private renderBackSide() {
        for (const regionCode in this.codeToRegion) {
            const region = this.codeToRegion[regionCode];

            const svgPath = region.svg;
            // svgPath.setAttribute("fill", globalConfig.colors.defaultRegion);
            svgPath.setAttribute("fill", "#ffeb01");
            svgPath.setAttribute("stroke", globalConfig.colors.border);
            svgPath.setAttribute("stroke-width", "1");
            svgPath.setAttribute("vector-effect", "non-scaling-stroke");
        }
    }
}