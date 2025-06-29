import {globalConfig} from "./config";
import {_typeAnsPress, AnkiDroidJS, showAnswer} from "./type";

export function isInteractiveMapModeAllowed() {
    return globalConfig.interactiveMapModeEnabled &&
        (!globalConfig.isMobileDevice || globalConfig.interactiveMapModeForMobileEnabled)
}

/**
 * Either enable or disable interactive map mode based on passed boolean argument
 * Note that static fallback is specifically displayed by default in case the current script fails to be loaded
 */
export function setInteractiveMapMode(interactiveEnabled: boolean) {
    globalConfig.staticMapRetrievalFunc().style.display = interactiveEnabled ? "none" : "flex";
    globalConfig.interactiveMapContainerRetrievalFunc().style.display = interactiveEnabled ? "block" : "none";
}

/**
 * After the region on the front card side is selected, persist its region code and
 * swap the card to the back side if configuration allows doing so. The action is
 * achieved via sending "Enter" key event on a manually defined hidden text area
 */
export function swapToBackSide(selectedRegionCode: string) {
    sessionStorage.setItem(globalConfig.selectedRegionSessionKey, selectedRegionCode);

    if (!globalConfig.autoAnswerEnabled)
        return

    globalConfig.hiddenTextarea.onkeypress ??= () => _typeAnsPress();

    if (typeof AnkiDroidJS !== "undefined")
        showAnswer();
    else
        dispatchEnterEvent()
}

/**
 * Trigger an "Enter" key press event. Note that Anki < 24.06
 * uses `code` property and Anki >= 24.06 - `key` property
 * to query pressed key, so both properties must be present
 */
function dispatchEnterEvent() {
    let artificialEvent = new KeyboardEvent("keypress", {code: "Enter", key: "Enter"});
    globalConfig.hiddenTextarea.dispatchEvent(artificialEvent);
}