import {CommonColors, CommonConfig, CommonElements} from "./type";

/**
 * Overall configuration. Includes validated user properties
 * and core properties - program auxiliary data. Should not
 * be modified unless the author understands what they are doing
 */
export function getMapConfig() {
  let userConfig = JSON.parse(sessionStorage.getItem("userConfig"));
  let configObj : {commonConfig?: CommonConfig, commonColors?: CommonColors, commonElements?: CommonElements, commonMap?: object} = {};
  configObj.commonConfig = {
    interactiveEnabled: true,
    interactiveMobileEnabled: true,
    autoAnswerEnabled: true,
    ...filterObjValidBooleans(userConfig.commonFeatures),

    isMobile: document.documentElement.classList.contains("mobile"),
    regionCode: document.currentScript.dataset.regionCode,
    cardSide: document.currentScript.dataset.cardSide,
    questionCardSideName: "question",
    answerCardSideName: "answer",
    selectedRegionSessionKey: "selectedRegion",
  }
  configObj.commonColors = {
    region: "#fdfbe5",
    selectedRegion: "#e7f3ea",
    incorrectRegionHighlight: "#c02637",
    correctRegionHighlight: "#329446",
    background: "#b3dff5",
    border: "#757674",
    ...filterObjValidColors(userConfig.commonColors)
  };
  configObj.commonElements = {
    interactiveMap: document.querySelector(".value--map"),
    staticMap: document.querySelector(".value--image"),
    hiddenTextarea: document.querySelector("textarea#typeans")
  };
  configObj.commonMap = {
    // selector: configObj.commonElements.interactiveMap,
    // map: configObj.commonConfig.mapSvgId,
    // zoomButtons: false,
    // zoomMax: 25,
    // backgroundColor: configObj.commonColors.background,
    // regionStyle: {
    //   initial: {
    //     fill: configObj.commonColors.region,
    //     stroke: configObj.commonColors.border,
    //     strokeWidth: 0.2
    //   }
    // }
  };
  return configObj;
}

/**
 * Assemble the object from properties of original object
 * values of which match the predicate
 */
function filterObj(obj : object, predicate : (val : any) => boolean, mapper? : (val : any) => any) {
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
function filterObjValidBooleans(obj : object) {
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
function filterObjValidColors(obj : object) {
  return filterObj(
    obj,
    v => v.toString().match(/^#(?:[0-9a-fA-F]{3}){1,2}$/g)
  );
}
