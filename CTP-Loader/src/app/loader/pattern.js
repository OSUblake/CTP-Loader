var CTP;
(function (CTP) {
    var Loader;
    (function (Loader) {
        var module = Loader.getModule();
        var Color = (function () {
            function Color(r, g, b, description) {
                this.r = r;
                this.g = g;
                this.b = b;
                this.description = description;
            }
            return Color;
        }());
        Loader.Color = Color;
        var Stitch = (function () {
            function Stitch(x, y, flags, color) {
                this.x = x;
                this.y = y;
                this.flags = flags;
                this.color = color;
            }
            return Stitch;
        }());
        Loader.Stitch = Stitch;
        var Pattern = (function () {
            // TEST
            function Pattern(patch) {
                this.patch = patch;
                this.currentColorIndex = 0;
                this.colors = [];
                this.stitches = [];
                this._stitches = [];
                //////
                this.layers = [];
                this.top = 0;
                this.bottom = 0;
                this.left = 0;
                this.right = 0;
                this.lastX = 0;
                this.lastY = 0;
            }
            Pattern.prototype.addColorRgb = function (r, g, b, description) {
                this.colors[this.colors.length] = new Color(r, g, b, description);
            };
            Pattern.prototype.addColor = function (color) {
                this.colors[this.colors.length] = color;
            };
            Pattern.prototype.addStitchAbs = function (x, y, flags, isAutoColorIndex) {
                if ((flags & Loader.StitchType.End) === Loader.StitchType.End) {
                    this.calculateBoundingBox();
                    this.fixColorCount();
                }
                if (((flags & Loader.StitchType.Stop) === Loader.StitchType.Stop) && this.stitches.length === 0) {
                    return;
                }
                if (((flags & Loader.StitchType.Stop) === Loader.StitchType.Stop) && isAutoColorIndex) {
                    this.currentColorIndex += 1;
                    this.layers.push([]);
                    this._stitches.push([]);
                    // TEST
                    this.patch.addLayer();
                }
                // TEST
                //if (!this.patch.layers.length) {
                if (!this.patch.currentLayer) {
                    this.patch.addLayer();
                }
                if (!this.layers.length) {
                    this.layers.push([]);
                }
                if (!this._stitches.length) {
                    this._stitches.push([]);
                }
                // TEST
                this.patch.currentLayer.addStitch(new Stitch(x, y, flags, this.currentColorIndex));
                _.last(this.layers).push(x, y);
                _.last(this._stitches).push(new Stitch(x, y, flags, this.currentColorIndex));
                this.stitches[this.stitches.length] = new Stitch(x, y, flags, this.currentColorIndex);
            };
            Pattern.prototype.addStitchRel = function (dx, dy, flags, isAutoColorIndex) {
                if (this.stitches.length !== 0) {
                    var nx = this.lastX + dx;
                    var ny = this.lastY + dy;
                    this.lastX = nx;
                    this.lastY = ny;
                    this.addStitchAbs(nx, ny, flags, isAutoColorIndex);
                }
                else {
                    this.addStitchAbs(dx, dy, flags, isAutoColorIndex);
                }
            };
            Pattern.prototype.calculateBoundingBox = function () {
                var stitchCount = this.stitches.length;
                var pt;
                if (stitchCount === 0) {
                    this.bottom = 1;
                    this.right = 1;
                    return;
                }
                this.left = Number.MAX_VALUE;
                this.top = Number.MAX_VALUE;
                this.right = Number.MIN_VALUE;
                this.bottom = Number.MIN_VALUE;
                for (var i = 0; i < stitchCount; i++) {
                    pt = this.stitches[i];
                    if (!(pt.flags & Loader.StitchType.Trim)) {
                        this.left = this.left < pt.x ? this.left : pt.x;
                        this.top = this.top < pt.y ? this.top : pt.y;
                        this.right = this.right > pt.x ? this.right : pt.x;
                        this.bottom = this.bottom > pt.y ? this.bottom : pt.y;
                    }
                }
            };
            Pattern.prototype.moveToPositive = function () {
                var _this = this;
                var stitchCount = this.stitches.length;
                for (var i = 0; i < stitchCount; i++) {
                    this.stitches[i].x -= this.left;
                    this.stitches[i].y -= this.top;
                }
                // TEST
                _.forEach(this.patch.layers, function (layer) {
                    _.forEach(layer.stitches, function (stitch) {
                        stitch.x -= _this.left;
                        stitch.y -= _this.top;
                    });
                });
                _.forEach(this._stitches, function (layer) {
                    _.forEach(layer, function (stitch) {
                        stitch.x -= _this.left;
                        stitch.y -= _this.top;
                    });
                });
                _.forEach(this.layers, function (layer) {
                    var len = layer.length;
                    for (var i = 0; i < len; i += 2) {
                        layer[i + 0] -= _this.left;
                        layer[i + 1] -= _this.top;
                    }
                });
                this.right -= this.left;
                this.left = 0;
                this.bottom -= this.top;
                this.top = 0;
            };
            Pattern.prototype.invertPatternVertical = function () {
                //console.log("INIVERT PATCH\n", this.patch.layers);
                //console.log("INIVERT _STITCHES\n", this._stitches);
                var temp = -this.top;
                var stitchCount = this.stitches.length;
                for (var i = 0; i < stitchCount; i++) {
                    this.stitches[i].y = -this.stitches[i].y;
                }
                // TEST
                _.forEach(this.patch.layers, function (layer) {
                    _.forEach(layer.stitches, function (stitch) {
                        //stitch.y *= -1;
                        stitch.y = -stitch.y;
                    });
                });
                _.forEach(this._stitches, function (layer) {
                    _.forEach(layer, function (stitch) {
                        stitch.y *= -1;
                    });
                });
                _.forEach(this.layers, function (layer) {
                    var len = layer.length;
                    for (var i = 1; i < len; i += 2) {
                        layer[i] *= -1;
                    }
                });
                this.top = -this.bottom;
                this.bottom = temp;
            };
            Pattern.prototype.addColorRandom = function () {
                this.colors[this.colors.length] = new Color(Math.round(Math.random() * 256), Math.round(Math.random() * 256), Math.round(Math.random() * 256), "random");
            };
            Pattern.prototype.fixColorCount = function () {
                var maxColorIndex = 0;
                var stitchCount = this.stitches.length;
                for (var i = 0; i < stitchCount; i++) {
                    maxColorIndex = Math.max(maxColorIndex, this.stitches[i].color);
                }
                while (this.colors.length <= maxColorIndex) {
                    this.addColorRandom();
                }
                this.colors.splice(maxColorIndex + 1, this.colors.length - maxColorIndex - 1);
            };
            Pattern.prototype.drawShape = function (canvas) {
                canvas.width = this.right;
                canvas.height = this.bottom;
                if (canvas.getContext) {
                    var ctx = canvas.getContext("2d");
                    ctx.beginPath();
                    var color = this.colors[this.stitches[0].color];
                    ctx.strokeStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
                    for (var i = 0; i < this.stitches.length; i++) {
                        var currentStitch = this.stitches[i];
                        if (currentStitch.flags === Loader.StitchType.Jump ||
                            currentStitch.flags === Loader.StitchType.Trim ||
                            currentStitch.flags === Loader.StitchType.Stop) {
                            ctx.stroke();
                            var color_1 = this.colors[currentStitch.color];
                            ctx.beginPath();
                            ctx.strokeStyle = "rgb(" + color_1.r + "," + color_1.g + "," + color_1.b + ")";
                            ctx.moveTo(currentStitch.x, currentStitch.y);
                        }
                        ctx.lineTo(currentStitch.x, currentStitch.y);
                    }
                    ctx.stroke();
                }
            };
            return Pattern;
        }());
        Loader.Pattern = Pattern;
    })(Loader = CTP.Loader || (CTP.Loader = {}));
})(CTP || (CTP = {}));
//# sourceMappingURL=pattern.js.map