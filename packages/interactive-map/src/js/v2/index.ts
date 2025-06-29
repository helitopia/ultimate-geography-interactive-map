import { InteractiveMap } from "./model/interactiveMap";
import {isInteractiveMapModeAllowed, setInteractiveMapMode} from "./util";
import {globalConfig} from "./config";
import worldMap from "./world.json";

if (isInteractiveMapModeAllowed()) {
    setInteractiveMapMode(true);
    try {
        (window.interactiveMap ||= new InteractiveMap(worldMap)).render(globalConfig.cardSide);
    } catch (e) {
        setInteractiveMapMode(false);
        throw e;
    }
}