"use strict";
var ABeamer;
((ABeamer2) => {
  let ChartTypes;
  ((ChartTypes2) => {
    ChartTypes2[ChartTypes2["pie"] = 0] = "pie";
    ChartTypes2[ChartTypes2["bar"] = 1] = "bar";
    ChartTypes2[ChartTypes2["area"] = 2] = "area";
    ChartTypes2[ChartTypes2["line"] = 3] = "line";
    ChartTypes2[ChartTypes2["marker"] = 4] = "marker";
    ChartTypes2[ChartTypes2["mixed"] = 5] = "mixed";
  })(ChartTypes = ABeamer2.ChartTypes || (ABeamer2.ChartTypes = {}));
  let ChartCaptionOrientation;
  ((ChartCaptionOrientation2) => {
    ChartCaptionOrientation2[ChartCaptionOrientation2["horizontal"] = 0] = "horizontal";
    ChartCaptionOrientation2[ChartCaptionOrientation2["vertical"] = 1] = "vertical";
  })(ChartCaptionOrientation = ABeamer2.ChartCaptionOrientation || (ABeamer2.ChartCaptionOrientation = {}));
  let ChartCaptionPosition;
  ((ChartCaptionPosition2) => {
    ChartCaptionPosition2[ChartCaptionPosition2["top"] = 0] = "top";
    ChartCaptionPosition2[ChartCaptionPosition2["bottom"] = 1] = "bottom";
    ChartCaptionPosition2[ChartCaptionPosition2["left"] = 2] = "left";
    ChartCaptionPosition2[ChartCaptionPosition2["right"] = 3] = "right";
  })(ChartCaptionPosition = ABeamer2.ChartCaptionPosition || (ABeamer2.ChartCaptionPosition = {}));
  let ChartCaptionAlignment;
  ((ChartCaptionAlignment2) => {
    ChartCaptionAlignment2[ChartCaptionAlignment2["left"] = 0] = "left";
    ChartCaptionAlignment2[ChartCaptionAlignment2["center"] = 1] = "center";
    ChartCaptionAlignment2[ChartCaptionAlignment2["right"] = 2] = "right";
  })(ChartCaptionAlignment = ABeamer2.ChartCaptionAlignment || (ABeamer2.ChartCaptionAlignment = {}));
  let ChartPointShape;
  ((ChartPointShape2) => {
    ChartPointShape2[ChartPointShape2["circle"] = 0] = "circle";
    ChartPointShape2[ChartPointShape2["square"] = 1] = "square";
    ChartPointShape2[ChartPointShape2["diamond"] = 2] = "diamond";
  })(ChartPointShape = ABeamer2.ChartPointShape || (ABeamer2.ChartPointShape = {}));
  pluginManager.addPlugin({
    id: "abeamer.chart-tasks",
    uuid: "73631f28-df71-4b4d-88e1-c99a858e0fd3",
    author: "Alexandre Bento Freire",
    email: "abeamer@a-bentofreire.com",
    jsUrls: ["plugins/chart-tasks/chart-tasks.js"],
    teleportable: true
  });
  const _defValues = getVars()["chart"] = {
    labelsX: {
      fontFamily: "sans-serif",
      fontColor: "black",
      fontSize: 12,
      alignment: 1 /* center */,
      position: 1 /* bottom */,
      orientation: 0 /* horizontal */,
      marginBefore: 0,
      marginAfter: 0
    },
    labelsY: {
      fontFamily: "sans-serif",
      fontColor: "black",
      fontSize: 12,
      alignment: 2 /* right */,
      position: 2 /* left */,
      orientation: 0 /* horizontal */,
      marginBefore: 0,
      marginAfter: 5,
      tickCount: 6
    },
    legend: {
      fontFamily: "sans-serif",
      fontColor: "black",
      fontSize: 12,
      alignment: 0 /* left */,
      position: 3 /* right */,
      orientation: 0 /* horizontal */,
      marginBefore: 0,
      marginAfter: 5,
      mark: {
        width: 10,
        height: 3,
        spacing: 4
      }
    },
    title: {
      fontFamily: "sans-serif",
      fontColor: "black",
      fontSize: 14,
      alignment: 1 /* center */,
      position: 0 /* top */,
      orientation: 0 /* horizontal */,
      marginBefore: 0,
      marginAfter: 0
    },
    fillColors: "#ffecad",
    strokeColors: "#101010",
    strokeWidth: 1,
    markers: {
      shape: 1 /* square */,
      size: 5,
      color: "black"
    },
    barWidth: 0,
    pointMaxHeight: 100,
    pointDistance: 0,
    seriesSpacing: 3,
    nrPoints: 10
  };
  function _maxOfArrayArray(data, startValue) {
    data.forEach((series) => {
      series.forEach((point) => {
        startValue = Math.max(startValue, point);
      });
    });
    return startValue;
  }
  class _ChartVirtualAnimator extends SimpleVirtualAnimator {
    constructor() {
      super(...arguments);
      this.charts = [];
    }
    animateProps() {
      this.charts.forEach((chart) => {
        chart._drawChart(this.params);
      });
    }
  }
  function _setUpCaptionsFont(l, ctx) {
    ctx.font = `${l.fontSize}px ${l.fontFamily}`;
    ctx.fillStyle = l.fontColor;
    ctx.textBaseline = "bottom";
  }
  function _ExprStrToLabels(l) {
    switch (typeof l) {
      case "undefined":
        return {};
      case "string":
        return { captions: l };
      default:
        return l;
    }
  }
  function _alignCaptions(l, ctx, text, width) {
    if (l.alignment === 0 /* left */) {
      return 0;
    }
    const sz = ctx.measureText(text);
    switch (l.alignment) {
      case 1 /* center */:
        return (width - sz.width) / 2;
      case 2 /* right */:
        return width - sz.width;
    }
    return 0;
  }
  class _WkChart {
    constructor(args) {
      this.args = args;
      // title
      this.title = {};
      // legends
      this.legend = {};
      // overflow
      this.overflow = 0;
      // graph  (x0, y0) = (left, bottom)
      this.graphX0 = 0;
      this.graphY1 = 0;
    }
    _drawChart(_params) {
      this._drawLegend();
    }
    _fillArrayArrayParam(param, defValue, strMapper) {
      const res = [];
      if (param === void 0) {
        param = defValue;
      }
      const isParamArray = Array.isArray(param);
      if (!isParamArray && strMapper && typeof param === "string") {
        param = strMapper[param];
      }
      this.data.forEach((series, seriesI) => {
        let resItem = [];
        if (!isParamArray) {
          resItem = series.map((_v) => param);
        } else {
          let subParam = param[seriesI];
          const isSubParamArray = Array.isArray(subParam);
          if (!isSubParamArray && strMapper && typeof subParam === "string") {
            subParam = strMapper[subParam];
          }
          if (!isSubParamArray) {
            resItem = series.map((_v) => subParam);
          } else {
            resItem = series.map((_v, i) => {
              let itemParam = subParam[i];
              if (strMapper && typeof itemParam === "string") {
                itemParam = strMapper[itemParam];
              }
              return itemParam;
            });
          }
        }
        res.push(resItem);
      });
      return res;
    }
    _initChart(params) {
      this.fillColors = this._fillArrayArrayParam(
        params.fillColors,
        _defValues.fillColors
      );
      this.strokeColors = this._fillArrayArrayParam(
        params.strokeColors,
        _defValues.strokeColors
      );
      this.strokeWidth = this._fillArrayArrayParam(
        params.strokeWidth,
        _defValues.strokeWidth
      );
      this.overflow = _maxOfArrayArray(this.strokeWidth, this.overflow);
      this.graphX1 = this.chartWidth;
      this.graphY0 = this.chartHeight;
      this._initTitle(params);
      this._initLegend(params);
    }
    _init(elAdapter, chartType, animator) {
      this.canvas = elAdapter.getProp("element", this.args);
      if (!this.canvas) {
        throwErr(`Didn't find the ${elAdapter.getId()}`);
      }
      this.context = this.canvas.getContext("2d");
      this.chartWidth = this.canvas.width;
      this.chartHeight = this.canvas.height;
      this.chartType = chartType;
      this.animator = animator;
      this.props = animator ? animator.props : {};
    }
    _initData(data) {
      let max = -Number.MIN_VALUE;
      let min = Number.MAX_VALUE;
      let sum = 0;
      let nrPoints;
      this.data = data.map((series, seriesI) => {
        let res;
        if (Array.isArray(series)) {
          res = series;
        } else {
          res = [];
          const exprSeries = series;
          const v0 = exprSeries.startValue || 0;
          const step = exprSeries.step || 1;
          const nrPts = exprSeries.nrPoints || nrPoints || _defValues.nrPoints;
          this.args.vars.n = nrPts;
          for (let i = 0; i < nrPts; i++) {
            this.args.vars.v = i * step + v0;
            const v1 = calcExpr(exprSeries.expr, this.args);
            res.push(typeof v1 === "number" ? v1 : parseFloat(v1));
          }
        }
        if (!seriesI) {
          nrPoints = res.length;
        } else {
          if (res.length !== nrPoints) {
            throwErr(`Every Series must have the same number of points`);
          }
        }
        return res;
      });
      this.data.forEach((series) => {
        series.forEach((point) => {
          max = Math.max(max, point);
          min = Math.min(min, point);
          sum += point;
        });
      });
      this.min = min;
      this.max = max;
      this.sum = sum;
      this.avg = (max - min) / 2;
      this.nrPoints = nrPoints;
    }
    _initCaptions(defaults, captions, labThis, labOther) {
      const res = {
        fontColor: ExprOrStrToStr(
          labThis.fontColor || labOther.fontColor,
          defaults.fontColor,
          this.args
        ),
        fontFamily: ExprOrStrToStr(
          labThis.fontFamily || labOther.fontFamily,
          defaults.fontFamily,
          this.args
        ),
        fontSize: ExprOrNumToNum(
          labThis.fontSize || labOther.fontSize,
          defaults.fontSize,
          this.args
        ),
        alignment: parseEnum(labThis.alignment, ChartCaptionAlignment, defaults.alignment),
        position: parseEnum(labThis.position, ChartCaptionPosition, defaults.position),
        orientation: parseEnum(labThis.orientation, ChartCaptionOrientation, defaults.orientation),
        marginBefore: ExprOrNumToNum(labThis.marginBefore, defaults.marginBefore, this.args),
        marginAfter: ExprOrNumToNum(labThis.marginAfter, defaults.marginAfter, this.args)
      };
      _setUpCaptionsFont(res, this.context);
      const isHorizontal = res.position === 0 /* top */ || res.position === 1 /* bottom */;
      if (isHorizontal) {
        const joinedText = captions.join(" ");
        const sz = this.context.measureText(joinedText);
        res.width = sz.width;
      } else {
        res.width = 0;
        captions.forEach((caption) => {
          res.width = Math.max(res.width, this.context.measureText(caption).width);
        });
      }
      res.height = res.fontSize * 1.2;
      let d;
      switch (res.position) {
        case 0 /* top */:
          res.y = this.graphY1 + res.height + res.marginBefore;
          d = res.height + res.marginBefore + res.marginAfter;
          this.graphY1 += d;
          break;
        case 2 /* left */:
          res.x = this.graphX0 + res.marginBefore;
          d = res.width + res.marginBefore + res.marginAfter;
          this.graphY0 = Math.min(this.graphY0, this.chartHeight - res.height / 2);
          this.graphX0 += d;
          break;
        case 1 /* bottom */:
          res.y = this.graphY0 - res.marginAfter;
          d = res.height + res.marginBefore + res.marginAfter;
          this.graphY0 -= d;
          break;
        case 3 /* right */:
          d = res.width + res.marginBefore + res.marginAfter;
          res.x = this.graphX1 + res.marginBefore - d;
          this.graphY0 = Math.min(this.graphY0, this.chartHeight - res.height / 2);
          this.graphX1 -= d;
          break;
      }
      return res;
    }
    _initTitle(params) {
      let title = params.title || {};
      if (typeof title === "string") {
        title = {
          caption: title
        };
      }
      if (title.caption) {
        this.title = this._initCaptions(_defValues.title, [title.caption], title, title);
        this.title.caption = ExprOrStrToStr(title.caption, "", this.args);
      }
    }
    _initLegend(params) {
      const pLegend = _ExprStrToLabels(params.legend);
      const captions = pLegend.captions;
      if (captions) {
        this.legend = this._initCaptions(_defValues.legend, captions, pLegend, pLegend);
        this.legend.captions = captions;
        const defMark = _defValues.legend.mark;
        const pMark = pLegend.mark || {};
        this.legend.mark = {
          width: ExprOrNumToNum(pMark.width, defMark.width, this.args),
          height: ExprOrNumToNum(pMark.height, defMark.height, this.args),
          spacing: ExprOrNumToNum(pMark.spacing, defMark.spacing, this.args)
        };
        const markWidAndSpace = this.legend.mark.width + this.legend.mark.spacing;
        switch (this.legend.position) {
          case 2 /* left */:
            this.legend.x += markWidAndSpace;
            this.graphX0 += markWidAndSpace;
            break;
          case 3 /* right */:
            this.graphX1 -= markWidAndSpace;
            break;
        }
      }
    }
    _getLegendColor(seriesI, i) {
      return this.fillColors[seriesI][i];
    }
    _drawLegend() {
      const legend = this.legend;
      if (legend.captions) {
        const ctx = this.context;
        const mark = legend.mark;
        const x = legend.x;
        const y0 = legend.height;
        const h = legend.height;
        const isPointLegend = this.data.length === 1;
        legend.captions.forEach((caption, i) => {
          const y = y0 + i * h;
          _setUpCaptionsFont(legend, ctx);
          const deltaX = _alignCaptions(legend, ctx, caption, legend.width);
          ctx.fillText(caption, x + deltaX, y);
          ctx.fillStyle = isPointLegend ? this._getLegendColor(0, i) : this._getLegendColor(i, 0);
          ctx.fillRect(
            x + deltaX - mark.width - mark.spacing,
            y - (h + mark.height) / 2,
            mark.width,
            mark.height
          );
        });
      }
    }
  }
  function _calcBestMax(v) {
    const vAbs = Math.abs(v);
    const isNegative = v < 0;
    const l10v = Math.log10(vAbs);
    const l10vf = Math.floor(l10v);
    const vBase = 10 ** l10vf;
    const vSubDigits = vAbs % vBase;
    if (Math.abs(vSubDigits) > 1e-5) {
      const vLow = vAbs - vSubDigits;
      const vHigh = isNegative ? -vLow + vBase : vLow + vBase;
      return vHigh;
    } else {
      return v;
    }
  }
  class _WkAxisChart extends _WkChart {
    constructor() {
      super(...arguments);
      // draw points
      this.xDrawPoints = [];
    }
    _calcCaptions(captions, count, min, max) {
      const strCaption = captions;
      if (!strCaption || !Array.isArray(strCaption)) {
        const isCaptionsExpr = isExpr(strCaption);
        const newCaptions = [];
        const delta = (max - min) / (count - 1);
        for (let i = 0; i < count; i++) {
          const v = min + i * delta;
          if (isCaptionsExpr) {
            this.args.vars["v"] = v;
            const v1 = calcExpr(strCaption, this.args);
            newCaptions.push(v1.toString());
          } else {
            newCaptions.push(v.toString());
          }
        }
        captions = newCaptions;
      }
      return captions;
    }
    _initLabels(params) {
      const labelsX = _ExprStrToLabels(params.labelsX);
      const labelsY = _ExprStrToLabels(params.labelsY);
      let captions;
      captions = labelsX.captions;
      if (captions) {
        captions = this._calcCaptions(captions, this.nrPoints, 0, this.nrPoints - 1);
        this.labelsX = this._initCaptions(_defValues.labelsX, captions, labelsX, labelsY);
        this.labelsX.captions = captions;
      }
      captions = labelsY.captions;
      if (labelsY.tickCount !== 0 || captions) {
        captions = this._calcCaptions(
          captions,
          labelsY.tickCount || _defValues.labelsY.tickCount,
          this.minValue,
          this.maxValue
        );
        this.labelsY = this._initCaptions(_defValues.labelsY, captions, labelsY, labelsX);
        this.labelsY.captions = captions;
        const heightDiv2 = this.labelsY.height / 2;
        this.graphY1 = Math.max(this.graphY1, heightDiv2);
      }
    }
    _getLegendColor(seriesI, i) {
      return this.chartTypes[seriesI] !== 3 /* line */ ? this.fillColors[seriesI][i] : this.strokeColors[seriesI][i];
    }
    _initLine(line) {
      return {
        visible: line.visible !== void 0 ? line.visible : true,
        color: ExprOrStrToStr(line.color, "#7c7c7c", this.args),
        width: ExprOrNumToNum(line.width, 1, this.args)
      };
    }
    _initMarkers(params) {
      const markers = {};
      this.hasMarkers = params.markers !== void 0 || this.chartTypes.findIndex((cType) => cType === 4 /* marker */) !== -1;
      const pMarkers = params.markers || {};
      if (this.hasMarkers) {
        markers.visible = this._fillArrayArrayParam(
          pMarkers.visible,
          this.chartType === 4 /* marker */
        );
        markers.shape = this._fillArrayArrayParam(
          pMarkers.shape,
          _defValues.markers.shape,
          ChartPointShape
        );
        markers.size = this._fillArrayArrayParam(
          pMarkers.size,
          _defValues.markers.size
        );
        markers.color = this._fillArrayArrayParam(
          pMarkers.color,
          _defValues.markers.color
        );
        this.overflow = _maxOfArrayArray(markers.size, this.overflow);
      }
      this.markers = markers;
    }
    _drawMarkers(dataPixels) {
      const points = this.markers;
      const ctx = this.context;
      this.data.forEach((series, seriesI) => {
        for (let i = 0; i < series.length; i++) {
          if (points.visible[seriesI][i]) {
            ctx.fillStyle = points.color[seriesI][i];
            const size = points.size[seriesI][i];
            const sizeDiv2 = size / 2;
            const [x, y] = dataPixels[seriesI][i];
            switch (points.shape[seriesI][i]) {
              case 0 /* circle */:
                ctx.beginPath();
                ctx.arc(x, y, sizeDiv2, 0, Math.PI * 2);
                ctx.fill();
                break;
              case 2 /* diamond */:
                ctx.beginPath();
                ctx.moveTo(x - sizeDiv2, y);
                ctx.lineTo(x, y - sizeDiv2);
                ctx.lineTo(x + sizeDiv2, y);
                ctx.lineTo(x, y + sizeDiv2);
                ctx.fill();
                break;
              case 1 /* square */:
                ctx.fillRect(x - sizeDiv2, y - sizeDiv2, sizeDiv2, sizeDiv2);
                break;
            }
          }
        }
      });
    }
    _drawLine(line, x0, y0, x1, y1) {
      const ctx = this.context;
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
    _computeBestValues() {
      this.bestMaxValue = _calcBestMax(this.max);
    }
    _computeDrawPoints(params) {
      this.pointMaxHeight = ExprOrNumToNum(params.pointMaxHeight, _defValues.pointMaxHeight, this.args);
      const x0 = this.graphX0 + this.overflow;
      const x1 = this.graphX1 - this.overflow;
      const xWidth = x1 - x0;
      const nrPoints = this.nrPoints;
      const pointArea = xWidth / nrPoints;
      let pointDistance = ExprOrNumToNum(params.pointDistance, _defValues.pointDistance, this.args);
      pointDistance = pointDistance || pointArea;
      let x = x0;
      const barChartCount = this.chartTypes.reduce((acc, v) => acc + (v === 1 /* bar */ ? 1 : 0));
      if (barChartCount === 0) {
        for (let i = 0; i < nrPoints; i++) {
          const xMidPoint = x + pointDistance / 2;
          this.xDrawPoints.push({
            x,
            xLabel: x,
            xLabelWidth: pointDistance,
            series: this.data.map(() => {
              return { x: xMidPoint, w: pointDistance };
            })
          });
          x += pointDistance;
        }
      } else {
        let barWidth = ExprOrNumToNum(params.barWidth, _defValues.barWidth, this.args);
        const seriesSpacing = ExprOrNumToNum(params.seriesSpacing, _defValues.seriesSpacing, this.args);
        if (!barWidth) {
          barWidth = pointDistance / barChartCount - seriesSpacing;
        }
        const usedPointWidth = barWidth * barChartCount + seriesSpacing * (barChartCount - 1);
        for (let i = 0; i < nrPoints; i++) {
          let xBar = x;
          const xMidPoint = x + pointDistance / 2;
          this.xDrawPoints.push({
            x,
            xLabel: x,
            xLabelWidth: usedPointWidth,
            series: this.data.map((_series, seriesI) => {
              if (this.chartTypes[seriesI] === 1 /* bar */) {
                const xBarThis = xBar;
                xBar += barWidth + seriesSpacing;
                return { x: xBarThis, w: barWidth };
              }
              return { x: xMidPoint, w: pointDistance };
            })
          });
          x += pointDistance;
        }
      }
      this.x1 = x;
    }
    /** Initializes all the Axis Chart parameters. */
    _initChart(params) {
      this.chartTypes = this.data.map((_series, seriesIndex) => {
        if (this.chartType !== 5 /* mixed */) {
          return this.chartType;
        }
        if (!params.chartTypes || params.chartTypes.length <= seriesIndex) {
          return 1 /* bar */;
        }
        return parseEnum(params.chartTypes[seriesIndex], ChartTypes, 1 /* bar */);
      });
      this.xAxis = this._initLine(params.xAxis || {});
      this.yAxis = this._initLine(params.yAxis || {});
      this.y0Line = this._initLine(params.y0Line || {});
      this._computeBestValues();
      this.maxValue = ExprOrNumToNum(params.maxValue, this.bestMaxValue, this.args);
      this.minValue = ExprOrNumToNum(params.minValue, Math.min(this.min, 0), this.args);
      this.avgValue = this.avg;
      super._initChart(params);
      this.negativeFillColors = !params.negativeFillColors ? this.fillColors : this._fillArrayArrayParam(params.negativeFillColors, "white");
      this._initMarkers(params);
      this._initLabels(params);
      this._computeDrawPoints(params);
      this.props["point-height"] = ExprOrNumToNum(params.pointHeightStart, 1, this.args);
      this.props["deviation"] = ExprOrNumToNum(params.deviationStart, 1, this.args);
      this.props["sweep"] = ExprOrNumToNum(params.sweepStart, 1, this.args);
    }
    /** Implements Axis Chart animation. */
    _drawChart(params) {
      const pointHeight = this.props["point-height"];
      const deviationV = this.props["deviation"];
      const sweepV = this.props["sweep"];
      const chartWidth = this.chartWidth;
      const chartHeight = this.chartHeight;
      const ctx = this.context;
      const x0 = this.graphX0;
      const y0 = this.graphY0;
      const y1 = this.graphY1;
      const topMargin = 1;
      const yLength = y0 - y1 - topMargin;
      const maxValue = this.maxValue;
      const minValue = this.minValue;
      const valueRange = maxValue - minValue;
      const hasY0Line = maxValue * minValue < 0;
      const vy0Line = hasY0Line ? 0 : minValue >= 0 ? minValue : maxValue;
      const vy0LineClip = (vy0Line - minValue) / valueRange;
      const axis0Y = y0 - yLength * vy0LineClip;
      const data = this.data;
      const nrPoints = this.nrPoints;
      const drawNrPoints = sweepV >= 1 ? nrPoints : Math.max(Math.min(Math.floor(nrPoints * sweepV) + 1, nrPoints), 0);
      ctx.clearRect(0, 0, chartWidth, chartHeight);
      super._drawChart(params);
      const y = axis0Y;
      const dataMidPixels = [];
      data.forEach((series, seriesI) => {
        let xPrev;
        let yPrev;
        const seriesPixels = [];
        const seriesMidPixels = [];
        const chartType = this.chartTypes[seriesI];
        for (let i = 0; i < drawNrPoints; i++) {
          ctx.lineWidth = this.strokeWidth[seriesI][i];
          ctx.strokeStyle = this.strokeColors[seriesI][i];
          let v = series[i];
          if (Math.abs(deviationV - 1) > 1e-6) {
            v = this.avgValue - (this.avgValue - v) * deviationV;
          }
          ctx.fillStyle = v >= 0 ? this.fillColors[seriesI][i] : this.negativeFillColors[seriesI][i];
          const xDrawPoint = this.xDrawPoints[i].series[seriesI];
          const vClip = (v - vy0Line) / valueRange;
          const vT = vClip * pointHeight;
          const yLen = -yLength * vT;
          let yNew = yLen + y;
          const x = xDrawPoint.x;
          let xNew = x;
          const isSweeping = i === drawNrPoints - 1 && sweepV < 1;
          if (isSweeping) {
            const leftSweep = sweepV - i / nrPoints;
            const reSweep = leftSweep / (1 / nrPoints);
            xNew = (xNew - xPrev) * reSweep + xPrev;
            yNew = (yNew - yPrev) * reSweep + yPrev;
          }
          let xMidNew = xNew;
          const yMidNew = yNew;
          switch (chartType) {
            case 1 /* bar */:
              let barWidth = xDrawPoint.w;
              if (isSweeping) {
                const xSeriesDrawPt = this.xDrawPoints[i];
                const xMaxSweepPos = xSeriesDrawPt.xLabel + xSeriesDrawPt.xLabelWidth * sweepV;
                if (xMaxSweepPos < x) {
                  barWidth = 0;
                } else {
                  barWidth = Math.min(x + barWidth, xMaxSweepPos) - x;
                }
              }
              if (barWidth > 0) {
                ctx.fillRect(x, y, barWidth, yLen);
                ctx.strokeRect(x, y, barWidth, yLen);
              }
              xMidNew = x + barWidth / 2;
              break;
            case 3 /* line */:
              if (i) {
                ctx.beginPath();
                ctx.moveTo(xPrev, yPrev);
                ctx.lineTo(xNew, yNew);
                ctx.stroke();
              }
              break;
          }
          xPrev = xNew;
          yPrev = yNew;
          seriesPixels.push([xNew, yNew]);
          seriesMidPixels.push([xMidNew, yMidNew]);
        }
        if (chartType === 2 /* area */) {
          ctx.beginPath();
          ctx.moveTo(seriesPixels[0][0], y);
          seriesPixels.forEach((point) => {
            ctx.lineTo(point[0], point[1]);
          });
          ctx.lineTo(seriesPixels[seriesPixels.length - 1][0], y);
          ctx.lineTo(seriesPixels[0][0], y);
          ctx.fill();
          ctx.stroke();
        }
        dataMidPixels.push(seriesMidPixels);
      });
      ctx.lineWidth = 1;
      if (this.hasMarkers) {
        this._drawMarkers(dataMidPixels);
      }
      const titleCaption = this.title.caption;
      if (this.title.caption) {
        _setUpCaptionsFont(this.title, ctx);
        const titleXPos = _alignCaptions(
          this.title,
          ctx,
          titleCaption,
          this.x1 - this.graphX0
        );
        ctx.fillText(titleCaption, this.graphX0 + titleXPos, this.title.y);
      }
      let captions;
      if (this.labelsX) {
        _setUpCaptionsFont(this.labelsX, ctx);
        captions = this.labelsX.captions;
        for (let i = 0; i < captions.length; i++) {
          const x = this.xDrawPoints[i].xLabel;
          const text = captions[i];
          const deltaX = _alignCaptions(this.labelsX, ctx, text, this.xDrawPoints[i].xLabelWidth);
          ctx.fillText(text, x + deltaX, this.labelsX.y);
        }
      }
      if (this.labelsY) {
        _setUpCaptionsFont(this.labelsY, ctx);
        captions = this.labelsY.captions;
        const fs2 = this.labelsY.height / 2;
        const scale = yLength / (captions.length - 1);
        for (let i = 0; i < captions.length; i++) {
          const yi = y0 - scale * i;
          const text = this.labelsY.captions[i];
          const deltaX = _alignCaptions(this.labelsY, ctx, text, this.labelsY.width);
          ctx.fillText(text, this.labelsY.x + deltaX, yi + fs2);
        }
      }
      if (hasY0Line && this.y0Line.visible) {
        this._drawLine(this.y0Line, x0, axis0Y, this.x1, axis0Y);
      }
      if (this.xAxis.visible) {
        this._drawLine(this.xAxis, x0, y0, this.x1, y0);
      }
      if (this.yAxis.visible) {
        this._drawLine(this.yAxis, x0, y0, x0, y0 - yLength);
      }
    }
  }
  class _WkPieChart extends _WkChart {
    _initChart(params) {
      super._initChart(params);
      this.props["angle"] = ExprOrNumToNum(params.angleStart, 0, this.args);
      this.props["dispersion"] = ExprOrNumToNum(params.dispersionStart, 1, this.args);
    }
    _drawChart(params) {
      const angle = this.props["angle"];
      const dispersion = this.props["dispersion"];
      const isClockwise = params.isClockwise !== false;
      const overflow = this.overflow;
      const x0 = this.graphX0 + overflow;
      const y1 = this.graphY1 + overflow;
      const diameter = Math.min(this.graphX1 - x0 - overflow, this.graphY0 - y1 - overflow);
      const radius = diameter / 2;
      const ctx = this.context;
      ctx.clearRect(0, 0, this.chartWidth, this.chartHeight);
      super._drawChart(params);
      this.data.forEach((series, seriesI) => {
        for (let stage = 0; stage < 2; stage++) {
          let startAngle = angle;
          for (let i = 0; i < series.length; i++) {
            ctx.lineWidth = this.strokeWidth[seriesI][i];
            ctx.strokeStyle = this.strokeColors[seriesI][i];
            ctx.fillStyle = this.fillColors[seriesI][i];
            const point = series[i];
            const percentage = point / this.sum;
            let endAngle = percentage * Math.PI * 2 * dispersion;
            if (!isClockwise) {
              endAngle = -endAngle;
            }
            endAngle += startAngle;
            ctx.beginPath();
            ctx.moveTo(x0 + radius, y1 + radius);
            ctx.arc(x0 + radius, y1 + radius, radius, startAngle, endAngle);
            ctx.closePath();
            if (stage === 0) {
              ctx.fill();
            } else {
              ctx.stroke();
            }
            startAngle = endAngle;
          }
        }
      });
    }
  }
  pluginManager.addTasks([["chart", _chartTask]]);
  function _chartTask(anime, _wkTask, params, stage, args) {
    switch (stage) {
      case TS_INIT:
        let cType = params.chartType;
        if (typeof cType === "string") {
          cType = ChartTypes[cType];
        }
        const data = params.data;
        if (!data.length) {
          throwErr(`Series have empty data`);
        }
        let animator;
        if (params.animeSelector) {
          animator = new _ChartVirtualAnimator();
          animator.selector = params.animeSelector;
          animator.params = params;
          args.story.addVirtualAnimator(animator);
        }
        const elAdapters = args.scene.getElementAdapters(anime.selector);
        args.vars.elCount = elAdapters.length;
        elAdapters.forEach((elAdapter, elIndex) => {
          args.vars.elIndex = elIndex;
          let chart;
          switch (cType) {
            case 0 /* pie */:
              chart = new _WkPieChart(args);
              break;
            case 4 /* marker */:
            case 1 /* bar */:
            case 3 /* line */:
            case 2 /* area */:
            case 5 /* mixed */:
              chart = new _WkAxisChart(args);
              break;
            default:
              throwI8n(Msgs.UnknownType, { p: params.chartType });
          }
          chart._init(elAdapter, cType, animator);
          chart._initData(data);
          chart._initChart(params);
          chart._drawChart(params);
          if (animator) {
            animator.charts.push(chart);
          }
        });
        break;
    }
    return TR_EXIT;
  }
})(ABeamer || (ABeamer = {}));
//# sourceMappingURL=chart-tasks.js.map
