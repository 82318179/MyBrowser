<template>
  <div class="container webkit-draggable">
    <ul class="tabs">
      <chrome-tab
        v-for="(tab, index) in tabs"
        :index="index"
        :key="index"
        :tab="tab"
      ></chrome-tab>
      <div @click="tabbar.onNewTab" class="add" />
    </ul>
    <div class="widget">哈哈，学习学习</div>
  </div>
</template>

<script>
import ChromeTab from "./ChromeTab";
export default {
  props: ["tabbar"],
  computed: {
    tabs() {
      return this.tabbar.pages.map((page, i) => {
        if (!page) {
          return;
        }
        let isActive = this.tabbar.currentPageIndex == i;
        let onClose = e => {
          e.preventDefault();
          e.stopPropagation();
          this.tabbar.onTabClose(e, page, i);
        };
        let onClick = e => {
          this.tabbar.onTabClick(e, page, i);
        };
        return {
          page,
          isActive,
          onClose,
          onClick
        };
      });
    }
  },
  components: {
    ChromeTab
  }
};
</script>

<style lang="scss" scoped>
$background-color: #dbdbdb;
$border: #bbb;
$border-radius: 4px;
.container {
  display: flex;
  align-items: center;
  background-color: $background-color;
  &.webkit-draggable {
    -webkit-app-region: drag;
  }
  .widget {
    color: red;
    margin: 0 8px;
    font-size: 12px;
  }
  .tabs {
    flex-grow: 1;
    display: flex;
    align-items: center;
    height: 36px;
    padding: 8px 20px 0 12px;
  }
  .add {
    background-color: #d0d0d0;
    width: 26px;
    height: 15px;
    border-radius: 2px;
    margin-left: 8px;
    border: 1px solid $border;
    transform: skewX(25deg);
    cursor: pointer;
    &:hover {
      background-color: #d9d9d9;
    }
  }
}
</style>
