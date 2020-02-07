<template>
  <div id="browser-page" :class="{ hidden: !isActive }">
    <webview ref="webview"></webview>
    <ChromeFrameStatus :status="status"></ChromeFrameStatus>
  </div>
</template>

<script>
// import process from "process";
import url from "url";
import ChromeFrameStatus from "./ChromeFrameStatus";
export default {
  props: ["bPage"],
  computed: {
    page() {
      return this.bPage.pages[this.bPage.currentPageIndex];
    },
    searchInput() {
      return {
        isActive: this.page.isSearching,
        onPageSearch: this.onPageSearch
      };
    },
    status() {
      return {
        page: this.page
      };
    },
    isActive() {
      return this.bPage.pageIndex == this.bPage.currentPageIndex;
    }
  },
  components: {
    ChromeFrameStatus
  },
  methods: {
    navigateTo(l) {
      this.$refs.webview.setAttribute("src", l);
    }
  },
  mounted() {
    for (let key in webviewEvents) {
      this.$refs.webview.addEventListener(
        key,
        webviewHandler(this, webviewEvents[key])
      );
    }
    // window.addEventListener("resize", resize);
    // resize();
    if (this.page.location) {
      this.navigateTo(this.page.location);
    }

    // try {
    //   let webContents;
    //   this.$refs.webview.addEventListener("dom-ready", () => {
    //     if (!webContents) {
    //       webContents = this.$refs.webview.getWebContents();
    //       webContents.on("new-window", (e, url) => {
    //         if (!new URL(url).host) {
    //           // Handle newUrl = 'about:blank' in some cases
    //           return;
    //         }
    //         e.preventDefault();
    //         this.bPage.onNewTab(url);
    //       });
    //     }
    //   });
    // } catch (e) {
    //   // console.log("111:" + e);
    // }

    this.$refs.webview.addEventListener("new-window", e => {
      //访客页面尝试打开新的浏览器窗口时触发
      const protocol = url.parse(e.url).protocol;
      // console.log("protocol:" + protocol);
      if (
        protocol === "http:" ||
        protocol === "https:" ||
        protocol === "about:blank"
      ) {
        this.bPage.onNewTab(e.url);
      }
    });
  }
};
let webviewEvents = {
  "page-title-updated": "onPageTitleSet"
};
function webviewHandler(self, fnName) {
  //debugger;
  return function(e) {
    if (self.bPage[fnName])
      self.bPage[fnName](e, self.page, self.bPage.pageIndex);
  };
}
</script>

<style lang="scss" scoped>
#browser-page {
  position: relative;
  width: 100%;
  min-height: 100%;
}
webview {
  border: 0;
  width: 100%;
  min-height: 100%;
}
.hidden {
  display: none;
}
</style>
