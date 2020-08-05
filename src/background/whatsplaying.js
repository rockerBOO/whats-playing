const loadTime = new Date();
const manifest = browser.runtime.getManifest();

browser.runtime.onMessage.addListener(msg => console.log(msg));
