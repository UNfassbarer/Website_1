// Utility functions
// Fast, seedable random generator
const rand = (() => {
  let seed = Date.now();
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();

// Random integer between min and max (inclusive)
const getRandomInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;

// Universal event handler function
const handleEvent = (element, action, event, callback) =>
  element[`${action}EventListener`](event, callback);

// Clickevents for menu buttons
document.querySelectorAll(".button").forEach((button) => {
  handleEvent(button, "add", "click", () => ButtonClick(button));
});

// Function to edit multible styles of one element at once
const EditStyle = (element, styles) => Object.assign(element.style, styles);

// Buttonclick toggle
function toggleButtonPress(status) {
  document
    .getElementById("Menu_Content")
    .querySelectorAll("button")
    .forEach((button) => {
      button.style.pointerEvents = status;
    });
}

// Generate coler between two defined colors
const RGB = (x, y) => `rgb(${x}, ${y - x}, ${y})`;

// Menu button actions
const menu_actions = {
  NewGame: (el) => {
    console.log(el.id), newGame(), CloseMenu();
  },
  LoadGame: (el) => {
    console.log(el.id);
  },
  SaveGame: (el) => {
    console.log(el.id);
  },
  Settings: (el) => {
    console.log(el.id), ToggleHiddenSettings();
  },
  Exit: (el) => {
    console.log(el.id), CloseMenu();
  },
};

// Button actions & particle creation
let counter = 0;
let particleIntervalId = null;
function ButtonClick(el) {
  //Every Click creates particles
  if (counter === 0) {
    toggleButtonPress("none");
    setTimeout(() => {
      toggleButtonPress("auto");
    }, 750);
    menu_actions[el.id]?.(el);

    // Create particles with interval instead of recursion
    particleIntervalId = setInterval(() => {
      if (counter >= 15) {
        clearInterval(particleIntervalId);
        counter = 0;
        return;
      }
      LoadAnimation(el);
      counter++;
    }, 16); // ~60fps
  }
}

// Manage particle animation for button click
function LoadAnimation(el) {
  // Get exact button position
  let x = 0;
  let y = 0;
  const rect = el.getBoundingClientRect();
  x = Math.round(rect.left + window.scrollX);
  y = Math.round(rect.top + window.scrollY);

  // Create particles with random pos, color, animationspeed and size
  const particle = document.createElement("div");
  const size = Math.floor(Math.random() * 20 + 5);
  EditStyle(particle, {
    width: `${size}px`,
    height: `${size}px`,
    background: `${RGB(getRandomInt(0, 255), 255)}`,
    left: `${x +
      el.offsetWidth / 2 +
      getRandomInt(-el.offsetWidth / 2, el.offsetWidth / 2)
      }px`,
    top: `${y +
      el.offsetHeight / 2 +
      getRandomInt(-el.offsetHeight / 2, el.offsetHeight / 2)
      }px`,
    animation: `particle ${getRandomInt(0.75, 2)}s forwards`,
  });
  particle.className = "particle";
  document.body.appendChild(particle);

  // Delay & particle clear
  setTimeout(() => {
    particle.remove();
  }, 2000);
}

// Menu
const symbols = document.getElementById("Menu_Loading_Animation");
const Menu = document.getElementById("Menu_Container");

// Resize animation for spining circles
//  & copilot support to avoir rounding errors that caused a rapid and slow growth of the canvas size
let originalCanvasSizes = null;
let resizeStep = 0;

// Circle action for close/open menu
function OpenMenuAnimation(action, border, color1, color2) {
  action
    ? EditStyle(symbols, { scale: "5", filter: "blur(0.5px)" })
    : EditStyle(symbols, { scale: "1.5", filter: "blur(0px)" });
  symbols.querySelectorAll("canvas").forEach((canvas) => {
    canvas.style.borderTop = `${border}px solid hsl(${Math.random() * 90 + 180
      },${color1}% , ${color2}%)`;
  });
}

// Toggle hidden menu content
const ToggleHiddenMenu = () => {
  Menu.querySelectorAll(":scope > div").forEach((div) =>
    div.classList.toggle("hiddenContent")
  );
};

// Open and close menu, under observation of userdevice
let menuEvent = null;
window.matchMedia("(pointer: coarse)").matches
  ? (menuEvent = "click")
  : (menuEvent = "mouseenter");
handleEvent(Menu, "add", menuEvent, OpenMenu);

// Open menu
let menuStart = false;
let MenuOpen = false;
function OpenMenu() {
  // Executed every time menu is closed
  if (!MenuOpen) {
    Menu.style.cssText = "height: 500px; width: 300px;";
    OpenMenuAnimation(true, 3, 70, 60);
    ToggleHiddenMenu();
    MenuOpen = true;
  }

  // First menu open
  if (!menuStart) {
    document.body.style.backgroundColor = "black";
    createStar();
    symbols.style.opacity = 0.75;
    EditStyle(Menu, { top: "15px", left: "15px" });
    menuStart = true;
    Menu.classList.toggle("centeredObject");
  }
}

// Close menu on exit click
function CloseMenu() {
  // Ensure complete close animation
  handleEvent(Menu, "remove", menuEvent, OpenMenu);
  setTimeout(() => {
    handleEvent(Menu, "add", menuEvent, OpenMenu);
  }, 1500);

  setTimeout(() => {
    EditStyle(Menu, { height: "90px", width: "90px" });
    ToggleHiddenMenu();
    OpenMenuAnimation(false, 2, 100, 60);
  }, 500);
  MenuOpen = false;
}

// Settings menu
const settingsMenu = document.getElementById("Menu_Settings");

function ToggleHiddenSettings() {
  settingsMenu.classList.toggle("new_hiddenContent");
}

// Scroll bar for settings menu
settingsMenu.addEventListener("wheel", (e) => {
  let delta = settingsMenu.offsetWidth / 2;
  e.preventDefault(); // prevent vertical page scroll

  e.deltaY > 0
    ? (settingsMenu.scrollLeft += delta)
    : (settingsMenu.scrollLeft -= delta);
});

// Game stats toggle
const GameInfoBox = document.getElementById("gameInfo");

const ToggleGameStats = (id) => {
  const Button = document.getElementById(id.id);
  GameInfoBox.classList.toggle("hiddenContent");
  !Button.classList.contains("ToggleActiveColor")
    ? (Button.innerText = "Game stats on")
    : (Button.innerText = "Game stats off");
  Button.classList.toggle("ToggleActiveColor");
};

// Game key assignment toggle (KA)
const KA_Button = document.getElementById("Settings_KeyAssignment");
const ToggleKeys = () => {
  KA_Button.querySelectorAll(".KA_Category").forEach((el) =>
    el.classList.toggle("hiddenContent")
  );
  KA_Button.classList.toggle("Toggle_KA");
  //adjusted height & padding
  settingsMenu.classList.toggle("ToggleMenuSettings"); //for settings menu
  KA_Button.classList.toggle("Settings_Category"); //for KA button's
};

// All changeable Keys in game
const AssignmentKeys = {
  GoRight: ["ArrowRight", "KeyD"],
  GoLeft: ["ArrowLeft", "KeyA"],
  Jump: ["ArrowUp", "Space"],
  PauseGame: ["Escape"],
};

// Generate buttons for all actions access- & changable with a key's
for (const [action, keys] of Object.entries(AssignmentKeys)) {
  const NewButton = document.createElement("button");
  NewButton.className = "KA_Category hiddenContent centerContent";

  // Create action catagory
  const Action_Div = document.createElement("div");
  Action_Div.innerText = action;
  NewButton.appendChild(Action_Div)

  // Create keys for category
  for (let i = 0; i < keys.length; i++) {
    const keyDiv = document.createElement("div");
    keyDiv.innerText = keys[i];
    keyDiv.id = `KA_Button_Key_${i}`
    keyDiv.className = "KA_Button_Key"
    NewButton.appendChild(keyDiv);
  }
  KA_Button.appendChild(NewButton);

  // First solution got to complicated(EventListener inside EventListener inside EventListener ...) had to ask AI :(
  // Events for generated button
  NewButton.addEventListener("click", (e) => {
    e.stopPropagation();

    const button = e.currentTarget;

    // Toggle accessibility for key change
    if (!e.currentTarget.classList.contains("ToggleActiveColor")) {
      const KeyList = e.currentTarget.querySelectorAll("div.KA_Button_Key");
      let inputCounter = 0;

      // First key
      KeyList[0].classList.add("HilightetElement");
      let LastKey = KeyList[0].innerText;
      KeyList[0].innerText = "Press any key";

      function handleKey(event) {
        // Set key text
        LastKey = KeyList[inputCounter].innerText;
        KeyList[inputCounter].innerText = event.code;
        KeyList[inputCounter].classList.remove("HilightetElement");
        inputCounter++;

        // console.log(button.querySelectorAll(".div")[0].innerText)
        // AssignmentKeys[button.querySelectorAll(".div")[0].innerHtml] = ["KeyD", "ArrowRight"];

        // Highlight next key if available
        if (inputCounter < KeyList.length) {
          KeyList[inputCounter].classList.add("HilightetElement")
        } else {
          button.classList.toggle("ToggleActiveColor");
          document.removeEventListener("keyup", handleKey);
        }
      }
      document.addEventListener("keyup", handleKey);
    } else if (e.currentTarget.classList.contains("ToggleActiveColor")) {
      e.currentTarget.classList.toggle("ToggleActiveColor");

      e.currentTarget.querySelectorAll("div.KA_Button_Key").forEach((e) => {

        if (e.classList.contains("HilightetElement")) e.classList.toggle("HilightetElement")

      });
    };

    e.currentTarget.classList.toggle("ToggleActiveColor");
  });
}

// Create star background with canvas
let createStars = false;
function createStar() {
  const star = document.createElement("canvas");
  star.className = "star centeredObject";
  const size = getRandomInt(1, 2);
  EditStyle(star, {
    width: `${size}px`,
    height: `${size}px`,
    left: `${getRandomInt(0, window.innerWidth)}px`,
    top: `${getRandomInt(0, window.innerHeight)}px`,
    animation: "glow 2.5s infinite",
  });
  document.body.appendChild(star);
  setTimeout(() => star.remove(), 2500);
  if (createStars) setTimeout(createStar, 50);
}
