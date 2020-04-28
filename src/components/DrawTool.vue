<!--
 * @Author: zxc
 * @Date: 2020-04-25 10:24:39
 * @LastEditTime: 2020-04-28 16:08:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-leaflet-demo\src\components\drawTool.vue
 -->
<template>
  <div class="draw-tool">
    <ul>
      <li :class="[{ active: activeTool == 'point' }]" @click="point">
        <a class="draw-point" title="点"></a>
      </li>
      <li :class="[{ active: activeTool == 'polyline' }]" @click="polyline">
        <a class="draw-line" title="线"></a>
      </li>
      <li :class="[{ active: activeTool == 'polygon' }]" @click="polygon">
        <a class="draw-polygon" title="多边形"></a>
      </li>
      <li :class="[{ active: activeTool == 'clear' }]" @click="clear">
        <a class="draw-clear" title="清除"></a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DrawTool",
  data() {
    return {
      activeTool: "",
    };
  },
  methods: {
    point() {
      if (this.activeTool !== "point") {
        this.activeTool = "point";
        this.$emit("point");
      } else {
        this.activeTool = "";
        this.$emit("end");
      }
    },
    polyline() {
      if (this.activeTool !== "polyline") {
        this.activeTool = "polyline";
        this.$emit("polyline");
      } else {
        this.activeTool = "";
        this.$emit("end");
      }
    },
    polygon() {
      if (this.activeTool !== "polygon") {
        this.activeTool = "polygon";
        this.$emit("polygon");
      } else {
        this.activeTool = "";
        this.$emit("end");
      }
    },
    clear() {
      if (this.activeTool !== "clear") {
        this.activeTool = "clear";
        this.$emit("clear");
      } else {
        this.activeTool = "";
        this.$emit("end");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.draw-tool {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
  margin: 70px 0 0 10px;
  width: 26px;
  background-color: #fff;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  ul {
    display: block;
    padding: 0;
    margin: 0;
    list-style: none;

    li:first-child {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    li:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    li {
      height: 26px;
      font-size: 13px;
      line-height: 26px;
      width: 100%;
      cursor: pointer;
      border-bottom: 1px solid #cccccc;
    }
    li.active {
      background-color: rgb(102, 156, 255);
      color: #fff;
    }
    li:hover {
      background-color: rgb(212, 224, 246);
    }

    li a {
      display: block;
      height: 26px;
    }

    li a.draw-point {
      background: url("../assets/style/image/spritesheet.png") no-repeat 44%;
    }
    li a.draw-line {
      background: url("../assets/style/image/spritesheet.png") no-repeat 0.5%;
    }
    // li a.draw-line {
    //   background: url("../assets/style/image/spritesheet.png") no-repeat 44%;
    // }
    li a.draw-polygon {
      background: url("../assets/style/image/spritesheet.png") no-repeat 11.2%;
    }
    li a.draw-clear {
      background: url("../assets/style/image/spritesheet.png") no-repeat 66%;
    }
  }
}
</style>
