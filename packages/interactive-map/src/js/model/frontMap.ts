import worldMap from "../world.json";
import {swapToBackSide} from "../util";
import BaseMap from "./baseMap";

export default class FrontMap extends BaseMap {
    private isPanning: boolean = false;

    protected initSvgElement() {
        const mapSvgElement = this.mapSvgElement;
        mapSvgElement.setAttribute("id", "svgMap");
        mapSvgElement.setAttribute("style", "background-color: #b3dff5;");
        mapSvgElement.setAttribute("width", worldMap.width.toString());
        mapSvgElement.setAttribute("height", worldMap.height.toString());
        mapSvgElement.addEventListener("mousedown", () => this.isPanning = false)
        mapSvgElement.addEventListener("mousemove", () => this.isPanning = true)

        this.mapContainer.append(mapSvgElement);
    }

    protected setupRegionPaths() {
        for (const regionCode in worldMap.paths) {
            let path = document.createElementNS('http://www.w3.org/2000/svg', "path");
            path.setAttribute("fill", "#fdfbe5");
            path.setAttribute("stroke", "#757674");
            path.setAttribute("stroke-width", "1");
            path.setAttribute("d", worldMap.paths[regionCode].path);
            path.setAttribute("vector-effect", "non-scaling-stroke");

            // setup hover events
            path.addEventListener("mouseover", () => {
                path.setAttribute("fill", "#e7f3ea");
                path.setAttribute("cursor", "pointer");
            })
            path.addEventListener("mouseout", () => {
                path.setAttribute("fill", "#fdfbe5");
                path.setAttribute("cursor", "default");
            })

            // setup click events
            path.addEventListener("click", () => {
                if (this.isPanning) return;
                path.setAttribute("fill", "#ff0000");
                swapToBackSide(regionCode);
            })

            this.mapSvgElement.append(path);
        }
    }
}