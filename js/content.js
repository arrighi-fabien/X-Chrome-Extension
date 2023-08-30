const style = document.createElement("link");
style.rel = "stylesheet";
style.type = "text/css";
style.href = chrome.runtime.getURL("css/styles.css");
document.head.appendChild(style);

chrome.storage.local.get('customColor', function(data) {
  let custom_color = data.customColor;

  if (custom_color) {
    function replaceColor() {
      let elements_with_inline_styles = document.querySelectorAll('[style]');
      for (let i = 0; i < elements_with_inline_styles.length; i++) {
        let element = elements_with_inline_styles[i];
        let inline_style = element.getAttribute('style');

        if (inline_style.includes('rgb(0, 186, 124)')) {     // To work you need to select last color in twitter display parameters
          let modified_style = inline_style.replace(/rgb\(0, 186, 124\)/g, custom_color);
          element.setAttribute('style', modified_style);
        }
        if (inline_style.includes('rgb(128, 221, 190)')) {     // To work you need to select last color in twitter display parameters
          let modified_style = inline_style.replace(/rgb\(128, 221, 190\)/g, desaturateColor(custom_color, 40));
          element.setAttribute('style', modified_style);
        }
        if (inline_style.includes('rgb(97, 214, 163)')) {     // To work you need to select last color in twitter display parameters
          let modified_style = inline_style.replace(/rgb\(97, 214, 163\)/g, darkenColor(custom_color, 40));
          element.setAttribute('style', modified_style);
        }
      }
    }
    let observer = new MutationObserver(replaceColor);
    let observer_config = { attributes: true, subtree: true };
    observer.observe(document, observer_config);
    replaceColor();

    document.documentElement.style.setProperty('--custom-color', custom_color);
    document.documentElement.style.setProperty('--custom-color-hover', darkenColor(custom_color, 30));
    document.documentElement.style.setProperty('--custom-color-click', custom_color + '80');
    document.documentElement.style.setProperty('--custom-color-darken', custom_color + '10');
    document.documentElement.style.setProperty('--custom-color-darken-click', custom_color + '30');
  }
});


function desaturateColor(hex, percent) {
  hex = hex.replace(/^#/, '');

  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  }
  else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  s *= 1 - (percent / 100);

  let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  let p = 2 * l - q;
  r = Math.round(hueToRgb(p, q, h + 1 / 3) * 255);
  g = Math.round(hueToRgb(p, q, h) * 255);
  b = Math.round(hueToRgb(p, q, h - 1 / 3) * 255);

  let new_hex = '#' + (r.toString(16).padStart(2, '0')) + (g.toString(16).padStart(2, '0')) + (b.toString(16).padStart(2, '0'));

  return new_hex;
}

function hueToRgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function darkenColor(color, percent) {
  color = color.replace(/^#/, '');

  let r = parseInt(color.substr(0, 2), 16);
  let g = parseInt(color.substr(2, 2), 16);
  let b = parseInt(color.substr(4, 2), 16);

  let factor = 1 - percent / 100;

  r = Math.round(r * factor);
  g = Math.round(g * factor);
  b = Math.round(b * factor);

  let new_color = '#' + (r.toString(16).padStart(2, '0')) + (g.toString(16).padStart(2, '0')) + (b.toString(16).padStart(2, '0'));

  return new_color;
}
