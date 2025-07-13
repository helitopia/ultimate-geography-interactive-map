import {commonPanZoomConfig} from "../config";
import {BackRegionFactory, BaseRegion, FrontRegion} from "./region";
import worldMap from "../world.json";
import {MapConfig} from "../type";
import {SvgBackMap, SvgBaseMap, SvgFrontMap} from "./svgMap";

export abstract class InteractiveBaseMap {
    protected readonly mapConfig: MapConfig = worldMap;
    protected svgMap: SvgBaseMap;

    protected constructor(SvgMapClass: new (width: number, height: number) => SvgBaseMap) {
        this.svgMap = new SvgMapClass(this.mapConfig.width, this.mapConfig.height);
        this.setUpRegions();
        this.svgMap.setUpPanZoomActions(commonPanZoomConfig);
    }

    protected setUpRegions(): void {
        for (const regionCode in this.mapConfig.paths)
            this.svgMap.addRegion(this.setUpRegion(regionCode));
    }

    protected abstract setUpRegion(regionCode: string): BaseRegion;
}

export class InteractiveFrontMap extends InteractiveBaseMap {
    constructor() {
        super(SvgFrontMap);
    }

    protected setUpRegion(regionCode: string): BaseRegion {
        return new FrontRegion(regionCode, this.mapConfig.paths[regionCode]);
    }
}

export class InteractiveBackMap extends InteractiveBaseMap {
    constructor() {
        super(SvgBackMap);
    }

    protected setUpRegion(regionCode: string) {
        return BackRegionFactory.create(regionCode, this.mapConfig.paths[regionCode]);
    }
}