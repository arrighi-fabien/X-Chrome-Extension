const color_picker = document.getElementById('color-picker-div__selector');
const previous_color_picker_div = document.getElementById('color-history__selectors');
const save_button = document.getElementById('saveButton');
const color_div = document.getElementById('color-picker-div');
const color_history_div = document.getElementById('color-history');
const color_name_span = document.getElementById('color-name');

save_button.addEventListener('click', function() {
  let selected_color = color_picker.value;
  chrome.storage.local.get('customColor', function(data) {
    let custom_color = data.customColor;
    if (custom_color) {
      chrome.storage.local.set({ previousColor1: custom_color });
    }
  });
  for (let i = 1; i < 4; i++) {
    let key = 'previousColor' + i;
    (function(index) {
      chrome.storage.local.get(key, function(data) {
        let previous_color = data[key];
        if (previous_color) {
          let new_key = 'previousColor' + (index + 1);
          chrome.storage.local.set({ [new_key]: previous_color });
        }
      });
    })(i);
  }
  chrome.storage.local.set({ customColor: selected_color }, function() {
    window.close();
  });
});

chrome.storage.local.get('customColor', function(data) {
  let custom_color = data.customColor;
  if (custom_color) {
    changeColorDisplay(custom_color);
  }
});

color_picker.addEventListener('input', function() {
  let selected_color = color_picker.value;
  changeColorDisplay(selected_color);
});

function retrievePreviousColor(i) {
  let key = 'previousColor' + i;
  chrome.storage.local.get(key, function(data) {
    let previous_color = data[key];
    if (previous_color) {
      color_history_div.style.display = 'inherit';
      let new_div = document.createElement("div");
      new_div.classList.add("color-history__selectors__btn");
      new_div.classList.add("round");
      new_div.classList.add("pointer");
      new_div.style.backgroundColor = previous_color;
      new_div.addEventListener('click', function() {
        changeColorDisplay(previous_color);
      });
      previous_color_picker_div.appendChild(new_div);
    }
    if (i < 6) {
      retrievePreviousColor(i + 1);
    }
  });
}

function changeColorDisplay(color) {
  color_picker.value = color;
  color_name_span.innerHTML = color.toUpperCase();
  save_button.style.backgroundColor = color;
  color_div.style.border = "2px solid " + color;
}

retrievePreviousColor(1);
