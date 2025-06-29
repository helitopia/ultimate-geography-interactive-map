import BaseMap from "./baseMap";
import {commonColors, commonConfig} from "../config";
import Region from "./region";

export default class BackMap extends BaseMap {
    protected initSvgElement(): void {
        super.initSvgElement();
        this.setUpDef();
    }

    private setUpDef(){
        const defs = document.createElementNS('http://www.w3.org/2000/svg', "defs");

        // Zigzag pattern
        const pattern2 = document.createElementNS('http://www.w3.org/2000/svg', "pattern");
        pattern2.setAttribute("id", "zigzag-pattern");
        pattern2.setAttribute("x", "0");
        pattern2.setAttribute("y", "0");
        pattern2.setAttribute("width", "16");
        pattern2.setAttribute("height", "10");
        pattern2.setAttribute("patternUnits", "userSpaceOnUse");

        const rect2 = document.createElementNS('http://www.w3.org/2000/svg', "rect");
        rect2.setAttribute("width", "20");
        rect2.setAttribute("height", "10");
        rect2.setAttribute("fill", commonColors.region);

        const path2 = document.createElementNS('http://www.w3.org/2000/svg', "path");
        path2.setAttribute("d", "M0 8 L8 2 L16 8");
        path2.setAttribute("stroke", "#a232e3");
        path2.setAttribute("stroke-width", "1");
        path2.setAttribute("vector-effect", "non-scaling-stroke");
        path2.setAttribute("fill", "none");

        pattern2.appendChild(rect2);
        pattern2.appendChild(path2);

        // Append patterns to defs
        defs.appendChild(pattern2);

        this.mapSvgElement.appendChild(defs);
    }

    protected setUpRegion(regionCode: string) {
        return Region.of(this.mapConfig.paths[regionCode], this.resolveRegionColor(regionCode));
    }

    /**
     * Retrieve region highlighting color for answer card side
     * depending on the configuration and whether the selected
     * by the user question side region is correct
     */
    private resolveRegionColor(processingRegionCode: string): string {
        const selectedRegionCode = sessionStorage.getItem(commonConfig.selectedRegionSessionKey);
        const correctRegionCode = commonConfig.regionCode;

        if (processingRegionCode === selectedRegionCode || processingRegionCode === correctRegionCode) {
            if (selectedRegionCode === correctRegionCode){
                return commonColors.correctRegionHighlight;
            } else if (processingRegionCode === selectedRegionCode) {
                return "url(#zigzag-pattern)";
            } else if (processingRegionCode === correctRegionCode) {
                return commonColors.correctRegionHighlight;
            }
        } else return commonColors.region;
    }
}