import SiteinfoManager from "./lib/background/SiteinfoManager";
import ExcludeList from "./lib/background/ExcludeList";
import SyncPrefs from "./lib/background/SyncPrefs";
import ButtonManager from "./lib/background/ButtonManager";

const siteinfoManager = new SiteinfoManager();
const excludeList = new ExcludeList();
const syncPrefs = new SyncPrefs(["openLinkInNewTab"]);
const buttonManager = new ButtonManager();

siteinfoManager.init();
excludeList.init();
syncPrefs.init();
buttonManager.init();

browser.runtime.onMessage.addListener((message, sender) => {
  try {
    if (!message) {
      return null;
    }
    
    if (message.type === "getData") {
      const url = message.value;
      const data = {
        userActive: !excludeList.check(url),
        siteinfo: siteinfoManager.getSiteinfo(url),
        prefs: {
          openLinkInNewTab: syncPrefs.get("openLinkInNewTab"),
        },
      };
      return Promise.resolve(data);
    } else if (message.type === "setButtonState") {
      if (sender.tab) {
        buttonManager.setState(sender.tab.id, message.value);
      }
    }
    
    return null;
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
    return null;
  }
});
