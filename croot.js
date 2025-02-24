import {addCSS,renderHTML,onClick,container} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.3/element.js";
import {afterHeaderLoad} from "/js/header/home.js";
import {afterContentLoad} from "/js/main/home.js";

await addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");


await addCSS("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css");
await addCSS("./css/body.css");
await addCSS("./css/header.css");
await addCSS("./css/main.css");

renderHTML('header', 'html/header/home.html', afterHeaderLoad);
renderHTML('main', 'html/main/home.html', afterContentLoad);
