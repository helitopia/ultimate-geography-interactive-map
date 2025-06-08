import {getMapConfig} from "./config";
import "jsvectormap/dist/jsvectormap.min.js"
import "jsvectormap/dist/jsvectormap.min.css"
import "./style.css"
import worldMap from "./world.json"

const mapConfig = getMapConfig();
const commonConfig = mapConfig.commonConfig;
const commonColors = mapConfig.commonColors;
const commonElements = mapConfig.commonElements;
const commonMap = mapConfig.commonMap;

clearTooltips();

if (resolveInteractiveEnabled()) {
    interactiveMapMode(true);
    jsVectorMap.addMap(commonMap.map, worldMap);
    try {
        if (cardSide(commonConfig.questionCardSideName))
            initFrontMap();
        else if (cardSide(commonConfig.answerCardSideName)) {
            failInvalidRegionCode()
            initBackMap();
        }
    } catch (e) {
        interactiveMapMode(false);
        throw e;
    }
}


/**
 * Using configuration options to determine whether to display interactive map
 */
function resolveInteractiveEnabled() {
    return commonConfig.interactiveEnabled && (nonMobile() || interactiveMobileEnabled())
}

/**
 * @returns {boolean} true when device is not mobile, false otherwise
 */
function nonMobile() {
    return !commonConfig.isMobile
}

/**
 * @returns {boolean} true if and only if the device is mobile
 * and interactive map is enabled
 */
function interactiveMobileEnabled() {
    return commonConfig.isMobile && commonConfig.interactiveMobileEnabled;
}

/**
 * Set interactive display map mode based on passed boolean argument
 * Note, that static fallback is specifically displayed by default in case current script fails to be loaded
 */
function interactiveMapMode(enabled) {
    commonElements.staticMap.style.display = enabled ? "none" : "block";
    commonElements.interactiveMap.style.display = enabled ? "block" : "none";
}

/**
 * Determine card side using predefined names from configuration.
 * Note that current card side is figured out via accessing the value of
 * data attribute of the &lt;script&gt; element invoking the program
 */
function cardSide(cardSideName) {
    return commonConfig.cardSide === cardSideName;
}

/**
 * Throw an error if region code specified in the card field is absent in the map object to indicate
 * the reason of static map display and to automatically undo enabled interactive map mode
 */
function failInvalidRegionCode() {
    if (!worldMap.paths[commonConfig.regionCode])
        throw Error(`Region code "${commonConfig.regionCode || "empty"}" does not exist in the map`);
}

/**
 * Initialization of the map displayed on the front side of the card
 */
function initFrontMap() {
    new jsVectorMap({
        ...commonMap,
        regionsSelectable: true,
        regionsSelectableOne: true,

        regionStyle: {
            ...commonMap.regionStyle,
            selected: {fill: commonColors.selectedRegion}
        },

        onRegionSelected: swapToBackSide,

        showTooltip: false
    });
}

/**
 * Initialization of the map displayed on the back side of the card
 */
function initBackMap() {
    new jsVectorMap({
        ...commonMap,
        selectedRegions: [commonConfig.regionCode],

        regionStyle: {
            ...commonMap.regionStyle,
            selected: {fill: getRegionColor()}
        },
        focusOn: {
            region: commonConfig.regionCode,
            animate: true
        },

        showTooltip: commonConfig.toolTipEnabled,
        onRegionTooltipShow: setUpTooltipColors
    });
}

/**
 * Jsvectormap logic incompatibility with project specifics - tooltips are inserted
 * as direct children of &lt;body&gt; element and get persisted during cards review session
 * accumulating and littering the canvas. Current handling is temporary fix until library issue is resolved
 */
function clearTooltips() {
    commonElements.mapTooltips.forEach(x => x.remove());
}

/**
 * After region on the front card side is selected persist its region code and
 * swap the card to back side if configuration allows to do so. The action is
 * achieved via sending "Enter" key event on manually defined hidden text area
 */
function swapToBackSide(selectedRegionCode) {
    sessionStorage.setItem(commonConfig.selectedRegionSessionKey, selectedRegionCode);

    if (!commonConfig.autoAnswerEnabled)
        return

    if (!commonElements.hiddenTextarea.onkeypress)
        commonElements.hiddenTextarea.onkeypress = () => _typeAnsPress();

    if (typeof AnkiDroidJS !== "undefined") {
        showAnswer();
    } else {
        dispatchEnterEvent()
    }
}

/**
 * Trigger "Enter" key press event. Note that Anki < 24.06
 * uses `code` property and Anki >= 24.06 - `key` property
 * to query pressed key, so both properties must be present
 */
function dispatchEnterEvent() {
    let artificialEvent = new KeyboardEvent("keypress", {code: "Enter", key: "Enter"});
    commonElements.hiddenTextarea.dispatchEvent(artificialEvent);
}

/**
 * Retrieve region highlighting color for answer card side
 * depending on the configuration and whether the selected
 * by the user on question side region is correct
 */
function getRegionColor() {
    return commonConfig.regionCode === sessionStorage.getItem(commonConfig.selectedRegionSessionKey)
        ? commonColors.correctRegionHighlight
        : commonColors.incorrectRegionHighlight;
}

/**
 * Set up of the colors of the tooltip shown on the back side of the card
 */
function setUpTooltipColors(event, tooltip) {
    tooltip._tooltip.style.backgroundColor = commonColors.tooltipBackground;
    tooltip._tooltip.style.color = commonColors.tooltipText;
}