import worldMap from "./world.json";
import {commonElements, commonConfig, commonColors} from "./config";

declare const AnkiDroidJS: any;

declare function _typeAnsPress(): void;

declare function showAnswer(): void;


/**
 * @returns {boolean} true when a device is not mobile, false otherwise
 */
function nonMobile(): boolean {
    return !commonConfig.isMobile
}

/**
 * @returns {boolean} true if and only if the device is mobile
 * and the interactive model is enabled
 */
function interactiveMobileEnabled(): boolean {
    return commonConfig.isMobile && commonConfig.interactiveMobileEnabled;
}

/**
 * Trigger an "Enter" key press event. Note that Anki < 24.06
 * uses `code` property and Anki >= 24.06 - `key` property
 * to query pressed key, so both properties must be present
 */
function dispatchEnterEvent() {
    let artificialEvent = new KeyboardEvent("keypress", {code: "Enter", key: "Enter"});
    commonElements.hiddenTextarea.dispatchEvent(artificialEvent);
}

/**
 * Using configuration options to determine whether to display the interactive model
 */
export function resolveInteractiveEnabled() {
    return commonConfig.interactiveEnabled && (nonMobile() || interactiveMobileEnabled())
}

/**
 * Set interactive display model mode based on passed boolean argument
 * Note that static fallback is specifically displayed by default in case the current script fails to be loaded
 */
export function interactiveMapMode(enabled: boolean) {
    commonElements.staticMap.style.display = enabled ? "none" : "block";
    commonElements.interactiveMapContainer.style.display = enabled ? "block" : "none";
}

/**
 * Determine card side using predefined names from the configuration.
 * Note that the current card side is figured out via accessing the value of
 * data attribute of the &lt;script&gt; element invoking the program
 */
export function cardSide(cardSideName: string) {
    return commonConfig.cardSide === cardSideName;
}

/**
 * Throw an error if region code specified in the card field is absent in the model object to indicate
 * the reason of static model display and to automatically undo enabled interactive model mode
 */
export function failInvalidRegionCode() {
    if (!worldMap.paths[commonConfig.regionCode])
        throw Error(`Region code "${commonConfig.regionCode ?? "empty"}" does not exist in the map`);
}

/**
 * After the region on the front card side is selected, persist its region code and
 * swap the card to the back side if configuration allows doing so. The action is
 * achieved via sending "Enter" key event on a manually defined hidden text area
 */
export function swapToBackSide(selectedRegionCode: string) {
    sessionStorage.setItem(commonConfig.selectedRegionSessionKey, selectedRegionCode);

    if (!commonConfig.autoAnswerEnabled)
        return

    commonElements.hiddenTextarea.onkeypress ??= () => _typeAnsPress();

    if (typeof AnkiDroidJS !== "undefined")
        showAnswer();
    else
        dispatchEnterEvent()
}

/**
 * Assemble the object from properties of an original object
 * with values that match the predicate
 */
export function filterObj(obj: object, predicate: (val: any) => boolean, mapper?: (val: any) => any) {
    let filtered = {};
    for (let [key, value] of Object.entries(obj))
        if (predicate(value))
            filtered[key] = mapper ? mapper(value) : value;
    return filtered;
}

/**
 * Assemble the object with valid boolean property values
 * ignoring invalid and non-boolean properties
 */
export function filterObjValidBooleans(obj: object) {
    let toLower = (v: string) => v.toLowerCase()
    return filterObj(
        obj,
        v => ["true", "false"].some(x => toLower(v) === x),
        v => toLower(v) === "true");
}

/**
 * Assemble the object with valid HEX string property values
 * ignoring invalid and non-HEX properties
 */
export function filterObjValidColors(obj: object) {
    return filterObj(
        obj,
        v => v.toString().match(/^#(?:[0-9a-fA-F]{3}){1,2}$/g)
    );
}