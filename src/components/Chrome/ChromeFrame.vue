<template>
  <div id="browser-page" :class="{ hidden: !isActive }">
    <webview ref="webview" nodeintegration></webview>
    <ChromeFrameStatus :status="status"></ChromeFrameStatus>
  </div>
</template>

<script>
// import process from "process";
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
    let webContents;
    this.$refs.webview.addEventListener("dom-ready", () => {
      if (!webContents) {
        webContents = this.$refs.webview.getWebContents();
        webContents.on("new-window", (e, url) => {
          if (!new URL(url).host) {
            // Handle newUrl = 'about:blank' in some cases
            return;
          }
          e.preventDefault();
          console.log(11); //会执行两次
          this.bPage.onNewTab(url);
        });
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
