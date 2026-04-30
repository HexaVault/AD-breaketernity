globalThis.STEAM = import.meta.env.VITE_STEAM === "true";
globalThis.MAC = window.navigator.platform === "MacIntel";
const href = window.location.href;
globalThis.LOCAL = href.includes("file") || href.includes("127.0.0.1") || href.includes("localhost");
globalThis.DEV = import.meta.env.VITE_DEV === "true" || LOCAL;
