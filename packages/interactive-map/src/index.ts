import {getMapConfig} from "./config";
import "./style.css"
import worldMap from "./world.json"
import svgPanZoom from 'svg-pan-zoom';

declare const AnkiDroidJS: any;
declare function _typeAnsPress(): void;
declare function showAnswer(): void;

const mapConfig = getMapConfig();
const commonConfig = mapConfig.commonConfig;
const commonColors = mapConfig.commonColors;
const commonElements = mapConfig.commonElements;
const commonMap = mapConfig.commonMap;

if (resolveInteractiveEnabled()) {
    interactiveMapMode(true);
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
function nonMobile(): boolean {
    return !commonConfig.isMobile
}

/**
 * @returns {boolean} true if and only if the device is mobile
 * and interactive map is enabled
 */
function interactiveMobileEnabled(): boolean {
    return commonConfig.isMobile && commonConfig.interactiveMobileEnabled;
}

/**
 * Set interactive display map mode based on passed boolean argument
 * Note, that static fallback is specifically displayed by default in case current script fails to be loaded
 */
function interactiveMapMode(enabled : boolean) {
    commonElements.staticMap.style.display = enabled ? "none" : "block";
    commonElements.interactiveMap.style.display = enabled ? "block" : "none";
}

/**
 * Determine card side using predefined names from configuration.
 * Note that current card side is figured out via accessing the value of
 * data attribute of the &lt;script&gt; element invoking the program
 */
function cardSide(cardSideName : string) {
    return commonConfig.cardSide === cardSideName;
}

/**
 * Throw an error if region code specified in the card field is absent in the map object to indicate
 * the reason of static map display and to automatically undo enabled interactive map mode
 */
function failInvalidRegionCode() {
    if (!worldMap.paths[commonConfig.regionCode])
        throw Error(`Region code "${commonConfig.regionCode ?? "empty"}" does not exist in the map`);
}

/**
 * Initialization of the map displayed on the front side of the card
 */
function initFrontMap() {
    let isPanning = false;

    // Insert svg from config into #map
    const svg = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    svg.setAttribute("id", "svgMap");
    svg.setAttribute("style", "border: solid; background-color: #b3dff5;");
    svg.setAttribute("width", worldMap.width.toString());
    svg.setAttribute("height", worldMap.height.toString());
    svg.addEventListener("mousedown", () => isPanning = false)
    svg.addEventListener("mousemove", () => isPanning = true)
    document.querySelector("#map").append(svg);

    for (const regionCode in worldMap.paths) {
        let path = document.createElementNS('http://www.w3.org/2000/svg', "path");
        path.setAttribute("fill", "#fdfbe5");
        path.setAttribute("stroke", "#757674");
        path.setAttribute("stroke-width", "1");
        path.setAttribute("d", worldMap.paths[regionCode].path);
        path.setAttribute("vector-effect", "non-scaling-stroke");

        // setup hover events
        path.addEventListener("mouseover", () => {
            path.setAttribute("fill", "#e7f3ea");
            path.setAttribute("cursor", "pointer");
        })
        path.addEventListener("mouseout", () => {
            path.setAttribute("fill", "#fdfbe5");
            path.setAttribute("cursor", "default");
        })

        // setup click events
        path.addEventListener("click", () => {
            if (isPanning) return;
            path.setAttribute("fill", "#ff0000");
            swapToBackSide(regionCode);
        })

        svg.append(path);
    }

    // setup zoom and pan
    svgPanZoom("#svgMap", {
        zoomScaleSensitivity: 0.5,
        maxZoom: 100,
    })
}

/**
 * Initialization of the map displayed on the back side of the card
 */
function initBackMap() {
    let isPanning = false;

    // Insert svg from config into #map
    const svg = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    svg.setAttribute("id", "svgMap");
    svg.setAttribute("style", "border: solid; background-color: #b3dff5;");
    svg.setAttribute("width", worldMap.width.toString());
    svg.setAttribute("height", worldMap.height.toString());
    document.querySelector("#map").append(svg);

    for (const regionCode in worldMap.paths) {
        let path = document.createElementNS('http://www.w3.org/2000/svg', "path");


        path.setAttribute("fill", regionCode === commonConfig.regionCode ? getRegionColor() : "#fdfbe5");
        path.setAttribute("stroke", "#757674");
        path.setAttribute("stroke-width", "1");
        path.setAttribute("d", worldMap.paths[regionCode].path);
        path.setAttribute("vector-effect", "non-scaling-stroke");


        svg.append(path);
    }

    // setup zoom and pan
    svgPanZoom("#svgMap", {
        zoomScaleSensitivity: 0.5,
        maxZoom: 100,
    })
}

/**
 * After region on the front card side is selected persist its region code and
 * swap the card to back side if configuration allows to do so. The action is
 * achieved via sending "Enter" key event on manually defined hidden text area
 */
function swapToBackSide(selectedRegionCode : string) {
    sessionStorage.setItem(commonConfig.selectedRegionSessionKey, selectedRegionCode);

    if (!commonConfig.autoAnswerEnabled)
        return

    commonElements.hiddenTextarea.onkeypress ??= () => _typeAnsPress();

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