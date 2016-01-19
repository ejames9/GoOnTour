(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.mapboxgl = f()
    }
})(function() {
    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
    })({
        1: [function(require, module, exports) {
            "use strict";

            function Bucket(e) {
                this.layer = e.layer, this.zoom = e.zoom, this.layers = [this.layer.id], this.type = this.layer.type, this.features = [], this.id = this.layer.id, this["source-layer"] = this.layer["source-layer"], this.interactive = this.layer.interactive, this.minZoom = this.layer.minzoom, this.maxZoom = this.layer.maxzoom, this.filter = featureFilter(this.layer.filter), this.layoutProperties = createLayoutProperties(this.layer, this.zoom), this.resetBuffers(e.buffers);
                for (var t in this.shaders) {
                    var r = this.shaders[t];
                    this[this.getAddMethodName(t, "vertex")] = createVertexAddMethod(t, r, this.getBufferName(t, "vertex"))
                }
            }

            function createLayoutProperties(e, t) {
                var r = new StyleDeclarationSet("layout", e.type, e.layout, {}).values(),
                    i = {
                        lastIntegerZoom: 1 / 0,
                        lastIntegerZoomTime: 0,
                        lastZoom: 0
                    },
                    a = {};
                for (var s in r) a[s] = r[s].calculate(t, i);
                return "symbol" === e.type && (r["text-size"] && (a["text-max-size"] = r["text-size"].calculate(18, i), a["text-size"] = r["text-size"].calculate(t + 1, i)), r["icon-size"] && (a["icon-max-size"] = r["icon-size"].calculate(18, i), a["icon-size"] = r["icon-size"].calculate(t + 1, i))), new LayoutProperties[e.type](a)
            }

            function createVertexAddMethod(e, t, r) {
                for (var i = [], a = 0; a < t.attributes.length; a++) i = i.concat(t.attributes[a].value);
                var s = "return this.buffers." + r + ".push(" + i.join(", ") + ");";
                return createVertexAddMethodCache[s] || (createVertexAddMethodCache[s] = new Function(t.attributeArgs, s)), createVertexAddMethodCache[s]
            }

            function createElementAddMethod(e) {
                return function(t, r, i) {
                    return e.push(t, r, i)
                }
            }

            function createElementBuffer(e) {
                return new Buffer({
                    type: Buffer.BufferType.ELEMENT,
                    attributes: [{
                        name: "vertices",
                        components: e || 3,
                        type: Buffer.ELEMENT_ATTRIBUTE_TYPE
                    }]
                })
            }

            function capitalize(e) {
                return e.charAt(0).toUpperCase() + e.slice(1)
            }
            var featureFilter = require("feature-filter"),
                StyleDeclarationSet = require("../style/style_declaration_set"),
                LayoutProperties = require("../style/layout_properties"),
                ElementGroups = require("./element_groups"),
                Buffer = require("./buffer");
            module.exports = Bucket, Bucket.create = function(e) {
                var t = {
                    fill: require("./fill_bucket"),
                    line: require("./line_bucket"),
                    circle: require("./circle_bucket"),
                    symbol: require("./symbol_bucket")
                };
                return new t[e.layer.type](e)
            }, Bucket.AttributeType = Buffer.AttributeType, Bucket.prototype.addFeatures = function() {
                for (var e = 0; e < this.features.length; e++) this.addFeature(this.features[e])
            }, Bucket.prototype.makeRoomFor = function(e, t) {
                return this.elementGroups[e].makeRoomFor(t)
            }, Bucket.prototype.resetBuffers = function(e) {
                this.buffers = e, this.elementGroups = {};
                for (var t in this.shaders) {
                    var r = this.shaders[t],
                        i = this.getBufferName(t, "vertex");
                    if (r.vertexBuffer && !e[i] && (e[i] = new Buffer({
                            type: Buffer.BufferType.VERTEX,
                            attributes: r.attributes
                        })), r.elementBuffer) {
                        var a = this.getBufferName(t, "element");
                        e[a] || (e[a] = createElementBuffer(r.elementBufferComponents)), this[this.getAddMethodName(t, "element")] = createElementAddMethod(this.buffers[a])
                    }
                    if (r.secondElementBuffer) {
                        var s = this.getBufferName(t, "secondElement");
                        e[s] || (e[s] = createElementBuffer(r.secondElementBufferComponents)), this[this.getAddMethodName(t, "secondElement")] = createElementAddMethod(this.buffers[s])
                    }
                    this.elementGroups[t] = new ElementGroups(e[this.getBufferName(t, "vertex")], e[this.getBufferName(t, "element")], e[this.getBufferName(t, "secondElement")])
                }
            }, Bucket.prototype.getAddMethodName = function(e, t) {
                return "add" + capitalize(e) + capitalize(t)
            }, Bucket.prototype.getBufferName = function(e, t) {
                return e + capitalize(t)
            };
            var createVertexAddMethodCache = {};
        }, {
            "../style/layout_properties": 43,
            "../style/style_declaration_set": 49,
            "./buffer": 2,
            "./circle_bucket": 3,
            "./element_groups": 4,
            "./fill_bucket": 6,
            "./line_bucket": 7,
            "./symbol_bucket": 8,
            "feature-filter": 102
        }],
        2: [function(require, module, exports) {
            "use strict";

            function Buffer(t) {
                if (this.type = t.type, t.arrayBuffer) this.capacity = t.capacity, this.arrayBuffer = t.arrayBuffer, this.attributes = t.attributes, this.itemSize = t.itemSize, this.length = t.length;
                else {
                    this.capacity = align(Buffer.CAPACITY_DEFAULT, Buffer.CAPACITY_ALIGNMENT), this.arrayBuffer = new ArrayBuffer(this.capacity), this.attributes = [], this.itemSize = 0, this.length = 0;
                    var e = this.type === Buffer.BufferType.VERTEX ? Buffer.VERTEX_ATTRIBUTE_ALIGNMENT : 1;
                    this.attributes = t.attributes.map(function(t) {
                        var r = {};
                        return r.name = t.name, r.components = t.components || 1, r.type = t.type || Buffer.AttributeType.UNSIGNED_BYTE, r.size = r.type.size * r.components, r.offset = this.itemSize, this.itemSize = align(r.offset + r.size, e), r
                    }, this), this._createPushMethod(), this._refreshViews()
                }
            }

            function align(t, e) {
                e = e || 1;
                var r = t % e;
                return 1 !== e && 0 !== r && (t += e - r), t
            }
            Buffer.prototype.bind = function(t) {
                var e = t[this.type];
                this.buffer ? t.bindBuffer(e, this.buffer) : (this.buffer = t.createBuffer(), t.bindBuffer(e, this.buffer), t.bufferData(e, this.arrayBuffer.slice(0, this.length * this.itemSize), t.STATIC_DRAW), this.arrayBuffer = null)
            }, Buffer.prototype.destroy = function(t) {
                this.buffer && t.deleteBuffer(this.buffer)
            }, Buffer.prototype.setAttribPointers = function(t, e, r) {
                for (var i = 0; i < this.attributes.length; i++) {
                    var f = this.attributes[i];
                    t.vertexAttribPointer(e["a_" + f.name], f.components, t[f.type.name], !1, this.itemSize, r + f.offset)
                }
            }, Buffer.prototype.get = function(t) {
                this._refreshViews();
                for (var e = {}, r = t * this.itemSize, i = 0; i < this.attributes.length; i++)
                    for (var f = this.attributes[i], s = e[f.name] = [], a = 0; a < f.components; a++) {
                        var h = (r + f.offset) / f.type.size + a;
                        s.push(this.views[f.type.name][h])
                    }
                return e
            }, Buffer.prototype.validate = function(t) {
                for (var e = 0; e < this.attributes.length; e++)
                    for (var r = 0; r < this.attributes[e].components; r++);
            }, Buffer.prototype._resize = function(t) {
                var e = this.views.UNSIGNED_BYTE;
                this.capacity = align(t, Buffer.CAPACITY_ALIGNMENT), this.arrayBuffer = new ArrayBuffer(this.capacity), this._refreshViews(), this.views.UNSIGNED_BYTE.set(e)
            }, Buffer.prototype._refreshViews = function() {
                this.views = {
                    UNSIGNED_BYTE: new Uint8Array(this.arrayBuffer),
                    BYTE: new Int8Array(this.arrayBuffer),
                    UNSIGNED_SHORT: new Uint16Array(this.arrayBuffer),
                    SHORT: new Int16Array(this.arrayBuffer)
                }
            };
            var createPushMethodCache = {};
            Buffer.prototype._createPushMethod = function() {
                var t = "",
                    e = [];
                t += "var i = this.length++;\n", t += "var o = i * " + this.itemSize + ";\n", t += "if (o + " + this.itemSize + " > this.capacity) { this._resize(this.capacity * 1.5); }\n";
                for (var r = 0; r < this.attributes.length; r++) {
                    var i = this.attributes[r],
                        f = "o" + r;
                    t += "\nvar " + f + " = (o + " + i.offset + ") / " + i.type.size + ";\n";
                    for (var s = 0; s < i.components; s++) {
                        var a = "v" + e.length,
                            h = "this.views." + i.type.name + "[" + f + " + " + s + "]";
                        t += h + " = " + a + ";\n", e.push(a)
                    }
                }
                t += "\nreturn i;\n", createPushMethodCache[t] || (createPushMethodCache[t] = new Function(e, t)), this.push = createPushMethodCache[t]
            }, Buffer.BufferType = {
                VERTEX: "ARRAY_BUFFER",
                ELEMENT: "ELEMENT_ARRAY_BUFFER"
            }, Buffer.AttributeType = {
                BYTE: {
                    size: 1,
                    name: "BYTE"
                },
                UNSIGNED_BYTE: {
                    size: 1,
                    name: "UNSIGNED_BYTE"
                },
                SHORT: {
                    size: 2,
                    name: "SHORT"
                },
                UNSIGNED_SHORT: {
                    size: 2,
                    name: "UNSIGNED_SHORT"
                }
            }, Buffer.ELEMENT_ATTRIBUTE_TYPE = Buffer.AttributeType.UNSIGNED_SHORT, Buffer.CAPACITY_DEFAULT = 8192, Buffer.CAPACITY_ALIGNMENT = 2, Buffer.VERTEX_ATTRIBUTE_ALIGNMENT = 4, module.exports = Buffer;
        }, {}],
        3: [function(require, module, exports) {
            "use strict";

            function CircleBucket() {
                Bucket.apply(this, arguments)
            }
            var Bucket = require("./bucket"),
                util = require("../util/util");
            module.exports = CircleBucket;
            var EXTENT = 4096;
            CircleBucket.prototype = util.inherit(Bucket, {}), CircleBucket.prototype.shaders = {
                circle: {
                    vertexBuffer: !0,
                    elementBuffer: !0,
                    attributeArgs: ["x", "y", "extrudeX", "extrudeY"],
                    attributes: [{
                        name: "pos",
                        components: 2,
                        type: Bucket.AttributeType.SHORT,
                        value: ["(x * 2) + ((extrudeX + 1) / 2)", "(y * 2) + ((extrudeY + 1) / 2)"]
                    }]
                }
            }, CircleBucket.prototype.addFeature = function(e) {
                for (var t = e.loadGeometry()[0], r = 0; r < t.length; r++) {
                    var i = this.makeRoomFor("circle", 4),
                        u = t[r].x,
                        c = t[r].y;
                    if (!(0 > u || u >= EXTENT || 0 > c || c >= EXTENT)) {
                        var l = this.addCircleVertex(u, c, -1, -1) - i.vertexStartIndex;
                        this.addCircleVertex(u, c, 1, -1), this.addCircleVertex(u, c, 1, 1), this.addCircleVertex(u, c, -1, 1), i.vertexLength += 4, this.addCircleElement(l, l + 1, l + 2), this.addCircleElement(l, l + 3, l + 2), i.elementLength += 2
                    }
                }
            };
        }, {
            "../util/util": 95,
            "./bucket": 1
        }],
        4: [function(require, module, exports) {
            "use strict";

            function ElementGroups(e, t, n) {
                this.vertexBuffer = e, this.elementBuffer = t, this.secondElementBuffer = n, this.groups = []
            }

            function ElementGroup(e, t, n) {
                this.vertexStartIndex = e, this.elementStartIndex = t, this.secondElementStartIndex = n, this.elementLength = 0, this.vertexLength = 0, this.secondElementLength = 0
            }
            module.exports = ElementGroups, ElementGroups.prototype.makeRoomFor = function(e) {
                return (!this.current || this.current.vertexLength + e > 65535) && (this.current = new ElementGroup(this.vertexBuffer.length, this.elementBuffer && this.elementBuffer.length, this.secondElementBuffer && this.secondElementBuffer.length), this.groups.push(this.current)), this.current
            };
        }, {}],
        5: [function(require, module, exports) {
            "use strict";

            function FeatureTree(t, e) {
                this.x = t.x, this.y = t.y, this.z = t.z - Math.log(e) / Math.LN2, this.rtree = rbush(9), this.toBeInserted = []
            }

            function geometryIntersectsBox(t, e, n) {
                return "Point" === e ? pointIntersectsBox(t, n) : "LineString" === e ? lineIntersectsBox(t, n) : "Polygon" === e ? polyIntersectsBox(t, n) || lineIntersectsBox(t, n) : !1
            }

            function polyIntersectsBox(t, e) {
                return polyContainsPoint(t, new Point(e[0], e[1])) || polyContainsPoint(t, new Point(e[0], e[3])) || polyContainsPoint(t, new Point(e[2], e[1])) || polyContainsPoint(t, new Point(e[2], e[3])) ? !0 : lineIntersectsBox(t, e)
            }

            function lineIntersectsBox(t, e) {
                for (var n = 0; n < t.length; n++)
                    for (var r = t[n], o = 0, i = r.length - 1; o < r.length; i = o++) {
                        var s = r[o],
                            a = r[i],
                            u = new Point(s.y, s.x),
                            l = new Point(a.y, a.x);
                        if (segmentCrossesHorizontal(s, a, e[0], e[2], e[1]) || segmentCrossesHorizontal(s, a, e[0], e[2], e[3]) || segmentCrossesHorizontal(u, l, e[1], e[3], e[0]) || segmentCrossesHorizontal(u, l, e[1], e[3], e[2])) return !0
                    }
                return pointIntersectsBox(t, e)
            }

            function segmentCrossesHorizontal(t, e, n, r, o) {
                if (e.y === t.y) return e.y === o && Math.min(t.x, e.x) <= r && Math.max(t.x, e.x) >= n;
                var i = (o - t.y) / (e.y - t.y),
                    s = t.x + i * (e.x - t.x);
                return s >= n && r >= s && 1 >= i && i >= 0
            }

            function pointIntersectsBox(t, e) {
                for (var n = 0; n < t.length; n++)
                    for (var r = t[n], o = 0; o < r.length; o++)
                        if (r[o].x >= e[0] && r[o].y >= e[1] && r[o].x <= e[2] && r[o].y <= e[3]) return !0;
                return !1
            }

            function geometryContainsPoint(t, e, n, r) {
                return "Point" === e ? pointContainsPoint(t, n, r) : "LineString" === e ? lineContainsPoint(t, n, r) : "Polygon" === e ? polyContainsPoint(t, n) || lineContainsPoint(t, n, r) : !1
            }

            function distToSegmentSquared(t, e, n) {
                var r = e.distSqr(n);
                if (0 === r) return t.distSqr(e);
                var o = ((t.x - e.x) * (n.x - e.x) + (t.y - e.y) * (n.y - e.y)) / r;
                return 0 > o ? t.distSqr(e) : o > 1 ? t.distSqr(n) : t.distSqr(n.sub(e)._mult(o)._add(e))
            }

            function lineContainsPoint(t, e, n) {
                for (var r = n * n, o = 0; o < t.length; o++)
                    for (var i = t[o], s = 1; s < i.length; s++) {
                        var a = i[s - 1],
                            u = i[s];
                        if (distToSegmentSquared(e, a, u) < r) return !0
                    }
                return !1
            }

            function polyContainsPoint(t, e) {
                for (var n, r, o, i = !1, s = 0; s < t.length; s++) {
                    n = t[s];
                    for (var a = 0, u = n.length - 1; a < n.length; u = a++) r = n[a], o = n[u], r.y > e.y != o.y > e.y && e.x < (o.x - r.x) * (e.y - r.y) / (o.y - r.y) + r.x && (i = !i)
                }
                return i
            }

            function pointContainsPoint(t, e, n) {
                for (var r = n * n, o = 0; o < t.length; o++)
                    for (var i = t[o], s = 0; s < i.length; s++)
                        if (i[s].distSqr(e) <= r) return !0;
                return !1
            }
            var rbush = require("rbush"),
                Point = require("point-geometry"),
                vt = require("vector-tile"),
                util = require("../util/util");
            module.exports = FeatureTree, FeatureTree.prototype.insert = function(t, e, n) {
                t.layers = e, t.feature = n, this.toBeInserted.push(t)
            }, FeatureTree.prototype._load = function() {
                this.rtree.load(this.toBeInserted), this.toBeInserted = []
            }, FeatureTree.prototype.query = function(t, e) {
                this.toBeInserted.length && this._load();
                var n, r, o = t.params || {},
                    i = t.x,
                    s = t.y,
                    a = [];
                "undefined" != typeof i && "undefined" != typeof s ? (n = (o.radius || 0) * (t.tileExtent || 4096) / t.scale, r = [i - n, s - n, i + n, s + n]) : r = [t.minX, t.minY, t.maxX, t.maxY];
                for (var u = this.rtree.search(r), l = 0; l < u.length; l++) {
                    var y = u[l].feature,
                        x = u[l].layers,
                        f = vt.VectorTileFeature.types[y.type];
                    if ((!o.$type || f === o.$type) && (!n || geometryContainsPoint(y.loadGeometry(), f, new Point(i, s), n)) && geometryIntersectsBox(y.loadGeometry(), f, r)) {
                        var h = y.toGeoJSON(this.x, this.y, this.z);
                        o.includeGeometry || (h.geometry = null);
                        for (var d = 0; d < x.length; d++) {
                            var g = x[d];
                            o.layerIds && o.layerIds.indexOf(g) < 0 || a.push(util.extend({
                                layer: g
                            }, h))
                        }
                    }
                }
                e(null, a)
            };
        }, {
            "../util/util": 95,
            "point-geometry": 131,
            "rbush": 132,
            "vector-tile": 135
        }],
        6: [function(require, module, exports) {
            "use strict";

            function FillBucket() {
                Bucket.apply(this, arguments)
            }
            var Bucket = require("./bucket"),
                util = require("../util/util");
            module.exports = FillBucket, FillBucket.prototype = util.inherit(Bucket, {}), FillBucket.prototype.shaders = {
                fill: {
                    vertexBuffer: !0,
                    elementBuffer: !0,
                    secondElementBuffer: !0,
                    secondElementBufferComponents: 2,
                    attributeArgs: ["x", "y"],
                    attributes: [{
                        name: "pos",
                        components: 2,
                        type: Bucket.AttributeType.SHORT,
                        value: ["x", "y"]
                    }]
                }
            }, FillBucket.prototype.addFeature = function(e) {
                for (var t = e.loadGeometry(), l = 0; l < t.length; l++) this.addFill(t[l])
            }, FillBucket.prototype.addFill = function(e) {
                if (!(e.length < 3))
                    for (var t, l, i = e.length, r = this.makeRoomFor("fill", i + 1), n = 0; n < e.length; n++) {
                        var u = e[n],
                            o = this.addFillVertex(u.x, u.y) - r.vertexStartIndex;
                        r.vertexLength++, 0 === n && (t = o), n >= 2 && (u.x !== e[0].x || u.y !== e[0].y) && (this.addFillElement(t, l, o), r.elementLength++), n >= 1 && (this.addFillSecondElement(l, o), r.secondElementLength++), l = o
                    }
            };
        }, {
            "../util/util": 95,
            "./bucket": 1
        }],
        7: [function(require, module, exports) {
            "use strict";

            function LineBucket() {
                Bucket.apply(this, arguments)
            }
            var Bucket = require("./bucket"),
                util = require("../util/util"),
                EXTRUDE_SCALE = 63;
            module.exports = LineBucket, LineBucket.prototype = util.inherit(Bucket, {}), LineBucket.prototype.shaders = {
                line: {
                    vertexBuffer: !0,
                    elementBuffer: !0,
                    attributeArgs: ["point", "extrude", "tx", "ty", "dir", "linesofar"],
                    attributes: [{
                        name: "pos",
                        components: 2,
                        type: Bucket.AttributeType.SHORT,
                        value: ["(point.x << 1) | tx", "(point.y << 1) | ty"]
                    }, {
                        name: "data",
                        components: 4,
                        type: Bucket.AttributeType.BYTE,
                        value: ["Math.round(" + EXTRUDE_SCALE + " * extrude.x)", "Math.round(" + EXTRUDE_SCALE + " * extrude.y)", "((dir < 0) ? -1 : 1) * ((dir ? 1 : 0) | ((linesofar << 1) & 0x7F))", "(linesofar >> 6) & 0x7F"]
                    }]
                }
            }, LineBucket.prototype.addFeature = function(e) {
                for (var t = e.loadGeometry(), i = this.layoutProperties, r = 0; r < t.length; r++) this.addLine(t[r], i["line-join"], i["line-cap"], i["line-miter-limit"], i["line-round-limit"])
            }, LineBucket.prototype.addLine = function(e, t, i, r, n) {
                for (var s = e.length; s > 2 && e[s - 1].equals(e[s - 2]);) s--;
                if (!(e.length < 2)) {
                    "bevel" === t && (r = 1.05);
                    var u = e[0],
                        d = e[s - 1],
                        a = u.equals(d);
                    if (this.makeRoomFor("line", 10 * s), 2 !== s || !a) {
                        var h, l, o, x, p, m, f, c = i,
                            v = a ? "butt" : i,
                            L = 1,
                            y = 0,
                            V = !0;
                        this.e1 = this.e2 = this.e3 = -1, a && (h = e[s - 2], p = u.sub(h)._unit()._perp());
                        for (var _ = 0; s > _; _++)
                            if (o = a && _ === s - 1 ? e[1] : e[_ + 1], !o || !e[_].equals(o)) {
                                p && (x = p), h && (l = h), h = e[_], l && (y += h.dist(l)), p = o ? o.sub(h)._unit()._perp() : x, x = x || p;
                                var b = x.add(p)._unit(),
                                    k = b.x * p.x + b.y * p.y,
                                    C = 1 / k,
                                    B = l && o,
                                    E = B ? t : o ? c : v;
                                if (B && "round" === E && (n > C ? E = "miter" : 2 >= C && (E = "fakeround")), "miter" === E && C > r && (E = "bevel"), "bevel" === E && (C > 2 && (E = "flipbevel"), r > C && (E = "miter")), "miter" === E) b._mult(C), this.addCurrentVertex(h, L, y, b, 0, 0, !1);
                                else if ("flipbevel" === E) {
                                    if (C > 100) b = p.clone();
                                    else {
                                        var g = x.x * p.y - x.y * p.x > 0 ? -1 : 1,
                                            S = C * x.add(p).mag() / x.sub(p).mag();
                                        b._perp()._mult(S * g)
                                    }
                                    this.addCurrentVertex(h, L, y, b, 0, 0, !1), this.addCurrentVertex(h, -L, y, b, 0, 0, !1)
                                } else if ("bevel" === E || "fakeround" === E) {
                                    var q = L * (x.x * p.y - x.y * p.x) > 0,
                                        T = -Math.sqrt(C * C - 1);
                                    if (q ? (f = 0, m = T) : (m = 0, f = T), V || this.addCurrentVertex(h, L, y, x, m, f, !1), "fakeround" === E) {
                                        for (var A, P = Math.floor(8 * (.5 - (k - .5))), R = 0; P > R; R++) A = p.mult((R + 1) / (P + 1))._add(x)._unit(), this.addPieSliceVertex(h, L, y, A, q);
                                        this.addPieSliceVertex(h, L, y, b, q);
                                        for (var F = P - 1; F >= 0; F--) A = x.mult((F + 1) / (P + 1))._add(p)._unit(), this.addPieSliceVertex(h, L, y, A, q)
                                    }
                                    o && this.addCurrentVertex(h, L, y, p, -m, -f, !1)
                                } else "butt" === E ? (V || this.addCurrentVertex(h, L, y, x, 0, 0, !1), o && this.addCurrentVertex(h, L, y, p, 0, 0, !1)) : "square" === E ? (V || (this.addCurrentVertex(h, L, y, x, 1, 1, !1), this.e1 = this.e2 = -1, L = 1), o && this.addCurrentVertex(h, L, y, p, -1, -1, !1)) : "round" === E && (V || (this.addCurrentVertex(h, L, y, x, 0, 0, !1), this.addCurrentVertex(h, L, y, x, 1, 1, !0), this.e1 = this.e2 = -1, L = 1), o && (this.addCurrentVertex(h, L, y, p, -1, -1, !0), this.addCurrentVertex(h, L, y, p, 0, 0, !1)));
                                V = !1
                            }
                    }
                }
            }, LineBucket.prototype.addCurrentVertex = function(e, t, i, r, n, s, u) {
                var d, a = u ? 1 : 0,
                    h = this.elementGroups.line.current;
                h.vertexLength += 2, d = r.mult(t), n && d._sub(r.perp()._mult(n)), this.e3 = this.addLineVertex(e, d, a, 0, n, i) - h.vertexStartIndex, this.e1 >= 0 && this.e2 >= 0 && (this.addLineElement(this.e1, this.e2, this.e3), h.elementLength++), this.e1 = this.e2, this.e2 = this.e3, d = r.mult(-t), s && d._sub(r.perp()._mult(s)), this.e3 = this.addLineVertex(e, d, a, 1, -s, i) - h.vertexStartIndex, this.e1 >= 0 && this.e2 >= 0 && (this.addLineElement(this.e1, this.e2, this.e3), h.elementLength++), this.e1 = this.e2, this.e2 = this.e3
            }, LineBucket.prototype.addPieSliceVertex = function(e, t, i, r, n) {
                var s = n ? 1 : 0;
                r = r.mult(t * (n ? -1 : 1));
                var u = this.elementGroups.line.current;
                this.e3 = this.addLineVertex(e, r, 0, s, 0, i) - u.vertexStartIndex, u.vertexLength++, this.e1 >= 0 && this.e2 >= 0 && (this.addLineElement(this.e1, this.e2, this.e3), u.elementLength++), n ? this.e2 = this.e3 : this.e1 = this.e3
            };
        }, {
            "../util/util": 95,
            "./bucket": 1
        }],
        8: [function(require, module, exports) {
            "use strict";

            function SymbolBucket(e) {
                Bucket.apply(this, arguments), this.collisionDebug = e.collisionDebug, this.overscaling = e.overscaling
            }

            function SymbolInstance(e, t, o, i, a, s, n, r, l, h, u, c) {
                this.x = e.x, this.y = e.y, this.hasText = !!o, this.hasIcon = !!i, this.hasText && (this.glyphQuads = s ? getGlyphQuads(e, o, n, t, a, l) : [], this.textCollisionFeature = new CollisionFeature(t, e, o, n, r, l)), this.hasIcon && (this.iconQuads = s ? getIconQuads(e, i, h, t, a, c) : [], this.iconCollisionFeature = new CollisionFeature(t, e, i, h, u, c))
            }
            var Point = require("point-geometry"),
                Bucket = require("./bucket"),
                ElementGroups = require("./element_groups"),
                Anchor = require("../symbol/anchor"),
                getAnchors = require("../symbol/get_anchors"),
                resolveTokens = require("../util/token"),
                Quads = require("../symbol/quads"),
                Shaping = require("../symbol/shaping"),
                resolveText = require("../symbol/resolve_text"),
                mergeLines = require("../symbol/mergelines"),
                shapeText = Shaping.shapeText,
                shapeIcon = Shaping.shapeIcon,
                getGlyphQuads = Quads.getGlyphQuads,
                getIconQuads = Quads.getIconQuads,
                clipLine = require("../symbol/clip_line"),
                util = require("../util/util"),
                CollisionFeature = require("../symbol/collision_feature");
            module.exports = SymbolBucket, SymbolBucket.prototype = util.inherit(Bucket, {});
            var shaderAttributeArgs = ["x", "y", "ox", "oy", "tx", "ty", "minzoom", "maxzoom", "labelminzoom"],
                shaderAttributes = [{
                    name: "pos",
                    components: 2,
                    type: Bucket.AttributeType.SHORT,
                    value: ["x", "y"]
                }, {
                    name: "offset",
                    components: 2,
                    type: Bucket.AttributeType.SHORT,
                    value: ["Math.round(ox * 64)", "Math.round(oy * 64)"]
                }, {
                    name: "data1",
                    components: 4,
                    type: Bucket.AttributeType.UNSIGNED_BYTE,
                    value: ["tx / 4", "ty / 4", "(labelminzoom || 0) * 10", "0"]
                }, {
                    name: "data2",
                    components: 2,
                    type: Bucket.AttributeType.UNSIGNED_BYTE,
                    value: ["(minzoom || 0) * 10", "Math.min(maxzoom || 25, 25) * 10"]
                }];
            SymbolBucket.prototype.shaders = {
                glyph: {
                    vertexBuffer: !0,
                    elementBuffer: !0,
                    attributeArgs: shaderAttributeArgs,
                    attributes: shaderAttributes
                },
                icon: {
                    vertexBuffer: !0,
                    elementBuffer: !0,
                    attributeArgs: shaderAttributeArgs,
                    attributes: shaderAttributes
                },
                collisionBox: {
                    vertexBuffer: "collisionBoxVertex",
                    attributeArgs: ["point", "extrude", "maxZoom", "placementZoom"],
                    attributes: [{
                        name: "pos",
                        components: 2,
                        type: Bucket.AttributeType.SHORT,
                        value: ["point.x", "point.y"]
                    }, {
                        name: "extrude",
                        components: 2,
                        type: Bucket.AttributeType.SHORT,
                        value: ["Math.round(extrude.x)", "Math.round(extrude.y)"]
                    }, {
                        name: "data",
                        components: 2,
                        type: Bucket.AttributeType.UNSIGNED_BYTE,
                        value: ["maxZoom * 10", "placementZoom * 10"]
                    }]
                }
            }, SymbolBucket.prototype.addFeatures = function(e, t, o) {
                var i = 512 * this.overscaling,
                    a = 4096;
                this.tilePixelRatio = a / i, this.compareText = {}, this.symbolInstances = [];
                var s = this.layoutProperties,
                    n = this.features,
                    r = this.textFeatures,
                    l = .5,
                    h = .5;
                switch (s["text-anchor"]) {
                    case "right":
                    case "top-right":
                    case "bottom-right":
                        l = 1;
                        break;
                    case "left":
                    case "top-left":
                    case "bottom-left":
                        l = 0
                }
                switch (s["text-anchor"]) {
                    case "bottom":
                    case "bottom-right":
                    case "bottom-left":
                        h = 1;
                        break;
                    case "top":
                    case "top-right":
                    case "top-left":
                        h = 0
                }
                for (var u = "right" === s["text-justify"] ? 1 : "left" === s["text-justify"] ? 0 : .5, c = 24, m = s["text-line-height"] * c, p = "line" !== s["symbol-placement"] ? s["text-max-width"] * c : 0, x = s["text-letter-spacing"] * c, y = [s["text-offset"][0] * c, s["text-offset"][1] * c], g = s["text-font"].join(","), d = [], f = 0; f < n.length; f++) d.push(n[f].loadGeometry());
                if ("line" === s["symbol-placement"]) {
                    var b = mergeLines(n, r, d);
                    d = b.geometries, n = b.features, r = b.textFeatures
                }
                for (var v, B, S = 0; S < n.length; S++)
                    if (d[S]) {
                        if (v = r[S] ? shapeText(r[S], t[g], p, m, l, h, u, x, y) : null, s["icon-image"]) {
                            var I = resolveTokens(n[S].properties, s["icon-image"]),
                                M = o[I];
                            B = shapeIcon(M, s), M && (void 0 === this.sdfIcons ? this.sdfIcons = M.sdf : this.sdfIcons !== M.sdf && console.warn("Style sheet warning: Cannot mix SDF and non-SDF icons in one buffer"))
                        } else B = null;
                        (v || B) && this.addFeature(d[S], v, B)
                    }
                this.placeFeatures(e, this.buffers, this.collisionDebug)
            }, SymbolBucket.prototype.addFeature = function(e, t, o) {
                var i = this.layoutProperties,
                    a = 24,
                    s = i["text-size"] / a,
                    n = this.tilePixelRatio * s,
                    r = this.tilePixelRatio * i["text-max-size"] / a,
                    l = this.tilePixelRatio * i["icon-size"],
                    h = this.tilePixelRatio * i["symbol-spacing"],
                    u = i["symbol-avoid-edges"],
                    c = i["text-padding"] * this.tilePixelRatio,
                    m = i["icon-padding"] * this.tilePixelRatio,
                    p = i["text-max-angle"] / 180 * Math.PI,
                    x = "map" === i["text-rotation-alignment"] && "line" === i["symbol-placement"],
                    y = "map" === i["icon-rotation-alignment"] && "line" === i["symbol-placement"],
                    g = i["text-allow-overlap"] || i["icon-allow-overlap"] || i["text-ignore-placement"] || i["icon-ignore-placement"],
                    d = "line" === i["symbol-placement"],
                    f = h / 2;
                d && (e = clipLine(e, 0, 0, 4096, 4096));
                for (var b = 0; b < e.length; b++)
                    for (var v = e[b], B = d ? getAnchors(v, h, p, t, o, a, r, this.overscaling) : [new Anchor(v[0].x, v[0].y, 0)], S = 0, I = B.length; I > S; S++) {
                        var M = B[S];
                        if (!(t && d && this.anchorIsTooClose(t.text, f, M))) {
                            var k = !(M.x < 0 || M.x > 4096 || M.y < 0 || M.y > 4096);
                            if (!u || k) {
                                var T = k || g;
                                this.symbolInstances.push(new SymbolInstance(M, v, t, o, i, T, n, c, x, l, m, y))
                            }
                        }
                    }
            }, SymbolBucket.prototype.anchorIsTooClose = function(e, t, o) {
                var i = this.compareText;
                if (e in i) {
                    for (var a = i[e], s = a.length - 1; s >= 0; s--)
                        if (o.dist(a[s]) < t) return !0
                } else i[e] = [];
                return i[e].push(o), !1
            }, SymbolBucket.prototype.placeFeatures = function(e, t, o) {
                this.resetBuffers(t);
                var i = this.elementGroups = {
                        glyph: new ElementGroups(t.glyphVertex, t.glyphElement),
                        icon: new ElementGroups(t.iconVertex, t.iconElement),
                        sdfIcons: this.sdfIcons
                    },
                    a = this.layoutProperties,
                    s = e.maxScale;
                i.glyph["text-size"] = a["text-size"], i.icon["icon-size"] = a["icon-size"];
                var n = "map" === a["text-rotation-alignment"] && "line" === a["symbol-placement"],
                    r = "map" === a["icon-rotation-alignment"] && "line" === a["symbol-placement"],
                    l = a["text-allow-overlap"] || a["icon-allow-overlap"] || a["text-ignore-placement"] || a["icon-ignore-placement"];
                if (l) {
                    var h = e.angle,
                        u = Math.sin(h),
                        c = Math.cos(h);
                    this.symbolInstances.sort(function(e, t) {
                        var o = u * e.x + c * e.y,
                            i = u * t.x + c * t.y;
                        return i - o
                    })
                }
                for (var m = 0; m < this.symbolInstances.length; m++) {
                    var p = this.symbolInstances[m],
                        x = p.hasText,
                        y = p.hasIcon,
                        g = a["text-optional"] || !x,
                        d = a["icon-optional"] || !y,
                        f = x && !a["text-allow-overlap"] ? e.placeCollisionFeature(p.textCollisionFeature) : e.minScale,
                        b = y && !a["icon-allow-overlap"] ? e.placeCollisionFeature(p.iconCollisionFeature) : e.minScale;
                    g || d ? !d && f ? f = Math.max(b, f) : !g && b && (b = Math.max(b, f)) : b = f = Math.max(b, f), x && (a["text-ignore-placement"] || e.insertCollisionFeature(p.textCollisionFeature, f), s >= f && this.addSymbols("glyph", p.glyphQuads, f, a["text-keep-upright"], n, e.angle)), y && (a["icon-ignore-placement"] || e.insertCollisionFeature(p.iconCollisionFeature, b), s >= b && this.addSymbols("icon", p.iconQuads, b, a["icon-keep-upright"], r, e.angle))
                }
                o && this.addToDebugBuffers(e)
            }, SymbolBucket.prototype.addSymbols = function(e, t, o, i, a, s) {
                for (var n = this.makeRoomFor(e, 4 * t.length), r = this[this.getAddMethodName(e, "element")].bind(this), l = this[this.getAddMethodName(e, "vertex")].bind(this), h = this.zoom, u = Math.max(Math.log(o) / Math.LN2 + h, 0), c = 0; c < t.length; c++) {
                    var m = t[c],
                        p = m.angle,
                        x = (p + s + Math.PI) % (2 * Math.PI);
                    if (!(i && a && (x <= Math.PI / 2 || x > 3 * Math.PI / 2))) {
                        var y = m.tl,
                            g = m.tr,
                            d = m.bl,
                            f = m.br,
                            b = m.tex,
                            v = m.anchorPoint,
                            B = Math.max(h + Math.log(m.minScale) / Math.LN2, u),
                            S = Math.min(h + Math.log(m.maxScale) / Math.LN2, 25);
                        if (!(B >= S)) {
                            B === u && (B = 0);
                            var I = l(v.x, v.y, y.x, y.y, b.x, b.y, B, S, u) - n.vertexStartIndex;
                            l(v.x, v.y, g.x, g.y, b.x + b.w, b.y, B, S, u), l(v.x, v.y, d.x, d.y, b.x, b.y + b.h, B, S, u), l(v.x, v.y, f.x, f.y, b.x + b.w, b.y + b.h, B, S, u), n.vertexLength += 4, r(I, I + 1, I + 2), r(I + 1, I + 2, I + 3), n.elementLength += 2
                        }
                    }
                }
            }, SymbolBucket.prototype.updateIcons = function(e) {
                var t = this.layoutProperties["icon-image"];
                if (t)
                    for (var o = 0; o < this.features.length; o++) {
                        var i = resolveTokens(this.features[o].properties, t);
                        i && (e[i] = !0)
                    }
            }, SymbolBucket.prototype.updateFont = function(e) {
                var t = this.layoutProperties["text-font"],
                    o = e[t] = e[t] || {};
                this.textFeatures = resolveText(this.features, this.layoutProperties, o)
            }, SymbolBucket.prototype.addToDebugBuffers = function(e) {
                this.elementGroups.collisionBox = new ElementGroups(this.buffers.collisionBoxVertex);
                for (var t = this.makeRoomFor("collisionBox", 8), o = -e.angle, i = e.yStretch, a = 0; a < this.symbolInstances.length; a++)
                    for (var s = 0; 2 > s; s++) {
                        var n = this.symbolInstances[a][0 === s ? "textCollisionFeature" : "iconCollisionFeature"];
                        if (n)
                            for (var r = n.boxes, l = 0; l < r.length; l++) {
                                var h = r[l],
                                    u = h.anchorPoint,
                                    c = new Point(h.x1, h.y1 * i)._rotate(o),
                                    m = new Point(h.x2, h.y1 * i)._rotate(o),
                                    p = new Point(h.x1, h.y2 * i)._rotate(o),
                                    x = new Point(h.x2, h.y2 * i)._rotate(o),
                                    y = Math.max(0, Math.min(25, this.zoom + Math.log(h.maxScale) / Math.LN2)),
                                    g = Math.max(0, Math.min(25, this.zoom + Math.log(h.placementScale) / Math.LN2));
                                this.addCollisionBoxVertex(u, c, y, g), this.addCollisionBoxVertex(u, m, y, g), this.addCollisionBoxVertex(u, m, y, g), this.addCollisionBoxVertex(u, x, y, g), this.addCollisionBoxVertex(u, x, y, g), this.addCollisionBoxVertex(u, p, y, g), this.addCollisionBoxVertex(u, p, y, g), this.addCollisionBoxVertex(u, c, y, g), t.vertexLength += 8
                            }
                    }
            };
        }, {
            "../symbol/anchor": 52,
            "../symbol/clip_line": 55,
            "../symbol/collision_feature": 57,
            "../symbol/get_anchors": 59,
            "../symbol/mergelines": 62,
            "../symbol/quads": 63,
            "../symbol/resolve_text": 64,
            "../symbol/shaping": 65,
            "../util/token": 94,
            "../util/util": 95,
            "./bucket": 1,
            "./element_groups": 4,
            "point-geometry": 131
        }],
        9: [function(require, module, exports) {
            "use strict";

            function Coordinate(o, t, n) {
                this.column = o, this.row = t, this.zoom = n
            }
            module.exports = Coordinate, Coordinate.prototype = {
                clone: function() {
                    return new Coordinate(this.column, this.row, this.zoom)
                },
                zoomTo: function(o) {
                    return this.clone()._zoomTo(o)
                },
                sub: function(o) {
                    return this.clone()._sub(o)
                },
                _zoomTo: function(o) {
                    var t = Math.pow(2, o - this.zoom);
                    return this.column *= t, this.row *= t, this.zoom = o, this
                },
                _sub: function(o) {
                    return o = o.zoomTo(this.zoom), this.column -= o.column, this.row -= o.row, this
                }
            };
        }, {}],
        10: [function(require, module, exports) {
            "use strict";

            function LngLat(t, n) {
                if (isNaN(t) || isNaN(n)) throw new Error("Invalid LngLat object: (" + t + ", " + n + ")");
                console.log('what the fuck'); console.log(this.lng); console.log(this.lat);
                if (this.lng = +t, this.lat = +n, this.lat > 90 || this.lat < -90) throw new Error("Invalid LngLat latitude value: must be between -90 and 90 MotherFucker:  " + this.lat + ', ' + this.lng)
            }
            module.exports = LngLat;
            var wrap = require("../util/util").wrap;
            LngLat.prototype.wrap = function() {
                return new LngLat(wrap(this.lng, -180, 180), this.lat)
            }, LngLat.prototype.toArray = function() {
                return [this.lng, this.lat]
            }, LngLat.prototype.toString = function() {
                return "LngLat(" + this.lng + ", " + this.lat + ")"
            }, LngLat.convert = function(t) {
                return t instanceof LngLat ? t : Array.isArray(t) ? new LngLat(t[0], t[1]) : t
            };
        }, {
            "../util/util": 95
        }],
        11: [function(require, module, exports) {
            "use strict";

            function LngLatBounds(t, n) {
                if (t)
                    for (var e = n ? [t, n] : t, s = 0, r = e.length; r > s; s++) this.extend(e[s])
            }
            module.exports = LngLatBounds;
            var LngLat = require("./lng_lat");
            LngLatBounds.prototype = {
                extend: function(t) {
                    var n, e, s = this._sw,
                        r = this._ne;
                    if (t instanceof LngLat) n = t, e = t;
                    else {
                        if (!(t instanceof LngLatBounds)) return t ? this.extend(LngLat.convert(t) || LngLatBounds.convert(t)) : this;
                        if (n = t._sw, e = t._ne, !n || !e) return this
                    }
                    return s || r ? (s.lng = Math.min(n.lng, s.lng), s.lat = Math.min(n.lat, s.lat), r.lng = Math.max(e.lng, r.lng), r.lat = Math.max(e.lat, r.lat)) : (this._sw = new LngLat(n.lng, n.lat), this._ne = new LngLat(e.lng, e.lat)), this
                },
                getCenter: function() {
                    return new LngLat((this._sw.lng + this._ne.lng) / 2, (this._sw.lat + this._ne.lat) / 2)
                },
                getSouthWest: function() {
                    return this._sw
                },
                getNorthEast: function() {
                    return this._ne
                },
                getNorthWest: function() {
                    return new LngLat(this.getWest(), this.getNorth())
                },
                getSouthEast: function() {
                    return new LngLat(this.getEast(), this.getSouth())
                },
                getWest: function() {
                    return this._sw.lng
                },
                getSouth: function() {
                    return this._sw.lat
                },
                getEast: function() {
                    return this._ne.lng
                },
                getNorth: function() {
                    return this._ne.lat
                },
                toArray: function() {
                    return [this._sw.toArray(), this._ne.toArray()]
                },
                toString: function() {
                    return "LngLatBounds(" + this._sw.toString() + ", " + this._ne.toString() + ")"
                }
            }, LngLatBounds.convert = function(t) {
                return !t || t instanceof LngLatBounds ? t : new LngLatBounds(t)
            };
        }, {
            "./lng_lat": 10
        }],
        12: [function(require, module, exports) {
            "use strict";

            function Transform(t, i) {
                this.tileSize = 512, this._minZoom = t || 0, this._maxZoom = i || 22, this.latRange = [-85.05113, 85.05113], this.width = 0, this.height = 0, this._center = new LngLat(0, 0), this.zoom = 0, this.angle = 0, this._altitude = 1.5, this._pitch = 0, this._unmodified = !0
            }
            var LngLat = require("./lng_lat"),
                Point = require("point-geometry"),
                Coordinate = require("./coordinate"),
                wrap = require("../util/util").wrap,
                interp = require("../util/interpolate"),
                glmatrix = require("gl-matrix"),
                vec4 = glmatrix.vec4,
                mat4 = glmatrix.mat4,
                mat2 = glmatrix.mat2;
            module.exports = Transform, Transform.prototype = {get minZoom() {
                    return this._minZoom
                },
                set minZoom(t) {
                    this._minZoom !== t && (this._minZoom = t, this.zoom = Math.max(this.zoom, t))
                },
                get maxZoom() {
                    return this._maxZoom
                },
                set maxZoom(t) {
                    this._maxZoom !== t && (this._maxZoom = t, this.zoom = Math.min(this.zoom, t))
                },
                get worldSize() {
                    return this.tileSize * this.scale
                },
                get centerPoint() {
                    return this.size._div(2)
                },
                get size() {
                    return new Point(this.width, this.height)
                },
                get bearing() {
                    return -this.angle / Math.PI * 180
                },
                set bearing(t) {
                    var i = -wrap(t, -180, 180) * Math.PI / 180;
                    this.angle !== i && (this._unmodified = !1, this.angle = i, this._calcProjMatrix(), this.rotationMatrix = mat2.create(), mat2.rotate(this.rotationMatrix, this.rotationMatrix, this.angle))
                },
                get pitch() {
                    return this._pitch / Math.PI * 180
                },
                set pitch(t) {
                    var i = Math.min(60, t) / 180 * Math.PI;
                    this._pitch !== i && (this._unmodified = !1, this._pitch = i, this._calcProjMatrix())
                },
                get altitude() {
                    return this._altitude
                },
                set altitude(t) {
                    var i = Math.max(.75, t);
                    this._altitude !== i && (this._unmodified = !1, this._altitude = i, this._calcProjMatrix())
                },
                get zoom() {
                    return this._zoom
                },
                set zoom(t) {
                    var i = Math.min(Math.max(t, this.minZoom), this.maxZoom);
                    this._zoom !== i && (this._unmodified = !1, this._zoom = i, this.scale = this.zoomScale(i), this.tileZoom = Math.floor(i), this.zoomFraction = i - this.tileZoom, this._calcProjMatrix(), this._constrain())
                },
                get center() {
                    return this._center
                },
                set center(t) {
                    (t.lat !== this._center.lat || t.lng !== this._center.lng) && (this._unmodified = !1, this._center = t, this._calcProjMatrix(), this._constrain())
                },
                resize: function(t, i) {
                    this.width = t, this.height = i, this.exMatrix = mat4.create(), mat4.ortho(this.exMatrix, 0, t, i, 0, 0, -1), this._calcProjMatrix(), this._constrain()
                },
                get unmodified() {
                    return this._unmodified
                },
                zoomScale: function(t) {
                    return Math.pow(2, t)
                },
                scaleZoom: function(t) {
                    return Math.log(t) / Math.LN2
                },
                project: function(t, i) {
                    return new Point(this.lngX(t.lng, i), this.latY(t.lat, i))
                },
                unproject: function(t, i) {
                    return new LngLat(this.xLng(t.x, i), this.yLat(t.y, i))
                },
                get x() {
                    return this.lngX(this.center.lng)
                },
                get y() {
                    return this.latY(this.center.lat)
                },
                get point() {
                    return new Point(this.x, this.y)
                },
                lngX: function(t, i) {
                    return (180 + t) * (i || this.worldSize) / 360
                },
                latY: function(t, i) {
                    var n = 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + t * Math.PI / 360));
                    return (180 - n) * (i || this.worldSize) / 360
                },
                xLng: function(t, i) {
                    return 360 * t / (i || this.worldSize) - 180
                },
                yLat: function(t, i) {
                    var n = 180 - 360 * t / (i || this.worldSize);
                    return 360 / Math.PI * Math.atan(Math.exp(n * Math.PI / 180)) - 90
                },
                panBy: function(t) {
                    var i = this.centerPoint._add(t);
                    this.center = this.pointLocation(i)
                },
                setLocationAtPoint: function(t, i) {
                    var n = this.locationCoordinate(t),
                        o = this.pointCoordinate(i),
                        e = this.pointCoordinate(this.centerPoint),
                        a = o._sub(n);
                    this._unmodified = !1, this.center = this.coordinateLocation(e._sub(a))
                },
                setZoomAround: function(t, i) {
                    var n;
                    i && (n = this.locationPoint(i)), this.zoom = t, i && this.setLocationAtPoint(i, n)
                },
                setBearingAround: function(t, i) {
                    var n;
                    i && (n = this.locationPoint(i)), this.bearing = t, i && this.setLocationAtPoint(i, n)
                },
                locationPoint: function(t) {
                    return this.coordinatePoint(this.locationCoordinate(t))
                },
                pointLocation: function(t) {
                    return this.coordinateLocation(this.pointCoordinate(t))
                },
                locationCoordinate: function(t) {
                    var i = this.zoomScale(this.tileZoom) / this.worldSize,
                        n = LngLat.convert(t);
                    return new Coordinate(this.lngX(n.lng) * i, this.latY(n.lat) * i, this.tileZoom)
                },
                coordinateLocation: function(t) {
                    var i = this.zoomScale(t.zoom);
                    return new LngLat(this.xLng(t.column, i), this.yLat(t.row, i))
                },
                pointCoordinate: function(t, i) {
                    void 0 === i && (i = 0);
                    var n = this.coordinatePointMatrix(this.tileZoom);
                    if (mat4.invert(n, n), !n) throw new Error("failed to invert matrix");
                    var o = [t.x, t.y, 0, 1],
                        e = [t.x, t.y, 1, 1];
                    vec4.transformMat4(o, o, n), vec4.transformMat4(e, e, n);
                    var a = o[3],
                        r = e[3],
                        h = o[0] / a,
                        s = e[0] / r,
                        c = o[1] / a,
                        u = e[1] / r,
                        l = o[2] / a,
                        m = e[2] / r,
                        g = l === m ? 0 : (i - l) / (m - l);
                    return new Coordinate(interp(h, s, g), interp(c, u, g), this.tileZoom)
                },
                coordinatePoint: function(t) {
                    var i = this.coordinatePointMatrix(t.zoom),
                        n = [t.column, t.row, 0, 1];
                    return vec4.transformMat4(n, n, i), new Point(n[0] / n[3], n[1] / n[3])
                },
                coordinatePointMatrix: function(t) {
                    var i = mat4.copy(new Float64Array(16), this.projMatrix),
                        n = this.worldSize / this.zoomScale(t);
                    return mat4.scale(i, i, [n, n, 1]), mat4.multiply(i, this.getPixelMatrix(), i), i
                },
                getPixelMatrix: function() {
                    var t = mat4.create();
                    return mat4.scale(t, t, [this.width / 2, -this.height / 2, 1]), mat4.translate(t, t, [1, -1, 0]), t
                },
                _constrain: function() {
                    if (this.center && this.width && this.height && !this._constraining) {
                        this._constraining = !0;
                        var t, i, n, o, e, a, r, h, s = this.size,
                            c = this._unmodified;
                        this.latRange && (t = this.latY(this.latRange[1]), i = this.latY(this.latRange[0]), e = i - t < s.y ? s.y / (i - t) : 0), this.lngRange && (n = this.lngX(this.lngRange[0]), o = this.lngX(this.lngRange[1]), a = o - n < s.x ? s.x / (o - n) : 0);
                        var u = Math.max(a || 0, e || 0);
                        if (u) return this.center = this.unproject(new Point(a ? (o + n) / 2 : this.x, e ? (i + t) / 2 : this.y)), this.zoom += this.scaleZoom(u), this._unmodified = c, void(this._constraining = !1);
                        if (this.latRange) {
                            var l = this.y,
                                m = s.y / 2;
                            t > l - m && (h = t + m), l + m > i && (h = i - m)
                        }
                        if (this.lngRange) {
                            var g = this.x,
                                d = s.x / 2;
                            n > g - d && (r = n + d), g + d > o && (r = o - d)
                        }(void 0 !== r || void 0 !== h) && (this.center = this.unproject(new Point(void 0 !== r ? r : this.x, void 0 !== h ? h : this.y))), this._unmodified = c, this._constraining = !1
                    }
                },
                _calcProjMatrix: function() {
                    var t = new Float64Array(16),
                        i = Math.atan(.5 / this.altitude),
                        n = Math.sin(i) * this.altitude / Math.sin(Math.PI / 2 - this._pitch - i),
                        o = Math.cos(Math.PI / 2 - this._pitch) * n + this.altitude;
                    mat4.perspective(t, 2 * Math.atan(this.height / 2 / this.altitude), this.width / this.height, .1, o), mat4.translate(t, t, [0, 0, -this.altitude]), mat4.scale(t, t, [1, -1, 1 / this.height]), mat4.rotateX(t, t, this._pitch), mat4.rotateZ(t, t, this.angle), mat4.translate(t, t, [-this.x, -this.y, 0]), this.projMatrix = t
                }
            };
        }, {
            "../util/interpolate": 91,
            "../util/util": 95,
            "./coordinate": 9,
            "./lng_lat": 10,
            "gl-matrix": 110,
            "point-geometry": 131
        }],
        13: [function(require, module, exports) {
            "use strict";
            var simplexFont = {
                " ": [16, []],
                "!": [10, [5, 21, 5, 7, -1, -1, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2]],
                '"': [16, [4, 21, 4, 14, -1, -1, 12, 21, 12, 14]],
                "#": [21, [11, 25, 4, -7, -1, -1, 17, 25, 10, -7, -1, -1, 4, 12, 18, 12, -1, -1, 3, 6, 17, 6]],
                $: [20, [8, 25, 8, -4, -1, -1, 12, 25, 12, -4, -1, -1, 17, 18, 15, 20, 12, 21, 8, 21, 5, 20, 3, 18, 3, 16, 4, 14, 5, 13, 7, 12, 13, 10, 15, 9, 16, 8, 17, 6, 17, 3, 15, 1, 12, 0, 8, 0, 5, 1, 3, 3]],
                "%": [24, [21, 21, 3, 0, -1, -1, 8, 21, 10, 19, 10, 17, 9, 15, 7, 14, 5, 14, 3, 16, 3, 18, 4, 20, 6, 21, 8, 21, 10, 20, 13, 19, 16, 19, 19, 20, 21, 21, -1, -1, 17, 7, 15, 6, 14, 4, 14, 2, 16, 0, 18, 0, 20, 1, 21, 3, 21, 5, 19, 7, 17, 7]],
                "&": [26, [23, 12, 23, 13, 22, 14, 21, 14, 20, 13, 19, 11, 17, 6, 15, 3, 13, 1, 11, 0, 7, 0, 5, 1, 4, 2, 3, 4, 3, 6, 4, 8, 5, 9, 12, 13, 13, 14, 14, 16, 14, 18, 13, 20, 11, 21, 9, 20, 8, 18, 8, 16, 9, 13, 11, 10, 16, 3, 18, 1, 20, 0, 22, 0, 23, 1, 23, 2]],
                "'": [10, [5, 19, 4, 20, 5, 21, 6, 20, 6, 18, 5, 16, 4, 15]],
                "(": [14, [11, 25, 9, 23, 7, 20, 5, 16, 4, 11, 4, 7, 5, 2, 7, -2, 9, -5, 11, -7]],
                ")": [14, [3, 25, 5, 23, 7, 20, 9, 16, 10, 11, 10, 7, 9, 2, 7, -2, 5, -5, 3, -7]],
                "*": [16, [8, 21, 8, 9, -1, -1, 3, 18, 13, 12, -1, -1, 13, 18, 3, 12]],
                "+": [26, [13, 18, 13, 0, -1, -1, 4, 9, 22, 9]],
                ",": [10, [6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6, -1, 5, -3, 4, -4]],
                "-": [26, [4, 9, 22, 9]],
                ".": [10, [5, 2, 4, 1, 5, 0, 6, 1, 5, 2]],
                "/": [22, [20, 25, 2, -7]],
                0: [20, [9, 21, 6, 20, 4, 17, 3, 12, 3, 9, 4, 4, 6, 1, 9, 0, 11, 0, 14, 1, 16, 4, 17, 9, 17, 12, 16, 17, 14, 20, 11, 21, 9, 21]],
                1: [20, [6, 17, 8, 18, 11, 21, 11, 0]],
                2: [20, [4, 16, 4, 17, 5, 19, 6, 20, 8, 21, 12, 21, 14, 20, 15, 19, 16, 17, 16, 15, 15, 13, 13, 10, 3, 0, 17, 0]],
                3: [20, [5, 21, 16, 21, 10, 13, 13, 13, 15, 12, 16, 11, 17, 8, 17, 6, 16, 3, 14, 1, 11, 0, 8, 0, 5, 1, 4, 2, 3, 4]],
                4: [20, [13, 21, 3, 7, 18, 7, -1, -1, 13, 21, 13, 0]],
                5: [20, [15, 21, 5, 21, 4, 12, 5, 13, 8, 14, 11, 14, 14, 13, 16, 11, 17, 8, 17, 6, 16, 3, 14, 1, 11, 0, 8, 0, 5, 1, 4, 2, 3, 4]],
                6: [20, [16, 18, 15, 20, 12, 21, 10, 21, 7, 20, 5, 17, 4, 12, 4, 7, 5, 3, 7, 1, 10, 0, 11, 0, 14, 1, 16, 3, 17, 6, 17, 7, 16, 10, 14, 12, 11, 13, 10, 13, 7, 12, 5, 10, 4, 7]],
                7: [20, [17, 21, 7, 0, -1, -1, 3, 21, 17, 21]],
                8: [20, [8, 21, 5, 20, 4, 18, 4, 16, 5, 14, 7, 13, 11, 12, 14, 11, 16, 9, 17, 7, 17, 4, 16, 2, 15, 1, 12, 0, 8, 0, 5, 1, 4, 2, 3, 4, 3, 7, 4, 9, 6, 11, 9, 12, 13, 13, 15, 14, 16, 16, 16, 18, 15, 20, 12, 21, 8, 21]],
                9: [20, [16, 14, 15, 11, 13, 9, 10, 8, 9, 8, 6, 9, 4, 11, 3, 14, 3, 15, 4, 18, 6, 20, 9, 21, 10, 21, 13, 20, 15, 18, 16, 14, 16, 9, 15, 4, 13, 1, 10, 0, 8, 0, 5, 1, 4, 3]],
                ":": [10, [5, 14, 4, 13, 5, 12, 6, 13, 5, 14, -1, -1, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2]],
                ";": [10, [5, 14, 4, 13, 5, 12, 6, 13, 5, 14, -1, -1, 6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6, -1, 5, -3, 4, -4]],
                "<": [24, [20, 18, 4, 9, 20, 0]],
                "=": [26, [4, 12, 22, 12, -1, -1, 4, 6, 22, 6]],
                ">": [24, [4, 18, 20, 9, 4, 0]],
                "?": [18, [3, 16, 3, 17, 4, 19, 5, 20, 7, 21, 11, 21, 13, 20, 14, 19, 15, 17, 15, 15, 14, 13, 13, 12, 9, 10, 9, 7, -1, -1, 9, 2, 8, 1, 9, 0, 10, 1, 9, 2]],
                "@": [27, [18, 13, 17, 15, 15, 16, 12, 16, 10, 15, 9, 14, 8, 11, 8, 8, 9, 6, 11, 5, 14, 5, 16, 6, 17, 8, -1, -1, 12, 16, 10, 14, 9, 11, 9, 8, 10, 6, 11, 5, -1, -1, 18, 16, 17, 8, 17, 6, 19, 5, 21, 5, 23, 7, 24, 10, 24, 12, 23, 15, 22, 17, 20, 19, 18, 20, 15, 21, 12, 21, 9, 20, 7, 19, 5, 17, 4, 15, 3, 12, 3, 9, 4, 6, 5, 4, 7, 2, 9, 1, 12, 0, 15, 0, 18, 1, 20, 2, 21, 3, -1, -1, 19, 16, 18, 8, 18, 6, 19, 5]],
                A: [18, [9, 21, 1, 0, -1, -1, 9, 21, 17, 0, -1, -1, 4, 7, 14, 7]],
                B: [21, [4, 21, 4, 0, -1, -1, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 15, 17, 13, 16, 12, 13, 11, -1, -1, 4, 11, 13, 11, 16, 10, 17, 9, 18, 7, 18, 4, 17, 2, 16, 1, 13, 0, 4, 0]],
                C: [21, [18, 16, 17, 18, 15, 20, 13, 21, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5]],
                D: [21, [4, 21, 4, 0, -1, -1, 4, 21, 11, 21, 14, 20, 16, 18, 17, 16, 18, 13, 18, 8, 17, 5, 16, 3, 14, 1, 11, 0, 4, 0]],
                E: [19, [4, 21, 4, 0, -1, -1, 4, 21, 17, 21, -1, -1, 4, 11, 12, 11, -1, -1, 4, 0, 17, 0]],
                F: [18, [4, 21, 4, 0, -1, -1, 4, 21, 17, 21, -1, -1, 4, 11, 12, 11]],
                G: [21, [18, 16, 17, 18, 15, 20, 13, 21, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 18, 8, -1, -1, 13, 8, 18, 8]],
                H: [22, [4, 21, 4, 0, -1, -1, 18, 21, 18, 0, -1, -1, 4, 11, 18, 11]],
                I: [8, [4, 21, 4, 0]],
                J: [16, [12, 21, 12, 5, 11, 2, 10, 1, 8, 0, 6, 0, 4, 1, 3, 2, 2, 5, 2, 7]],
                K: [21, [4, 21, 4, 0, -1, -1, 18, 21, 4, 7, -1, -1, 9, 12, 18, 0]],
                L: [17, [4, 21, 4, 0, -1, -1, 4, 0, 16, 0]],
                M: [24, [4, 21, 4, 0, -1, -1, 4, 21, 12, 0, -1, -1, 20, 21, 12, 0, -1, -1, 20, 21, 20, 0]],
                N: [22, [4, 21, 4, 0, -1, -1, 4, 21, 18, 0, -1, -1, 18, 21, 18, 0]],
                O: [22, [9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 19, 8, 19, 13, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21]],
                P: [21, [4, 21, 4, 0, -1, -1, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 14, 17, 12, 16, 11, 13, 10, 4, 10]],
                Q: [22, [9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 19, 8, 19, 13, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, -1, -1, 12, 4, 18, -2]],
                R: [21, [4, 21, 4, 0, -1, -1, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 15, 17, 13, 16, 12, 13, 11, 4, 11, -1, -1, 11, 11, 18, 0]],
                S: [20, [17, 18, 15, 20, 12, 21, 8, 21, 5, 20, 3, 18, 3, 16, 4, 14, 5, 13, 7, 12, 13, 10, 15, 9, 16, 8, 17, 6, 17, 3, 15, 1, 12, 0, 8, 0, 5, 1, 3, 3]],
                T: [16, [8, 21, 8, 0, -1, -1, 1, 21, 15, 21]],
                U: [22, [4, 21, 4, 6, 5, 3, 7, 1, 10, 0, 12, 0, 15, 1, 17, 3, 18, 6, 18, 21]],
                V: [18, [1, 21, 9, 0, -1, -1, 17, 21, 9, 0]],
                W: [24, [2, 21, 7, 0, -1, -1, 12, 21, 7, 0, -1, -1, 12, 21, 17, 0, -1, -1, 22, 21, 17, 0]],
                X: [20, [3, 21, 17, 0, -1, -1, 17, 21, 3, 0]],
                Y: [18, [1, 21, 9, 11, 9, 0, -1, -1, 17, 21, 9, 11]],
                Z: [20, [17, 21, 3, 0, -1, -1, 3, 21, 17, 21, -1, -1, 3, 0, 17, 0]],
                "[": [14, [4, 25, 4, -7, -1, -1, 5, 25, 5, -7, -1, -1, 4, 25, 11, 25, -1, -1, 4, -7, 11, -7]],
                "\\": [14, [0, 21, 14, -3]],
                "]": [14, [9, 25, 9, -7, -1, -1, 10, 25, 10, -7, -1, -1, 3, 25, 10, 25, -1, -1, 3, -7, 10, -7]],
                "^": [16, [6, 15, 8, 18, 10, 15, -1, -1, 3, 12, 8, 17, 13, 12, -1, -1, 8, 17, 8, 0]],
                _: [16, [0, -2, 16, -2]],
                "`": [10, [6, 21, 5, 20, 4, 18, 4, 16, 5, 15, 6, 16, 5, 17]],
                a: [19, [15, 14, 15, 0, -1, -1, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]],
                b: [19, [4, 21, 4, 0, -1, -1, 4, 11, 6, 13, 8, 14, 11, 14, 13, 13, 15, 11, 16, 8, 16, 6, 15, 3, 13, 1, 11, 0, 8, 0, 6, 1, 4, 3]],
                c: [18, [15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]],
                d: [19, [15, 21, 15, 0, -1, -1, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]],
                e: [18, [3, 8, 15, 8, 15, 10, 14, 12, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]],
                f: [12, [10, 21, 8, 21, 6, 20, 5, 17, 5, 0, -1, -1, 2, 14, 9, 14]],
                g: [19, [15, 14, 15, -2, 14, -5, 13, -6, 11, -7, 8, -7, 6, -6, -1, -1, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]],
                h: [19, [4, 21, 4, 0, -1, -1, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0]],
                i: [8, [3, 21, 4, 20, 5, 21, 4, 22, 3, 21, -1, -1, 4, 14, 4, 0]],
                j: [10, [5, 21, 6, 20, 7, 21, 6, 22, 5, 21, -1, -1, 6, 14, 6, -3, 5, -6, 3, -7, 1, -7]],
                k: [17, [4, 21, 4, 0, -1, -1, 14, 14, 4, 4, -1, -1, 8, 8, 15, 0]],
                l: [8, [4, 21, 4, 0]],
                m: [30, [4, 14, 4, 0, -1, -1, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0, -1, -1, 15, 10, 18, 13, 20, 14, 23, 14, 25, 13, 26, 10, 26, 0]],
                n: [19, [4, 14, 4, 0, -1, -1, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0]],
                o: [19, [8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3, 16, 6, 16, 8, 15, 11, 13, 13, 11, 14, 8, 14]],
                p: [19, [4, 14, 4, -7, -1, -1, 4, 11, 6, 13, 8, 14, 11, 14, 13, 13, 15, 11, 16, 8, 16, 6, 15, 3, 13, 1, 11, 0, 8, 0, 6, 1, 4, 3]],
                q: [19, [15, 14, 15, -7, -1, -1, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]],
                r: [13, [4, 14, 4, 0, -1, -1, 4, 8, 5, 11, 7, 13, 9, 14, 12, 14]],
                s: [17, [14, 11, 13, 13, 10, 14, 7, 14, 4, 13, 3, 11, 4, 9, 6, 8, 11, 7, 13, 6, 14, 4, 14, 3, 13, 1, 10, 0, 7, 0, 4, 1, 3, 3]],
                t: [12, [5, 21, 5, 4, 6, 1, 8, 0, 10, 0, -1, -1, 2, 14, 9, 14]],
                u: [19, [4, 14, 4, 4, 5, 1, 7, 0, 10, 0, 12, 1, 15, 4, -1, -1, 15, 14, 15, 0]],
                v: [16, [2, 14, 8, 0, -1, -1, 14, 14, 8, 0]],
                w: [22, [3, 14, 7, 0, -1, -1, 11, 14, 7, 0, -1, -1, 11, 14, 15, 0, -1, -1, 19, 14, 15, 0]],
                x: [17, [3, 14, 14, 0, -1, -1, 14, 14, 3, 0]],
                y: [16, [2, 14, 8, 0, -1, -1, 14, 14, 8, 0, 6, -4, 4, -6, 2, -7, 1, -7]],
                z: [17, [14, 14, 3, 0, -1, -1, 3, 14, 14, 14, -1, -1, 3, 0, 14, 0]],
                "{": [14, [9, 25, 7, 24, 6, 23, 5, 21, 5, 19, 6, 17, 7, 16, 8, 14, 8, 12, 6, 10, -1, -1, 7, 24, 6, 22, 6, 20, 7, 18, 8, 17, 9, 15, 9, 13, 8, 11, 4, 9, 8, 7, 9, 5, 9, 3, 8, 1, 7, 0, 6, -2, 6, -4, 7, -6, -1, -1, 6, 8, 8, 6, 8, 4, 7, 2, 6, 1, 5, -1, 5, -3, 6, -5, 7, -6, 9, -7]],
                "|": [8, [4, 25, 4, -7]],
                "}": [14, [5, 25, 7, 24, 8, 23, 9, 21, 9, 19, 8, 17, 7, 16, 6, 14, 6, 12, 8, 10, -1, -1, 7, 24, 8, 22, 8, 20, 7, 18, 6, 17, 5, 15, 5, 13, 6, 11, 10, 9, 6, 7, 5, 5, 5, 3, 6, 1, 7, 0, 8, -2, 8, -4, 7, -6, -1, -1, 8, 8, 6, 6, 6, 4, 7, 2, 8, 1, 9, -1, 9, -3, 8, -5, 7, -6, 5, -7]],
                "~": [24, [3, 6, 3, 8, 4, 11, 6, 12, 8, 12, 10, 11, 14, 8, 16, 7, 18, 7, 20, 8, 21, 10, -1, -1, 3, 8, 4, 10, 6, 11, 8, 11, 10, 10, 14, 7, 16, 6, 18, 6, 20, 7, 21, 10, 21, 12]]
            };
            module.exports = function(l, n, t, e) {
                e = e || 1;
                var r, o, u, s, i, x, f, p, h = [];
                for (r = 0, o = l.length; o > r; r++)
                    if (i = simplexFont[l[r]]) {
                        for (p = null, u = 0, s = i[1].length; s > u; u += 2) - 1 === i[1][u] && -1 === i[1][u + 1] ? p = null : (x = n + i[1][u] * e, f = t - i[1][u + 1] * e, p && h.push(p.x, p.y, x, f), p = {
                            x: x,
                            y: f
                        });
                        n += i[0] * e
                    }
                return h
            };
        }, {}],
        14: [function(require, module, exports) {
            "use strict";
            var mapboxgl = module.exports = {};
            mapboxgl.Map = require("./ui/map"), mapboxgl.Control = require("./ui/control/control"), mapboxgl.Navigation = require("./ui/control/navigation"), mapboxgl.Attribution = require("./ui/control/attribution"), mapboxgl.Popup = require("./ui/popup"), mapboxgl.GeoJSONSource = require("./source/geojson_source"), mapboxgl.VideoSource = require("./source/video_source"), mapboxgl.ImageSource = require("./source/image_source"), mapboxgl.Style = require("./style/style"), mapboxgl.LngLat = require("./geo/lng_lat"), mapboxgl.LngLatBounds = require("./geo/lng_lat_bounds"), mapboxgl.Point = require("point-geometry"), mapboxgl.Evented = require("./util/evented"), mapboxgl.util = require("./util/util"), mapboxgl.supported = require("./util/browser").supported;
            var ajax = require("./util/ajax");
            mapboxgl.util.getJSON = ajax.getJSON, mapboxgl.util.getArrayBuffer = ajax.getArrayBuffer;
            var config = require("./util/config");
            mapboxgl.config = config, Object.defineProperty(mapboxgl, "accessToken", {
                get: function() {
                    return config.ACCESS_TOKEN
                },
                set: function(e) {
                    config.ACCESS_TOKEN = e
                }
            });
        }, {
            "./geo/lng_lat": 10,
            "./geo/lng_lat_bounds": 11,
            "./source/geojson_source": 29,
            "./source/image_source": 31,
            "./source/video_source": 38,
            "./style/style": 46,
            "./ui/control/attribution": 68,
            "./ui/control/control": 69,
            "./ui/control/navigation": 70,
            "./ui/map": 80,
            "./ui/popup": 81,
            "./util/ajax": 83,
            "./util/browser": 84,
            "./util/config": 88,
            "./util/evented": 89,
            "./util/util": 95,
            "point-geometry": 131
        }],
        15: [function(require, module, exports) {
            "use strict";

            function drawBackground(t, a, r) {
                var e, i = t.gl,
                    o = a.paint["background-color"],
                    n = a.paint["background-pattern"],
                    l = a.paint["background-opacity"],
                    u = n ? t.spriteAtlas.getPosition(n.from, !0) : null,
                    m = n ? t.spriteAtlas.getPosition(n.to, !0) : null;
                if (u && m) {
                    e = t.patternShader, i.switchShader(e, r), i.uniform1i(e.u_image, 0), i.uniform2fv(e.u_pattern_tl_a, u.tl), i.uniform2fv(e.u_pattern_br_a, u.br), i.uniform2fv(e.u_pattern_tl_b, m.tl), i.uniform2fv(e.u_pattern_br_b, m.br), i.uniform1f(e.u_opacity, l);
                    var c = t.transform,
                        f = u.size,
                        s = m.size,
                        _ = c.locationCoordinate(c.center),
                        S = 1 / Math.pow(2, c.zoomFraction);
                    i.uniform1f(e.u_mix, n.t);
                    var d = mat3.create();
                    mat3.scale(d, d, [1 / (f[0] * n.fromScale), 1 / (f[1] * n.fromScale)]), mat3.translate(d, d, [_.column * c.tileSize % (f[0] * n.fromScale), _.row * c.tileSize % (f[1] * n.fromScale)]), mat3.rotate(d, d, -c.angle), mat3.scale(d, d, [S * c.width / 2, -S * c.height / 2]);
                    var p = mat3.create();
                    mat3.scale(p, p, [1 / (s[0] * n.toScale), 1 / (s[1] * n.toScale)]), mat3.translate(p, p, [_.column * c.tileSize % (s[0] * n.toScale), _.row * c.tileSize % (s[1] * n.toScale)]), mat3.rotate(p, p, -c.angle), mat3.scale(p, p, [S * c.width / 2, -S * c.height / 2]), i.uniformMatrix3fv(e.u_patternmatrix_a, !1, d), i.uniformMatrix3fv(e.u_patternmatrix_b, !1, p), t.spriteAtlas.bind(i, !0)
                } else e = t.fillShader, i.switchShader(e, r), i.uniform4fv(e.u_color, o);
                i.disable(i.STENCIL_TEST), i.bindBuffer(i.ARRAY_BUFFER, t.backgroundBuffer), i.vertexAttribPointer(e.a_pos, t.backgroundBuffer.itemSize, i.SHORT, !1, 0, 0), i.drawArrays(i.TRIANGLE_STRIP, 0, t.backgroundBuffer.itemCount), i.enable(i.STENCIL_TEST), i.stencilMask(0), i.stencilFunc(i.EQUAL, 128, 128)
            }
            var mat3 = require("gl-matrix").mat3;
            module.exports = drawBackground;
        }, {
            "gl-matrix": 110
        }],
        16: [function(require, module, exports) {
            "use strict";

            function drawCircles(e, r, i, t) {
                if (t.buffers && (i = e.translateMatrix(i, t, r.paint["circle-translate"], r.paint["circle-translate-anchor"]), t.elementGroups[r.ref || r.id])) {
                    var a = t.elementGroups[r.ref || r.id].circle,
                        l = e.gl;
                    l.disable(l.STENCIL_TEST), l.switchShader(e.circleShader, i, t.exMatrix);
                    var c = t.buffers.circleVertex,
                        n = e.circleShader,
                        s = t.buffers.circleElement,
                        u = 1 / browser.devicePixelRatio / r.paint["circle-radius"];
                    l.uniform4fv(n.u_color, r.paint["circle-color"]), l.uniform1f(n.u_blur, Math.max(r.paint["circle-blur"], u)), l.uniform1f(n.u_size, r.paint["circle-radius"]);
                    for (var o = 0; o < a.groups.length; o++) {
                        var d = a.groups[o],
                            f = d.vertexStartIndex * c.itemSize;
                        c.bind(l), c.setAttribPointers(l, n, f), s.bind(l);
                        var S = 3 * d.elementLength,
                            b = d.elementStartIndex * s.itemSize;
                        l.drawElements(l.TRIANGLES, S, l.UNSIGNED_SHORT, b)
                    }
                    l.enable(l.STENCIL_TEST)
                }
            }
            var browser = require("../util/browser.js");
            module.exports = drawCircles;
        }, {
            "../util/browser.js": 84
        }],
        17: [function(require, module, exports) {
            "use strict";

            function drawPlacementDebug(o, r, e, t) {
                var i = t.elementGroups[r.ref || r.id].collisionBox;
                if (i) {
                    var a = o.gl,
                        n = t.buffers.collisionBoxVertex,
                        s = o.collisionBoxShader;
                    a.enable(a.STENCIL_TEST), a.switchShader(s, e), n.bind(a), n.setAttribPointers(a, s, 0), a.lineWidth(1), a.uniform1f(s.u_scale, Math.pow(2, o.transform.zoom - t.coord.z)), a.uniform1f(s.u_zoom, 10 * o.transform.zoom), a.uniform1f(s.u_maxzoom, 10 * (t.coord.z + 1));
                    var l = i.groups[0].vertexStartIndex,
                        u = i.groups[0].vertexLength;
                    a.drawArrays(a.LINES, l, u), a.disable(a.STENCIL_TEST)
                }
            }
            module.exports = drawPlacementDebug;
        }, {}],
        18: [function(require, module, exports) {
            "use strict";

            function drawDebug(e, r) {
                var t = e.gl;
                t.blendFunc(t.ONE, t.ONE_MINUS_SRC_ALPHA), t.switchShader(e.debugShader, r.posMatrix), t.bindBuffer(t.ARRAY_BUFFER, e.debugBuffer), t.vertexAttribPointer(e.debugShader.a_pos, e.debugBuffer.itemSize, t.SHORT, !1, 0, 0), t.uniform4f(e.debugShader.u_color, 1, 0, 0, 1), t.lineWidth(4), t.drawArrays(t.LINE_STRIP, 0, e.debugBuffer.itemCount);
                var i = textVertices(r.coord.toString(), 50, 200, 5);
                t.bindBuffer(t.ARRAY_BUFFER, e.debugTextBuffer), t.bufferData(t.ARRAY_BUFFER, new Int16Array(i), t.STREAM_DRAW), t.vertexAttribPointer(e.debugShader.a_pos, e.debugTextBuffer.itemSize, t.SHORT, !1, 0, 0), t.lineWidth(8 * browser.devicePixelRatio), t.uniform4f(e.debugShader.u_color, 1, 1, 1, 1), t.drawArrays(t.LINES, 0, i.length / e.debugTextBuffer.itemSize), t.lineWidth(2 * browser.devicePixelRatio), t.uniform4f(e.debugShader.u_color, 0, 0, 0, 1), t.drawArrays(t.LINES, 0, i.length / e.debugTextBuffer.itemSize), t.blendFunc(t.ONE_MINUS_DST_ALPHA, t.ONE)
            }
            var textVertices = require("../lib/debugtext"),
                browser = require("../util/browser");
            module.exports = drawDebug;
        }, {
            "../lib/debugtext": 13,
            "../util/browser": 84
        }],
        19: [function(require, module, exports) {
            "use strict";

            function drawFill(e, t, r, i) {
                if (i.buffers && i.elementGroups[t.ref || t.id]) {
                    var a, l, n, f, o = i.elementGroups[t.ref || t.id].fill,
                        s = e.gl,
                        u = e.translateMatrix(r, i, t.paint["fill-translate"], t.paint["fill-translate-anchor"]),
                        c = t.paint["fill-color"];
                    s.stencilMask(63), s.clear(s.STENCIL_BUFFER_BIT), s.stencilFunc(s.NOTEQUAL, 128, 128), s.stencilOpSeparate(s.FRONT, s.INCR_WRAP, s.KEEP, s.KEEP), s.stencilOpSeparate(s.BACK, s.DECR_WRAP, s.KEEP, s.KEEP), s.colorMask(!1, !1, !1, !1), s.switchShader(e.fillShader, u), a = i.buffers.fillVertex, a.bind(s), l = i.buffers.fillElement, l.bind(s);
                    for (var m, d, E = 0; E < o.groups.length; E++) n = o.groups[E], m = n.vertexStartIndex * a.itemSize, a.setAttribPointers(s, e.fillShader, m), f = 3 * n.elementLength, d = n.elementStartIndex * l.itemSize, s.drawElements(s.TRIANGLES, f, s.UNSIGNED_SHORT, d);
                    s.colorMask(!0, !0, !0, !0), s.stencilOp(s.KEEP, s.KEEP, s.KEEP), s.stencilMask(0);
                    var S = t.paint["fill-outline-color"];
                    if (t.paint["fill-antialias"] === !0 && (!t.paint["fill-pattern"] || S)) {
                        s.switchShader(e.outlineShader, u), s.lineWidth(2 * browser.devicePixelRatio), S ? s.stencilFunc(s.EQUAL, 128, 128) : s.stencilFunc(s.EQUAL, 128, 191), s.uniform2f(e.outlineShader.u_world, s.drawingBufferWidth, s.drawingBufferHeight), s.uniform4fv(e.outlineShader.u_color, S ? S : c), a = i.buffers.fillVertex, l = i.buffers.fillSecondElement, l.bind(s);
                        for (var p = 0; p < o.groups.length; p++) n = o.groups[p], m = n.vertexStartIndex * a.itemSize, a.setAttribPointers(s, e.outlineShader, m), f = 2 * n.secondElementLength, d = n.secondElementStartIndex * l.itemSize, s.drawElements(s.LINES, f, s.UNSIGNED_SHORT, d)
                    }
                    var _, h = t.paint["fill-pattern"],
                        b = t.paint["fill-opacity"] || 1;
                    if (h) {
                        var x = e.spriteAtlas.getPosition(h.from, !0),
                            v = e.spriteAtlas.getPosition(h.to, !0);
                        if (!x || !v) return;
                        _ = e.patternShader, s.switchShader(_, r), s.uniform1i(_.u_image, 0), s.uniform2fv(_.u_pattern_tl_a, x.tl), s.uniform2fv(_.u_pattern_br_a, x.br), s.uniform2fv(_.u_pattern_tl_b, v.tl), s.uniform2fv(_.u_pattern_br_b, v.br), s.uniform1f(_.u_opacity, b), s.uniform1f(_.u_mix, h.t);
                        var A = i.tileExtent / i.tileSize / Math.pow(2, e.transform.tileZoom - i.coord.z),
                            g = mat3.create();
                        mat3.scale(g, g, [1 / (x.size[0] * A * h.fromScale), 1 / (x.size[1] * A * h.fromScale)]);
                        var w = mat3.create();
                        mat3.scale(w, w, [1 / (v.size[0] * A * h.toScale), 1 / (v.size[1] * A * h.toScale)]), s.uniformMatrix3fv(_.u_patternmatrix_a, !1, g), s.uniformMatrix3fv(_.u_patternmatrix_b, !1, w), e.spriteAtlas.bind(s, !0)
                    } else _ = e.fillShader, s.switchShader(_, r), s.uniform4fv(_.u_color, c);
                    s.stencilFunc(s.NOTEQUAL, 0, 63), s.bindBuffer(s.ARRAY_BUFFER, e.tileExtentBuffer), s.vertexAttribPointer(_.a_pos, e.tileExtentBuffer.itemSize, s.SHORT, !1, 0, 0), s.drawArrays(s.TRIANGLE_STRIP, 0, e.tileExtentBuffer.itemCount), s.stencilMask(0), s.stencilFunc(s.EQUAL, 128, 128)
                }
            }
            var browser = require("../util/browser"),
                mat3 = require("gl-matrix").mat3;
            module.exports = drawFill;
        }, {
            "../util/browser": 84,
            "gl-matrix": 110
        }],
        20: [function(require, module, exports) {
            "use strict";
            var browser = require("../util/browser"),
                mat2 = require("gl-matrix").mat2;
            module.exports = function(t, i, e, r) {
                if (r.buffers && r.elementGroups[i.ref || i.id]) {
                    var a = r.elementGroups[i.ref || i.id].line,
                        n = t.gl;
                    if (!(i.paint["line-width"] <= 0)) {
                        var f = 1 / browser.devicePixelRatio,
                            o = i.paint["line-blur"] + f,
                            l = i.paint["line-width"] / 2,
                            u = -1,
                            s = 0,
                            m = 0;
                        i.paint["line-gap-width"] > 0 && (u = i.paint["line-gap-width"] / 2 + .5 * f, l = i.paint["line-width"], s = u - f / 2);
                        var _ = s + l + f / 2 + m,
                            h = i.paint["line-color"],
                            d = t.transform.scale / (1 << r.coord.z) / (r.tileExtent / r.tileSize),
                            p = t.translateMatrix(e, r, i.paint["line-translate"], i.paint["line-translate-anchor"]),
                            c = t.transform,
                            v = mat2.create();
                        mat2.scale(v, v, [1, Math.cos(c._pitch)]), mat2.rotate(v, v, t.transform.angle);
                        var x, b = Math.sqrt(c.height * c.height / 4 * (1 + c.altitude * c.altitude)),
                            w = c.height / 2 * Math.tan(c._pitch),
                            g = (b + w) / b - 1,
                            S = r.tileSize / t.transform.tileSize,
                            M = i.paint["line-dasharray"],
                            z = i.paint["line-pattern"];
                        if (M) {
                            x = t.linesdfpatternShader, n.switchShader(x, p, r.exMatrix), n.uniform2fv(x.u_linewidth, [_, u]), n.uniform1f(x.u_ratio, d), n.uniform1f(x.u_blur, o), n.uniform4fv(x.u_color, h);
                            var A = t.lineAtlas.getDash(M.from, "round" === i.layout["line-cap"]),
                                y = t.lineAtlas.getDash(M.to, "round" === i.layout["line-cap"]);
                            t.lineAtlas.bind(n);
                            var E = Math.pow(2, Math.floor(Math.log(t.transform.scale) / Math.LN2) - r.coord.z) / 8 * S,
                                P = [E / A.width / M.fromScale, -A.height / 2],
                                R = t.lineAtlas.width / (M.fromScale * A.width * 256 * browser.devicePixelRatio) / 2,
                                G = [E / y.width / M.toScale, -y.height / 2],
                                I = t.lineAtlas.width / (M.toScale * y.width * 256 * browser.devicePixelRatio) / 2;
                            n.uniform2fv(x.u_patternscale_a, P), n.uniform1f(x.u_tex_y_a, A.y), n.uniform2fv(x.u_patternscale_b, G), n.uniform1f(x.u_tex_y_b, y.y), n.uniform1i(x.u_image, 0), n.uniform1f(x.u_sdfgamma, Math.max(R, I)), n.uniform1f(x.u_mix, M.t), n.uniform1f(x.u_extra, g), n.uniform1f(x.u_offset, -i.paint["line-offset"]), n.uniformMatrix2fv(x.u_antialiasingmatrix, !1, v)
                        } else if (z) {
                            var N = t.spriteAtlas.getPosition(z.from, !0),
                                q = t.spriteAtlas.getPosition(z.to, !0);
                            if (!N || !q) return;
                            var D = r.tileExtent / r.tileSize / Math.pow(2, t.transform.tileZoom - r.coord.z) * S;
                            t.spriteAtlas.bind(n, !0), x = t.linepatternShader, n.switchShader(x, p, r.exMatrix), n.uniform2fv(x.u_linewidth, [_, u]), n.uniform1f(x.u_ratio, d), n.uniform1f(x.u_blur, o), n.uniform2fv(x.u_pattern_size_a, [N.size[0] * D * z.fromScale, q.size[1]]), n.uniform2fv(x.u_pattern_size_b, [q.size[0] * D * z.toScale, q.size[1]]), n.uniform2fv(x.u_pattern_tl_a, N.tl), n.uniform2fv(x.u_pattern_br_a, N.br), n.uniform2fv(x.u_pattern_tl_b, q.tl), n.uniform2fv(x.u_pattern_br_b, q.br), n.uniform1f(x.u_fade, z.t), n.uniform1f(x.u_opacity, i.paint["line-opacity"]), n.uniform1f(x.u_extra, g), n.uniform1f(x.u_offset, -i.paint["line-offset"]), n.uniformMatrix2fv(x.u_antialiasingmatrix, !1, v)
                        } else x = t.lineShader, n.switchShader(x, p, r.exMatrix), n.uniform2fv(x.u_linewidth, [_, u]), n.uniform1f(x.u_ratio, d), n.uniform1f(x.u_blur, o), n.uniform1f(x.u_extra, g), n.uniform1f(x.u_offset, -i.paint["line-offset"]), n.uniformMatrix2fv(x.u_antialiasingmatrix, !1, v), n.uniform4fv(x.u_color, h);
                        var L = r.buffers.lineVertex;
                        L.bind(n);
                        var T = r.buffers.lineElement;
                        T.bind(n);
                        for (var H = 0; H < a.groups.length; H++) {
                            var O = a.groups[H],
                                U = O.vertexStartIndex * L.itemSize;
                            L.setAttribPointers(n, x, U);
                            var V = 3 * O.elementLength,
                                Z = O.elementStartIndex * T.itemSize;
                            n.drawElements(n.TRIANGLES, V, n.UNSIGNED_SHORT, Z)
                        }
                    }
                }
            };
        }, {
            "../util/browser": 84,
            "gl-matrix": 110
        }],
        21: [function(require, module, exports) {
            "use strict";

            function drawRaster(t, r, e, a) {
                var i = t.gl;
                i.disable(i.STENCIL_TEST);
                var o = t.rasterShader;
                i.switchShader(o, e), i.uniform1f(o.u_brightness_low, r.paint["raster-brightness-min"]), i.uniform1f(o.u_brightness_high, r.paint["raster-brightness-max"]), i.uniform1f(o.u_saturation_factor, saturationFactor(r.paint["raster-saturation"])), i.uniform1f(o.u_contrast_factor, contrastFactor(r.paint["raster-contrast"])), i.uniform3fv(o.u_spin_weights, spinWeights(r.paint["raster-hue-rotate"]));
                var n, u, s = a.source && a.source._pyramid.findLoadedParent(a.coord, 0, {}),
                    c = getOpacities(a, s, r, t.transform);
                i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, a.texture), s ? (i.activeTexture(i.TEXTURE1), i.bindTexture(i.TEXTURE_2D, s.texture), n = Math.pow(2, s.coord.z - a.coord.z), u = [a.coord.x * n % 1, a.coord.y * n % 1]) : c[1] = 0, i.uniform2fv(o.u_tl_parent, u || [0, 0]), i.uniform1f(o.u_scale_parent, n || 1), i.uniform1f(o.u_buffer_scale, 1), i.uniform1f(o.u_opacity0, c[0]), i.uniform1f(o.u_opacity1, c[1]), i.uniform1i(o.u_image0, 0), i.uniform1i(o.u_image1, 1), i.bindBuffer(i.ARRAY_BUFFER, a.boundsBuffer || t.tileExtentBuffer), i.vertexAttribPointer(o.a_pos, 2, i.SHORT, !1, 8, 0), i.vertexAttribPointer(o.a_texture_pos, 2, i.SHORT, !1, 8, 4), i.drawArrays(i.TRIANGLE_STRIP, 0, 4), i.enable(i.STENCIL_TEST)
            }

            function spinWeights(t) {
                t *= Math.PI / 180;
                var r = Math.sin(t),
                    e = Math.cos(t);
                return [(2 * e + 1) / 3, (-Math.sqrt(3) * r - e + 1) / 3, (Math.sqrt(3) * r - e + 1) / 3]
            }

            function contrastFactor(t) {
                return t > 0 ? 1 / (1 - t) : 1 + t
            }

            function saturationFactor(t) {
                return t > 0 ? 1 - 1 / (1.001 - t) : -t
            }

            function getOpacities(t, r, e, a) {
                var i = [1, 0];
                if (t.source) {
                    var o = (new Date).getTime(),
                        n = e.paint["raster-fade-duration"],
                        u = (o - t.timeAdded) / n,
                        s = r ? (o - r.timeAdded) / n : -1,
                        c = t.source._pyramid.coveringZoomLevel(a),
                        f = r ? Math.abs(r.coord.z - c) > Math.abs(t.coord.z - c) : !1;
                    !r || f ? (i[0] = util.clamp(u, 0, 1), i[1] = 1 - i[0]) : (i[0] = util.clamp(1 - s, 0, 1), i[1] = 1 - i[0])
                }
                var d = e.paint["raster-opacity"];
                return i[0] *= d, i[1] *= d, i
            }
            var util = require("../util/util");
            module.exports = drawRaster;
        }, {
            "../util/util": 95
        }],
        22: [function(require, module, exports) {
            "use strict";

            function drawSymbols(e, t, r, a) {
                if (a.buffers) {
                    var o = a.elementGroups[t.ref || t.id];
                    if (o) {
                        var i = !(t.layout["text-allow-overlap"] || t.layout["icon-allow-overlap"] || t.layout["text-ignore-placement"] || t.layout["icon-ignore-placement"]),
                            n = e.gl;
                        i && n.disable(n.STENCIL_TEST), o.glyph.groups.length && drawSymbol(e, t, r, a, o.glyph, "text", !0), o.icon.groups.length && drawSymbol(e, t, r, a, o.icon, "icon", o.sdfIcons), drawCollisionDebug(e, t, r, a), i && n.enable(n.STENCIL_TEST)
                    }
                }
            }

            function drawSymbol(e, t, r, a, o, i, n) {
                var l = e.gl;
                r = e.translateMatrix(r, a, t.paint[i + "-translate"], t.paint[i + "-translate-anchor"]);
                var m, s, f, u = e.transform,
                    d = "map" === t.layout[i + "-rotation-alignment"],
                    h = d;
                h ? (m = mat4.create(), s = a.tileExtent / a.tileSize / Math.pow(2, e.transform.zoom - a.coord.z), f = 1 / Math.cos(u._pitch)) : (m = mat4.clone(a.exMatrix), s = e.transform.altitude, f = 1), mat4.scale(m, m, [s, s, 1]);
                var p = t.paint[i + "-size"],
                    g = p / defaultSizes[i];
                mat4.scale(m, m, [g, g, 1]);
                var S, c, b, x, v = Math.sqrt(u.height * u.height / 4 * (1 + u.altitude * u.altitude)),
                    _ = u.height / 2 * Math.tan(u._pitch),
                    z = (v + _) / v - 1,
                    w = "text" === i;
                if (w || e.style.sprite.loaded()) {
                    l.activeTexture(l.TEXTURE0), S = n ? e.sdfShader : e.iconShader, w ? (e.glyphAtlas.updateTexture(l), c = a.buffers.glyphVertex, b = a.buffers.glyphElement, x = [e.glyphAtlas.width / 4, e.glyphAtlas.height / 4]) : (e.spriteAtlas.bind(l, d || e.options.rotating || e.options.zooming || 1 !== g || n || e.transform.pitch), c = a.buffers.iconVertex, b = a.buffers.iconElement, x = [e.spriteAtlas.width / 4, e.spriteAtlas.height / 4]), l.switchShader(S, r, m), l.uniform1i(S.u_texture, 0), l.uniform2fv(S.u_texsize, x), l.uniform1i(S.u_skewed, h), l.uniform1f(S.u_extra, z);
                    var y = Math.log(p / o[i + "-size"]) / Math.LN2 || 0;
                    l.uniform1f(S.u_zoom, 10 * (e.transform.zoom - y));
                    var E = e.frameHistory.getFadeProperties(300);
                    l.uniform1f(S.u_fadedist, 10 * E.fadedist), l.uniform1f(S.u_minfadezoom, Math.floor(10 * E.minfadezoom)), l.uniform1f(S.u_maxfadezoom, Math.floor(10 * E.maxfadezoom)), l.uniform1f(S.u_fadezoom, 10 * (e.transform.zoom + E.bump));
                    var T, I, A, N;
                    if (b.bind(l), n) {
                        var M = 8,
                            L = 1.19,
                            R = 6,
                            G = .105 * defaultSizes[i] / p / browser.devicePixelRatio;
                        l.uniform1f(S.u_gamma, G * f), l.uniform4fv(S.u_color, t.paint[i + "-color"]), l.uniform1f(S.u_buffer, .75);
                        for (var D = 0; D < o.groups.length; D++) T = o.groups[D], I = T.vertexStartIndex * c.itemSize, c.bind(l), c.setAttribPointers(l, S, I), A = 3 * T.elementLength, N = T.elementStartIndex * b.itemSize, l.drawElements(l.TRIANGLES, A, l.UNSIGNED_SHORT, N);
                        if (t.paint[i + "-halo-width"]) {
                            l.uniform1f(S.u_gamma, (t.paint[i + "-halo-blur"] * L / g / M + G) * f), l.uniform4fv(S.u_color, t.paint[i + "-halo-color"]), l.uniform1f(S.u_buffer, (R - t.paint[i + "-halo-width"] / g) / M);
                            for (var P = 0; P < o.groups.length; P++) T = o.groups[P], I = T.vertexStartIndex * c.itemSize, c.bind(l), c.setAttribPointers(l, S, I), A = 3 * T.elementLength, N = T.elementStartIndex * b.itemSize, l.drawElements(l.TRIANGLES, A, l.UNSIGNED_SHORT, N)
                        }
                    } else {
                        l.uniform1f(S.u_opacity, t.paint["icon-opacity"]);
                        for (var q = 0; q < o.groups.length; q++) T = o.groups[q], I = T.vertexStartIndex * c.itemSize, c.bind(l), c.setAttribPointers(l, S, I), A = 3 * T.elementLength, N = T.elementStartIndex * b.itemSize, l.drawElements(l.TRIANGLES, A, l.UNSIGNED_SHORT, N)
                    }
                }
            }
            var browser = require("../util/browser"),
                mat4 = require("gl-matrix").mat4,
                drawCollisionDebug = require("./draw_collision_debug");
            module.exports = drawSymbols;
            var defaultSizes = {
                icon: 1,
                text: 24
            };
        }, {
            "../util/browser": 84,
            "./draw_collision_debug": 17,
            "gl-matrix": 110
        }],
        23: [function(require, module, exports) {
            "use strict";

            function drawVertices(e, r, t, i) {
                function o(r, t, i) {
                    f.switchShader(e.dotShader, i), f.uniform1f(e.dotShader.u_size, 4 * browser.devicePixelRatio), f.uniform1f(e.dotShader.u_blur, .25), f.uniform4fv(e.dotShader.u_color, [.1, 0, 0, .1]), r.bind(f);
                    for (var o = 0; o < t.length; o++) {
                        var s = t[o],
                            u = s.vertexStartIndex,
                            a = s.vertexLength;
                        f.vertexAttribPointer(e.dotShader.a_pos, 2, f.SHORT, !1, r.itemSize, 0), f.drawArrays(f.POINTS, u, a)
                    }
                }
                var f = e.gl;
                if (i && i.buffers) {
                    var s = i.elementGroups[r.ref || r.id];
                    if (s) {
                        if (f.blendFunc(f.ONE, f.ONE_MINUS_SRC_ALPHA), "fill" === r.type) o(i.buffers.fillVertex, s.groups, t);
                        else if ("symbol" === r.type) o(i.buffers.iconVertex, s.icon.groups, t), o(i.buffers.glyphVertex, s.glyph.groups, t);
                        else if ("line" === r.type) {
                            var u = mat4.clone(t);
                            mat4.scale(u, u, [.5, .5, 1]), o(i.buffers.lineVertex, s.groups, u)
                        }
                        f.blendFunc(f.ONE_MINUS_DST_ALPHA, f.ONE)
                    }
                }
            }
            var browser = require("../util/browser"),
                mat4 = require("gl-matrix").mat4;
            module.exports = drawVertices;
        }, {
            "../util/browser": 84,
            "gl-matrix": 110
        }],
        24: [function(require, module, exports) {
            "use strict";

            function FrameHistory() {
                this.frameHistory = []
            }
            module.exports = FrameHistory, FrameHistory.prototype.getFadeProperties = function(t) {
                void 0 === t && (t = 300);
                for (var e = (new Date).getTime(); this.frameHistory.length > 3 && this.frameHistory[1].time + t < e;) this.frameHistory.shift();
                this.frameHistory[1].time + t < e && (this.frameHistory[0].z = this.frameHistory[1].z);
                var r = this.frameHistory.length;
                3 > r && console.warn("there should never be less than three frames in the history");
                var i = this.frameHistory[0].z,
                    s = this.frameHistory[r - 1],
                    o = s.z,
                    a = Math.min(i, o),
                    m = Math.max(i, o),
                    h = s.z - this.frameHistory[1].z,
                    f = s.time - this.frameHistory[1].time,
                    y = h / (f / t);
                isNaN(y) && console.warn("fadedist should never be NaN");
                var n = (e - s.time) / t * y;
                return {
                    fadedist: y,
                    minfadezoom: a,
                    maxfadezoom: m,
                    bump: n
                }
            }, FrameHistory.prototype.record = function(t) {
                var e = (new Date).getTime();
                this.frameHistory.length || this.frameHistory.push({
                    time: 0,
                    z: t
                }, {
                    time: 0,
                    z: t
                }), (2 === this.frameHistory.length || this.frameHistory[this.frameHistory.length - 1].z !== t) && this.frameHistory.push({
                    time: e,
                    z: t
                })
            };
        }, {}],
        25: [function(require, module, exports) {
            "use strict";
            var shaders = require("./shaders"),
                util = require("../util/util");
            exports.extend = function(r) {
                var t = r.lineWidth,
                    e = r.getParameter(r.ALIASED_LINE_WIDTH_RANGE);
                return r.lineWidth = function(i) {
                    t.call(r, util.clamp(i, e[0], e[1]))
                }, r.getShader = function(r, t) {
                    var e = t === this.FRAGMENT_SHADER ? "fragment" : "vertex";
                    if (!shaders[r] || !shaders[r][e]) throw new Error("Could not find shader " + r);
                    var i = this.createShader(t),
                        a = shaders[r][e];
                    if ("undefined" == typeof orientation && (a = a.replace(/ highp /g, " ")), this.shaderSource(i, a), this.compileShader(i), !this.getShaderParameter(i, this.COMPILE_STATUS)) throw new Error(this.getShaderInfoLog(i));
                    return i
                }, r.initializeShader = function(r, t, e) {
                    var i = {
                        program: this.createProgram(),
                        fragment: this.getShader(r, this.FRAGMENT_SHADER),
                        vertex: this.getShader(r, this.VERTEX_SHADER),
                        attributes: []
                    };
                    if (this.attachShader(i.program, i.vertex), this.attachShader(i.program, i.fragment), this.linkProgram(i.program), this.getProgramParameter(i.program, this.LINK_STATUS)) {
                        for (var a = 0; a < t.length; a++) i[t[a]] = this.getAttribLocation(i.program, t[a]), i.attributes.push(i[t[a]]);
                        for (var h = 0; h < e.length; h++) i[e[h]] = this.getUniformLocation(i.program, e[h])
                    } else console.error(this.getProgramInfoLog(i.program));
                    return i
                }, r.switchShader = function(r, t, e) {
                    if (t || console.trace("posMatrix does not have required argument"), this.currentShader !== r) {
                        this.useProgram(r.program);
                        for (var i = this.currentShader ? this.currentShader.attributes : [], a = r.attributes, h = 0; h < i.length; h++) a.indexOf(i[h]) < 0 && this.disableVertexAttribArray(i[h]);
                        for (var o = 0; o < a.length; o++) i.indexOf(a[o]) < 0 && this.enableVertexAttribArray(a[o]);
                        this.currentShader = r
                    }
                    r.posMatrix !== t && (this.uniformMatrix4fv(r.u_matrix, !1, t), r.posMatrix = t), e && r.exMatrix !== e && r.u_exmatrix && (this.uniformMatrix4fv(r.u_exmatrix, !1, e), r.exMatrix = e)
                }, r.vertexAttrib2fv = function(t, e) {
                    r.vertexAttrib2f(t, e[0], e[1])
                }, r.vertexAttrib3fv = function(t, e) {
                    r.vertexAttrib3f(t, e[0], e[1], e[2])
                }, r.vertexAttrib4fv = function(t, e) {
                    r.vertexAttrib4f(t, e[0], e[1], e[2], e[3])
                }, r
            };
        }, {
            "../util/util": 95,
            "./shaders": 28
        }],
        26: [function(require, module, exports) {
            "use strict";

            function LineAtlas(t, i) {
                this.width = t, this.height = i, this.nextRow = 0, this.bytes = 4, this.data = new Uint8Array(this.width * this.height * this.bytes), this.positions = {}
            }
            module.exports = LineAtlas, LineAtlas.prototype.setSprite = function(t) {
                this.sprite = t
            }, LineAtlas.prototype.getDash = function(t, i) {
                var e = t.join(",") + i;
                return this.positions[e] || (this.positions[e] = this.addDash(t, i)), this.positions[e]
            }, LineAtlas.prototype.addDash = function(t, i) {
                var e = i ? 7 : 0,
                    h = 2 * e + 1,
                    s = 128;
                if (this.nextRow + h > this.height) return console.warn("LineAtlas out of space"), null;
                for (var a = 0, r = 0; r < t.length; r++) a += t[r];
                for (var n = this.width / a, o = n / 2, d = t.length % 2 === 1, E = -e; e >= E; E++)
                    for (var T = this.nextRow + e + E, l = this.width * T, R = d ? -t[t.length - 1] : 0, u = t[0], g = 1, p = 0; p < this.width; p++) {
                        for (; p / n > u;) R = u, u += t[g], d && g === t.length - 1 && (u += t[0]), g++;
                        var x, f = Math.abs(p - R * n),
                            A = Math.abs(p - u * n),
                            w = Math.min(f, A),
                            _ = g % 2 === 1;
                        if (i) {
                            var y = e ? E / e * (o + 1) : 0;
                            if (_) {
                                var D = o - Math.abs(y);
                                x = Math.sqrt(w * w + D * D)
                            } else x = o - Math.sqrt(w * w + y * y)
                        } else x = (_ ? 1 : -1) * w;
                        this.data[3 + 4 * (l + p)] = Math.max(0, Math.min(255, x + s))
                    }
                var c = {
                    y: (this.nextRow + e + .5) / this.height,
                    height: 2 * e / this.height,
                    width: a
                };
                return this.nextRow += h, this.dirty = !0, c
            }, LineAtlas.prototype.bind = function(t) {
                this.texture ? (t.bindTexture(t.TEXTURE_2D, this.texture), this.dirty && (this.dirty = !1, t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, this.width, this.height, t.RGBA, t.UNSIGNED_BYTE, this.data))) : (this.texture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.texture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.REPEAT), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.REPEAT), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, this.width, this.height, 0, t.RGBA, t.UNSIGNED_BYTE, this.data))
            }, LineAtlas.prototype.debug = function() {
                var t = document.createElement("canvas");
                document.body.appendChild(t), t.style.position = "absolute", t.style.top = 0, t.style.left = 0, t.style.background = "#ff0", t.width = this.width, t.height = this.height;
                for (var i = t.getContext("2d"), e = i.getImageData(0, 0, this.width, this.height), h = 0; h < this.data.length; h++)
                    if (this.sdf) {
                        var s = 4 * h;
                        e.data[s] = e.data[s + 1] = e.data[s + 2] = 0, e.data[s + 3] = this.data[h]
                    } else e.data[h] = this.data[h];
                i.putImageData(e, 0, 0)
            };
        }, {}],
        27: [function(require, module, exports) {
            "use strict";

            function Painter(t, e) {
                this.gl = glutil.extend(t), this.transform = e, this.reusableTextures = {}, this.preFbos = {}, this.frameHistory = new FrameHistory, this.setup()
            }
            var glutil = require("./gl_util"),
                browser = require("../util/browser"),
                mat4 = require("gl-matrix").mat4,
                FrameHistory = require("./frame_history");
            module.exports = Painter, Painter.prototype.resize = function(t, e) {
                var i = this.gl;
                this.width = t * browser.devicePixelRatio, this.height = e * browser.devicePixelRatio, i.viewport(0, 0, this.width, this.height)
            }, Painter.prototype.setup = function() {
                var t = this.gl;
                t.verbose = !0, t.enable(t.BLEND), t.blendFunc(t.ONE_MINUS_DST_ALPHA, t.ONE), t.enable(t.STENCIL_TEST), this.debugShader = t.initializeShader("debug", ["a_pos"], ["u_matrix", "u_color"]), this.rasterShader = t.initializeShader("raster", ["a_pos", "a_texture_pos"], ["u_matrix", "u_brightness_low", "u_brightness_high", "u_saturation_factor", "u_spin_weights", "u_contrast_factor", "u_opacity0", "u_opacity1", "u_image0", "u_image1", "u_tl_parent", "u_scale_parent", "u_buffer_scale"]), this.circleShader = t.initializeShader("circle", ["a_pos"], ["u_matrix", "u_exmatrix", "u_blur", "u_size", "u_color"]), this.lineShader = t.initializeShader("line", ["a_pos", "a_data"], ["u_matrix", "u_linewidth", "u_color", "u_ratio", "u_blur", "u_extra", "u_antialiasingmatrix", "u_offset"]), this.linepatternShader = t.initializeShader("linepattern", ["a_pos", "a_data"], ["u_matrix", "u_linewidth", "u_ratio", "u_pattern_size_a", "u_pattern_size_b", "u_pattern_tl_a", "u_pattern_br_a", "u_pattern_tl_b", "u_pattern_br_b", "u_blur", "u_fade", "u_opacity", "u_extra", "u_antialiasingmatrix", "u_offset"]), this.linesdfpatternShader = t.initializeShader("linesdfpattern", ["a_pos", "a_data"], ["u_matrix", "u_linewidth", "u_color", "u_ratio", "u_blur", "u_patternscale_a", "u_tex_y_a", "u_patternscale_b", "u_tex_y_b", "u_image", "u_sdfgamma", "u_mix", "u_extra", "u_antialiasingmatrix", "u_offset"]), this.dotShader = t.initializeShader("dot", ["a_pos"], ["u_matrix", "u_size", "u_color", "u_blur"]), this.sdfShader = t.initializeShader("sdf", ["a_pos", "a_offset", "a_data1", "a_data2"], ["u_matrix", "u_exmatrix", "u_texture", "u_texsize", "u_color", "u_gamma", "u_buffer", "u_zoom", "u_fadedist", "u_minfadezoom", "u_maxfadezoom", "u_fadezoom", "u_skewed", "u_extra"]), this.iconShader = t.initializeShader("icon", ["a_pos", "a_offset", "a_data1", "a_data2"], ["u_matrix", "u_exmatrix", "u_texture", "u_texsize", "u_zoom", "u_fadedist", "u_minfadezoom", "u_maxfadezoom", "u_fadezoom", "u_opacity", "u_skewed", "u_extra"]), this.outlineShader = t.initializeShader("outline", ["a_pos"], ["u_matrix", "u_color", "u_world"]), this.patternShader = t.initializeShader("pattern", ["a_pos"], ["u_matrix", "u_pattern_tl_a", "u_pattern_br_a", "u_pattern_tl_b", "u_pattern_br_b", "u_mix", "u_patternmatrix_a", "u_patternmatrix_b", "u_opacity", "u_image"]), this.fillShader = t.initializeShader("fill", ["a_pos"], ["u_matrix", "u_color"]), this.collisionBoxShader = t.initializeShader("collisionbox", ["a_pos", "a_extrude", "a_data"], ["u_matrix", "u_scale", "u_zoom", "u_maxzoom"]), this.identityMatrix = mat4.create(), this.backgroundBuffer = t.createBuffer(), this.backgroundBuffer.itemSize = 2, this.backgroundBuffer.itemCount = 4, t.bindBuffer(t.ARRAY_BUFFER, this.backgroundBuffer), t.bufferData(t.ARRAY_BUFFER, new Int16Array([-1, -1, 1, -1, -1, 1, 1, 1]), t.STATIC_DRAW), this.setExtent(4096), this.debugTextBuffer = t.createBuffer(), this.debugTextBuffer.itemSize = 2
            }, Painter.prototype.setExtent = function(t) {
                if (t && t !== this.tileExtent) {
                    this.tileExtent = t;
                    var e = this.gl;
                    this.tileExtentBuffer = e.createBuffer(), this.tileExtentBuffer.itemSize = 4, this.tileExtentBuffer.itemCount = 4, e.bindBuffer(e.ARRAY_BUFFER, this.tileExtentBuffer), e.bufferData(e.ARRAY_BUFFER, new Int16Array([0, 0, 0, 0, this.tileExtent, 0, 32767, 0, 0, this.tileExtent, 0, 32767, this.tileExtent, this.tileExtent, 32767, 32767]), e.STATIC_DRAW), this.debugBuffer = e.createBuffer(), this.debugBuffer.itemSize = 2, this.debugBuffer.itemCount = 5, e.bindBuffer(e.ARRAY_BUFFER, this.debugBuffer), e.bufferData(e.ARRAY_BUFFER, new Int16Array([0, 0, this.tileExtent - 1, 0, this.tileExtent - 1, this.tileExtent - 1, 0, this.tileExtent - 1, 0, 0]), e.STATIC_DRAW)
                }
            }, Painter.prototype.clearColor = function() {
                var t = this.gl;
                t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT)
            }, Painter.prototype.clearStencil = function() {
                var t = this.gl;
                t.clearStencil(0), t.stencilMask(255), t.clear(t.STENCIL_BUFFER_BIT)
            }, Painter.prototype.drawClippingMask = function(t) {
                var e = this.gl;
                e.switchShader(this.fillShader, t.posMatrix), e.colorMask(!1, !1, !1, !1), e.clearStencil(0), e.stencilMask(191), e.clear(e.STENCIL_BUFFER_BIT), e.stencilFunc(e.EQUAL, 192, 64), e.stencilMask(192), e.stencilOp(e.REPLACE, e.KEEP, e.KEEP), e.bindBuffer(e.ARRAY_BUFFER, this.tileExtentBuffer), e.vertexAttribPointer(this.fillShader.a_pos, this.tileExtentBuffer.itemSize, e.SHORT, !1, 8, 0), e.drawArrays(e.TRIANGLE_STRIP, 0, this.tileExtentBuffer.itemCount), e.stencilFunc(e.EQUAL, 128, 128), e.stencilOp(e.KEEP, e.KEEP, e.REPLACE), e.stencilMask(0), e.colorMask(!0, !0, !0, !0)
            }, Painter.prototype.prepareBuffers = function() {}, Painter.prototype.bindDefaultFramebuffer = function() {
                var t = this.gl;
                t.bindFramebuffer(t.FRAMEBUFFER, null)
            };
            var draw = {
                symbol: require("./draw_symbol"),
                circle: require("./draw_circle"),
                line: require("./draw_line"),
                fill: require("./draw_fill"),
                raster: require("./draw_raster"),
                background: require("./draw_background"),
                debug: require("./draw_debug"),
                vertices: require("./draw_vertices")
            };
            Painter.prototype.render = function(t, e) {
                this.style = t, this.options = e, this.lineAtlas = t.lineAtlas, this.spriteAtlas = t.spriteAtlas, this.spriteAtlas.setSprite(t.sprite), this.glyphAtlas = t.glyphAtlas, this.glyphAtlas.bind(this.gl), this.frameHistory.record(this.transform.zoom), this.prepareBuffers(), this.clearColor();
                for (var i = t._groups.length - 1; i >= 0; i--) {
                    var r = t._groups[i],
                        a = t.sources[r.source];
                    a ? (this.clearStencil(), a.render(r, this)) : void 0 === r.source && this.drawLayers(r, this.identityMatrix)
                }
            }, Painter.prototype.drawTile = function(t, e) {
                this.setExtent(t.tileExtent), this.drawClippingMask(t), this.drawLayers(e, t.posMatrix, t), this.options.debug && draw.debug(this, t)
            }, Painter.prototype.drawLayers = function(t, e, i) {
                for (var r = t.length - 1; r >= 0; r--) {
                    var a = t[r];
                    a.hidden || (draw[a.type](this, a, e, i), this.options.vertices && draw.vertices(this, a, e, i))
                }
            }, Painter.prototype.drawStencilBuffer = function() {
                var t = this.gl;
                t.switchShader(this.fillShader, this.identityMatrix), t.blendFunc(t.ONE, t.ONE_MINUS_SRC_ALPHA), t.stencilMask(0), t.stencilFunc(t.EQUAL, 128, 128), t.bindBuffer(t.ARRAY_BUFFER, this.backgroundBuffer), t.vertexAttribPointer(this.fillShader.a_pos, this.backgroundBuffer.itemSize, t.SHORT, !1, 0, 0), t.uniform4fv(this.fillShader.u_color, [0, 0, 0, .5]), t.drawArrays(t.TRIANGLE_STRIP, 0, this.tileExtentBuffer.itemCount), t.blendFunc(t.ONE_MINUS_DST_ALPHA, t.ONE)
            }, Painter.prototype.translateMatrix = function(t, e, i, r) {
                if (!i[0] && !i[1]) return t;
                if ("viewport" === r) {
                    var a = Math.sin(-this.transform.angle),
                        s = Math.cos(-this.transform.angle);
                    i = [i[0] * s - i[1] * a, i[0] * a + i[1] * s]
                }
                var u = this.transform.scale / (1 << e.coord.z) / (e.tileExtent / e.tileSize),
                    n = [i[0] / u, i[1] / u, 0],
                    _ = new Float32Array(16);
                return mat4.translate(_, t, n), _
            }, Painter.prototype.saveTexture = function(t) {
                var e = this.reusableTextures[t.size];
                e ? e.push(t) : this.reusableTextures[t.size] = [t]
            }, Painter.prototype.getTexture = function(t) {
                var e = this.reusableTextures[t];
                return e && e.length > 0 ? e.pop() : null
            };
        }, {
            "../util/browser": 84,
            "./draw_background": 15,
            "./draw_circle": 16,
            "./draw_debug": 18,
            "./draw_fill": 19,
            "./draw_line": 20,
            "./draw_raster": 21,
            "./draw_symbol": 22,
            "./draw_vertices": 23,
            "./frame_history": 24,
            "./gl_util": 25,
            "gl-matrix": 110
        }],
        28: [function(require, module, exports) {
            "use strict";
            var path = require("path");
            module.exports = {
                debug: {
                    fragment: "precision mediump float;\n\nuniform vec4 u_color;\n\nvoid main() {\n    gl_FragColor = u_color;\n}\n",
                    vertex: "precision mediump float;\n\nattribute vec2 a_pos;\n\nuniform mat4 u_matrix;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, step(32767.0, a_pos.x), 1);\n}\n"
                },
                dot: {
                    fragment: "precision mediump float;\n\nuniform vec4 u_color;\nuniform float u_blur;\n\nvoid main() {\n    float dist = length(gl_PointCoord - 0.5);\n    float t = smoothstep(0.5, 0.5 - u_blur, dist);\n\n    gl_FragColor = u_color * t;\n}\n",
                    vertex: "precision mediump float;\n\nuniform mat4 u_matrix;\nuniform float u_size;\n\nattribute vec2 a_pos;\n\nvoid main(void) {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    gl_PointSize = u_size;\n}\n"
                },
                fill: {
                    fragment: "precision mediump float;\n\nuniform vec4 u_color;\n\nvoid main() {\n    gl_FragColor = u_color;\n}\n",
                    vertex: "precision mediump float;\n\nattribute vec2 a_pos;\nuniform mat4 u_matrix;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n}\n"
                },
                circle: {
                    fragment: "precision mediump float;\n\nuniform vec4 u_color;\nuniform float u_blur;\nuniform float u_size;\n\nvarying vec2 v_extrude;\n\nvoid main() {\n    float t = smoothstep(1.0 - u_blur, 1.0, length(v_extrude));\n    gl_FragColor = u_color * (1.0 - t);\n}\n",
                    vertex: "precision mediump float;\n\n// set by gl_util\nuniform float u_size;\n\nattribute vec2 a_pos;\n\nuniform mat4 u_matrix;\nuniform mat4 u_exmatrix;\n\nvarying vec2 v_extrude;\n\nvoid main(void) {\n    // unencode the extrusion vector that we snuck into the a_pos vector\n    v_extrude = vec2(mod(a_pos, 2.0) * 2.0 - 1.0);\n\n    vec4 extrude = u_exmatrix * vec4(v_extrude * u_size, 0, 0);\n    // multiply a_pos by 0.5, since we had it * 2 in order to sneak\n    // in extrusion data\n    gl_Position = u_matrix * vec4(floor(a_pos * 0.5), 0, 1);\n\n    // gl_Position is divided by gl_Position.w after this shader runs.\n    // Multiply the extrude by it so that it isn't affected by it.\n    gl_Position += extrude * gl_Position.w;\n}\n"
                },
                line: {
                    fragment: "precision mediump float;\n\nuniform vec2 u_linewidth;\nuniform vec4 u_color;\nuniform float u_blur;\n\nvarying vec2 v_normal;\nvarying float v_linesofar;\nvarying float v_gamma_scale;\n\nvoid main() {\n    // Calculate the distance of the pixel from the line in pixels.\n    float dist = length(v_normal) * u_linewidth.s;\n\n    // Calculate the antialiasing fade factor. This is either when fading in\n    // the line in case of an offset line (v_linewidth.t) or when fading out\n    // (v_linewidth.s)\n    float blur = u_blur * v_gamma_scale;\n    float alpha = clamp(min(dist - (u_linewidth.t - blur), u_linewidth.s - dist) / blur, 0.0, 1.0);\n\n    gl_FragColor = u_color * alpha;\n}\n",
                    vertex: "precision mediump float;\n\n// floor(127 / 2) == 63.0\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\n// there are also \"special\" normals that have a bigger length (of up to 126 in\n// this case).\n// #define scale 63.0\n#define scale 0.015873016\n\nattribute vec2 a_pos;\nattribute vec4 a_data;\n\nuniform highp mat4 u_matrix;\nuniform float u_ratio;\nuniform vec2 u_linewidth;\nuniform float u_extra;\nuniform mat2 u_antialiasingmatrix;\nuniform float u_offset;\n\nvarying vec2 v_normal;\nvarying float v_linesofar;\nvarying float v_gamma_scale;\n\nvoid main() {\n    vec2 a_extrude = a_data.xy;\n    float a_direction = sign(a_data.z) * mod(a_data.z, 2.0);\n\n    // We store the texture normals in the most insignificant bit\n    // transform y so that 0 => -1 and 1 => 1\n    // In the texture normal, x is 0 if the normal points straight up/down and 1 if it's a round cap\n    // y is 1 if the normal points up, and -1 if it points down\n    vec2 normal = mod(a_pos, 2.0);\n    normal.y = sign(normal.y - 0.5);\n    v_normal = normal;\n\n    // Scale the extrusion vector down to a normal and then up by the line width\n    // of this vertex.\n    vec4 dist = vec4(u_linewidth.s * a_extrude * scale, 0.0, 0.0);\n\n    // Calculate the offset when drawing a line that is to the side of the actual line.\n    // We do this by creating a vector that points towards the extrude, but rotate\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\n    // extrude vector points in another direction.\n    float u = 0.5 * a_direction;\n    float t = 1.0 - abs(u);\n    vec2 offset = u_offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\n\n    // Remove the texture normal bit of the position before scaling it with the\n    // model/view matrix.\n    gl_Position = u_matrix * vec4(floor(a_pos * 0.5) + (offset + dist.xy) / u_ratio, 0.0, 1.0);\n\n    // position of y on the screen\n    float y = gl_Position.y / gl_Position.w;\n\n    // how much features are squished in the y direction by the tilt\n    float squish_scale = length(a_extrude) / length(u_antialiasingmatrix * a_extrude);\n\n    // how much features are squished in all directions by the perspectiveness\n    float perspective_scale = 1.0 / (1.0 - min(y * u_extra, 0.9));\n\n    v_gamma_scale = perspective_scale * squish_scale;\n}\n"
                },
                linepattern: {
                    fragment: "precision mediump float;\n\nuniform vec2 u_linewidth;\nuniform float u_point;\nuniform float u_blur;\n\nuniform vec2 u_pattern_size_a;\nuniform vec2 u_pattern_size_b;\nuniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform float u_fade;\nuniform float u_opacity;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_normal;\nvarying float v_linesofar;\nvarying float v_gamma_scale;\n\nvoid main() {\n    // Calculate the distance of the pixel from the line in pixels.\n    float dist = length(v_normal) * u_linewidth.s;\n\n    // Calculate the antialiasing fade factor. This is either when fading in\n    // the line in case of an offset line (v_linewidth.t) or when fading out\n    // (v_linewidth.s)\n    float blur = u_blur * v_gamma_scale;\n    float alpha = clamp(min(dist - (u_linewidth.t - blur), u_linewidth.s - dist) / blur, 0.0, 1.0);\n\n    float x_a = mod(v_linesofar / u_pattern_size_a.x, 1.0);\n    float x_b = mod(v_linesofar / u_pattern_size_b.x, 1.0);\n    float y_a = 0.5 + (v_normal.y * u_linewidth.s / u_pattern_size_a.y);\n    float y_b = 0.5 + (v_normal.y * u_linewidth.s / u_pattern_size_b.y);\n    vec2 pos = mix(u_pattern_tl_a, u_pattern_br_a, vec2(x_a, y_a));\n    vec2 pos2 = mix(u_pattern_tl_b, u_pattern_br_b, vec2(x_b, y_b));\n\n    vec4 color = mix(texture2D(u_image, pos), texture2D(u_image, pos2), u_fade);\n\n    alpha *= u_opacity;\n\n    gl_FragColor = color * alpha;\n}\n",
                    vertex: "precision mediump float;\n\n// floor(127 / 2) == 63.0\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\n// there are also \"special\" normals that have a bigger length (of up to 126 in\n// this case).\n// #define scale 63.0\n#define scale 0.015873016\n\nattribute vec2 a_pos;\nattribute vec4 a_data;\n\nuniform highp mat4 u_matrix;\nuniform float u_ratio;\nuniform vec2 u_linewidth;\nuniform vec4 u_color;\nuniform float u_extra;\nuniform mat2 u_antialiasingmatrix;\nuniform float u_offset;\n\nvarying vec2 v_normal;\nvarying float v_linesofar;\nvarying float v_gamma_scale;\n\nvoid main() {\n    vec2 a_extrude = a_data.xy;\n    float a_direction = sign(a_data.z) * mod(a_data.z, 2.0);\n    float a_linesofar = abs(floor(a_data.z / 2.0)) + a_data.w * 64.0;\n\n    // We store the texture normals in the most insignificant bit\n    // transform y so that 0 => -1 and 1 => 1\n    // In the texture normal, x is 0 if the normal points straight up/down and 1 if it's a round cap\n    // y is 1 if the normal points up, and -1 if it points down\n    vec2 normal = mod(a_pos, 2.0);\n    normal.y = sign(normal.y - 0.5);\n    v_normal = normal;\n\n    // Scale the extrusion vector down to a normal and then up by the line width\n    // of this vertex.\n    vec2 extrude = a_extrude * scale;\n    vec2 dist = u_linewidth.s * extrude;\n\n    // Calculate the offset when drawing a line that is to the side of the actual line.\n    // We do this by creating a vector that points towards the extrude, but rotate\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\n    // extrude vector points in another direction.\n    float u = 0.5 * a_direction;\n    float t = 1.0 - abs(u);\n    vec2 offset = u_offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\n\n    // Remove the texture normal bit of the position before scaling it with the\n    // model/view matrix.\n    gl_Position = u_matrix * vec4(floor(a_pos * 0.5) + (offset + dist.xy) / u_ratio, 0.0, 1.0);\n    v_linesofar = a_linesofar;\n\n    // position of y on the screen\n    float y = gl_Position.y / gl_Position.w;\n\n    // how much features are squished in the y direction by the tilt\n    float squish_scale = length(a_extrude) / length(u_antialiasingmatrix * a_extrude);\n\n    // how much features are squished in all directions by the perspectiveness\n    float perspective_scale = 1.0 / (1.0 - min(y * u_extra, 0.9));\n\n    v_gamma_scale = perspective_scale * squish_scale;\n}\n"
                },
                linesdfpattern: {
                    fragment: "precision mediump float;\n\nuniform vec2 u_linewidth;\nuniform vec4 u_color;\nuniform float u_blur;\nuniform sampler2D u_image;\nuniform float u_sdfgamma;\nuniform float u_mix;\n\nvarying vec2 v_normal;\nvarying vec2 v_tex_a;\nvarying vec2 v_tex_b;\nvarying float v_gamma_scale;\n\nvoid main() {\n    // Calculate the distance of the pixel from the line in pixels.\n    float dist = length(v_normal) * u_linewidth.s;\n\n    // Calculate the antialiasing fade factor. This is either when fading in\n    // the line in case of an offset line (v_linewidth.t) or when fading out\n    // (v_linewidth.s)\n    float blur = u_blur * v_gamma_scale;\n    float alpha = clamp(min(dist - (u_linewidth.t - blur), u_linewidth.s - dist) / blur, 0.0, 1.0);\n\n    float sdfdist_a = texture2D(u_image, v_tex_a).a;\n    float sdfdist_b = texture2D(u_image, v_tex_b).a;\n    float sdfdist = mix(sdfdist_a, sdfdist_b, u_mix);\n    alpha *= smoothstep(0.5 - u_sdfgamma, 0.5 + u_sdfgamma, sdfdist);\n\n    gl_FragColor = u_color * alpha;\n}\n",
                    vertex: "precision mediump float;\n\n// floor(127 / 2) == 63.0\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\n// there are also \"special\" normals that have a bigger length (of up to 126 in\n// this case).\n// #define scale 63.0\n#define scale 0.015873016\n\nattribute vec2 a_pos;\nattribute vec4 a_data;\n\nuniform highp mat4 u_matrix;\nuniform vec2 u_linewidth;\nuniform float u_ratio;\nuniform vec2 u_patternscale_a;\nuniform float u_tex_y_a;\nuniform vec2 u_patternscale_b;\nuniform float u_tex_y_b;\nuniform float u_extra;\nuniform mat2 u_antialiasingmatrix;\nuniform float u_offset;\n\nvarying vec2 v_normal;\nvarying vec2 v_tex_a;\nvarying vec2 v_tex_b;\nvarying float v_gamma_scale;\n\nvoid main() {\n    vec2 a_extrude = a_data.xy;\n    float a_direction = sign(a_data.z) * mod(a_data.z, 2.0);\n    float a_linesofar = abs(floor(a_data.z / 2.0)) + a_data.w * 64.0;\n\n    // We store the texture normals in the most insignificant bit\n    // transform y so that 0 => -1 and 1 => 1\n    // In the texture normal, x is 0 if the normal points straight up/down and 1 if it's a round cap\n    // y is 1 if the normal points up, and -1 if it points down\n    vec2 normal = mod(a_pos, 2.0);\n    normal.y = sign(normal.y - 0.5);\n    v_normal = normal;\n\n    // Scale the extrusion vector down to a normal and then up by the line width\n    // of this vertex.\n    vec4 dist = vec4(u_linewidth.s * a_extrude * scale, 0.0, 0.0);\n\n    // Calculate the offset when drawing a line that is to the side of the actual line.\n    // We do this by creating a vector that points towards the extrude, but rotate\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\n    // extrude vector points in another direction.\n    float u = 0.5 * a_direction;\n    float t = 1.0 - abs(u);\n    vec2 offset = u_offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\n\n    // Remove the texture normal bit of the position before scaling it with the\n    // model/view matrix.\n    gl_Position = u_matrix * vec4(floor(a_pos * 0.5) + (offset + dist.xy) / u_ratio, 0.0, 1.0);\n\n    v_tex_a = vec2(a_linesofar * u_patternscale_a.x, normal.y * u_patternscale_a.y + u_tex_y_a);\n    v_tex_b = vec2(a_linesofar * u_patternscale_b.x, normal.y * u_patternscale_b.y + u_tex_y_b);\n\n    // position of y on the screen\n    float y = gl_Position.y / gl_Position.w;\n\n    // how much features are squished in the y direction by the tilt\n    float squish_scale = length(a_extrude) / length(u_antialiasingmatrix * a_extrude);\n\n    // how much features are squished in all directions by the perspectiveness\n    float perspective_scale = 1.0 / (1.0 - min(y * u_extra, 0.9));\n\n    v_gamma_scale = perspective_scale * squish_scale;\n}\n"
                },
                outline: {
                    fragment: "precision mediump float;\n\nuniform vec4 u_color;\n\nvarying vec2 v_pos;\n\nvoid main() {\n    float dist = length(v_pos - gl_FragCoord.xy);\n    float alpha = smoothstep(1.0, 0.0, dist);\n    gl_FragColor = u_color * alpha;\n}\n",
                    vertex: "precision mediump float;\n\nattribute vec2 a_pos;\n\nuniform highp mat4 u_matrix;\nuniform vec2 u_world;\n\nvarying vec2 v_pos;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    v_pos = (gl_Position.xy/gl_Position.w + 1.0) / 2.0 * u_world;\n}\n"
                },
                pattern: {
                    fragment: "precision mediump float;\n\nuniform float u_opacity;\nuniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform float u_mix;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\n\nvoid main() {\n\n    vec2 imagecoord = mod(v_pos_a, 1.0);\n    vec2 pos = mix(u_pattern_tl_a, u_pattern_br_a, imagecoord);\n    vec4 color1 = texture2D(u_image, pos);\n\n    vec2 imagecoord_b = mod(v_pos_b, 1.0);\n    vec2 pos2 = mix(u_pattern_tl_b, u_pattern_br_b, imagecoord_b);\n    vec4 color2 = texture2D(u_image, pos2);\n\n    gl_FragColor = mix(color1, color2, u_mix) * u_opacity;\n}\n",
                    vertex: "precision mediump float;\n\nuniform mat4 u_matrix;\nuniform mat3 u_patternmatrix_a;\nuniform mat3 u_patternmatrix_b;\n\nattribute vec2 a_pos;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    v_pos_a = (u_patternmatrix_a * vec3(a_pos, 1)).xy;\n    v_pos_b = (u_patternmatrix_b * vec3(a_pos, 1)).xy;\n}\n"
                },
                raster: {
                    fragment: "precision mediump float;\n\nuniform float u_opacity0;\nuniform float u_opacity1;\nuniform sampler2D u_image0;\nuniform sampler2D u_image1;\nvarying vec2 v_pos0;\nvarying vec2 v_pos1;\n\nuniform float u_brightness_low;\nuniform float u_brightness_high;\n\nuniform float u_saturation_factor;\nuniform float u_contrast_factor;\nuniform vec3 u_spin_weights;\n\nvoid main() {\n\n    // read and cross-fade colors from the main and parent tiles\n    vec4 color0 = texture2D(u_image0, v_pos0);\n    vec4 color1 = texture2D(u_image1, v_pos1);\n    vec4 color = color0 * u_opacity0 + color1 * u_opacity1;\n    vec3 rgb = color.rgb;\n\n    // spin\n    rgb = vec3(\n        dot(rgb, u_spin_weights.xyz),\n        dot(rgb, u_spin_weights.zxy),\n        dot(rgb, u_spin_weights.yzx));\n\n    // saturation\n    float average = (color.r + color.g + color.b) / 3.0;\n    rgb += (average - rgb) * u_saturation_factor;\n\n    // contrast\n    rgb = (rgb - 0.5) * u_contrast_factor + 0.5;\n\n    // brightness\n    vec3 u_high_vec = vec3(u_brightness_low, u_brightness_low, u_brightness_low);\n    vec3 u_low_vec = vec3(u_brightness_high, u_brightness_high, u_brightness_high);\n\n    gl_FragColor = vec4(mix(u_high_vec, u_low_vec, rgb), color.a);\n}\n",
                    vertex: "precision mediump float;\n\nuniform mat4 u_matrix;\nuniform vec2 u_tl_parent;\nuniform float u_scale_parent;\nuniform float u_buffer_scale;\n\nattribute vec2 a_pos;\nattribute vec2 a_texture_pos;\n\nvarying vec2 v_pos0;\nvarying vec2 v_pos1;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    v_pos0 = (((a_texture_pos / 32767.0) - 0.5) / u_buffer_scale ) + 0.5;\n    v_pos1 = (v_pos0 * u_scale_parent) + u_tl_parent;\n}\n"
                },
                icon: {
                    fragment: "precision mediump float;\n\nuniform sampler2D u_texture;\n\nvarying vec2 v_tex;\nvarying float v_alpha;\n\nvoid main() {\n    gl_FragColor = texture2D(u_texture, v_tex) * v_alpha;\n}\n",
                    vertex: "precision mediump float;\n\nattribute vec2 a_pos;\nattribute vec2 a_offset;\nattribute vec4 a_data1;\nattribute vec4 a_data2;\n\n\n// matrix is for the vertex position, exmatrix is for rotating and projecting\n// the extrusion vector.\nuniform highp mat4 u_matrix;\nuniform mat4 u_exmatrix;\nuniform float u_zoom;\nuniform float u_fadedist;\nuniform float u_minfadezoom;\nuniform float u_maxfadezoom;\nuniform float u_fadezoom;\nuniform float u_opacity;\nuniform bool u_skewed;\nuniform float u_extra;\n\nuniform vec2 u_texsize;\n\nvarying vec2 v_tex;\nvarying float v_alpha;\n\nvoid main() {\n    vec2 a_tex = a_data1.xy;\n    float a_labelminzoom = a_data1[2];\n    vec2 a_zoom = a_data2.st;\n    float a_minzoom = a_zoom[0];\n    float a_maxzoom = a_zoom[1];\n\n    float a_fadedist = 10.0;\n\n    // u_zoom is the current zoom level adjusted for the change in font size\n    float z = 2.0 - step(a_minzoom, u_zoom) - (1.0 - step(a_maxzoom, u_zoom));\n\n    // fade out labels\n    float alpha = clamp((u_fadezoom - a_labelminzoom) / u_fadedist, 0.0, 1.0);\n\n    if (u_fadedist >= 0.0) {\n        v_alpha = alpha;\n    } else {\n        v_alpha = 1.0 - alpha;\n    }\n    if (u_maxfadezoom < a_labelminzoom) {\n        v_alpha = 0.0;\n    }\n    if (u_minfadezoom >= a_labelminzoom) {\n        v_alpha = 1.0;\n    }\n\n    // if label has been faded out, clip it\n    z += step(v_alpha, 0.0);\n\n    if (u_skewed) {\n        vec4 extrude = u_exmatrix * vec4(a_offset / 64.0, 0, 0);\n        gl_Position = u_matrix * vec4(a_pos + extrude.xy, 0, 1);\n        gl_Position.z += z * gl_Position.w;\n    } else {\n        vec4 extrude = u_exmatrix * vec4(a_offset / 64.0, z, 0);\n        gl_Position = u_matrix * vec4(a_pos, 0, 1) + extrude;\n    }\n\n    v_tex = a_tex / u_texsize;\n\n    v_alpha *= u_opacity;\n}\n"
                },
                sdf: {
                    fragment: "precision mediump float;\n\nuniform sampler2D u_texture;\nuniform vec4 u_color;\nuniform float u_buffer;\nuniform float u_gamma;\n\nvarying vec2 v_tex;\nvarying float v_alpha;\nvarying float v_gamma_scale;\n\nvoid main() {\n    float gamma = u_gamma * v_gamma_scale;\n    float dist = texture2D(u_texture, v_tex).a;\n    float alpha = smoothstep(u_buffer - gamma, u_buffer + gamma, dist) * v_alpha;\n    gl_FragColor = u_color * alpha;\n}\n",
                    vertex: "precision mediump float;\n\nattribute vec2 a_pos;\nattribute vec2 a_offset;\nattribute vec4 a_data1;\nattribute vec4 a_data2;\n\n\n// matrix is for the vertex position, exmatrix is for rotating and projecting\n// the extrusion vector.\nuniform highp mat4 u_matrix;\nuniform mat4 u_exmatrix;\n\nuniform float u_zoom;\nuniform float u_fadedist;\nuniform float u_minfadezoom;\nuniform float u_maxfadezoom;\nuniform float u_fadezoom;\nuniform bool u_skewed;\nuniform float u_extra;\n\nuniform vec2 u_texsize;\n\nvarying vec2 v_tex;\nvarying float v_alpha;\nvarying float v_gamma_scale;\n\nvoid main() {\n    vec2 a_tex = a_data1.xy;\n    float a_labelminzoom = a_data1[2];\n    vec2 a_zoom = a_data2.st;\n    float a_minzoom = a_zoom[0];\n    float a_maxzoom = a_zoom[1];\n\n    // u_zoom is the current zoom level adjusted for the change in font size\n    float z = 2.0 - step(a_minzoom, u_zoom) - (1.0 - step(a_maxzoom, u_zoom));\n\n    // fade out labels\n    float alpha = clamp((u_fadezoom - a_labelminzoom) / u_fadedist, 0.0, 1.0);\n\n    if (u_fadedist >= 0.0) {\n        v_alpha = alpha;\n    } else {\n        v_alpha = 1.0 - alpha;\n    }\n    if (u_maxfadezoom < a_labelminzoom) {\n        v_alpha = 0.0;\n    }\n    if (u_minfadezoom >= a_labelminzoom) {\n        v_alpha = 1.0;\n    }\n\n    // if label has been faded out, clip it\n    z += step(v_alpha, 0.0);\n\n    if (u_skewed) {\n        vec4 extrude = u_exmatrix * vec4(a_offset / 64.0, 0, 0);\n        gl_Position = u_matrix * vec4(a_pos + extrude.xy, 0, 1);\n        gl_Position.z += z * gl_Position.w;\n    } else {\n        vec4 extrude = u_exmatrix * vec4(a_offset / 64.0, z, 0);\n        gl_Position = u_matrix * vec4(a_pos, 0, 1) + extrude;\n    }\n\n    // position of y on the screen\n    float y = gl_Position.y / gl_Position.w;\n    // how much features are squished in all directions by the perspectiveness\n    float perspective_scale = 1.0 / (1.0 - y * u_extra);\n    v_gamma_scale = perspective_scale;\n\n    v_tex = a_tex / u_texsize;\n}\n"
                },
                collisionbox: {
                    fragment: "precision mediump float;\n\nuniform float u_zoom;\nuniform float u_maxzoom;\n\nvarying float v_max_zoom;\nvarying float v_placement_zoom;\n\nvoid main() {\n\n    float alpha = 0.5;\n\n    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0) * alpha;\n\n    if (v_placement_zoom > u_zoom) {\n        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) * alpha;\n    }\n\n    if (u_zoom >= v_max_zoom) {\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) * alpha * 0.25;\n    }\n\n    if (v_placement_zoom >= u_maxzoom) {\n        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0) * alpha * 0.2;\n    }\n}\n",
                    vertex: "precision mediump float;\n\nattribute vec2 a_pos;\nattribute vec2 a_extrude;\nattribute vec2 a_data;\n\nuniform mat4 u_matrix;\nuniform float u_scale;\n\nvarying float v_max_zoom;\nvarying float v_placement_zoom;\n\nvoid main() {\n     gl_Position = u_matrix * vec4(a_pos + a_extrude / u_scale, 0.0, 1.0);\n\n     v_max_zoom = a_data.x;\n     v_placement_zoom = a_data.y;\n}\n"
                }
            };
        }, {
            "path": 97
        }],
        29: [function(require, module, exports) {
            "use strict";

            function GeoJSONSource(e) {
                e = e || {}, this._data = e.data, void 0 !== e.maxzoom && (this.maxzoom = e.maxzoom), this.geojsonVtOptions = {
                    maxZoom: this.maxzoom
                }, void 0 !== e.buffer && (this.geojsonVtOptions.buffer = e.buffer), void 0 !== e.tolerance && (this.geojsonVtOptions.tolerance = e.tolerance), this._pyramid = new TilePyramid({
                    tileSize: 512,
                    minzoom: this.minzoom,
                    maxzoom: this.maxzoom,
                    cacheSize: 20,
                    load: this._loadTile.bind(this),
                    abort: this._abortTile.bind(this),
                    unload: this._unloadTile.bind(this),
                    add: this._addTile.bind(this),
                    remove: this._removeTile.bind(this),
                    redoPlacement: this._redoTilePlacement.bind(this)
                })
            }
            var util = require("../util/util"),
                Evented = require("../util/evented"),
                TilePyramid = require("./tile_pyramid"),
                Source = require("./source"),
                urlResolve = require("resolve-url");
            module.exports = GeoJSONSource, GeoJSONSource.prototype = util.inherit(Evented, {
                minzoom: 0,
                maxzoom: 14,
                _dirty: !0,
                setData: function(e) {
                    return this._data = e, this._dirty = !0, this.fire("change"), this.map && this.update(this.map.transform), this
                },
                onAdd: function(e) {
                    this.map = e
                },
                loaded: function() {
                    return this._loaded && this._pyramid.loaded()
                },
                update: function(e) {
                    this._dirty && this._updateData(), this._loaded && this._pyramid.update(this.used, e)
                },
                reload: function() {
                    this._loaded && this._pyramid.reload()
                },
                render: Source._renderTiles,
                featuresAt: Source._vectorFeaturesAt,
                featuresIn: Source._vectorFeaturesIn,
                _updateData: function() {
                    this._dirty = !1;
                    var e = this._data;
                    "string" == typeof e && (e = urlResolve(window.location.href, e)), this.workerID = this.dispatcher.send("parse geojson", {
                        data: e,
                        tileSize: 512,
                        source: this.id,
                        geojsonVtOptions: this.geojsonVtOptions
                    }, function(e) {
                        return e ? void this.fire("error", {
                            error: e
                        }) : (this._loaded = !0, this._pyramid.reload(), void this.fire("change"))
                    }.bind(this))
                },
                _loadTile: function(e) {
                    var i = e.coord.z > this.maxzoom ? Math.pow(2, e.coord.z - this.maxzoom) : 1,
                        t = {
                            uid: e.uid,
                            coord: e.coord,
                            zoom: e.coord.z,
                            maxZoom: this.maxzoom,
                            tileSize: 512,
                            source: this.id,
                            overscaling: i,
                            angle: this.map.transform.angle,
                            pitch: this.map.transform.pitch,
                            collisionDebug: this.map.collisionDebug
                        };
                    e.workerID = this.dispatcher.send("load geojson tile", t, function(i, t) {
                        if (e.unloadVectorData(this.map.painter), !e.aborted) {
                            if (i) return void this.fire("tile.error", {
                                tile: e
                            });
                            e.loadVectorData(t), e.redoWhenDone && (e.redoWhenDone = !1, e.redoPlacement(this)), this.fire("tile.load", {
                                tile: e
                            })
                        }
                    }.bind(this), this.workerID)
                },
                _abortTile: function(e) {
                    e.aborted = !0
                },
                _addTile: function(e) {
                    this.fire("tile.add", {
                        tile: e
                    })
                },
                _removeTile: function(e) {
                    this.fire("tile.remove", {
                        tile: e
                    })
                },
                _unloadTile: function(e) {
                    e.unloadVectorData(this.map.painter), this.glyphAtlas.removeGlyphs(e.uid), this.dispatcher.send("remove tile", {
                        uid: e.uid,
                        source: this.id
                    }, null, e.workerID)
                },
                redoPlacement: Source.redoPlacement,
                _redoTilePlacement: function(e) {
                    e.redoPlacement(this)
                }
            });
        }, {
            "../util/evented": 89,
            "../util/util": 95,
            "./source": 33,
            "./tile_pyramid": 36,
            "resolve-url": 133
        }],
        30: [function(require, module, exports) {
            "use strict";

            function GeoJSONWrapper(e) {
                this.features = e, this.length = e.length
            }

            function FeatureWrapper(e) {
                this.type = e.type, this.rawGeometry = 1 === e.type ? [e.geometry] : e.geometry, this.properties = e.tags, this.extent = 4096
            }
            var Point = require("point-geometry"),
                VectorTileFeature = require("vector-tile").VectorTileFeature;
            module.exports = GeoJSONWrapper, GeoJSONWrapper.prototype.feature = function(e) {
                return new FeatureWrapper(this.features[e])
            }, FeatureWrapper.prototype.loadGeometry = function() {
                var e = this.rawGeometry;
                this.geometry = [];
                for (var t = 0; t < e.length; t++) {
                    for (var r = e[t], o = [], a = 0; a < r.length; a++) o.push(new Point(r[a][0], r[a][1]));
                    this.geometry.push(o)
                }
                return this.geometry
            }, FeatureWrapper.prototype.bbox = function() {
                this.geometry || this.loadGeometry();
                for (var e = this.geometry, t = 1 / 0, r = -(1 / 0), o = 1 / 0, a = -(1 / 0), p = 0; p < e.length; p++)
                    for (var i = e[p], n = 0; n < i.length; n++) {
                        var h = i[n];
                        t = Math.min(t, h.x), r = Math.max(r, h.x), o = Math.min(o, h.y), a = Math.max(a, h.y)
                    }
                return [t, o, r, a]
            }, FeatureWrapper.prototype.toGeoJSON = VectorTileFeature.prototype.toGeoJSON;
        }, {
            "point-geometry": 131,
            "vector-tile": 135
        }],
        31: [function(require, module, exports) {
            "use strict";

            function ImageSource(e) {
                this.coordinates = e.coordinates, ajax.getImage(e.url, function(e, t) {
                    e || (this.image = t, this.image.addEventListener("load", function() {
                        this.map._rerender()
                    }.bind(this)), this._loaded = !0, this.map && (this.createTile(), this.fire("change")))
                }.bind(this))
            }
            var util = require("../util/util"),
                Tile = require("./tile"),
                LngLat = require("../geo/lng_lat"),
                Point = require("point-geometry"),
                Evented = require("../util/evented"),
                ajax = require("../util/ajax");
            module.exports = ImageSource, ImageSource.prototype = util.inherit(Evented, {
                onAdd: function(e) {
                    this.map = e, this.image && this.createTile()
                },
                createTile: function() {
                    var e = this.map,
                        t = this.coordinates.map(function(t) {
                            var i = LngLat.convert(t);
                            return e.transform.locationCoordinate(i).zoomTo(0)
                        }),
                        i = util.getCoordinatesCenter(t),
                        r = 4096,
                        a = t.map(function(e) {
                            var t = e.zoomTo(i.zoom);
                            return new Point(Math.round((t.column - i.column) * r), Math.round((t.row - i.row) * r))
                        }),
                        n = e.painter.gl,
                        o = 32767,
                        u = new Int16Array([a[0].x, a[0].y, 0, 0, a[1].x, a[1].y, o, 0, a[3].x, a[3].y, 0, o, a[2].x, a[2].y, o, o]);
                    this.tile = new Tile, this.tile.buckets = {}, this.tile.boundsBuffer = n.createBuffer(), n.bindBuffer(n.ARRAY_BUFFER, this.tile.boundsBuffer), n.bufferData(n.ARRAY_BUFFER, u, n.STATIC_DRAW), this.center = i
                },
                loaded: function() {
                    return this.image && this.image.complete
                },
                update: function() {},
                reload: function() {},
                render: function(e, t) {
                    if (this._loaded && this.loaded()) {
                        var i = this.center;
                        this.tile.calculateMatrices(i.zoom, i.column, i.row, this.map.transform, t);
                        var r = t.gl;
                        this.tile.texture ? (r.bindTexture(r.TEXTURE_2D, this.tile.texture), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, this.image)) : (this.tile.texture = r.createTexture(), r.bindTexture(r.TEXTURE_2D, this.tile.texture), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, r.RGBA, r.UNSIGNED_BYTE, this.image)), t.drawLayers(e, this.tile.posMatrix, this.tile)
                    }
                },
                featuresAt: function(e, t, i) {
                    return i(null, [])
                },
                featuresIn: function(e, t, i) {
                    return i(null, [])
                }
            });
        }, {
            "../geo/lng_lat": 10,
            "../util/ajax": 83,
            "../util/evented": 89,
            "../util/util": 95,
            "./tile": 34,
            "point-geometry": 131
        }],
        32: [function(require, module, exports) {
            "use strict";

            function RasterTileSource(e) {
                util.extend(this, util.pick(e, ["url", "tileSize"])), Source._loadTileJSON.call(this, e)
            }
            var util = require("../util/util"),
                ajax = require("../util/ajax"),
                Evented = require("../util/evented"),
                Source = require("./source"),
                normalizeURL = require("../util/mapbox").normalizeTileURL;
            module.exports = RasterTileSource, RasterTileSource.prototype = util.inherit(Evented, {
                minzoom: 0,
                maxzoom: 22,
                roundZoom: !0,
                tileSize: 512,
                _loaded: !1,
                onAdd: function(e) {
                    this.map = e
                },
                loaded: function() {
                    return this._pyramid && this._pyramid.loaded()
                },
                update: function(e) {
                    this._pyramid && this._pyramid.update(this.used, e, this.map.style.rasterFadeDuration)
                },
                reload: function() {},
                render: Source._renderTiles,
                _loadTile: function(e) {
                    function t(t, i) {
                        if (delete e.request, !e.aborted) {
                            if (t) return e.errored = !0, void this.fire("tile.error", {
                                tile: e,
                                error: t
                            });
                            var r = this.map.painter.gl;
                            e.texture = this.map.painter.getTexture(i.width), e.texture ? (r.bindTexture(r.TEXTURE_2D, e.texture), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, i)) : (e.texture = r.createTexture(), r.bindTexture(r.TEXTURE_2D, e.texture), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR_MIPMAP_NEAREST), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, r.RGBA, r.UNSIGNED_BYTE, i), e.texture.size = i.width), r.generateMipmap(r.TEXTURE_2D), e.timeAdded = (new Date).getTime(), this.map.animationLoop.set(this.style.rasterFadeDuration), e.source = this, e.loaded = !0, this.fire("tile.load", {
                                tile: e
                            })
                        }
                    }
                    var i = normalizeURL(e.coord.url(this.tiles), this.url);
                    e.request = ajax.getImage(i, t.bind(this))
                },
                _abortTile: function(e) {
                    e.aborted = !0, e.request && (e.request.abort(), delete e.request)
                },
                _addTile: function(e) {
                    this.fire("tile.add", {
                        tile: e
                    })
                },
                _removeTile: function(e) {
                    this.fire("tile.remove", {
                        tile: e
                    })
                },
                _unloadTile: function(e) {
                    e.texture && this.map.painter.saveTexture(e.texture)
                },
                featuresAt: function(e, t, i) {
                    i(null, [])
                },
                featuresIn: function(e, t, i) {
                    i(null, [])
                }
            });
        }, {
            "../util/ajax": 83,
            "../util/evented": 89,
            "../util/mapbox": 92,
            "../util/util": 95,
            "./source": 33
        }],
        33: [function(require, module, exports) {
            "use strict";
            var util = require("../util/util"),
                ajax = require("../util/ajax"),
                browser = require("../util/browser"),
                TilePyramid = require("./tile_pyramid"),
                TileCoord = require("./tile_coord"),
                normalizeURL = require("../util/mapbox").normalizeSourceURL;
            exports._loadTileJSON = function(e) {
                var i = function(e, i) {
                    return e ? void this.fire("error", {
                        error: e
                    }) : (util.extend(this, util.pick(i, ["tiles", "minzoom", "maxzoom", "attribution"])), i.vector_layers && (this.vectorLayers = i.vector_layers, this.vectorLayerIds = this.vectorLayers.map(function(e) {
                        return e.id
                    })), this._pyramid = new TilePyramid({
                        tileSize: this.tileSize,
                        cacheSize: 20,
                        minzoom: this.minzoom,
                        maxzoom: this.maxzoom,
                        roundZoom: this.roundZoom,
                        reparseOverscaled: this.reparseOverscaled,
                        load: this._loadTile.bind(this),
                        abort: this._abortTile.bind(this),
                        unload: this._unloadTile.bind(this),
                        add: this._addTile.bind(this),
                        remove: this._removeTile.bind(this),
                        redoPlacement: this._redoTilePlacement ? this._redoTilePlacement.bind(this) : void 0
                    }), void this.fire("load"))
                }.bind(this);
                e.url ? ajax.getJSON(normalizeURL(e.url), i) : browser.frame(i.bind(this, null, e))
            }, exports.redoPlacement = function() {
                if (this._pyramid)
                    for (var e = this._pyramid.orderedIDs(), i = 0; i < e.length; i++) {
                        var r = this._pyramid.getTile(e[i]);
                        this._redoTilePlacement(r)
                    }
            }, exports._renderTiles = function(e, i) {
                if (this._pyramid)
                    for (var r = this._pyramid.renderedIDs(), t = 0; t < r.length; t++) {
                        var o = this._pyramid.getTile(r[t]),
                            a = TileCoord.fromID(r[t]),
                            s = a.z,
                            n = a.x,
                            l = a.y,
                            d = a.w;
                        s = Math.min(s, this.maxzoom), n += d * (1 << s), o.calculateMatrices(s, n, l, i.transform, i), i.drawTile(o, e)
                    }
            }, exports._vectorFeaturesAt = function(e, i, r) {
                if (!this._pyramid) return r(null, []);
                var t = this._pyramid.tileAt(e);
                return t ? void this.dispatcher.send("query features", {
                    uid: t.tile.uid,
                    x: t.x,
                    y: t.y,
                    tileExtent: t.tile.tileExtent,
                    scale: t.scale,
                    source: this.id,
                    params: i
                }, r, t.tile.workerID) : r(null, [])
            }, exports._vectorFeaturesIn = function(e, i, r) {
                if (!this._pyramid) return r(null, []);
                var t = this._pyramid.tilesIn(e);
                return t ? void util.asyncAll(t, function(e, r) {
                    this.dispatcher.send("query features", {
                        uid: e.tile.uid,
                        source: this.id,
                        minX: e.minX,
                        maxX: e.maxX,
                        minY: e.minY,
                        maxY: e.maxY,
                        params: i
                    }, r, e.tile.workerID)
                }.bind(this), function(e, i) {
                    r(e, Array.prototype.concat.apply([], i))
                }) : r(null, [])
            }, exports.create = function(e) {
                var i = {
                    vector: require("./vector_tile_source"),
                    raster: require("./raster_tile_source"),
                    geojson: require("./geojson_source"),
                    video: require("./video_source"),
                    image: require("./image_source")
                };
                for (var r in i)
                    if (e instanceof i[r]) return e;
                return new i[e.type](e)
            };
        }, {
            "../util/ajax": 83,
            "../util/browser": 84,
            "../util/mapbox": 92,
            "../util/util": 95,
            "./geojson_source": 29,
            "./image_source": 31,
            "./raster_tile_source": 32,
            "./tile_coord": 35,
            "./tile_pyramid": 36,
            "./vector_tile_source": 37,
            "./video_source": 38
        }],
        34: [function(require, module, exports) {
            "use strict";

            function Tile(t, e) {
                this.coord = t, this.uid = util.uniqueId(), this.loaded = !1, this.uses = 0, this.tileSize = e
            }

            function unserializeBuffers(t) {
                var e = {};
                for (var i in t) e[i] = new Buffer(t[i]);
                return e
            }
            var mat4 = require("gl-matrix").mat4,
                util = require("../util/util"),
                Buffer = require("../data/buffer");
            module.exports = Tile, Tile.prototype = {
                tileExtent: 4096,
                calculateMatrices: function(t, e, i, s) {
                    var r = Math.pow(2, t),
                        o = s.worldSize / r;
                    this.scale = o, this.posMatrix = new Float64Array(16), mat4.identity(this.posMatrix), mat4.translate(this.posMatrix, this.posMatrix, [e * o, i * o, 0]), mat4.scale(this.posMatrix, this.posMatrix, [o / this.tileExtent, o / this.tileExtent, 1]), mat4.multiply(this.posMatrix, s.projMatrix, this.posMatrix), this.posMatrix = new Float32Array(this.posMatrix), this.exMatrix = s.exMatrix, this.rotationMatrix = s.rotationMatrix
                },
                positionAt: function(t, e) {
                    return t = t.zoomTo(Math.min(this.coord.z, e)), {
                        x: (t.column - this.coord.x) * this.tileExtent,
                        y: (t.row - this.coord.y) * this.tileExtent,
                        scale: this.scale
                    }
                },
                loadVectorData: function(t) {
                    this.loaded = !0, t && (this.buffers = unserializeBuffers(t.buffers), this.elementGroups = t.elementGroups, this.tileExtent = t.extent)
                },
                reloadSymbolData: function(t, e) {
                    if (this.buffers) {
                        this.buffers.glyphVertex && this.buffers.glyphVertex.destroy(e.gl), this.buffers.glyphElement && this.buffers.glyphElement.destroy(e.gl), this.buffers.iconVertex && this.buffers.iconVertex.destroy(e.gl), this.buffers.iconElement && this.buffers.iconElement.destroy(e.gl), this.buffers.collisionBoxVertex && this.buffers.collisionBoxVertex.destroy(e.gl);
                        var i = unserializeBuffers(t.buffers);
                        this.buffers.glyphVertex = i.glyphVertex, this.buffers.glyphElement = i.glyphElement, this.buffers.iconVertex = i.iconVertex, this.buffers.iconElement = i.iconElement, this.buffers.collisionBoxVertex = i.collisionBoxVertex;
                        for (var s in t.elementGroups) this.elementGroups[s] = t.elementGroups[s]
                    }
                },
                unloadVectorData: function(t) {
                    for (var e in this.buffers) this.buffers[e] && this.buffers[e].destroy(t.gl);
                    this.buffers = null
                },
                redoPlacement: function(t) {
                    function e(e, i) {
                        this.reloadSymbolData(i, t.map.painter), t.fire("tile.load", {
                            tile: this
                        }), this.redoingPlacement = !1, this.redoWhenDone && (this.redoPlacement(t), this.redoWhenDone = !1)
                    }
                    return !this.loaded || this.redoingPlacement ? void(this.redoWhenDone = !0) : (this.redoingPlacement = !0, void t.dispatcher.send("redo placement", {
                        uid: this.uid,
                        source: t.id,
                        angle: t.map.transform.angle,
                        pitch: t.map.transform.pitch,
                        collisionDebug: t.map.collisionDebug
                    }, e.bind(this), this.workerID))
                }
            };
        }, {
            "../data/buffer": 2,
            "../util/util": 95,
            "gl-matrix": 110
        }],
        35: [function(require, module, exports) {
            "use strict";

            function TileCoord(t, i, o, r) {
                isNaN(r) && (r = 0), this.z = +t, this.x = +i, this.y = +o, this.w = +r, r *= 2, 0 > r && (r = -1 * r - 1);
                var e = 1 << this.z;
                this.id = 32 * (e * e * r + e * this.y + this.x) + this.z
            }

            function edge(t, i) {
                if (t.row > i.row) {
                    var o = t;
                    t = i, i = o
                }
                return {
                    x0: t.column,
                    y0: t.row,
                    x1: i.column,
                    y1: i.row,
                    dx: i.column - t.column,
                    dy: i.row - t.row
                }
            }

            function scanSpans(t, i, o, r, e) {
                var n = Math.max(o, Math.floor(i.y0)),
                    h = Math.min(r, Math.ceil(i.y1));
                if (t.x0 === i.x0 && t.y0 === i.y0 ? t.x0 + i.dy / t.dy * t.dx < i.x1 : t.x1 - i.dy / t.dy * t.dx < i.x0) {
                    var s = t;
                    t = i, i = s
                }
                for (var d = t.dx / t.dy, a = i.dx / i.dy, l = t.dx > 0, y = i.dx < 0, x = n; h > x; x++) {
                    var c = d * Math.max(0, Math.min(t.dy, x + l - t.y0)) + t.x0,
                        u = a * Math.max(0, Math.min(i.dy, x + y - i.y0)) + i.x0;
                    e(Math.floor(u), Math.ceil(c), x)
                }
            }

            function scanTriangle(t, i, o, r, e, n) {
                var h, s = edge(t, i),
                    d = edge(i, o),
                    a = edge(o, t);
                s.dy > d.dy && (h = s, s = d, d = h), s.dy > a.dy && (h = s, s = a, a = h), d.dy > a.dy && (h = d, d = a, a = h), s.dy && scanSpans(a, s, r, e, n), d.dy && scanSpans(a, d, r, e, n)
            }
            module.exports = TileCoord, TileCoord.prototype.toString = function() {
                return this.z + "/" + this.x + "/" + this.y
            }, TileCoord.fromID = function(t) {
                var i = t % 32,
                    o = 1 << i,
                    r = (t - i) / 32,
                    e = r % o,
                    n = (r - e) / o % o,
                    h = Math.floor(r / (o * o));
                return h % 2 !== 0 && (h = -1 * h - 1), h /= 2, new TileCoord(i, e, n, h)
            }, TileCoord.prototype.url = function(t, i) {
                return t[(this.x + this.y) % t.length].replace("{prefix}", (this.x % 16).toString(16) + (this.y % 16).toString(16)).replace("{z}", Math.min(this.z, i || this.z)).replace("{x}", this.x).replace("{y}", this.y)
            }, TileCoord.prototype.parent = function(t) {
                return 0 === this.z ? null : this.z > t ? new TileCoord(this.z - 1, this.x, this.y, this.w) : new TileCoord(this.z - 1, Math.floor(this.x / 2), Math.floor(this.y / 2), this.w)
            }, TileCoord.prototype.wrapped = function() {
                return new TileCoord(this.z, this.x, this.y, 0)
            }, TileCoord.prototype.children = function(t) {
                if (this.z >= t) return [new TileCoord(this.z + 1, this.x, this.y, this.w)];
                var i = this.z + 1,
                    o = 2 * this.x,
                    r = 2 * this.y;
                return [new TileCoord(i, o, r, this.w), new TileCoord(i, o + 1, r, this.w), new TileCoord(i, o, r + 1, this.w), new TileCoord(i, o + 1, r + 1, this.w)]
            }, TileCoord.cover = function(t, i, o) {
                function r(t, i, r) {
                    var h, s, d;
                    if (r >= 0 && e >= r)
                        for (h = t; i > h; h++) s = (h % e + e) % e, d = new TileCoord(o, s, r, Math.floor(h / e)), n[d.id] = d
                }
                var e = 1 << t,
                    n = {};
                return scanTriangle(i[0], i[1], i[2], 0, e, r), scanTriangle(i[2], i[3], i[0], 0, e, r), Object.keys(n).map(function(t) {
                    return n[t]
                })
            };
        }, {}],
        36: [function(require, module, exports) {
            "use strict";

            function TilePyramid(e) {
                this.tileSize = e.tileSize, this.minzoom = e.minzoom, this.maxzoom = e.maxzoom, this.roundZoom = e.roundZoom, this.reparseOverscaled = e.reparseOverscaled, this._load = e.load, this._abort = e.abort, this._unload = e.unload, this._add = e.add, this._remove = e.remove, this._redoPlacement = e.redoPlacement, this._tiles = {}, this._cache = new Cache(e.cacheSize, function(e) {
                    return this._unload(e)
                }.bind(this)), this._filterRendered = this._filterRendered.bind(this)
            }

            function compareKeyZoom(e, i) {
                return i % 32 - e % 32
            }
            var Tile = require("./tile"),
                TileCoord = require("./tile_coord"),
                Point = require("point-geometry"),
                Cache = require("../util/mru_cache"),
                util = require("../util/util");
            module.exports = TilePyramid, TilePyramid.prototype = {
                loaded: function() {
                    for (var e in this._tiles)
                        if (!this._tiles[e].loaded && !this._tiles[e].errored) return !1;
                    return !0
                },
                orderedIDs: function() {
                    return Object.keys(this._tiles).map(Number).sort(compareKeyZoom)
                },
                renderedIDs: function() {
                    return this.orderedIDs().filter(this._filterRendered)
                },
                _filterRendered: function(e) {
                    return this._tiles[e].loaded && !this._coveredTiles[e]
                },
                reload: function() {
                    this._cache.reset();
                    for (var e in this._tiles) this._load(this._tiles[e])
                },
                getTile: function(e) {
                    return this._tiles[e]
                },
                getZoom: function(e) {
                    return e.zoom + Math.log(e.tileSize / this.tileSize) / Math.LN2
                },
                coveringZoomLevel: function(e) {
                    return (this.roundZoom ? Math.round : Math.floor)(this.getZoom(e))
                },
                coveringTiles: function(e) {
                    var i = this.coveringZoomLevel(e),
                        t = i;
                    if (i < this.minzoom) return [];
                    i > this.maxzoom && (i = this.maxzoom);
                    var o = e,
                        r = o.locationCoordinate(o.center)._zoomTo(i),
                        s = new Point(r.column - .5, r.row - .5);
                    return TileCoord.cover(i, [o.pointCoordinate(new Point(0, 0))._zoomTo(i), o.pointCoordinate(new Point(o.width, 0))._zoomTo(i), o.pointCoordinate(new Point(o.width, o.height))._zoomTo(i), o.pointCoordinate(new Point(0, o.height))._zoomTo(i)], this.reparseOverscaled ? t : i).sort(function(e, i) {
                        return s.dist(e) - s.dist(i)
                    })
                },
                findLoadedChildren: function(e, i, t) {
                    var o = !1;
                    for (var r in this._tiles) {
                        var s = this._tiles[r];
                        if (!(t[r] || !s.loaded || s.coord.z <= e.z || s.coord.z > i)) {
                            var n = Math.pow(2, Math.min(s.coord.z, this.maxzoom) - Math.min(e.z, this.maxzoom));
                            if (Math.floor(s.coord.x / n) === e.x && Math.floor(s.coord.y / n) === e.y)
                                for (t[r] = !0, o = !0; s && s.coord.z - 1 > e.z;) {
                                    var d = s.coord.parent(this.maxzoom).id;
                                    s = this._tiles[d], s && s.loaded && (delete t[r], t[d] = !0)
                                }
                        }
                    }
                    return o
                },
                findLoadedParent: function(e, i, t) {
                    for (var o = e.z - 1; o >= i; o--) {
                        e = e.parent(this.maxzoom);
                        var r = this._tiles[e.id];
                        if (r && r.loaded) return t[e.id] = !0, r
                    }
                },
                update: function(e, i, t) {
                    var o, r, s, n = (this.roundZoom ? Math.round : Math.floor)(this.getZoom(i)),
                        d = util.clamp(n - 10, this.minzoom, this.maxzoom),
                        a = util.clamp(n + 3, this.minzoom, this.maxzoom),
                        h = {},
                        l = (new Date).getTime();
                    this._coveredTiles = {};
                    var m = e ? this.coveringTiles(i) : [];
                    for (o = 0; o < m.length; o++) r = m[o], s = this.addTile(r), h[r.id] = !0, s.loaded || this.findLoadedChildren(r, a, h) || this.findLoadedParent(r, d, h);
                    for (var c in h) r = TileCoord.fromID(c), s = this._tiles[c], s && s.timeAdded > l - (t || 0) && (this.findLoadedChildren(r, a, h) ? (this._coveredTiles[c] = !0, h[c] = !0) : this.findLoadedParent(r, d, h));
                    var u = util.keysDifference(this._tiles, h);
                    for (o = 0; o < u.length; o++) this.removeTile(+u[o])
                },
                addTile: function(e) {
                    var i = this._tiles[e.id];
                    if (i) return i;
                    var t = e.wrapped();
                    if (i = this._tiles[t.id], i || (i = this._cache.get(t.id), i && this._redoPlacement && this._redoPlacement(i)), !i) {
                        var o = e.z,
                            r = o > this.maxzoom ? Math.pow(2, o - this.maxzoom) : 1;
                        i = new Tile(t, this.tileSize * r), this._load(i)
                    }
                    return i.uses++, this._tiles[e.id] = i, this._add(i, e), i
                },
                removeTile: function(e) {
                    var i = this._tiles[e];
                    i && (i.uses--, delete this._tiles[e], this._remove(i), i.uses > 0 || (i.loaded ? this._cache.add(i.coord.wrapped().id, i) : (this._abort(i), this._unload(i))))
                },
                clearTiles: function() {
                    for (var e in this._tiles) this.removeTile(e);
                    this._cache.reset()
                },
                tileAt: function(e) {
                    for (var i = this.orderedIDs(), t = 0; t < i.length; t++) {
                        var o = this._tiles[i[t]],
                            r = o.positionAt(e, this.maxzoom);
                        if (r && r.x >= 0 && r.x < o.tileExtent && r.y >= 0 && r.y < o.tileExtent) return {
                            tile: o,
                            x: r.x,
                            y: r.y,
                            scale: r.scale
                        }
                    }
                },
                tilesIn: function(e) {
                    for (var i = [], t = this.orderedIDs(), o = 0; o < t.length; o++) {
                        var r = this._tiles[t[o]],
                            s = [r.positionAt(e[0], this.maxzoom), r.positionAt(e[1], this.maxzoom)];
                        s[0].x < r.tileExtent && s[0].y < r.tileExtent && s[1].x >= 0 && s[1].y >= 0 && i.push({
                            tile: r,
                            minX: s[0].x,
                            maxX: s[1].x,
                            minY: s[0].y,
                            maxY: s[1].y
                        })
                    }
                    return i
                }
            };
        }, {
            "../util/mru_cache": 93,
            "../util/util": 95,
            "./tile": 34,
            "./tile_coord": 35,
            "point-geometry": 131
        }],
        37: [function(require, module, exports) {
            "use strict";

            function VectorTileSource(e) {
                if (util.extend(this, util.pick(e, ["url", "tileSize"])), 512 !== this.tileSize) throw new Error("vector tile sources must have a tileSize of 512");
                Source._loadTileJSON.call(this, e)
            }
            var util = require("../util/util"),
                Evented = require("../util/evented"),
                Source = require("./source"),
                normalizeURL = require("../util/mapbox").normalizeTileURL;
            module.exports = VectorTileSource, VectorTileSource.prototype = util.inherit(Evented, {
                minzoom: 0,
                maxzoom: 22,
                tileSize: 512,
                reparseOverscaled: !0,
                _loaded: !1,
                onAdd: function(e) {
                    this.map = e
                },
                loaded: function() {
                    return this._pyramid && this._pyramid.loaded()
                },
                update: function(e) {
                    this._pyramid && this._pyramid.update(this.used, e)
                },
                reload: function() {
                    this._pyramid && this._pyramid.reload()
                },
                render: Source._renderTiles,
                featuresAt: Source._vectorFeaturesAt,
                featuresIn: Source._vectorFeaturesIn,
                _loadTile: function(e) {
                    var i = e.coord.z > this.maxzoom ? Math.pow(2, e.coord.z - this.maxzoom) : 1,
                        t = {
                            url: normalizeURL(e.coord.url(this.tiles, this.maxzoom), this.url),
                            uid: e.uid,
                            coord: e.coord,
                            zoom: e.coord.z,
                            tileSize: this.tileSize * i,
                            source: this.id,
                            overscaling: i,
                            angle: this.map.transform.angle,
                            pitch: this.map.transform.pitch,
                            collisionDebug: this.map.collisionDebug
                        };
                    e.workerID ? this.dispatcher.send("reload tile", t, this._tileLoaded.bind(this, e), e.workerID) : e.workerID = this.dispatcher.send("load tile", t, this._tileLoaded.bind(this, e))
                },
                _tileLoaded: function(e, i, t) {
                    if (!e.aborted) {
                        if (i) return void this.fire("tile.error", {
                            tile: e,
                            error: i
                        });
                        e.loadVectorData(t), e.redoWhenDone && (e.redoWhenDone = !1, e.redoPlacement(this)), this.fire("tile.load", {
                            tile: e
                        }), this.fire("tile.stats", t.bucketStats)
                    }
                },
                _abortTile: function(e) {
                    e.aborted = !0, this.dispatcher.send("abort tile", {
                        uid: e.uid,
                        source: this.id
                    }, null, e.workerID)
                },
                _addTile: function(e) {
                    this.fire("tile.add", {
                        tile: e
                    })
                },
                _removeTile: function(e) {
                    this.fire("tile.remove", {
                        tile: e
                    })
                },
                _unloadTile: function(e) {
                    e.unloadVectorData(this.map.painter), this.glyphAtlas.removeGlyphs(e.uid), this.dispatcher.send("remove tile", {
                        uid: e.uid,
                        source: this.id
                    }, null, e.workerID)
                },
                redoPlacement: Source.redoPlacement,
                _redoTilePlacement: function(e) {
                    e.redoPlacement(this)
                }
            });
        }, {
            "../util/evented": 89,
            "../util/mapbox": 92,
            "../util/util": 95,
            "./source": 33
        }],
        38: [function(require, module, exports) {
            "use strict";

            function VideoSource(e) {
                this.coordinates = e.coordinates, ajax.getVideo(e.urls, function(e, t) {
                    if (!e) {
                        this.video = t, this.video.loop = !0;
                        var i;
                        this.video.addEventListener("playing", function() {
                            i = this.map.style.animationLoop.set(1 / 0), this.map._rerender()
                        }.bind(this)), this.video.addEventListener("pause", function() {
                            this.map.style.animationLoop.cancel(i)
                        }.bind(this)), this._loaded = !0, this.map && (this.video.play(), this.createTile(), this.fire("change"))
                    }
                }.bind(this))
            }
            var util = require("../util/util"),
                Tile = require("./tile"),
                LngLat = require("../geo/lng_lat"),
                Point = require("point-geometry"),
                Evented = require("../util/evented"),
                ajax = require("../util/ajax");
            module.exports = VideoSource, VideoSource.prototype = util.inherit(Evented, {
                roundZoom: !0,
                getVideo: function() {
                    return this.video
                },
                onAdd: function(e) {
                    this.map = e, this.video && (this.video.play(), this.createTile())
                },
                createTile: function() {
                    var e = this.map,
                        t = this.coordinates.map(function(t) {
                            var i = LngLat.convert(t);
                            return e.transform.locationCoordinate(i).zoomTo(0)
                        }),
                        i = util.getCoordinatesCenter(t),
                        r = 4096,
                        o = t.map(function(e) {
                            var t = e.zoomTo(i.zoom);
                            return new Point(Math.round((t.column - i.column) * r), Math.round((t.row - i.row) * r))
                        }),
                        n = e.painter.gl,
                        a = 32767,
                        u = new Int16Array([o[0].x, o[0].y, 0, 0, o[1].x, o[1].y, a, 0, o[3].x, o[3].y, 0, a, o[2].x, o[2].y, a, a]);
                    this.tile = new Tile, this.tile.buckets = {}, this.tile.boundsBuffer = n.createBuffer(), n.bindBuffer(n.ARRAY_BUFFER, this.tile.boundsBuffer), n.bufferData(n.ARRAY_BUFFER, u, n.STATIC_DRAW), this.center = i
                },
                loaded: function() {
                    return this.video && this.video.readyState >= 2
                },
                update: function() {},
                reload: function() {},
                render: function(e, t) {
                    if (this._loaded && !(this.video.readyState < 2)) {
                        var i = this.center;
                        this.tile.calculateMatrices(i.zoom, i.column, i.row, this.map.transform, t);
                        var r = t.gl;
                        this.tile.texture ? (r.bindTexture(r.TEXTURE_2D, this.tile.texture), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, this.video)) : (this.tile.texture = r.createTexture(), r.bindTexture(r.TEXTURE_2D, this.tile.texture), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, r.RGBA, r.UNSIGNED_BYTE, this.video)), t.drawLayers(e, this.tile.posMatrix, this.tile)
                    }
                },
                featuresAt: function(e, t, i) {
                    return i(null, [])
                },
                featuresIn: function(e, t, i) {
                    return i(null, [])
                }
            });
        }, {
            "../geo/lng_lat": 10,
            "../util/ajax": 83,
            "../util/evented": 89,
            "../util/util": 95,
            "./tile": 34,
            "point-geometry": 131
        }],
        39: [function(require, module, exports) {
            "use strict";

            function Worker(e) {
                this.self = e, this.actor = new Actor(e, this), this.loading = {}, this.loaded = {}, this.layers = [], this.geoJSONIndexes = {}
            }
            var Actor = require("../util/actor"),
                WorkerTile = require("./worker_tile"),
                util = require("../util/util"),
                ajax = require("../util/ajax"),
                vt = require("vector-tile"),
                Protobuf = require("pbf"),
                geojsonvt = require("geojson-vt"),
                GeoJSONWrapper = require("./geojson_wrapper");
            module.exports = function(e) {
                return new Worker(e)
            }, util.extend(Worker.prototype, {
                "set layers": function(e) {
                    this.layers = e
                },
                "load tile": function(e, r) {
                    function t(e, t) {
                        return delete this.loading[i][o], e ? r(e) : (a.data = new vt.VectorTile(new Protobuf(new Uint8Array(t))), a.parse(a.data, this.layers, this.actor, r), this.loaded[i] = this.loaded[i] || {}, void(this.loaded[i][o] = a))
                    }
                    var i = e.source,
                        o = e.uid;
                    this.loading[i] || (this.loading[i] = {});
                    var a = this.loading[i][o] = new WorkerTile(e);
                    a.xhr = ajax.getArrayBuffer(e.url, t.bind(this))
                },
                "reload tile": function(e, r) {
                    var t = this.loaded[e.source],
                        i = e.uid;
                    if (t && t[i]) {
                        var o = t[i];
                        o.parse(o.data, this.layers, this.actor, r)
                    }
                },
                "abort tile": function(e) {
                    var r = this.loading[e.source],
                        t = e.uid;
                    r && r[t] && (r[t].xhr.abort(), delete r[t])
                },
                "remove tile": function(e) {
                    var r = this.loaded[e.source],
                        t = e.uid;
                    r && r[t] && delete r[t]
                },
                "redo placement": function(e, r) {
                    var t = this.loaded[e.source],
                        i = this.loading[e.source],
                        o = e.uid;
                    if (t && t[o]) {
                        var a = t[o],
                            s = a.redoPlacement(e.angle, e.pitch, e.collisionDebug);
                        s.result && r(null, s.result, s.transferables)
                    } else i && i[o] && (i[o].angle = e.angle)
                },
                "parse geojson": function(e, r) {
                    var t = function(t, i) {
                        return t ? r(t) : (this.geoJSONIndexes[e.source] = geojsonvt(i, e.geojsonVtOptions), void r(null))
                    }.bind(this);
                    "string" == typeof e.data ? ajax.getJSON(e.data, t) : t(null, e.data)
                },
                "load geojson tile": function(e, r) {
                    var t = e.source,
                        i = e.coord,
                        o = this.geoJSONIndexes[t].getTile(i.z, i.x, i.y);
                    if (!o) return r(null, null);
                    var a = new WorkerTile(e);
                    a.parse(new GeoJSONWrapper(o.features), this.layers, this.actor, r), this.loaded[t] = this.loaded[t] || {}, this.loaded[t][e.uid] = a
                },
                "query features": function(e, r) {
                    var t = this.loaded[e.source] && this.loaded[e.source][e.uid];
                    t ? t.featureTree.query(e, r) : r(null, [])
                }
            });
        }, {
            "../util/actor": 82,
            "../util/ajax": 83,
            "../util/util": 95,
            "./geojson_wrapper": 30,
            "./worker_tile": 40,
            "geojson-vt": 105,
            "pbf": 129,
            "vector-tile": 135
        }],
        40: [function(require, module, exports) {
            "use strict";

            function WorkerTile(e) {
                this.coord = e.coord, this.uid = e.uid, this.zoom = e.zoom, this.tileSize = e.tileSize, this.source = e.source, this.overscaling = e.overscaling, this.angle = e.angle, this.pitch = e.pitch, this.collisionDebug = e.collisionDebug
            }

            function getElementGroups(e) {
                for (var t = {}, r = 0; r < e.length; r++) t[e[r].id] = e[r].elementGroups;
                return t
            }

            function getTransferables(e) {
                var t = [];
                for (var r in e) t.push(e[r].arrayBuffer), e[r].push = null;
                return t
            }
            var FeatureTree = require("../data/feature_tree"),
                CollisionTile = require("../symbol/collision_tile"),
                Bucket = require("../data/bucket");
            module.exports = WorkerTile, WorkerTile.prototype.parse = function(e, t, r, o) {
                function s(e, t) {
                    for (var r = 0; r < e.length; r++) {
                        var o = e.feature(r);
                        for (var s in t) t[s].filter(o) && t[s].features.push(o)
                    }
                }

                function i(e) {
                    if (e) return o(e);
                    if (G++, 2 === G) {
                        for (var t = k.length - 1; t >= 0; t--) n(g, k[t]);
                        l()
                    }
                }

                function n(e, t) {
                    var r = Date.now();
                    t.addFeatures(p, B, z);
                    var o = Date.now() - r;
                    if (t.interactive)
                        for (var s = 0; s < t.features.length; s++) {
                            var i = t.features[s];
                            e.featureTree.insert(i.bbox(), t.layers, i)
                        }
                    t.features = null, h._total += o, h[t.id] = (h[t.id] || 0) + o
                }

                function l() {
                    if (g.status = "done", g.redoPlacementAfterDone) {
                        var e = g.redoPlacement(g.angle, g.pitch).result;
                        m.glyphVertex = e.buffers.glyphVertex, m.iconVertex = e.buffers.iconVertex, m.collisionBoxVertex = e.buffers.collisionBoxVertex, g.redoPlacementAfterDone = !1
                    }
                    o(null, {
                        elementGroups: getElementGroups(y),
                        buffers: m,
                        extent: b,
                        bucketStats: h
                    }, getTransferables(m))
                }
                this.status = "parsing", this.featureTree = new FeatureTree(this.coord, this.overscaling);
                var a, u, f, c, h = {
                        _total: 0
                    },
                    g = this,
                    m = {},
                    p = new CollisionTile(this.angle, this.pitch),
                    d = {},
                    v = {};
                for (a = 0; a < t.length; a++) u = t[a], u.source !== this.source || u.ref || u.minzoom && this.zoom < u.minzoom || u.maxzoom && this.zoom >= u.maxzoom || "none" === u.layout.visibility || (c = Bucket.create({
                    layer: u,
                    buffers: m,
                    zoom: this.zoom,
                    overscaling: this.overscaling,
                    collisionDebug: this.collisionDebug
                }), c.layers = [u.id], d[u.id] = c, e.layers && (f = u["source-layer"], v[f] = v[f] || {}, v[f][u.id] = c));
                for (a = 0; a < t.length; a++) u = t[a], u.source === this.source && u.ref && d[u.ref] && d[u.ref].layers.push(u.id);
                var b = 4096;
                if (e.layers)
                    for (f in v) u = e.layers[f], u && (u.extent && (b = u.extent), s(u, v[f]));
                else s(e, d);
                var y = [],
                    k = this.symbolBuckets = [],
                    x = [];
                for (var T in d) c = d[T], 0 !== c.features.length && (y.push(c), "symbol" === c.type ? k.push(c) : x.push(c));
                var z = {},
                    B = {};
                if (k.length > 0) {
                    for (a = k.length - 1; a >= 0; a--) k[a].updateIcons(z), k[a].updateFont(B);
                    for (var D in B) B[D] = Object.keys(B[D]).map(Number);
                    z = Object.keys(z);
                    var G = 0;
                    r.send("get glyphs", {
                        uid: this.uid,
                        stacks: B
                    }, function(e, t) {
                        B = t, i(e)
                    }), z.length ? r.send("get icons", {
                        icons: z
                    }, function(e, t) {
                        z = t, i(e)
                    }) : i()
                }
                for (a = x.length - 1; a >= 0; a--) n(this, x[a]);
                return 0 === k.length ? l() : void 0
            }, WorkerTile.prototype.redoPlacement = function(e, t, r) {
                if ("done" !== this.status) return this.redoPlacementAfterDone = !0, this.angle = e, {};
                for (var o = {}, s = new CollisionTile(e, t), i = this.symbolBuckets.length - 1; i >= 0; i--) this.symbolBuckets[i].placeFeatures(s, o, r);
                return {
                    result: {
                        elementGroups: getElementGroups(this.symbolBuckets),
                        buffers: o
                    },
                    transferables: getTransferables(o)
                }
            };
        }, {
            "../data/bucket": 1,
            "../data/feature_tree": 5,
            "../symbol/collision_tile": 58
        }],
        41: [function(require, module, exports) {
            "use strict";

            function AnimationLoop() {
                this.n = 0, this.times = []
            }
            module.exports = AnimationLoop, AnimationLoop.prototype.stopped = function() {
                return this.times = this.times.filter(function(t) {
                    return t.time >= (new Date).getTime()
                }), !this.times.length
            }, AnimationLoop.prototype.set = function(t) {
                return this.times.push({
                    id: this.n,
                    time: t + (new Date).getTime()
                }), this.n++
            }, AnimationLoop.prototype.cancel = function(t) {
                this.times = this.times.filter(function(i) {
                    return i.id !== t
                })
            };
        }, {}],
        42: [function(require, module, exports) {
            "use strict";

            function ImageSprite(t) {
                this.base = t, this.retina = browser.devicePixelRatio > 1;
                var i = this.retina ? "@2x" : "";
                ajax.getJSON(normalizeURL(t, i, ".json"), function(t, i) {
                    return t ? void this.fire("error", {
                        error: t
                    }) : (this.data = i, void(this.img && this.fire("load")))
                }.bind(this)), ajax.getImage(normalizeURL(t, i, ".png"), function(t, i) {
                    if (t) return void this.fire("error", {
                        error: t
                    });
                    for (var e = i.getData(), r = i.data = new Uint8Array(e.length), a = 0; a < e.length; a += 4) {
                        var o = e[a + 3] / 255;
                        r[a + 0] = e[a + 0] * o, r[a + 1] = e[a + 1] * o, r[a + 2] = e[a + 2] * o, r[a + 3] = e[a + 3]
                    }
                    this.img = i, this.data && this.fire("load")
                }.bind(this))
            }

            function SpritePosition() {}
            var Evented = require("../util/evented"),
                ajax = require("../util/ajax"),
                browser = require("../util/browser"),
                normalizeURL = require("../util/mapbox").normalizeSpriteURL;
            module.exports = ImageSprite, ImageSprite.prototype = Object.create(Evented), ImageSprite.prototype.toJSON = function() {
                return this.base
            }, ImageSprite.prototype.loaded = function() {
                return !(!this.data || !this.img)
            }, ImageSprite.prototype.resize = function() {
                if (browser.devicePixelRatio > 1 !== this.retina) {
                    var t = new ImageSprite(this.base);
                    t.on("load", function() {
                        this.img = t.img, this.data = t.data, this.retina = t.retina
                    }.bind(this))
                }
            }, SpritePosition.prototype = {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                pixelRatio: 1,
                sdf: !1
            }, ImageSprite.prototype.getSpritePosition = function(t) {
                if (!this.loaded()) return new SpritePosition;
                var i = this.data && this.data[t];
                return i && this.img ? i : new SpritePosition
            };
        }, {
            "../util/ajax": 83,
            "../util/browser": 84,
            "../util/evented": 89,
            "../util/mapbox": 92
        }],
        43: [function(require, module, exports) {
            "use strict";
            var reference = require("./reference");
            module.exports = {}, reference.layout.forEach(function(e) {
                var r = function(e) {
                        for (var r in e) this[r] = e[r]
                    },
                    o = reference[e];
                for (var t in o) void 0 !== o[t]["default"] && (r.prototype[t] = o[t]["default"]);
                module.exports[e.replace("layout_", "")] = r
            });
        }, {
            "./reference": 45
        }],
        44: [function(require, module, exports) {
            "use strict";
            var reference = require("./reference"),
                parseCSSColor = require("csscolorparser").parseCSSColor;
            module.exports = {}, reference.paint.forEach(function(e) {
                var r = function() {},
                    o = reference[e];
                for (var p in o) {
                    var t = o[p],
                        a = t["default"];
                    void 0 !== a && ("color" === t.type && (a = parseCSSColor(a)), r.prototype[p] = a)
                }
                r.prototype.hidden = !1, module.exports[e.replace("paint_", "")] = r
            });
        }, {
            "./reference": 45,
            "csscolorparser": 101
        }],
        45: [function(require, module, exports) {
            "use strict";
            module.exports = require("mapbox-gl-style-spec/reference/latest");
        }, {
            "mapbox-gl-style-spec/reference/latest": 124
        }],
        46: [function(require, module, exports) {
            "use strict";

            function Style(e, t) {
                this.animationLoop = t || new AnimationLoop, this.dispatcher = new Dispatcher(Math.max(browser.hardwareConcurrency - 1, 1), this), this.glyphAtlas = new GlyphAtlas(1024, 1024), this.spriteAtlas = new SpriteAtlas(512, 512), this.spriteAtlas.resize(browser.devicePixelRatio), this.lineAtlas = new LineAtlas(256, 512), this._layers = {}, this._order = [], this._groups = [], this.sources = {}, this.zoomHistory = {}, util.bindAll(["_forwardSourceEvent", "_forwardTileEvent", "_redoPlacement"], this);
                var r = function(e, t) {
                    if (e) return void this.fire("error", {
                        error: e
                    });
                    var r = validate(t);
                    if (r.length)
                        for (var s = 0; s < r.length; s++) this.fire("error", {
                            error: new Error(r[s].message)
                        });
                    else {
                        this._loaded = !0, this.stylesheet = t;
                        var i = t.sources;
                        for (var o in i) this.addSource(o, i[o]);
                        t.sprite && (this.sprite = new ImageSprite(t.sprite), this.sprite.on("load", this.fire.bind(this, "change"))), this.glyphSource = new GlyphSource(t.glyphs, this.glyphAtlas), this._resolve(), this.fire("load")
                    }
                }.bind(this);
                "string" == typeof e ? ajax.getJSON(normalizeURL(e), r) : browser.frame(r.bind(this, null, e)), this.on("source.load", function(e) {
                    var t = e.source;
                    if (t && t.vectorLayerIds)
                        for (var r in this._layers) {
                            var s = this._layers[r];
                            s.source === t.id && this._validateLayer(s)
                        }
                })
            }
            var Evented = require("../util/evented"),
                styleBatch = require("./style_batch"),
                StyleLayer = require("./style_layer"),
                ImageSprite = require("./image_sprite"),
                GlyphSource = require("../symbol/glyph_source"),
                GlyphAtlas = require("../symbol/glyph_atlas"),
                SpriteAtlas = require("../symbol/sprite_atlas"),
                LineAtlas = require("../render/line_atlas"),
                util = require("../util/util"),
                ajax = require("../util/ajax"),
                normalizeURL = require("../util/mapbox").normalizeStyleURL,
                browser = require("../util/browser"),
                Dispatcher = require("../util/dispatcher"),
                AnimationLoop = require("./animation_loop"),
                validate = require("mapbox-gl-style-spec/lib/validate/latest");
            module.exports = Style, Style.prototype = util.inherit(Evented, {
                _loaded: !1,
                _validateLayer: function(e) {
                    var t = this.sources[e.source];
                    e["source-layer"] && t && t.vectorLayerIds && -1 === t.vectorLayerIds.indexOf(e["source-layer"]) && this.fire("error", {
                        error: new Error('Source layer "' + e["source-layer"] + '" does not exist on source "' + t.id + '" as specified by style layer "' + e.id + '"')
                    })
                },
                loaded: function() {
                    if (!this._loaded) return !1;
                    for (var e in this.sources)
                        if (!this.sources[e].loaded()) return !1;
                    return this.sprite && !this.sprite.loaded() ? !1 : !0
                },
                _resolve: function() {
                    var e, t;
                    this._layers = {}, this._order = [];
                    for (var r = 0; r < this.stylesheet.layers.length; r++) t = new StyleLayer(this.stylesheet.layers[r]), this._layers[t.id] = t, this._order.push(t.id);
                    for (e in this._layers) this._layers[e].resolveLayout();
                    for (e in this._layers) this._layers[e].resolveReference(this._layers), this._layers[e].resolvePaint();
                    this._groupLayers(), this._broadcastLayers()
                },
                _groupLayers: function() {
                    var e;
                    this._groups = [];
                    for (var t = 0; t < this._order.length; ++t) {
                        var r = this._layers[this._order[t]];
                        e && r.source === e.source || (e = [], e.source = r.source, this._groups.push(e)), e.push(r)
                    }
                },
                _broadcastLayers: function() {
                    this.dispatcher.broadcast("set layers", this._order.map(function(e) {
                        return this._layers[e].json()
                    }, this))
                },
                _cascade: function(e, t) {
                    if (this._loaded) {
                        t = t || {
                            transition: !0
                        };
                        for (var r in this._layers) this._layers[r].cascade(e, t, this.stylesheet.transition || {}, this.animationLoop);
                        this.fire("change")
                    }
                },
                _recalculate: function(e) {
                    for (var t in this.sources) this.sources[t].used = !1;
                    this._updateZoomHistory(e), this.rasterFadeDuration = 300;
                    for (t in this._layers) {
                        var r = this._layers[t];
                        r.recalculate(e, this.zoomHistory) && r.source && (this.sources[r.source].used = !0)
                    }
                    var s = 300;
                    Math.floor(this.z) !== Math.floor(e) && this.animationLoop.set(s), this.z = e, this.fire("zoom")
                },
                _updateZoomHistory: function(e) {
                    var t = this.zoomHistory;
                    void 0 === t.lastIntegerZoom && (t.lastIntegerZoom = Math.floor(e), t.lastIntegerZoomTime = 0, t.lastZoom = e), Math.floor(t.lastZoom) < Math.floor(e) ? (t.lastIntegerZoom = Math.floor(e), t.lastIntegerZoomTime = Date.now()) : Math.floor(t.lastZoom) > Math.floor(e) && (t.lastIntegerZoom = Math.floor(e + 1), t.lastIntegerZoomTime = Date.now()), t.lastZoom = e
                },
                batch: function(e) {
                    styleBatch(this, e)
                },
                addSource: function(e, t) {
                    return this.batch(function(r) {
                        r.addSource(e, t)
                    }), this
                },
                removeSource: function(e) {
                    return this.batch(function(t) {
                        t.removeSource(e)
                    }), this
                },
                getSource: function(e) {
                    return this.sources[e]
                },
                addLayer: function(e, t) {
                    return this.batch(function(r) {
                        r.addLayer(e, t)
                    }), this
                },
                removeLayer: function(e) {
                    return this.batch(function(t) {
                        t.removeLayer(e)
                    }), this
                },
                getLayer: function(e) {
                    return this._layers[e]
                },
                getReferentLayer: function(e) {
                    var t = this.getLayer(e);
                    return t.ref && (t = this.getLayer(t.ref)), t
                },
                setFilter: function(e, t) {
                    return this.batch(function(r) {
                        r.setFilter(e, t)
                    }), this
                },
                setLayerZoomRange: function(e, t, r) {
                    return this.batch(function(s) {
                        s.setLayerZoomRange(e, t, r)
                    }), this
                },
                getFilter: function(e) {
                    return this.getReferentLayer(e).filter
                },
                getLayoutProperty: function(e, t) {
                    return this.getReferentLayer(e).getLayoutProperty(t)
                },
                getPaintProperty: function(e, t, r) {
                    return this.getLayer(e).getPaintProperty(t, r)
                },
                featuresAt: function(e, t, r) {
                    this._queryFeatures("featuresAt", e, t, r)
                },
                featuresIn: function(e, t, r) {
                    this._queryFeatures("featuresIn", e, t, r)
                },
                _queryFeatures: function(e, t, r, s) {
                    var i = [],
                        o = null;
                    r.layer && (r.layerIds = Array.isArray(r.layer) ? r.layer : [r.layer]), util.asyncAll(Object.keys(this.sources), function(s, a) {
                        var n = this.sources[s];
                        n[e](t, r, function(e, t) {
                            t && (i = i.concat(t)), e && (o = e), a()
                        })
                    }.bind(this), function() {
                        return o ? s(o) : void s(null, i.filter(function(e) {
                            return void 0 !== this._layers[e.layer]
                        }.bind(this)).map(function(e) {
                            return e.layer = this._layers[e.layer].json(), e
                        }.bind(this)))
                    }.bind(this))
                },
                _remove: function() {
                    this.dispatcher.remove()
                },
                _reloadSource: function(e) {
                    this.sources[e].reload()
                },
                _updateSources: function(e) {
                    for (var t in this.sources) this.sources[t].update(e)
                },
                _redoPlacement: function() {
                    for (var e in this.sources) this.sources[e].redoPlacement && this.sources[e].redoPlacement()
                },
                _forwardSourceEvent: function(e) {
                    this.fire("source." + e.type, util.extend({
                        source: e.target
                    }, e))
                },
                _forwardTileEvent: function(e) {
                    this.fire(e.type, util.extend({
                        source: e.target
                    }, e))
                },
                "get sprite json": function(e, t) {
                    var r = this.sprite;
                    r.loaded() ? t(null, {
                        sprite: r.data,
                        retina: r.retina
                    }) : r.on("load", function() {
                        t(null, {
                            sprite: r.data,
                            retina: r.retina
                        })
                    })
                },
                "get icons": function(e, t) {
                    var r = this.sprite,
                        s = this.spriteAtlas;
                    r.loaded() ? (s.setSprite(r), s.addIcons(e.icons, t)) : r.on("load", function() {
                        s.setSprite(r), s.addIcons(e.icons, t)
                    })
                },
                "get glyphs": function(e, t) {
                    function r(e, r, s) {
                        e && console.error(e), o[s] = r, i--, 0 === i && t(null, o)
                    }
                    var s = e.stacks,
                        i = Object.keys(s).length,
                        o = {};
                    for (var a in s) this.glyphSource.getSimpleGlyphs(a, s[a], e.uid, r)
                }
            });
        }, {
            "../render/line_atlas": 26,
            "../symbol/glyph_atlas": 60,
            "../symbol/glyph_source": 61,
            "../symbol/sprite_atlas": 66,
            "../util/ajax": 83,
            "../util/browser": 84,
            "../util/dispatcher": 86,
            "../util/evented": 89,
            "../util/mapbox": 92,
            "../util/util": 95,
            "./animation_loop": 41,
            "./image_sprite": 42,
            "./style_batch": 47,
            "./style_layer": 50,
            "mapbox-gl-style-spec/lib/validate/latest": 121
        }],
        47: [function(require, module, exports) {
            "use strict";

            function styleBatch(e, t) {
                if (!e._loaded) throw new Error("Style is not done loading");
                var r = Object.create(styleBatch.prototype);
                r._style = e, r._groupLayers = !1, r._broadcastLayers = !1, r._reloadSources = {}, r._events = [], r._change = !1, t(r), r._groupLayers && r._style._groupLayers(), r._broadcastLayers && r._style._broadcastLayers(), Object.keys(r._reloadSources).forEach(function(e) {
                    r._style._reloadSource(e)
                }), r._events.forEach(function(e) {
                    r._style.fire.apply(r._style, e)
                }), r._change && r._style.fire("change")
            }
            var Source = require("../source/source"),
                StyleLayer = require("./style_layer");
            styleBatch.prototype = {
                addLayer: function(e, t) {
                    if (void 0 !== this._style._layers[e.id]) throw new Error("There is already a layer with this ID");
                    return e instanceof StyleLayer || (e = new StyleLayer(e)), this._style._validateLayer(e), this._style._layers[e.id] = e, this._style._order.splice(t ? this._style._order.indexOf(t) : 1 / 0, 0, e.id), e.resolveLayout(), e.resolveReference(this._style._layers), e.resolvePaint(), this._groupLayers = !0, this._broadcastLayers = !0, e.source && (this._reloadSources[e.source] = !0), this._events.push(["layer.add", {
                        layer: e
                    }]), this._change = !0, this
                },
                removeLayer: function(e) {
                    var t = this._style._layers[e];
                    if (void 0 === t) throw new Error("There is no layer with this ID");
                    for (var r in this._style._layers) this._style._layers[r].ref === e && this.removeLayer(r);
                    return delete this._style._layers[e], this._style._order.splice(this._style._order.indexOf(e), 1), this._groupLayers = !0, this._broadcastLayers = !0, this._events.push(["layer.remove", {
                        layer: t
                    }]), this._change = !0, this
                },
                setPaintProperty: function(e, t, r, s) {
                    return this._style.getLayer(e).setPaintProperty(t, r, s), this._change = !0, this
                },
                setLayoutProperty: function(e, t, r) {
                    return e = this._style.getReferentLayer(e), e.setLayoutProperty(t, r), this._broadcastLayers = !0, e.source && (this._reloadSources[e.source] = !0), this._change = !0, this
                },
                setFilter: function(e, t) {
                    return e = this._style.getReferentLayer(e), e.filter = t, this._broadcastLayers = !0, e.source && (this._reloadSources[e.source] = !0), this._change = !0, this
                },
                setLayerZoomRange: function(e, t, r) {
                    var s = this._style.getReferentLayer(e);
                    return null != t && (s.minzoom = t), null != r && (s.maxzoom = r), this._broadcastLayers = !0, s.source && (this._reloadSources[s.source] = !0), this._change = !0, this
                },
                addSource: function(e, t) {
                    if (!this._style._loaded) throw new Error("Style is not done loading");
                    if (void 0 !== this._style.sources[e]) throw new Error("There is already a source with this ID");
                    return t = Source.create(t), this._style.sources[e] = t, t.id = e, t.style = this._style, t.dispatcher = this._style.dispatcher, t.glyphAtlas = this._style.glyphAtlas, t.on("load", this._style._forwardSourceEvent).on("error", this._style._forwardSourceEvent).on("change", this._style._forwardSourceEvent).on("tile.add", this._style._forwardTileEvent).on("tile.load", this._style._forwardTileEvent).on("tile.error", this._style._forwardTileEvent).on("tile.remove", this._style._forwardTileEvent).on("tile.stats", this._style._forwardTileEvent), this._events.push(["source.add", {
                        source: t
                    }]), this._change = !0, this
                },
                removeSource: function(e) {
                    if (void 0 === this._style.sources[e]) throw new Error("There is no source with this ID");
                    var t = this._style.sources[e];
                    return delete this._style.sources[e], t.off("load", this._style._forwardSourceEvent).off("error", this._style._forwardSourceEvent).off("change", this._style._forwardSourceEvent).off("tile.add", this._style._forwardTileEvent).off("tile.load", this._style._forwardTileEvent).off("tile.error", this._style._forwardTileEvent).off("tile.remove", this._style._forwardTileEvent).off("tile.stats", this._style._forwardTileEvent), this._events.push(["source.remove", {
                        source: t
                    }]), this._change = !0, this
                }
            }, module.exports = styleBatch;
        }, {
            "../source/source": 33,
            "./style_layer": 50
        }],
        48: [function(require, module, exports) {
            "use strict";

            function StyleDeclaration(t, r) {
                this.type = t.type, this.transitionable = t.transition, null == r && (r = t["default"]), this.json = JSON.stringify(r), "color" === this.type ? this.value = parseColor(r) : this.value = r, "interpolated" === t["function"] ? this.calculate = MapboxGLFunction.interpolated(this.value) : (this.calculate = MapboxGLFunction["piecewise-constant"](this.value), t.transition && (this.calculate = transitioned(this.calculate)))
            }

            function transitioned(t) {
                return function(r, o, e) {
                    var n, i, a, l = r % 1,
                        s = Math.min((Date.now() - o.lastIntegerZoomTime) / e, 1),
                        c = 1,
                        u = 1;
                    return r > o.lastIntegerZoom ? (n = l + (1 - l) * s, c *= 2, i = t(r - 1), a = t(r)) : (n = 1 - (1 - s) * l, a = t(r), i = t(r + 1), c /= 2), {
                        from: i,
                        fromScale: c,
                        to: a,
                        toScale: u,
                        t: n
                    }
                }
            }

            function parseColor(t) {
                if (colorCache[t]) return colorCache[t];
                if (Array.isArray(t)) return t;
                if (t && t.stops) return util.extend({}, t, {
                    stops: t.stops.map(function(t) {
                        return [t[0], parseColor(t[1])]
                    })
                });
                if ("string" == typeof t) {
                    var r = colorDowngrade(parseCSSColor(t));
                    return colorCache[t] = r, r
                }
                throw new Error("Invalid color " + t)
            }

            function colorDowngrade(t) {
                return [t[0] / 255, t[1] / 255, t[2] / 255, t[3] / 1]
            }
            var parseCSSColor = require("csscolorparser").parseCSSColor,
                MapboxGLFunction = require("mapbox-gl-function"),
                util = require("../util/util");
            module.exports = StyleDeclaration;
            var colorCache = {};
        }, {
            "../util/util": 95,
            "csscolorparser": 101,
            "mapbox-gl-function": 120
        }],
        49: [function(require, module, exports) {
            "use strict";

            function makeConstructor(t) {
                function e(t) {
                    this._values = {}, this._transitions = {};
                    for (var e in t) this[e] = t[e]
                }
                return Object.keys(t).forEach(function(n) {
                    var r = t[n];
                    Object.defineProperty(e.prototype, n, {
                        set: function(t) {
                            this._values[n] = new StyleDeclaration(r, t)
                        },
                        get: function() {
                            return this._values[n].value
                        }
                    }), r.transition && Object.defineProperty(e.prototype, n + "-transition", {
                        set: function(t) {
                            this._transitions[n] = t
                        },
                        get: function() {
                            return this._transitions[n]
                        }
                    })
                }), e.prototype.values = function() {
                    return this._values
                }, e.prototype.transition = function(t, e) {
                    var n = this._transitions[t] || {};
                    return {
                        duration: util.coalesce(n.duration, e.duration, 300),
                        delay: util.coalesce(n.delay, e.delay, 0)
                    }
                }, e.prototype.json = function() {
                    var t = {};
                    for (var e in this._values) t[e] = this._values[e].value;
                    for (var n in this._transitions) t[n + "-transition"] = this._transitions[e];
                    return t
                }, e
            }
            var util = require("../util/util"),
                reference = require("./reference"),
                StyleDeclaration = require("./style_declaration"),
                lookup = {
                    paint: {},
                    layout: {}
                };
            reference.layer.type.values.forEach(function(t) {
                lookup.paint[t] = makeConstructor(reference["paint_" + t]), lookup.layout[t] = makeConstructor(reference["layout_" + t])
            }), module.exports = function(t, e, n) {
                return new lookup[t][e](n)
            };
        }, {
            "../util/util": 95,
            "./reference": 45,
            "./style_declaration": 48
        }],
        50: [function(require, module, exports) {
            "use strict";

            function StyleLayer(t) {
                this._layer = t, this.id = t.id, this.ref = t.ref, this._resolved = {}, this._cascaded = {}, this.assign(t)
            }

            function premultiplyLayer(t, i) {
                var e = i + "-color",
                    a = i + "-halo-color",
                    o = i + "-outline-color",
                    r = t[e],
                    s = t[a],
                    n = t[o],
                    l = t[i + "-opacity"],
                    y = r && l * r[3],
                    u = s && l * s[3],
                    h = n && l * n[3];
                void 0 !== y && 1 > y && (t[e] = util.premultiply([r[0], r[1], r[2], y])), void 0 !== u && 1 > u && (t[a] = util.premultiply([s[0], s[1], s[2], u])), void 0 !== h && 1 > h && (t[o] = util.premultiply([n[0], n[1], n[2], h]))
            }
            var util = require("../util/util"),
                StyleTransition = require("./style_transition"),
                StyleDeclarationSet = require("./style_declaration_set"),
                LayoutProperties = require("./layout_properties"),
                PaintProperties = require("./paint_properties");
            module.exports = StyleLayer, StyleLayer.prototype = {
                resolveLayout: function() {
                    this.ref || (this.layout = new LayoutProperties[this.type](this._layer.layout), "line" === this.layout["symbol-placement"] && (this.layout.hasOwnProperty("text-rotation-alignment") || (this.layout["text-rotation-alignment"] = "map"), this.layout.hasOwnProperty("icon-rotation-alignment") || (this.layout["icon-rotation-alignment"] = "map"), this.layout["symbol-avoid-edges"] = !0))
                },
                setLayoutProperty: function(t, i) {
                    null == i ? delete this.layout[t] : this.layout[t] = i
                },
                getLayoutProperty: function(t) {
                    return this.layout[t]
                },
                resolveReference: function(t) {
                    this.ref && this.assign(t[this.ref])
                },
                resolvePaint: function() {
                    for (var t in this._layer) {
                        var i = t.match(/^paint(?:\.(.*))?$/);
                        i && (this._resolved[i[1] || ""] = new StyleDeclarationSet("paint", this.type, this._layer[t]))
                    }
                },
                setPaintProperty: function(t, i, e) {
                    var a = this._resolved[e || ""];
                    a || (a = this._resolved[e || ""] = new StyleDeclarationSet("paint", this.type, {})), a[t] = i
                },
                getPaintProperty: function(t, i) {
                    var e = this._resolved[i || ""];
                    if (e) return e[t]
                },
                cascade: function(t, i, e, a) {
                    for (var o in this._resolved)
                        if ("" === o || t[o]) {
                            var r = this._resolved[o],
                                s = r.values();
                            for (var n in s) {
                                var l = s[n],
                                    y = i.transition ? this._cascaded[n] : void 0;
                                if (!y || y.declaration.json !== l.json) {
                                    var u = r.transition(n, e),
                                        h = this._cascaded[n] = new StyleTransition(l, y, u);
                                    h.instant() || (h.loopID = a.set(h.endTime - (new Date).getTime())), y && a.cancel(y.loopID)
                                }
                            }
                        }
                    if ("symbol" === this.type) {
                        var c = new StyleDeclarationSet("layout", this.type, this.layout);
                        this._cascaded["text-size"] = new StyleTransition(c.values()["text-size"], void 0, e), this._cascaded["icon-size"] = new StyleTransition(c.values()["icon-size"], void 0, e)
                    }
                },
                recalculate: function(t, i) {
                    var e = this.type,
                        a = this.paint = new PaintProperties[e];
                    for (var o in this._cascaded) a[o] = this._cascaded[o].at(t, i);
                    if (this.hidden = this.minzoom && t < this.minzoom || this.maxzoom && t >= this.maxzoom || "none" === this.layout.visibility, "symbol" === e ? 0 !== a["text-opacity"] && this.layout["text-field"] || 0 !== a["icon-opacity"] && this.layout["icon-image"] ? (premultiplyLayer(a, "text"), premultiplyLayer(a, "icon")) : this.hidden = !0 : 0 === a[e + "-opacity"] ? this.hidden = !0 : premultiplyLayer(a, e), this._cascaded["line-dasharray"]) {
                        var r = a["line-dasharray"],
                            s = this._cascaded["line-width"] ? this._cascaded["line-width"].at(Math.floor(t), 1 / 0) : a["line-width"];
                        r.fromScale *= s, r.toScale *= s
                    }
                    return !this.hidden
                },
                assign: function(t) {
                    util.extend(this, util.pick(t, ["type", "source", "source-layer", "minzoom", "maxzoom", "filter", "layout"]))
                },
                json: function() {
                    return util.extend({}, this._layer, util.pick(this, ["type", "source", "source-layer", "minzoom", "maxzoom", "filter", "layout", "paint"]))
                }
            };
        }, {
            "../util/util": 95,
            "./layout_properties": 43,
            "./paint_properties": 44,
            "./style_declaration_set": 49,
            "./style_transition": 51
        }],
        51: [function(require, module, exports) {
            "use strict";

            function StyleTransition(t, i, e) {
                this.declaration = t, this.startTime = this.endTime = (new Date).getTime();
                var n = t.type;
                "string" !== n && "array" !== n || !t.transitionable ? this.interp = interpolate[n] : this.interp = interpZoomTransitioned, this.oldTransition = i, this.duration = e.duration || 0, this.delay = e.delay || 0, this.instant() || (this.endTime = this.startTime + this.duration + this.delay, this.ease = util.easeCubicInOut), i && i.endTime <= this.startTime && delete i.oldTransition
            }

            function interpZoomTransitioned(t, i, e) {
                return {
                    from: t.to,
                    fromScale: t.toScale,
                    to: i.to,
                    toScale: i.toScale,
                    t: e
                }
            }
            var util = require("../util/util"),
                interpolate = require("../util/interpolate");
            module.exports = StyleTransition, StyleTransition.prototype.instant = function() {
                return !this.oldTransition || !this.interp || 0 === this.duration && 0 === this.delay
            }, StyleTransition.prototype.at = function(t, i, e) {
                var n = this.declaration.calculate(t, i, this.duration);
                if (this.instant()) return n;
                if (e = e || Date.now(), e < this.endTime) {
                    var r = this.oldTransition.at(t, i, this.startTime),
                        a = this.ease((e - this.startTime - this.delay) / this.duration);
                    n = this.interp(r, n, a)
                }
                return n
            };
        }, {
            "../util/interpolate": 91,
            "../util/util": 95
        }],
        52: [function(require, module, exports) {
            "use strict";

            function Anchor(t, e, o, n) {
                this.x = t, this.y = e, this.angle = o, void 0 !== n && (this.segment = n)
            }
            var Point = require("point-geometry");
            module.exports = Anchor, Anchor.prototype = Object.create(Point.prototype), Anchor.prototype.clone = function() {
                return new Anchor(this.x, this.y, this.angle, this.segment)
            };
        }, {
            "point-geometry": 131
        }],
        53: [function(require, module, exports) {
            "use strict";

            function BinPack(e, h) {
                this.width = e, this.height = h, this.free = [{
                    x: 0,
                    y: 0,
                    w: e,
                    h: h
                }]
            }
            module.exports = BinPack, BinPack.prototype.release = function(e) {
                for (var h = 0; h < this.free.length; h++) {
                    var i = this.free[h];
                    if (i.y === e.y && i.h === e.h && i.x + i.w === e.x) i.w += e.w;
                    else if (i.x === e.x && i.w === e.w && i.y + i.h === e.y) i.h += e.h;
                    else if (e.y === i.y && e.h === i.h && e.x + e.w === i.x) i.x = e.x, i.w += e.w;
                    else {
                        if (e.x !== i.x || e.w !== i.w || e.y + e.h !== i.y) continue;
                        i.y = e.y, i.h += e.h
                    }
                    return this.free.splice(h, 1), void this.release(i)
                }
                this.free.push(e)
            }, BinPack.prototype.allocate = function(e, h) {
                for (var i = {
                        x: 1 / 0,
                        y: 1 / 0,
                        w: 1 / 0,
                        h: 1 / 0
                    }, t = -1, s = 0; s < this.free.length; s++) {
                    var r = this.free[s];
                    e <= r.w && h <= r.h && r.y <= i.y && r.x <= i.x && (i = r, t = s)
                }
                return 0 > t ? {
                    x: -1,
                    y: -1
                } : (this.free.splice(t, 1), i.w < i.h ? (i.w > e && this.free.push({
                    x: i.x + e,
                    y: i.y,
                    w: i.w - e,
                    h: h
                }), i.h > h && this.free.push({
                    x: i.x,
                    y: i.y + h,
                    w: i.w,
                    h: i.h - h
                })) : (i.w > e && this.free.push({
                    x: i.x + e,
                    y: i.y,
                    w: i.w - e,
                    h: i.h
                }), i.h > h && this.free.push({
                    x: i.x,
                    y: i.y + h,
                    w: e,
                    h: i.h - h
                })), {
                    x: i.x,
                    y: i.y,
                    w: e,
                    h: h
                })
            };
        }, {}],
        54: [function(require, module, exports) {
            "use strict";

            function checkMaxAngle(e, t, a, r, n) {
                if (void 0 === t.segment) return !0;
                for (var i = t, s = t.segment + 1, f = 0; f > -a / 2;) {
                    if (s--, 0 > s) return !1;
                    f -= e[s].dist(i), i = e[s]
                }
                f += e[s].dist(e[s + 1]), s++;
                for (var l = [], o = 0; a / 2 > f;) {
                    var u = e[s - 1],
                        c = e[s],
                        g = e[s + 1];
                    if (!g) return !1;
                    var h = u.angleTo(c) - c.angleTo(g);
                    for (h = (h + 3 * Math.PI) % (2 * Math.PI) - Math.PI, l.push({
                            distance: f,
                            angleDelta: h
                        }), o += h; f - l[0].distance > r;) o -= l.shift().angleDelta;
                    if (Math.abs(o) > n) return !1;
                    s++, f += c.dist(g)
                }
                return !0
            }
            module.exports = checkMaxAngle;
        }, {}],
        55: [function(require, module, exports) {
            "use strict";

            function clipLine(x, y, n, e, t) {
                for (var i = [], o = 0; o < x.length; o++)
                    for (var r, P = x[o], u = 0; u < P.length - 1; u++) {
                        var w = P[u],
                            l = P[u + 1];
                        w.x < y && l.x < y || (w.x < y ? w = new Point(y, w.y + (l.y - w.y) * ((y - w.x) / (l.x - w.x))) : l.x < y && (l = new Point(y, w.y + (l.y - w.y) * ((y - w.x) / (l.x - w.x)))), w.y < n && l.y < n || (w.y < n ? w = new Point(w.x + (l.x - w.x) * ((n - w.y) / (l.y - w.y)), n) : l.y < n && (l = new Point(w.x + (l.x - w.x) * ((n - w.y) / (l.y - w.y)), n)), w.x >= e && l.x >= e || (w.x >= e ? w = new Point(e, w.y + (l.y - w.y) * ((e - w.x) / (l.x - w.x))) : l.x >= e && (l = new Point(e, w.y + (l.y - w.y) * ((e - w.x) / (l.x - w.x)))), w.y >= t && l.y >= t || (w.y >= t ? w = new Point(w.x + (l.x - w.x) * ((t - w.y) / (l.y - w.y)), t) : l.y >= t && (l = new Point(w.x + (l.x - w.x) * ((t - w.y) / (l.y - w.y)), t)), r && w.equals(r[r.length - 1]) || (r = [w], i.push(r)), r.push(l)))))
                    }
                return i
            }
            var Point = require("point-geometry");
            module.exports = clipLine;
        }, {
            "point-geometry": 131
        }],
        56: [function(require, module, exports) {
            "use strict";

            function CollisionBox(i, t, s, h, o, l) {
                this.anchorPoint = i, this.x1 = t, this.y1 = s, this.x2 = h, this.y2 = o, this.maxScale = l, this.placementScale = 0, this[0] = this[1] = this[2] = this[3] = 0
            }
            module.exports = CollisionBox;
        }, {}],
        57: [function(require, module, exports) {
            "use strict";

            function CollisionFeature(o, i, t, e, r, s) {
                var n = t.top * e - r,
                    l = t.bottom * e + r,
                    a = t.left * e - r,
                    u = t.right * e + r;
                if (this.boxes = [], s) {
                    var h = l - n,
                        x = u - a;
                    if (0 >= h) return;
                    h = Math.max(10 * e, h), this._addLineCollisionBoxes(o, i, x, h)
                } else this.boxes.push(new CollisionBox(new Point(i.x, i.y), a, n, u, l, 1 / 0))
            }
            var CollisionBox = require("./collision_box"),
                Point = require("point-geometry");
            module.exports = CollisionFeature, CollisionFeature.prototype._addLineCollisionBoxes = function(o, i, t, e) {
                var r = e / 2,
                    s = Math.floor(t / r),
                    n = -e / 2,
                    l = this.boxes,
                    a = i,
                    u = i.segment + 1,
                    h = n;
                do {
                    if (u--, 0 > u) return l;
                    h -= o[u].dist(a), a = o[u]
                } while (h > -t / 2);
                for (var x = o[u].dist(o[u + 1]), d = 0; s > d; d++) {
                    for (var f = -t / 2 + d * r; f > h + x;) {
                        if (h += x, u++, u + 1 >= o.length) return l;
                        x = o[u].dist(o[u + 1])
                    }
                    var C = f - h,
                        b = o[u],
                        m = o[u + 1],
                        p = m.sub(b)._unit()._mult(C)._add(b),
                        v = Math.max(Math.abs(f - n) - r / 2, 0),
                        _ = t / 2 / v;
                    l.push(new CollisionBox(p, -e / 2, -e / 2, e / 2, e / 2, _))
                }
                return l
            };
        }, {
            "./collision_box": 56,
            "point-geometry": 131
        }],
        58: [function(require, module, exports) {
            "use strict";

            function CollisionTile(t, a) {
                this.tree = rbush(), this.angle = t;
                var e = Math.sin(t),
                    i = Math.cos(t);
                this.rotationMatrix = [i, -e, e, i], this.yStretch = 1 / Math.cos(a / 180 * Math.PI), this.yStretch = Math.pow(this.yStretch, 1.3)
            }
            var rbush = require("rbush");
            module.exports = CollisionTile, CollisionTile.prototype.minScale = .25, CollisionTile.prototype.maxScale = 2, CollisionTile.prototype.placeCollisionFeature = function(t) {
                for (var a = this.minScale, e = this.rotationMatrix, i = this.yStretch, o = 0; o < t.boxes.length; o++) {
                    var l = t.boxes[o],
                        r = l.anchorPoint.matMult(e),
                        s = r.x,
                        h = r.y;
                    l[0] = s + l.x1, l[1] = h + l.y1 * i, l[2] = s + l.x2, l[3] = h + l.y2 * i;
                    for (var n = this.tree.search(l), c = 0; c < n.length; c++) {
                        var x = n[c],
                            m = x.anchorPoint.matMult(e),
                            y = (x.x1 - l.x2) / (s - m.x),
                            u = (x.x2 - l.x1) / (s - m.x),
                            S = (x.y1 - l.y2) * i / (h - m.y),
                            p = (x.y2 - l.y1) * i / (h - m.y);
                        (isNaN(y) || isNaN(u)) && (y = u = 1), (isNaN(S) || isNaN(p)) && (S = p = 1);
                        var M = Math.min(Math.max(y, u), Math.max(S, p));
                        if (M > x.maxScale && (M = x.maxScale), M > l.maxScale && (M = l.maxScale), M > a && M >= x.placementScale && (a = M), a >= this.maxScale) return a
                    }
                }
                return a
            }, CollisionTile.prototype.insertCollisionFeature = function(t, a) {
                for (var e = t.boxes, i = 0; i < e.length; i++) e[i].placementScale = a;
                a < this.maxScale && this.tree.load(e)
            };
        }, {
            "rbush": 132
        }],
        59: [function(require, module, exports) {
            "use strict";

            function getAnchors(e, r, t, a, n, o, l, h) {
                var i = a ? .6 * o * l : 0,
                    c = Math.max(a ? a.right - a.left : 0, n ? n.right - n.left : 0);
                if (0 === e[0].x || 4096 === e[0].x || 0 === e[0].y || 4096 === e[0].y) var u = !0;
                r / 4 > r - c * l && (r = c * l + r / 4);
                var s = 2 * o,
                    g = u ? r / 2 * h % r : (c / 2 + s) * l * h % r;
                return resample(e, g, r, i, t, c * l, u, !1)
            }

            function resample(e, r, t, a, n, o, l, h) {
                for (var i = 0, c = r - t, u = [], s = 0; s < e.length - 1; s++) {
                    for (var g = e[s], p = e[s + 1], x = g.dist(p), f = p.angleTo(g); i + x > c + t;) {
                        c += t;
                        var v = (c - i) / x,
                            m = interpolate(g.x, p.x, v),
                            A = interpolate(g.y, p.y, v);
                        if (m >= 0 && 4096 > m && A >= 0 && 4096 > A) {
                            m = Math.round(m), A = Math.round(A);
                            var y = new Anchor(m, A, f, s);
                            (!a || checkMaxAngle(e, y, o, a, n)) && u.push(y)
                        }
                    }
                    i += x
                }
                return h || u.length || l || (u = resample(e, i / 2, t, a, n, o, l, !0)), u
            }
            var interpolate = require("../util/interpolate"),
                Anchor = require("../symbol/anchor"),
                checkMaxAngle = require("./check_max_angle");
            module.exports = getAnchors;
        }, {
            "../symbol/anchor": 52,
            "../util/interpolate": 91,
            "./check_max_angle": 54
        }],
        60: [function(require, module, exports) {
            "use strict";

            function GlyphAtlas(t, i) {
                this.width = t, this.height = i, this.bin = new BinPack(t, i), this.index = {}, this.ids = {}, this.data = new Uint8Array(t * i)
            }
            var BinPack = require("./bin_pack");
            module.exports = GlyphAtlas, GlyphAtlas.prototype = {get debug() {
                    return "canvas" in this
                },
                set debug(t) {
                    t && !this.canvas ? (this.canvas = document.createElement("canvas"), this.canvas.width = this.width, this.canvas.height = this.height, document.body.appendChild(this.canvas), this.ctx = this.canvas.getContext("2d")) : !t && this.canvas && (this.canvas.parentNode.removeChild(this.canvas), delete this.ctx, delete this.canvas)
                }
            }, GlyphAtlas.prototype.getGlyphs = function() {
                var t, i, e, s = {};
                for (var h in this.ids) t = h.split("#"), i = t[0], e = t[1], s[i] || (s[i] = []), s[i].push(e);
                return s
            }, GlyphAtlas.prototype.getRects = function() {
                var t, i, e, s = {};
                for (var h in this.ids) t = h.split("#"), i = t[0], e = t[1], s[i] || (s[i] = {}), s[i][e] = this.index[h];
                return s
            }, GlyphAtlas.prototype.removeGlyphs = function(t) {
                for (var i in this.ids) {
                    var e = this.ids[i],
                        s = e.indexOf(t);
                    if (s >= 0 && e.splice(s, 1), this.ids[i] = e, !e.length) {
                        for (var h = this.index[i], a = this.data, r = 0; r < h.h; r++)
                            for (var n = this.width * (h.y + r) + h.x, d = 0; d < h.w; d++) a[n + d] = 0;
                        this.dirty = !0, this.bin.release(h), delete this.index[i], delete this.ids[i]
                    }
                }
                this.updateTexture(this.gl)
            }, GlyphAtlas.prototype.addGlyph = function(t, i, e, s) {
                if (!e) return null;
                var h = i + "#" + e.id;
                if (this.index[h]) return this.ids[h].indexOf(t) < 0 && this.ids[h].push(t), this.index[h];
                if (!e.bitmap) return null;
                var a = e.width + 2 * s,
                    r = e.height + 2 * s,
                    n = 1,
                    d = a + 2 * n,
                    l = r + 2 * n;
                d += 4 - d % 4, l += 4 - l % 4;
                var o = this.bin.allocate(d, l);
                if (o.x < 0) return console.warn("glyph bitmap overflow"), {
                    glyph: e,
                    rect: null
                };
                this.index[h] = o, this.ids[h] = [t];
                for (var c = this.data, p = e.bitmap, u = 0; r > u; u++)
                    for (var x = this.width * (o.y + u + n) + o.x + n, E = a * u, T = 0; a > T; T++) c[x + T] = p[E + T];
                return this.dirty = !0, o
            }, GlyphAtlas.prototype.bind = function(t) {
                this.gl = t, this.texture ? t.bindTexture(t.TEXTURE_2D, this.texture) : (this.texture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.texture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), t.texImage2D(t.TEXTURE_2D, 0, t.ALPHA, this.width, this.height, 0, t.ALPHA, t.UNSIGNED_BYTE, null))
            }, GlyphAtlas.prototype.updateTexture = function(t) {
                if (this.bind(t), this.dirty) {
                    if (t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, this.width, this.height, t.ALPHA, t.UNSIGNED_BYTE, this.data), this.ctx) {
                        for (var i = this.ctx.getImageData(0, 0, this.width, this.height), e = 0, s = 0; e < this.data.length; e++, s += 4) i.data[s] = this.data[e], i.data[s + 1] = this.data[e], i.data[s + 2] = this.data[e], i.data[s + 3] = 255;
                        this.ctx.putImageData(i, 0, 0), this.ctx.strokeStyle = "red";
                        for (var h = 0; h < this.bin.free.length; h++) {
                            var a = this.bin.free[h];
                            this.ctx.strokeRect(a.x, a.y, a.w, a.h)
                        }
                    }
                    this.dirty = !1
                }
            };
        }, {
            "./bin_pack": 53
        }],
        61: [function(require, module, exports) {
            "use strict";

            function GlyphSource(t, e) {
                this.url = t && normalizeURL(t), this.glyphAtlas = e, this.stacks = [], this.loading = {}
            }

            function SimpleGlyph(t, e, r) {
                var l = 1;
                this.advance = t.advance, this.left = t.left - r - l, this.top = t.top + r + l, this.rect = e
            }

            function glyphUrl(t, e, r, l) {
                return l = l || "abc", r.replace("{s}", l[t.length % l.length]).replace("{fontstack}", t).replace("{range}", e)
            }
            var normalizeURL = require("../util/mapbox").normalizeGlyphsURL,
                getArrayBuffer = require("../util/ajax").getArrayBuffer,
                Glyphs = require("../util/glyphs"),
                Protobuf = require("pbf");
            module.exports = GlyphSource, GlyphSource.prototype.getSimpleGlyphs = function(t, e, r, l) {
                void 0 === this.stacks[t] && (this.stacks[t] = {});
                for (var i, a = {}, s = this.stacks[t], h = this.glyphAtlas, o = 3, n = {}, p = 0, u = 0; u < e.length; u++) {
                    var f = e[u];
                    if (i = Math.floor(f / 256), s[i]) {
                        var y = s[i].glyphs[f],
                            c = h.addGlyph(r, t, y, o);
                        y && (a[f] = new SimpleGlyph(y, c, o))
                    } else void 0 === n[i] && (n[i] = [], p++), n[i].push(f)
                }
                p || l(void 0, a, t);
                var g = function(e, i, s) {
                    if (!e)
                        for (var u = this.stacks[t][i] = s.stacks[0], f = 0; f < n[i].length; f++) {
                            var y = n[i][f],
                                c = u.glyphs[y],
                                g = h.addGlyph(r, t, c, o);
                            c && (a[y] = new SimpleGlyph(c, g, o))
                        }
                    p--, p || l(void 0, a, t)
                }.bind(this);
                for (var d in n) this.loadRange(t, d, g)
            }, GlyphSource.prototype.loadRange = function(t, e, r) {
                if (256 * e > 65535) return r("glyphs > 65535 not supported");
                void 0 === this.loading[t] && (this.loading[t] = {});
                var l = this.loading[t];
                if (l[e]) l[e].push(r);
                else {
                    l[e] = [r];
                    var i = 256 * e + "-" + (256 * e + 255),
                        a = glyphUrl(t, i, this.url);
                    getArrayBuffer(a, function(t, r) {
                        for (var i = !t && new Glyphs(new Protobuf(new Uint8Array(r))), a = 0; a < l[e].length; a++) l[e][a](t, e, i);
                        delete l[e]
                    })
                }
            };
        }, {
            "../util/ajax": 83,
            "../util/glyphs": 90,
            "../util/mapbox": 92,
            "pbf": 129
        }],
        62: [function(require, module, exports) {
            "use strict";
            module.exports = function(e, t, n) {
                function r(r) {
                    c.push(e[r]), f.push(n[r]), v.push(t[r]), h++
                }

                function u(e, t, n) {
                    var r = l[e];
                    return delete l[e], l[t] = r, f[r][0].pop(), f[r][0] = f[r][0].concat(n[0]), r
                }

                function i(e, t, n) {
                    var r = a[t];
                    return delete a[t], a[e] = r, f[r][0].shift(), f[r][0] = n[0].concat(f[r][0]), r
                }

                function o(e, t, n) {
                    var r = n ? t[0][t[0].length - 1] : t[0][0];
                    return e + ":" + r.x + ":" + r.y
                }
                var s, a = {},
                    l = {},
                    c = [],
                    f = [],
                    v = [],
                    h = 0;
                for (s = 0; s < e.length; s++) {
                    var p = n[s],
                        d = t[s];
                    if (d) {
                        var g = o(d, p),
                            x = o(d, p, !0);
                        if (g in l && x in a && l[g] !== a[x]) {
                            var m = i(g, x, p),
                                y = u(g, x, f[m]);
                            delete a[g], delete l[x], l[o(d, f[y], !0)] = y, f[m] = null
                        } else g in l ? u(g, x, p) : x in a ? i(g, x, p) : (r(s), a[g] = h - 1, l[x] = h - 1)
                    } else r(s)
                }
                return {
                    features: c,
                    textFeatures: v,
                    geometries: f
                }
            };
        }, {}],
        63: [function(require, module, exports) {
            "use strict";

            function SymbolQuad(t, a, e, n, i, o, h, l, r) {
                this.anchorPoint = t, this.tl = a, this.tr = e, this.bl = n, this.br = i, this.tex = o, this.angle = h, this.minScale = l, this.maxScale = r
            }

            function getIconQuads(t, a, e, n, i, o) {
                var h = a.image.rect,
                    l = 1,
                    r = a.left - l,
                    s = r + h.w,
                    m = a.top - l,
                    u = m + h.h,
                    c = new Point(r, m),
                    g = new Point(s, m),
                    M = new Point(s, u),
                    P = new Point(r, u),
                    y = i["icon-rotate"] * Math.PI / 180;
                if (o) {
                    var f = n[t.segment];
                    if (t.y === f.y && t.x === f.x && t.segment + 1 < n.length) {
                        var x = n[t.segment + 1];
                        y += Math.atan2(t.y - x.y, t.x - x.x) + Math.PI
                    } else y += Math.atan2(t.y - f.y, t.x - f.x)
                }
                if (y) {
                    var v = Math.sin(y),
                        S = Math.cos(y),
                        p = [S, -v, v, S];
                    c = c.matMult(p), g = g.matMult(p), P = P.matMult(p), M = M.matMult(p)
                }
                return [new SymbolQuad(new Point(t.x, t.y), c, g, P, M, a.image.rect, 0, minScale, 1 / 0)]
            }

            function getGlyphQuads(t, a, e, n, i, o) {
                for (var h = i["text-rotate"] * Math.PI / 180, l = i["text-keep-upright"], r = a.positionedGlyphs, s = [], m = 0; m < r.length; m++) {
                    var u = r[m],
                        c = u.glyph,
                        g = c.rect;
                    if (g) {
                        var M, P = (u.x + c.advance / 2) * e,
                            y = minScale;
                        o ? (M = [], y = getSegmentGlyphs(M, t, P, n, t.segment, !0), l && (y = Math.min(y, getSegmentGlyphs(M, t, P, n, t.segment, !1)))) : M = [{
                            anchorPoint: new Point(t.x, t.y),
                            offset: 0,
                            angle: 0,
                            maxScale: 1 / 0,
                            minScale: minScale
                        }];
                        for (var f = u.x + c.left, x = u.y - c.top, v = f + g.w, S = x + g.h, p = new Point(f, x), w = new Point(v, x), d = new Point(f, S), I = new Point(v, S), b = 0; b < M.length; b++) {
                            var Q = M[b],
                                G = p,
                                k = w,
                                q = d,
                                _ = I,
                                j = Q.angle + h;
                            if (j) {
                                var z = Math.sin(j),
                                    A = Math.cos(j),
                                    B = [A, -z, z, A];
                                G = G.matMult(B), k = k.matMult(B), q = q.matMult(B), _ = _.matMult(B)
                            }
                            var C = Math.max(Q.minScale, y),
                                D = (t.angle + h + Q.offset + 2 * Math.PI) % (2 * Math.PI);
                            s.push(new SymbolQuad(Q.anchorPoint, G, k, q, _, g, D, C, Q.maxScale))
                        }
                    }
                }
                return s
            }

            function getSegmentGlyphs(t, a, e, n, i, o) {
                var h = !o;
                0 > e && (o = !o), o && i++;
                var l = new Point(a.x, a.y),
                    r = n[i],
                    s = 1 / 0;
                e = Math.abs(e);
                for (var m = minScale;;) {
                    var u = l.dist(r),
                        c = e / u,
                        g = Math.atan2(r.y - l.y, r.x - l.x);
                    if (o || (g += Math.PI), h && (g += Math.PI), t.push({
                            anchorPoint: l,
                            offset: h ? Math.PI : 0,
                            minScale: c,
                            maxScale: s,
                            angle: (g + 2 * Math.PI) % (2 * Math.PI)
                        }), m >= c) break;
                    for (l = r; l.equals(r);)
                        if (i += o ? 1 : -1, r = n[i], !r) return c;
                    var M = r.sub(l)._unit();
                    l = l.sub(M._mult(u)), s = c
                }
                return m
            }
            var Point = require("point-geometry");
            module.exports = {
                getIconQuads: getIconQuads,
                getGlyphQuads: getGlyphQuads
            };
            var minScale = .5;
        }, {
            "point-geometry": 131
        }],
        64: [function(require, module, exports) {
            "use strict";

            function resolveText(e, r, o) {
                for (var t = [], s = 0, l = e.length; l > s; s++) {
                    var a = resolveTokens(e[s].properties, r["text-field"]);
                    if (a) {
                        a = a.toString();
                        var n = r["text-transform"];
                        "uppercase" === n ? a = a.toLocaleUpperCase() : "lowercase" === n && (a = a.toLocaleLowerCase());
                        for (var v = 0; v < a.length; v++) o[a.charCodeAt(v)] = !0;
                        t[s] = a
                    } else t[s] = null
                }
                return t
            }
            var resolveTokens = require("../util/token");
            module.exports = resolveText;
        }, {
            "../util/token": 94
        }],
        65: [function(require, module, exports) {
            "use strict";

            function PositionedGlyph(t, i, n, e) {
                this.codePoint = t, this.x = i, this.y = n, this.glyph = e
            }

            function Shaping(t, i, n, e, o, h) {
                this.positionedGlyphs = t, this.text = i, this.top = n, this.bottom = e, this.left = o, this.right = h
            }

            function shapeText(t, i, n, e, o, h, a, s, r) {
                for (var l = [], f = new Shaping(l, t, r[1], r[1], r[0], r[0]), c = -17, p = r[0], u = r[1] + c, v = 0; v < t.length; v++) {
                    var d = t.charCodeAt(v),
                        g = i[d];
                    g && (l.push(new PositionedGlyph(d, p, u, g)), p += g.advance + s)
                }
                return l.length ? (linewrap(f, i, e, n, o, h, a), f) : !1
            }

            function linewrap(t, i, n, e, o, h, a) {
                var s = null,
                    r = 0,
                    l = 0,
                    f = 0,
                    c = 0,
                    p = t.positionedGlyphs;
                if (e)
                    for (var u = 0; u < p.length; u++) {
                        var v = p[u];
                        if (v.x -= r, v.y += n * f, v.x > e && null !== s) {
                            var d = p[s + 1].x;
                            c = Math.max(d, c);
                            for (var g = s + 1; u >= g; g++) p[g].y += n, p[g].x -= d;
                            if (a) {
                                var x = s;
                                invisible[p[s].codePoint] && x--, justifyLine(p, i, l, x, a)
                            }
                            l = s + 1, s = null, r += d, f++
                        }
                        breakable[v.codePoint] && (s = u)
                    }
                var y = p[p.length - 1],
                    b = y.x + i[y.codePoint].advance;
                c = Math.max(c, b);
                var P = (f + 1) * n;
                justifyLine(p, i, l, p.length - 1, a), align(p, a, o, h, c, n, f), t.top += -h * P, t.bottom = t.top + P, t.left += -o * c, t.right = t.left + c
            }

            function justifyLine(t, i, n, e, o) {
                for (var h = i[t[e].codePoint].advance, a = (t[e].x + h) * o, s = n; e >= s; s++) t[s].x -= a
            }

            function align(t, i, n, e, o, h, a) {
                for (var s = (i - n) * o, r = (-e * (a + 1) + .5) * h, l = 0; l < t.length; l++) t[l].x += s, t[l].y += r
            }

            function shapeIcon(t, i) {
                if (!t || !t.rect) return null;
                var n = i["icon-offset"][0],
                    e = i["icon-offset"][1],
                    o = n - t.width / 2,
                    h = o + t.width,
                    a = e - t.height / 2,
                    s = a + t.height;
                return new PositionedIcon(t, a, s, o, h)
            }

            function PositionedIcon(t, i, n, e, o) {
                this.image = t, this.top = i, this.bottom = n, this.left = e, this.right = o
            }
            module.exports = {
                shapeText: shapeText,
                shapeIcon: shapeIcon
            };
            var invisible = {
                    32: !0,
                    8203: !0
                },
                breakable = {
                    32: !0,
                    38: !0,
                    43: !0,
                    45: !0,
                    47: !0,
                    173: !0,
                    183: !0,
                    8203: !0,
                    8208: !0,
                    8211: !0
                };
        }, {}],
        66: [function(require, module, exports) {
            "use strict";

            function SpriteAtlas(t, i) {
                this.width = t, this.height = i, this.bin = new BinPack(t, i), this.images = {}, this.data = !1, this.texture = 0, this.filter = 0, this.pixelRatio = 1, this.dirty = !0
            }

            function copyBitmap(t, i, e, h, a, s, r, o, n, l, p) {
                var d, c, x = h * i + e,
                    f = o * s + r;
                if (p)
                    for (f -= s, c = -1; l >= c; c++, x = ((c + l) % l + h) * i + e, f += s)
                        for (d = -1; n >= d; d++) a[f + d] = t[x + (d + n) % n];
                else
                    for (c = 0; l > c; c++, x += i, f += s)
                        for (d = 0; n > d; d++) a[f + d] = t[x + d]
            }

            function AtlasImage(t, i, e, h) {
                this.rect = t, this.width = i, this.height = e, this.sdf = h
            }
            var BinPack = require("./bin_pack");
            module.exports = SpriteAtlas, SpriteAtlas.prototype = {get debug() {
                    return "canvas" in this
                },
                set debug(t) {
                    t && !this.canvas ? (this.canvas = document.createElement("canvas"), this.canvas.width = this.width * this.pixelRatio, this.canvas.height = this.height * this.pixelRatio, this.canvas.style.width = this.width + "px", this.canvas.style.width = this.width + "px", document.body.appendChild(this.canvas), this.ctx = this.canvas.getContext("2d")) : !t && this.canvas && (this.canvas.parentNode.removeChild(this.canvas), delete this.ctx, delete this.canvas)
                }
            }, SpriteAtlas.prototype.resize = function(t) {
                if (t = t > 1 ? 2 : 1, this.pixelRatio === t) return !1;
                var i = this.pixelRatio;
                if (this.pixelRatio = t, this.canvas && (this.canvas.width = this.width * this.pixelRatio, this.canvas.height = this.height * this.pixelRatio), this.data) {
                    var e = this.data;
                    this.data = !1, this.allocate(), this.texture = !1;
                    for (var h = this.width * i, a = this.height * i, s = this.width * t, r = this.height * t, o = this.data, n = e, l = 0; r > l; l++)
                        for (var p = Math.floor(l * a / r) * h, d = l * s, c = 0; s > c; c++) {
                            var x = Math.floor(c * h / s);
                            o[d + c] = n[p + x]
                        }
                    e = null, this.dirty = !0
                }
                return this.dirty
            }, SpriteAtlas.prototype.allocateImage = function(t, i) {
                var e = 2,
                    h = t + e + (4 - (t + e) % 4),
                    a = i + e + (4 - (i + e) % 4),
                    s = this.bin.allocate(h, a);
                return 0 === s.w ? s : (s.originalWidth = t, s.originalHeight = i, s)
            }, SpriteAtlas.prototype.getImage = function(t, i) {
                if (this.images[t]) return this.images[t];
                if (!this.sprite) return null;
                var e = this.sprite.getSpritePosition(t);
                if (!e.width || !e.height) return null;
                var h = e.width / e.pixelRatio,
                    a = e.height / e.pixelRatio,
                    s = this.allocateImage(h, a);
                if (0 === s.w) return s;
                var r = new AtlasImage(s, h, a, e.sdf);
                return this.images[t] = r, this.copy(s, e, i), r
            }, SpriteAtlas.prototype.getPosition = function(t, i) {
                var e = this.getImage(t, i),
                    h = e && e.rect;
                if (!h) return null;
                var a = i ? e.width : h.w,
                    s = i ? e.height : h.h,
                    r = 1;
                return {
                    size: [a, s],
                    tl: [(h.x + r) / this.width, (h.y + r) / this.height],
                    br: [(h.x + r + a) / this.width, (h.y + r + s) / this.height]
                }
            }, SpriteAtlas.prototype.allocate = function() {
                if (!this.data) {
                    var t = Math.floor(this.width * this.pixelRatio),
                        i = Math.floor(this.height * this.pixelRatio);
                    this.data = new Uint32Array(t * i);
                    for (var e = 0; e < this.data.length; e++) this.data[e] = 0
                }
            }, SpriteAtlas.prototype.copy = function(t, i, e) {
                if (this.sprite.img.data) {
                    var h = new Uint32Array(this.sprite.img.data.buffer);
                    this.allocate();
                    var a = this.data,
                        s = 1;
                    copyBitmap(h, this.sprite.img.width, i.x, i.y, a, this.width * this.pixelRatio, (t.x + s) * this.pixelRatio, (t.y + s) * this.pixelRatio, i.width, i.height, e), this.dirty = !0
                }
            }, SpriteAtlas.prototype.setSprite = function(t) {
                this.sprite = t
            }, SpriteAtlas.prototype.addIcons = function(t, i) {
                for (var e = 0; e < t.length; e++) this.getImage(t[e]);
                i(null, this.images)
            }, SpriteAtlas.prototype.bind = function(t, i) {
                var e = !1;
                this.texture ? t.bindTexture(t.TEXTURE_2D, this.texture) : (this.texture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.texture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), e = !0);
                var h = i ? t.LINEAR : t.NEAREST;
                if (h !== this.filter && (t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, h), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, h), this.filter = h), this.dirty && (this.allocate(), e ? t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, this.width * this.pixelRatio, this.height * this.pixelRatio, 0, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(this.data.buffer)) : t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(this.data.buffer)), this.dirty = !1, this.ctx)) {
                    var a = this.ctx.getImageData(0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio);
                    a.data.set(new Uint8ClampedArray(this.data.buffer)), this.ctx.putImageData(a, 0, 0), this.ctx.strokeStyle = "red";
                    for (var s = 0; s < this.bin.free.length; s++) {
                        var r = this.bin.free[s];
                        this.ctx.strokeRect(r.x * this.pixelRatio, r.y * this.pixelRatio, r.w * this.pixelRatio, r.h * this.pixelRatio)
                    }
                }
            };
        }, {
            "./bin_pack": 53
        }],
        67: [function(require, module, exports) {
            "use strict";
            var util = require("../util/util"),
                interpolate = require("../util/interpolate"),
                browser = require("../util/browser"),
                LngLat = require("../geo/lng_lat"),
                LngLatBounds = require("../geo/lng_lat_bounds"),
                Point = require("point-geometry"),
                Camera = module.exports = function() {};
            util.extend(Camera.prototype, {
                getCenter: function() {
                    return this.transform.center
                },
                setCenter: function(t) {
                    return this.jumpTo({
                        center: t
                    }), this
                },
                panBy: function(t, i) {
                    return this.panTo(this.transform.center, util.extend({
                        offset: Point.convert(t).mult(-1)
                    }, i)), this
                },
                panTo: function(t, i) {
                    this.stop(), t = LngLat.convert(t), i = util.extend({
                        duration: 500,
                        easing: util.ease,
                        offset: [0, 0]
                    }, i);
                    var e = this.transform,
                        n = Point.convert(i.offset).rotate(-e.angle),
                        o = e.point,
                        r = e.project(t).sub(n);
                    return i.noMoveStart || this.fire("movestart"), this._ease(function(t) {
                        e.center = e.unproject(o.add(r.sub(o).mult(t))), this.fire("move")
                    }, function() {
                        this.fire("moveend")
                    }, i), this
                },
                getZoom: function() {
                    return this.transform.zoom
                },
                setZoom: function(t) {
                    return this.jumpTo({
                        zoom: t
                    }), this
                },
                zoomTo: function(t, i) {
                    this.stop(), i = util.extend({
                        duration: 500
                    }, i), i.easing = this._updateEasing(i.duration, t, i.easing);
                    var e = this.transform,
                        n = e.center,
                        o = e.zoom;
                    return i.around ? n = LngLat.convert(i.around) : i.offset && (n = e.pointLocation(e.centerPoint.add(Point.convert(i.offset)))), i.animate === !1 && (i.duration = 0), this.zooming || (this.zooming = !0, this.fire("movestart")), this._ease(function(i) {
                        e.setZoomAround(interpolate(o, t, i), n), this.fire("move").fire("zoom")
                    }, function() {
                        this.ease = null, i.duration >= 200 && (this.zooming = !1, this.fire("moveend"))
                    }, i), i.duration < 200 && (clearTimeout(this._onZoomEnd), this._onZoomEnd = setTimeout(function() {
                        this.zooming = !1, this.fire("moveend")
                    }.bind(this), 200)), this
                },
                zoomIn: function(t) {
                    return this.zoomTo(this.getZoom() + 1, t), this
                },
                zoomOut: function(t) {
                    return this.zoomTo(this.getZoom() - 1, t), this
                },
                getBearing: function() {
                    return this.transform.bearing
                },
                setBearing: function(t) {
                    return this.jumpTo({
                        bearing: t
                    }), this
                },
                rotateTo: function(t, i) {
                    this.stop(), i = util.extend({
                        duration: 500,
                        easing: util.ease
                    }, i);
                    var e = this.transform,
                        n = this.getBearing(),
                        o = e.center;
                    return i.around ? o = LngLat.convert(i.around) : i.offset && (o = e.pointLocation(e.centerPoint.add(Point.convert(i.offset)))), t = this._normalizeBearing(t, n), this.rotating = !0, i.noMoveStart || this.fire("movestart"), this._ease(function(i) {
                        e.setBearingAround(interpolate(n, t, i), o), this.fire("move").fire("rotate")
                    }, function() {
                        this.rotating = !1, this.fire("moveend")
                    }, i), this
                },
                resetNorth: function(t) {
                    return this.rotateTo(0, util.extend({
                        duration: 1e3
                    }, t)), this
                },
                snapToNorth: function(t) {
                    return Math.abs(this.getBearing()) < this.options.bearingSnap ? this.resetNorth(t) : this
                },
                getPitch: function() {
                    return this.transform.pitch
                },
                setPitch: function(t) {
                    return this.jumpTo({
                        pitch: t
                    }), this
                },
                fitBounds: function(t, i) {
                    i = util.extend({
                        padding: 0,
                        offset: [0, 0],
                        maxZoom: 1 / 0
                    }, i), t = LngLatBounds.convert(t);
                    var e = Point.convert(i.offset),
                        n = this.transform,
                        o = n.project(t.getNorthWest()),
                        r = n.project(t.getSouthEast()),
                        s = r.sub(o),
                        a = (n.width - 2 * i.padding - 2 * Math.abs(e.x)) / s.x,
                        h = (n.height - 2 * i.padding - 2 * Math.abs(e.y)) / s.y;
                    return i.center = n.unproject(o.add(r).div(2)), i.zoom = Math.min(n.scaleZoom(n.scale * Math.min(a, h)), i.maxZoom), i.bearing = 0, i.linear ? this.easeTo(i) : this.flyTo(i)
                },
                jumpTo: function(t) {
                    this.stop();
                    var i = this.transform,
                        e = !1,
                        n = !1,
                        o = !1;
                    return "zoom" in t && i.zoom !== +t.zoom && (e = !0, i.zoom = +t.zoom), "center" in t && (i.center = LngLat.convert(t.center)), "bearing" in t && i.bearing !== +t.bearing && (n = !0, i.bearing = +t.bearing), "pitch" in t && i.pitch !== +t.pitch && (o = !0, i.pitch = +t.pitch), this.fire("movestart").fire("move"), e && this.fire("zoom"), n && this.fire("rotate"), o && this.fire("pitch"), this.fire("moveend")
                },
                easeTo: function(t) {
                    this.stop(), t = util.extend({
                        offset: [0, 0],
                        duration: 500,
                        easing: util.ease
                    }, t);
                    var i = this.transform,
                        e = Point.convert(t.offset).rotate(-i.angle),
                        n = i.point,
                        o = i.worldSize,
                        r = this.getZoom(),
                        s = this.getBearing(),
                        a = this.getPitch(),
                        h = "zoom" in t ? +t.zoom : r,
                        u = "bearing" in t ? this._normalizeBearing(t.bearing, s) : s,
                        c = "pitch" in t ? +t.pitch : a,
                        f = i.zoomScale(h - r),
                        g = "center" in t ? i.project(LngLat.convert(t.center)).sub(e.div(f)) : n,
                        m = "center" in t ? null : LngLat.convert(t.around);
                    return h !== r && (this.zooming = !0), s !== u && (this.rotating = !0), c !== a && (this.pitching = !0), this.zooming && !m && (m = i.pointLocation(i.centerPoint.add(g.sub(n).div(1 - 1 / f)))), this.fire("movestart"), this._ease(function(t) {
                        this.zooming && m ? i.setZoomAround(interpolate(r, h, t), m) : (this.zooming && (i.zoom = interpolate(r, h, t)), i.center = i.unproject(n.add(g.sub(n).mult(t)), o)), this.rotating && (i.bearing = interpolate(s, u, t)), this.pitching && (i.pitch = interpolate(a, c, t)), this.fire("move"), this.zooming && this.fire("zoom"), this.rotating && this.fire("rotate"), this.pitching && this.fire("pitch")
                    }, function() {
                        this.zooming = !1, this.rotating = !1, this.pitching = !1, this.fire("moveend")
                    }, t), this
                },
                flyTo: function(t) {
                    function i(t) {
                        var i = (M * M - _ * _ + (t ? -1 : 1) * x * x * L * L) / (2 * (t ? M : _) * x * L);
                        return Math.log(Math.sqrt(i * i + 1) - i)
                    }

                    function e(t) {
                        return (Math.exp(t) - Math.exp(-t)) / 2
                    }

                    function n(t) {
                        return (Math.exp(t) + Math.exp(-t)) / 2
                    }

                    function o(t) {
                        return e(t) / n(t)
                    }
                    this.stop(), t = util.extend({
                        offset: [0, 0],
                        speed: 1.2,
                        curve: 1.42,
                        easing: util.ease
                    }, t);
                    var r = this.transform,
                        s = Point.convert(t.offset),
                        a = this.getZoom(),
                        h = this.getBearing(),
                        u = this.getPitch(),
                        c = "center" in t ? LngLat.convert(t.center) : this.getCenter(),
                        f = "zoom" in t ? +t.zoom : a,
                        g = "bearing" in t ? this._normalizeBearing(t.bearing, h) : h,
                        m = "pitch" in t ? +t.pitch : u,
                        p = r.zoomScale(f - a),
                        d = r.point,
                        l = r.project(c).sub(s.div(p)),
                        v = r.worldSize,
                        z = t.curve,
                        b = t.speed,
                        _ = Math.max(r.width, r.height),
                        M = _ / p,
                        L = l.sub(d).mag(),
                        x = z * z,
                        T = i(0),
                        B = function(t) {
                            return n(T) / n(T + z * t)
                        },
                        P = function(t) {
                            return _ * ((n(T) * o(T + z * t) - e(T)) / x) / L
                        },
                        j = (i(1) - T) / z;
                    if (Math.abs(L) < 1e-6) {
                        if (Math.abs(_ - M) < 1e-6) return this;
                        var Z = _ > M ? -1 : 1;
                        j = Math.abs(Math.log(M / _)) / z, P = function() {
                            return 0
                        }, B = function(t) {
                            return Math.exp(Z * z * t)
                        }
                    }
                    return t.duration = 1e3 * j / b, this.zooming = !0, h !== g && (this.rotating = !0), u !== m && (this.pitching = !0), this.fire("movestart"), this._ease(function(t) {
                        var i = t * j,
                            e = P(i);
                        r.zoom = a + r.scaleZoom(1 / B(i)), r.center = r.unproject(d.add(l.sub(d).mult(e)), v), this.rotating && (r.bearing = interpolate(h, g, t)), this.pitching && (r.pitch = interpolate(u, m, t)), this.fire("move").fire("zoom"), this.rotating && this.fire("rotate"), this.pitching && this.fire("pitch")
                    }, function() {
                        this.zooming = !1, this.rotating = !1, this.pitching = !1, this.fire("moveend")
                    }, t), this
                },
                isEasing: function() {
                    return !!this._abortFn
                },
                stop: function() {
                    return this._abortFn && (this._abortFn(), this._finishEase()), this
                },
                _ease: function(t, i, e) {
                    this._finishFn = i, this._abortFn = browser.timed(function(i) {
                        t.call(this, e.easing(i)), 1 === i && this._finishEase()
                    }, e.animate === !1 ? 0 : e.duration, this)
                },
                _finishEase: function() {
                    delete this._abortFn;
                    var t = this._finishFn;
                    delete this._finishFn, t.call(this)
                },
                _normalizeBearing: function(t, i) {
                    t = util.wrap(t, -180, 180);
                    var e = Math.abs(t - i);
                    return Math.abs(t - 360 - i) < e && (t -= 360), Math.abs(t + 360 - i) < e && (t += 360), t
                },
                _updateEasing: function(t, i, e) {
                    var n;
                    if (this.ease) {
                        var o = this.ease,
                            r = (Date.now() - o.start) / o.duration,
                            s = o.easing(r + .01) - o.easing(r),
                            a = .27 / Math.sqrt(s * s + 1e-4) * .01,
                            h = Math.sqrt(.0729 - a * a);
                        n = util.bezier(a, h, .25, 1)
                    } else n = e ? util.bezier.apply(util, e) : util.ease;
                    return this.ease = {
                        start: (new Date).getTime(),
                        to: Math.pow(2, i),
                        duration: t,
                        easing: n
                    }, n
                }
            });
        }, {
            "../geo/lng_lat": 10,
            "../geo/lng_lat_bounds": 11,
            "../util/browser": 84,
            "../util/interpolate": 91,
            "../util/util": 95,
            "point-geometry": 131
        }],
        68: [function(require, module, exports) {
            "use strict";

            function Attribution(t) {
                util.setOptions(this, t)
            }
            var Control = require("./control"),
                DOM = require("../../util/dom"),
                util = require("../../util/util");
            module.exports = Attribution, Attribution.prototype = util.inherit(Control, {
                options: {
                    position: "bottom-right"
                },
                onAdd: function(t) {
                    var i = "mapboxgl-ctrl-attrib",
                        e = this._container = DOM.create("div", i, t.getContainer());
                    return this._update(), t.on("source.load", this._update.bind(this)), t.on("source.change", this._update.bind(this)), t.on("source.remove", this._update.bind(this)), t.on("moveend", this._updateEditLink.bind(this)), e
                },
                _update: function() {
                    var t = [];
                    if (this._map.style)
                        for (var i in this._map.style.sources) {
                            var e = this._map.style.sources[i];
                            e.attribution && t.indexOf(e.attribution) < 0 && t.push(e.attribution)
                        }
                    this._container.innerHTML = t.join(" | "), this._editLink = this._container.getElementsByClassName("mapbox-improve-map")[0], this._updateEditLink()
                },
                _updateEditLink: function() {
                    if (this._editLink) {
                        var t = this._map.getCenter();
                        this._editLink.href = "https://www.mapbox.com/map-feedback/#/" + t.lng + "/" + t.lat + "/" + Math.round(this._map.getZoom() + 1)
                    }
                }
            });
        }, {
            "../../util/dom": 87,
            "../../util/util": 95,
            "./control": 69
        }],
        69: [function(require, module, exports) {
            "use strict";

            function Control() {}
            module.exports = Control, Control.prototype = {
                addTo: function(o) {
                    this._map = o;
                    var t = this._container = this.onAdd(o);
                    if (this.options && this.options.position) {
                        var i = this.options.position,
                            n = o._controlCorners[i];
                        t.className += " mapboxgl-ctrl", -1 !== i.indexOf("bottom") ? n.insertBefore(t, n.firstChild) : n.appendChild(t)
                    }
                    return this
                },
                remove: function() {
                    return this._container.parentNode.removeChild(this._container), this.onRemove && this.onRemove(this._map), this._map = null, this
                }
            };
        }, {}],
        70: [function(require, module, exports) {
            "use strict";

            function Navigation(t) {
                util.setOptions(this, t)
            }

            function copyMouseEvent(t) {
                return new MouseEvent(t.type, {
                    button: 2,
                    buttons: 2,
                    bubbles: !0,
                    cancelable: !0,
                    detail: t.detail,
                    view: t.view,
                    screenX: t.screenX,
                    screenY: t.screenY,
                    clientX: t.clientX,
                    clientY: t.clientY,
                    movementX: t.movementX,
                    movementY: t.movementY,
                    ctrlKey: t.ctrlKey,
                    shiftKey: t.shiftKey,
                    altKey: t.altKey,
                    metaKey: t.metaKey
                })
            }
            var Control = require("./control"),
                DOM = require("../../util/dom"),
                util = require("../../util/util");
            module.exports = Navigation, Navigation.prototype = util.inherit(Control, {
                options: {
                    position: "top-right"
                },
                onAdd: function(t) {
                    var o = "mapboxgl-ctrl",
                        e = this._container = DOM.create("div", o + "-group", t.getContainer());
                    return this._container.addEventListener("contextmenu", this._onContextMenu.bind(this)), this._zoomInButton = this._createButton(o + "-icon " + o + "-zoom-in", t.zoomIn.bind(t)), this._zoomOutButton = this._createButton(o + "-icon " + o + "-zoom-out", t.zoomOut.bind(t)), this._compass = this._createButton(o + "-icon " + o + "-compass", t.resetNorth.bind(t)), this._compassArrow = DOM.create("div", "arrow", this._compass), this._compass.addEventListener("mousedown", this._onCompassDown.bind(this)), this._onCompassMove = this._onCompassMove.bind(this), this._onCompassUp = this._onCompassUp.bind(this), t.on("rotate", this._rotateCompassArrow.bind(this)), this._rotateCompassArrow(), this._el = t.getCanvasContainer(), e
                },
                _onContextMenu: function(t) {
                    t.preventDefault()
                },
                _onCompassDown: function(t) {
                    0 === t.button && (DOM.disableDrag(), document.addEventListener("mousemove", this._onCompassMove), document.addEventListener("mouseup", this._onCompassUp), this._el.dispatchEvent(copyMouseEvent(t)), t.stopPropagation())
                },
                _onCompassMove: function(t) {
                    0 === t.button && (this._el.dispatchEvent(copyMouseEvent(t)), t.stopPropagation())
                },
                _onCompassUp: function(t) {
                    0 === t.button && (document.removeEventListener("mousemove", this._onCompassMove), document.removeEventListener("mouseup", this._onCompassUp), DOM.enableDrag(), this._el.dispatchEvent(copyMouseEvent(t)), t.stopPropagation())
                },
                _createButton: function(t, o) {
                    var e = DOM.create("button", t, this._container);
                    return e.addEventListener("click", function() {
                        o()
                    }), e
                },
                _rotateCompassArrow: function() {
                    var t = "rotate(" + this._map.transform.angle * (180 / Math.PI) + "deg)";
                    this._compassArrow.style.transform = t
                }
            });
        }, {
            "../../util/dom": 87,
            "../../util/util": 95,
            "./control": 69
        }],
        71: [function(require, module, exports) {
            "use strict";

            function BoxZoom(o) {
                this._map = o, this._el = o.getCanvasContainer(), this._container = o.getContainer(), util.bindHandlers(this)
            }
            var DOM = require("../../util/dom"),
                LngLatBounds = require("../../geo/lng_lat_bounds"),
                util = require("../../util/util");
            module.exports = BoxZoom, BoxZoom.prototype = {
                enable: function() {
                    this._el.addEventListener("mousedown", this._onMouseDown, !1)
                },
                disable: function() {
                    this._el.removeEventListener("mousedown", this._onMouseDown)
                },
                _onMouseDown: function(o) {
                    o.shiftKey && 0 === o.button && (document.addEventListener("mousemove", this._onMouseMove, !1), document.addEventListener("keydown", this._onKeyDown, !1), document.addEventListener("mouseup", this._onMouseUp, !1), this._startPos = DOM.mousePos(this._el, o), this.active = !0)
                },
                _onMouseMove: function(o) {
                    var e = this._startPos,
                        t = DOM.mousePos(this._el, o);
                    this._box || (this._box = DOM.create("div", "mapboxgl-boxzoom", this._container), this._container.classList.add("mapboxgl-crosshair"), DOM.disableDrag(), this._fireEvent("boxzoomstart", o));
                    var n = Math.min(e.x, t.x),
                        i = Math.max(e.x, t.x),
                        s = Math.min(e.y, t.y),
                        r = Math.max(e.y, t.y);
                    DOM.setTransform(this._box, "translate(" + n + "px," + s + "px)"), this._box.style.width = i - n + "px", this._box.style.height = r - s + "px"
                },
                _onMouseUp: function(o) {
                    if (0 === o.button) {
                        var e = this._startPos,
                            t = DOM.mousePos(this._el, o),
                            n = new LngLatBounds(this._map.unproject(e), this._map.unproject(t));
                        this._finish(), e.x === t.x && e.y === t.y ? this._fireEvent("boxzoomcancel", o) : this._map.fitBounds(n, {
                            linear: !0
                        }).fire("boxzoomend", {
                            originalEvent: o,
                            boxZoomBounds: n
                        })
                    }
                },
                _onKeyDown: function(o) {
                    27 === o.keyCode && (this._finish(), this._fireEvent("boxzoomcancel", o))
                },
                _finish: function() {
                    this.active = !1, document.removeEventListener("mousemove", this._onMouseMove, !1), document.removeEventListener("keydown", this._onKeyDown, !1), document.removeEventListener("mouseup", this._onMouseUp, !1), this._container.classList.remove("mapboxgl-crosshair"), this._box && (this._box.parentNode.removeChild(this._box), this._box = null), DOM.enableDrag()
                },
                _fireEvent: function(o, e) {
                    return this._map.fire(o, {
                        originalEvent: e
                    })
                }
            };
        }, {
            "../../geo/lng_lat_bounds": 11,
            "../../util/dom": 87,
            "../../util/util": 95
        }],
        72: [function(require, module, exports) {
            "use strict";

            function DoubleClickZoom(o) {
                this._map = o, this._onDblClick = this._onDblClick.bind(this)
            }
            module.exports = DoubleClickZoom, DoubleClickZoom.prototype = {
                enable: function() {
                    this._map.on("dblclick", this._onDblClick)
                },
                disable: function() {
                    this._map.off("dblclick", this._onDblClick)
                },
                _onDblClick: function(o) {
                    this._map.zoomTo(this._map.getZoom() + (o.originalEvent.shiftKey ? -1 : 1), {
                        around: o.lngLat
                    })
                }
            };
        }, {}],
        73: [function(require, module, exports) {
            "use strict";

            function DragPan(t) {
                this._map = t, this._el = t.getCanvasContainer(), util.bindHandlers(this)
            }
            var DOM = require("../../util/dom"),
                util = require("../../util/util");
            module.exports = DragPan;
            var inertiaLinearity = .25,
                inertiaEasing = util.bezier(0, 0, inertiaLinearity, 1),
                inertiaMaxSpeed = 3e3,
                inertiaDeceleration = 4e3;
            DragPan.prototype = {
                enable: function() {
                    this._el.addEventListener("mousedown", this._onDown), this._el.addEventListener("touchstart", this._onDown)
                },
                disable: function() {
                    this._el.removeEventListener("mousedown", this._onDown), this._el.removeEventListener("touchstart", this._onDown)
                },
                _onDown: function(t) {
                    this._ignoreEvent(t) || this.active || (t.touches ? (document.addEventListener("touchmove", this._onMove), document.addEventListener("touchend", this._onTouchEnd)) : (document.addEventListener("mousemove", this._onMove), document.addEventListener("mouseup", this._onMouseUp)), this.active = !1, this._startPos = this._pos = DOM.mousePos(this._el, t), this._inertia = [
                        [Date.now(), this._pos]
                    ])
                },
                _onMove: function(t) {
                    if (!this._ignoreEvent(t)) {
                        this.active || (this.active = !0, this._fireEvent("dragstart", t), this._fireEvent("movestart", t));
                        var e = DOM.mousePos(this._el, t),
                            i = this._map;
                        i.stop(), this._drainInertiaBuffer(), this._inertia.push([Date.now(), e]), i.transform.setLocationAtPoint(i.transform.pointLocation(this._pos), e), this._fireEvent("drag", t), this._fireEvent("move", t), this._pos = e, t.preventDefault()
                    }
                },
                _onUp: function(t) {
                    if (this.active) {
                        this.active = !1, this._fireEvent("dragend", t), this._drainInertiaBuffer();
                        var e = function() {
                                this._fireEvent("moveend", t)
                            }.bind(this),
                            i = this._inertia;
                        if (i.length < 2) return void e();
                        var n = i[i.length - 1],
                            o = i[0],
                            r = n[1].sub(o[1]),
                            s = (n[0] - o[0]) / 1e3;
                        if (0 === s || n[1].equals(o[1])) return void e();
                        var a = r.mult(inertiaLinearity / s),
                            u = a.mag();
                        u > inertiaMaxSpeed && (u = inertiaMaxSpeed, a._unit()._mult(u));
                        var h = u / (inertiaDeceleration * inertiaLinearity),
                            v = a.mult(-h / 2);
                        this._map.panBy(v, {
                            duration: 1e3 * h,
                            easing: inertiaEasing,
                            noMoveStart: !0
                        })
                    }
                },
                _onMouseUp: function(t) {
                    this._ignoreEvent(t) || (this._onUp(t), document.removeEventListener("mousemove", this._onMove), document.removeEventListener("mouseup", this._onMouseUp))
                },
                _onTouchEnd: function(t) {
                    this._ignoreEvent(t) || (this._onUp(t), document.removeEventListener("touchmove", this._onMove), document.removeEventListener("touchend", this._onTouchEnd))
                },
                _fireEvent: function(t, e) {
                    return this._map.fire(t, {
                        originalEvent: e
                    })
                },
                _ignoreEvent: function(t) {
                    var e = this._map;
                    if (e.boxZoom && e.boxZoom.active) return !0;
                    if (e.dragRotate && e.dragRotate.active) return !0;
                    if (t.touches) return t.touches.length > 1;
                    if (t.ctrlKey) return !0;
                    var i = 1,
                        n = 0;
                    return "mousemove" === t.type ? t.buttons & 0 === i : t.button !== n
                },
                _drainInertiaBuffer: function() {
                    for (var t = this._inertia, e = Date.now(), i = 50; t.length > 0 && e - t[0][0] > i;) t.shift()
                }
            };
        }, {
            "../../util/dom": 87,
            "../../util/util": 95
        }],
        74: [function(require, module, exports) {
            "use strict";

            function DragRotate(t) {
                this._map = t, this._el = t.getCanvasContainer(), util.bindHandlers(this)
            }
            var DOM = require("../../util/dom"),
                Point = require("point-geometry"),
                util = require("../../util/util");
            module.exports = DragRotate;
            var inertiaLinearity = .25,
                inertiaEasing = util.bezier(0, 0, inertiaLinearity, 1),
                inertiaMaxSpeed = 180,
                inertiaDeceleration = 720;
            DragRotate.prototype = {
                enable: function() {
                    this._el.addEventListener("mousedown", this._onDown)
                },
                disable: function() {
                    this._el.removeEventListener("mousedown", this._onDown)
                },
                _onDown: function(t) {
                    if (!this._ignoreEvent(t) && !this.active) {
                        document.addEventListener("mousemove", this._onMove), document.addEventListener("mouseup", this._onUp), this.active = !1, this._inertia = [
                            [Date.now(), this._map.getBearing()]
                        ], this._startPos = this._pos = DOM.mousePos(this._el, t), this._center = this._map.transform.centerPoint;
                        var e = this._startPos.sub(this._center),
                            i = e.mag();
                        200 > i && (this._center = this._startPos.add(new Point(-200, 0)._rotate(e.angle()))), t.preventDefault()
                    }
                },
                _onMove: function(t) {
                    if (!this._ignoreEvent(t)) {
                        this.active || (this.active = !0, this._fireEvent("rotatestart", t), this._fireEvent("movestart", t));
                        var e = this._map;
                        e.stop();
                        var i = this._pos,
                            n = DOM.mousePos(this._el, t),
                            r = this._center,
                            a = i.sub(r).angleWith(n.sub(r)) / Math.PI * 180,
                            o = e.getBearing() - a,
                            s = this._inertia,
                            h = s[s.length - 1];
                        this._drainInertiaBuffer(), s.push([Date.now(), e._normalizeBearing(o, h[1])]), e.transform.bearing = o, this._fireEvent("rotate", t), this._fireEvent("move", t), this._pos = n
                    }
                },
                _onUp: function(t) {
                    if (!this._ignoreEvent(t) && (document.removeEventListener("mousemove", this._onMove), document.removeEventListener("mouseup", this._onUp), this.active)) {
                        this.active = !1, this._fireEvent("rotateend", t), this._drainInertiaBuffer();
                        var e = this._map,
                            i = e.getBearing(),
                            n = this._inertia,
                            r = function() {
                                Math.abs(i) < e.options.bearingSnap ? e.resetNorth({
                                    noMoveStart: !0
                                }) : this._fireEvent("moveend", t)
                            }.bind(this);
                        if (n.length < 2) return void r();
                        var a = n[0],
                            o = n[n.length - 1],
                            s = n[n.length - 2],
                            h = e._normalizeBearing(i, s[1]),
                            u = o[1] - a[1],
                            v = 0 > u ? -1 : 1,
                            _ = (o[0] - a[0]) / 1e3;
                        if (0 === u || 0 === _) return void r();
                        var m = Math.abs(u * (inertiaLinearity / _));
                        m > inertiaMaxSpeed && (m = inertiaMaxSpeed);
                        var f = m / (inertiaDeceleration * inertiaLinearity),
                            g = v * m * (f / 2);
                        h += g, Math.abs(e._normalizeBearing(h, 0)) < e.options.bearingSnap && (h = e._normalizeBearing(0, h)), e.rotateTo(h, {
                            duration: 1e3 * f,
                            easing: inertiaEasing,
                            noMoveStart: !0
                        })
                    }
                },
                _fireEvent: function(t, e) {
                    return this._map.fire(t, {
                        originalEvent: e
                    })
                },
                _ignoreEvent: function(t) {
                    var e = this._map;
                    if (e.boxZoom && e.boxZoom.active) return !0;
                    if (e.dragPan && e.dragPan.active) return !0;
                    if (t.touches) return t.touches.length > 1;
                    var i = t.ctrlKey ? 1 : 2,
                        n = t.ctrlKey ? 0 : 2;
                    return "mousemove" === t.type ? t.buttons & 0 === i : t.button !== n
                },
                _drainInertiaBuffer: function() {
                    for (var t = this._inertia, e = Date.now(), i = 50; t.length > 0 && e - t[0][0] > i;) t.shift()
                }
            };
        }, {
            "../../util/dom": 87,
            "../../util/util": 95,
            "point-geometry": 131
        }],
        75: [function(require, module, exports) {
            "use strict";

            function Keyboard(e) {
                this._map = e, this._el = e.getCanvasContainer(), this._onKeyDown = this._onKeyDown.bind(this)
            }
            module.exports = Keyboard;
            var panDelta = 80,
                rotateDelta = 2,
                pitchDelta = 5;
            Keyboard.prototype = {
                enable: function() {
                    this._el.addEventListener("keydown", this._onKeyDown, !1)
                },
                disable: function() {
                    this._el.removeEventListener("keydown", this._onKeyDown)
                },
                _onKeyDown: function(e) {
                    if (!(e.altKey || e.ctrlKey || e.metaKey)) {
                        var t = this._map;
                        switch (e.keyCode) {
                            case 61:
                            case 107:
                            case 171:
                            case 187:
                                t.zoomTo(Math.round(t.getZoom()) + (e.shiftKey ? 2 : 1));
                                break;
                            case 189:
                            case 109:
                            case 173:
                                t.zoomTo(Math.round(t.getZoom()) - (e.shiftKey ? 2 : 1));
                                break;
                            case 37:
                                e.shiftKey ? t.easeTo({
                                    bearing: t.getBearing() - rotateDelta
                                }) : t.panBy([-panDelta, 0]);
                                break;
                            case 39:
                                e.shiftKey ? t.easeTo({
                                    bearing: t.getBearing() + rotateDelta
                                }) : t.panBy([panDelta, 0]);
                                break;
                            case 38:
                                e.shiftKey ? t.easeTo({
                                    pitch: t.getPitch() + pitchDelta
                                }) : t.panBy([0, -panDelta]);
                                break;
                            case 40:
                                e.shiftKey ? t.easeTo({
                                    pitch: Math.max(t.getPitch() - pitchDelta, 0)
                                }) : t.panBy([0, panDelta])
                        }
                    }
                }
            };
        }, {}],
        76: [function(require, module, exports) {
            "use strict";

            function ScrollZoom(e) {
                this._map = e, this._el = e.getCanvasContainer(), util.bindHandlers(this)
            }
            var DOM = require("../../util/dom"),
                browser = require("../../util/browser"),
                util = require("../../util/util");
            module.exports = ScrollZoom;
            var ua = "undefined" != typeof navigator ? navigator.userAgent.toLowerCase() : "",
                firefox = -1 !== ua.indexOf("firefox"),
                safari = -1 !== ua.indexOf("safari") && -1 === ua.indexOf("chrom");
            ScrollZoom.prototype = {
                enable: function() {
                    this._el.addEventListener("wheel", this._onWheel, !1), this._el.addEventListener("mousewheel", this._onWheel, !1)
                },
                disable: function() {
                    this._el.removeEventListener("wheel", this._onWheel), this._el.removeEventListener("mousewheel", this._onWheel)
                },
                _onWheel: function(e) {
                    var t;
                    "wheel" === e.type ? (t = e.deltaY, firefox && e.deltaMode === window.WheelEvent.DOM_DELTA_PIXEL && (t /= browser.devicePixelRatio), e.deltaMode === window.WheelEvent.DOM_DELTA_LINE && (t *= 40)) : "mousewheel" === e.type && (t = -e.wheelDeltaY, safari && (t /= 3));
                    var i = (window.performance || Date).now(),
                        o = i - (this._time || 0);
                    this._pos = DOM.mousePos(this._el, e), this._time = i, 0 !== t && t % 4.000244140625 === 0 ? (this._type = "wheel", t = Math.floor(t / 4)) : 0 !== t && Math.abs(t) < 4 ? this._type = "trackpad" : o > 400 ? (this._type = null, this._lastValue = t, this._timeout = setTimeout(this._onTimeout, 40)) : this._type || (this._type = Math.abs(o * t) < 200 ? "trackpad" : "wheel", this._timeout && (clearTimeout(this._timeout), this._timeout = null, t += this._lastValue)), e.shiftKey && t && (t /= 4), this._type && this._zoom(-t), e.preventDefault()
                },
                _onTimeout: function() {
                    this._type = "wheel", this._zoom(-this._lastValue)
                },
                _zoom: function(e) {
                    var t = this._map,
                        i = 2 / (1 + Math.exp(-Math.abs(e / 100)));
                    0 > e && 0 !== i && (i = 1 / i);
                    var o = t.ease ? t.ease.to : t.transform.scale,
                        s = t.transform.scaleZoom(o * i);
                    t.zoomTo(s, {
                        duration: 0,
                        around: t.unproject(this._pos)
                    })
                }
            };
        }, {
            "../../util/browser": 84,
            "../../util/dom": 87,
            "../../util/util": 95
        }],
        77: [function(require, module, exports) {
            "use strict";

            function TouchZoomRotate(t) {
                this._map = t, this._el = t.getCanvasContainer(), util.bindHandlers(this)
            }
            var DOM = require("../../util/dom"),
                util = require("../../util/util");
            module.exports = TouchZoomRotate, TouchZoomRotate.prototype = {
                enable: function() {
                    this._el.addEventListener("touchstart", this._onStart, !1)
                },
                disable: function() {
                    this._el.removeEventListener("touchstart", this._onStart)
                },
                disableRotation: function() {
                    this._rotationDisabled = !0
                },
                enableRotation: function() {
                    this._rotationDisabled = !1
                },
                _onStart: function(t) {
                    if (2 === t.touches.length) {
                        var e = DOM.mousePos(this._el, t.touches[0]),
                            o = DOM.mousePos(this._el, t.touches[1]);
                        this._startVec = e.sub(o), this._startScale = this._map.transform.scale, this._startBearing = this._map.transform.bearing, document.addEventListener("touchmove", this._onMove, !1), document.addEventListener("touchend", this._onEnd, !1)
                    }
                },
                _onMove: function(t) {
                    if (2 === t.touches.length) {
                        var e = DOM.mousePos(this._el, t.touches[0]),
                            o = DOM.mousePos(this._el, t.touches[1]),
                            s = e.add(o).div(2),
                            n = e.sub(o),
                            i = n.mag() / this._startVec.mag(),
                            a = this._rotationDisabled ? 0 : 180 * n.angleWith(this._startVec) / Math.PI,
                            r = this._map;
                        r.easeTo({
                            zoom: r.transform.scaleZoom(this._startScale * i),
                            bearing: this._startBearing + a,
                            duration: 0,
                            around: r.unproject(s)
                        }), t.preventDefault()
                    }
                },
                _onEnd: function() {
                    this._map.snapToNorth(), document.removeEventListener("touchmove", this._onMove), document.removeEventListener("touchend", this._onEnd)
                }
            };
        }, {
            "../../util/dom": 87,
            "../../util/util": 95
        }],
        78: [function(require, module, exports) {
            "use strict";

            function Hash() {
                util.bindAll(["_onHashChange", "_updateHash"], this)
            }
            module.exports = Hash;
            var util = require("../util/util");
            Hash.prototype = {
                addTo: function(t) {
                    return this._map = t, window.addEventListener("hashchange", this._onHashChange, !1), this._map.on("moveend", this._updateHash), this
                },
                remove: function() {
                    return window.removeEventListener("hashchange", this._onHashChange, !1), this._map.off("moveend", this._updateHash), delete this._map, this
                },
                _onHashChange: function() {
                    var t = location.hash.replace("#", "").split("/");
                    return t.length >= 3 ? (this._map.jumpTo({
                        center: [+t[2], +t[1]],
                        zoom: +t[0],
                        bearing: +(t[3] || 0)
                    }), !0) : !1
                },
                _updateHash: function() {
                    var t = this._map.getCenter(),
                        e = this._map.getZoom(),
                        a = this._map.getBearing(),
                        h = Math.max(0, Math.ceil(Math.log(e) / Math.LN2)),
                        n = "#" + Math.round(100 * e) / 100 + "/" + t.lat.toFixed(h) + "/" + t.lng.toFixed(h) + (a ? "/" + Math.round(10 * a) / 10 : "");
                    window.history.replaceState("", "", n)
                }
            };
        }, {
            "../util/util": 95
        }],
        79: [function(require, module, exports) {
            "use strict";

            function Interaction(e) {
                this._map = e, this._el = e.getCanvasContainer();
                for (var t in handlers) e[t] = new handlers[t](e);
                util.bindHandlers(this)
            }
            var handlers = {
                    scrollZoom: require("./handler/scroll_zoom"),
                    boxZoom: require("./handler/box_zoom"),
                    dragRotate: require("./handler/drag_rotate"),
                    dragPan: require("./handler/drag_pan"),
                    keyboard: require("./handler/keyboard"),
                    doubleClickZoom: require("./handler/dblclick_zoom"),
                    touchZoomRotate: require("./handler/touch_zoom_rotate")
                },
                DOM = require("../util/dom"),
                util = require("../util/util");
            module.exports = Interaction, Interaction.prototype = {
                enable: function() {
                    var e = this._map.options,
                        t = this._el;
                    for (var n in handlers) e[n] && this._map[n].enable();
                    t.addEventListener("mousedown", this._onMouseDown, !1), t.addEventListener("mouseup", this._onMouseUp, !1), t.addEventListener("touchstart", this._onTouchStart, !1), t.addEventListener("click", this._onClick, !1), t.addEventListener("mousemove", this._onMouseMove, !1), t.addEventListener("dblclick", this._onDblClick, !1), t.addEventListener("contextmenu", this._onContextMenu, !1)
                },
                disable: function() {
                    var e = this._map.options,
                        t = this._el;
                    for (var n in handlers) e[n] && this._map[n].disable();
                    t.removeEventListener("mousedown", this._onMouseDown), t.removeEventListener("mouseup", this._onMouseUp), t.removeEventListener("touchstart", this._onTouchStart), t.removeEventListener("click", this._onClick), t.removeEventListener("mousemove", this._onMouseMove), t.removeEventListener("dblclick", this._onDblClick), t.removeEventListener("contextmenu", this._onContextMenu)
                },
                _onMouseDown: function(e) {
                    this._map.stop(), this._startPos = DOM.mousePos(this._el, e), this._fireEvent("mousedown", e)
                },
                _onMouseUp: function(e) {
                    var t = this._map,
                        n = t.dragRotate && t.dragRotate.active;
                    this._contextMenuEvent && !n && this._fireEvent("contextmenu", this._contextMenuEvent), this._contextMenuEvent = null, this._fireEvent("mouseup", e)
                },
                _onTouchStart: function(e) {
                    !e.touches || e.touches.length > 1 || (this._tapped ? (clearTimeout(this._tapped), this._tapped = null, this._fireEvent("dblclick", e)) : this._tapped = setTimeout(this._onTimeout, 300))
                },
                _onTimeout: function() {
                    this._tapped = null
                },
                _onMouseMove: function(e) {
                    var t = this._map,
                        n = this._el;
                    if (!(t.dragPan && t.dragPan.active || t.dragRotate && t.dragRotate.active)) {
                        for (var o = e.toElement || e.target; o && o !== n;) o = o.parentNode;
                        o === n && this._fireEvent("mousemove", e)
                    }
                },
                _onClick: function(e) {
                    var t = DOM.mousePos(this._el, e);
                    t.equals(this._startPos) && this._fireEvent("click", e)
                },
                _onDblClick: function(e) {
                    this._fireEvent("dblclick", e), e.preventDefault()
                },
                _onContextMenu: function(e) {
                    this._contextMenuEvent = e, e.preventDefault()
                },
                _fireEvent: function(e, t) {
                    var n = DOM.mousePos(this._el, t);
                    return this._map.fire(e, {
                        lngLat: this._map.unproject(n),
                        point: n,
                        originalEvent: t
                    })
                }
            };
        }, {
            "../util/dom": 87,
            "../util/util": 95,
            "./handler/box_zoom": 71,
            "./handler/dblclick_zoom": 72,
            "./handler/drag_pan": 73,
            "./handler/drag_rotate": 74,
            "./handler/keyboard": 75,
            "./handler/scroll_zoom": 76,
            "./handler/touch_zoom_rotate": 77
        }],
        80: [function(require, module, exports) {
            "use strict";
            var Canvas = require("../util/canvas"),
                util = require("../util/util"),
                browser = require("../util/browser"),
                Evented = require("../util/evented"),
                DOM = require("../util/dom"),
                Style = require("../style/style"),
                AnimationLoop = require("../style/animation_loop"),
                Painter = require("../render/painter"),
                Transform = require("../geo/transform"),
                Hash = require("./hash"),
                Interaction = require("./interaction"),
                Camera = require("./camera"),
                LngLat = require("../geo/lng_lat"),
                LngLatBounds = require("../geo/lng_lat_bounds"),
                Point = require("point-geometry"),
                Attribution = require("./control/attribution"),
                Map = module.exports = function(t) {
                    if (t = this.options = util.inherit(this.options, t), this.animationLoop = new AnimationLoop, this.transform = new Transform(t.minZoom, t.maxZoom), t.maxBounds) {
                        var e = LngLatBounds.convert(t.maxBounds);
                        this.transform.lngRange = [e.getWest(), e.getEast()], this.transform.latRange = [e.getSouth(), e.getNorth()]
                    }
                    util.bindAll(["_forwardStyleEvent", "_forwardSourceEvent", "_forwardLayerEvent", "_forwardTileEvent", "_onStyleLoad", "_onStyleChange", "_onSourceAdd", "_onSourceRemove", "_onSourceUpdate", "_onWindowResize", "onError", "_update", "_render"], this), this._setupContainer(), this._setupPainter(), this.on("move", this._update.bind(this, !1)), this.on("zoom", this._update.bind(this, !0)), this.on("moveend", function() {
                        this.animationLoop.set(300), this._rerender()
                    }.bind(this)), "undefined" != typeof window && window.addEventListener("resize", this._onWindowResize, !1), this.interaction = new Interaction(this), t.interactive && this.interaction.enable(), this._hash = t.hash && (new Hash).addTo(this), this._hash && this._hash._onHashChange() || this.jumpTo(t), this.sources = {}, this.stacks = {}, this._classes = {}, this.resize(), t.classes && this.setClasses(t.classes), t.style && this.setStyle(t.style), t.attributionControl && this.addControl(new Attribution), this.on("style.error", this.onError), this.on("source.error", this.onError), this.on("tile.error", this.onError)
                };
            util.extend(Map.prototype, Evented), util.extend(Map.prototype, Camera.prototype), util.extend(Map.prototype, {
                options: {
                    center: [0, 0],
                    zoom: 0,
                    bearing: 0,
                    pitch: 0,
                    minZoom: 0,
                    maxZoom: 20,
                    interactive: !0,
                    scrollZoom: !0,
                    boxZoom: !0,
                    dragRotate: !0,
                    dragPan: !0,
                    keyboard: !0,
                    doubleClickZoom: !0,
                    touchZoomRotate: !0,
                    bearingSnap: 7,
                    hash: !1,
                    attributionControl: !0,
                    failIfMajorPerformanceCaveat: !1,
                    preserveDrawingBuffer: !1
                },
                addControl: function(t) {
                    return t.addTo(this), this
                },
                addClass: function(t, e) {
                    this._classes[t] || (this._classes[t] = !0, this.style && this.style._cascade(this._classes, e))
                },
                removeClass: function(t, e) {
                    this._classes[t] && (delete this._classes[t], this.style && this.style._cascade(this._classes, e))
                },
                setClasses: function(t, e) {
                    this._classes = {};
                    for (var i = 0; i < t.length; i++) this._classes[t[i]] = !0;
                    this.style && this.style._cascade(this._classes, e)
                },
                hasClass: function(t) {
                    return !!this._classes[t]
                },
                getClasses: function() {
                    return Object.keys(this._classes)
                },
                resize: function() {
                    var t = 0,
                        e = 0;
                    return this._container && (t = this._container.offsetWidth || 400, e = this._container.offsetHeight || 300), this._canvas.resize(t, e), this.transform.resize(t, e), this.painter.resize(t, e), this.fire("movestart").fire("move").fire("resize").fire("moveend")
                },
                getBounds: function() {
                    return new LngLatBounds(this.transform.pointLocation(new Point(0, 0)), this.transform.pointLocation(this.transform.size))
                },
                project: function(t) {
                    return this.transform.locationPoint(LngLat.convert(t))
                },
                unproject: function(t) {
                    return this.transform.pointLocation(Point.convert(t))
                },
                featuresAt: function(t, e, i) {
                    var s = this.unproject(t).wrap(),
                        r = this.transform.locationCoordinate(s);
                    return this.style.featuresAt(r, e, i), this
                },
                featuresIn: function(t, e, i) {
                    return "undefined" == typeof i && (i = e, e = t, t = [Point.convert([0, 0]), Point.convert([this.transform.width, this.transform.height])]), t = t.map(Point.convert.bind(Point)), t = [new Point(Math.min(t[0].x, t[1].x), Math.min(t[0].y, t[1].y)), new Point(Math.max(t[0].x, t[1].x), Math.max(t[0].y, t[1].y))].map(this.transform.pointCoordinate.bind(this.transform)), this.style.featuresIn(t, e, i), this
                },
                batch: function(t) {
                    this.style.batch(t), this.style._cascade(this._classes), this._update(!0)
                },
                setStyle: function(t) {
                    return this.style && (this.style.off("load", this._onStyleLoad).off("error", this._forwardStyleEvent).off("change", this._onStyleChange).off("source.add", this._onSourceAdd).off("source.remove", this._onSourceRemove).off("source.load", this._onSourceUpdate).off("source.error", this._forwardSourceEvent).off("source.change", this._onSourceUpdate).off("layer.add", this._forwardLayerEvent).off("layer.remove", this._forwardLayerEvent).off("tile.add", this._forwardTileEvent).off("tile.remove", this._forwardTileEvent).off("tile.load", this._update).off("tile.error", this._forwardTileEvent).off("tile.stats", this._forwardTileEvent)._remove(), this.off("rotate", this.style._redoPlacement), this.off("pitch", this.style._redoPlacement)), t ? (t instanceof Style ? this.style = t : this.style = new Style(t, this.animationLoop), this.style.on("load", this._onStyleLoad).on("error", this._forwardStyleEvent).on("change", this._onStyleChange).on("source.add", this._onSourceAdd).on("source.remove", this._onSourceRemove).on("source.load", this._onSourceUpdate).on("source.error", this._forwardSourceEvent).on("source.change", this._onSourceUpdate).on("layer.add", this._forwardLayerEvent).on("layer.remove", this._forwardLayerEvent).on("tile.add", this._forwardTileEvent).on("tile.remove", this._forwardTileEvent).on("tile.load", this._update).on("tile.error", this._forwardTileEvent).on("tile.stats", this._forwardTileEvent), this.on("rotate", this.style._redoPlacement), this.on("pitch", this.style._redoPlacement), this) : (this.style = null, this)
                },
                addSource: function(t, e) {
                    return this.style.addSource(t, e), this
                },
                removeSource: function(t) {
                    return this.style.removeSource(t), this
                },
                getSource: function(t) {
                    return this.style.getSource(t)
                },
                addLayer: function(t, e) {
                    return this.style.addLayer(t, e), this.style._cascade(this._classes), this
                },
                removeLayer: function(t) {
                    return this.style.removeLayer(t), this.style._cascade(this._classes), this
                },
                getLayer: function(t) {
                    return this.style.getLayer(t)
                },
                setFilter: function(t, e) {
                    return this.style.setFilter(t, e), this
                },
                setLayerZoomRange: function(t, e, i) {
                    return this.style.setLayerZoomRange(t, e, i), this
                },
                getFilter: function(t) {
                    return this.style.getFilter(t)
                },
                setPaintProperty: function(t, e, i, s) {
                    return this.batch(function(r) {
                        r.setPaintProperty(t, e, i, s)
                    }), this
                },
                getPaintProperty: function(t, e, i) {
                    return this.style.getPaintProperty(t, e, i)
                },
                setLayoutProperty: function(t, e, i) {
                    return this.batch(function(s) {
                        s.setLayoutProperty(t, e, i)
                    }), this
                },
                getLayoutProperty: function(t, e) {
                    return this.style.getLayoutProperty(t, e)
                },
                getContainer: function() {
                    return this._container
                },
                getCanvasContainer: function() {
                    return this._canvasContainer
                },
                getCanvas: function() {
                    return this._canvas.getElement()
                },
                _setupContainer: function() {
                    var t = this.options.container,
                        e = this._container = "string" == typeof t ? document.getElementById(t) : t;
                    e.classList.add("mapboxgl-map");
                    var i = this._canvasContainer = DOM.create("div", "mapboxgl-canvas-container", e);
                    this.options.interactive && i.classList.add("mapboxgl-interactive"), this._canvas = new Canvas(this, i);
                    var s = this._controlContainer = DOM.create("div", "mapboxgl-control-container", e),
                        r = this._controlCorners = {};
                    ["top-left", "top-right", "bottom-left", "bottom-right"].forEach(function(t) {
                        r[t] = DOM.create("div", "mapboxgl-ctrl-" + t, s)
                    })
                },
                _setupPainter: function() {
                    var t = this._canvas.getWebGLContext({
                        failIfMajorPerformanceCaveat: this.options.failIfMajorPerformanceCaveat,
                        preserveDrawingBuffer: this.options.preserveDrawingBuffer
                    });
                    return t ? void(this.painter = new Painter(t, this.transform)) : void console.error("Failed to initialize WebGL")
                },
                _contextLost: function(t) {
                    t.preventDefault(), this._frameId && browser.cancelFrame(this._frameId), this.fire("webglcontextlost", {
                        originalEvent: t
                    })
                },
                _contextRestored: function(t) {
                    this._setupPainter(), this.resize(), this._update(), this.fire("webglcontextrestored", {
                        originalEvent: t
                    })
                },
                loaded: function() {
                    return this._styleDirty || this._sourcesDirty ? !1 : this.style && !this.style.loaded() ? !1 : !0
                },
                _update: function(t) {
                    return this.style ? (this._styleDirty = this._styleDirty || t, this._sourcesDirty = !0, this._rerender(), this) : this
                },
                _render: function() {
                    return this.style && this._styleDirty && (this._styleDirty = !1, this.style._recalculate(this.transform.zoom)), this.style && this._sourcesDirty && !this._sourcesDirtyTimeout && (this._sourcesDirty = !1, this._sourcesDirtyTimeout = setTimeout(function() {
                        this._sourcesDirtyTimeout = null
                    }.bind(this), 50), this.style._updateSources(this.transform)), this.painter.render(this.style, {
                        debug: this.debug,
                        vertices: this.vertices,
                        rotating: this.rotating,
                        zooming: this.zooming
                    }), this.fire("render"), this.loaded() && !this._loaded && (this._loaded = !0, this.fire("load")), this._frameId = null, this.animationLoop.stopped() || (this._styleDirty = !0), (this._sourcesDirty || this._repaint || !this.animationLoop.stopped()) && this._rerender(), this
                },
                remove: function() {
                    this._hash && this._hash.remove(), browser.cancelFrame(this._frameId), clearTimeout(this._sourcesDirtyTimeout), this.setStyle(null), "undefined" != typeof window && window.removeEventListener("resize", this._onWindowResize, !1), this._canvasContainer.remove(), this._controlContainer.remove(), this._container.classList.remove("mapboxgl-map")
                },
                onError: function(t) {
                    console.error(t.error)
                },
                _rerender: function() {
                    this.style && !this._frameId && (this._frameId = browser.frame(this._render))
                },
                _forwardStyleEvent: function(t) {
                    this.fire("style." + t.type, util.extend({
                        style: t.target
                    }, t))
                },
                _forwardSourceEvent: function(t) {
                    this.fire(t.type, util.extend({
                        style: t.target
                    }, t))
                },
                _forwardLayerEvent: function(t) {
                    this.fire(t.type, util.extend({
                        style: t.target
                    }, t))
                },
                _forwardTileEvent: function(t) {
                    this.fire(t.type, util.extend({
                        style: t.target
                    }, t))
                },
                _onStyleLoad: function(t) {
                    this.transform.unmodified && this.jumpTo(this.style.stylesheet), this.style._cascade(this._classes, {
                        transition: !1
                    }), this._forwardStyleEvent(t)
                },
                _onStyleChange: function(t) {
                    this._update(!0), this._forwardStyleEvent(t)
                },
                _onSourceAdd: function(t) {
                    var e = t.source;
                    e.onAdd && e.onAdd(this), this._forwardSourceEvent(t)
                },
                _onSourceRemove: function(t) {
                    var e = t.source;
                    e.onRemove && e.onRemove(this), this._forwardSourceEvent(t)
                },
                _onSourceUpdate: function(t) {
                    this._update(), this._forwardSourceEvent(t)
                },
                _onWindowResize: function() {
                    this.stop().resize()._update()
                }
            }), util.extendAll(Map.prototype, {
                _debug: !1,
                get debug() {
                    return this._debug
                },
                set debug(t) {
                    this._debug = t, this._update()
                },
                _collisionDebug: !1,
                get collisionDebug() {
                    return this._collisionDebug
                },
                set collisionDebug(t) {
                    this._collisionDebug = t, this.style._redoPlacement()
                },
                _repaint: !1,
                get repaint() {
                    return this._repaint
                },
                set repaint(t) {
                    this._repaint = t, this._update()
                },
                _vertices: !1,
                get vertices() {
                    return this._vertices
                },
                set vertices(t) {
                    this._vertices = t, this._update()
                }
            });
        }, {
            "../geo/lng_lat": 10,
            "../geo/lng_lat_bounds": 11,
            "../geo/transform": 12,
            "../render/painter": 27,
            "../style/animation_loop": 41,
            "../style/style": 46,
            "../util/browser": 84,
            "../util/canvas": 85,
            "../util/dom": 87,
            "../util/evented": 89,
            "../util/util": 95,
            "./camera": 67,
            "./control/attribution": 68,
            "./hash": 78,
            "./interaction": 79,
            "point-geometry": 131
        }],
        81: [function(require, module, exports) {
            "use strict";

            function Popup(t) {
                util.setOptions(this, t), util.bindAll(["_updatePosition", "_onClickClose"], this)
            }
            module.exports = Popup;
            var util = require("../util/util"),
                Evented = require("../util/evented"),
                DOM = require("../util/dom"),
                LngLat = require("../geo/lng_lat");
            Popup.prototype = util.inherit(Evented, {
                options: {
                    closeButton: !0,
                    closeOnClick: !0
                },
                addTo: function(t) {
                    return this._map = t, this._map.on("move", this._updatePosition), this.options.closeOnClick && this._map.on("click", this._onClickClose), this._update(), this
                },
                remove: function() {
                    return this._container && (this._container.parentNode.removeChild(this._container), delete this._container), this._map && (this._map.off("move", this._updatePosition), this._map.off("click", this._onClickClose), delete this._map), this
                },
                getLngLat: function() {
                    return this._lngLat
                },
                setLngLat: function(t) {
                    return this._lngLat = LngLat.convert(t), this._update(), this
                },
                setText: function(t) {
                    return this._content = document.createTextNode(t), this._updateContent(), this
                },
                setHTML: function(t) {
                    this._content = document.createDocumentFragment();
                    var i, e = document.createElement("body");
                    for (e.innerHTML = t;;) {
                        if (i = e.firstChild, !i) break;
                        this._content.appendChild(i)
                    }
                    return this._updateContent(), this
                },
                _update: function() {
                    this._map && (this._container || (this._container = DOM.create("div", "mapboxgl-popup", this._map.getContainer()), this._tip = DOM.create("div", "mapboxgl-popup-tip", this._container), this._wrapper = DOM.create("div", "mapboxgl-popup-content", this._container), this.options.closeButton && (this._closeButton = DOM.create("button", "mapboxgl-popup-close-button", this._wrapper), this._closeButton.innerHTML = "&#215;", this._closeButton.addEventListener("click", this._onClickClose))), this._updateContent(), this._updatePosition())
                },
                _updateContent: function() {
                    if (this._content && this._container) {
                        for (var t = this._wrapper; t.hasChildNodes();) t.removeChild(t.firstChild);
                        this.options.closeButton && t.appendChild(this._closeButton), t.appendChild(this._content)
                    }
                },
                _updatePosition: function() {
                    if (this._lngLat && this._container) {
                        var t = this._map.project(this._lngLat).round(),
                            i = this.options.anchor;
                        if (!i) {
                            var e = this._container.offsetWidth,
                                n = this._container.offsetHeight;
                            i = t.y < n ? ["top"] : t.y > this._map.transform.height - n ? ["bottom"] : [], t.x < e / 2 ? i.push("left") : t.x > this._map.transform.width - e / 2 && i.push("right"), i = 0 === i.length ? "bottom" : i.join("-"), this.options.anchor = i
                        }
                        var o = {
                                top: "translate(-50%,0)",
                                "top-left": "translate(0,0)",
                                "top-right": "translate(-100%,0)",
                                bottom: "translate(-50%,-100%)",
                                "bottom-left": "translate(0,-100%)",
                                "bottom-right": "translate(-100%,-100%)",
                                left: "translate(0,-50%)",
                                right: "translate(-100%,-50%)"
                            },
                            s = this._container.classList;
                        for (var a in o) s.remove("mapboxgl-popup-anchor-" + a);
                        s.add("mapboxgl-popup-anchor-" + i), DOM.setTransform(this._container, o[i] + " translate(" + t.x + "px," + t.y + "px)")
                    }
                },
                _onClickClose: function() {
                    this.remove()
                }
            });
        }, {
            "../geo/lng_lat": 10,
            "../util/dom": 87,
            "../util/evented": 89,
            "../util/util": 95
        }],
        82: [function(require, module, exports) {
            "use strict";

            function Actor(t, e) {
                this.target = t, this.parent = e, this.callbacks = {}, this.callbackID = 0, this.receive = this.receive.bind(this), this.target.addEventListener("message", this.receive, !1)
            }
            module.exports = Actor, Actor.prototype.receive = function(t) {
                var e, s = t.data;
                if ("<response>" === s.type) e = this.callbacks[s.id], delete this.callbacks[s.id], e(s.error || null, s.data);
                else if ("undefined" != typeof s.id) {
                    var i = s.id;
                    this.parent[s.type](s.data, function(t, e, s) {
                        this.postMessage({
                            type: "<response>",
                            id: String(i),
                            error: t ? String(t) : null,
                            data: e
                        }, s)
                    }.bind(this))
                } else this.parent[s.type](s.data)
            }, Actor.prototype.send = function(t, e, s, i) {
                var a = null;
                s && (this.callbacks[a = this.callbackID++] = s), this.postMessage({
                    type: t,
                    id: String(a),
                    data: e
                }, i)
            }, Actor.prototype.postMessage = function(t, e) {
                try {
                    this.target.postMessage(t, e)
                } catch (s) {
                    this.target.postMessage(t)
                }
            };
        }, {}],
        83: [function(require, module, exports) {
            "use strict";

            function sameOrigin(e) {
                var t = document.createElement("a");
                return t.href = e, t.protocol === document.location.protocol && t.host === document.location.host
            }
            exports.getJSON = function(e, t) {
                var n = new XMLHttpRequest;
                return n.open("GET", e, !0), n.setRequestHeader("Accept", "application/json"), n.onerror = function(e) {
                    t(e)
                }, n.onload = function() {
                    if (n.status >= 200 && n.status < 300 && n.response) {
                        var e;
                        try {
                            e = JSON.parse(n.response)
                        } catch (r) {
                            return t(r)
                        }
                        t(null, e)
                    } else t(new Error(n.statusText))
                }, n.send(), n
            }, exports.getArrayBuffer = function(e, t) {
                var n = new XMLHttpRequest;
                return n.open("GET", e, !0), n.responseType = "arraybuffer", n.onerror = function(e) {
                    t(e)
                }, n.onload = function() {
                    n.status >= 200 && n.status < 300 && n.response ? t(null, n.response) : t(new Error(n.statusText))
                }, n.send(), n
            }, exports.getImage = function(e, t) {
                return exports.getArrayBuffer(e, function(e, n) {
                    if (e) return t(e);
                    var r = new Image;
                    r.onload = function() {
                        t(null, r), (window.URL || window.webkitURL).revokeObjectURL(r.src)
                    };
                    var o = new Blob([new Uint8Array(n)], {
                        type: "image/png"
                    });
                    return r.src = (window.URL || window.webkitURL).createObjectURL(o), r.getData = function() {
                        var e = document.createElement("canvas"),
                            t = e.getContext("2d");
                        return e.width = r.width, e.height = r.height, t.drawImage(r, 0, 0), t.getImageData(0, 0, r.width, r.height).data
                    }, r
                })
            }, exports.getVideo = function(e, t) {
                var n = document.createElement("video");
                n.onloadstart = function() {
                    t(null, n)
                };
                for (var r = 0; r < e.length; r++) {
                    var o = document.createElement("source");
                    sameOrigin(e[r]) || (n.crossOrigin = "Anonymous"), o.src = e[r], n.appendChild(o)
                }
                return n.getData = function() {
                    return n
                }, n
            };
        }, {}],
        84: [function(require, module, exports) {
            "use strict";
            var Canvas = require("./canvas"),
                frame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            exports.frame = function(e) {
                return frame(e)
            };
            var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
            exports.cancelFrame = function(e) {
                cancel(e)
            }, exports.timed = function(e, r, t) {
                function n(a) {
                    o || (window.performance || (a = Date.now()), a >= i + r ? e.call(t, 1) : (e.call(t, (a - i) / r), exports.frame(n)))
                }
                if (!r) return e.call(t, 1), null;
                var o = !1,
                    i = window.performance ? window.performance.now() : Date.now();
                return exports.frame(n),
                    function() {
                        o = !0
                    }
            }, exports.supported = function(e) {
                for (var r = ([function() {
                        return "undefined" != typeof window
                    }, function() {
                        return "undefined" != typeof document
                    }, function() {
                        return !!(Array.prototype && Array.prototype.every && Array.prototype.filter && Array.prototype.forEach && Array.prototype.indexOf && Array.prototype.lastIndexOf && Array.prototype.map && Array.prototype.some && Array.prototype.reduce && Array.prototype.reduceRight && Array.isArray)
                    }, function() {
                        return !(!Function.prototype || !Function.prototype.bind || !(Object.keys && Object.create && Object.getPrototypeOf && Object.getOwnPropertyNames && Object.isSealed && Object.isFrozen && Object.isExtensible && Object.getOwnPropertyDescriptor && Object.defineProperty && Object.defineProperties && Object.seal && Object.freeze && Object.preventExtensions))
                    }, function() {
                        return "JSON" in window && "parse" in JSON && "stringify" in JSON
                    }, function() {
                        return (new Canvas).supportsWebGLContext(e && e.failIfMajorPerformanceCaveat || !1)
                    }, function() {
                        return "Worker" in window
                    }]), t = 0; t < r.length; t++)
                    if (!r[t]()) return !1;
                return !0
            }, exports.hardwareConcurrency = navigator.hardwareConcurrency || 8, Object.defineProperty(exports, "devicePixelRatio", {
                get: function() {
                    return window.devicePixelRatio
                }
            }), exports.supportsWebp = !1;
            var webpImgTest = document.createElement("img");
            webpImgTest.onload = function() {
                exports.supportsWebp = !0
            }, webpImgTest.src = "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA=";
        }, {
            "./canvas": 85
        }],
        85: [function(require, module, exports) {
            "use strict";

            function Canvas(t, e) {
                this.canvas = document.createElement("canvas"), t && e && (this.canvas.style.position = "absolute", this.canvas.classList.add("mapboxgl-canvas"), this.canvas.addEventListener("webglcontextlost", t._contextLost.bind(t), !1), this.canvas.addEventListener("webglcontextrestored", t._contextRestored.bind(t), !1), this.canvas.setAttribute("tabindex", 0), e.appendChild(this.canvas))
            }
            var util = require("../util");
            module.exports = Canvas, Canvas.prototype.resize = function(t, e) {
                var a = window.devicePixelRatio || 1;
                this.canvas.width = a * t, this.canvas.height = a * e, this.canvas.style.width = t + "px", this.canvas.style.height = e + "px"
            };
            var requiredContextAttributes = {
                antialias: !1,
                alpha: !0,
                stencil: !0,
                depth: !1
            };
            Canvas.prototype.getWebGLContext = function(t) {
                return t = util.extend({}, t, requiredContextAttributes), this.canvas.getContext("webgl", t) || this.canvas.getContext("experimental-webgl", t)
            }, Canvas.prototype.supportsWebGLContext = function(t) {
                var e = util.extend({
                    failIfMajorPerformanceCaveat: t
                }, requiredContextAttributes);
                return "probablySupportsContext" in this.canvas ? this.canvas.probablySupportsContext("webgl", e) || this.canvas.probablySupportsContext("experimental-webgl", e) : "supportsContext" in this.canvas ? this.canvas.supportsContext("webgl", e) || this.canvas.supportsContext("experimental-webgl", e) : !!window.WebGLRenderingContext && !!this.getWebGLContext(t)
            }, Canvas.prototype.getElement = function() {
                return this.canvas
            };
        }, {
            "../util": 95
        }],
        86: [function(require, module, exports) {
            "use strict";

            function Dispatcher(r, t) {
                this.actors = [], this.currentActor = 0;
                for (var e = 0; r > e; e++) {
                    var o = new WebWorkify(require("../../source/worker")),
                        s = new Actor(o, t);
                    s.name = "Worker " + e, this.actors.push(s)
                }
            }
            var Actor = require("../actor"),
                WebWorkify = require("webworkify");
            module.exports = Dispatcher, Dispatcher.prototype = {
                broadcast: function(r, t) {
                    for (var e = 0; e < this.actors.length; e++) this.actors[e].send(r, t)
                },
                send: function(r, t, e, o, s) {
                    return ("number" != typeof o || isNaN(o)) && (o = this.currentActor = (this.currentActor + 1) % this.actors.length), this.actors[o].send(r, t, e, s), o
                },
                remove: function() {
                    for (var r = 0; r < this.actors.length; r++) this.actors[r].target.terminate();
                    this.actors = []
                }
            };
        }, {
            "../../source/worker": 39,
            "../actor": 82,
            "webworkify": 140
        }],
        87: [function(require, module, exports) {
            "use strict";

            function testProp(e) {
                for (var t = 0; t < e.length; t++)
                    if (e[t] in docStyle) return e[t]
            }

            function suppressClick(e) {
                e.preventDefault(), e.stopPropagation(), window.removeEventListener("click", suppressClick, !0)
            }
            var Point = require("point-geometry");
            exports.create = function(e, t, r) {
                var o = document.createElement(e);
                return t && (o.className = t), r && r.appendChild(o), o
            };
            var docStyle = document.documentElement.style,
                selectProp = testProp(["userSelect", "MozUserSelect", "WebkitUserSelect", "msUserSelect"]),
                userSelect;
            exports.disableDrag = function() {
                selectProp && (userSelect = docStyle[selectProp], docStyle[selectProp] = "none")
            }, exports.enableDrag = function() {
                selectProp && (docStyle[selectProp] = userSelect)
            };
            var transformProp = testProp(["transform", "WebkitTransform"]);
            exports.setTransform = function(e, t) {
                e.style[transformProp] = t
            }, exports.suppressClick = function() {
                window.addEventListener("click", suppressClick, !0), window.setTimeout(function() {
                    window.removeEventListener("click", suppressClick, !0)
                }, 0)
            }, exports.mousePos = function(e, t) {
                var r = e.getBoundingClientRect();
                return t = t.touches ? t.touches[0] : t, new Point(t.clientX - r.left - e.clientLeft, t.clientY - r.top - e.clientTop)
            };
        }, {
            "point-geometry": 131
        }],
        88: [function(require, module, exports) {
            "use strict";
            module.exports = {
                API_URL: "https://api.mapbox.com",
                REQUIRE_ACCESS_TOKEN: !0
            };
        }, {}],
        89: [function(require, module, exports) {
            "use strict";
            var util = require("./util"),
                Evented = {
                    on: function(t, e) {
                        return this._events = this._events || {}, this._events[t] = this._events[t] || [], this._events[t].push(e), this
                    },
                    off: function(t, e) {
                        if (!t) return delete this._events, this;
                        if (!this.listens(t)) return this;
                        if (e) {
                            var s = this._events[t].indexOf(e);
                            s >= 0 && this._events[t].splice(s, 1), this._events[t].length || delete this._events[t]
                        } else delete this._events[t];
                        return this
                    },
                    once: function(t, e) {
                        var s = function(i) {
                            this.off(t, s), e.call(this, i)
                        }.bind(this);
                        return this.on(t, s), this
                    },
                    fire: function(t, e) {
                        if (!this.listens(t)) return this;
                        e = util.extend({}, e), util.extend(e, {
                            type: t,
                            target: this
                        });
                        for (var s = this._events[t].slice(), i = 0; i < s.length; i++) s[i].call(this, e);
                        return this
                    },
                    listens: function(t) {
                        return !(!this._events || !this._events[t])
                    }
                };
            module.exports = Evented;
        }, {
            "./util": 95
        }],
        90: [function(require, module, exports) {
            "use strict";

            function Glyphs(a, e) {
                this.stacks = a.readFields(readFontstacks, [], e)
            }

            function readFontstacks(a, e, r) {
                if (1 === a) {
                    var t = r.readMessage(readFontstack, {
                        glyphs: {}
                    });
                    e.push(t)
                }
            }

            function readFontstack(a, e, r) {
                if (1 === a) e.name = r.readString();
                else if (2 === a) e.range = r.readString();
                else if (3 === a) {
                    var t = r.readMessage(readGlyph, {});
                    e.glyphs[t.id] = t
                }
            }

            function readGlyph(a, e, r) {
                1 === a ? e.id = r.readVarint() : 2 === a ? e.bitmap = r.readBytes() : 3 === a ? e.width = r.readVarint() : 4 === a ? e.height = r.readVarint() : 5 === a ? e.left = r.readSVarint() : 6 === a ? e.top = r.readSVarint() : 7 === a && (e.advance = r.readVarint())
            }
            module.exports = Glyphs;
        }, {}],
        91: [function(require, module, exports) {
            "use strict";

            function interpolate(t, e, n) {
                return t * (1 - n) + e * n
            }
            module.exports = interpolate, interpolate.number = interpolate, interpolate.vec2 = function(t, e, n) {
                return [interpolate(t[0], e[0], n), interpolate(t[1], e[1], n)]
            }, interpolate.color = function(t, e, n) {
                return [interpolate(t[0], e[0], n), interpolate(t[1], e[1], n), interpolate(t[2], e[2], n), interpolate(t[3], e[3], n)]
            }, interpolate.array = function(t, e, n) {
                return t.map(function(t, r) {
                    return interpolate(t, e[r], n)
                })
            };
        }, {}],
        92: [function(require, module, exports) {
            "use strict";

            function normalizeURL(e, r, o) {
                if (o = o || config.ACCESS_TOKEN, !o && config.REQUIRE_ACCESS_TOKEN) throw new Error("An API access token is required to use Mapbox GL. See https://www.mapbox.com/developers/api/#access-tokens");
                if (e = e.replace(/^mapbox:\/\//, config.API_URL + r), e += -1 !== e.indexOf("?") ? "&access_token=" : "?access_token=", config.REQUIRE_ACCESS_TOKEN) {
                    if ("s" === o[0]) throw new Error("Use a public access token (pk.*) with Mapbox GL JS, not a secret access token (sk.*). See https://www.mapbox.com/developers/api/#access-tokens");
                    e += o
                }
                return e
            }
            var config = require("./config"),
                browser = require("./browser");
            module.exports.normalizeStyleURL = function(e, r) {
                if (!e.match(/^mapbox:\/\/styles\//)) return e;
                var o = e.split("/"),
                    t = o[3],
                    s = o[4],
                    n = o[5] ? "/draft" : "";
                return normalizeURL("mapbox://" + t + "/" + s + n, "/styles/v1/", r)
            }, module.exports.normalizeSourceURL = function(e, r) {
                return e.match(/^mapbox:\/\//) ? normalizeURL(e + ".json", "/v4/", r) + "&secure" : e
            }, module.exports.normalizeGlyphsURL = function(e, r) {
                if (!e.match(/^mapbox:\/\//)) return e;
                var o = e.split("/")[3];
                return normalizeURL("mapbox://" + o + "/{fontstack}/{range}.pbf", "/fonts/v1/", r)
            }, module.exports.normalizeSpriteURL = function(e, r, o, t) {
                if (!e.match(/^mapbox:\/\/sprites\//)) return e + r + o;
                var s = e.split("/"),
                    n = s[3],
                    a = s[4],
                    i = s[5] ? "/draft" : "";
                return normalizeURL("mapbox://" + n + "/" + a + i + "/sprite" + r + o, "/styles/v1/", t)
            }, module.exports.normalizeTileURL = function(e, r) {
                if (!r || !r.match(/^mapbox:\/\//)) return e;
                e = e.replace(/([?&]access_token=)tk\.[^&]+/, "$1" + config.ACCESS_TOKEN);
                var o = browser.supportsWebp ? "webp" : "$1";
                return e.replace(/\.((?:png|jpg)\d*)(?=$|\?)/, browser.devicePixelRatio >= 2 ? "@2x." + o : "." + o)
            };
        }, {
            "./browser": 84,
            "./config": 88
        }],
        93: [function(require, module, exports) {
            "use strict";

            function MRUCache(t, e) {
                this.max = t, this.onRemove = e, this.reset()
            }
            module.exports = MRUCache, MRUCache.prototype.reset = function() {
                for (var t in this.list) this.onRemove(this.list[t]);
                return this.list = {}, this.order = [], this
            }, MRUCache.prototype.add = function(t, e) {
                if (this.list[t] = e, this.order.push(t), this.order.length > this.max) {
                    var i = this.get(this.order[0]);
                    i && this.onRemove(i)
                }
                return this
            }, MRUCache.prototype.has = function(t) {
                return t in this.list
            }, MRUCache.prototype.keys = function() {
                return this.order
            }, MRUCache.prototype.get = function(t) {
                if (!this.has(t)) return null;
                var e = this.list[t];
                return delete this.list[t], this.order.splice(this.order.indexOf(t), 1), e
            };
        }, {}],
        94: [function(require, module, exports) {
            "use strict";

            function resolveTokens(e, n) {
                return n.replace(/{([^{}()\[\]<>$=:;.,^]+)}/g, function(n, r) {
                    return r in e ? e[r] : ""
                })
            }
            module.exports = resolveTokens;
        }, {}],
        95: [function(require, module, exports) {
            "use strict";
            var UnitBezier = require("unitbezier"),
                Coordinate = require("../geo/coordinate");
            exports.easeCubicInOut = function(n) {
                if (0 >= n) return 0;
                if (n >= 1) return 1;
                var t = n * n,
                    r = t * n;
                return 4 * (.5 > n ? r : 3 * (n - t) + r - .75)
            }, exports.bezier = function(n, t, r, e) {
                var o = new UnitBezier(n, t, r, e);
                return function(n) {
                    return o.solve(n)
                }
            }, exports.ease = exports.bezier(.25, .1, .25, 1), exports.premultiply = function(n) {
                return n[0] *= n[3], n[1] *= n[3], n[2] *= n[3], n
            }, exports.clamp = function(n, t, r) {
                return Math.min(r, Math.max(t, n))
            }, exports.wrap = function(n, t, r) {
                var e = r - t,
                    o = ((n - t) % e + e) % e + t;
                return o === t ? r : o
            }, exports.coalesce = function() {
                for (var n = 0; n < arguments.length; n++) {
                    var t = arguments[n];
                    if (null !== t && void 0 !== t) return t
                }
            }, exports.asyncAll = function(n, t, r) {
                if (!n.length) return r(null, []);
                var e = n.length,
                    o = new Array(n.length),
                    i = null;
                n.forEach(function(n, u) {
                    t(n, function(n, t) {
                        n && (i = n), o[u] = t, 0 === --e && r(i, o)
                    })
                })
            }, exports.keysDifference = function(n, t) {
                var r = [];
                for (var e in n) e in t || r.push(e);
                return r
            }, exports.extend = function(n) {
                for (var t = 1; t < arguments.length; t++) {
                    var r = arguments[t];
                    for (var e in r) n[e] = r[e]
                }
                return n
            }, exports.extendAll = function(n, t) {
                for (var r in t) Object.defineProperty(n, r, Object.getOwnPropertyDescriptor(t, r));
                return n
            }, exports.inherit = function(n, t) {
                var r = "function" == typeof n ? n.prototype : n,
                    e = Object.create(r);
                return exports.extendAll(e, t), e
            }, exports.pick = function(n, t) {
                for (var r = {}, e = 0; e < t.length; e++) {
                    var o = t[e];
                    o in n && (r[o] = n[o])
                }
                return r
            };
            var id = 1;
            exports.uniqueId = function() {
                return id++
            }, exports.throttle = function(n, t, r) {
                var e, o, i, u;
                return u = function() {
                    e = !1, o && (i.apply(r, o), o = !1)
                }, i = function() {
                    e ? o = arguments : (n.apply(r, arguments), setTimeout(u, t), e = !0)
                }
            }, exports.debounce = function(n, t) {
                var r, e;
                return function() {
                    e = arguments, clearTimeout(r), r = setTimeout(function() {
                        n.apply(null, e)
                    }, t)
                }
            }, exports.bindAll = function(n, t) {
                n.forEach(function(n) {
                    t[n] = t[n].bind(t)
                })
            }, exports.bindHandlers = function(n) {
                for (var t in n) "function" == typeof n[t] && 0 === t.indexOf("_on") && (n[t] = n[t].bind(n))
            }, exports.setOptions = function(n, t) {
                n.hasOwnProperty("options") || (n.options = n.options ? Object.create(n.options) : {});
                for (var r in t) n.options[r] = t[r];
                return n.options
            }, exports.getCoordinatesCenter = function(n) {
                for (var t = 1 / 0, r = 1 / 0, e = -(1 / 0), o = -(1 / 0), i = 0; i < n.length; i++) t = Math.min(t, n[i].column), r = Math.min(r, n[i].row), e = Math.max(e, n[i].column), o = Math.max(o, n[i].row);
                var u = e - t,
                    a = o - r,
                    s = Math.max(u, a);
                return new Coordinate((t + e) / 2, (r + o) / 2, 0).zoomTo(Math.floor(-Math.log(s) / Math.LN2))
            };
        }, {
            "../geo/coordinate": 9,
            "unitbezier": 134
        }],
        96: [function(require, module, exports) {
            "function" == typeof Object.create ? module.exports = function(t, e) {
                t.super_ = e, t.prototype = Object.create(e.prototype, {
                    constructor: {
                        value: t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                })
            } : module.exports = function(t, e) {
                t.super_ = e;
                var o = function() {};
                o.prototype = e.prototype, t.prototype = new o, t.prototype.constructor = t
            };
        }, {}],
        97: [function(require, module, exports) {
            (function(process) {
                function normalizeArray(r, t) {
                    for (var e = 0, n = r.length - 1; n >= 0; n--) {
                        var s = r[n];
                        "." === s ? r.splice(n, 1) : ".." === s ? (r.splice(n, 1), e++) : e && (r.splice(n, 1), e--)
                    }
                    if (t)
                        for (; e--; e) r.unshift("..");
                    return r
                }

                function filter(r, t) {
                    if (r.filter) return r.filter(t);
                    for (var e = [], n = 0; n < r.length; n++) t(r[n], n, r) && e.push(r[n]);
                    return e
                }
                var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,
                    splitPath = function(r) {
                        return splitPathRe.exec(r).slice(1)
                    };
                exports.resolve = function() {
                    for (var r = "", t = !1, e = arguments.length - 1; e >= -1 && !t; e--) {
                        var n = e >= 0 ? arguments[e] : process.cwd();
                        if ("string" != typeof n) throw new TypeError("Arguments to path.resolve must be strings");
                        n && (r = n + "/" + r, t = "/" === n.charAt(0))
                    }
                    return r = normalizeArray(filter(r.split("/"), function(r) {
                        return !!r
                    }), !t).join("/"), (t ? "/" : "") + r || "."
                }, exports.normalize = function(r) {
                    var t = exports.isAbsolute(r),
                        e = "/" === substr(r, -1);
                    return r = normalizeArray(filter(r.split("/"), function(r) {
                        return !!r
                    }), !t).join("/"), r || t || (r = "."), r && e && (r += "/"), (t ? "/" : "") + r
                }, exports.isAbsolute = function(r) {
                    return "/" === r.charAt(0)
                }, exports.join = function() {
                    var r = Array.prototype.slice.call(arguments, 0);
                    return exports.normalize(filter(r, function(r, t) {
                        if ("string" != typeof r) throw new TypeError("Arguments to path.join must be strings");
                        return r
                    }).join("/"))
                }, exports.relative = function(r, t) {
                    function e(r) {
                        for (var t = 0; t < r.length && "" === r[t]; t++);
                        for (var e = r.length - 1; e >= 0 && "" === r[e]; e--);
                        return t > e ? [] : r.slice(t, e - t + 1)
                    }
                    r = exports.resolve(r).substr(1), t = exports.resolve(t).substr(1);
                    for (var n = e(r.split("/")), s = e(t.split("/")), i = Math.min(n.length, s.length), o = i, u = 0; i > u; u++)
                        if (n[u] !== s[u]) {
                            o = u;
                            break
                        }
                    for (var l = [], u = o; u < n.length; u++) l.push("..");
                    return l = l.concat(s.slice(o)), l.join("/")
                }, exports.sep = "/", exports.delimiter = ":", exports.dirname = function(r) {
                    var t = splitPath(r),
                        e = t[0],
                        n = t[1];
                    return e || n ? (n && (n = n.substr(0, n.length - 1)), e + n) : "."
                }, exports.basename = function(r, t) {
                    var e = splitPath(r)[2];
                    return t && e.substr(-1 * t.length) === t && (e = e.substr(0, e.length - t.length)), e
                }, exports.extname = function(r) {
                    return splitPath(r)[3]
                };
                var substr = "b" === "ab".substr(-1) ? function(r, t, e) {
                    return r.substr(t, e)
                } : function(r, t, e) {
                    return 0 > t && (t = r.length + t), r.substr(t, e)
                };
            }).call(this, require('_process'))

        }, {
            "_process": 98
        }],
        98: [function(require, module, exports) {
            function cleanUpNextTick() {
                draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, queue.length && drainQueue()
            }

            function drainQueue() {
                if (!draining) {
                    var e = setTimeout(cleanUpNextTick);
                    draining = !0;
                    for (var n = queue.length; n;) {
                        for (currentQueue = queue, queue = []; ++queueIndex < n;) currentQueue && currentQueue[queueIndex].run();
                        queueIndex = -1, n = queue.length
                    }
                    currentQueue = null, draining = !1, clearTimeout(e)
                }
            }

            function Item(e, n) {
                this.fun = e, this.array = n
            }

            function noop() {}
            var process = module.exports = {},
                queue = [],
                draining = !1,
                currentQueue, queueIndex = -1;
            process.nextTick = function(e) {
                var n = new Array(arguments.length - 1);
                if (arguments.length > 1)
                    for (var r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];
                queue.push(new Item(e, n)), 1 !== queue.length || draining || setTimeout(drainQueue, 0)
            }, Item.prototype.run = function() {
                this.fun.apply(null, this.array)
            }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, process.emit = noop, process.binding = function(e) {
                throw new Error("process.binding is not supported")
            }, process.cwd = function() {
                return "/"
            }, process.chdir = function(e) {
                throw new Error("process.chdir is not supported")
            }, process.umask = function() {
                return 0
            };
        }, {}],
        99: [function(require, module, exports) {
            module.exports = function(o) {
                return o && "object" == typeof o && "function" == typeof o.copy && "function" == typeof o.fill && "function" == typeof o.readUInt8
            };
        }, {}],
        100: [function(require, module, exports) {
            (function(process, global) {
                function inspect(e, r) {
                    var t = {
                        seen: [],
                        stylize: stylizeNoColor
                    };
                    return arguments.length >= 3 && (t.depth = arguments[2]), arguments.length >= 4 && (t.colors = arguments[3]), isBoolean(r) ? t.showHidden = r : r && exports._extend(t, r), isUndefined(t.showHidden) && (t.showHidden = !1), isUndefined(t.depth) && (t.depth = 2), isUndefined(t.colors) && (t.colors = !1), isUndefined(t.customInspect) && (t.customInspect = !0), t.colors && (t.stylize = stylizeWithColor), formatValue(t, e, t.depth)
                }

                function stylizeWithColor(e, r) {
                    var t = inspect.styles[r];
                    return t ? "[" + inspect.colors[t][0] + "m" + e + "[" + inspect.colors[t][1] + "m" : e
                }

                function stylizeNoColor(e, r) {
                    return e
                }

                function arrayToHash(e) {
                    var r = {};
                    return e.forEach(function(e, t) {
                        r[e] = !0
                    }), r
                }

                function formatValue(e, r, t) {
                    if (e.customInspect && r && isFunction(r.inspect) && r.inspect !== exports.inspect && (!r.constructor || r.constructor.prototype !== r)) {
                        var n = r.inspect(t, e);
                        return isString(n) || (n = formatValue(e, n, t)), n
                    }
                    var i = formatPrimitive(e, r);
                    if (i) return i;
                    var o = Object.keys(r),
                        s = arrayToHash(o);
                    if (e.showHidden && (o = Object.getOwnPropertyNames(r)), isError(r) && (o.indexOf("message") >= 0 || o.indexOf("description") >= 0)) return formatError(r);
                    if (0 === o.length) {
                        if (isFunction(r)) {
                            var u = r.name ? ": " + r.name : "";
                            return e.stylize("[Function" + u + "]", "special")
                        }
                        if (isRegExp(r)) return e.stylize(RegExp.prototype.toString.call(r), "regexp");
                        if (isDate(r)) return e.stylize(Date.prototype.toString.call(r), "date");
                        if (isError(r)) return formatError(r)
                    }
                    var a = "",
                        c = !1,
                        l = ["{", "}"];
                    if (isArray(r) && (c = !0, l = ["[", "]"]), isFunction(r)) {
                        var p = r.name ? ": " + r.name : "";
                        a = " [Function" + p + "]"
                    }
                    if (isRegExp(r) && (a = " " + RegExp.prototype.toString.call(r)), isDate(r) && (a = " " + Date.prototype.toUTCString.call(r)), isError(r) && (a = " " + formatError(r)), 0 === o.length && (!c || 0 == r.length)) return l[0] + a + l[1];
                    if (0 > t) return isRegExp(r) ? e.stylize(RegExp.prototype.toString.call(r), "regexp") : e.stylize("[Object]", "special");
                    e.seen.push(r);
                    var f;
                    return f = c ? formatArray(e, r, t, s, o) : o.map(function(n) {
                        return formatProperty(e, r, t, s, n, c)
                    }), e.seen.pop(), reduceToSingleString(f, a, l)
                }

                function formatPrimitive(e, r) {
                    if (isUndefined(r)) return e.stylize("undefined", "undefined");
                    if (isString(r)) {
                        var t = "'" + JSON.stringify(r).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                        return e.stylize(t, "string")
                    }
                    return isNumber(r) ? e.stylize("" + r, "number") : isBoolean(r) ? e.stylize("" + r, "boolean") : isNull(r) ? e.stylize("null", "null") : void 0
                }

                function formatError(e) {
                    return "[" + Error.prototype.toString.call(e) + "]"
                }

                function formatArray(e, r, t, n, i) {
                    for (var o = [], s = 0, u = r.length; u > s; ++s) hasOwnProperty(r, String(s)) ? o.push(formatProperty(e, r, t, n, String(s), !0)) : o.push("");
                    return i.forEach(function(i) {
                        i.match(/^\d+$/) || o.push(formatProperty(e, r, t, n, i, !0))
                    }), o
                }

                function formatProperty(e, r, t, n, i, o) {
                    var s, u, a;
                    if (a = Object.getOwnPropertyDescriptor(r, i) || {
                            value: r[i]
                        }, a.get ? u = a.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : a.set && (u = e.stylize("[Setter]", "special")), hasOwnProperty(n, i) || (s = "[" + i + "]"), u || (e.seen.indexOf(a.value) < 0 ? (u = isNull(t) ? formatValue(e, a.value, null) : formatValue(e, a.value, t - 1), u.indexOf("\n") > -1 && (u = o ? u.split("\n").map(function(e) {
                            return "  " + e
                        }).join("\n").substr(2) : "\n" + u.split("\n").map(function(e) {
                            return "   " + e
                        }).join("\n"))) : u = e.stylize("[Circular]", "special")), isUndefined(s)) {
                        if (o && i.match(/^\d+$/)) return u;
                        s = JSON.stringify("" + i), s.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (s = s.substr(1, s.length - 2), s = e.stylize(s, "name")) : (s = s.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), s = e.stylize(s, "string"))
                    }
                    return s + ": " + u
                }

                function reduceToSingleString(e, r, t) {
                    var n = 0,
                        i = e.reduce(function(e, r) {
                            return n++, r.indexOf("\n") >= 0 && n++, e + r.replace(/\u001b\[\d\d?m/g, "").length + 1
                        }, 0);
                    return i > 60 ? t[0] + ("" === r ? "" : r + "\n ") + " " + e.join(",\n  ") + " " + t[1] : t[0] + r + " " + e.join(", ") + " " + t[1]
                }

                function isArray(e) {
                    return Array.isArray(e)
                }

                function isBoolean(e) {
                    return "boolean" == typeof e
                }

                function isNull(e) {
                    return null === e
                }

                function isNullOrUndefined(e) {
                    return null == e
                }

                function isNumber(e) {
                    return "number" == typeof e
                }

                function isString(e) {
                    return "string" == typeof e
                }

                function isSymbol(e) {
                    return "symbol" == typeof e
                }

                function isUndefined(e) {
                    return void 0 === e
                }

                function isRegExp(e) {
                    return isObject(e) && "[object RegExp]" === objectToString(e)
                }

                function isObject(e) {
                    return "object" == typeof e && null !== e
                }

                function isDate(e) {
                    return isObject(e) && "[object Date]" === objectToString(e)
                }

                function isError(e) {
                    return isObject(e) && ("[object Error]" === objectToString(e) || e instanceof Error)
                }

                function isFunction(e) {
                    return "function" == typeof e
                }

                function isPrimitive(e) {
                    return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || "undefined" == typeof e
                }

                function objectToString(e) {
                    return Object.prototype.toString.call(e)
                }

                function pad(e) {
                    return 10 > e ? "0" + e.toString(10) : e.toString(10)
                }

                function timestamp() {
                    var e = new Date,
                        r = [pad(e.getHours()), pad(e.getMinutes()), pad(e.getSeconds())].join(":");
                    return [e.getDate(), months[e.getMonth()], r].join(" ")
                }

                function hasOwnProperty(e, r) {
                    return Object.prototype.hasOwnProperty.call(e, r)
                }
                var formatRegExp = /%[sdj%]/g;
                exports.format = function(e) {
                    if (!isString(e)) {
                        for (var r = [], t = 0; t < arguments.length; t++) r.push(inspect(arguments[t]));
                        return r.join(" ")
                    }
                    for (var t = 1, n = arguments, i = n.length, o = String(e).replace(formatRegExp, function(e) {
                            if ("%%" === e) return "%";
                            if (t >= i) return e;
                            switch (e) {
                                case "%s":
                                    return String(n[t++]);
                                case "%d":
                                    return Number(n[t++]);
                                case "%j":
                                    try {
                                        return JSON.stringify(n[t++])
                                    } catch (r) {
                                        return "[Circular]"
                                    }
                                default:
                                    return e
                            }
                        }), s = n[t]; i > t; s = n[++t]) o += isNull(s) || !isObject(s) ? " " + s : " " + inspect(s);
                    return o
                }, exports.deprecate = function(e, r) {
                    function t() {
                        if (!n) {
                            if (process.throwDeprecation) throw new Error(r);
                            process.traceDeprecation ? console.trace(r) : console.error(r), n = !0
                        }
                        return e.apply(this, arguments)
                    }
                    if (isUndefined(global.process)) return function() {
                        return exports.deprecate(e, r).apply(this, arguments)
                    };
                    if (process.noDeprecation === !0) return e;
                    var n = !1;
                    return t
                };
                var debugs = {},
                    debugEnviron;
                exports.debuglog = function(e) {
                    if (isUndefined(debugEnviron) && (debugEnviron = process.env.NODE_DEBUG || ""), e = e.toUpperCase(), !debugs[e])
                        if (new RegExp("\\b" + e + "\\b", "i").test(debugEnviron)) {
                            var r = process.pid;
                            debugs[e] = function() {
                                var t = exports.format.apply(exports, arguments);
                                console.error("%s %d: %s", e, r, t)
                            }
                        } else debugs[e] = function() {};
                    return debugs[e]
                }, exports.inspect = inspect, inspect.colors = {
                    bold: [1, 22],
                    italic: [3, 23],
                    underline: [4, 24],
                    inverse: [7, 27],
                    white: [37, 39],
                    grey: [90, 39],
                    black: [30, 39],
                    blue: [34, 39],
                    cyan: [36, 39],
                    green: [32, 39],
                    magenta: [35, 39],
                    red: [31, 39],
                    yellow: [33, 39]
                }, inspect.styles = {
                    special: "cyan",
                    number: "yellow",
                    "boolean": "yellow",
                    undefined: "grey",
                    "null": "bold",
                    string: "green",
                    date: "magenta",
                    regexp: "red"
                }, exports.isArray = isArray, exports.isBoolean = isBoolean, exports.isNull = isNull, exports.isNullOrUndefined = isNullOrUndefined, exports.isNumber = isNumber, exports.isString = isString, exports.isSymbol = isSymbol, exports.isUndefined = isUndefined, exports.isRegExp = isRegExp, exports.isObject = isObject, exports.isDate = isDate, exports.isError = isError, exports.isFunction = isFunction, exports.isPrimitive = isPrimitive, exports.isBuffer = require("./support/isBuffer");
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                exports.log = function() {
                    console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments))
                }, exports.inherits = require("inherits"), exports._extend = function(e, r) {
                    if (!r || !isObject(r)) return e;
                    for (var t = Object.keys(r), n = t.length; n--;) e[t[n]] = r[t[n]];
                    return e
                };
            }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

        }, {
            "./support/isBuffer": 99,
            "_process": 98,
            "inherits": 96
        }],
        101: [function(require, module, exports) {
            function clamp_css_byte(e) {
                return e = Math.round(e), 0 > e ? 0 : e > 255 ? 255 : e
            }

            function clamp_css_float(e) {
                return 0 > e ? 0 : e > 1 ? 1 : e
            }

            function parse_css_int(e) {
                return clamp_css_byte("%" === e[e.length - 1] ? parseFloat(e) / 100 * 255 : parseInt(e))
            }

            function parse_css_float(e) {
                return clamp_css_float("%" === e[e.length - 1] ? parseFloat(e) / 100 : parseFloat(e))
            }

            function css_hue_to_rgb(e, r, l) {
                return 0 > l ? l += 1 : l > 1 && (l -= 1), 1 > 6 * l ? e + (r - e) * l * 6 : 1 > 2 * l ? r : 2 > 3 * l ? e + (r - e) * (2 / 3 - l) * 6 : e
            }

            function parseCSSColor(e) {
                var r = e.replace(/ /g, "").toLowerCase();
                if (r in kCSSColorTable) return kCSSColorTable[r].slice();
                if ("#" === r[0]) {
                    if (4 === r.length) {
                        var l = parseInt(r.substr(1), 16);
                        return l >= 0 && 4095 >= l ? [(3840 & l) >> 4 | (3840 & l) >> 8, 240 & l | (240 & l) >> 4, 15 & l | (15 & l) << 4, 1] : null
                    }
                    if (7 === r.length) {
                        var l = parseInt(r.substr(1), 16);
                        return l >= 0 && 16777215 >= l ? [(16711680 & l) >> 16, (65280 & l) >> 8, 255 & l, 1] : null
                    }
                    return null
                }
                var a = r.indexOf("("),
                    t = r.indexOf(")");
                if (-1 !== a && t + 1 === r.length) {
                    var n = r.substr(0, a),
                        s = r.substr(a + 1, t - (a + 1)).split(","),
                        o = 1;
                    switch (n) {
                        case "rgba":
                            if (4 !== s.length) return null;
                            o = parse_css_float(s.pop());
                        case "rgb":
                            return 3 !== s.length ? null : [parse_css_int(s[0]), parse_css_int(s[1]), parse_css_int(s[2]), o];
                        case "hsla":
                            if (4 !== s.length) return null;
                            o = parse_css_float(s.pop());
                        case "hsl":
                            if (3 !== s.length) return null;
                            var i = (parseFloat(s[0]) % 360 + 360) % 360 / 360,
                                u = parse_css_float(s[1]),
                                g = parse_css_float(s[2]),
                                d = .5 >= g ? g * (u + 1) : g + u - g * u,
                                c = 2 * g - d;
                            return [clamp_css_byte(255 * css_hue_to_rgb(c, d, i + 1 / 3)), clamp_css_byte(255 * css_hue_to_rgb(c, d, i)), clamp_css_byte(255 * css_hue_to_rgb(c, d, i - 1 / 3)), o];
                        default:
                            return null
                    }
                }
                return null
            }
            var kCSSColorTable = {
                transparent: [0, 0, 0, 0],
                aliceblue: [240, 248, 255, 1],
                antiquewhite: [250, 235, 215, 1],
                aqua: [0, 255, 255, 1],
                aquamarine: [127, 255, 212, 1],
                azure: [240, 255, 255, 1],
                beige: [245, 245, 220, 1],
                bisque: [255, 228, 196, 1],
                black: [0, 0, 0, 1],
                blanchedalmond: [255, 235, 205, 1],
                blue: [0, 0, 255, 1],
                blueviolet: [138, 43, 226, 1],
                brown: [165, 42, 42, 1],
                burlywood: [222, 184, 135, 1],
                cadetblue: [95, 158, 160, 1],
                chartreuse: [127, 255, 0, 1],
                chocolate: [210, 105, 30, 1],
                coral: [255, 127, 80, 1],
                cornflowerblue: [100, 149, 237, 1],
                cornsilk: [255, 248, 220, 1],
                crimson: [220, 20, 60, 1],
                cyan: [0, 255, 255, 1],
                darkblue: [0, 0, 139, 1],
                darkcyan: [0, 139, 139, 1],
                darkgoldenrod: [184, 134, 11, 1],
                darkgray: [169, 169, 169, 1],
                darkgreen: [0, 100, 0, 1],
                darkgrey: [169, 169, 169, 1],
                darkkhaki: [189, 183, 107, 1],
                darkmagenta: [139, 0, 139, 1],
                darkolivegreen: [85, 107, 47, 1],
                darkorange: [255, 140, 0, 1],
                darkorchid: [153, 50, 204, 1],
                darkred: [139, 0, 0, 1],
                darksalmon: [233, 150, 122, 1],
                darkseagreen: [143, 188, 143, 1],
                darkslateblue: [72, 61, 139, 1],
                darkslategray: [47, 79, 79, 1],
                darkslategrey: [47, 79, 79, 1],
                darkturquoise: [0, 206, 209, 1],
                darkviolet: [148, 0, 211, 1],
                deeppink: [255, 20, 147, 1],
                deepskyblue: [0, 191, 255, 1],
                dimgray: [105, 105, 105, 1],
                dimgrey: [105, 105, 105, 1],
                dodgerblue: [30, 144, 255, 1],
                firebrick: [178, 34, 34, 1],
                floralwhite: [255, 250, 240, 1],
                forestgreen: [34, 139, 34, 1],
                fuchsia: [255, 0, 255, 1],
                gainsboro: [220, 220, 220, 1],
                ghostwhite: [248, 248, 255, 1],
                gold: [255, 215, 0, 1],
                goldenrod: [218, 165, 32, 1],
                gray: [128, 128, 128, 1],
                green: [0, 128, 0, 1],
                greenyellow: [173, 255, 47, 1],
                grey: [128, 128, 128, 1],
                honeydew: [240, 255, 240, 1],
                hotpink: [255, 105, 180, 1],
                indianred: [205, 92, 92, 1],
                indigo: [75, 0, 130, 1],
                ivory: [255, 255, 240, 1],
                khaki: [240, 230, 140, 1],
                lavender: [230, 230, 250, 1],
                lavenderblush: [255, 240, 245, 1],
                lawngreen: [124, 252, 0, 1],
                lemonchiffon: [255, 250, 205, 1],
                lightblue: [173, 216, 230, 1],
                lightcoral: [240, 128, 128, 1],
                lightcyan: [224, 255, 255, 1],
                lightgoldenrodyellow: [250, 250, 210, 1],
                lightgray: [211, 211, 211, 1],
                lightgreen: [144, 238, 144, 1],
                lightgrey: [211, 211, 211, 1],
                lightpink: [255, 182, 193, 1],
                lightsalmon: [255, 160, 122, 1],
                lightseagreen: [32, 178, 170, 1],
                lightskyblue: [135, 206, 250, 1],
                lightslategray: [119, 136, 153, 1],
                lightslategrey: [119, 136, 153, 1],
                lightsteelblue: [176, 196, 222, 1],
                lightyellow: [255, 255, 224, 1],
                lime: [0, 255, 0, 1],
                limegreen: [50, 205, 50, 1],
                linen: [250, 240, 230, 1],
                magenta: [255, 0, 255, 1],
                maroon: [128, 0, 0, 1],
                mediumaquamarine: [102, 205, 170, 1],
                mediumblue: [0, 0, 205, 1],
                mediumorchid: [186, 85, 211, 1],
                mediumpurple: [147, 112, 219, 1],
                mediumseagreen: [60, 179, 113, 1],
                mediumslateblue: [123, 104, 238, 1],
                mediumspringgreen: [0, 250, 154, 1],
                mediumturquoise: [72, 209, 204, 1],
                mediumvioletred: [199, 21, 133, 1],
                midnightblue: [25, 25, 112, 1],
                mintcream: [245, 255, 250, 1],
                mistyrose: [255, 228, 225, 1],
                moccasin: [255, 228, 181, 1],
                navajowhite: [255, 222, 173, 1],
                navy: [0, 0, 128, 1],
                oldlace: [253, 245, 230, 1],
                olive: [128, 128, 0, 1],
                olivedrab: [107, 142, 35, 1],
                orange: [255, 165, 0, 1],
                orangered: [255, 69, 0, 1],
                orchid: [218, 112, 214, 1],
                palegoldenrod: [238, 232, 170, 1],
                palegreen: [152, 251, 152, 1],
                paleturquoise: [175, 238, 238, 1],
                palevioletred: [219, 112, 147, 1],
                papayawhip: [255, 239, 213, 1],
                peachpuff: [255, 218, 185, 1],
                peru: [205, 133, 63, 1],
                pink: [255, 192, 203, 1],
                plum: [221, 160, 221, 1],
                powderblue: [176, 224, 230, 1],
                purple: [128, 0, 128, 1],
                red: [255, 0, 0, 1],
                rosybrown: [188, 143, 143, 1],
                royalblue: [65, 105, 225, 1],
                saddlebrown: [139, 69, 19, 1],
                salmon: [250, 128, 114, 1],
                sandybrown: [244, 164, 96, 1],
                seagreen: [46, 139, 87, 1],
                seashell: [255, 245, 238, 1],
                sienna: [160, 82, 45, 1],
                silver: [192, 192, 192, 1],
                skyblue: [135, 206, 235, 1],
                slateblue: [106, 90, 205, 1],
                slategray: [112, 128, 144, 1],
                slategrey: [112, 128, 144, 1],
                snow: [255, 250, 250, 1],
                springgreen: [0, 255, 127, 1],
                steelblue: [70, 130, 180, 1],
                tan: [210, 180, 140, 1],
                teal: [0, 128, 128, 1],
                thistle: [216, 191, 216, 1],
                tomato: [255, 99, 71, 1],
                turquoise: [64, 224, 208, 1],
                violet: [238, 130, 238, 1],
                wheat: [245, 222, 179, 1],
                white: [255, 255, 255, 1],
                whitesmoke: [245, 245, 245, 1],
                yellow: [255, 255, 0, 1],
                yellowgreen: [154, 205, 50, 1]
            };
            try {
                exports.parseCSSColor = parseCSSColor
            } catch (e) {}
        }, {}],
        102: [function(require, module, exports) {
            "use strict";

            function infix(t) {
                return function(n, r, i) {
                    return "$type" === r ? "t" + t + VectorTileFeatureTypes.indexOf(i) : "p[" + JSON.stringify(r) + "]" + t + JSON.stringify(i)
                }
            }

            function strictInfix(t) {
                var n = infix(t);
                return function(t, r, i) {
                    return "$type" === r ? n(t, r, i) : "typeof(p[" + JSON.stringify(r) + "]) === typeof(" + JSON.stringify(i) + ") && " + n(t, r, i)
                }
            }

            function compile(t) {
                return operators[t[0]].apply(t, t)
            }

            function truth() {
                return !0
            }
            var VectorTileFeatureTypes = ["Unknown", "Point", "LineString", "Polygon"],
                operators = {
                    "==": infix("==="),
                    "!=": infix("!=="),
                    ">": strictInfix(">"),
                    "<": strictInfix("<"),
                    "<=": strictInfix("<="),
                    ">=": strictInfix(">="),
                    "in": function(t, n) {
                        return Array.prototype.slice.call(arguments, 2).map(function(r) {
                            return "(" + operators["=="](t, n, r) + ")"
                        }).join("||") || "false"
                    },
                    "!in": function() {
                        return "!(" + operators["in"].apply(this, arguments) + ")"
                    },
                    any: function() {
                        return Array.prototype.slice.call(arguments, 1).map(function(t) {
                            return "(" + compile(t) + ")"
                        }).join("||") || "false"
                    },
                    all: function() {
                        return Array.prototype.slice.call(arguments, 1).map(function(t) {
                            return "(" + compile(t) + ")"
                        }).join("&&") || "true"
                    },
                    none: function() {
                        return "!(" + operators.any.apply(this, arguments) + ")"
                    }
                };
            module.exports = function(t) {
                if (!t) return truth;
                var n = "var p = f.properties || f.tags || {}, t = f.type; return " + compile(t) + ";";
                return new Function("f", n)
            };
        }, {}],
        103: [function(require, module, exports) {
            "use strict";

            function clip(e, n, t, r, l, u, i, s) {
                if (t /= n, r /= n, i >= t && r >= s) return e;
                if (i > r || t > s) return null;
                for (var p = [], h = 0; h < e.length; h++) {
                    var c, a, o = e[h],
                        f = o.geometry,
                        g = o.type;
                    if (c = o.min[l], a = o.max[l], c >= t && r >= a) p.push(o);
                    else if (!(c > r || t > a)) {
                        var m = 1 === g ? clipPoints(f, t, r, l) : clipGeometry(f, t, r, l, u, 3 === g);
                        m.length && p.push({
                            geometry: m,
                            type: g,
                            tags: e[h].tags || null,
                            min: o.min,
                            max: o.max
                        })
                    }
                }
                return p.length ? p : null
            }

            function clipPoints(e, n, t, r) {
                for (var l = [], u = 0; u < e.length; u++) {
                    var i = e[u],
                        s = i[r];
                    s >= n && t >= s && l.push(i)
                }
                return l
            }

            function clipGeometry(e, n, t, r, l, u) {
                for (var i = [], s = 0; s < e.length; s++) {
                    var p, h, c, a = 0,
                        o = 0,
                        f = null,
                        g = e[s],
                        m = g.area,
                        v = g.dist,
                        w = g.length,
                        y = [];
                    for (h = 0; w - 1 > h; h++) p = f || g[h], f = g[h + 1], a = o || p[r], o = f[r], n > a ? o > t ? (y.push(l(p, f, n), l(p, f, t)), u || (y = newSlice(i, y, m, v))) : o >= n && y.push(l(p, f, n)) : a > t ? n > o ? (y.push(l(p, f, t), l(p, f, n)), u || (y = newSlice(i, y, m, v))) : t >= o && y.push(l(p, f, t)) : (y.push(p), n > o ? (y.push(l(p, f, n)), u || (y = newSlice(i, y, m, v))) : o > t && (y.push(l(p, f, t)), u || (y = newSlice(i, y, m, v))));
                    p = g[w - 1], a = p[r], a >= n && t >= a && y.push(p), c = y[y.length - 1], u && c && (y[0][0] !== c[0] || y[0][1] !== c[1]) && y.push(y[0]), newSlice(i, y, m, v)
                }
                return i
            }

            function newSlice(e, n, t, r) {
                return n.length && (n.area = t, n.dist = r, e.push(n)), []
            }
            module.exports = clip;
        }, {}],
        104: [function(require, module, exports) {
            "use strict";

            function convert(e, t) {
                var r = [];
                if ("FeatureCollection" === e.type)
                    for (var o = 0; o < e.features.length; o++) convertFeature(r, e.features[o], t);
                else "Feature" === e.type ? convertFeature(r, e, t) : convertFeature(r, {
                    geometry: e
                }, t);
                return r
            }

            function convertFeature(e, t, r) {
                var o, n, a, i = t.geometry,
                    c = i.type,
                    l = i.coordinates,
                    u = t.properties;
                if ("Point" === c) e.push(create(u, 1, [projectPoint(l)]));
                else if ("MultiPoint" === c) e.push(create(u, 1, project(l)));
                else if ("LineString" === c) e.push(create(u, 2, [project(l, r)]));
                else if ("MultiLineString" === c || "Polygon" === c) {
                    for (a = [], o = 0; o < l.length; o++) a.push(project(l[o], r));
                    e.push(create(u, "Polygon" === c ? 3 : 2, a))
                } else if ("MultiPolygon" === c) {
                    for (a = [], o = 0; o < l.length; o++)
                        for (n = 0; n < l[o].length; n++) a.push(project(l[o][n], r));
                    e.push(create(u, 3, a))
                } else {
                    if ("GeometryCollection" !== c) throw new Error("Input data is not a valid GeoJSON object.");
                    for (o = 0; o < i.geometries.length; o++) convertFeature(e, {
                        geometry: i.geometries[o],
                        properties: u
                    }, r)
                }
            }

            function create(e, t, r) {
                var o = {
                    geometry: r,
                    type: t,
                    tags: e || null,
                    min: [2, 1],
                    max: [-1, 0]
                };
                return calcBBox(o), o
            }

            function project(e, t) {
                for (var r = [], o = 0; o < e.length; o++) r.push(projectPoint(e[o]));
                return t && (simplify(r, t), calcSize(r)), r
            }

            function projectPoint(e) {
                var t = Math.sin(e[1] * Math.PI / 180),
                    r = e[0] / 360 + .5,
                    o = .5 - .25 * Math.log((1 + t) / (1 - t)) / Math.PI;
                return o = -1 > o ? -1 : o > 1 ? 1 : o, [r, o, 0]
            }

            function calcSize(e) {
                for (var t, r, o = 0, n = 0, a = 0; a < e.length - 1; a++) t = r || e[a], r = e[a + 1], o += t[0] * r[1] - r[0] * t[1], n += Math.abs(r[0] - t[0]) + Math.abs(r[1] - t[1]);
                e.area = Math.abs(o / 2), e.dist = n
            }

            function calcBBox(e) {
                var t = e.geometry,
                    r = e.min,
                    o = e.max;
                if (1 === e.type) calcRingBBox(r, o, t);
                else
                    for (var n = 0; n < t.length; n++) calcRingBBox(r, o, t[n]);
                return e
            }

            function calcRingBBox(e, t, r) {
                for (var o, n = 0; n < r.length; n++) o = r[n], e[0] = Math.min(o[0], e[0]), t[0] = Math.max(o[0], t[0]), e[1] = Math.min(o[1], e[1]), t[1] = Math.max(o[1], t[1])
            }
            module.exports = convert;
            var simplify = require("./simplify");
        }, {
            "./simplify": 106
        }],
        105: [function(require, module, exports) {
            "use strict";

            function geojsonvt(e, t) {
                return new GeoJSONVT(e, t)
            }

            function GeoJSONVT(e, t) {
                t = this.options = extend(Object.create(this.options), t);
                var i = t.debug;
                i && console.time("preprocess data");
                var o = 1 << t.maxZoom,
                    n = convert(e, t.tolerance / (o * t.extent));
                this.tiles = {}, this.tileCoords = [], i && (console.timeEnd("preprocess data"), console.log("index: maxZoom: %d, maxPoints: %d", t.indexMaxZoom, t.indexMaxPoints), console.time("generate tiles"), this.stats = {}, this.total = 0), n = wrap(n, t.buffer / t.extent, intersectX), n.length && this.splitTile(n, 0, 0, 0), i && (n.length && console.log("features: %d, points: %d", this.tiles[0].numFeatures, this.tiles[0].numPoints), console.timeEnd("generate tiles"), console.log("tiles generated:", this.total, JSON.stringify(this.stats)))
            }

            function toID(e, t, i) {
                return 32 * ((1 << e) * i + t) + e
            }

            function intersectX(e, t, i) {
                return [i, (i - e[0]) * (t[1] - e[1]) / (t[0] - e[0]) + e[1], 1]
            }

            function intersectY(e, t, i) {
                return [(i - e[1]) * (t[0] - e[0]) / (t[1] - e[1]) + e[0], i, 1]
            }

            function extend(e, t) {
                for (var i in t) e[i] = t[i];
                return e
            }

            function isClippedSquare(e, t, i) {
                var o = e.source;
                if (1 !== o.length) return !1;
                var n = o[0];
                if (3 !== n.type || n.geometry.length > 1) return !1;
                var r = n.geometry[0].length;
                if (5 !== r) return !1;
                for (var s = 0; r > s; s++) {
                    var l = transform.point(n.geometry[0][s], t, e.z2, e.x, e.y);
                    if (l[0] !== -i && l[0] !== t + i || l[1] !== -i && l[1] !== t + i) return !1
                }
                return !0
            }
            module.exports = geojsonvt;
            var convert = require("./convert"),
                transform = require("./transform"),
                clip = require("./clip"),
                wrap = require("./wrap"),
                createTile = require("./tile");
            GeoJSONVT.prototype.options = {
                maxZoom: 14,
                indexMaxZoom: 5,
                indexMaxPoints: 1e5,
                solidChildren: !1,
                tolerance: 3,
                extent: 4096,
                buffer: 64,
                debug: 0
            }, GeoJSONVT.prototype.splitTile = function(e, t, i, o, n, r, s) {
                for (var l = [e, t, i, o], a = this.options, u = a.debug, c = null; l.length;) {
                    o = l.pop(), i = l.pop(), t = l.pop(), e = l.pop();
                    var p = 1 << t,
                        d = toID(t, i, o),
                        m = this.tiles[d],
                        f = t === a.maxZoom ? 0 : a.tolerance / (p * a.extent);
                    if (!m && (u > 1 && console.time("creation"), m = this.tiles[d] = createTile(e, p, i, o, f, t === a.maxZoom), this.tileCoords.push({
                            z: t,
                            x: i,
                            y: o
                        }), u)) {
                        u > 1 && (console.log("tile z%d-%d-%d (features: %d, points: %d, simplified: %d)", t, i, o, m.numFeatures, m.numPoints, m.numSimplified), console.timeEnd("creation"));
                        var h = "z" + t;
                        this.stats[h] = (this.stats[h] || 0) + 1, this.total++
                    }
                    if (m.source = e, n) {
                        if (t === a.maxZoom || t === n) continue;
                        var x = 1 << n - t;
                        if (i !== Math.floor(r / x) || o !== Math.floor(s / x)) continue
                    } else if (t === a.indexMaxZoom || m.numPoints <= a.indexMaxPoints) continue;
                    if (a.solidChildren || !isClippedSquare(m, a.extent, a.buffer)) {
                        m.source = null, u > 1 && console.time("clipping");
                        var g, v, M, T, b, y, S = .5 * a.buffer / a.extent,
                            Z = .5 - S,
                            q = .5 + S,
                            w = 1 + S;
                        g = v = M = T = null, b = clip(e, p, i - S, i + q, 0, intersectX, m.min[0], m.max[0]), y = clip(e, p, i + Z, i + w, 0, intersectX, m.min[0], m.max[0]), b && (g = clip(b, p, o - S, o + q, 1, intersectY, m.min[1], m.max[1]), v = clip(b, p, o + Z, o + w, 1, intersectY, m.min[1], m.max[1])), y && (M = clip(y, p, o - S, o + q, 1, intersectY, m.min[1], m.max[1]), T = clip(y, p, o + Z, o + w, 1, intersectY, m.min[1], m.max[1])), u > 1 && console.timeEnd("clipping"), g && l.push(g, t + 1, 2 * i, 2 * o), v && l.push(v, t + 1, 2 * i, 2 * o + 1), M && l.push(M, t + 1, 2 * i + 1, 2 * o), T && l.push(T, t + 1, 2 * i + 1, 2 * o + 1)
                    } else n && (c = t)
                }
                return c
            }, GeoJSONVT.prototype.getTile = function(e, t, i) {
                var o = this.options,
                    n = o.extent,
                    r = o.debug,
                    s = 1 << e;
                t = (t % s + s) % s;
                var l = toID(e, t, i);
                if (this.tiles[l]) return transform.tile(this.tiles[l], n);
                r > 1 && console.log("drilling down to z%d-%d-%d", e, t, i);
                for (var a, u = e, c = t, p = i; !a && u > 0;) u--, c = Math.floor(c / 2), p = Math.floor(p / 2), a = this.tiles[toID(u, c, p)];
                if (!a || !a.source) return null;
                if (r > 1 && console.log("found parent tile z%d-%d-%d", u, c, p), isClippedSquare(a, n, o.buffer)) return transform.tile(a, n);
                r > 1 && console.time("drilling down");
                var d = this.splitTile(a.source, u, c, p, e, t, i);
                if (r > 1 && console.timeEnd("drilling down"), null !== d) {
                    var m = 1 << e - d;
                    l = toID(d, Math.floor(t / m), Math.floor(i / m))
                }
                return this.tiles[l] ? transform.tile(this.tiles[l], n) : null
            };
        }, {
            "./clip": 103,
            "./convert": 104,
            "./tile": 107,
            "./transform": 108,
            "./wrap": 109
        }],
        106: [function(require, module, exports) {
            "use strict";

            function simplify(t, i) {
                var e, p, r, s, o = i * i,
                    f = t.length,
                    u = 0,
                    n = f - 1,
                    g = [];
                for (t[u][2] = 1, t[n][2] = 1; n;) {
                    for (p = 0, e = u + 1; n > e; e++) r = getSqSegDist(t[e], t[u], t[n]), r > p && (s = e, p = r);
                    p > o ? (t[s][2] = p, g.push(u), g.push(s), u = s) : (n = g.pop(), u = g.pop())
                }
            }

            function getSqSegDist(t, i, e) {
                var p = i[0],
                    r = i[1],
                    s = e[0],
                    o = e[1],
                    f = t[0],
                    u = t[1],
                    n = s - p,
                    g = o - r;
                if (0 !== n || 0 !== g) {
                    var l = ((f - p) * n + (u - r) * g) / (n * n + g * g);
                    l > 1 ? (p = s, r = o) : l > 0 && (p += n * l, r += g * l)
                }
                return n = f - p, g = u - r, n * n + g * g
            }
            module.exports = simplify;
        }, {}],
        107: [function(require, module, exports) {
            "use strict";

            function createTile(e, n, t, m, i, u) {
                for (var r = {
                        features: [],
                        numPoints: 0,
                        numSimplified: 0,
                        numFeatures: 0,
                        source: null,
                        x: t,
                        y: m,
                        z2: n,
                        transformed: !1,
                        min: [2, 1],
                        max: [-1, 0]
                    }, a = 0; a < e.length; a++) {
                    r.numFeatures++, addFeature(r, e[a], i, u);
                    var s = e[a].min,
                        l = e[a].max;
                    s[0] < r.min[0] && (r.min[0] = s[0]), s[1] < r.min[1] && (r.min[1] = s[1]), l[0] > r.max[0] && (r.max[0] = l[0]), l[1] > r.max[1] && (r.max[1] = l[1])
                }
                return r
            }

            function addFeature(e, n, t, m) {
                var i, u, r, a, s = n.geometry,
                    l = n.type,
                    o = [],
                    f = t * t;
                if (1 === l)
                    for (i = 0; i < s.length; i++) o.push(s[i]), e.numPoints++, e.numSimplified++;
                else
                    for (i = 0; i < s.length; i++)
                        if (r = s[i], m || !(2 === l && r.dist < t || 3 === l && r.area < f)) {
                            var d = [];
                            for (u = 0; u < r.length; u++) a = r[u], (m || a[2] > f) && (d.push(a), e.numSimplified++), e.numPoints++;
                            o.push(d)
                        } else e.numPoints += r.length;
                o.length && e.features.push({
                    geometry: o,
                    type: l,
                    tags: n.tags || null
                })
            }
            module.exports = createTile;
        }, {}],
        108: [function(require, module, exports) {
            "use strict";

            function transformTile(r, t) {
                if (r.transformed) return r;
                var n, e, o, f = r.z2,
                    a = r.x,
                    s = r.y;
                for (n = 0; n < r.features.length; n++) {
                    var i = r.features[n],
                        u = i.geometry,
                        m = i.type;
                    if (1 === m)
                        for (e = 0; e < u.length; e++) u[e] = transformPoint(u[e], t, f, a, s);
                    else
                        for (e = 0; e < u.length; e++) {
                            var l = u[e];
                            for (o = 0; o < l.length; o++) l[o] = transformPoint(l[o], t, f, a, s)
                        }
                }
                return r.transformed = !0, r
            }

            function transformPoint(r, t, n, e, o) {
                var f = Math.round(t * (r[0] * n - e)),
                    a = Math.round(t * (r[1] * n - o));
                return [f, a]
            }
            exports.tile = transformTile, exports.point = transformPoint;
        }, {}],
        109: [function(require, module, exports) {
            "use strict";

            function wrap(r, t, e) {
                var o = r,
                    a = clip(r, 1, -1 - t, t, 0, e, -1, 2),
                    s = clip(r, 1, 1 - t, 2 + t, 0, e, -1, 2);
                return (a || s) && (o = clip(r, 1, -t, 1 + t, 0, e, -1, 2), a && (o = shiftFeatureCoords(a, 1).concat(o)), s && (o = o.concat(shiftFeatureCoords(s, -1)))), o
            }

            function shiftFeatureCoords(r, t) {
                for (var e = [], o = 0; o < r.length; o++) {
                    var a, s = r[o],
                        i = s.type;
                    if (1 === i) a = shiftCoords(s.geometry, t);
                    else {
                        a = [];
                        for (var n = 0; n < s.geometry.length; n++) a.push(shiftCoords(s.geometry[n], t))
                    }
                    e.push({
                        geometry: a,
                        type: i,
                        tags: s.tags,
                        min: [s.min[0] + t, s.min[1]],
                        max: [s.max[0] + t, s.max[1]]
                    })
                }
                return e
            }

            function shiftCoords(r, t) {
                var e = [];
                e.area = r.area, e.dist = r.dist;
                for (var o = 0; o < r.length; o++) e.push([r[o][0] + t, r[o][1], r[o][2]]);
                return e
            }
            var clip = require("./clip");
            module.exports = wrap;
        }, {
            "./clip": 103
        }],
        110: [function(require, module, exports) {
            exports.glMatrix = require("./gl-matrix/common.js"), exports.mat2 = require("./gl-matrix/mat2.js"), exports.mat2d = require("./gl-matrix/mat2d.js"), exports.mat3 = require("./gl-matrix/mat3.js"), exports.mat4 = require("./gl-matrix/mat4.js"), exports.quat = require("./gl-matrix/quat.js"), exports.vec2 = require("./gl-matrix/vec2.js"), exports.vec3 = require("./gl-matrix/vec3.js"), exports.vec4 = require("./gl-matrix/vec4.js");
        }, {
            "./gl-matrix/common.js": 111,
            "./gl-matrix/mat2.js": 112,
            "./gl-matrix/mat2d.js": 113,
            "./gl-matrix/mat3.js": 114,
            "./gl-matrix/mat4.js": 115,
            "./gl-matrix/quat.js": 116,
            "./gl-matrix/vec2.js": 117,
            "./gl-matrix/vec3.js": 118,
            "./gl-matrix/vec4.js": 119
        }],
        111: [function(require, module, exports) {
            var glMatrix = {};
            glMatrix.EPSILON = 1e-6, glMatrix.ARRAY_TYPE = "undefined" != typeof Float32Array ? Float32Array : Array, glMatrix.RANDOM = Math.random, glMatrix.setMatrixArrayType = function(r) {
                GLMAT_ARRAY_TYPE = r
            };
            var degree = Math.PI / 180;
            glMatrix.toRadian = function(r) {
                return r * degree
            }, module.exports = glMatrix;
        }, {}],
        112: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                mat2 = {};
            mat2.create = function() {
                var t = new glMatrix.ARRAY_TYPE(4);
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t
            }, mat2.clone = function(t) {
                var n = new glMatrix.ARRAY_TYPE(4);
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n
            }, mat2.copy = function(t, n) {
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t
            }, mat2.identity = function(t) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t
            }, mat2.transpose = function(t, n) {
                if (t === n) {
                    var r = n[1];
                    t[1] = n[2], t[2] = r
                } else t[0] = n[0], t[1] = n[2], t[2] = n[1], t[3] = n[3];
                return t
            }, mat2.invert = function(t, n) {
                var r = n[0],
                    a = n[1],
                    u = n[2],
                    o = n[3],
                    e = r * o - u * a;
                return e ? (e = 1 / e, t[0] = o * e, t[1] = -a * e, t[2] = -u * e, t[3] = r * e, t) : null
            }, mat2.adjoint = function(t, n) {
                var r = n[0];
                return t[0] = n[3], t[1] = -n[1], t[2] = -n[2], t[3] = r, t
            }, mat2.determinant = function(t) {
                return t[0] * t[3] - t[2] * t[1]
            }, mat2.multiply = function(t, n, r) {
                var a = n[0],
                    u = n[1],
                    o = n[2],
                    e = n[3],
                    i = r[0],
                    m = r[1],
                    c = r[2],
                    f = r[3];
                return t[0] = a * i + o * m, t[1] = u * i + e * m, t[2] = a * c + o * f, t[3] = u * c + e * f, t
            }, mat2.mul = mat2.multiply, mat2.rotate = function(t, n, r) {
                var a = n[0],
                    u = n[1],
                    o = n[2],
                    e = n[3],
                    i = Math.sin(r),
                    m = Math.cos(r);
                return t[0] = a * m + o * i, t[1] = u * m + e * i, t[2] = a * -i + o * m, t[3] = u * -i + e * m, t
            }, mat2.scale = function(t, n, r) {
                var a = n[0],
                    u = n[1],
                    o = n[2],
                    e = n[3],
                    i = r[0],
                    m = r[1];
                return t[0] = a * i, t[1] = u * i, t[2] = o * m, t[3] = e * m, t
            }, mat2.fromRotation = function(t, n) {
                var r = Math.sin(n),
                    a = Math.cos(n);
                return t[0] = a, t[1] = r, t[2] = -r, t[3] = a, t
            }, mat2.fromScaling = function(t, n) {
                return t[0] = n[0], t[1] = 0, t[2] = 0, t[3] = n[1], t
            }, mat2.str = function(t) {
                return "mat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
            }, mat2.frob = function(t) {
                return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2))
            }, mat2.LDU = function(t, n, r, a) {
                return t[2] = a[2] / a[0], r[0] = a[0], r[1] = a[1], r[3] = a[3] - t[2] * r[1], [t, n, r]
            }, module.exports = mat2;
        }, {
            "./common.js": 111
        }],
        113: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                mat2d = {};
            mat2d.create = function() {
                var t = new glMatrix.ARRAY_TYPE(6);
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t
            }, mat2d.clone = function(t) {
                var n = new glMatrix.ARRAY_TYPE(6);
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n
            }, mat2d.copy = function(t, n) {
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t
            }, mat2d.identity = function(t) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t
            }, mat2d.invert = function(t, n) {
                var r = n[0],
                    a = n[1],
                    o = n[2],
                    u = n[3],
                    e = n[4],
                    i = n[5],
                    m = r * u - a * o;
                return m ? (m = 1 / m, t[0] = u * m, t[1] = -a * m, t[2] = -o * m, t[3] = r * m, t[4] = (o * i - u * e) * m, t[5] = (a * e - r * i) * m, t) : null
            }, mat2d.determinant = function(t) {
                return t[0] * t[3] - t[1] * t[2]
            }, mat2d.multiply = function(t, n, r) {
                var a = n[0],
                    o = n[1],
                    u = n[2],
                    e = n[3],
                    i = n[4],
                    m = n[5],
                    c = r[0],
                    d = r[1],
                    f = r[2],
                    l = r[3],
                    M = r[4],
                    h = r[5];
                return t[0] = a * c + u * d, t[1] = o * c + e * d, t[2] = a * f + u * l, t[3] = o * f + e * l, t[4] = a * M + u * h + i, t[5] = o * M + e * h + m, t
            }, mat2d.mul = mat2d.multiply, mat2d.rotate = function(t, n, r) {
                var a = n[0],
                    o = n[1],
                    u = n[2],
                    e = n[3],
                    i = n[4],
                    m = n[5],
                    c = Math.sin(r),
                    d = Math.cos(r);
                return t[0] = a * d + u * c, t[1] = o * d + e * c, t[2] = a * -c + u * d, t[3] = o * -c + e * d, t[4] = i, t[5] = m, t
            }, mat2d.scale = function(t, n, r) {
                var a = n[0],
                    o = n[1],
                    u = n[2],
                    e = n[3],
                    i = n[4],
                    m = n[5],
                    c = r[0],
                    d = r[1];
                return t[0] = a * c, t[1] = o * c, t[2] = u * d, t[3] = e * d, t[4] = i, t[5] = m, t
            }, mat2d.translate = function(t, n, r) {
                var a = n[0],
                    o = n[1],
                    u = n[2],
                    e = n[3],
                    i = n[4],
                    m = n[5],
                    c = r[0],
                    d = r[1];
                return t[0] = a, t[1] = o, t[2] = u, t[3] = e, t[4] = a * c + u * d + i, t[5] = o * c + e * d + m, t
            }, mat2d.fromRotation = function(t, n) {
                var r = Math.sin(n),
                    a = Math.cos(n);
                return t[0] = a, t[1] = r, t[2] = -r, t[3] = a, t[4] = 0, t[5] = 0, t
            }, mat2d.fromScaling = function(t, n) {
                return t[0] = n[0], t[1] = 0, t[2] = 0, t[3] = n[1], t[4] = 0, t[5] = 0, t
            }, mat2d.fromTranslation = function(t, n) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = n[0], t[5] = n[1], t
            }, mat2d.str = function(t) {
                return "mat2d(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ")"
            }, mat2d.frob = function(t) {
                return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + 1)
            }, module.exports = mat2d;
        }, {
            "./common.js": 111
        }],
        114: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                mat3 = {};
            mat3.create = function() {
                var t = new glMatrix.ARRAY_TYPE(9);
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
            }, mat3.fromMat4 = function(t, n) {
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[4], t[4] = n[5], t[5] = n[6], t[6] = n[8], t[7] = n[9], t[8] = n[10], t
            }, mat3.clone = function(t) {
                var n = new glMatrix.ARRAY_TYPE(9);
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n[6] = t[6], n[7] = t[7], n[8] = t[8], n
            }, mat3.copy = function(t, n) {
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t
            }, mat3.identity = function(t) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
            }, mat3.transpose = function(t, n) {
                if (t === n) {
                    var r = n[1],
                        a = n[2],
                        o = n[5];
                    t[1] = n[3], t[2] = n[6], t[3] = r, t[5] = n[7], t[6] = a, t[7] = o
                } else t[0] = n[0], t[1] = n[3], t[2] = n[6], t[3] = n[1], t[4] = n[4], t[5] = n[7], t[6] = n[2], t[7] = n[5], t[8] = n[8];
                return t
            }, mat3.invert = function(t, n) {
                var r = n[0],
                    a = n[1],
                    o = n[2],
                    u = n[3],
                    m = n[4],
                    e = n[5],
                    i = n[6],
                    c = n[7],
                    f = n[8],
                    l = f * m - e * c,
                    M = -f * u + e * i,
                    v = c * u - m * i,
                    h = r * l + a * M + o * v;
                return h ? (h = 1 / h, t[0] = l * h, t[1] = (-f * a + o * c) * h, t[2] = (e * a - o * m) * h, t[3] = M * h, t[4] = (f * r - o * i) * h, t[5] = (-e * r + o * u) * h, t[6] = v * h, t[7] = (-c * r + a * i) * h, t[8] = (m * r - a * u) * h, t) : null
            }, mat3.adjoint = function(t, n) {
                var r = n[0],
                    a = n[1],
                    o = n[2],
                    u = n[3],
                    m = n[4],
                    e = n[5],
                    i = n[6],
                    c = n[7],
                    f = n[8];
                return t[0] = m * f - e * c, t[1] = o * c - a * f, t[2] = a * e - o * m, t[3] = e * i - u * f, t[4] = r * f - o * i, t[5] = o * u - r * e, t[6] = u * c - m * i, t[7] = a * i - r * c, t[8] = r * m - a * u, t
            }, mat3.determinant = function(t) {
                var n = t[0],
                    r = t[1],
                    a = t[2],
                    o = t[3],
                    u = t[4],
                    m = t[5],
                    e = t[6],
                    i = t[7],
                    c = t[8];
                return n * (c * u - m * i) + r * (-c * o + m * e) + a * (i * o - u * e)
            }, mat3.multiply = function(t, n, r) {
                var a = n[0],
                    o = n[1],
                    u = n[2],
                    m = n[3],
                    e = n[4],
                    i = n[5],
                    c = n[6],
                    f = n[7],
                    l = n[8],
                    M = r[0],
                    v = r[1],
                    h = r[2],
                    p = r[3],
                    s = r[4],
                    w = r[5],
                    d = r[6],
                    R = r[7],
                    g = r[8];
                return t[0] = M * a + v * m + h * c, t[1] = M * o + v * e + h * f, t[2] = M * u + v * i + h * l, t[3] = p * a + s * m + w * c, t[4] = p * o + s * e + w * f, t[5] = p * u + s * i + w * l, t[6] = d * a + R * m + g * c, t[7] = d * o + R * e + g * f, t[8] = d * u + R * i + g * l, t
            }, mat3.mul = mat3.multiply, mat3.translate = function(t, n, r) {
                var a = n[0],
                    o = n[1],
                    u = n[2],
                    m = n[3],
                    e = n[4],
                    i = n[5],
                    c = n[6],
                    f = n[7],
                    l = n[8],
                    M = r[0],
                    v = r[1];
                return t[0] = a, t[1] = o, t[2] = u, t[3] = m, t[4] = e, t[5] = i, t[6] = M * a + v * m + c, t[7] = M * o + v * e + f, t[8] = M * u + v * i + l, t
            }, mat3.rotate = function(t, n, r) {
                var a = n[0],
                    o = n[1],
                    u = n[2],
                    m = n[3],
                    e = n[4],
                    i = n[5],
                    c = n[6],
                    f = n[7],
                    l = n[8],
                    M = Math.sin(r),
                    v = Math.cos(r);
                return t[0] = v * a + M * m, t[1] = v * o + M * e, t[2] = v * u + M * i, t[3] = v * m - M * a, t[4] = v * e - M * o, t[5] = v * i - M * u, t[6] = c, t[7] = f, t[8] = l, t
            }, mat3.scale = function(t, n, r) {
                var a = r[0],
                    o = r[1];
                return t[0] = a * n[0], t[1] = a * n[1], t[2] = a * n[2], t[3] = o * n[3], t[4] = o * n[4], t[5] = o * n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t
            }, mat3.fromTranslation = function(t, n) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = n[0], t[7] = n[1], t[8] = 1, t
            }, mat3.fromRotation = function(t, n) {
                var r = Math.sin(n),
                    a = Math.cos(n);
                return t[0] = a, t[1] = r, t[2] = 0, t[3] = -r, t[4] = a, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
            }, mat3.fromScaling = function(t, n) {
                return t[0] = n[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = n[1], t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
            }, mat3.fromMat2d = function(t, n) {
                return t[0] = n[0], t[1] = n[1], t[2] = 0, t[3] = n[2], t[4] = n[3], t[5] = 0, t[6] = n[4], t[7] = n[5], t[8] = 1, t
            }, mat3.fromQuat = function(t, n) {
                var r = n[0],
                    a = n[1],
                    o = n[2],
                    u = n[3],
                    m = r + r,
                    e = a + a,
                    i = o + o,
                    c = r * m,
                    f = a * m,
                    l = a * e,
                    M = o * m,
                    v = o * e,
                    h = o * i,
                    p = u * m,
                    s = u * e,
                    w = u * i;
                return t[0] = 1 - l - h, t[3] = f - w, t[6] = M + s, t[1] = f + w, t[4] = 1 - c - h, t[7] = v - p, t[2] = M - s, t[5] = v + p, t[8] = 1 - c - l, t
            }, mat3.normalFromMat4 = function(t, n) {
                var r = n[0],
                    a = n[1],
                    o = n[2],
                    u = n[3],
                    m = n[4],
                    e = n[5],
                    i = n[6],
                    c = n[7],
                    f = n[8],
                    l = n[9],
                    M = n[10],
                    v = n[11],
                    h = n[12],
                    p = n[13],
                    s = n[14],
                    w = n[15],
                    d = r * e - a * m,
                    R = r * i - o * m,
                    g = r * c - u * m,
                    x = a * i - o * e,
                    y = a * c - u * e,
                    A = o * c - u * i,
                    Y = f * p - l * h,
                    T = f * s - M * h,
                    j = f * w - v * h,
                    q = l * s - M * p,
                    E = l * w - v * p,
                    P = M * w - v * s,
                    _ = d * P - R * E + g * q + x * j - y * T + A * Y;
                return _ ? (_ = 1 / _, t[0] = (e * P - i * E + c * q) * _, t[1] = (i * j - m * P - c * T) * _, t[2] = (m * E - e * j + c * Y) * _, t[3] = (o * E - a * P - u * q) * _, t[4] = (r * P - o * j + u * T) * _, t[5] = (a * j - r * E - u * Y) * _, t[6] = (p * A - s * y + w * x) * _, t[7] = (s * g - h * A - w * R) * _, t[8] = (h * y - p * g + w * d) * _, t) : null
            }, mat3.str = function(t) {
                return "mat3(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ")"
            }, mat3.frob = function(t) {
                return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2))
            }, module.exports = mat3;
        }, {
            "./common.js": 111
        }],
        115: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                mat4 = {};
            mat4.create = function() {
                var t = new glMatrix.ARRAY_TYPE(16);
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
            }, mat4.clone = function(t) {
                var a = new glMatrix.ARRAY_TYPE(16);
                return a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a[4] = t[4], a[5] = t[5], a[6] = t[6], a[7] = t[7], a[8] = t[8], a[9] = t[9], a[10] = t[10], a[11] = t[11], a[12] = t[12], a[13] = t[13], a[14] = t[14], a[15] = t[15], a
            }, mat4.copy = function(t, a) {
                return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[4] = a[4], t[5] = a[5], t[6] = a[6], t[7] = a[7], t[8] = a[8], t[9] = a[9], t[10] = a[10], t[11] = a[11], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15], t
            }, mat4.identity = function(t) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
            }, mat4.transpose = function(t, a) {
                if (t === a) {
                    var r = a[1],
                        n = a[2],
                        o = a[3],
                        e = a[6],
                        i = a[7],
                        u = a[11];
                    t[1] = a[4], t[2] = a[8], t[3] = a[12], t[4] = r, t[6] = a[9], t[7] = a[13], t[8] = n, t[9] = e, t[11] = a[14], t[12] = o, t[13] = i, t[14] = u
                } else t[0] = a[0], t[1] = a[4], t[2] = a[8], t[3] = a[12], t[4] = a[1], t[5] = a[5], t[6] = a[9], t[7] = a[13], t[8] = a[2], t[9] = a[6], t[10] = a[10], t[11] = a[14], t[12] = a[3], t[13] = a[7], t[14] = a[11], t[15] = a[15];
                return t
            }, mat4.invert = function(t, a) {
                var r = a[0],
                    n = a[1],
                    o = a[2],
                    e = a[3],
                    i = a[4],
                    u = a[5],
                    M = a[6],
                    m = a[7],
                    h = a[8],
                    c = a[9],
                    f = a[10],
                    s = a[11],
                    l = a[12],
                    v = a[13],
                    p = a[14],
                    w = a[15],
                    g = r * u - n * i,
                    P = r * M - o * i,
                    R = r * m - e * i,
                    x = n * M - o * u,
                    I = n * m - e * u,
                    S = o * m - e * M,
                    d = h * v - c * l,
                    q = h * p - f * l,
                    E = h * w - s * l,
                    O = c * p - f * v,
                    b = c * w - s * v,
                    T = f * w - s * p,
                    Y = g * T - P * b + R * O + x * E - I * q + S * d;
                return Y ? (Y = 1 / Y, t[0] = (u * T - M * b + m * O) * Y, t[1] = (o * b - n * T - e * O) * Y, t[2] = (v * S - p * I + w * x) * Y, t[3] = (f * I - c * S - s * x) * Y, t[4] = (M * E - i * T - m * q) * Y, t[5] = (r * T - o * E + e * q) * Y, t[6] = (p * R - l * S - w * P) * Y, t[7] = (h * S - f * R + s * P) * Y, t[8] = (i * b - u * E + m * d) * Y, t[9] = (n * E - r * b - e * d) * Y, t[10] = (l * I - v * R + w * g) * Y, t[11] = (c * R - h * I - s * g) * Y, t[12] = (u * q - i * O - M * d) * Y, t[13] = (r * O - n * q + o * d) * Y, t[14] = (v * P - l * x - p * g) * Y, t[15] = (h * x - c * P + f * g) * Y, t) : null
            }, mat4.adjoint = function(t, a) {
                var r = a[0],
                    n = a[1],
                    o = a[2],
                    e = a[3],
                    i = a[4],
                    u = a[5],
                    M = a[6],
                    m = a[7],
                    h = a[8],
                    c = a[9],
                    f = a[10],
                    s = a[11],
                    l = a[12],
                    v = a[13],
                    p = a[14],
                    w = a[15];
                return t[0] = u * (f * w - s * p) - c * (M * w - m * p) + v * (M * s - m * f), t[1] = -(n * (f * w - s * p) - c * (o * w - e * p) + v * (o * s - e * f)), t[2] = n * (M * w - m * p) - u * (o * w - e * p) + v * (o * m - e * M), t[3] = -(n * (M * s - m * f) - u * (o * s - e * f) + c * (o * m - e * M)), t[4] = -(i * (f * w - s * p) - h * (M * w - m * p) + l * (M * s - m * f)), t[5] = r * (f * w - s * p) - h * (o * w - e * p) + l * (o * s - e * f), t[6] = -(r * (M * w - m * p) - i * (o * w - e * p) + l * (o * m - e * M)), t[7] = r * (M * s - m * f) - i * (o * s - e * f) + h * (o * m - e * M), t[8] = i * (c * w - s * v) - h * (u * w - m * v) + l * (u * s - m * c), t[9] = -(r * (c * w - s * v) - h * (n * w - e * v) + l * (n * s - e * c)), t[10] = r * (u * w - m * v) - i * (n * w - e * v) + l * (n * m - e * u), t[11] = -(r * (u * s - m * c) - i * (n * s - e * c) + h * (n * m - e * u)), t[12] = -(i * (c * p - f * v) - h * (u * p - M * v) + l * (u * f - M * c)), t[13] = r * (c * p - f * v) - h * (n * p - o * v) + l * (n * f - o * c), t[14] = -(r * (u * p - M * v) - i * (n * p - o * v) + l * (n * M - o * u)), t[15] = r * (u * f - M * c) - i * (n * f - o * c) + h * (n * M - o * u), t
            }, mat4.determinant = function(t) {
                var a = t[0],
                    r = t[1],
                    n = t[2],
                    o = t[3],
                    e = t[4],
                    i = t[5],
                    u = t[6],
                    M = t[7],
                    m = t[8],
                    h = t[9],
                    c = t[10],
                    f = t[11],
                    s = t[12],
                    l = t[13],
                    v = t[14],
                    p = t[15],
                    w = a * i - r * e,
                    g = a * u - n * e,
                    P = a * M - o * e,
                    R = r * u - n * i,
                    x = r * M - o * i,
                    I = n * M - o * u,
                    S = m * l - h * s,
                    d = m * v - c * s,
                    q = m * p - f * s,
                    E = h * v - c * l,
                    O = h * p - f * l,
                    b = c * p - f * v;
                return w * b - g * O + P * E + R * q - x * d + I * S
            }, mat4.multiply = function(t, a, r) {
                var n = a[0],
                    o = a[1],
                    e = a[2],
                    i = a[3],
                    u = a[4],
                    M = a[5],
                    m = a[6],
                    h = a[7],
                    c = a[8],
                    f = a[9],
                    s = a[10],
                    l = a[11],
                    v = a[12],
                    p = a[13],
                    w = a[14],
                    g = a[15],
                    P = r[0],
                    R = r[1],
                    x = r[2],
                    I = r[3];
                return t[0] = P * n + R * u + x * c + I * v, t[1] = P * o + R * M + x * f + I * p, t[2] = P * e + R * m + x * s + I * w, t[3] = P * i + R * h + x * l + I * g, P = r[4], R = r[5], x = r[6], I = r[7], t[4] = P * n + R * u + x * c + I * v, t[5] = P * o + R * M + x * f + I * p, t[6] = P * e + R * m + x * s + I * w, t[7] = P * i + R * h + x * l + I * g, P = r[8], R = r[9], x = r[10], I = r[11], t[8] = P * n + R * u + x * c + I * v, t[9] = P * o + R * M + x * f + I * p, t[10] = P * e + R * m + x * s + I * w, t[11] = P * i + R * h + x * l + I * g, P = r[12], R = r[13], x = r[14], I = r[15], t[12] = P * n + R * u + x * c + I * v, t[13] = P * o + R * M + x * f + I * p, t[14] = P * e + R * m + x * s + I * w, t[15] = P * i + R * h + x * l + I * g, t
            }, mat4.mul = mat4.multiply, mat4.translate = function(t, a, r) {
                var n, o, e, i, u, M, m, h, c, f, s, l, v = r[0],
                    p = r[1],
                    w = r[2];
                return a === t ? (t[12] = a[0] * v + a[4] * p + a[8] * w + a[12], t[13] = a[1] * v + a[5] * p + a[9] * w + a[13], t[14] = a[2] * v + a[6] * p + a[10] * w + a[14], t[15] = a[3] * v + a[7] * p + a[11] * w + a[15]) : (n = a[0], o = a[1], e = a[2], i = a[3], u = a[4], M = a[5], m = a[6], h = a[7], c = a[8], f = a[9], s = a[10], l = a[11], t[0] = n, t[1] = o, t[2] = e, t[3] = i, t[4] = u, t[5] = M, t[6] = m, t[7] = h, t[8] = c, t[9] = f, t[10] = s, t[11] = l, t[12] = n * v + u * p + c * w + a[12], t[13] = o * v + M * p + f * w + a[13], t[14] = e * v + m * p + s * w + a[14], t[15] = i * v + h * p + l * w + a[15]), t
            }, mat4.scale = function(t, a, r) {
                var n = r[0],
                    o = r[1],
                    e = r[2];
                return t[0] = a[0] * n, t[1] = a[1] * n, t[2] = a[2] * n, t[3] = a[3] * n, t[4] = a[4] * o, t[5] = a[5] * o, t[6] = a[6] * o, t[7] = a[7] * o, t[8] = a[8] * e, t[9] = a[9] * e, t[10] = a[10] * e, t[11] = a[11] * e, t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15], t
            }, mat4.rotate = function(t, a, r, n) {
                var o, e, i, u, M, m, h, c, f, s, l, v, p, w, g, P, R, x, I, S, d, q, E, O, b = n[0],
                    T = n[1],
                    Y = n[2],
                    y = Math.sqrt(b * b + T * T + Y * Y);
                return Math.abs(y) < glMatrix.EPSILON ? null : (y = 1 / y, b *= y, T *= y, Y *= y, o = Math.sin(r), e = Math.cos(r), i = 1 - e, u = a[0], M = a[1], m = a[2], h = a[3], c = a[4], f = a[5], s = a[6], l = a[7], v = a[8], p = a[9], w = a[10], g = a[11], P = b * b * i + e, R = T * b * i + Y * o, x = Y * b * i - T * o, I = b * T * i - Y * o, S = T * T * i + e, d = Y * T * i + b * o, q = b * Y * i + T * o, E = T * Y * i - b * o, O = Y * Y * i + e, t[0] = u * P + c * R + v * x, t[1] = M * P + f * R + p * x, t[2] = m * P + s * R + w * x, t[3] = h * P + l * R + g * x, t[4] = u * I + c * S + v * d, t[5] = M * I + f * S + p * d, t[6] = m * I + s * S + w * d, t[7] = h * I + l * S + g * d, t[8] = u * q + c * E + v * O, t[9] = M * q + f * E + p * O, t[10] = m * q + s * E + w * O, t[11] = h * q + l * E + g * O, a !== t && (t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t)
            }, mat4.rotateX = function(t, a, r) {
                var n = Math.sin(r),
                    o = Math.cos(r),
                    e = a[4],
                    i = a[5],
                    u = a[6],
                    M = a[7],
                    m = a[8],
                    h = a[9],
                    c = a[10],
                    f = a[11];
                return a !== t && (t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t[4] = e * o + m * n, t[5] = i * o + h * n, t[6] = u * o + c * n, t[7] = M * o + f * n, t[8] = m * o - e * n, t[9] = h * o - i * n, t[10] = c * o - u * n, t[11] = f * o - M * n, t
            }, mat4.rotateY = function(t, a, r) {
                var n = Math.sin(r),
                    o = Math.cos(r),
                    e = a[0],
                    i = a[1],
                    u = a[2],
                    M = a[3],
                    m = a[8],
                    h = a[9],
                    c = a[10],
                    f = a[11];
                return a !== t && (t[4] = a[4], t[5] = a[5], t[6] = a[6], t[7] = a[7], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t[0] = e * o - m * n, t[1] = i * o - h * n, t[2] = u * o - c * n, t[3] = M * o - f * n, t[8] = e * n + m * o, t[9] = i * n + h * o, t[10] = u * n + c * o, t[11] = M * n + f * o, t
            }, mat4.rotateZ = function(t, a, r) {
                var n = Math.sin(r),
                    o = Math.cos(r),
                    e = a[0],
                    i = a[1],
                    u = a[2],
                    M = a[3],
                    m = a[4],
                    h = a[5],
                    c = a[6],
                    f = a[7];
                return a !== t && (t[8] = a[8], t[9] = a[9], t[10] = a[10], t[11] = a[11], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t[0] = e * o + m * n, t[1] = i * o + h * n, t[2] = u * o + c * n, t[3] = M * o + f * n, t[4] = m * o - e * n, t[5] = h * o - i * n, t[6] = c * o - u * n, t[7] = f * o - M * n, t
            }, mat4.fromTranslation = function(t, a) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = a[0], t[13] = a[1], t[14] = a[2], t[15] = 1, t
            }, mat4.fromScaling = function(t, a) {
                return t[0] = a[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = a[1], t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = a[2], t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
            }, mat4.fromRotation = function(t, a, r) {
                var n, o, e, i = r[0],
                    u = r[1],
                    M = r[2],
                    m = Math.sqrt(i * i + u * u + M * M);
                return Math.abs(m) < glMatrix.EPSILON ? null : (m = 1 / m, i *= m, u *= m, M *= m, n = Math.sin(a), o = Math.cos(a), e = 1 - o, t[0] = i * i * e + o, t[1] = u * i * e + M * n, t[2] = M * i * e - u * n, t[3] = 0, t[4] = i * u * e - M * n, t[5] = u * u * e + o, t[6] = M * u * e + i * n, t[7] = 0, t[8] = i * M * e + u * n, t[9] = u * M * e - i * n, t[10] = M * M * e + o, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t)
            }, mat4.fromXRotation = function(t, a) {
                var r = Math.sin(a),
                    n = Math.cos(a);
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = n, t[6] = r, t[7] = 0, t[8] = 0, t[9] = -r, t[10] = n, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
            }, mat4.fromYRotation = function(t, a) {
                var r = Math.sin(a),
                    n = Math.cos(a);
                return t[0] = n, t[1] = 0, t[2] = -r, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = r, t[9] = 0, t[10] = n, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
            }, mat4.fromZRotation = function(t, a) {
                var r = Math.sin(a),
                    n = Math.cos(a);
                return t[0] = n, t[1] = r, t[2] = 0, t[3] = 0, t[4] = -r, t[5] = n, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
            }, mat4.fromRotationTranslation = function(t, a, r) {
                var n = a[0],
                    o = a[1],
                    e = a[2],
                    i = a[3],
                    u = n + n,
                    M = o + o,
                    m = e + e,
                    h = n * u,
                    c = n * M,
                    f = n * m,
                    s = o * M,
                    l = o * m,
                    v = e * m,
                    p = i * u,
                    w = i * M,
                    g = i * m;
                return t[0] = 1 - (s + v), t[1] = c + g, t[2] = f - w, t[3] = 0, t[4] = c - g, t[5] = 1 - (h + v), t[6] = l + p, t[7] = 0, t[8] = f + w, t[9] = l - p, t[10] = 1 - (h + s), t[11] = 0, t[12] = r[0], t[13] = r[1], t[14] = r[2], t[15] = 1, t
            }, mat4.fromRotationTranslationScale = function(t, a, r, n) {
                var o = a[0],
                    e = a[1],
                    i = a[2],
                    u = a[3],
                    M = o + o,
                    m = e + e,
                    h = i + i,
                    c = o * M,
                    f = o * m,
                    s = o * h,
                    l = e * m,
                    v = e * h,
                    p = i * h,
                    w = u * M,
                    g = u * m,
                    P = u * h,
                    R = n[0],
                    x = n[1],
                    I = n[2];
                return t[0] = (1 - (l + p)) * R, t[1] = (f + P) * R, t[2] = (s - g) * R, t[3] = 0, t[4] = (f - P) * x, t[5] = (1 - (c + p)) * x, t[6] = (v + w) * x, t[7] = 0, t[8] = (s + g) * I, t[9] = (v - w) * I, t[10] = (1 - (c + l)) * I, t[11] = 0, t[12] = r[0], t[13] = r[1], t[14] = r[2], t[15] = 1, t
            }, mat4.fromRotationTranslationScaleOrigin = function(t, a, r, n, o) {
                var e = a[0],
                    i = a[1],
                    u = a[2],
                    M = a[3],
                    m = e + e,
                    h = i + i,
                    c = u + u,
                    f = e * m,
                    s = e * h,
                    l = e * c,
                    v = i * h,
                    p = i * c,
                    w = u * c,
                    g = M * m,
                    P = M * h,
                    R = M * c,
                    x = n[0],
                    I = n[1],
                    S = n[2],
                    d = o[0],
                    q = o[1],
                    E = o[2];
                return t[0] = (1 - (v + w)) * x, t[1] = (s + R) * x, t[2] = (l - P) * x, t[3] = 0, t[4] = (s - R) * I, t[5] = (1 - (f + w)) * I, t[6] = (p + g) * I, t[7] = 0, t[8] = (l + P) * S, t[9] = (p - g) * S, t[10] = (1 - (f + v)) * S, t[11] = 0, t[12] = r[0] + d - (t[0] * d + t[4] * q + t[8] * E), t[13] = r[1] + q - (t[1] * d + t[5] * q + t[9] * E), t[14] = r[2] + E - (t[2] * d + t[6] * q + t[10] * E), t[15] = 1, t
            }, mat4.fromQuat = function(t, a) {
                var r = a[0],
                    n = a[1],
                    o = a[2],
                    e = a[3],
                    i = r + r,
                    u = n + n,
                    M = o + o,
                    m = r * i,
                    h = n * i,
                    c = n * u,
                    f = o * i,
                    s = o * u,
                    l = o * M,
                    v = e * i,
                    p = e * u,
                    w = e * M;
                return t[0] = 1 - c - l, t[1] = h + w, t[2] = f - p, t[3] = 0, t[4] = h - w, t[5] = 1 - m - l, t[6] = s + v, t[7] = 0, t[8] = f + p, t[9] = s - v, t[10] = 1 - m - c, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
            }, mat4.frustum = function(t, a, r, n, o, e, i) {
                var u = 1 / (r - a),
                    M = 1 / (o - n),
                    m = 1 / (e - i);
                return t[0] = 2 * e * u, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 2 * e * M, t[6] = 0, t[7] = 0, t[8] = (r + a) * u, t[9] = (o + n) * M, t[10] = (i + e) * m, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = i * e * 2 * m, t[15] = 0, t
            }, mat4.perspective = function(t, a, r, n, o) {
                var e = 1 / Math.tan(a / 2),
                    i = 1 / (n - o);
                return t[0] = e / r, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = e, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = (o + n) * i, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = 2 * o * n * i, t[15] = 0, t
            }, mat4.perspectiveFromFieldOfView = function(t, a, r, n) {
                var o = Math.tan(a.upDegrees * Math.PI / 180),
                    e = Math.tan(a.downDegrees * Math.PI / 180),
                    i = Math.tan(a.leftDegrees * Math.PI / 180),
                    u = Math.tan(a.rightDegrees * Math.PI / 180),
                    M = 2 / (i + u),
                    m = 2 / (o + e);
                return t[0] = M, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = m, t[6] = 0, t[7] = 0, t[8] = -((i - u) * M * .5), t[9] = (o - e) * m * .5, t[10] = n / (r - n), t[11] = -1, t[12] = 0, t[13] = 0, t[14] = n * r / (r - n), t[15] = 0, t
            }, mat4.ortho = function(t, a, r, n, o, e, i) {
                var u = 1 / (a - r),
                    M = 1 / (n - o),
                    m = 1 / (e - i);
                return t[0] = -2 * u, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = -2 * M, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 2 * m, t[11] = 0, t[12] = (a + r) * u, t[13] = (o + n) * M, t[14] = (i + e) * m, t[15] = 1, t
            }, mat4.lookAt = function(t, a, r, n) {
                var o, e, i, u, M, m, h, c, f, s, l = a[0],
                    v = a[1],
                    p = a[2],
                    w = n[0],
                    g = n[1],
                    P = n[2],
                    R = r[0],
                    x = r[1],
                    I = r[2];
                return Math.abs(l - R) < glMatrix.EPSILON && Math.abs(v - x) < glMatrix.EPSILON && Math.abs(p - I) < glMatrix.EPSILON ? mat4.identity(t) : (h = l - R, c = v - x, f = p - I, s = 1 / Math.sqrt(h * h + c * c + f * f), h *= s, c *= s, f *= s, o = g * f - P * c, e = P * h - w * f, i = w * c - g * h, s = Math.sqrt(o * o + e * e + i * i), s ? (s = 1 / s, o *= s, e *= s, i *= s) : (o = 0, e = 0, i = 0), u = c * i - f * e, M = f * o - h * i, m = h * e - c * o, s = Math.sqrt(u * u + M * M + m * m), s ? (s = 1 / s, u *= s, M *= s, m *= s) : (u = 0, M = 0, m = 0), t[0] = o, t[1] = u, t[2] = h, t[3] = 0, t[4] = e, t[5] = M, t[6] = c, t[7] = 0, t[8] = i, t[9] = m, t[10] = f, t[11] = 0, t[12] = -(o * l + e * v + i * p), t[13] = -(u * l + M * v + m * p), t[14] = -(h * l + c * v + f * p), t[15] = 1, t)
            }, mat4.str = function(t) {
                return "mat4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + ", " + t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + ")"
            }, mat4.frob = function(t) {
                return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2) + Math.pow(t[9], 2) + Math.pow(t[10], 2) + Math.pow(t[11], 2) + Math.pow(t[12], 2) + Math.pow(t[13], 2) + Math.pow(t[14], 2) + Math.pow(t[15], 2))
            }, module.exports = mat4;
        }, {
            "./common.js": 111
        }],
        116: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                mat3 = require("./mat3.js"),
                vec3 = require("./vec3.js"),
                vec4 = require("./vec4.js"),
                quat = {};
            quat.create = function() {
                var t = new glMatrix.ARRAY_TYPE(4);
                return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t
            }, quat.rotationTo = function() {
                var t = vec3.create(),
                    a = vec3.fromValues(1, 0, 0),
                    e = vec3.fromValues(0, 1, 0);
                return function(r, u, n) {
                    var c = vec3.dot(u, n);
                    return -.999999 > c ? (vec3.cross(t, a, u), vec3.length(t) < 1e-6 && vec3.cross(t, e, u), vec3.normalize(t, t), quat.setAxisAngle(r, t, Math.PI), r) : c > .999999 ? (r[0] = 0, r[1] = 0, r[2] = 0, r[3] = 1, r) : (vec3.cross(t, u, n), r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = 1 + c, quat.normalize(r, r))
                }
            }(), quat.setAxes = function() {
                var t = mat3.create();
                return function(a, e, r, u) {
                    return t[0] = r[0], t[3] = r[1], t[6] = r[2], t[1] = u[0], t[4] = u[1], t[7] = u[2], t[2] = -e[0], t[5] = -e[1], t[8] = -e[2], quat.normalize(a, quat.fromMat3(a, t))
                }
            }(), quat.clone = vec4.clone, quat.fromValues = vec4.fromValues, quat.copy = vec4.copy, quat.set = vec4.set, quat.identity = function(t) {
                return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t
            }, quat.setAxisAngle = function(t, a, e) {
                e = .5 * e;
                var r = Math.sin(e);
                return t[0] = r * a[0], t[1] = r * a[1], t[2] = r * a[2], t[3] = Math.cos(e), t
            }, quat.add = vec4.add, quat.multiply = function(t, a, e) {
                var r = a[0],
                    u = a[1],
                    n = a[2],
                    c = a[3],
                    q = e[0],
                    o = e[1],
                    s = e[2],
                    i = e[3];
                return t[0] = r * i + c * q + u * s - n * o, t[1] = u * i + c * o + n * q - r * s, t[2] = n * i + c * s + r * o - u * q, t[3] = c * i - r * q - u * o - n * s, t
            }, quat.mul = quat.multiply, quat.scale = vec4.scale, quat.rotateX = function(t, a, e) {
                e *= .5;
                var r = a[0],
                    u = a[1],
                    n = a[2],
                    c = a[3],
                    q = Math.sin(e),
                    o = Math.cos(e);
                return t[0] = r * o + c * q, t[1] = u * o + n * q, t[2] = n * o - u * q, t[3] = c * o - r * q, t
            }, quat.rotateY = function(t, a, e) {
                e *= .5;
                var r = a[0],
                    u = a[1],
                    n = a[2],
                    c = a[3],
                    q = Math.sin(e),
                    o = Math.cos(e);
                return t[0] = r * o - n * q, t[1] = u * o + c * q, t[2] = n * o + r * q, t[3] = c * o - u * q, t
            }, quat.rotateZ = function(t, a, e) {
                e *= .5;
                var r = a[0],
                    u = a[1],
                    n = a[2],
                    c = a[3],
                    q = Math.sin(e),
                    o = Math.cos(e);
                return t[0] = r * o + u * q, t[1] = u * o - r * q, t[2] = n * o + c * q, t[3] = c * o - n * q, t
            }, quat.calculateW = function(t, a) {
                var e = a[0],
                    r = a[1],
                    u = a[2];
                return t[0] = e, t[1] = r, t[2] = u, t[3] = Math.sqrt(Math.abs(1 - e * e - r * r - u * u)), t
            }, quat.dot = vec4.dot, quat.lerp = vec4.lerp, quat.slerp = function(t, a, e, r) {
                var u, n, c, q, o, s = a[0],
                    i = a[1],
                    v = a[2],
                    l = a[3],
                    f = e[0],
                    h = e[1],
                    M = e[2],
                    m = e[3];
                return n = s * f + i * h + v * M + l * m, 0 > n && (n = -n, f = -f, h = -h, M = -M, m = -m), 1 - n > 1e-6 ? (u = Math.acos(n), c = Math.sin(u), q = Math.sin((1 - r) * u) / c, o = Math.sin(r * u) / c) : (q = 1 - r, o = r), t[0] = q * s + o * f, t[1] = q * i + o * h, t[2] = q * v + o * M, t[3] = q * l + o * m, t
            }, quat.sqlerp = function() {
                var t = quat.create(),
                    a = quat.create();
                return function(e, r, u, n, c, q) {
                    return quat.slerp(t, r, c, q), quat.slerp(a, u, n, q), quat.slerp(e, t, a, 2 * q * (1 - q)), e
                }
            }(), quat.invert = function(t, a) {
                var e = a[0],
                    r = a[1],
                    u = a[2],
                    n = a[3],
                    c = e * e + r * r + u * u + n * n,
                    q = c ? 1 / c : 0;
                return t[0] = -e * q, t[1] = -r * q, t[2] = -u * q, t[3] = n * q, t
            }, quat.conjugate = function(t, a) {
                return t[0] = -a[0], t[1] = -a[1], t[2] = -a[2], t[3] = a[3], t
            }, quat.length = vec4.length, quat.len = quat.length, quat.squaredLength = vec4.squaredLength, quat.sqrLen = quat.squaredLength, quat.normalize = vec4.normalize, quat.fromMat3 = function(t, a) {
                var e, r = a[0] + a[4] + a[8];
                if (r > 0) e = Math.sqrt(r + 1), t[3] = .5 * e, e = .5 / e, t[0] = (a[5] - a[7]) * e, t[1] = (a[6] - a[2]) * e, t[2] = (a[1] - a[3]) * e;
                else {
                    var u = 0;
                    a[4] > a[0] && (u = 1), a[8] > a[3 * u + u] && (u = 2);
                    var n = (u + 1) % 3,
                        c = (u + 2) % 3;
                    e = Math.sqrt(a[3 * u + u] - a[3 * n + n] - a[3 * c + c] + 1), t[u] = .5 * e, e = .5 / e, t[3] = (a[3 * n + c] - a[3 * c + n]) * e, t[n] = (a[3 * n + u] + a[3 * u + n]) * e, t[c] = (a[3 * c + u] + a[3 * u + c]) * e
                }
                return t
            }, quat.str = function(t) {
                return "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
            }, module.exports = quat;
        }, {
            "./common.js": 111,
            "./mat3.js": 114,
            "./vec3.js": 118,
            "./vec4.js": 119
        }],
        117: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                vec2 = {};
            vec2.create = function() {
                var n = new glMatrix.ARRAY_TYPE(2);
                return n[0] = 0, n[1] = 0, n
            }, vec2.clone = function(n) {
                var e = new glMatrix.ARRAY_TYPE(2);
                return e[0] = n[0], e[1] = n[1], e
            }, vec2.fromValues = function(n, e) {
                var r = new glMatrix.ARRAY_TYPE(2);
                return r[0] = n, r[1] = e, r
            }, vec2.copy = function(n, e) {
                return n[0] = e[0], n[1] = e[1], n
            }, vec2.set = function(n, e, r) {
                return n[0] = e, n[1] = r, n
            }, vec2.add = function(n, e, r) {
                return n[0] = e[0] + r[0], n[1] = e[1] + r[1], n
            }, vec2.subtract = function(n, e, r) {
                return n[0] = e[0] - r[0], n[1] = e[1] - r[1], n
            }, vec2.sub = vec2.subtract, vec2.multiply = function(n, e, r) {
                return n[0] = e[0] * r[0], n[1] = e[1] * r[1], n
            }, vec2.mul = vec2.multiply, vec2.divide = function(n, e, r) {
                return n[0] = e[0] / r[0], n[1] = e[1] / r[1], n
            }, vec2.div = vec2.divide, vec2.min = function(n, e, r) {
                return n[0] = Math.min(e[0], r[0]), n[1] = Math.min(e[1], r[1]), n
            }, vec2.max = function(n, e, r) {
                return n[0] = Math.max(e[0], r[0]), n[1] = Math.max(e[1], r[1]), n
            }, vec2.scale = function(n, e, r) {
                return n[0] = e[0] * r, n[1] = e[1] * r, n
            }, vec2.scaleAndAdd = function(n, e, r, t) {
                return n[0] = e[0] + r[0] * t, n[1] = e[1] + r[1] * t, n
            }, vec2.distance = function(n, e) {
                var r = e[0] - n[0],
                    t = e[1] - n[1];
                return Math.sqrt(r * r + t * t)
            }, vec2.dist = vec2.distance, vec2.squaredDistance = function(n, e) {
                var r = e[0] - n[0],
                    t = e[1] - n[1];
                return r * r + t * t
            }, vec2.sqrDist = vec2.squaredDistance, vec2.length = function(n) {
                var e = n[0],
                    r = n[1];
                return Math.sqrt(e * e + r * r)
            }, vec2.len = vec2.length, vec2.squaredLength = function(n) {
                var e = n[0],
                    r = n[1];
                return e * e + r * r
            }, vec2.sqrLen = vec2.squaredLength, vec2.negate = function(n, e) {
                return n[0] = -e[0], n[1] = -e[1], n
            }, vec2.inverse = function(n, e) {
                return n[0] = 1 / e[0], n[1] = 1 / e[1], n
            }, vec2.normalize = function(n, e) {
                var r = e[0],
                    t = e[1],
                    c = r * r + t * t;
                return c > 0 && (c = 1 / Math.sqrt(c), n[0] = e[0] * c, n[1] = e[1] * c), n
            }, vec2.dot = function(n, e) {
                return n[0] * e[0] + n[1] * e[1]
            }, vec2.cross = function(n, e, r) {
                var t = e[0] * r[1] - e[1] * r[0];
                return n[0] = n[1] = 0, n[2] = t, n
            }, vec2.lerp = function(n, e, r, t) {
                var c = e[0],
                    u = e[1];
                return n[0] = c + t * (r[0] - c), n[1] = u + t * (r[1] - u), n
            }, vec2.random = function(n, e) {
                e = e || 1;
                var r = 2 * glMatrix.RANDOM() * Math.PI;
                return n[0] = Math.cos(r) * e, n[1] = Math.sin(r) * e, n
            }, vec2.transformMat2 = function(n, e, r) {
                var t = e[0],
                    c = e[1];
                return n[0] = r[0] * t + r[2] * c, n[1] = r[1] * t + r[3] * c, n
            }, vec2.transformMat2d = function(n, e, r) {
                var t = e[0],
                    c = e[1];
                return n[0] = r[0] * t + r[2] * c + r[4], n[1] = r[1] * t + r[3] * c + r[5], n
            }, vec2.transformMat3 = function(n, e, r) {
                var t = e[0],
                    c = e[1];
                return n[0] = r[0] * t + r[3] * c + r[6], n[1] = r[1] * t + r[4] * c + r[7], n
            }, vec2.transformMat4 = function(n, e, r) {
                var t = e[0],
                    c = e[1];
                return n[0] = r[0] * t + r[4] * c + r[12], n[1] = r[1] * t + r[5] * c + r[13], n
            }, vec2.forEach = function() {
                var n = vec2.create();
                return function(e, r, t, c, u, v) {
                    var a, i;
                    for (r || (r = 2), t || (t = 0), i = c ? Math.min(c * r + t, e.length) : e.length, a = t; i > a; a += r) n[0] = e[a], n[1] = e[a + 1], u(n, n, v), e[a] = n[0], e[a + 1] = n[1];
                    return e
                }
            }(), vec2.str = function(n) {
                return "vec2(" + n[0] + ", " + n[1] + ")"
            }, module.exports = vec2;
        }, {
            "./common.js": 111
        }],
        118: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                vec3 = {};
            vec3.create = function() {
                var n = new glMatrix.ARRAY_TYPE(3);
                return n[0] = 0, n[1] = 0, n[2] = 0, n
            }, vec3.clone = function(n) {
                var t = new glMatrix.ARRAY_TYPE(3);
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t
            }, vec3.fromValues = function(n, t, e) {
                var r = new glMatrix.ARRAY_TYPE(3);
                return r[0] = n, r[1] = t, r[2] = e, r
            }, vec3.copy = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n
            }, vec3.set = function(n, t, e, r) {
                return n[0] = t, n[1] = e, n[2] = r, n
            }, vec3.add = function(n, t, e) {
                return n[0] = t[0] + e[0], n[1] = t[1] + e[1], n[2] = t[2] + e[2], n
            }, vec3.subtract = function(n, t, e) {
                return n[0] = t[0] - e[0], n[1] = t[1] - e[1], n[2] = t[2] - e[2], n
            }, vec3.sub = vec3.subtract, vec3.multiply = function(n, t, e) {
                return n[0] = t[0] * e[0], n[1] = t[1] * e[1], n[2] = t[2] * e[2], n
            }, vec3.mul = vec3.multiply, vec3.divide = function(n, t, e) {
                return n[0] = t[0] / e[0], n[1] = t[1] / e[1], n[2] = t[2] / e[2], n
            }, vec3.div = vec3.divide, vec3.min = function(n, t, e) {
                return n[0] = Math.min(t[0], e[0]), n[1] = Math.min(t[1], e[1]), n[2] = Math.min(t[2], e[2]), n
            }, vec3.max = function(n, t, e) {
                return n[0] = Math.max(t[0], e[0]), n[1] = Math.max(t[1], e[1]), n[2] = Math.max(t[2], e[2]), n
            }, vec3.scale = function(n, t, e) {
                return n[0] = t[0] * e, n[1] = t[1] * e, n[2] = t[2] * e, n
            }, vec3.scaleAndAdd = function(n, t, e, r) {
                return n[0] = t[0] + e[0] * r, n[1] = t[1] + e[1] * r, n[2] = t[2] + e[2] * r, n
            }, vec3.distance = function(n, t) {
                var e = t[0] - n[0],
                    r = t[1] - n[1],
                    c = t[2] - n[2];
                return Math.sqrt(e * e + r * r + c * c)
            }, vec3.dist = vec3.distance, vec3.squaredDistance = function(n, t) {
                var e = t[0] - n[0],
                    r = t[1] - n[1],
                    c = t[2] - n[2];
                return e * e + r * r + c * c
            }, vec3.sqrDist = vec3.squaredDistance, vec3.length = function(n) {
                var t = n[0],
                    e = n[1],
                    r = n[2];
                return Math.sqrt(t * t + e * e + r * r)
            }, vec3.len = vec3.length, vec3.squaredLength = function(n) {
                var t = n[0],
                    e = n[1],
                    r = n[2];
                return t * t + e * e + r * r
            }, vec3.sqrLen = vec3.squaredLength, vec3.negate = function(n, t) {
                return n[0] = -t[0], n[1] = -t[1], n[2] = -t[2], n
            }, vec3.inverse = function(n, t) {
                return n[0] = 1 / t[0], n[1] = 1 / t[1], n[2] = 1 / t[2], n
            }, vec3.normalize = function(n, t) {
                var e = t[0],
                    r = t[1],
                    c = t[2],
                    a = e * e + r * r + c * c;
                return a > 0 && (a = 1 / Math.sqrt(a), n[0] = t[0] * a, n[1] = t[1] * a, n[2] = t[2] * a), n
            }, vec3.dot = function(n, t) {
                return n[0] * t[0] + n[1] * t[1] + n[2] * t[2]
            }, vec3.cross = function(n, t, e) {
                var r = t[0],
                    c = t[1],
                    a = t[2],
                    u = e[0],
                    v = e[1],
                    i = e[2];
                return n[0] = c * i - a * v, n[1] = a * u - r * i, n[2] = r * v - c * u, n
            }, vec3.lerp = function(n, t, e, r) {
                var c = t[0],
                    a = t[1],
                    u = t[2];
                return n[0] = c + r * (e[0] - c), n[1] = a + r * (e[1] - a), n[2] = u + r * (e[2] - u), n
            }, vec3.hermite = function(n, t, e, r, c, a) {
                var u = a * a,
                    v = u * (2 * a - 3) + 1,
                    i = u * (a - 2) + a,
                    o = u * (a - 1),
                    s = u * (3 - 2 * a);
                return n[0] = t[0] * v + e[0] * i + r[0] * o + c[0] * s, n[1] = t[1] * v + e[1] * i + r[1] * o + c[1] * s, n[2] = t[2] * v + e[2] * i + r[2] * o + c[2] * s, n
            }, vec3.bezier = function(n, t, e, r, c, a) {
                var u = 1 - a,
                    v = u * u,
                    i = a * a,
                    o = v * u,
                    s = 3 * a * v,
                    f = 3 * i * u,
                    M = i * a;
                return n[0] = t[0] * o + e[0] * s + r[0] * f + c[0] * M, n[1] = t[1] * o + e[1] * s + r[1] * f + c[1] * M, n[2] = t[2] * o + e[2] * s + r[2] * f + c[2] * M, n
            }, vec3.random = function(n, t) {
                t = t || 1;
                var e = 2 * glMatrix.RANDOM() * Math.PI,
                    r = 2 * glMatrix.RANDOM() - 1,
                    c = Math.sqrt(1 - r * r) * t;
                return n[0] = Math.cos(e) * c, n[1] = Math.sin(e) * c, n[2] = r * t, n
            }, vec3.transformMat4 = function(n, t, e) {
                var r = t[0],
                    c = t[1],
                    a = t[2],
                    u = e[3] * r + e[7] * c + e[11] * a + e[15];
                return u = u || 1, n[0] = (e[0] * r + e[4] * c + e[8] * a + e[12]) / u, n[1] = (e[1] * r + e[5] * c + e[9] * a + e[13]) / u, n[2] = (e[2] * r + e[6] * c + e[10] * a + e[14]) / u, n
            }, vec3.transformMat3 = function(n, t, e) {
                var r = t[0],
                    c = t[1],
                    a = t[2];
                return n[0] = r * e[0] + c * e[3] + a * e[6], n[1] = r * e[1] + c * e[4] + a * e[7], n[2] = r * e[2] + c * e[5] + a * e[8], n
            }, vec3.transformQuat = function(n, t, e) {
                var r = t[0],
                    c = t[1],
                    a = t[2],
                    u = e[0],
                    v = e[1],
                    i = e[2],
                    o = e[3],
                    s = o * r + v * a - i * c,
                    f = o * c + i * r - u * a,
                    M = o * a + u * c - v * r,
                    h = -u * r - v * c - i * a;
                return n[0] = s * o + h * -u + f * -i - M * -v, n[1] = f * o + h * -v + M * -u - s * -i, n[2] = M * o + h * -i + s * -v - f * -u, n
            }, vec3.rotateX = function(n, t, e, r) {
                var c = [],
                    a = [];
                return c[0] = t[0] - e[0], c[1] = t[1] - e[1], c[2] = t[2] - e[2], a[0] = c[0], a[1] = c[1] * Math.cos(r) - c[2] * Math.sin(r), a[2] = c[1] * Math.sin(r) + c[2] * Math.cos(r), n[0] = a[0] + e[0], n[1] = a[1] + e[1], n[2] = a[2] + e[2], n
            }, vec3.rotateY = function(n, t, e, r) {
                var c = [],
                    a = [];
                return c[0] = t[0] - e[0], c[1] = t[1] - e[1], c[2] = t[2] - e[2], a[0] = c[2] * Math.sin(r) + c[0] * Math.cos(r), a[1] = c[1], a[2] = c[2] * Math.cos(r) - c[0] * Math.sin(r), n[0] = a[0] + e[0], n[1] = a[1] + e[1], n[2] = a[2] + e[2], n
            }, vec3.rotateZ = function(n, t, e, r) {
                var c = [],
                    a = [];
                return c[0] = t[0] - e[0], c[1] = t[1] - e[1], c[2] = t[2] - e[2], a[0] = c[0] * Math.cos(r) - c[1] * Math.sin(r), a[1] = c[0] * Math.sin(r) + c[1] * Math.cos(r), a[2] = c[2], n[0] = a[0] + e[0], n[1] = a[1] + e[1], n[2] = a[2] + e[2], n
            }, vec3.forEach = function() {
                var n = vec3.create();
                return function(t, e, r, c, a, u) {
                    var v, i;
                    for (e || (e = 3), r || (r = 0), i = c ? Math.min(c * e + r, t.length) : t.length, v = r; i > v; v += e) n[0] = t[v], n[1] = t[v + 1], n[2] = t[v + 2], a(n, n, u), t[v] = n[0], t[v + 1] = n[1], t[v + 2] = n[2];
                    return t
                }
            }(), vec3.angle = function(n, t) {
                var e = vec3.fromValues(n[0], n[1], n[2]),
                    r = vec3.fromValues(t[0], t[1], t[2]);
                vec3.normalize(e, e), vec3.normalize(r, r);
                var c = vec3.dot(e, r);
                return c > 1 ? 0 : Math.acos(c)
            }, vec3.str = function(n) {
                return "vec3(" + n[0] + ", " + n[1] + ", " + n[2] + ")"
            }, module.exports = vec3;
        }, {
            "./common.js": 111
        }],
        119: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                vec4 = {};
            vec4.create = function() {
                var e = new glMatrix.ARRAY_TYPE(4);
                return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 0, e
            }, vec4.clone = function(e) {
                var n = new glMatrix.ARRAY_TYPE(4);
                return n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = e[3], n
            }, vec4.fromValues = function(e, n, t, r) {
                var c = new glMatrix.ARRAY_TYPE(4);
                return c[0] = e, c[1] = n, c[2] = t, c[3] = r, c
            }, vec4.copy = function(e, n) {
                return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e
            }, vec4.set = function(e, n, t, r, c) {
                return e[0] = n, e[1] = t, e[2] = r, e[3] = c, e
            }, vec4.add = function(e, n, t) {
                return e[0] = n[0] + t[0], e[1] = n[1] + t[1], e[2] = n[2] + t[2], e[3] = n[3] + t[3], e
            }, vec4.subtract = function(e, n, t) {
                return e[0] = n[0] - t[0], e[1] = n[1] - t[1], e[2] = n[2] - t[2], e[3] = n[3] - t[3], e
            }, vec4.sub = vec4.subtract, vec4.multiply = function(e, n, t) {
                return e[0] = n[0] * t[0], e[1] = n[1] * t[1], e[2] = n[2] * t[2], e[3] = n[3] * t[3], e
            }, vec4.mul = vec4.multiply, vec4.divide = function(e, n, t) {
                return e[0] = n[0] / t[0], e[1] = n[1] / t[1], e[2] = n[2] / t[2], e[3] = n[3] / t[3], e
            }, vec4.div = vec4.divide, vec4.min = function(e, n, t) {
                return e[0] = Math.min(n[0], t[0]), e[1] = Math.min(n[1], t[1]), e[2] = Math.min(n[2], t[2]), e[3] = Math.min(n[3], t[3]), e
            }, vec4.max = function(e, n, t) {
                return e[0] = Math.max(n[0], t[0]), e[1] = Math.max(n[1], t[1]), e[2] = Math.max(n[2], t[2]), e[3] = Math.max(n[3], t[3]), e
            }, vec4.scale = function(e, n, t) {
                return e[0] = n[0] * t, e[1] = n[1] * t, e[2] = n[2] * t, e[3] = n[3] * t, e
            }, vec4.scaleAndAdd = function(e, n, t, r) {
                return e[0] = n[0] + t[0] * r, e[1] = n[1] + t[1] * r, e[2] = n[2] + t[2] * r, e[3] = n[3] + t[3] * r, e
            }, vec4.distance = function(e, n) {
                var t = n[0] - e[0],
                    r = n[1] - e[1],
                    c = n[2] - e[2],
                    u = n[3] - e[3];
                return Math.sqrt(t * t + r * r + c * c + u * u)
            }, vec4.dist = vec4.distance, vec4.squaredDistance = function(e, n) {
                var t = n[0] - e[0],
                    r = n[1] - e[1],
                    c = n[2] - e[2],
                    u = n[3] - e[3];
                return t * t + r * r + c * c + u * u
            }, vec4.sqrDist = vec4.squaredDistance, vec4.length = function(e) {
                var n = e[0],
                    t = e[1],
                    r = e[2],
                    c = e[3];
                return Math.sqrt(n * n + t * t + r * r + c * c)
            }, vec4.len = vec4.length, vec4.squaredLength = function(e) {
                var n = e[0],
                    t = e[1],
                    r = e[2],
                    c = e[3];
                return n * n + t * t + r * r + c * c
            }, vec4.sqrLen = vec4.squaredLength, vec4.negate = function(e, n) {
                return e[0] = -n[0], e[1] = -n[1], e[2] = -n[2], e[3] = -n[3], e
            }, vec4.inverse = function(e, n) {
                return e[0] = 1 / n[0], e[1] = 1 / n[1], e[2] = 1 / n[2], e[3] = 1 / n[3], e
            }, vec4.normalize = function(e, n) {
                var t = n[0],
                    r = n[1],
                    c = n[2],
                    u = n[3],
                    a = t * t + r * r + c * c + u * u;
                return a > 0 && (a = 1 / Math.sqrt(a), e[0] = t * a, e[1] = r * a, e[2] = c * a, e[3] = u * a), e
            }, vec4.dot = function(e, n) {
                return e[0] * n[0] + e[1] * n[1] + e[2] * n[2] + e[3] * n[3]
            }, vec4.lerp = function(e, n, t, r) {
                var c = n[0],
                    u = n[1],
                    a = n[2],
                    v = n[3];
                return e[0] = c + r * (t[0] - c), e[1] = u + r * (t[1] - u), e[2] = a + r * (t[2] - a), e[3] = v + r * (t[3] - v), e
            }, vec4.random = function(e, n) {
                return n = n || 1, e[0] = glMatrix.RANDOM(), e[1] = glMatrix.RANDOM(), e[2] = glMatrix.RANDOM(), e[3] = glMatrix.RANDOM(), vec4.normalize(e, e), vec4.scale(e, e, n), e
            }, vec4.transformMat4 = function(e, n, t) {
                var r = n[0],
                    c = n[1],
                    u = n[2],
                    a = n[3];
                return e[0] = t[0] * r + t[4] * c + t[8] * u + t[12] * a, e[1] = t[1] * r + t[5] * c + t[9] * u + t[13] * a, e[2] = t[2] * r + t[6] * c + t[10] * u + t[14] * a, e[3] = t[3] * r + t[7] * c + t[11] * u + t[15] * a, e
            }, vec4.transformQuat = function(e, n, t) {
                var r = n[0],
                    c = n[1],
                    u = n[2],
                    a = t[0],
                    v = t[1],
                    i = t[2],
                    o = t[3],
                    f = o * r + v * u - i * c,
                    s = o * c + i * r - a * u,
                    l = o * u + a * c - v * r,
                    M = -a * r - v * c - i * u;
                return e[0] = f * o + M * -a + s * -i - l * -v, e[1] = s * o + M * -v + l * -a - f * -i, e[2] = l * o + M * -i + f * -v - s * -a, e[3] = n[3], e
            }, vec4.forEach = function() {
                var e = vec4.create();
                return function(n, t, r, c, u, a) {
                    var v, i;
                    for (t || (t = 4), r || (r = 0), i = c ? Math.min(c * t + r, n.length) : n.length, v = r; i > v; v += t) e[0] = n[v], e[1] = n[v + 1], e[2] = n[v + 2], e[3] = n[v + 3], u(e, e, a), n[v] = e[0], n[v + 1] = e[1], n[v + 2] = e[2], n[v + 3] = e[3];
                    return n
                }
            }(), vec4.str = function(e) {
                return "vec4(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")"
            }, module.exports = vec4;
        }, {
            "./common.js": 111
        }],
        120: [function(require, module, exports) {
            "use strict";

            function constant(r) {
                return function() {
                    return r
                }
            }

            function interpolateNumber(r, t, n) {
                return r * (1 - n) + t * n
            }

            function interpolateArray(r, t, n) {
                for (var e = [], o = 0; o < r.length; o++) e[o] = interpolateNumber(r[o], t[o], n);
                return e
            }
            exports.interpolated = function(r) {
                if (!r.stops) return constant(r);
                var t = r.stops,
                    n = r.base || 1,
                    e = Array.isArray(t[0][1]) ? interpolateArray : interpolateNumber;
                return function(r) {
                    for (var o, a, i = 0; i < t.length; i++) {
                        var u = t[i];
                        if (u[0] <= r && (o = u), u[0] > r) {
                            a = u;
                            break
                        }
                    }
                    if (o && a) {
                        var s = a[0] - o[0],
                            f = r - o[0],
                            p = 1 === n ? f / s : (Math.pow(n, f) - 1) / (Math.pow(n, s) - 1);
                        return e(o[1], a[1], p)
                    }
                    return o ? o[1] : a ? a[1] : void 0
                }
            }, exports["piecewise-constant"] = function(r) {
                if (!r.stops) return constant(r);
                var t = r.stops;
                return function(r) {
                    for (var n = 0; n < t.length; n++)
                        if (t[n][0] > r) return t[0 === n ? 0 : n - 1][1];
                    return t[t.length - 1][1]
                }
            };
        }, {}],
        121: [function(require, module, exports) {
            "use strict";
            var reference = require("../../reference/latest.min.js"),
                validate = require("./parsed");
            module.exports = function(e) {
                return validate(e, reference)
            };
        }, {
            "../../reference/latest.min.js": 125,
            "./parsed": 122
        }],
        122: [function(require, module, exports) {
            "use strict";

            function typeof_(e) {
                return e instanceof Number ? "number" : e instanceof String ? "string" : e instanceof Boolean ? "boolean" : Array.isArray(e) ? "array" : null === e ? "null" : typeof e
            }

            function unbundle(e) {
                return e instanceof Number || e instanceof String || e instanceof Boolean ? e.valueOf() : e
            }
            var parseCSSColor = require("csscolorparser").parseCSSColor,
                format = require("util").format;
            module.exports = function(e, r) {
                function t(e, r) {
                    var t = {
                        message: (e ? e + ": " : "") + format.apply(format, Array.prototype.slice.call(arguments, 2))
                    };
                    null !== r && void 0 !== r && r.__line__ && (t.line = r.__line__), s.push(t)
                }

                function n(e, o, i) {
                    var s = typeof_(o);
                    if ("string" === s && "@" === o[0]) {
                        if (r.$version > 7) return t(e, o, "constants have been deprecated as of v8");
                        if (!(o in a)) return t(e, o, 'constant "%s" not found', o);
                        o = a[o], s = typeof_(o)
                    }
                    if (i["function"] && "object" === s) return n["function"](e, o, i);
                    if (i.type) {
                        var u = n[i.type];
                        if (u) return u(e, o, i);
                        i = r[i.type]
                    }
                    n.object(e, o, i)
                }

                function o(e) {
                    return function(r, n, o) {
                        var a = typeof_(n);
                        a !== e && t(r, n, "%s expected, %s found", e, a), "minimum" in o && n < o.minimum && t(r, n, "%s is less than the minimum value %s", n, o.minimum), "maximum" in o && n > o.maximum && t(r, n, "%s is greater than the maximum value %s", n, o.maximum)
                    }
                }
                var a = e.constants || {},
                    i = {},
                    s = [];
                return n.constants = function(e, n) {
                    if (r.$version > 7) {
                        if (n) return t(e, n, "constants have been deprecated as of v8")
                    } else {
                        var o = typeof_(n);
                        if ("object" !== o) return t(e, n, "object expected, %s found", o);
                        for (var a in n) "@" !== a[0] && t(e + "." + a, n[a], 'constants must start with "@"')
                    }
                }, n.source = function(e, o) {
                    if (!o.type) return void t(e, o, '"type" is required');
                    var a = unbundle(o.type);
                    switch (a) {
                        case "vector":
                        case "raster":
                            if (n.object(e, o, r.source_tile), "url" in o)
                                for (var i in o)["type", "url", "tileSize"].indexOf(i) < 0 && t(e + "." + i, o[i], 'a source with a "url" property may not include a "%s" property', i);
                            break;
                        case "geojson":
                            n.object(e, o, r.source_geojson);
                            break;
                        case "video":
                            n.object(e, o, r.source_video);
                            break;
                        case "image":
                            n.object(e, o, r.source_image);
                            break;
                        default:
                            n["enum"](e + ".type", o.type, {
                                values: ["vector", "raster", "geojson", "video", "image"]
                            })
                    }
                }, n.layer = function(o, a) {
                    a.type || a.ref || t(o, a, 'either "type" or "ref" is required');
                    var s = unbundle(a.type),
                        u = unbundle(a.ref);
                    if (a.id && (i[a.id] ? t(o, a.id, 'duplicate layer id "%s", previously used at line %d', a.id, i[a.id]) : i[a.id] = a.id.__line__), "ref" in a) {
                        ["type", "source", "source-layer", "filter", "layout"].forEach(function(e) {
                            e in a && t(o, a[e], '"%s" is prohibited for ref layers', e)
                        });
                        var c;
                        e.layers.forEach(function(e) {
                            e.id == u && (c = e)
                        }), c ? c.ref ? t(o, a.ref, "ref cannot reference another ref layer") : s = c.type : t(o, a.ref, 'ref layer "%s" not found', u)
                    } else if ("background" !== s)
                        if (a.source) {
                            var f = e.sources[a.source];
                            f ? "vector" == f.type && "raster" == s ? t(o, a.source, 'layer "%s" requires a raster source', a.id) : "raster" == f.type && "raster" != s ? t(o, a.source, 'layer "%s" requires a vector source', a.id) : "vector" != f.type || a["source-layer"] || t(o, a, 'layer "%s" must specify a "source-layer"', a.id) : t(o, a.source, 'source "%s" not found', a.source)
                        } else t(o, a, 'missing required property "source"');
                    n.object(o, a, r.layer, {
                        filter: n.filter,
                        layout: function(e, t) {
                            var o = r["layout_" + s];
                            return s && o && n(e, t, o)
                        },
                        paint: function(e, t) {
                            var o = r["paint_" + s];
                            return s && o && n(e, t, o)
                        }
                    })
                }, n.object = function(e, o, a, i) {
                    i = i || {};
                    var s = typeof_(o);
                    if ("object" !== s) return t(e, o, "object expected, %s found", s);
                    for (var u in o) {
                        var c = u.split(".")[0],
                            f = a[c] || a["*"],
                            l = c.match(/^(.*)-transition$/);
                        f ? (i[c] || n)((e ? e + "." : e) + u, o[u], f) : l && a[l[1]] && a[l[1]].transition ? n((e ? e + "." : e) + u, o[u], r.transition) : "" !== e && 1 !== e.split(".").length && t(e, o[u], 'unknown property "%s"', u)
                    }
                    for (var p in a) a[p].required && void 0 === a[p]["default"] && void 0 === o[p] && t(e, o, 'missing required property "%s"', p)
                }, n.array = function(r, o, a, i) {
                    if ("array" !== typeof_(o)) return t(r, o, "array expected, %s found", typeof_(o));
                    if (a.length && o.length !== a.length) return t(r, o, "array length %d expected, length %d found", a.length, o.length);
                    if (a["min-length"] && o.length < a["min-length"]) return t(r, o, "array length at least %d expected, length %d found", a["min-length"], o.length);
                    var s = {
                        type: a.value
                    };
                    e.version < 7 && (s["function"] = a["function"]), "object" === typeof_(a.value) && (s = a.value);
                    for (var u = 0; u < o.length; u++)(i || n)(r + "[" + u + "]", o[u], s)
                }, n.filter = function(e, o) {
                    var a;
                    if ("array" !== typeof_(o)) return t(e, o, "array expected, %s found", typeof_(o));
                    if (o.length < 1) return t(e, o, "filter array must have at least 1 element");
                    switch (n["enum"](e + "[0]", o[0], r.filter_operator), unbundle(o[0])) {
                        case "<":
                        case "<=":
                        case ">":
                        case ">=":
                            o.length >= 2 && "$type" == o[1] && t(e, o, '"$type" cannot be use with operator "%s"', o[0]);
                        case "==":
                        case "!=":
                            3 != o.length && t(e, o, 'filter array for operator "%s" must have 3 elements', o[0]);
                        case "in":
                        case "!in":
                            o.length >= 2 && (a = typeof_(o[1]), "string" !== a ? t(e + "[1]", o[1], "string expected, %s found", a) : "@" === o[1][0] && t(e + "[1]", o[1], "filter key cannot be a constant"));
                            for (var i = 2; i < o.length; i++) a = typeof_(o[i]), "$type" == o[1] ? n["enum"](e + "[" + i + "]", o[i], r.geometry_type) : "string" === a && "@" === o[i][0] ? t(e + "[" + i + "]", o[i], "filter value cannot be a constant") : "string" !== a && "number" !== a && "boolean" !== a && t(e + "[" + i + "]", o[i], "string, number, or boolean expected, %s found", a);
                            break;
                        case "any":
                        case "all":
                        case "none":
                            for (i = 1; i < o.length; i++) n.filter(e + "[" + i + "]", o[i])
                    }
                }, n["function"] = function(e, o, a) {
                    n.object(e, o, r["function"], {
                        stops: function(e, r, o) {
                            var i = -(1 / 0);
                            n.array(e, r, o, function(e, r) {
                                return "array" !== typeof_(r) ? t(e, r, "array expected, %s found", typeof_(r)) : 2 !== r.length ? t(e, r, "array length %d expected, length %d found", 2, r.length) : (n(e + "[0]", r[0], {
                                    type: "number"
                                }), n(e + "[1]", r[1], a), void("number" === typeof_(r[0]) && ("piecewise-constant" === a["function"] && r[0] % 1 !== 0 && t(e + "[0]", r[0], "zoom level for piecewise-constant functions must be an integer"), r[0] < i && t(e + "[0]", r[0], "array stops must appear in ascending order"), i = r[0])))
                            }), "array" === typeof_(r) && 0 === r.length && t(e, r, "array must have at least one stop")
                        }
                    })
                }, n["enum"] = function(e, r, n) {
                    -1 === n.values.indexOf(unbundle(r)) && t(e, r, "expected one of [%s], %s found", n.values.join(", "), r)
                }, n.color = function(e, r) {
                    var n = typeof_(r);
                    return "string" !== n ? t(e, r, "color expected, %s found", n) : null === parseCSSColor(r) ? t(e, r, 'color expected, "%s" found', r) : void 0
                }, n.number = o("number"), n.string = o("string"), n["boolean"] = o("boolean"), n["*"] = function() {}, n("", e, r.$root), r.$version > 7 && e.constants && n.constants("constants", e.constants), s.sort(function(e, r) {
                    return e.line - r.line
                }), s
            };
        }, {
            "csscolorparser": 123,
            "util": 100
        }],
        123: [function(require, module, exports) {
            arguments[4][101][0].apply(exports, arguments)
        }, {
            "dup": 101
        }],
        124: [function(require, module, exports) {
            module.exports = require("./v8.json");
        }, {
            "./v8.json": 126
        }],
        125: [function(require, module, exports) {
            module.exports = require("./v8.min.json");
        }, {
            "./v8.min.json": 127
        }],
        126: [function(require, module, exports) {
            module.exports = {
                "$version": 8,
                "$root": {
                    "version": {
                        "required": true,
                        "type": "enum",
                        "values": [8],
                        "doc": "Stylesheet version number. Must be 8.",
                        "example": 8
                    },
                    "name": {
                        "type": "string",
                        "doc": "A human-readable name for the style.",
                        "example": "Bright"
                    },
                    "metadata": {
                        "type": "*",
                        "doc": "Arbitrary properties useful to track with the stylesheet, but do not influence rendering. Properties should be prefixed to avoid collisions, like 'mapbox:'."
                    },
                    "center": {
                        "type": "array",
                        "value": "number",
                        "doc": "Default map center in longitude and latitude.  The style center will be used only if the map has not been positioned by other means (e.g. map options or user interaction).",
                        "example": [-73.9749, 40.7736]
                    },
                    "zoom": {
                        "type": "number",
                        "doc": "Default zoom level.  The style zoom will be used only if the map has not been positioned by other means (e.g. map options or user interaction).",
                        "example": 12.5
                    },
                    "bearing": {
                        "type": "number",
                        "default": 0,
                        "period": 360,
                        "units": "degrees",
                        "doc": "Default bearing, in degrees.  The style bearing will be used only if the map has not been positioned by other means (e.g. map options or user interaction).",
                        "example": 29
                    },
                    "pitch": {
                        "type": "number",
                        "default": 0,
                        "units": "degrees",
                        "doc": "Default pitch, in degrees. Zero is perpendicular to the surface.  The style pitch will be used only if the map has not been positioned by other means (e.g. map options or user interaction).",
                        "example": 50
                    },
                    "sources": {
                        "required": true,
                        "type": "sources",
                        "doc": "Data source specifications.",
                        "example": {
                            "mapbox-streets": {
                                "type": "vector",
                                "url": "mapbox://mapbox.mapbox-streets-v6"
                            }
                        }
                    },
                    "sprite": {
                        "type": "string",
                        "doc": "A base URL for retrieving the sprite image and metadata. The extensions `.png`, `.json` and scale factor `@2x.png` will be automatically appended.",
                        "example": "mapbox://sprites/mapbox/bright-v8"
                    },
                    "glyphs": {
                        "type": "string",
                        "doc": "A URL template for loading signed-distance-field glyph sets in PBF format. Valid tokens are {fontstack} and {range}.",
                        "example": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf"
                    },
                    "transition": {
                        "type": "transition",
                        "doc": "A global transition definition to use as a default across properties.",
                        "example": {
                            "duration": 300,
                            "delay": 0
                        }
                    },
                    "layers": {
                        "required": true,
                        "type": "array",
                        "value": "layer",
                        "doc": "Layers will be drawn in the order of this array.",
                        "example": [{
                            "id": "water",
                            "source": "mapbox-streets",
                            "source-layer": "water",
                            "type": "fill",
                            "paint": {
                                "fill-color": "#00ffff"
                            }
                        }]
                    }
                },
                "sources": {
                    "*": {
                        "type": "source",
                        "doc": "Specification of a data source. For vector and raster sources, either TileJSON or a URL to a TileJSON must be provided. For GeoJSON and video sources, a URL must be provided."
                    }
                },
                "source": ["source_tile", "source_geojson", "source_video", "source_image"],
                "source_tile": {
                    "type": {
                        "required": true,
                        "type": "enum",
                        "values": ["vector", "raster"],
                        "doc": "The data type of the tile source."
                    },
                    "url": {
                        "type": "string",
                        "doc": "A URL to a TileJSON resource. Supported protocols are `http:`, `https:`, and `mapbox://<mapid>`."
                    },
                    "tiles": {
                        "type": "array",
                        "value": "string",
                        "doc": "An array of one or more tile source URLs, as in the TileJSON spec."
                    },
                    "minzoom": {
                        "type": "number",
                        "default": 0,
                        "doc": "Minimum zoom level for which tiles are available, as in the TileJSON spec."
                    },
                    "maxzoom": {
                        "type": "number",
                        "default": 22,
                        "doc": "Maximum zoom level for which tiles are available, as in the TileJSON spec. Data from tiles at the maxzoom are used when displaying the map at higher zoom levels."
                    },
                    "tileSize": {
                        "type": "number",
                        "default": 512,
                        "units": "pixels",
                        "doc": "The minimum visual size to display tiles for this layer. Only configurable for raster layers."
                    },
                    "*": {
                        "type": "*",
                        "doc": "Other keys to configure the data source."
                    }
                },
                "source_geojson": {
                    "type": {
                        "required": true,
                        "type": "enum",
                        "values": ["geojson"],
                        "doc": "The data type of the GeoJSON source."
                    },
                    "data": {
                        "type": "*",
                        "doc": "A URL to a GeoJSON file, or inline GeoJSON."
                    },
                    "maxzoom": {
                        "type": "number",
                        "default": 14,
                        "doc": "Maximum zoom to preserve detail at."
                    },
                    "buffer": {
                        "type": "number",
                        "default": 64,
                        "doc": "Tile buffer on each side."
                    },
                    "tolerance": {
                        "type": "number",
                        "default": 3,
                        "doc": "Simplification tolerance (higher means simpler)."
                    }
                },
                "source_video": {
                    "type": {
                        "required": true,
                        "type": "enum",
                        "values": ["video"],
                        "doc": "The data type of the video source."
                    },
                    "urls": {
                        "required": true,
                        "type": "array",
                        "value": "string",
                        "doc": "URLs to video content in order of preferred format."
                    },
                    "coordinates": {
                        "required": true,
                        "doc": "Corners of video specified in longitude, latitude pairs.",
                        "type": "array",
                        "length": 4,
                        "value": {
                            "type": "array",
                            "length": 2,
                            "value": "number",
                            "doc": "A single longitude, latitude pair."
                        }
                    }
                },
                "source_image": {
                    "type": {
                        "required": true,
                        "type": "enum",
                        "values": ["image"],
                        "doc": "The data type of the image source."
                    },
                    "url": {
                        "required": true,
                        "type": "string",
                        "doc": "URL that points to an image"
                    },
                    "coordinates": {
                        "required": true,
                        "doc": "Corners of image specified in longitude, latitude pairs.",
                        "type": "array",
                        "length": 4,
                        "value": {
                            "type": "array",
                            "length": 2,
                            "value": "number",
                            "doc": "A single longitude, latitude pair."
                        }
                    }
                },
                "layer": {
                    "id": {
                        "type": "string",
                        "doc": "Unique layer name."
                    },
                    "type": {
                        "type": "enum",
                        "values": ["fill", "line", "symbol", "circle", "raster", "background"],
                        "doc": "Rendering type of this layer."
                    },
                    "metadata": {
                        "type": "*",
                        "doc": "Arbitrary properties useful to track with the layer, but do not influence rendering. Properties should be prefixed to avoid collisions, like 'mapbox:'."
                    },
                    "ref": {
                        "type": "string",
                        "doc": "References another layer to copy `type`, `source`, `source-layer`, `minzoom`, `maxzoom`, `filter`, and `layout` properties from. This allows the layers to share processing and be more efficient."
                    },
                    "source": {
                        "type": "string",
                        "doc": "Name of a source description to be used for this layer."
                    },
                    "source-layer": {
                        "type": "string",
                        "doc": "Layer to use from a vector tile source. Required if the source supports multiple layers."
                    },
                    "minzoom": {
                        "type": "number",
                        "minimum": 0,
                        "maximum": 22,
                        "doc": "The minimum zoom level on which the layer gets parsed and appears on."
                    },
                    "maxzoom": {
                        "type": "number",
                        "minimum": 0,
                        "maximum": 22,
                        "doc": "The maximum zoom level on which the layer gets parsed and appears on."
                    },
                    "interactive": {
                        "type": "boolean",
                        "doc": "Enable querying of feature data from this layer for interactivity.",
                        "default": false
                    },
                    "filter": {
                        "type": "filter",
                        "doc": "A expression specifying conditions on source features. Only features that match the filter are displayed."
                    },
                    "layout": {
                        "type": "layout",
                        "doc": "Layout properties for the layer."
                    },
                    "paint": {
                        "type": "paint",
                        "doc": "Default paint properties for this layer."
                    },
                    "paint.*": {
                        "type": "paint",
                        "doc": "Class-specific paint properties for this layer. The class name is the part after the first dot."
                    }
                },
                "layout": ["layout_fill", "layout_line", "layout_circle", "layout_symbol", "layout_raster", "layout_background"],
                "layout_background": {
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible",
                        "doc": "The display of this layer. `none` hides this layer."
                    }
                },
                "layout_fill": {
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible",
                        "doc": "The display of this layer. `none` hides this layer."
                    }
                },
                "layout_circle": {
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible",
                        "doc": "The display of this layer. `none` hides this layer."
                    }
                },
                "layout_line": {
                    "line-cap": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["butt", "round", "square"],
                        "default": "butt",
                        "doc": "The display of line endings."
                    },
                    "line-join": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["bevel", "round", "miter"],
                        "default": "miter",
                        "doc": "The display of lines when joining."
                    },
                    "line-miter-limit": {
                        "type": "number",
                        "default": 2,
                        "function": "interpolated",
                        "doc": "Used to automatically convert miter joins to bevel joins for sharp angles.",
                        "requires": [{
                            "line-join": "miter"
                        }]
                    },
                    "line-round-limit": {
                        "type": "number",
                        "default": 1.05,
                        "function": "interpolated",
                        "doc": "Used to automatically convert round joins to miter joins for shallow angles.",
                        "requires": [{
                            "line-join": "round"
                        }]
                    },
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible",
                        "doc": "The display of this layer. `none` hides this layer."
                    }
                },
                "layout_symbol": {
                    "symbol-placement": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["point", "line"],
                        "default": "point",
                        "doc": "Label placement relative to its geometry. `line` can only be used on LineStrings and Polygons."
                    },
                    "symbol-spacing": {
                        "type": "number",
                        "default": 250,
                        "minimum": 1,
                        "function": "interpolated",
                        "units": "pixels",
                        "doc": "Distance between two symbol anchors.",
                        "requires": [{
                            "symbol-placement": "line"
                        }]
                    },
                    "symbol-avoid-edges": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "doc": "If true, the symbols will not cross tile edges to avoid mutual collisions. Recommended in layers that don't have enough padding in the vector tile to prevent collisions, or if it is a point symbol layer placed after a line symbol layer."
                    },
                    "icon-allow-overlap": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "doc": "If true, the icon will be visible even if it collides with other previously drawn symbols.",
                        "requires": ["icon-image"]
                    },
                    "icon-ignore-placement": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "doc": "If true, other symbols can be visible even if they collide with the icon.",
                        "requires": ["icon-image"]
                    },
                    "icon-optional": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "doc": "If true, text will display without their corresponding icons when the icon collides with other symbols and the text does not.",
                        "requires": ["icon-image", "text-field"]
                    },
                    "icon-rotation-alignment": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "default": "viewport",
                        "doc": "Orientation of icon when map is rotated.",
                        "requires": ["icon-image"]
                    },
                    "icon-size": {
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "function": "interpolated",
                        "doc": "Scale factor for icon. 1 is original size, 3 triples the size.",
                        "requires": ["icon-image"]
                    },
                    "icon-image": {
                        "type": "string",
                        "function": "piecewise-constant",
                        "doc": "A string with {tokens} replaced, referencing the data property to pull from.",
                        "tokens": true
                    },
                    "icon-rotate": {
                        "type": "number",
                        "default": 0,
                        "period": 360,
                        "function": "interpolated",
                        "units": "degrees",
                        "doc": "Rotates the icon clockwise.",
                        "requires": ["icon-image"]
                    },
                    "icon-padding": {
                        "type": "number",
                        "default": 2,
                        "minimum": 0,
                        "function": "interpolated",
                        "units": "pixels",
                        "doc": "Size of the additional area around the icon bounding box used for detecting symbol collisions.",
                        "requires": ["icon-image"]
                    },
                    "icon-keep-upright": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "doc": "If true, the icon may be flipped to prevent it from being rendered upside-down.",
                        "requires": ["icon-image", {
                            "icon-rotation-alignment": "map"
                        }, {
                            "symbol-placement": "line"
                        }]
                    },
                    "icon-offset": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "doc": "Offset distance of icon from its anchor. Positive values indicate right and down, while negative values indicate left and up.",
                        "requires": ["icon-image"]
                    },
                    "text-rotation-alignment": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "default": "viewport",
                        "doc": "Orientation of text when map is rotated.",
                        "requires": ["text-field"]
                    },
                    "text-field": {
                        "type": "string",
                        "function": "piecewise-constant",
                        "default": "",
                        "tokens": true,
                        "doc": "Value to use for a text label. Feature properties are specified using tokens like {field_name}."
                    },
                    "text-font": {
                        "type": "array",
                        "value": "string",
                        "function": "piecewise-constant",
                        "default": ["Open Sans Regular", "Arial Unicode MS Regular"],
                        "doc": "Font stack to use for displaying text.",
                        "requires": ["text-field"]
                    },
                    "text-size": {
                        "type": "number",
                        "default": 16,
                        "minimum": 0,
                        "units": "pixels",
                        "function": "interpolated",
                        "doc": "Font size.",
                        "requires": ["text-field"]
                    },
                    "text-max-width": {
                        "type": "number",
                        "default": 10,
                        "minimum": 0,
                        "units": "em",
                        "function": "interpolated",
                        "doc": "The maximum line width for text wrapping.",
                        "requires": ["text-field"]
                    },
                    "text-line-height": {
                        "type": "number",
                        "default": 1.2,
                        "units": "em",
                        "function": "interpolated",
                        "doc": "Text leading value for multi-line text.",
                        "requires": ["text-field"]
                    },
                    "text-letter-spacing": {
                        "type": "number",
                        "default": 0,
                        "units": "em",
                        "function": "interpolated",
                        "doc": "Text tracking amount.",
                        "requires": ["text-field"]
                    },
                    "text-justify": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["left", "center", "right"],
                        "default": "center",
                        "doc": "Text justification options.",
                        "requires": ["text-field"]
                    },
                    "text-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"],
                        "default": "center",
                        "doc": "Part of the text placed closest to the anchor.",
                        "requires": ["text-field"]
                    },
                    "text-max-angle": {
                        "type": "number",
                        "default": 45,
                        "units": "degrees",
                        "function": "interpolated",
                        "doc": "Maximum angle change between adjacent characters.",
                        "requires": ["text-field", {
                            "symbol-placement": "line"
                        }]
                    },
                    "text-rotate": {
                        "type": "number",
                        "default": 0,
                        "period": 360,
                        "units": "degrees",
                        "function": "interpolated",
                        "doc": "Rotates the text clockwise.",
                        "requires": ["text-field"]
                    },
                    "text-padding": {
                        "type": "number",
                        "default": 2,
                        "minimum": 0,
                        "units": "pixels",
                        "function": "interpolated",
                        "doc": "Size of the additional area around the text bounding box used for detecting symbol collisions.",
                        "requires": ["text-field"]
                    },
                    "text-keep-upright": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": true,
                        "doc": "If true, the text may be flipped vertically to prevent it from being rendered upside-down.",
                        "requires": ["text-field", {
                            "text-rotation-alignment": "map"
                        }, {
                            "symbol-placement": "line"
                        }]
                    },
                    "text-transform": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["none", "uppercase", "lowercase"],
                        "default": "none",
                        "doc": "Specifies how to capitalize text, similar to the CSS `text-transform` property.",
                        "requires": ["text-field"]
                    },
                    "text-offset": {
                        "type": "array",
                        "doc": "Offset distance of text from its anchor. Positive values indicate right and down, while negative values indicate left and up.",
                        "value": "number",
                        "units": "ems",
                        "function": "interpolated",
                        "length": 2,
                        "default": [0, 0],
                        "requires": ["text-field"]
                    },
                    "text-allow-overlap": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "doc": "If true, the text will be visible even if it collides with other previously drawn symbols.",
                        "requires": ["text-field"]
                    },
                    "text-ignore-placement": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "doc": "If true, other symbols can be visible even if they collide with the text.",
                        "requires": ["text-field"]
                    },
                    "text-optional": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "doc": "If true, icons will display without their corresponding text when the text collides with other symbols and the icon does not.",
                        "requires": ["text-field", "icon-image"]
                    },
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible",
                        "doc": "The display of this layer. `none` hides this layer."
                    }
                },
                "layout_raster": {
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible",
                        "doc": "The display of this layer. `none` hides this layer."
                    }
                },
                "filter": {
                    "type": "array",
                    "value": "*",
                    "doc": "A filter selects specific features from a layer."
                },
                "filter_operator": {
                    "type": "enum",
                    "values": ["==", "!=", ">", ">=", "<", "<=", "in", "!in", "all", "any", "none"],
                    "doc": "The filter operator."
                },
                "geometry_type": {
                    "type": "enum",
                    "values": ["Point", "LineString", "Polygon"],
                    "doc": "The geometry type for the filter to select."
                },
                "color_operation": {
                    "type": "enum",
                    "values": ["lighten", "saturate", "spin", "fade", "mix"],
                    "doc": "A color operation to apply."
                },
                "function": {
                    "stops": {
                        "type": "array",
                        "required": true,
                        "doc": "An array of stops.",
                        "value": "function_stop"
                    },
                    "base": {
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "doc": "The exponential base of the interpolation curve. It controls the rate at which the result increases. Higher values make the result increase more towards the high end of the range. With `1` the stops are interpolated linearly."
                    }
                },
                "function_stop": {
                    "type": "array",
                    "minimum": 0,
                    "maximum": 22,
                    "value": ["number", "color"],
                    "length": 2,
                    "doc": "Zoom level and value pair."
                },
                "paint": ["paint_fill", "paint_line", "paint_circle", "paint_symbol", "paint_raster", "paint_background"],
                "paint_fill": {
                    "fill-antialias": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": true,
                        "doc": "Whether or not the fill should be antialiased."
                    },
                    "fill-opacity": {
                        "type": "number",
                        "function": "interpolated",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "doc": "The opacity given to the fill color.",
                        "transition": true
                    },
                    "fill-color": {
                        "type": "color",
                        "default": "#000000",
                        "doc": "The color of the fill.",
                        "function": "interpolated",
                        "transition": true,
                        "requires": [{
                            "!": "fill-pattern"
                        }]
                    },
                    "fill-outline-color": {
                        "type": "color",
                        "doc": "The outline color of the fill. Matches the value of `fill-color` if unspecified.",
                        "function": "interpolated",
                        "transition": true,
                        "requires": [{
                            "!": "fill-pattern"
                        }, {
                            "fill-antialias": true
                        }]
                    },
                    "fill-translate": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively."
                    },
                    "fill-translate-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "doc": "Control whether the translation is relative to the map (north) or viewport (screen)",
                        "default": "map",
                        "requires": ["fill-translate"]
                    },
                    "fill-pattern": {
                        "type": "string",
                        "function": "piecewise-constant",
                        "transition": true,
                        "doc": "Name of image in sprite to use for drawing image fills. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512)."
                    }
                },
                "paint_line": {
                    "line-opacity": {
                        "type": "number",
                        "doc": "The opacity at which the line will be drawn.",
                        "function": "interpolated",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "transition": true
                    },
                    "line-color": {
                        "type": "color",
                        "doc": "The color with which the line will be drawn.",
                        "default": "#000000",
                        "function": "interpolated",
                        "transition": true,
                        "requires": [{
                            "!": "line-pattern"
                        }]
                    },
                    "line-translate": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively."
                    },
                    "line-translate-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "doc": "Control whether the translation is relative to the map (north) or viewport (screen)",
                        "default": "map",
                        "requires": ["line-translate"]
                    },
                    "line-width": {
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "Stroke thickness."
                    },
                    "line-gap-width": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "doc": "Draws a line casing outside of a line's actual path. Value indicates the width of the inner gap.",
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels"
                    },
                    "line-offset": {
                        "type": "number",
                        "default": 0,
                        "doc": "The line's offset perpendicular to its direction. Values may be positive or negative, where positive indicates \"leftwards\" (if you were moving in the direction of the line) and negative indicates \"rightwards.\"",
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels"
                    },
                    "line-blur": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "Blur applied to the line, in pixels."
                    },
                    "line-dasharray": {
                        "type": "array",
                        "value": "number",
                        "function": "piecewise-constant",
                        "doc": "Specifies the lengths of the alternating dashes and gaps that form the dash pattern. The lengths are later scaled by the line width. To convert a dash length to pixels, multiply the length by the current line width.",
                        "minimum": 0,
                        "transition": true,
                        "units": "line widths",
                        "requires": [{
                            "!": "line-pattern"
                        }]
                    },
                    "line-pattern": {
                        "type": "string",
                        "function": "piecewise-constant",
                        "transition": true,
                        "doc": "Name of image in sprite to use for drawing image lines. For seamless patterns, image width must be a factor of two (2, 4, 8, ..., 512)."
                    }
                },
                "paint_circle": {
                    "circle-radius": {
                        "type": "number",
                        "default": 5,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "Circle radius."
                    },
                    "circle-color": {
                        "type": "color",
                        "default": "#000000",
                        "doc": "The color of the circle.",
                        "function": "interpolated",
                        "transition": true
                    },
                    "circle-blur": {
                        "type": "number",
                        "default": 0,
                        "doc": "Amount to blur the circle. 1 blurs the circle such that only the centerpoint is full opacity.",
                        "function": "interpolated",
                        "transition": true
                    },
                    "circle-opacity": {
                        "type": "number",
                        "doc": "The opacity at which the circle will be drawn.",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true
                    },
                    "circle-translate": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively."
                    },
                    "circle-translate-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "doc": "Control whether the translation is relative to the map (north) or viewport (screen)",
                        "default": "map",
                        "requires": ["circle-translate"]
                    }
                },
                "paint_symbol": {
                    "icon-opacity": {
                        "doc": "The opacity at which the icon will be drawn.",
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true,
                        "requires": ["icon-image"]
                    },
                    "icon-color": {
                        "type": "color",
                        "default": "#000000",
                        "function": "interpolated",
                        "transition": true,
                        "doc": "The color of the icon. This can only be used with sdf icons.",
                        "requires": ["icon-image"]
                    },
                    "icon-halo-color": {
                        "type": "color",
                        "default": "rgba(0, 0, 0, 0)",
                        "function": "interpolated",
                        "transition": true,
                        "doc": "The color of the icon's halo. Icon halos can only be used with sdf icons.",
                        "requires": ["icon-image"]
                    },
                    "icon-halo-width": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "Distance of halo to the icon outline.",
                        "requires": ["icon-image"]
                    },
                    "icon-halo-blur": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "Fade out the halo towards the outside.",
                        "requires": ["icon-image"]
                    },
                    "icon-translate": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "Distance that the icon's anchor is moved from its original placement. Positive values indicate right and down, while negative values indicate left and up.",
                        "requires": ["icon-image"]
                    },
                    "icon-translate-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "doc": "Control whether the translation is relative to the map (north) or viewport (screen).",
                        "default": "map",
                        "requires": ["icon-image", "icon-translate"]
                    },
                    "text-opacity": {
                        "type": "number",
                        "doc": "The opacity at which the text will be drawn.",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true,
                        "requires": ["text-field"]
                    },
                    "text-color": {
                        "type": "color",
                        "doc": "The color with which the text will be drawn.",
                        "default": "#000000",
                        "function": "interpolated",
                        "transition": true,
                        "requires": ["text-field"]
                    },
                    "text-halo-color": {
                        "type": "color",
                        "default": "rgba(0, 0, 0, 0)",
                        "function": "interpolated",
                        "transition": true,
                        "doc": "The color of the text's halo, which helps it stand out from backgrounds.",
                        "requires": ["text-field"]
                    },
                    "text-halo-width": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "Distance of halo to the font outline. Max text halo width is 1/4 of the font-size.",
                        "requires": ["text-field"]
                    },
                    "text-halo-blur": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "The halo's fadeout distance towards the outside.",
                        "requires": ["text-field"]
                    },
                    "text-translate": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "Distance that the text's anchor is moved from its original placement. Positive values indicate right and down, while negative values indicate left and up.",
                        "requires": ["text-field"]
                    },
                    "text-translate-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "doc": "Control whether the translation is relative to the map (north) or viewport (screen).",
                        "default": "map",
                        "requires": ["text-field", "text-translate"]
                    }
                },
                "paint_raster": {
                    "raster-opacity": {
                        "type": "number",
                        "doc": "The opacity at which the image will be drawn.",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true
                    },
                    "raster-hue-rotate": {
                        "type": "number",
                        "default": 0,
                        "period": 360,
                        "function": "interpolated",
                        "transition": true,
                        "units": "degrees",
                        "doc": "Rotates hues around the color wheel."
                    },
                    "raster-brightness-min": {
                        "type": "number",
                        "function": "interpolated",
                        "doc": "Increase or reduce the brightness of the image. The value is the minimum brightness.",
                        "default": 0,
                        "minimum": 0,
                        "maximum": 1,
                        "transition": true
                    },
                    "raster-brightness-max": {
                        "type": "number",
                        "function": "interpolated",
                        "doc": "Increase or reduce the brightness of the image. The value is the maximum brightness.",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "transition": true
                    },
                    "raster-saturation": {
                        "type": "number",
                        "doc": "Increase or reduce the saturation of the image.",
                        "default": 0,
                        "minimum": -1,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true
                    },
                    "raster-contrast": {
                        "type": "number",
                        "doc": "Increase or reduce the contrast of the image.",
                        "default": 0,
                        "minimum": -1,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true
                    },
                    "raster-fade-duration": {
                        "type": "number",
                        "default": 300,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "milliseconds",
                        "doc": "Fade duration when a new tile is added."
                    }
                },
                "paint_background": {
                    "background-color": {
                        "type": "color",
                        "default": "#000000",
                        "doc": "The color with which the background will be drawn.",
                        "function": "interpolated",
                        "transition": true,
                        "requires": [{
                            "!": "background-pattern"
                        }]
                    },
                    "background-pattern": {
                        "type": "string",
                        "function": "piecewise-constant",
                        "transition": true,
                        "doc": "Name of image in sprite to use for drawing an image background. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512)."
                    },
                    "background-opacity": {
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "doc": "The opacity at which the background will be drawn.",
                        "function": "interpolated",
                        "transition": true
                    }
                },
                "transition": {
                    "duration": {
                        "type": "number",
                        "default": 300,
                        "minimum": 0,
                        "units": "milliseconds",
                        "doc": "Time allotted for transitions to complete."
                    },
                    "delay": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "units": "milliseconds",
                        "doc": "Length of time before a transition begins."
                    }
                }
            }
        }, {}],
        127: [function(require, module, exports) {
            module.exports = {
                "$version": 8,
                "$root": {
                    "version": {
                        "required": true,
                        "type": "enum",
                        "values": [8]
                    },
                    "name": {
                        "type": "string"
                    },
                    "metadata": {
                        "type": "*"
                    },
                    "center": {
                        "type": "array",
                        "value": "number"
                    },
                    "zoom": {
                        "type": "number"
                    },
                    "bearing": {
                        "type": "number",
                        "default": 0,
                        "period": 360,
                        "units": "degrees"
                    },
                    "pitch": {
                        "type": "number",
                        "default": 0,
                        "units": "degrees"
                    },
                    "sources": {
                        "required": true,
                        "type": "sources"
                    },
                    "sprite": {
                        "type": "string"
                    },
                    "glyphs": {
                        "type": "string"
                    },
                    "transition": {
                        "type": "transition"
                    },
                    "layers": {
                        "required": true,
                        "type": "array",
                        "value": "layer"
                    }
                },
                "sources": {
                    "*": {
                        "type": "source"
                    }
                },
                "source": ["source_tile", "source_geojson", "source_video", "source_image"],
                "source_tile": {
                    "type": {
                        "required": true,
                        "type": "enum",
                        "values": ["vector", "raster"]
                    },
                    "url": {
                        "type": "string"
                    },
                    "tiles": {
                        "type": "array",
                        "value": "string"
                    },
                    "minzoom": {
                        "type": "number",
                        "default": 0
                    },
                    "maxzoom": {
                        "type": "number",
                        "default": 22
                    },
                    "tileSize": {
                        "type": "number",
                        "default": 512,
                        "units": "pixels"
                    },
                    "*": {
                        "type": "*"
                    }
                },
                "source_geojson": {
                    "type": {
                        "required": true,
                        "type": "enum",
                        "values": ["geojson"]
                    },
                    "data": {
                        "type": "*"
                    },
                    "maxzoom": {
                        "type": "number",
                        "default": 14
                    },
                    "buffer": {
                        "type": "number",
                        "default": 64
                    },
                    "tolerance": {
                        "type": "number",
                        "default": 3
                    }
                },
                "source_video": {
                    "type": {
                        "required": true,
                        "type": "enum",
                        "values": ["video"]
                    },
                    "urls": {
                        "required": true,
                        "type": "array",
                        "value": "string"
                    },
                    "coordinates": {
                        "required": true,
                        "type": "array",
                        "length": 4,
                        "value": {
                            "type": "array",
                            "length": 2,
                            "value": "number"
                        }
                    }
                },
                "source_image": {
                    "type": {
                        "required": true,
                        "type": "enum",
                        "values": ["image"]
                    },
                    "url": {
                        "required": true,
                        "type": "string"
                    },
                    "coordinates": {
                        "required": true,
                        "type": "array",
                        "length": 4,
                        "value": {
                            "type": "array",
                            "length": 2,
                            "value": "number"
                        }
                    }
                },
                "layer": {
                    "id": {
                        "type": "string"
                    },
                    "type": {
                        "type": "enum",
                        "values": ["fill", "line", "symbol", "circle", "raster", "background"]
                    },
                    "metadata": {
                        "type": "*"
                    },
                    "ref": {
                        "type": "string"
                    },
                    "source": {
                        "type": "string"
                    },
                    "source-layer": {
                        "type": "string"
                    },
                    "minzoom": {
                        "type": "number",
                        "minimum": 0,
                        "maximum": 22
                    },
                    "maxzoom": {
                        "type": "number",
                        "minimum": 0,
                        "maximum": 22
                    },
                    "interactive": {
                        "type": "boolean",
                        "default": false
                    },
                    "filter": {
                        "type": "filter"
                    },
                    "layout": {
                        "type": "layout"
                    },
                    "paint": {
                        "type": "paint"
                    },
                    "paint.*": {
                        "type": "paint"
                    }
                },
                "layout": ["layout_fill", "layout_line", "layout_circle", "layout_symbol", "layout_raster", "layout_background"],
                "layout_background": {
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible"
                    }
                },
                "layout_fill": {
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible"
                    }
                },
                "layout_circle": {
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible"
                    }
                },
                "layout_line": {
                    "line-cap": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["butt", "round", "square"],
                        "default": "butt"
                    },
                    "line-join": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["bevel", "round", "miter"],
                        "default": "miter"
                    },
                    "line-miter-limit": {
                        "type": "number",
                        "default": 2,
                        "function": "interpolated",
                        "requires": [{
                            "line-join": "miter"
                        }]
                    },
                    "line-round-limit": {
                        "type": "number",
                        "default": 1.05,
                        "function": "interpolated",
                        "requires": [{
                            "line-join": "round"
                        }]
                    },
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible"
                    }
                },
                "layout_symbol": {
                    "symbol-placement": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["point", "line"],
                        "default": "point"
                    },
                    "symbol-spacing": {
                        "type": "number",
                        "default": 250,
                        "minimum": 1,
                        "function": "interpolated",
                        "units": "pixels",
                        "requires": [{
                            "symbol-placement": "line"
                        }]
                    },
                    "symbol-avoid-edges": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false
                    },
                    "icon-allow-overlap": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "requires": ["icon-image"]
                    },
                    "icon-ignore-placement": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "requires": ["icon-image"]
                    },
                    "icon-optional": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "requires": ["icon-image", "text-field"]
                    },
                    "icon-rotation-alignment": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "default": "viewport",
                        "requires": ["icon-image"]
                    },
                    "icon-size": {
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "function": "interpolated",
                        "requires": ["icon-image"]
                    },
                    "icon-image": {
                        "type": "string",
                        "function": "piecewise-constant",
                        "tokens": true
                    },
                    "icon-rotate": {
                        "type": "number",
                        "default": 0,
                        "period": 360,
                        "function": "interpolated",
                        "units": "degrees",
                        "requires": ["icon-image"]
                    },
                    "icon-padding": {
                        "type": "number",
                        "default": 2,
                        "minimum": 0,
                        "function": "interpolated",
                        "units": "pixels",
                        "requires": ["icon-image"]
                    },
                    "icon-keep-upright": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "requires": ["icon-image", {
                            "icon-rotation-alignment": "map"
                        }, {
                            "symbol-placement": "line"
                        }]
                    },
                    "icon-offset": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "requires": ["icon-image"]
                    },
                    "text-rotation-alignment": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "default": "viewport",
                        "requires": ["text-field"]
                    },
                    "text-field": {
                        "type": "string",
                        "function": "piecewise-constant",
                        "default": "",
                        "tokens": true
                    },
                    "text-font": {
                        "type": "array",
                        "value": "string",
                        "function": "piecewise-constant",
                        "default": ["Open Sans Regular", "Arial Unicode MS Regular"],
                        "requires": ["text-field"]
                    },
                    "text-size": {
                        "type": "number",
                        "default": 16,
                        "minimum": 0,
                        "units": "pixels",
                        "function": "interpolated",
                        "requires": ["text-field"]
                    },
                    "text-max-width": {
                        "type": "number",
                        "default": 10,
                        "minimum": 0,
                        "units": "em",
                        "function": "interpolated",
                        "requires": ["text-field"]
                    },
                    "text-line-height": {
                        "type": "number",
                        "default": 1.2,
                        "units": "em",
                        "function": "interpolated",
                        "requires": ["text-field"]
                    },
                    "text-letter-spacing": {
                        "type": "number",
                        "default": 0,
                        "units": "em",
                        "function": "interpolated",
                        "requires": ["text-field"]
                    },
                    "text-justify": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["left", "center", "right"],
                        "default": "center",
                        "requires": ["text-field"]
                    },
                    "text-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"],
                        "default": "center",
                        "requires": ["text-field"]
                    },
                    "text-max-angle": {
                        "type": "number",
                        "default": 45,
                        "units": "degrees",
                        "function": "interpolated",
                        "requires": ["text-field", {
                            "symbol-placement": "line"
                        }]
                    },
                    "text-rotate": {
                        "type": "number",
                        "default": 0,
                        "period": 360,
                        "units": "degrees",
                        "function": "interpolated",
                        "requires": ["text-field"]
                    },
                    "text-padding": {
                        "type": "number",
                        "default": 2,
                        "minimum": 0,
                        "units": "pixels",
                        "function": "interpolated",
                        "requires": ["text-field"]
                    },
                    "text-keep-upright": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": true,
                        "requires": ["text-field", {
                            "text-rotation-alignment": "map"
                        }, {
                            "symbol-placement": "line"
                        }]
                    },
                    "text-transform": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["none", "uppercase", "lowercase"],
                        "default": "none",
                        "requires": ["text-field"]
                    },
                    "text-offset": {
                        "type": "array",
                        "value": "number",
                        "units": "ems",
                        "function": "interpolated",
                        "length": 2,
                        "default": [0, 0],
                        "requires": ["text-field"]
                    },
                    "text-allow-overlap": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "requires": ["text-field"]
                    },
                    "text-ignore-placement": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "requires": ["text-field"]
                    },
                    "text-optional": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "requires": ["text-field", "icon-image"]
                    },
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible"
                    }
                },
                "layout_raster": {
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible"
                    }
                },
                "filter": {
                    "type": "array",
                    "value": "*"
                },
                "filter_operator": {
                    "type": "enum",
                    "values": ["==", "!=", ">", ">=", "<", "<=", "in", "!in", "all", "any", "none"]
                },
                "geometry_type": {
                    "type": "enum",
                    "values": ["Point", "LineString", "Polygon"]
                },
                "color_operation": {
                    "type": "enum",
                    "values": ["lighten", "saturate", "spin", "fade", "mix"]
                },
                "function": {
                    "stops": {
                        "type": "array",
                        "required": true,
                        "value": "function_stop"
                    },
                    "base": {
                        "type": "number",
                        "default": 1,
                        "minimum": 0
                    }
                },
                "function_stop": {
                    "type": "array",
                    "minimum": 0,
                    "maximum": 22,
                    "value": ["number", "color"],
                    "length": 2
                },
                "paint": ["paint_fill", "paint_line", "paint_circle", "paint_symbol", "paint_raster", "paint_background"],
                "paint_fill": {
                    "fill-antialias": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": true
                    },
                    "fill-opacity": {
                        "type": "number",
                        "function": "interpolated",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "transition": true
                    },
                    "fill-color": {
                        "type": "color",
                        "default": "#000000",
                        "function": "interpolated",
                        "transition": true,
                        "requires": [{
                            "!": "fill-pattern"
                        }]
                    },
                    "fill-outline-color": {
                        "type": "color",
                        "function": "interpolated",
                        "transition": true,
                        "requires": [{
                            "!": "fill-pattern"
                        }, {
                            "fill-antialias": true
                        }]
                    },
                    "fill-translate": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels"
                    },
                    "fill-translate-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "default": "map",
                        "requires": ["fill-translate"]
                    },
                    "fill-pattern": {
                        "type": "string",
                        "function": "piecewise-constant",
                        "transition": true
                    }
                },
                "paint_line": {
                    "line-opacity": {
                        "type": "number",
                        "function": "interpolated",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "transition": true
                    },
                    "line-color": {
                        "type": "color",
                        "default": "#000000",
                        "function": "interpolated",
                        "transition": true,
                        "requires": [{
                            "!": "line-pattern"
                        }]
                    },
                    "line-translate": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels"
                    },
                    "line-translate-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "default": "map",
                        "requires": ["line-translate"]
                    },
                    "line-width": {
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels"
                    },
                    "line-gap-width": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels"
                    },
                    "line-offset": {
                        "type": "number",
                        "default": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels"
                    },
                    "line-blur": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels"
                    },
                    "line-dasharray": {
                        "type": "array",
                        "value": "number",
                        "function": "piecewise-constant",
                        "minimum": 0,
                        "transition": true,
                        "units": "line widths",
                        "requires": [{
                            "!": "line-pattern"
                        }]
                    },
                    "line-pattern": {
                        "type": "string",
                        "function": "piecewise-constant",
                        "transition": true
                    }
                },
                "paint_circle": {
                    "circle-radius": {
                        "type": "number",
                        "default": 5,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels"
                    },
                    "circle-color": {
                        "type": "color",
                        "default": "#000000",
                        "function": "interpolated",
                        "transition": true
                    },
                    "circle-blur": {
                        "type": "number",
                        "default": 0,
                        "function": "interpolated",
                        "transition": true
                    },
                    "circle-opacity": {
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true
                    },
                    "circle-translate": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels"
                    },
                    "circle-translate-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "default": "map",
                        "requires": ["circle-translate"]
                    }
                },
                "paint_symbol": {
                    "icon-opacity": {
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true,
                        "requires": ["icon-image"]
                    },
                    "icon-color": {
                        "type": "color",
                        "default": "#000000",
                        "function": "interpolated",
                        "transition": true,
                        "requires": ["icon-image"]
                    },
                    "icon-halo-color": {
                        "type": "color",
                        "default": "rgba(0, 0, 0, 0)",
                        "function": "interpolated",
                        "transition": true,
                        "requires": ["icon-image"]
                    },
                    "icon-halo-width": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "requires": ["icon-image"]
                    },
                    "icon-halo-blur": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "requires": ["icon-image"]
                    },
                    "icon-translate": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "requires": ["icon-image"]
                    },
                    "icon-translate-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "default": "map",
                        "requires": ["icon-image", "icon-translate"]
                    },
                    "text-opacity": {
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true,
                        "requires": ["text-field"]
                    },
                    "text-color": {
                        "type": "color",
                        "default": "#000000",
                        "function": "interpolated",
                        "transition": true,
                        "requires": ["text-field"]
                    },
                    "text-halo-color": {
                        "type": "color",
                        "default": "rgba(0, 0, 0, 0)",
                        "function": "interpolated",
                        "transition": true,
                        "requires": ["text-field"]
                    },
                    "text-halo-width": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "requires": ["text-field"]
                    },
                    "text-halo-blur": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "requires": ["text-field"]
                    },
                    "text-translate": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "requires": ["text-field"]
                    },
                    "text-translate-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "default": "map",
                        "requires": ["text-field", "text-translate"]
                    }
                },
                "paint_raster": {
                    "raster-opacity": {
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true
                    },
                    "raster-hue-rotate": {
                        "type": "number",
                        "default": 0,
                        "period": 360,
                        "function": "interpolated",
                        "transition": true,
                        "units": "degrees"
                    },
                    "raster-brightness-min": {
                        "type": "number",
                        "function": "interpolated",
                        "default": 0,
                        "minimum": 0,
                        "maximum": 1,
                        "transition": true
                    },
                    "raster-brightness-max": {
                        "type": "number",
                        "function": "interpolated",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "transition": true
                    },
                    "raster-saturation": {
                        "type": "number",
                        "default": 0,
                        "minimum": -1,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true
                    },
                    "raster-contrast": {
                        "type": "number",
                        "default": 0,
                        "minimum": -1,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true
                    },
                    "raster-fade-duration": {
                        "type": "number",
                        "default": 300,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "milliseconds"
                    }
                },
                "paint_background": {
                    "background-color": {
                        "type": "color",
                        "default": "#000000",
                        "function": "interpolated",
                        "transition": true,
                        "requires": [{
                            "!": "background-pattern"
                        }]
                    },
                    "background-pattern": {
                        "type": "string",
                        "function": "piecewise-constant",
                        "transition": true
                    },
                    "background-opacity": {
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true
                    }
                },
                "transition": {
                    "duration": {
                        "type": "number",
                        "default": 300,
                        "minimum": 0,
                        "units": "milliseconds"
                    },
                    "delay": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "units": "milliseconds"
                    }
                }
            }
        }, {}],
        128: [function(require, module, exports) {
            "use strict";

            function Buffer(t) {
                var e;
                t && t.length && (e = t, t = e.length);
                var r = new Uint8Array(t || 0);
                return e && r.set(e), r.readUInt32LE = BufferMethods.readUInt32LE, r.writeUInt32LE = BufferMethods.writeUInt32LE, r.readInt32LE = BufferMethods.readInt32LE, r.writeInt32LE = BufferMethods.writeInt32LE, r.readFloatLE = BufferMethods.readFloatLE, r.writeFloatLE = BufferMethods.writeFloatLE, r.readDoubleLE = BufferMethods.readDoubleLE, r.writeDoubleLE = BufferMethods.writeDoubleLE, r.toString = BufferMethods.toString, r.write = BufferMethods.write, r.slice = BufferMethods.slice, r.copy = BufferMethods.copy, r._isBuffer = !0, r
            }

            function encodeString(t) {
                for (var e, r, n = t.length, i = [], o = 0; n > o; o++) {
                    if (e = t.charCodeAt(o), e > 55295 && 57344 > e) {
                        if (!r) {
                            e > 56319 || o + 1 === n ? i.push(239, 191, 189) : r = e;
                            continue
                        }
                        if (56320 > e) {
                            i.push(239, 191, 189), r = e;
                            continue
                        }
                        e = r - 55296 << 10 | e - 56320 | 65536, r = null
                    } else r && (i.push(239, 191, 189), r = null);
                    128 > e ? i.push(e) : 2048 > e ? i.push(e >> 6 | 192, 63 & e | 128) : 65536 > e ? i.push(e >> 12 | 224, e >> 6 & 63 | 128, 63 & e | 128) : i.push(e >> 18 | 240, e >> 12 & 63 | 128, e >> 6 & 63 | 128, 63 & e | 128)
                }
                return i
            }
            module.exports = Buffer;
            var ieee754 = require("ieee754"),
                BufferMethods, lastStr, lastStrEncoded;
            BufferMethods = {
                readUInt32LE: function(t) {
                    return (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3]
                },
                writeUInt32LE: function(t, e) {
                    this[e] = t, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24
                },
                readInt32LE: function(t) {
                    return (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + (this[t + 3] << 24)
                },
                readFloatLE: function(t) {
                    return ieee754.read(this, t, !0, 23, 4)
                },
                readDoubleLE: function(t) {
                    return ieee754.read(this, t, !0, 52, 8)
                },
                writeFloatLE: function(t, e) {
                    return ieee754.write(this, t, e, !0, 23, 4)
                },
                writeDoubleLE: function(t, e) {
                    return ieee754.write(this, t, e, !0, 52, 8)
                },
                toString: function(t, e, r) {
                    var n = "",
                        i = "";
                    e = e || 0, r = Math.min(this.length, r || this.length);
                    for (var o = e; r > o; o++) {
                        var u = this[o];
                        127 >= u ? (n += decodeURIComponent(i) + String.fromCharCode(u), i = "") : i += "%" + u.toString(16)
                    }
                    return n += decodeURIComponent(i)
                },
                write: function(t, e) {
                    for (var r = t === lastStr ? lastStrEncoded : encodeString(t), n = 0; n < r.length; n++) this[e + n] = r[n]
                },
                slice: function(t, e) {
                    return this.subarray(t, e)
                },
                copy: function(t, e) {
                    e = e || 0;
                    for (var r = 0; r < this.length; r++) t[e + r] = this[r]
                }
            }, BufferMethods.writeInt32LE = BufferMethods.writeUInt32LE, Buffer.byteLength = function(t) {
                return lastStr = t, lastStrEncoded = encodeString(t), lastStrEncoded.length
            }, Buffer.isBuffer = function(t) {
                return !(!t || !t._isBuffer)
            };
        }, {
            "ieee754": 130
        }],
        129: [function(require, module, exports) {
            (function(global) {
                "use strict";

                function Pbf(t) {
                    this.buf = Buffer.isBuffer(t) ? t : new Buffer(t || 0), this.pos = 0, this.length = this.buf.length
                }

                function writePackedVarint(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeVarint(t[e])
                }

                function writePackedSVarint(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeSVarint(t[e])
                }

                function writePackedFloat(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeFloat(t[e])
                }

                function writePackedDouble(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeDouble(t[e])
                }

                function writePackedBoolean(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeBoolean(t[e])
                }

                function writePackedFixed32(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeFixed32(t[e])
                }

                function writePackedSFixed32(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeSFixed32(t[e])
                }

                function writePackedFixed64(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeFixed64(t[e])
                }

                function writePackedSFixed64(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeSFixed64(t[e])
                }
                module.exports = Pbf;
                var Buffer = global.Buffer || require("./buffer");
                Pbf.Varint = 0, Pbf.Fixed64 = 1, Pbf.Bytes = 2, Pbf.Fixed32 = 5;
                var SHIFT_LEFT_32 = 4294967296,
                    SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32,
                    POW_2_63 = Math.pow(2, 63);
                Pbf.prototype = {
                    destroy: function() {
                        this.buf = null
                    },
                    readFields: function(t, i, e) {
                        for (e = e || this.length; this.pos < e;) {
                            var r = this.readVarint(),
                                s = r >> 3,
                                n = this.pos;
                            t(s, i, this), this.pos === n && this.skip(r)
                        }
                        return i
                    },
                    readMessage: function(t, i) {
                        return this.readFields(t, i, this.readVarint() + this.pos)
                    },
                    readFixed32: function() {
                        var t = this.buf.readUInt32LE(this.pos);
                        return this.pos += 4, t
                    },
                    readSFixed32: function() {
                        var t = this.buf.readInt32LE(this.pos);
                        return this.pos += 4, t
                    },
                    readFixed64: function() {
                        var t = this.buf.readUInt32LE(this.pos) + this.buf.readUInt32LE(this.pos + 4) * SHIFT_LEFT_32;
                        return this.pos += 8, t
                    },
                    readSFixed64: function() {
                        var t = this.buf.readUInt32LE(this.pos) + this.buf.readInt32LE(this.pos + 4) * SHIFT_LEFT_32;
                        return this.pos += 8, t
                    },
                    readFloat: function() {
                        var t = this.buf.readFloatLE(this.pos);
                        return this.pos += 4, t
                    },
                    readDouble: function() {
                        var t = this.buf.readDoubleLE(this.pos);
                        return this.pos += 8, t
                    },
                    readVarint: function() {
                        var t, i, e, r, s, n, o = this.buf;
                        if (e = o[this.pos++], 128 > e) return e;
                        if (e = 127 & e, r = o[this.pos++], 128 > r) return e | r << 7;
                        if (r = (127 & r) << 7, s = o[this.pos++], 128 > s) return e | r | s << 14;
                        if (s = (127 & s) << 14, n = o[this.pos++], 128 > n) return e | r | s | n << 21;
                        if (t = e | r | s | (127 & n) << 21, i = o[this.pos++], t += 268435456 * (127 & i), 128 > i) return t;
                        if (i = o[this.pos++], t += 34359738368 * (127 & i), 128 > i) return t;
                        if (i = o[this.pos++], t += 4398046511104 * (127 & i), 128 > i) return t;
                        if (i = o[this.pos++], t += 562949953421312 * (127 & i), 128 > i) return t;
                        if (i = o[this.pos++], t += 72057594037927940 * (127 & i), 128 > i) return t;
                        if (i = o[this.pos++], t += 0x8000000000000000 * (127 & i), 128 > i) return t;
                        throw new Error("Expected varint not more than 10 bytes")
                    },
                    readVarint64: function() {
                        var t = this.pos,
                            i = this.readVarint();
                        if (POW_2_63 > i) return i;
                        for (var e = this.pos - 2; 255 === this.buf[e];) e--;
                        t > e && (e = t), i = 0;
                        for (var r = 0; e - t + 1 > r; r++) {
                            var s = 127 & ~this.buf[t + r];
                            i += 4 > r ? s << 7 * r : s * Math.pow(2, 7 * r)
                        }
                        return -i - 1
                    },
                    readSVarint: function() {
                        var t = this.readVarint();
                        return t % 2 === 1 ? (t + 1) / -2 : t / 2
                    },
                    readBoolean: function() {
                        return Boolean(this.readVarint())
                    },
                    readString: function() {
                        var t = this.readVarint() + this.pos,
                            i = this.buf.toString("utf8", this.pos, t);
                        return this.pos = t, i
                    },
                    readBytes: function() {
                        var t = this.readVarint() + this.pos,
                            i = this.buf.slice(this.pos, t);
                        return this.pos = t, i
                    },
                    readPackedVarint: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readVarint());
                        return i
                    },
                    readPackedSVarint: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readSVarint());
                        return i
                    },
                    readPackedBoolean: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readBoolean());
                        return i
                    },
                    readPackedFloat: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readFloat());
                        return i
                    },
                    readPackedDouble: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readDouble());
                        return i
                    },
                    readPackedFixed32: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readFixed32());
                        return i
                    },
                    readPackedSFixed32: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readSFixed32());
                        return i
                    },
                    readPackedFixed64: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readFixed64());
                        return i
                    },
                    readPackedSFixed64: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readSFixed64());
                        return i
                    },
                    skip: function(t) {
                        var i = 7 & t;
                        if (i === Pbf.Varint)
                            for (; this.buf[this.pos++] > 127;);
                        else if (i === Pbf.Bytes) this.pos = this.readVarint() + this.pos;
                        else if (i === Pbf.Fixed32) this.pos += 4;
                        else {
                            if (i !== Pbf.Fixed64) throw new Error("Unimplemented type: " + i);
                            this.pos += 8
                        }
                    },
                    writeTag: function(t, i) {
                        this.writeVarint(t << 3 | i)
                    },
                    realloc: function(t) {
                        for (var i = this.length || 16; i < this.pos + t;) i *= 2;
                        if (i !== this.length) {
                            var e = new Buffer(i);
                            this.buf.copy(e), this.buf = e, this.length = i
                        }
                    },
                    finish: function() {
                        return this.length = this.pos, this.pos = 0, this.buf.slice(0, this.length)
                    },
                    writeFixed32: function(t) {
                        this.realloc(4), this.buf.writeUInt32LE(t, this.pos), this.pos += 4
                    },
                    writeSFixed32: function(t) {
                        this.realloc(4), this.buf.writeInt32LE(t, this.pos), this.pos += 4
                    },
                    writeFixed64: function(t) {
                        this.realloc(8), this.buf.writeInt32LE(-1 & t, this.pos), this.buf.writeUInt32LE(Math.floor(t * SHIFT_RIGHT_32), this.pos + 4), this.pos += 8
                    },
                    writeSFixed64: function(t) {
                        this.realloc(8), this.buf.writeInt32LE(-1 & t, this.pos), this.buf.writeInt32LE(Math.floor(t * SHIFT_RIGHT_32), this.pos + 4), this.pos += 8
                    },
                    writeVarint: function(t) {
                        if (t = +t, 127 >= t) this.realloc(1), this.buf[this.pos++] = t;
                        else if (16383 >= t) this.realloc(2), this.buf[this.pos++] = t >>> 0 & 127 | 128, this.buf[this.pos++] = t >>> 7 & 127;
                        else if (2097151 >= t) this.realloc(3), this.buf[this.pos++] = t >>> 0 & 127 | 128, this.buf[this.pos++] = t >>> 7 & 127 | 128, this.buf[this.pos++] = t >>> 14 & 127;
                        else if (268435455 >= t) this.realloc(4), this.buf[this.pos++] = t >>> 0 & 127 | 128, this.buf[this.pos++] = t >>> 7 & 127 | 128, this.buf[this.pos++] = t >>> 14 & 127 | 128, this.buf[this.pos++] = t >>> 21 & 127;
                        else {
                            for (var i = this.pos; t >= 128;) this.realloc(1), this.buf[this.pos++] = 255 & t | 128, t /= 128;
                            if (this.realloc(1), this.buf[this.pos++] = 0 | t, this.pos - i > 10) throw new Error("Given varint doesn't fit into 10 bytes")
                        }
                    },
                    writeSVarint: function(t) {
                        this.writeVarint(0 > t ? 2 * -t - 1 : 2 * t)
                    },
                    writeBoolean: function(t) {
                        this.writeVarint(Boolean(t))
                    },
                    writeString: function(t) {
                        t = String(t);
                        var i = Buffer.byteLength(t);
                        this.writeVarint(i), this.realloc(i), this.buf.write(t, this.pos), this.pos += i
                    },
                    writeFloat: function(t) {
                        this.realloc(4), this.buf.writeFloatLE(t, this.pos), this.pos += 4
                    },
                    writeDouble: function(t) {
                        this.realloc(8), this.buf.writeDoubleLE(t, this.pos), this.pos += 8
                    },
                    writeBytes: function(t) {
                        var i = t.length;
                        this.writeVarint(i), this.realloc(i);
                        for (var e = 0; i > e; e++) this.buf[this.pos++] = t[e]
                    },
                    writeRawMessage: function(t, i) {
                        this.pos++;
                        var e = this.pos;
                        t(i, this);
                        var r = this.pos - e,
                            s = 127 >= r ? 1 : 16383 >= r ? 2 : 2097151 >= r ? 3 : 268435455 >= r ? 4 : Math.ceil(Math.log(r) / (7 * Math.LN2));
                        if (s > 1) {
                            this.realloc(s - 1);
                            for (var n = this.pos - 1; n >= e; n--) this.buf[n + s - 1] = this.buf[n]
                        }
                        this.pos = e - 1, this.writeVarint(r), this.pos += r
                    },
                    writeMessage: function(t, i, e) {
                        this.writeTag(t, Pbf.Bytes), this.writeRawMessage(i, e)
                    },
                    writePackedVarint: function(t, i) {
                        this.writeMessage(t, writePackedVarint, i)
                    },
                    writePackedSVarint: function(t, i) {
                        this.writeMessage(t, writePackedSVarint, i)
                    },
                    writePackedBoolean: function(t, i) {
                        this.writeMessage(t, writePackedBoolean, i)
                    },
                    writePackedFloat: function(t, i) {
                        this.writeMessage(t, writePackedFloat, i)
                    },
                    writePackedDouble: function(t, i) {
                        this.writeMessage(t, writePackedDouble, i)
                    },
                    writePackedFixed32: function(t, i) {
                        this.writeMessage(t, writePackedFixed32, i)
                    },
                    writePackedSFixed32: function(t, i) {
                        this.writeMessage(t, writePackedSFixed32, i)
                    },
                    writePackedFixed64: function(t, i) {
                        this.writeMessage(t, writePackedFixed64, i)
                    },
                    writePackedSFixed64: function(t, i) {
                        this.writeMessage(t, writePackedSFixed64, i)
                    },
                    writeBytesField: function(t, i) {
                        this.writeTag(t, Pbf.Bytes), this.writeBytes(i)
                    },
                    writeFixed32Field: function(t, i) {
                        this.writeTag(t, Pbf.Fixed32), this.writeFixed32(i)
                    },
                    writeSFixed32Field: function(t, i) {
                        this.writeTag(t, Pbf.Fixed32), this.writeSFixed32(i)
                    },
                    writeFixed64Field: function(t, i) {
                        this.writeTag(t, Pbf.Fixed64), this.writeFixed64(i)
                    },
                    writeSFixed64Field: function(t, i) {
                        this.writeTag(t, Pbf.Fixed64), this.writeSFixed64(i)
                    },
                    writeVarintField: function(t, i) {
                        this.writeTag(t, Pbf.Varint), this.writeVarint(i)
                    },
                    writeSVarintField: function(t, i) {
                        this.writeTag(t, Pbf.Varint), this.writeSVarint(i)
                    },
                    writeStringField: function(t, i) {
                        this.writeTag(t, Pbf.Bytes), this.writeString(i)
                    },
                    writeFloatField: function(t, i) {
                        this.writeTag(t, Pbf.Fixed32), this.writeFloat(i)
                    },
                    writeDoubleField: function(t, i) {
                        this.writeTag(t, Pbf.Fixed64), this.writeDouble(i)
                    },
                    writeBooleanField: function(t, i) {
                        this.writeVarintField(t, Boolean(i))
                    }
                };
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

        }, {
            "./buffer": 128
        }],
        130: [function(require, module, exports) {
            exports.read = function(a, o, t, r, h) {
                var M, p, w = 8 * h - r - 1,
                    f = (1 << w) - 1,
                    e = f >> 1,
                    i = -7,
                    N = t ? h - 1 : 0,
                    n = t ? -1 : 1,
                    s = a[o + N];
                for (N += n, M = s & (1 << -i) - 1, s >>= -i, i += w; i > 0; M = 256 * M + a[o + N], N += n, i -= 8);
                for (p = M & (1 << -i) - 1, M >>= -i, i += r; i > 0; p = 256 * p + a[o + N], N += n, i -= 8);
                if (0 === M) M = 1 - e;
                else {
                    if (M === f) return p ? NaN : (s ? -1 : 1) * (1 / 0);
                    p += Math.pow(2, r), M -= e
                }
                return (s ? -1 : 1) * p * Math.pow(2, M - r)
            }, exports.write = function(a, o, t, r, h, M) {
                var p, w, f, e = 8 * M - h - 1,
                    i = (1 << e) - 1,
                    N = i >> 1,
                    n = 23 === h ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                    s = r ? 0 : M - 1,
                    u = r ? 1 : -1,
                    l = 0 > o || 0 === o && 0 > 1 / o ? 1 : 0;
                for (o = Math.abs(o), isNaN(o) || o === 1 / 0 ? (w = isNaN(o) ? 1 : 0, p = i) : (p = Math.floor(Math.log(o) / Math.LN2), o * (f = Math.pow(2, -p)) < 1 && (p--, f *= 2), o += p + N >= 1 ? n / f : n * Math.pow(2, 1 - N), o * f >= 2 && (p++, f /= 2), p + N >= i ? (w = 0, p = i) : p + N >= 1 ? (w = (o * f - 1) * Math.pow(2, h), p += N) : (w = o * Math.pow(2, N - 1) * Math.pow(2, h), p = 0)); h >= 8; a[t + s] = 255 & w, s += u, w /= 256, h -= 8);
                for (p = p << h | w, e += h; e > 0; a[t + s] = 255 & p, s += u, p /= 256, e -= 8);
                a[t + s - u] |= 128 * l
            };
        }, {}],
        131: [function(require, module, exports) {
            "use strict";

            function Point(t, n) {
                this.x = t, this.y = n
            }
            module.exports = Point, Point.prototype = {
                clone: function() {
                    return new Point(this.x, this.y)
                },
                add: function(t) {
                    return this.clone()._add(t)
                },
                sub: function(t) {
                    return this.clone()._sub(t)
                },
                mult: function(t) {
                    return this.clone()._mult(t)
                },
                div: function(t) {
                    return this.clone()._div(t)
                },
                rotate: function(t) {
                    return this.clone()._rotate(t)
                },
                matMult: function(t) {
                    return this.clone()._matMult(t)
                },
                unit: function() {
                    return this.clone()._unit()
                },
                perp: function() {
                    return this.clone()._perp()
                },
                round: function() {
                    return this.clone()._round()
                },
                mag: function() {
                    return Math.sqrt(this.x * this.x + this.y * this.y)
                },
                equals: function(t) {
                    return this.x === t.x && this.y === t.y
                },
                dist: function(t) {
                    return Math.sqrt(this.distSqr(t))
                },
                distSqr: function(t) {
                    var n = t.x - this.x,
                        i = t.y - this.y;
                    return n * n + i * i
                },
                angle: function() {
                    return Math.atan2(this.y, this.x)
                },
                angleTo: function(t) {
                    return Math.atan2(this.y - t.y, this.x - t.x)
                },
                angleWith: function(t) {
                    return this.angleWithSep(t.x, t.y)
                },
                angleWithSep: function(t, n) {
                    return Math.atan2(this.x * n - this.y * t, this.x * t + this.y * n)
                },
                _matMult: function(t) {
                    var n = t[0] * this.x + t[1] * this.y,
                        i = t[2] * this.x + t[3] * this.y;
                    return this.x = n, this.y = i, this
                },
                _add: function(t) {
                    return this.x += t.x, this.y += t.y, this
                },
                _sub: function(t) {
                    return this.x -= t.x, this.y -= t.y, this
                },
                _mult: function(t) {
                    return this.x *= t, this.y *= t, this
                },
                _div: function(t) {
                    return this.x /= t, this.y /= t, this
                },
                _unit: function() {
                    return this._div(this.mag()), this
                },
                _perp: function() {
                    var t = this.y;
                    return this.y = this.x, this.x = -t, this
                },
                _rotate: function(t) {
                    var n = Math.cos(t),
                        i = Math.sin(t),
                        s = n * this.x - i * this.y,
                        r = i * this.x + n * this.y;
                    return this.x = s, this.y = r, this
                },
                _round: function() {
                    return this.x = Math.round(this.x), this.y = Math.round(this.y), this
                }
            }, Point.convert = function(t) {
                return t instanceof Point ? t : Array.isArray(t) ? new Point(t[0], t[1]) : t
            };
        }, {}],
        132: [function(require, module, exports) {
            ! function() {
                "use strict";

                function t(i, n) {
                    return this instanceof t ? (this._maxEntries = Math.max(4, i || 9), this._minEntries = Math.max(2, Math.ceil(.4 * this._maxEntries)), n && this._initFormat(n), void this.clear()) : new t(i, n)
                }

                function i(t, i) {
                    t.bbox = n(t, 0, t.children.length, i)
                }

                function n(t, i, n, r) {
                    for (var o, a = e(), s = i; n > s; s++) o = t.children[s], h(a, t.leaf ? r(o) : o.bbox);
                    return a
                }

                function e() {
                    return [1 / 0, 1 / 0, -(1 / 0), -(1 / 0)]
                }

                function h(t, i) {
                    return t[0] = Math.min(t[0], i[0]), t[1] = Math.min(t[1], i[1]), t[2] = Math.max(t[2], i[2]), t[3] = Math.max(t[3], i[3]), t
                }

                function r(t, i) {
                    return t.bbox[0] - i.bbox[0]
                }

                function o(t, i) {
                    return t.bbox[1] - i.bbox[1]
                }

                function a(t) {
                    return (t[2] - t[0]) * (t[3] - t[1])
                }

                function s(t) {
                    return t[2] - t[0] + (t[3] - t[1])
                }

                function l(t, i) {
                    return (Math.max(i[2], t[2]) - Math.min(i[0], t[0])) * (Math.max(i[3], t[3]) - Math.min(i[1], t[1]))
                }

                function u(t, i) {
                    var n = Math.max(t[0], i[0]),
                        e = Math.max(t[1], i[1]),
                        h = Math.min(t[2], i[2]),
                        r = Math.min(t[3], i[3]);
                    return Math.max(0, h - n) * Math.max(0, r - e)
                }

                function c(t, i) {
                    return t[0] <= i[0] && t[1] <= i[1] && i[2] <= t[2] && i[3] <= t[3]
                }

                function f(t, i) {
                    return i[0] <= t[2] && i[1] <= t[3] && i[2] >= t[0] && i[3] >= t[1]
                }

                function d(t, i, n, e, h) {
                    for (var r, o = [i, n]; o.length;) n = o.pop(), i = o.pop(), e >= n - i || (r = i + Math.ceil((n - i) / e / 2) * e, x(t, i, n, r, h), o.push(i, r, r, n))
                }

                function x(t, i, n, e, h) {
                    for (var r, o, a, s, l, u, c, f, d; n > i;) {
                        for (n - i > 600 && (r = n - i + 1, o = e - i + 1, a = Math.log(r), s = .5 * Math.exp(2 * a / 3), l = .5 * Math.sqrt(a * s * (r - s) / r) * (0 > o - r / 2 ? -1 : 1), u = Math.max(i, Math.floor(e - o * s / r + l)), c = Math.min(n, Math.floor(e + (r - o) * s / r + l)), x(t, u, c, e, h)), f = t[e], o = i, d = n, p(t, i, e), h(t[n], f) > 0 && p(t, i, n); d > o;) {
                            for (p(t, o, d), o++, d--; h(t[o], f) < 0;) o++;
                            for (; h(t[d], f) > 0;) d--
                        }
                        0 === h(t[i], f) ? p(t, i, d) : (d++, p(t, d, n)), e >= d && (i = d + 1), d >= e && (n = d - 1)
                    }
                }

                function p(t, i, n) {
                    var e = t[i];
                    t[i] = t[n], t[n] = e
                }
                t.prototype = {
                    all: function() {
                        return this._all(this.data, [])
                    },
                    search: function(t) {
                        var i = this.data,
                            n = [],
                            e = this.toBBox;
                        if (!f(t, i.bbox)) return n;
                        for (var h, r, o, a, s = []; i;) {
                            for (h = 0, r = i.children.length; r > h; h++) o = i.children[h], a = i.leaf ? e(o) : o.bbox, f(t, a) && (i.leaf ? n.push(o) : c(t, a) ? this._all(o, n) : s.push(o));
                            i = s.pop()
                        }
                        return n
                    },
                    collides: function(t) {
                        var i = this.data,
                            n = this.toBBox;
                        if (!f(t, i.bbox)) return !1;
                        for (var e, h, r, o, a = []; i;) {
                            for (e = 0, h = i.children.length; h > e; e++)
                                if (r = i.children[e], o = i.leaf ? n(r) : r.bbox, f(t, o)) {
                                    if (i.leaf || c(t, o)) return !0;
                                    a.push(r)
                                }
                            i = a.pop()
                        }
                        return !1
                    },
                    load: function(t) {
                        if (!t || !t.length) return this;
                        if (t.length < this._minEntries) {
                            for (var i = 0, n = t.length; n > i; i++) this.insert(t[i]);
                            return this
                        }
                        var e = this._build(t.slice(), 0, t.length - 1, 0);
                        if (this.data.children.length)
                            if (this.data.height === e.height) this._splitRoot(this.data, e);
                            else {
                                if (this.data.height < e.height) {
                                    var h = this.data;
                                    this.data = e, e = h
                                }
                                this._insert(e, this.data.height - e.height - 1, !0)
                            } else this.data = e;
                        return this
                    },
                    insert: function(t) {
                        return t && this._insert(t, this.data.height - 1), this
                    },
                    clear: function() {
                        return this.data = {
                            children: [],
                            height: 1,
                            bbox: e(),
                            leaf: !0
                        }, this
                    },
                    remove: function(t) {
                        if (!t) return this;
                        for (var i, n, e, h, r = this.data, o = this.toBBox(t), a = [], s = []; r || a.length;) {
                            if (r || (r = a.pop(), n = a[a.length - 1], i = s.pop(), h = !0), r.leaf && (e = r.children.indexOf(t), -1 !== e)) return r.children.splice(e, 1), a.push(r), this._condense(a), this;
                            h || r.leaf || !c(r.bbox, o) ? n ? (i++, r = n.children[i], h = !1) : r = null : (a.push(r), s.push(i), i = 0, n = r, r = r.children[0])
                        }
                        return this
                    },
                    toBBox: function(t) {
                        return t
                    },
                    compareMinX: function(t, i) {
                        return t[0] - i[0]
                    },
                    compareMinY: function(t, i) {
                        return t[1] - i[1]
                    },
                    toJSON: function() {
                        return this.data
                    },
                    fromJSON: function(t) {
                        return this.data = t, this
                    },
                    _all: function(t, i) {
                        for (var n = []; t;) t.leaf ? i.push.apply(i, t.children) : n.push.apply(n, t.children), t = n.pop();
                        return i
                    },
                    _build: function(t, n, e, h) {
                        var r, o = e - n + 1,
                            a = this._maxEntries;
                        if (a >= o) return r = {
                            children: t.slice(n, e + 1),
                            height: 1,
                            bbox: null,
                            leaf: !0
                        }, i(r, this.toBBox), r;
                        h || (h = Math.ceil(Math.log(o) / Math.log(a)), a = Math.ceil(o / Math.pow(a, h - 1))), r = {
                            children: [],
                            height: h,
                            bbox: null
                        };
                        var s, l, u, c, f = Math.ceil(o / a),
                            x = f * Math.ceil(Math.sqrt(a));
                        for (d(t, n, e, x, this.compareMinX), s = n; e >= s; s += x)
                            for (u = Math.min(s + x - 1, e), d(t, s, u, f, this.compareMinY), l = s; u >= l; l += f) c = Math.min(l + f - 1, u), r.children.push(this._build(t, l, c, h - 1));
                        return i(r, this.toBBox), r
                    },
                    _chooseSubtree: function(t, i, n, e) {
                        for (var h, r, o, s, u, c, f, d;;) {
                            if (e.push(i), i.leaf || e.length - 1 === n) break;
                            for (f = d = 1 / 0, h = 0, r = i.children.length; r > h; h++) o = i.children[h], u = a(o.bbox), c = l(t, o.bbox) - u, d > c ? (d = c, f = f > u ? u : f, s = o) : c === d && f > u && (f = u, s = o);
                            i = s
                        }
                        return i
                    },
                    _insert: function(t, i, n) {
                        var e = this.toBBox,
                            r = n ? t.bbox : e(t),
                            o = [],
                            a = this._chooseSubtree(r, this.data, i, o);
                        for (a.children.push(t), h(a.bbox, r); i >= 0 && o[i].children.length > this._maxEntries;) this._split(o, i), i--;
                        this._adjustParentBBoxes(r, o, i)
                    },
                    _split: function(t, n) {
                        var e = t[n],
                            h = e.children.length,
                            r = this._minEntries;
                        this._chooseSplitAxis(e, r, h);
                        var o = this._chooseSplitIndex(e, r, h),
                            a = {
                                children: e.children.splice(o, e.children.length - o),
                                height: e.height
                            };
                        e.leaf && (a.leaf = !0), i(e, this.toBBox), i(a, this.toBBox), n ? t[n - 1].children.push(a) : this._splitRoot(e, a)
                    },
                    _splitRoot: function(t, n) {
                        this.data = {
                            children: [t, n],
                            height: t.height + 1
                        }, i(this.data, this.toBBox)
                    },
                    _chooseSplitIndex: function(t, i, e) {
                        var h, r, o, s, l, c, f, d;
                        for (c = f = 1 / 0, h = i; e - i >= h; h++) r = n(t, 0, h, this.toBBox), o = n(t, h, e, this.toBBox), s = u(r, o), l = a(r) + a(o), c > s ? (c = s, d = h, f = f > l ? l : f) : s === c && f > l && (f = l, d = h);
                        return d
                    },
                    _chooseSplitAxis: function(t, i, n) {
                        var e = t.leaf ? this.compareMinX : r,
                            h = t.leaf ? this.compareMinY : o,
                            a = this._allDistMargin(t, i, n, e),
                            s = this._allDistMargin(t, i, n, h);
                        s > a && t.children.sort(e)
                    },
                    _allDistMargin: function(t, i, e, r) {
                        t.children.sort(r);
                        var o, a, l = this.toBBox,
                            u = n(t, 0, i, l),
                            c = n(t, e - i, e, l),
                            f = s(u) + s(c);
                        for (o = i; e - i > o; o++) a = t.children[o], h(u, t.leaf ? l(a) : a.bbox), f += s(u);
                        for (o = e - i - 1; o >= i; o--) a = t.children[o], h(c, t.leaf ? l(a) : a.bbox), f += s(c);
                        return f
                    },
                    _adjustParentBBoxes: function(t, i, n) {
                        for (var e = n; e >= 0; e--) h(i[e].bbox, t)
                    },
                    _condense: function(t) {
                        for (var n, e = t.length - 1; e >= 0; e--) 0 === t[e].children.length ? e > 0 ? (n = t[e - 1].children, n.splice(n.indexOf(t[e]), 1)) : this.clear() : i(t[e], this.toBBox)
                    },
                    _initFormat: function(t) {
                        var i = ["return a", " - b", ";"];
                        this.compareMinX = new Function("a", "b", i.join(t[0])), this.compareMinY = new Function("a", "b", i.join(t[1])), this.toBBox = new Function("a", "return [a" + t.join(", a") + "];")
                    }
                }, "function" == typeof define && define.amd ? define("rbush", function() {
                    return t
                }) : "undefined" != typeof module ? module.exports = t : "undefined" != typeof self ? self.rbush = t : window.rbush = t
            }();
        }, {}],
        133: [function(require, module, exports) {
            void
            function(e, r) {
                "function" == typeof define && define.amd ? define(r) : "object" == typeof exports ? module.exports = r() : e.resolveUrl = r()
            }(this, function() {
                function e() {
                    var e = arguments.length;
                    if (0 === e) throw new Error("resolveUrl requires at least one argument; got none.");
                    var r = document.createElement("base");
                    if (r.href = arguments[0], 1 === e) return r.href;
                    var t = document.getElementsByTagName("head")[0];
                    t.insertBefore(r, t.firstChild);
                    for (var n, o = document.createElement("a"), f = 1; e > f; f++) o.href = arguments[f], n = o.href, r.href = n;
                    return t.removeChild(r), n
                }
                return e
            });
        }, {}],
        134: [function(require, module, exports) {
            function UnitBezier(t, i, e, r) {
                this.cx = 3 * t, this.bx = 3 * (e - t) - this.cx, this.ax = 1 - this.cx - this.bx, this.cy = 3 * i, this.by = 3 * (r - i) - this.cy, this.ay = 1 - this.cy - this.by, this.p1x = t, this.p1y = r, this.p2x = e, this.p2y = r
            }
            module.exports = UnitBezier, UnitBezier.prototype.sampleCurveX = function(t) {
                return ((this.ax * t + this.bx) * t + this.cx) * t
            }, UnitBezier.prototype.sampleCurveY = function(t) {
                return ((this.ay * t + this.by) * t + this.cy) * t
            }, UnitBezier.prototype.sampleCurveDerivativeX = function(t) {
                return (3 * this.ax * t + 2 * this.bx) * t + this.cx
            }, UnitBezier.prototype.solveCurveX = function(t, i) {
                "undefined" == typeof i && (i = 1e-6);
                var e, r, s, h, n;
                for (s = t, n = 0; 8 > n; n++) {
                    if (h = this.sampleCurveX(s) - t, Math.abs(h) < i) return s;
                    var u = this.sampleCurveDerivativeX(s);
                    if (Math.abs(u) < 1e-6) break;
                    s -= h / u
                }
                if (e = 0, r = 1, s = t, e > s) return e;
                if (s > r) return r;
                for (; r > e;) {
                    if (h = this.sampleCurveX(s), Math.abs(h - t) < i) return s;
                    t > h ? e = s : r = s, s = .5 * (r - e) + e
                }
                return s
            }, UnitBezier.prototype.solve = function(t, i) {
                return this.sampleCurveY(this.solveCurveX(t, i))
            };
        }, {}],
        135: [function(require, module, exports) {
            module.exports.VectorTile = require("./lib/vectortile.js"), module.exports.VectorTileFeature = require("./lib/vectortilefeature.js"), module.exports.VectorTileLayer = require("./lib/vectortilelayer.js");
        }, {
            "./lib/vectortile.js": 136,
            "./lib/vectortilefeature.js": 137,
            "./lib/vectortilelayer.js": 138
        }],
        136: [function(require, module, exports) {
            "use strict";

            function VectorTile(e, r) {
                this.layers = e.readFields(readTile, {}, r)
            }

            function readTile(e, r, i) {
                if (3 === e) {
                    var t = new VectorTileLayer(i, i.readVarint() + i.pos);
                    t.length && (r[t.name] = t)
                }
            }
            var VectorTileLayer = require("./vectortilelayer");
            module.exports = VectorTile;
        }, {
            "./vectortilelayer": 138
        }],
        137: [function(require, module, exports) {
            "use strict";

            function VectorTileFeature(e, t, r, i, o) {
                this.properties = {}, this.extent = r, this.type = 0, this._pbf = e, this._geometry = -1, this._keys = i, this._values = o, e.readFields(readFeature, this, t)
            }

            function readFeature(e, t, r) {
                1 == e ? t._id = r.readVarint() : 2 == e ? readTag(r, t) : 3 == e ? t.type = r.readVarint() : 4 == e && (t._geometry = r.pos)
            }

            function readTag(e, t) {
                for (var r = e.readVarint() + e.pos; e.pos < r;) {
                    var i = t._keys[e.readVarint()],
                        o = t._values[e.readVarint()];
                    t.properties[i] = o
                }
            }
            var Point = require("point-geometry");
            module.exports = VectorTileFeature, VectorTileFeature.types = ["Unknown", "Point", "LineString", "Polygon"], VectorTileFeature.prototype.loadGeometry = function() {
                var e = this._pbf;
                e.pos = this._geometry;
                for (var t, r = e.readVarint() + e.pos, i = 1, o = 0, a = 0, n = 0, s = []; e.pos < r;) {
                    if (!o) {
                        var p = e.readVarint();
                        i = 7 & p, o = p >> 3
                    }
                    if (o--, 1 === i || 2 === i) a += e.readSVarint(), n += e.readSVarint(), 1 === i && (t && s.push(t), t = []), t.push(new Point(a, n));
                    else {
                        if (7 !== i) throw new Error("unknown command " + i);
                        t && t.push(t[0].clone())
                    }
                }
                return t && s.push(t), s
            }, VectorTileFeature.prototype.bbox = function() {
                var e = this._pbf;
                e.pos = this._geometry;
                for (var t = e.readVarint() + e.pos, r = 1, i = 0, o = 0, a = 0, n = 1 / 0, s = -(1 / 0), p = 1 / 0, h = -(1 / 0); e.pos < t;) {
                    if (!i) {
                        var u = e.readVarint();
                        r = 7 & u, i = u >> 3
                    }
                    if (i--, 1 === r || 2 === r) o += e.readSVarint(), a += e.readSVarint(), n > o && (n = o), o > s && (s = o), p > a && (p = a), a > h && (h = a);
                    else if (7 !== r) throw new Error("unknown command " + r)
                }
                return [n, p, s, h]
            }, VectorTileFeature.prototype.toGeoJSON = function(e, t, r) {
                for (var i = this.extent * Math.pow(2, r), o = this.extent * e, a = this.extent * t, n = this.loadGeometry(), s = VectorTileFeature.types[this.type], p = 0; p < n.length; p++)
                    for (var h = n[p], u = 0; u < h.length; u++) {
                        var d = h[u],
                            l = 180 - 360 * (d.y + a) / i;
                        h[u] = [360 * (d.x + o) / i - 180, 360 / Math.PI * Math.atan(Math.exp(l * Math.PI / 180)) - 90]
                    }
                return "Point" === s && 1 === n.length ? n = n[0][0] : "Point" === s ? (n = n[0], s = "MultiPoint") : "LineString" === s && 1 === n.length ? n = n[0] : "LineString" === s && (s = "MultiLineString"), {
                    type: "Feature",
                    geometry: {
                        type: s,
                        coordinates: n
                    },
                    properties: this.properties
                }
            };
        }, {
            "point-geometry": 139
        }],
        138: [function(require, module, exports) {
            "use strict";

            function VectorTileLayer(e, t) {
                this.version = 1, this.name = null, this.extent = 4096, this.length = 0, this._pbf = e, this._keys = [], this._values = [], this._features = [], e.readFields(readLayer, this, t), this.length = this._features.length
            }

            function readLayer(e, t, r) {
                15 === e ? t.version = r.readVarint() : 1 === e ? t.name = r.readString() : 5 === e ? t.extent = r.readVarint() : 2 === e ? t._features.push(r.pos) : 3 === e ? t._keys.push(r.readString()) : 4 === e && t._values.push(readValueMessage(r))
            }

            function readValueMessage(e) {
                for (var t = null, r = e.readVarint() + e.pos; e.pos < r;) {
                    var a = e.readVarint() >> 3;
                    t = 1 === a ? e.readString() : 2 === a ? e.readFloat() : 3 === a ? e.readDouble() : 4 === a ? e.readVarint64() : 5 === a ? e.readVarint() : 6 === a ? e.readSVarint() : 7 === a ? e.readBoolean() : null
                }
                return t
            }
            var VectorTileFeature = require("./vectortilefeature.js");
            module.exports = VectorTileLayer, VectorTileLayer.prototype.feature = function(e) {
                if (0 > e || e >= this._features.length) throw new Error("feature index out of bounds");
                this._pbf.pos = this._features[e];
                var t = this._pbf.readVarint() + this._pbf.pos;
                return new VectorTileFeature(this._pbf, t, this.extent, this._keys, this._values)
            };
        }, {
            "./vectortilefeature.js": 137
        }],
        139: [function(require, module, exports) {
            arguments[4][131][0].apply(exports, arguments)
        }, {
            "dup": 131
        }],
        140: [function(require, module, exports) {
            var bundleFn = arguments[3],
                sources = arguments[4],
                cache = arguments[5],
                stringify = JSON.stringify;
            module.exports = function(r) {
                for (var e, t = Object.keys(cache), n = 0, o = t.length; o > n; n++) {
                    var i = t[n];
                    if (cache[i].exports === r) {
                        e = i;
                        break
                    }
                }
                if (!e) {
                    e = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
                    for (var s = {}, n = 0, o = t.length; o > n; n++) {
                        var i = t[n];
                        s[i] = i
                    }
                    sources[e] = [Function(["require", "module", "exports"], "(" + r + ")(self)"), s]
                }
                var a = Math.floor(Math.pow(16, 8) * Math.random()).toString(16),
                    u = {};
                u[e] = e, sources[a] = [Function(["require"], "require(" + stringify(e) + ")(self)"), u];
                var c = "(" + bundleFn + ")({" + Object.keys(sources).map(function(r) {
                        return stringify(r) + ":[" + sources[r][0] + "," + stringify(sources[r][1]) + "]"
                    }).join(",") + "},{},[" + stringify(a) + "])",
                    f = window.URL || window.webkitURL || window.mozURL || window.msURL;
                return new Worker(f.createObjectURL(new Blob([c], {
                    type: "text/javascript"
                })))
            };
        }, {}]
    }, {}, [14])(14)
});


//# sourceMappingURL=mapbox-gl.js.map