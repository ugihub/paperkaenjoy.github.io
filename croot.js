import {addCSS,renderHTML,onClick,container} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.3/element.js";
import {afterHeaderLoad} from "/js/header/home.js";
import {afterContentLoad} from "/js/main/home.js";
import {afterSliderLoad} from "/js/slider/home.js";

await addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");


await addCSS("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css");
await addCSS("./css/body.css");
await addCSS("./css/header.css");
await addCSS("./css/main.css");
await addCSS("./css/product.css");
await addCSS("./css/slider.css");
await addCSS("./css/footer.css");

renderHTML('header', 'html/header/home.html', afterHeaderLoad);
renderHTML('main', 'html/main/home.html', afterContentLoad);
renderHTML('product', 'html/product/home.html');
renderHTML('slider', 'html/slider/home.html', afterSliderLoad);
renderHTML('footer', 'html/footer/home.html');