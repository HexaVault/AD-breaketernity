/* eslint-disable no-console */


import { MAC, STEAM } from "@/env";

let isInitialized = false;
let isActive = false;

export const SteamRuntime = {
  initialize() {
    if (isInitialized) {
      throw Error("Steam Runtime was initialized already.");
    }

    isInitialized = true;

    if (!STEAM) {
      return;
    }

    isActive = true;

    if (!MAC) {
      initializeDiscord();
      createForceRefreshCanvas();
    }
  },

  get isActive() {
    if (!isInitialized) {
      throw Error("Steam Runtime was called before init.");
    }

    return isActive;
  },

  get screenName() {
    return "user";
  },
};

function initializeDiscord() {
  // If you plan to have discord activities set, youll need to manually code it in
  // This is commented to exist for the time being
  // Greenworks.initDiscordAPI("1057439416819396689", 1399720);
  // setDiscordActivity();
  // Greenworks.runDiscordCallbacks();
  // setInterval(setDiscordActivity, 8000);
  // setInterval(Greenworks.runDiscordCallbacks, 4000);
}

// eslint-disable-next-line no-unused-vars
function setDiscordActivity() {
  // Greenworks.setDiscordActivity(RichPresenceInfo.state, RichPresenceInfo.details);
}

function createForceRefreshCanvas() {
  // This canvas is required for Overlay to properly work in Electron.
  // Makopaz:
  // "essentially it makes the overlay have a refresh rate, otherwise it only
  // updates based on parts of the screen which change, so without it the small
  // areas of the screen where antimatter and such increment would be the only
  // small portions of the overlay showing."
  // There should be a less expensive approach. Please create a new issue or
  // PR on GitHub if you know one, the planet will say thank you for saving
  // megawatts of electricity spent on this canvas.
  const canvas = document.createElement("canvas");
  canvas.classList.add("_steam-refresh-canvas");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  function forceRefresh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(forceRefresh);
  }

  forceRefresh();
}
