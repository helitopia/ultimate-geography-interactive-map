import {swapToBackSide} from "../util";
import BaseMap from "./baseMap";
import Region from "./region";
import {commonColors} from "../config";

export default class FrontMap extends BaseMap {
    private isPanning: boolean = false;

    protected initSvgElement() {
        super.initSvgElement();
        this.mapSvgElement.addEventListener("mousedown", () => this.isPanning = false)
        this.mapSvgElement.addEventListener("mousemove", () => this.isPanning = true)
    }

    protected setUpRegion(regionCode: string): Region {
        let region = Region.of(this.mapConfig.paths[regionCode], commonColors.region);

        region.svgPath.addEventListener("mouseover", () => {
            region.svgPath.setAttribute("fill", commonColors.hoveredRegion);
            region.svgPath.setAttribute("cursor", "pointer");
        });
        region.svgPath.addEventListener("mouseout", () => {
            region.svgPath.setAttribute("fill", commonColors.region);
            region.svgPath.setAttribute("cursor", "default");
        });

        region.svgPath.addEventListener("click", () => {
            if (this.isPanning) return;
            region.svgPath.setAttribute("fill", commonColors.selectedRegion);
            swapToBackSide(regionCode);
        });

        return region;
    }
}