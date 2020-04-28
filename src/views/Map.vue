<!--
 * @Author: zxc
 * @Date: 2020-04-27 10:40:31
 * @LastEditTime: 2020-04-28 17:37:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-leaflet-demo\src\views\Map.vue
 -->
<template>
  <div>
    <div class="map-container" id="map-container"></div>
    <DrawTool
      @point="drawPoint"
      @polyline="drawLine"
      @polygon="drawPolygon"
      @clear="clear"
      @end="drawOff"
    ></DrawTool>
  </div>
</template>

<script>
import DrawTool from "../components/DrawTool";
import $ from "jquery";

export default {
  name: "mapView",
  components: { DrawTool },
  data() {
    return {
      map: null,
      OSMUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      supermap:
        "http://192.168.8.166:8090/iserver/services/map-china400/rest/maps/China",
      esrimap: {
        url:
          "https://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer",
        proxy: false,
        useCors: true,
        maxZoom: 15,
      },
      overLayer: {
        polylines: [],
        polygons: [],
      },
      tempGp: {
        lineNode: [],
        lineNodeLen: 0,
        tempLine: null,
        polygonNode: [],
        polygonNodeLen: 0,
        tempNode: [],
        tempPolygon: null,
      },
      drawLayer: null,
    };
  },
  mounted() {
    this.$utils.map.crtMap("map-container", {
      zoomControl: true,
    });
    //this.$utils.map.crtTileLayer(this.OSMUrl, {});
    this.$utils.map.crtSupermapLayer.tileLayer(this.supermap, {});
    //this.$utils.map.crtEsriLayer.tileLayer(this.esrimap);
    this.$mapObj.setView([30.52, 114.31], 8);

    // 绘制要素放入
    this.drawLayer = [];
    this.getMapZoom();
  },
  methods: {
    getMapZoom() {
      this.$mapObj.on("zoomend", (obj) => {
        console.log(obj);
        console.log(this.$mapObj.getZoom());
      });
    },
    drawPoint() {
      this.drawOn();
      this.$utils.map.drawObj.addCursorStyle("pointer-crosshair");
      this.$mapObj.on("click", (evt) => {
        let marker = this.$utils.map.drawObj.crtMakerByLatlng(evt.latlng);
        marker.addTo(this.$mapObj);
      });
    },
    drawLine() {
      this.$utils.map.drawObj.addCursorStyle("pointer-crosshair");
      this.drawOn();
      let tempPolygonOpts = {
        color: "rgba(255, 0, 0, 0.85)",
        weight: 3,
        opacity: 0.85,
      };

      let finalPolygonOpts = {
        color: "rgba(0, 255, 0, 0.85)",
        weight: 3,
        opacity: 0.85,
      };

      this.$mapObj.on("click", (evt) => {
        this.tempGp.lineNode.push([evt.latlng.lat, evt.latlng.lng]);
        this.tempGp.tempNode.push(this.addNode(evt.latlng));
        this.tempGp.lineNodeLen = this.tempGp.lineNode.length;
      });

      this.$mapObj.on("mousemove", (evt) => {
        if (this.tempGp.lineNodeLen >= 1) {
          if (this.tempGp.tempLine) this.tempGp.tempLine.remove();
          this.tempGp.lineNode[this.tempGp.lineNodeLen] = [
            evt.latlng.lat,
            evt.latlng.lng,
          ];

          this.tempGp.tempLine = this.$utils.map.drawObj.crtPolyline(
            this.tempGp.lineNode,
            tempPolygonOpts
          );
        }
      });

      this.$mapObj.on("dblclick", () => {
        this.overLayer.polylines.push(
          this.$utils.map.drawObj.crtPolyline(
            this.tempGp.lineNode,
            finalPolygonOpts
          )
        );
        this.tempGp.lineNode = [];
        this.tempGp.lineNodeLen = 0;
        this.tempGp.tempLine.remove();
        this.tempGp.tempNode.map((el) => el.remove());
      });
    },
    drawPolygon() {
      this.$utils.map.drawObj.addCursorStyle("pointer-crosshair");
      this.drawOn();

      let tempPolygonOpts = {
        color: "rgba(255, 0, 0, 0.85)",
        weight: 3,
        opacity: 0.85,
      };

      let finalPolygonOpts = {
        color: "rgba(0, 255, 0, 0.85)",
        weight: 3,
        opacity: 0.85,
      };

      this.$mapObj.on("click", (evt) => {
        this.tempGp.polygonNode.push([evt.latlng.lat, evt.latlng.lng]);
        this.tempGp.polygonNodeLen = this.tempGp.polygonNode.length;

        this.tempGp.tempNode.push(this.addNode(evt.latlng));
      });

      this.$mapObj.on("mousemove", (evt) => {
        if (this.tempGp.tempPolygon) this.tempGp.tempPolygon.remove();

        if (this.tempGp.polygonNodeLen == 1) {
          this.tempGp.polygonNode[this.tempGp.polygonNodeLen] = [
            evt.latlng.lat,
            evt.latlng.lng,
          ];
          this.tempGp.tempPolygon = this.$utils.map.drawObj.crtPolyline(
            this.tempGp.polygonNode,
            tempPolygonOpts
          );
        } else if (this.tempGp.polygonNodeLen >= 2) {
          this.tempGp.polygonNode[this.tempGp.polygonNodeLen] = [
            evt.latlng.lat,
            evt.latlng.lng,
          ];

          this.tempGp.tempPolygon = this.$utils.map.drawObj.crtPolygon(
            this.tempGp.polygonNode,
            tempPolygonOpts
          );
        }
      });

      this.$mapObj.on("dblclick", () => {
        this.overLayer.polygons.push(
          this.$utils.map.drawObj.crtPolygon(
            this.tempGp.polygonNode,
            finalPolygonOpts
          )
        );
        this.tempGp.polygonNode = [];
        this.tempGp.polygonNodeLen = 0;
        this.tempGp.tempPolygon.remove();
        this.tempGp.tempNode.map((el) => el.remove());
      });
    },
    addNode(latlng) {
      let node = this.$utils.map.drawObj.crtIcon({
        iconUrl: require("../assets/style/image/node.png"),
        iconSize: [16, 16],
      });
      node = this.$utils.map.drawObj.crtMakerByLatlng(latlng, {
        icon: node,
      });
      node.addTo(this.$mapObj);
      return node;
    },
    drawOn() {
      this.clearTemps();

      this.$mapObj.off("click");
      this.$mapObj.off("mousemove");
      this.$mapObj.off("dbclick");
      this.$mapObj.doubleClickZoom.disable();
    },
    drawOff() {
      this.$mapObj.off("click");
      this.$mapObj.off("mousemove");
      this.$mapObj.off("dbclick");
      this.$mapObj.doubleClickZoom.enable();

      this.$utils.map.drawObj.removerCoursorStyle();
    },
    clear() {
      this.$mapObj.eachLayer(function(layer) {
        if (
          !layer._container ||
          ("" + $(layer._container).attr("class")).replace(/\s/g, "") !=
            "leaflet-layer"
        ) {
          layer.remove();
        }
      });
    },
    clearTemps() {
      // 清空线中间数据
      this.tempGp.polygonNode = [];
      this.tempGp.polygonNodeLen = 0;
      if (this.tempGp.tempPolygon) this.tempGp.tempPolygon.remove();
      this.tempGp.tempNode.map((el) => el.remove());
      // 清空面中间数据
      this.tempGp.lineNode = [];
      this.tempGp.lineNodeLen = 0;
      if (this.tempGp.tempLine) this.tempGp.tempLine.remove();
      this.tempGp.tempNode.map((el) => el.remove());
    },
  },
};
</script>
<style lang="less">
.map-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
