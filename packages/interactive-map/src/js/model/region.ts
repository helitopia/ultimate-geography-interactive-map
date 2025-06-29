import { RegionConfig } from "../type";
import {commonColors} from "../config";

export default class Region {
    public svgPath: SVGPathElement;

    public static of(regionConfig: RegionConfig, fillHex: string) {
        let region = new Region();
        region.svgPath = document.createElementNS('http://www.w3.org/2000/svg', "path");

        region.svgPath.setAttribute("fill", fillHex);
        region.svgPath.setAttribute("stroke", commonColors.border);
        region.svgPath.setAttribute("stroke-width", "1");
        region.svgPath.setAttribute("d", regionConfig.path);
        region.svgPath.setAttribute("vector-effect", "non-scaling-stroke");

        return region;
    }
}