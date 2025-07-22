import {BaseRegion} from "./region";
import svgPanZoom from "svg-pan-zoom";
import {CommonPanZoomConfig} from "../type";
import {commonColors, commonConfig, commonElements} from "../config";

export abstract class SvgBaseMap {
    private static _isBeingPanned: boolean = false;
    protected readonly svgMapElement: SVGElement = this.createSvgInMapContainer();
    public panZoomInstance: SvgPanZoom.Instance;

    protected constructor(width: number, height: number) {
        this.setUpPanningEvents();
        this.setUpInitialAttributes(width, height);
    }

    public addRegion(region: BaseRegion): void {
        this.svgMapElement.append(region.svgPath);
    }

    public setUpPanZoomActions(panZoomConfig: CommonPanZoomConfig): void {
        this.panZoomInstance = svgPanZoom(this.svgMapElement, {...panZoomConfig})
    }

    private createSvgInMapContainer() {
        return commonElements.interactiveMapContainer.appendChild(
            document.createElementNS('http://www.w3.org/2000/svg', "svg")
        );
    }

    private setUpPanningEvents() {
        this.svgMapElement.addEventListener("mousedown", () => SvgBaseMap._isBeingPanned = false)
        this.svgMapElement.addEventListener("mousemove", () => SvgBaseMap._isBeingPanned = true)
    }

    private setUpInitialAttributes(width: number, height: number) {
        this.svgMapElement.setAttribute("id", commonConfig.interactiveMapSvgId);
        this.svgMapElement.setAttribute("style", `background-color: ${commonColors.background};`);
        this.svgMapElement.setAttribute("width", String(width));
        this.svgMapElement.setAttribute("height", String(height));
    }

    static get isBeingPanned(): boolean {
        return this._isBeingPanned;
    }
}

export class SvgFrontMap extends SvgBaseMap {
    constructor(width: number, height: number) {
        super(width, height);
    }
}

export class SvgBackMap extends SvgBaseMap {
    constructor(width: number, height: number) {
        super(width, height);
    }
}