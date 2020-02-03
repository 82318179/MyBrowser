<template>
  <li @click="tab.onClick" :class="{ active: tab.isActive }" class="tab">
    <div class="content">{{ title }}</div>
    <svg viewBox="0 0 24 24" class="close" @click="tab.onClose">
      <path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      />
    </svg>
  </li>
</template>

<script>
export default {
  props: ["tab"],
  computed: {
    title() {
      return this.tab.page.title || "loading";
    }
  }
};
</script>

<style lang="scss" scoped>
$background-color: #dbdbdb;
$hover: #eee;
$border: #bbb;
$nav: #f2f2f2;
.tab {
  width: 218px;
  min-width: 100px;
  display: flex;
  align-items: center;
  min-width: 100px;
  position: relative;
  background-color: $background-color;
  border-top: 1px solid $border;
  margin: 0 5px;
  cursor: default;
  font-size: 0;
  transition: $background-color 0.5s;

  &:hover {
    background-color: $border;
    &::before,
    &::after {
      background-color: $border;
    }
  }

  &.active {
    background-color: $nav;
    height: 29px;
    border-bottom: 1px solid $nav;
    transition: all 0.1s;
    &::before,
    &::after {
      z-index: 10;
      transition: all 0.1s;
      align-self: flex-start;
      height: 28px;
      background-color: $nav;
      border-bottom: 1px solid $nav;
    }
  }
  .close {
    fill: #000;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    z-index: 100;
    margin-left: 2px;
    margin-right: 2px;
    &:hover {
      fill: #fff;
      background-color: #f00;
    }
  }
  &::before {
    content: "";
    position: absolute;
    z-index: 0;
    left: 0;
    width: 16px;
    height: 28px;
    background-color: $background-color;
    border-left: 1px solid $border;
    transform: skewX(-25deg);
    transform-origin: left top;
    transition: background-color 0.5s;
  }
  &::after {
    content: "";
    position: absolute;
    z-index: 1;
    right: 0;
    width: 16px;
    height: 28px;
    background-color: $background-color;
    border-right: 1px solid $border;
    border-bottom: 1px solid $border;
    transform: skewX(25deg);
    transform-origin: right top;
    transition: background-color 0.5s;
  }
  .content {
    flex-grow: 1;
    padding-left: 2px;
    font-size: 12px;
    line-height: 28px;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
  }
}
</style>
