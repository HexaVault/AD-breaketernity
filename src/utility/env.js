export function isDevEnvironment() {
  const href = window.location.href;
  return href.split("//")[1].length > 20 || isLocalEnvironment();
}

export function isLocalEnvironment() {
  const href = window.location.href;
  return href.includes("file") || href.includes("127.0.0.1") || href.includes("localhost");
}
