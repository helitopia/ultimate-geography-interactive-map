import {MapRegion, MapRegionV2, Region, RegionV2, WorldSchema, WorldSchemaV2} from "../type";
import {globalConfig} from "../config";
import svgPanZoom from "svg-pan-zoom";
import {swapToBackSide} from "../util";

export class InteractiveMap {
    private static _isBeingPanned: boolean = false;
    private readonly svgMapElement: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    private codeToRegion: Record<string, MapRegionV2> = {};

    constructor(worldMapConfig: WorldSchemaV2) {
        this.svgMapElement.setAttribute("width", String(worldMapConfig.width));
        this.svgMapElement.setAttribute("height", String(worldMapConfig.height));
        this.svgMapElement.classList.add("tappable");
        this.svgMapElement.setAttribute("style", `flex: auto; background-color: ${globalConfig.colors.background};`);
        // this.svgMapElement.addEventListener("mousedown", () => InteractiveMap._isBeingPanned = false)
        // this.svgMapElement.addEventListener("mousemove", () => InteractiveMap._isBeingPanned = true)

        let regions: Record<string, RegionV2> = worldMapConfig.regions;
        for (const regionCode in regions) {
            let region = regions[regionCode];

            let svgPath = document.createElementNS('http://www.w3.org/2000/svg', "path");
            svgPath.setAttribute("d", region.areas['medium-res'].areaSVG);

            let handlersEnabled = true;

            // svgPath.addEventListener("mouseover", () => {
            //     if (!handlersEnabled) return;
            //     svgPath.setAttribute("fill", globalConfig.colors.hoveredRegion);
            //     svgPath.setAttribute("cursor", "pointer");
            // });
            // svgPath.addEventListener("mouseout", () => {
            //     if (!handlersEnabled) return;
            //     svgPath.setAttribute("fill", globalConfig.colors.defaultRegion);
            //     svgPath.setAttribute("cursor", "default");
            // });
            // svgPath.addEventListener("click", () => {
            //     if (!handlersEnabled || InteractiveMap._isBeingPanned) return;
            //     svgPath.setAttribute("fill", globalConfig.colors.selectedRegion);
            //     svgPath.setAttribute("cursor", "default");
            //     swapToBackSide(regionCode);
            // });

            this.svgMapElement.append(svgPath);

            this.codeToRegion[regionCode] = {
                ...region,
                svg: svgPath,
                enableHandlers: () => handlersEnabled = true,
                disableHandlers: () => handlersEnabled = false
            }
        }
    }

    public render(cardSide: string) {
        globalConfig.interactiveMapContainerRetrievalFunc().appendChild(this.svgMapElement);
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

            region.enableHandlers();

            const svgPath = region.svg;
            svgPath.setAttribute("fill", globalConfig.colors.defaultRegion);
            svgPath.setAttribute("stroke", globalConfig.colors.border);
            svgPath.setAttribute("stroke-width", "1");
            svgPath.setAttribute("vector-effect", "non-scaling-stroke");
        }
    }

    private renderBackSide() {
        const selectedRegionCode = sessionStorage.getItem(globalConfig.selectedRegionSessionKey)
        const correctRegionCode = document.currentScript.dataset.regionCode

        // if requested region is China:
        //    both "CN" and "TW" selected codes are correct
        //    draw China in red and its disputed territories in dashed red (tint of red for now)

        // if requested region is Taiwan:
        //    only "TW" selected code is correct
        //    draw Taiwan in red


        this.codeToRegion[selectedRegionCode].svg.setAttribute("fill", globalConfig.colors.incorrectRegion);
        this.codeToRegion[correctRegionCode].svg.setAttribute("fill", globalConfig.colors.correctRegion);
        // this.codeToRegion[correctRegionCode].disputedRegions
        //     .forEach(
        //         disputedRegion => this.codeToRegion[disputedRegion.area.id].svg.setAttribute("fill", globalConfig.colors.correctRegion)
        //     )

        for (const regionCode in this.codeToRegion)
            this.codeToRegion[regionCode].disableHandlers();
    }
}