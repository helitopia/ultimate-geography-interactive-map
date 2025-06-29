import '../css/style.css'
import { InteractiveMap } from "./model/interactiveMap";
import {isInteractiveMapModeAllowed, setInteractiveMapMode} from "./util";
import {globalConfig} from "./config";
import worldMap from "./world-prod.json";

if (isInteractiveMapModeAllowed()) {
    setInteractiveMapMode(true);
    try {
        // @ts-ignore
        (window.interactiveMap ||= new InteractiveMap(worldMap)).render(globalConfig.cardSide);
    } catch (e) {
        setInteractiveMapMode(false);
        throw e;
    }
}