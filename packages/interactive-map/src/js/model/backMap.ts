import BaseMap from "./baseMap";
import worldMap from "../world.json";
import {commonColors, commonConfig} from "../config";
import {getRegionColor} from "../util";

export default class BackMap extends BaseMap {
    protected initSvgElement(): void {
        const mapSvgElement = this.mapSvgElement;
        mapSvgElement.setAttribute("id", commonConfig.interactiveMapSvgId);
        mapSvgElement.setAttribute("style", "background-color: #b3dff5;");
        mapSvgElement.setAttribute("width", worldMap.width.toString());
        mapSvgElement.setAttribute("height", worldMap.height.toString());

        this.setUpDef();

        this.mapContainer.append(mapSvgElement);
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

    protected setupRegionPaths(): void {
        for (const regionCode in worldMap.paths) {
            let path = document.createElementNS('http://www.w3.org/2000/svg', "path");

            path.setAttribute("fill", regionCode === commonConfig.regionCode ? getRegionColor() : commonColors.region);
            path.setAttribute("stroke", "#757674");
            path.setAttribute("stroke-width", "1");
            path.setAttribute("d", worldMap.paths[regionCode].path);
            path.setAttribute("vector-effect", "non-scaling-stroke");

            this.mapSvgElement.append(path);
        }
    }
}