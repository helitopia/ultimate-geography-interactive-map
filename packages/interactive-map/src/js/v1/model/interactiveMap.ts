import {commonPanZoomConfig} from "../config";
import {BackRegionFactory, BaseRegion, FrontRegion, IncorrectBackRegion} from "./region";
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
    private incorrectBackRegion: IncorrectBackRegion;

    constructor() {
        super(SvgBackMap);
        this.svgMap.panZoomInstance.setOnZoom(this.incorrectBackRegion.onZoomHandler())
    }

    protected setUpRegion(regionCode: string) {
        let region = BackRegionFactory.create(regionCode, this.mapConfig.paths[regionCode]);
        if (region instanceof IncorrectBackRegion)
            this.incorrectBackRegion = region;
        window.incorrectBackRegion = this.incorrectBackRegion; // For debugging purposes
        return region;
    }
}

declare global {
    interface Window {
        incorrectBackRegion?: IncorrectBackRegion;
    }
}