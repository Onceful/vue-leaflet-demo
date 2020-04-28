/*
 * @Author: zxc
 * @Date: 2020-04-23 10:33:07
 * @LastEditTime: 2020-04-28 17:19:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-leaflet-demo\src\utils\map.js
 */

import Vue from "vue";
import "leaflet/dist/leaflet.css";
import * as $L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = $L.icon({
  iconAnchor: [13, 41],
  iconUrl: icon,
  shadowUrl: iconShadow,
});
$L.Marker.prototype.options.icon = DefaultIcon;

// 超图
import "@supermap/iclient-leaflet";

// arcgis
import { tiledMapLayer, dynamicMapLayer, imageMapLayer } from "esri-leaflet";

Vue.prototype.$mapObj = null;

const crtMap = (divId, options) => {
  let map = $L.map(divId, options);
  Vue.prototype.$mapObj = map;
  return map;
};

const crtTileLayer = async (url, options) => {
  let baseLayer = await $L.tileLayer(url, options);
  if (Vue.prototype.$mapObj == null) {
    console.error("地图未初始化，无法加载图层");
    return;
  }
  baseLayer.addTo(Vue.prototype.$mapObj);
  return baseLayer;
};

const crtSupermapLayer = {
  tileLayer: async (url, options) => {
    let tiledMapLayer = await $L.supermap.tiledMapLayer(url, options);
    if (Vue.prototype.$mapObj == null) {
      console.error("地图未初始化，无法加载图层");
      return;
    }
    tiledMapLayer.addTo(Vue.prototype.$mapObj);
    return tiledMapLayer;
  },
};

const crtEsriLayer = {
  /**
   * @description: 创建arcgis切片图层
   * @param {type} {url:String,zoomOffsetAllowance:Number,proxy:String,useCors:Boolean,token:String}
   * @return:
   */
  tileLayer: async (options) => {
    if (Vue.prototype.$mapObj == null) {
      console.error("地图未初始化，无法加载图层");
      return;
    }
    let esriTileLayer = await tiledMapLayer(options);
    esriTileLayer.addTo(Vue.prototype.$mapObj);
    return esriTileLayer;
  },
  dynamicLayer: async (options) => {
    if (Vue.prototype.$mapObj == null) {
      console.error("地图未初始化，无法加载图层");
      return;
    }
    return await dynamicMapLayer(options).addTo(Vue.prototype.$mapObj);
  },
  imagelayer: async (options) => {
    if (Vue.prototype.$mapObj == null) {
      console.error("地图未初始化，无法加载图层");
      return;
    }
    return await imageMapLayer(options).addTo(Vue.prototype.$mapObj);
  },
};

/**
 * @description: 绘图常用工具
 * @param {type}
 * @return:
 */
let CursorStyle = "";
const drawObj = {
  addCursorStyle: (cursorStyle) => {
    CursorStyle = cursorStyle;
    $L.DomUtil.addClass(Vue.prototype.$mapObj._container, cursorStyle);
  },
  removerCoursorStyle: () => {
    $L.DomUtil.removeClass(Vue.prototype.$mapObj._container, CursorStyle);
  },
  crtIcon: (options) => {
    return $L.icon(options);
  },
  /**
   * @description: [x,y] 创建点
   * @param {type}
   * @return:
   */
  crtMakerByXY: (coordinate, options) => {
    let latLng = $L.latLng(coordinate[1], coordinate[0]);
    let marker = $L.marker(latLng, options);
    //marker.addTo(Vue.prototype.$mapObj);
    return marker;
  },
  crtMakerByLatlng: (latlng, options) => {
    let marker = $L.marker(latlng, options);
    //marker.addTo(Vue.prototype.$mapObj);
    return marker;
  },
  /**
   * @description: 创建线
   * @param {type}
   * @return:
   */
  crtPolyline: (linePath, lineOpts) => {
    let polyline = $L.polyline(linePath, lineOpts);
    polyline.addTo(Vue.prototype.$mapObj);
    return polyline;
  },
  crtPolygon: (areaPath, areaOpts) => {
    let polygon = $L.polygon(areaPath, areaOpts);
    polygon.addTo(Vue.prototype.$mapObj);
    return polygon;
  },
};

export default {
  crtMap,
  crtTileLayer,
  crtSupermapLayer,
  crtEsriLayer,
  drawObj,
};
