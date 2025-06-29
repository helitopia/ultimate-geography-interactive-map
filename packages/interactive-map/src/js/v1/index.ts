import "../../css/style.css"
import {InteractiveFrontMap, InteractiveBackMap} from "./model/interactiveMap";
import {commonConfig} from "./config";
import {resolveInteractiveEnabled, interactiveMapMode, cardSide, failInvalidRegionCode} from "./util";

if (resolveInteractiveEnabled()) {
    interactiveMapMode(true);
    try {
        if (cardSide(commonConfig.questionCardSideName))
            new InteractiveFrontMap();
        else if (cardSide(commonConfig.answerCardSideName)) {
            failInvalidRegionCode()
            new InteractiveBackMap();
        }
    } catch (e) {
        interactiveMapMode(false);
        throw e;
    }
}