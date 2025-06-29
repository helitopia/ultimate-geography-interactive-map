import "../css/style.css"
import FrontMap from "./model/frontMap";
import BackMap from "./model/backMap";
import {commonConfig} from "./config";
import {resolveInteractiveEnabled, interactiveMapMode, cardSide, failInvalidRegionCode} from "./util";

if (resolveInteractiveEnabled()) {
    interactiveMapMode(true);
    try {
        if (cardSide(commonConfig.questionCardSideName))
            new FrontMap().init();
        else if (cardSide(commonConfig.answerCardSideName)) {
            failInvalidRegionCode()
            new BackMap().init();
        }
    } catch (e) {
        interactiveMapMode(false);
        throw e;
    }
}