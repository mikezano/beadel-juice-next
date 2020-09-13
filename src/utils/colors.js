import store from "../store/beadStore";
//const localStore = store.state;
const perler = require("../colors/perler.json");
const hama = require("../colors/hama.json");
const allColors = [].concat(perler).concat(hama);

//const allColorsBasicInfo = {};

//contains just the name and hex value
// allColors.forEach(p => {
// 	allColorsBasicInfo[p.name.replace(" ", "")] = p.hex;
// });

//const nearestPerlerColor = require("nearest-human-color").from(allColorsBasicInfo);
const chroma = require("chroma-js");

const getColors = (colorSet) => {
  let colors = [];

  if (colorSet.usePerler) {
    colors = colors.concat(perler);
  }
  if (colorSet.useHama) {
    colors = colors.concat(hama);
  }

  return colors;
};

const getColors_ = () => {
  let colors = [];
  colors = colors.concat(store.usePerler ? perler : []);
  colors = colors.concat(store.useHama ? hama : []);
  return colors;
};

const sortedBeads = () => {
  const beads = getColors_();
  let beadsWithAvgRGB = beads.map((m) => {
    let hue = chroma(m.hex).hsl()[0];
    return { ...m, hue };
  });

  beadsWithAvgRGB.sort((a, b) => {
    return a.hue > b.hue ? 1 : -1;
  });

  return beadsWithAvgRGB;
};

//hexColor comes directly off the canvas pixels
const closestColor = (hex, ignoreExact, ignoreList, colorSet) => {
  let minDistance = 1000000;
  let closestColor = null;
  const colors = getColors(colorSet);
  //console.log("usable colors", colors, localStore, colorSet);
  colors.forEach((p) => {
    if (
      (p.hex.toLowerCase() === hex && ignoreExact) ||
      ignoreList.indexOf(p.hex) > -1
    ) {
      return;
    }
    const currentDistance = chroma.distance(p.hex, hex);
    const currentDistanceLAB = 0; //chroma.distance(p.hex, hexColor, "lab");
    const currentDistanceHSL = 0; //chroma.distance(p.hex, hexColor, "hsl");
    const currentDistanceRGB = chroma.distance(p.hex, hex, "rgb");

    const totalDistance = currentDistance +
      currentDistanceLAB +
      currentDistanceHSL +
      currentDistanceRGB;

    if (totalDistance < minDistance) {
      minDistance = totalDistance;
      closestColor = p;
    }
  });

  return closestColor;
};

const nearestNcolorsByHex_Chroma = (hexColor, n) => {
  let collection = [];
  let nextHex = hexColor;
  for (var i = 0; i < n; i++) {
    const closestPerler = closestColor(nextHex);
    collection.push(closestPerler);
    nextHex = closestPerler.hex;
  }
  return collection;
};

//Get the exact perler from the list
const exactPerlerByHex = (hexColor) => {
  return allColors.filter((p) => p.hex === hexColor)[0];
};

const rgbToHSL = (r, g, b) => {
  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  // Calculate hue
  // No difference
  if (delta == 0) h = 0;
  // Red is max
  else if (cmax == r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return "hsl(" + h + "," + s + "%," + l + "%)";
};

const rgbToHex = (r, g, b) => {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
};

export {
  allColors,
  sortedBeads,
  exactPerlerByHex,
  //nearestPerlerByHex_Euclidian as nearestPerlerByHex,
  rgbToHSL,
  rgbToHex,
  //closestColor as nearestPerlerByHex_Chroma,
  nearestNcolorsByHex_Chroma,
  //closestColor as closestColorMatcher,
  closestColor,
};
