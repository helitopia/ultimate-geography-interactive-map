// @ts-ignore
import frontAndBackSideHtmlStringTemplate from "interactive-map/dist/Country - Map [Experimental].html"

const CARD_CONTENT_CONTAINER = document.querySelector("#qa");
const HANDLE_BAR_VARIABLES_MAP: Record<string, string> = {
    "Country": "Ukraine",
    "Region code": "UA",
    "Country info": "",
    "Map": "dummy value"
};

function insertDocumentContentsIntoCardContainer(htmlStringTemplate: string) {
    if (CARD_CONTENT_CONTAINER.childNodes.length > 0)
        CARD_CONTENT_CONTAINER.childNodes.forEach(node => node.remove());

    const htmlTemplate: Document = new DOMParser().parseFromString(htmlStringTemplate, "text/html");

    insertNonScriptNodesIntoCardContainer(htmlTemplate);
    insertScriptNodesIntoCardContainer(htmlTemplate);
}

function insertNonScriptNodesIntoCardContainer(htmlTemplate: Document) {
    Array.from(htmlTemplate.body.childNodes).forEach(node => {
        if (node.nodeName !== "SCRIPT")
            CARD_CONTENT_CONTAINER.appendChild(node.cloneNode(true));
    });
}

function insertScriptNodesIntoCardContainer(htmlTemplate: Document) {
    Array.from(htmlTemplate.querySelectorAll("script")).forEach((oldScript: HTMLScriptElement) => {
        const newScript = document.createElement("script");

        Array.from(oldScript.attributes)
            .forEach(attr => newScript.setAttribute(attr.name, attr.value));

        if (oldScript.textContent)
            newScript.textContent = oldScript.textContent;

        CARD_CONTENT_CONTAINER.appendChild(newScript);
    });
}

function substituteHandleBarVariables(htmlStringTemplate: string) {
    Object.entries(HANDLE_BAR_VARIABLES_MAP)
        .forEach(([variableName, variableValue]) => {
            const substitutionVariableRegex = new RegExp(`{{${variableName}}}`, "g");
            htmlStringTemplate = htmlStringTemplate.replace(substitutionVariableRegex, variableValue);

            const invisibleVariableRegex = new RegExp(`{{[#/]${variableName}}}`, "g");
            htmlStringTemplate = htmlStringTemplate.replace(invisibleVariableRegex, "");
        });

    return htmlStringTemplate;
}

export default function injectCardTemplates() {
    const templateSidesSeparatorRegex = /(?:\r\n|\r|\n)+-+(?:\r\n|\r|\n)+/;
    let [frontTemplateHtmlString, backTemplateHtmlString] = frontAndBackSideHtmlStringTemplate.split(templateSidesSeparatorRegex);

    frontTemplateHtmlString = substituteHandleBarVariables(frontTemplateHtmlString);
    backTemplateHtmlString = substituteHandleBarVariables(backTemplateHtmlString);

    insertDocumentContentsIntoCardContainer(frontTemplateHtmlString);

    window["_typeAnsPress"] = () => {
        insertDocumentContentsIntoCardContainer(backTemplateHtmlString);
    };
}