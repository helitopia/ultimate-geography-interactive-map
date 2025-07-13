import {RegionConfig} from "../type";
import {commonColors, commonConfig} from "../config";
import {swapToBackSide} from "../util";
import {SvgBaseMap} from "./svgMap";

export abstract class BaseRegion {
    protected regionCode: string;
    protected readonly _svgPath: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', "path");

    protected constructor(regionCode: string, regionConfig: RegionConfig) {
        this.regionCode = regionCode;

        this._svgPath.setAttribute("d", regionConfig.path);
        this._svgPath.setAttribute("stroke", commonColors.border);
        this._svgPath.setAttribute("stroke-width", "1");
        this._svgPath.setAttribute("vector-effect", "non-scaling-stroke");
    }

    protected setFillColor(fillHex: string): void {
        this._svgPath.setAttribute("fill", fillHex);
    }

    get svgPath(): SVGElement {
        return this._svgPath;
    }
}

export class FrontRegion extends BaseRegion {
    constructor(regionCode: string, regionConfig: RegionConfig) {
        super(regionCode, regionConfig);
        this.setFillColor(commonColors.defaultRegion);
        this.enableHover();
        this.enableClickEvent()
    }

    private enableHover(): void {
        this.svgPath.addEventListener("mouseover", () => {
            this.svgPath.setAttribute("fill", commonColors.hoveredRegion);
            this.svgPath.setAttribute("cursor", "pointer");
        });
        this.svgPath.addEventListener("mouseout", () => {
            this.svgPath.setAttribute("fill", commonColors.defaultRegion);
            this.svgPath.setAttribute("cursor", "default");
        });
    }

    private enableClickEvent(): void {
        this.svgPath.addEventListener("click", () => {
            if (SvgBaseMap.isBeingPanned) return;
            this.svgPath.setAttribute("fill", commonColors.selectedRegion);
            swapToBackSide(this.regionCode);
        });
    }
}

export abstract class BackRegion extends BaseRegion {
    protected constructor(regionCode: string, regionConfig: RegionConfig) {
        super(regionCode, regionConfig);
    }
}

export class RegularBackRegion extends BackRegion {
    constructor(regionCode: string, regionConfig: RegionConfig) {
        super(regionCode, regionConfig);
        this.setFillColor(commonColors.defaultRegion);
    }
}

export class IncorrectBackRegion extends BackRegion {


    constructor(regionCode: string, regionConfig: RegionConfig) {
        super(regionCode, regionConfig);
        this.setFillColor("url(#zigzag-pattern)");
    }

    get svgPath(): SVGElement {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.appendChild(this.getDefs());
        group.appendChild(this._svgPath);
        return group;
    }

    private getDefs() {
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
        rect2.setAttribute("fill", commonColors.defaultRegion);

        pattern2.appendChild(rect2);


        const path2 = document.createElementNS('http://www.w3.org/2000/svg', "path");
        path2.setAttribute("d", "M0 8 L8 2 L16 8");
        path2.setAttribute("stroke", commonColors.incorrectRegion);
        path2.setAttribute("stroke-width", "1");
        path2.setAttribute("vector-effect", "non-scaling-stroke");
        path2.setAttribute("fill", "none");

        pattern2.appendChild(path2);

        // Append patterns to defs
        defs.appendChild(pattern2);

        return defs;
    }

}

export class CorrectBackRegion extends BackRegion {
    constructor(regionCode: string, regionConfig: RegionConfig) {
        super(regionCode, regionConfig);
        this.setFillColor(commonColors.correctRegion);
    }
}

export class BackRegionFactory {
    private static readonly selectedRegionCode: string = sessionStorage.getItem(commonConfig.selectedRegionSessionKey);
    private static readonly correctRegionCode: string = commonConfig.regionCode;

    private static isSelectedRegion(regionCode: string): boolean {
        return regionCode === this.selectedRegionCode;
    }

    private static isCorrectRegion(regionCode: string): boolean {
        return regionCode === this.correctRegionCode;
    }

    private static isSelectedRegionCorrect(): boolean {
        return this.selectedRegionCode === this.correctRegionCode;
    }

    static create(regionCode: string, regionConfig: RegionConfig): BackRegion {
        if (this.isSelectedRegion(regionCode) || this.isCorrectRegion(regionCode)) {
            if (this.isSelectedRegionCorrect()) {
                return new CorrectBackRegion(regionCode, regionConfig);
            } else {
                if (this.isSelectedRegion(regionCode)) {
                    return new IncorrectBackRegion(regionCode, regionConfig);
                } else if (this.isCorrectRegion(regionCode)) {
                    return new CorrectBackRegion(regionCode, regionConfig);
                }
            }
        } else return new RegularBackRegion(regionCode, regionConfig);
    }
}