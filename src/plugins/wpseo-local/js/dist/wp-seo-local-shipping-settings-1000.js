(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @externs_url http://closure-compiler.googlecode.com/svn/trunk/contrib/externs/maps/google_maps_api_v3_3.js
// ==/ClosureCompiler==

/**
 * @name MarkerClusterer for Google Maps v3
 * @version version 1.0.1
 * @author Luke Mahe
 * @fileoverview
 * The library creates and manages per-zoom-level clusters for large amounts of
 * markers.
 * <br/>
 * This is a v3 implementation of the
 * <a href="http://gmaps-utility-library-dev.googlecode.com/svn/tags/markerclusterer/"
 * >v2 MarkerClusterer</a>.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A Marker Clusterer that clusters markers.
 *
 * @param {google.maps.Map} map The Google map to attach to.
 * @param {Array.<google.maps.Marker>=} opt_markers Optional markers to add to
 *   the cluster.
 * @param {Object=} opt_options support the following options:
 *     'gridSize': (number) The grid size of a cluster in pixels.
 *     'maxZoom': (number) The maximum zoom level that a marker can be part of a
 *                cluster.
 *     'zoomOnClick': (boolean) Whether the default behaviour of clicking on a
 *                    cluster is to zoom into it.
 *     'imagePath': (string) The base URL where the images representing
 *                  clusters will be found. The full URL will be:
 *                  {imagePath}[1-5].{imageExtension}
 *                  Default: '../images/m'.
 *     'imageExtension': (string) The suffix for images URL representing
 *                       clusters will be found. See _imagePath_ for details.
 *                       Default: 'png'.
 *     'averageCenter': (boolean) Whether the center of each cluster should be
 *                      the average of all markers in the cluster.
 *     'minimumClusterSize': (number) The minimum number of markers to be in a
 *                           cluster before the markers are hidden and a count
 *                           is shown.
 *     'styles': (object) An object that has style properties:
 *       'url': (string) The image url.
 *       'height': (number) The image height.
 *       'width': (number) The image width.
 *       'anchor': (Array) The anchor position of the label text.
 *       'textColor': (string) The text color.
 *       'textSize': (number) The text size.
 *       'backgroundPosition': (string) The position of the backgound x, y.
 * @constructor
 * @extends google.maps.OverlayView
 */
function MarkerClusterer(map, opt_markers, opt_options) {
    // MarkerClusterer implements google.maps.OverlayView interface. We use the
    // extend function to extend MarkerClusterer with google.maps.OverlayView
    // because it might not always be available when the code is defined so we
    // look for it at the last possible moment. If it doesn't exist now then
    // there is no point going ahead :)
    this.extend(MarkerClusterer, google.maps.OverlayView);
    this.map_ = map;

    /**
     * @type {Array.<google.maps.Marker>}
     * @private
     */
    this.markers_ = [];

    /**
     *  @type {Array.<Cluster>}
     */
    this.clusters_ = [];

    this.sizes = [53, 56, 66, 78, 90];

    /**
     * @private
     */
    this.styles_ = [];

    /**
     * @type {boolean}
     * @private
     */
    this.ready_ = false;

    var options = opt_options || {};

    /**
     * @type {number}
     * @private
     */
    this.gridSize_ = options['gridSize'] || 60;

    /**
     * @private
     */
    this.minClusterSize_ = options['minimumClusterSize'] || 2;

    /**
     * @type {?number}
     * @private
     */
    this.maxZoom_ = options['maxZoom'] || null;

    this.styles_ = options['styles'] || [];

    /**
     * @type {string}
     * @private
     */
    this.imagePath_ = options['imagePath'] || this.MARKER_CLUSTER_IMAGE_PATH_;

    /**
     * @type {string}
     * @private
     */
    this.imageExtension_ = options['imageExtension'] || this.MARKER_CLUSTER_IMAGE_EXTENSION_;

    /**
     * @type {boolean}
     * @private
     */
    this.zoomOnClick_ = true;

    if (options['zoomOnClick'] != undefined) {
        this.zoomOnClick_ = options['zoomOnClick'];
    }

    /**
     * @type {boolean}
     * @private
     */
    this.averageCenter_ = false;

    if (options['averageCenter'] != undefined) {
        this.averageCenter_ = options['averageCenter'];
    }

    this.setupStyles_();

    this.setMap(map);

    /**
     * @type {number}
     * @private
     */
    this.prevZoom_ = this.map_.getZoom();

    // Add the map event listeners
    var that = this;
    google.maps.event.addListener(this.map_, 'zoom_changed', function () {
        // Determines map type and prevent illegal zoom levels
        var zoom = that.map_.getZoom();
        var minZoom = that.map_.minZoom || 0;
        var maxZoom = Math.min(that.map_.maxZoom || 100, that.map_.mapTypes[that.map_.getMapTypeId()].maxZoom);
        zoom = Math.min(Math.max(zoom, minZoom), maxZoom);

        if (that.prevZoom_ != zoom) {
            that.prevZoom_ = zoom;
            that.resetViewport();
        }
    });

    google.maps.event.addListener(this.map_, 'idle', function () {
        that.redraw();
    });

    // Finally, add the markers
    if (opt_markers && (opt_markers.length || Object.keys(opt_markers).length)) {
        this.addMarkers(opt_markers, false);
    }
}

/**
 * The marker cluster image path.
 *
 * @type {string}
 * @private
 */
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = '../images/m';

/**
 * The marker cluster image path.
 *
 * @type {string}
 * @private
 */
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_ = 'png';

/**
 * Extends a objects prototype by anothers.
 *
 * @param {Object} obj1 The object to be extended.
 * @param {Object} obj2 The object to extend with.
 * @return {Object} The new extended object.
 * @ignore
 */
MarkerClusterer.prototype.extend = function (obj1, obj2) {
    return function (object) {
        for (var property in object.prototype) {
            this.prototype[property] = object.prototype[property];
        }
        return this;
    }.apply(obj1, [obj2]);
};

/**
 * Implementaion of the interface method.
 * @ignore
 */
MarkerClusterer.prototype.onAdd = function () {
    this.setReady_(true);
};

/**
 * Implementaion of the interface method.
 * @ignore
 */
MarkerClusterer.prototype.draw = function () {};

/**
 * Sets up the styles object.
 *
 * @private
 */
MarkerClusterer.prototype.setupStyles_ = function () {
    if (this.styles_.length) {
        return;
    }

    for (var i = 0, size; size = this.sizes[i]; i++) {
        this.styles_.push({
            url: this.imagePath_ + (i + 1) + '.' + this.imageExtension_,
            height: size,
            width: size
        });
    }
};

/**
 *  Fit the map to the bounds of the markers in the clusterer.
 */
MarkerClusterer.prototype.fitMapToMarkers = function () {
    var markers = this.getMarkers();
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, marker; marker = markers[i]; i++) {
        bounds.extend(marker.getPosition());
    }

    this.map_.fitBounds(bounds);
};

/**
 *  Sets the styles.
 *
 *  @param {Object} styles The style to set.
 */
MarkerClusterer.prototype.setStyles = function (styles) {
    this.styles_ = styles;
};

/**
 *  Gets the styles.
 *
 *  @return {Object} The styles object.
 */
MarkerClusterer.prototype.getStyles = function () {
    return this.styles_;
};

/**
 * Whether zoom on click is set.
 *
 * @return {boolean} True if zoomOnClick_ is set.
 */
MarkerClusterer.prototype.isZoomOnClick = function () {
    return this.zoomOnClick_;
};

/**
 * Whether average center is set.
 *
 * @return {boolean} True if averageCenter_ is set.
 */
MarkerClusterer.prototype.isAverageCenter = function () {
    return this.averageCenter_;
};

/**
 *  Returns the array of markers in the clusterer.
 *
 *  @return {Array.<google.maps.Marker>} The markers.
 */
MarkerClusterer.prototype.getMarkers = function () {
    return this.markers_;
};

/**
 *  Returns the number of markers in the clusterer
 *
 *  @return {Number} The number of markers.
 */
MarkerClusterer.prototype.getTotalMarkers = function () {
    return this.markers_.length;
};

/**
 *  Sets the max zoom for the clusterer.
 *
 *  @param {number} maxZoom The max zoom level.
 */
MarkerClusterer.prototype.setMaxZoom = function (maxZoom) {
    this.maxZoom_ = maxZoom;
};

/**
 *  Gets the max zoom for the clusterer.
 *
 *  @return {number} The max zoom level.
 */
MarkerClusterer.prototype.getMaxZoom = function () {
    return this.maxZoom_;
};

/**
 *  The function for calculating the cluster icon image.
 *
 *  @param {Array.<google.maps.Marker>} markers The markers in the clusterer.
 *  @param {number} numStyles The number of styles available.
 *  @return {Object} A object properties: 'text' (string) and 'index' (number).
 *  @private
 */
MarkerClusterer.prototype.calculator_ = function (markers, numStyles) {
    var index = 0;
    var count = markers.length;
    var dv = count;
    while (dv !== 0) {
        dv = parseInt(dv / 10, 10);
        index++;
    }

    index = Math.min(index, numStyles);
    return {
        text: count,
        index: index
    };
};

/**
 * Set the calculator function.
 *
 * @param {function(Array, number)} calculator The function to set as the
 *     calculator. The function should return a object properties:
 *     'text' (string) and 'index' (number).
 *
 */
MarkerClusterer.prototype.setCalculator = function (calculator) {
    this.calculator_ = calculator;
};

/**
 * Get the calculator function.
 *
 * @return {function(Array, number)} the calculator function.
 */
MarkerClusterer.prototype.getCalculator = function () {
    return this.calculator_;
};

/**
 * Add an array of markers to the clusterer.
 *
 * @param {Array.<google.maps.Marker>} markers The markers to add.
 * @param {boolean=} opt_nodraw Whether to redraw the clusters.
 */
MarkerClusterer.prototype.addMarkers = function (markers, opt_nodraw) {
    if (markers.length) {
        for (var i = 0, marker; marker = markers[i]; i++) {
            this.pushMarkerTo_(marker);
        }
    } else if (Object.keys(markers).length) {
        for (var marker in markers) {
            this.pushMarkerTo_(markers[marker]);
        }
    }
    if (!opt_nodraw) {
        this.redraw();
    }
};

/**
 * Pushes a marker to the clusterer.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @private
 */
MarkerClusterer.prototype.pushMarkerTo_ = function (marker) {
    marker.isAdded = false;
    if (marker['draggable']) {
        // If the marker is draggable add a listener so we update the clusters on
        // the drag end.
        var that = this;
        google.maps.event.addListener(marker, 'dragend', function () {
            marker.isAdded = false;
            that.repaint();
        });
    }
    this.markers_.push(marker);
};

/**
 * Adds a marker to the clusterer and redraws if needed.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @param {boolean=} opt_nodraw Whether to redraw the clusters.
 */
MarkerClusterer.prototype.addMarker = function (marker, opt_nodraw) {
    this.pushMarkerTo_(marker);
    if (!opt_nodraw) {
        this.redraw();
    }
};

/**
 * Removes a marker and returns true if removed, false if not
 *
 * @param {google.maps.Marker} marker The marker to remove
 * @return {boolean} Whether the marker was removed or not
 * @private
 */
MarkerClusterer.prototype.removeMarker_ = function (marker) {
    var index = -1;
    if (this.markers_.indexOf) {
        index = this.markers_.indexOf(marker);
    } else {
        for (var i = 0, m; m = this.markers_[i]; i++) {
            if (m == marker) {
                index = i;
                break;
            }
        }
    }

    if (index == -1) {
        // Marker is not in our list of markers.
        return false;
    }

    marker.setMap(null);

    this.markers_.splice(index, 1);

    return true;
};

/**
 * Remove a marker from the cluster.
 *
 * @param {google.maps.Marker} marker The marker to remove.
 * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
 * @return {boolean} True if the marker was removed.
 */
MarkerClusterer.prototype.removeMarker = function (marker, opt_nodraw) {
    var removed = this.removeMarker_(marker);

    if (!opt_nodraw && removed) {
        this.resetViewport();
        this.redraw();
        return true;
    } else {
        return false;
    }
};

/**
 * Removes an array of markers from the cluster.
 *
 * @param {Array.<google.maps.Marker>} markers The markers to remove.
 * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
 */
MarkerClusterer.prototype.removeMarkers = function (markers, opt_nodraw) {
    // create a local copy of markers if required
    // (removeMarker_ modifies the getMarkers() array in place)
    var markersCopy = markers === this.getMarkers() ? markers.slice() : markers;
    var removed = false;

    for (var i = 0, marker; marker = markersCopy[i]; i++) {
        var r = this.removeMarker_(marker);
        removed = removed || r;
    }

    if (!opt_nodraw && removed) {
        this.resetViewport();
        this.redraw();
        return true;
    }
};

/**
 * Sets the clusterer's ready state.
 *
 * @param {boolean} ready The state.
 * @private
 */
MarkerClusterer.prototype.setReady_ = function (ready) {
    if (!this.ready_) {
        this.ready_ = ready;
        this.createClusters_();
    }
};

/**
 * Returns the number of clusters in the clusterer.
 *
 * @return {number} The number of clusters.
 */
MarkerClusterer.prototype.getTotalClusters = function () {
    return this.clusters_.length;
};

/**
 * Returns the google map that the clusterer is associated with.
 *
 * @return {google.maps.Map} The map.
 */
MarkerClusterer.prototype.getMap = function () {
    return this.map_;
};

/**
 * Sets the google map that the clusterer is associated with.
 *
 * @param {google.maps.Map} map The map.
 */
MarkerClusterer.prototype.setMap = function (map) {
    this.map_ = map;
};

/**
 * Returns the size of the grid.
 *
 * @return {number} The grid size.
 */
MarkerClusterer.prototype.getGridSize = function () {
    return this.gridSize_;
};

/**
 * Sets the size of the grid.
 *
 * @param {number} size The grid size.
 */
MarkerClusterer.prototype.setGridSize = function (size) {
    this.gridSize_ = size;
};

/**
 * Returns the min cluster size.
 *
 * @return {number} The grid size.
 */
MarkerClusterer.prototype.getMinClusterSize = function () {
    return this.minClusterSize_;
};

/**
 * Sets the min cluster size.
 *
 * @param {number} size The grid size.
 */
MarkerClusterer.prototype.setMinClusterSize = function (size) {
    this.minClusterSize_ = size;
};

/**
 * Extends a bounds object by the grid size.
 *
 * @param {google.maps.LatLngBounds} bounds The bounds to extend.
 * @return {google.maps.LatLngBounds} The extended bounds.
 */
MarkerClusterer.prototype.getExtendedBounds = function (bounds) {
    var projection = this.getProjection();

    // Turn the bounds into latlng.
    var tr = new google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getNorthEast().lng());
    var bl = new google.maps.LatLng(bounds.getSouthWest().lat(), bounds.getSouthWest().lng());

    // Convert the points to pixels and the extend out by the grid size.
    var trPix = projection.fromLatLngToDivPixel(tr);
    trPix.x += this.gridSize_;
    trPix.y -= this.gridSize_;

    var blPix = projection.fromLatLngToDivPixel(bl);
    blPix.x -= this.gridSize_;
    blPix.y += this.gridSize_;

    // Convert the pixel points back to LatLng
    var ne = projection.fromDivPixelToLatLng(trPix);
    var sw = projection.fromDivPixelToLatLng(blPix);

    // Extend the bounds to contain the new bounds.
    bounds.extend(ne);
    bounds.extend(sw);

    return bounds;
};

/**
 * Determins if a marker is contained in a bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @param {google.maps.LatLngBounds} bounds The bounds to check against.
 * @return {boolean} True if the marker is in the bounds.
 * @private
 */
MarkerClusterer.prototype.isMarkerInBounds_ = function (marker, bounds) {
    return bounds.contains(marker.getPosition());
};

/**
 * Clears all clusters and markers from the clusterer.
 */
MarkerClusterer.prototype.clearMarkers = function () {
    this.resetViewport(true);

    // Set the markers a empty array.
    this.markers_ = [];
};

/**
 * Clears all existing clusters and recreates them.
 * @param {boolean} opt_hide To also hide the marker.
 */
MarkerClusterer.prototype.resetViewport = function (opt_hide) {
    // Remove all the clusters
    for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
        cluster.remove();
    }

    // Reset the markers to not be added and to be invisible.
    for (var i = 0, marker; marker = this.markers_[i]; i++) {
        marker.isAdded = false;
        if (opt_hide) {
            marker.setMap(null);
        }
    }

    this.clusters_ = [];
};

/**
 *
 */
MarkerClusterer.prototype.repaint = function () {
    var oldClusters = this.clusters_.slice();
    this.clusters_.length = 0;
    this.resetViewport();
    this.redraw();

    // Remove the old clusters.
    // Do it in a timeout so the other clusters have been drawn first.
    window.setTimeout(function () {
        for (var i = 0, cluster; cluster = oldClusters[i]; i++) {
            cluster.remove();
        }
    }, 0);
};

/**
 * Redraws the clusters.
 */
MarkerClusterer.prototype.redraw = function () {
    this.createClusters_();
};

/**
 * Calculates the distance between two latlng locations in km.
 * @see http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param {google.maps.LatLng} p1 The first lat lng point.
 * @param {google.maps.LatLng} p2 The second lat lng point.
 * @return {number} The distance between the two points in km.
 * @private
 */
MarkerClusterer.prototype.distanceBetweenPoints_ = function (p1, p2) {
    if (!p1 || !p2) {
        return 0;
    }

    var R = 6371; // Radius of the Earth in km
    var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
    var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
};

/**
 * Add a marker to a cluster, or creates a new cluster.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @private
 */
MarkerClusterer.prototype.addToClosestCluster_ = function (marker) {
    var distance = 40000; // Some large number
    var clusterToAddTo = null;
    var pos = marker.getPosition();
    for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
        var center = cluster.getCenter();
        if (center) {
            var d = this.distanceBetweenPoints_(center, marker.getPosition());
            if (d < distance) {
                distance = d;
                clusterToAddTo = cluster;
            }
        }
    }

    if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
        clusterToAddTo.addMarker(marker);
    } else {
        var cluster = new Cluster(this);
        cluster.addMarker(marker);
        this.clusters_.push(cluster);
    }
};

/**
 * Creates the clusters.
 *
 * @private
 */
MarkerClusterer.prototype.createClusters_ = function () {
    if (!this.ready_) {
        return;
    }

    // Get our current map view bounds.
    // Create a new bounds object so we don't affect the map.
    var mapBounds = new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(), this.map_.getBounds().getNorthEast());
    var bounds = this.getExtendedBounds(mapBounds);

    for (var i = 0, marker; marker = this.markers_[i]; i++) {
        if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
            this.addToClosestCluster_(marker);
        }
    }
};

/**
 * A cluster that contains markers.
 *
 * @param {MarkerClusterer} markerClusterer The markerclusterer that this
 *     cluster is associated with.
 * @constructor
 * @ignore
 */
function Cluster(markerClusterer) {
    this.markerClusterer_ = markerClusterer;
    this.map_ = markerClusterer.getMap();
    this.gridSize_ = markerClusterer.getGridSize();
    this.minClusterSize_ = markerClusterer.getMinClusterSize();
    this.averageCenter_ = markerClusterer.isAverageCenter();
    this.center_ = null;
    this.markers_ = [];
    this.bounds_ = null;
    this.clusterIcon_ = new ClusterIcon(this, markerClusterer.getStyles(), markerClusterer.getGridSize());
}

/**
 * Determins if a marker is already added to the cluster.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker is already added.
 */
Cluster.prototype.isMarkerAlreadyAdded = function (marker) {
    if (this.markers_.indexOf) {
        return this.markers_.indexOf(marker) != -1;
    } else {
        for (var i = 0, m; m = this.markers_[i]; i++) {
            if (m == marker) {
                return true;
            }
        }
    }
    return false;
};

/**
 * Add a marker the cluster.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @return {boolean} True if the marker was added.
 */
Cluster.prototype.addMarker = function (marker) {
    if (this.isMarkerAlreadyAdded(marker)) {
        return false;
    }

    if (!this.center_) {
        this.center_ = marker.getPosition();
        this.calculateBounds_();
    } else {
        if (this.averageCenter_) {
            var l = this.markers_.length + 1;
            var lat = (this.center_.lat() * (l - 1) + marker.getPosition().lat()) / l;
            var lng = (this.center_.lng() * (l - 1) + marker.getPosition().lng()) / l;
            this.center_ = new google.maps.LatLng(lat, lng);
            this.calculateBounds_();
        }
    }

    marker.isAdded = true;
    this.markers_.push(marker);

    var len = this.markers_.length;
    if (len < this.minClusterSize_ && marker.getMap() != this.map_) {
        // Min cluster size not reached so show the marker.
        marker.setMap(this.map_);
    }

    if (len == this.minClusterSize_) {
        // Hide the markers that were showing.
        for (var i = 0; i < len; i++) {
            this.markers_[i].setMap(null);
        }
    }

    if (len >= this.minClusterSize_) {
        marker.setMap(null);
    }

    this.updateIcon();
    return true;
};

/**
 * Returns the marker clusterer that the cluster is associated with.
 *
 * @return {MarkerClusterer} The associated marker clusterer.
 */
Cluster.prototype.getMarkerClusterer = function () {
    return this.markerClusterer_;
};

/**
 * Returns the bounds of the cluster.
 *
 * @return {google.maps.LatLngBounds} the cluster bounds.
 */
Cluster.prototype.getBounds = function () {
    var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
    var markers = this.getMarkers();
    for (var i = 0, marker; marker = markers[i]; i++) {
        bounds.extend(marker.getPosition());
    }
    return bounds;
};

/**
 * Removes the cluster
 */
Cluster.prototype.remove = function () {
    this.clusterIcon_.remove();
    this.markers_.length = 0;
    delete this.markers_;
};

/**
 * Returns the number of markers in the cluster.
 *
 * @return {number} The number of markers in the cluster.
 */
Cluster.prototype.getSize = function () {
    return this.markers_.length;
};

/**
 * Returns a list of the markers in the cluster.
 *
 * @return {Array.<google.maps.Marker>} The markers in the cluster.
 */
Cluster.prototype.getMarkers = function () {
    return this.markers_;
};

/**
 * Returns the center of the cluster.
 *
 * @return {google.maps.LatLng} The cluster center.
 */
Cluster.prototype.getCenter = function () {
    return this.center_;
};

/**
 * Calculated the extended bounds of the cluster with the grid.
 *
 * @private
 */
Cluster.prototype.calculateBounds_ = function () {
    var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
    this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
};

/**
 * Determines if a marker lies in the clusters bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker lies in the bounds.
 */
Cluster.prototype.isMarkerInClusterBounds = function (marker) {
    return this.bounds_.contains(marker.getPosition());
};

/**
 * Returns the map that the cluster is associated with.
 *
 * @return {google.maps.Map} The map.
 */
Cluster.prototype.getMap = function () {
    return this.map_;
};

/**
 * Updates the cluster icon
 */
Cluster.prototype.updateIcon = function () {
    var zoom = this.map_.getZoom();
    var mz = this.markerClusterer_.getMaxZoom();

    if (mz && zoom > mz) {
        // The zoom is greater than our max zoom so show all the markers in cluster.
        for (var i = 0, marker; marker = this.markers_[i]; i++) {
            marker.setMap(this.map_);
        }
        return;
    }

    if (this.markers_.length < this.minClusterSize_) {
        // Min cluster size not yet reached.
        this.clusterIcon_.hide();
        return;
    }

    var numStyles = this.markerClusterer_.getStyles().length;
    var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
    this.clusterIcon_.setCenter(this.center_);
    this.clusterIcon_.setSums(sums);
    this.clusterIcon_.show();
};

/**
 * A cluster icon
 *
 * @param {Cluster} cluster The cluster to be associated with.
 * @param {Object} styles An object that has style properties:
 *     'url': (string) The image url.
 *     'height': (number) The image height.
 *     'width': (number) The image width.
 *     'anchor': (Array) The anchor position of the label text.
 *     'textColor': (string) The text color.
 *     'textSize': (number) The text size.
 *     'backgroundPosition: (string) The background postition x, y.
 * @param {number=} opt_padding Optional padding to apply to the cluster icon.
 * @constructor
 * @extends google.maps.OverlayView
 * @ignore
 */
function ClusterIcon(cluster, styles, opt_padding) {
    cluster.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);

    this.styles_ = styles;
    this.padding_ = opt_padding || 0;
    this.cluster_ = cluster;
    this.center_ = null;
    this.map_ = cluster.getMap();
    this.div_ = null;
    this.sums_ = null;
    this.visible_ = false;

    this.setMap(this.map_);
}

/**
 * Triggers the clusterclick event and zoom's if the option is set.
 */
ClusterIcon.prototype.triggerClusterClick = function () {
    var markerClusterer = this.cluster_.getMarkerClusterer();

    // Trigger the clusterclick event.
    google.maps.event.trigger(markerClusterer.map_, 'clusterclick', this.cluster_);

    if (markerClusterer.isZoomOnClick()) {
        // Zoom into the cluster.
        this.map_.fitBounds(this.cluster_.getBounds());
    }
};

/**
 * Adding the cluster icon to the dom.
 * @ignore
 */
ClusterIcon.prototype.onAdd = function () {
    this.div_ = document.createElement('DIV');
    if (this.visible_) {
        var pos = this.getPosFromLatLng_(this.center_);
        this.div_.style.cssText = this.createCss(pos);
        this.div_.innerHTML = this.sums_.text;
    }

    var panes = this.getPanes();
    panes.overlayMouseTarget.appendChild(this.div_);

    var that = this;
    google.maps.event.addDomListener(this.div_, 'click', function () {
        that.triggerClusterClick();
    });
};

/**
 * Returns the position to place the div dending on the latlng.
 *
 * @param {google.maps.LatLng} latlng The position in latlng.
 * @return {google.maps.Point} The position in pixels.
 * @private
 */
ClusterIcon.prototype.getPosFromLatLng_ = function (latlng) {
    var pos = this.getProjection().fromLatLngToDivPixel(latlng);
    pos.x -= parseInt(this.width_ / 2, 10);
    pos.y -= parseInt(this.height_ / 2, 10);
    return pos;
};

/**
 * Draw the icon.
 * @ignore
 */
ClusterIcon.prototype.draw = function () {
    if (this.visible_) {
        var pos = this.getPosFromLatLng_(this.center_);
        this.div_.style.top = pos.y + 'px';
        this.div_.style.left = pos.x + 'px';
    }
};

/**
 * Hide the icon.
 */
ClusterIcon.prototype.hide = function () {
    if (this.div_) {
        this.div_.style.display = 'none';
    }
    this.visible_ = false;
};

/**
 * Position and show the icon.
 */
ClusterIcon.prototype.show = function () {
    if (this.div_) {
        var pos = this.getPosFromLatLng_(this.center_);
        this.div_.style.cssText = this.createCss(pos);
        this.div_.style.display = '';
    }
    this.visible_ = true;
};

/**
 * Remove the icon from the map
 */
ClusterIcon.prototype.remove = function () {
    this.setMap(null);
};

/**
 * Implementation of the onRemove interface.
 * @ignore
 */
ClusterIcon.prototype.onRemove = function () {
    if (this.div_ && this.div_.parentNode) {
        this.hide();
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
};

/**
 * Set the sums of the icon.
 *
 * @param {Object} sums The sums containing:
 *   'text': (string) The text to display in the icon.
 *   'index': (number) The style index of the icon.
 */
ClusterIcon.prototype.setSums = function (sums) {
    this.sums_ = sums;
    this.text_ = sums.text;
    this.index_ = sums.index;
    if (this.div_) {
        this.div_.innerHTML = sums.text;
    }

    this.useStyle();
};

/**
 * Sets the icon to the the styles.
 */
ClusterIcon.prototype.useStyle = function () {
    var index = Math.max(0, this.sums_.index - 1);
    index = Math.min(this.styles_.length - 1, index);
    var style = this.styles_[index];
    this.url_ = style['url'];
    this.height_ = style['height'];
    this.width_ = style['width'];
    this.textColor_ = style['textColor'];
    this.anchor_ = style['anchor'];
    this.textSize_ = style['textSize'];
    this.backgroundPosition_ = style['backgroundPosition'];
};

/**
 * Sets the center of the icon.
 *
 * @param {google.maps.LatLng} center The latlng to set as the center.
 */
ClusterIcon.prototype.setCenter = function (center) {
    this.center_ = center;
};

/**
 * Create the css text based on the position of the icon.
 *
 * @param {google.maps.Point} pos The position.
 * @return {string} The css style text.
 */
ClusterIcon.prototype.createCss = function (pos) {
    var style = [];
    style.push('background-image:url(' + this.url_ + ');');
    var backgroundPosition = this.backgroundPosition_ ? this.backgroundPosition_ : '0 0';
    style.push('background-position:' + backgroundPosition + ';');

    if (_typeof(this.anchor_) === 'object') {
        if (typeof this.anchor_[0] === 'number' && this.anchor_[0] > 0 && this.anchor_[0] < this.height_) {
            style.push('height:' + (this.height_ - this.anchor_[0]) + 'px; padding-top:' + this.anchor_[0] + 'px;');
        } else {
            style.push('height:' + this.height_ + 'px; line-height:' + this.height_ + 'px;');
        }
        if (typeof this.anchor_[1] === 'number' && this.anchor_[1] > 0 && this.anchor_[1] < this.width_) {
            style.push('width:' + (this.width_ - this.anchor_[1]) + 'px; padding-left:' + this.anchor_[1] + 'px;');
        } else {
            style.push('width:' + this.width_ + 'px; text-align:center;');
        }
    } else {
        style.push('height:' + this.height_ + 'px; line-height:' + this.height_ + 'px; width:' + this.width_ + 'px; text-align:center;');
    }

    var txtColor = this.textColor_ ? this.textColor_ : 'black';
    var txtSize = this.textSize_ ? this.textSize_ : 11;

    style.push('cursor:pointer; top:' + pos.y + 'px; left:' + pos.x + 'px; color:' + txtColor + '; position:absolute; font-size:' + txtSize + 'px; font-family:Arial,sans-serif; font-weight:bold');
    return style.join('');
};

// Export Symbols for Closure
// If you are not going to compile with closure then you can remove the
// code below.
window['MarkerClusterer'] = MarkerClusterer;
MarkerClusterer.prototype['addMarker'] = MarkerClusterer.prototype.addMarker;
MarkerClusterer.prototype['addMarkers'] = MarkerClusterer.prototype.addMarkers;
MarkerClusterer.prototype['clearMarkers'] = MarkerClusterer.prototype.clearMarkers;
MarkerClusterer.prototype['fitMapToMarkers'] = MarkerClusterer.prototype.fitMapToMarkers;
MarkerClusterer.prototype['getCalculator'] = MarkerClusterer.prototype.getCalculator;
MarkerClusterer.prototype['getGridSize'] = MarkerClusterer.prototype.getGridSize;
MarkerClusterer.prototype['getExtendedBounds'] = MarkerClusterer.prototype.getExtendedBounds;
MarkerClusterer.prototype['getMap'] = MarkerClusterer.prototype.getMap;
MarkerClusterer.prototype['getMarkers'] = MarkerClusterer.prototype.getMarkers;
MarkerClusterer.prototype['getMaxZoom'] = MarkerClusterer.prototype.getMaxZoom;
MarkerClusterer.prototype['getStyles'] = MarkerClusterer.prototype.getStyles;
MarkerClusterer.prototype['getTotalClusters'] = MarkerClusterer.prototype.getTotalClusters;
MarkerClusterer.prototype['getTotalMarkers'] = MarkerClusterer.prototype.getTotalMarkers;
MarkerClusterer.prototype['redraw'] = MarkerClusterer.prototype.redraw;
MarkerClusterer.prototype['removeMarker'] = MarkerClusterer.prototype.removeMarker;
MarkerClusterer.prototype['removeMarkers'] = MarkerClusterer.prototype.removeMarkers;
MarkerClusterer.prototype['resetViewport'] = MarkerClusterer.prototype.resetViewport;
MarkerClusterer.prototype['repaint'] = MarkerClusterer.prototype.repaint;
MarkerClusterer.prototype['setCalculator'] = MarkerClusterer.prototype.setCalculator;
MarkerClusterer.prototype['setGridSize'] = MarkerClusterer.prototype.setGridSize;
MarkerClusterer.prototype['setMaxZoom'] = MarkerClusterer.prototype.setMaxZoom;
MarkerClusterer.prototype['onAdd'] = MarkerClusterer.prototype.onAdd;
MarkerClusterer.prototype['draw'] = MarkerClusterer.prototype.draw;

Cluster.prototype['getCenter'] = Cluster.prototype.getCenter;
Cluster.prototype['getSize'] = Cluster.prototype.getSize;
Cluster.prototype['getMarkers'] = Cluster.prototype.getMarkers;

ClusterIcon.prototype['onAdd'] = ClusterIcon.prototype.onAdd;
ClusterIcon.prototype['draw'] = ClusterIcon.prototype.draw;
ClusterIcon.prototype['onRemove'] = ClusterIcon.prototype.onRemove;

Object.keys = Object.keys || function (o) {
    var result = [];
    for (var name in o) {
        if (o.hasOwnProperty(name)) result.push(name);
    }
    return result;
};

},{}],2:[function(require,module,exports){
'use strict';

jQuery(document).ready(function ($) {

    //when the location-add button is clicked
    $('#location_setting_add').click(function () {

        //get the current selected location
        var location_id = $('#location_setting_select').val();

        // if it was the placeholder, quit...
        if (location_id == 0) {
            return;
        }

        // get the current location title
        var location_title = $('#location_setting_select option:selected').text();
        var defaults = $('#location_setting_select option:selected').data('defaults');

        //remove item from the options ( we don't need it there anymore )
        $('#location_setting_select option:selected').remove();

        var checked = '';
        if (yoast_wcseo_local_translations.has_categories == 0) {
            checked += ' checked="checked"';
        }

        //append a new row tot hte table with these location specs
        $('tbody#shipping_locations').append('<tr class="location" data-id="' + location_id + '" data-title="' + encodeURI(location_title) + '" data-defaults=\'' + JSON.stringify(defaults) + '\'  >' + '<th scope="row" class="check-column"></th>' + '<td>' + location_title + '</td>' + '<td><label for="yoast_wcseo_local_pickup_location_allowed[' + location_id + ']" class="screen-reader-text">' + yoast_wcseo_local_translations.label_allow_location.replace('%s', location_title) + '</label><input type="checkbox"' + checked + ' name="yoast_wcseo_local_pickup_location_allowed[' + location_id + ']" /> <small>' + defaults.status + '</small></td>' + '<td><label for="yoast_wcseo_local_pickup_location_cost[' + location_id + ']" class="screen-reader-text">' + yoast_wcseo_local_translations.label_costs_location.replace('%s', location_title) + '</label><input type="text" name="yoast_wcseo_local_pickup_location_cost[' + location_id + ']" placeholder="' + yoast_wcseo_local_translations.placeholder_costs_location + '" class="input-text regular-input" > <small>' + defaults.price + '</small></td>' + '<td><input class="location_rule_remove" type="button" class="button" value="' + yoast_wcseo_local_translations.label_remove + '"></td>' + '</tr>');

        //un-bind and re-bind click events, because our DOM has changed
        $('.location_rule_remove').unbind('click');
        $('.location_rule_remove').on('click', yoast_remove_location);
    });

    // bind click event for the remove button
    $('.location_rule_remove').on('click', yoast_remove_location);

    // Show alert when you're activating the Local Store Pickup.
    $('#woocommerce_yoast_wcseo_local_pickup_enabled').on('click', function (e) {
        var $this = $(this);

        if ($this.is(':checked')) {
            var answer = confirm(yoast_wcseo_local_translations.warning_enable_pickup);
            if (false == answer) {
                e.preventDefault();
            }
        }
    });
});

function yoast_remove_location() {

    // find the row-element for this item
    var $row = jQuery(this).closest('tr');

    //get the specs form this row
    var id = $row.data('id');
    var title = $row.data('title');
    var defaults = $row.data('defaults');

    //remove the row
    $row.remove();

    //but the specs back into our options/select
    jQuery('#location_setting_select').append('<option value="' + id + '" data-defaults=\'' + JSON.stringify(defaults) + '\'>' + decodeURI(title) + '</option>');
}

},{}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvdmVuZG9yL21hcmtlcmNsdXN0ZXIuanMiLCJqcy9zcmMvd3Atc2VvLWxvY2FsLXNoaXBwaW5nLXNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7Ozs7Ozs7O0FBZUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUNBLFNBQVMsZUFBVCxDQUF5QixHQUF6QixFQUE4QixXQUE5QixFQUEyQyxXQUEzQyxFQUF3RDtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBSyxNQUFMLENBQVksZUFBWixFQUE2QixPQUFPLElBQVAsQ0FBWSxXQUF6QztBQUNBLFNBQUssSUFBTCxHQUFZLEdBQVo7O0FBRUE7Ozs7QUFJQSxTQUFLLFFBQUwsR0FBZ0IsRUFBaEI7O0FBRUE7OztBQUdBLFNBQUssU0FBTCxHQUFpQixFQUFqQjs7QUFFQSxTQUFLLEtBQUwsR0FBYSxDQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsRUFBakIsQ0FBYjs7QUFFQTs7O0FBR0EsU0FBSyxPQUFMLEdBQWUsRUFBZjs7QUFFQTs7OztBQUlBLFNBQUssTUFBTCxHQUFjLEtBQWQ7O0FBRUEsUUFBSSxVQUFVLGVBQWUsRUFBN0I7O0FBRUE7Ozs7QUFJQSxTQUFLLFNBQUwsR0FBaUIsUUFBUSxVQUFSLEtBQXVCLEVBQXhDOztBQUVBOzs7QUFHQSxTQUFLLGVBQUwsR0FBdUIsUUFBUSxvQkFBUixLQUFpQyxDQUF4RDs7QUFHQTs7OztBQUlBLFNBQUssUUFBTCxHQUFnQixRQUFRLFNBQVIsS0FBc0IsSUFBdEM7O0FBRUEsU0FBSyxPQUFMLEdBQWUsUUFBUSxRQUFSLEtBQXFCLEVBQXBDOztBQUVBOzs7O0FBSUEsU0FBSyxVQUFMLEdBQWtC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LEVBQTNCLENBQThCLE9BQTlCLEVBQXVDLHFCQUF2QztBQUVILEtBckNEOztBQXVDQTtBQUNBLE1BQUUsdUJBQUYsRUFBMkIsRUFBM0IsQ0FBOEIsT0FBOUIsRUFBdUMscUJBQXZDOztBQUVBO0FBQ0EsTUFBRSwrQ0FBRixFQUFtRCxFQUFuRCxDQUFzRCxPQUF0RCxFQUErRCxVQUFVLENBQVYsRUFBYTtBQUN4RSxZQUFJLFFBQVEsRUFBRSxJQUFGLENBQVo7O0FBRUEsWUFBSSxNQUFNLEVBQU4sQ0FBUyxVQUFULENBQUosRUFBMEI7QUFDdEIsZ0JBQUksU0FBUyxRQUFRLCtCQUErQixxQkFBdkMsQ0FBYjtBQUNBLGdCQUFJLFNBQVMsTUFBYixFQUFxQjtBQUNqQixrQkFBRSxjQUFGO0FBQ0g7QUFDSjtBQUNKLEtBVEQ7QUFXSCxDQXpERDs7QUE0REEsU0FBUyxxQkFBVCxHQUFpQzs7QUFFN0I7QUFDQSxRQUFJLE9BQU8sT0FBTyxJQUFQLEVBQWEsT0FBYixDQUFxQixJQUFyQixDQUFYOztBQUVBO0FBQ0EsUUFBSSxLQUFLLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBVDtBQUNBLFFBQUksUUFBUSxLQUFLLElBQUwsQ0FBVSxPQUFWLENBQVo7QUFDQSxRQUFJLFdBQVcsS0FBSyxJQUFMLENBQVUsVUFBVixDQUFmOztBQUVBO0FBQ0EsU0FBSyxNQUFMOztBQUVBO0FBQ0EsV0FBTywwQkFBUCxFQUFtQyxNQUFuQyxDQUEwQyxvQkFBb0IsRUFBcEIsR0FBeUIsb0JBQXpCLEdBQWdELEtBQUssU0FBTCxDQUFlLFFBQWYsQ0FBaEQsR0FBMkUsS0FBM0UsR0FBbUYsVUFBVSxLQUFWLENBQW5GLEdBQXNHLFdBQWhKO0FBQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gPT1DbG9zdXJlQ29tcGlsZXI9PVxuLy8gQGNvbXBpbGF0aW9uX2xldmVsIEFEVkFOQ0VEX09QVElNSVpBVElPTlNcbi8vIEBleHRlcm5zX3VybCBodHRwOi8vY2xvc3VyZS1jb21waWxlci5nb29nbGVjb2RlLmNvbS9zdm4vdHJ1bmsvY29udHJpYi9leHRlcm5zL21hcHMvZ29vZ2xlX21hcHNfYXBpX3YzXzMuanNcbi8vID09L0Nsb3N1cmVDb21waWxlcj09XG5cbi8qKlxuICogQG5hbWUgTWFya2VyQ2x1c3RlcmVyIGZvciBHb29nbGUgTWFwcyB2M1xuICogQHZlcnNpb24gdmVyc2lvbiAxLjAuMVxuICogQGF1dGhvciBMdWtlIE1haGVcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIFRoZSBsaWJyYXJ5IGNyZWF0ZXMgYW5kIG1hbmFnZXMgcGVyLXpvb20tbGV2ZWwgY2x1c3RlcnMgZm9yIGxhcmdlIGFtb3VudHMgb2ZcbiAqIG1hcmtlcnMuXG4gKiA8YnIvPlxuICogVGhpcyBpcyBhIHYzIGltcGxlbWVudGF0aW9uIG9mIHRoZVxuICogPGEgaHJlZj1cImh0dHA6Ly9nbWFwcy11dGlsaXR5LWxpYnJhcnktZGV2Lmdvb2dsZWNvZGUuY29tL3N2bi90YWdzL21hcmtlcmNsdXN0ZXJlci9cIlxuICogPnYyIE1hcmtlckNsdXN0ZXJlcjwvYT4uXG4gKi9cblxuLyoqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuXG4vKipcbiAqIEEgTWFya2VyIENsdXN0ZXJlciB0aGF0IGNsdXN0ZXJzIG1hcmtlcnMuXG4gKlxuICogQHBhcmFtIHtnb29nbGUubWFwcy5NYXB9IG1hcCBUaGUgR29vZ2xlIG1hcCB0byBhdHRhY2ggdG8uXG4gKiBAcGFyYW0ge0FycmF5Ljxnb29nbGUubWFwcy5NYXJrZXI+PX0gb3B0X21hcmtlcnMgT3B0aW9uYWwgbWFya2VycyB0byBhZGQgdG9cbiAqICAgdGhlIGNsdXN0ZXIuXG4gKiBAcGFyYW0ge09iamVjdD19IG9wdF9vcHRpb25zIHN1cHBvcnQgdGhlIGZvbGxvd2luZyBvcHRpb25zOlxuICogICAgICdncmlkU2l6ZSc6IChudW1iZXIpIFRoZSBncmlkIHNpemUgb2YgYSBjbHVzdGVyIGluIHBpeGVscy5cbiAqICAgICAnbWF4Wm9vbSc6IChudW1iZXIpIFRoZSBtYXhpbXVtIHpvb20gbGV2ZWwgdGhhdCBhIG1hcmtlciBjYW4gYmUgcGFydCBvZiBhXG4gKiAgICAgICAgICAgICAgICBjbHVzdGVyLlxuICogICAgICd6b29tT25DbGljayc6IChib29sZWFuKSBXaGV0aGVyIHRoZSBkZWZhdWx0IGJlaGF2aW91ciBvZiBjbGlja2luZyBvbiBhXG4gKiAgICAgICAgICAgICAgICAgICAgY2x1c3RlciBpcyB0byB6b29tIGludG8gaXQuXG4gKiAgICAgJ2ltYWdlUGF0aCc6IChzdHJpbmcpIFRoZSBiYXNlIFVSTCB3aGVyZSB0aGUgaW1hZ2VzIHJlcHJlc2VudGluZ1xuICogICAgICAgICAgICAgICAgICBjbHVzdGVycyB3aWxsIGJlIGZvdW5kLiBUaGUgZnVsbCBVUkwgd2lsbCBiZTpcbiAqICAgICAgICAgICAgICAgICAge2ltYWdlUGF0aH1bMS01XS57aW1hZ2VFeHRlbnNpb259XG4gKiAgICAgICAgICAgICAgICAgIERlZmF1bHQ6ICcuLi9pbWFnZXMvbScuXG4gKiAgICAgJ2ltYWdlRXh0ZW5zaW9uJzogKHN0cmluZykgVGhlIHN1ZmZpeCBmb3IgaW1hZ2VzIFVSTCByZXByZXNlbnRpbmdcbiAqICAgICAgICAgICAgICAgICAgICAgICBjbHVzdGVycyB3aWxsIGJlIGZvdW5kLiBTZWUgX2ltYWdlUGF0aF8gZm9yIGRldGFpbHMuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgRGVmYXVsdDogJ3BuZycuXG4gKiAgICAgJ2F2ZXJhZ2VDZW50ZXInOiAoYm9vbGVhbikgV2hldGhlciB0aGUgY2VudGVyIG9mIGVhY2ggY2x1c3RlciBzaG91bGQgYmVcbiAqICAgICAgICAgICAgICAgICAgICAgIHRoZSBhdmVyYWdlIG9mIGFsbCBtYXJrZXJzIGluIHRoZSBjbHVzdGVyLlxuICogICAgICdtaW5pbXVtQ2x1c3RlclNpemUnOiAobnVtYmVyKSBUaGUgbWluaW11bSBudW1iZXIgb2YgbWFya2VycyB0byBiZSBpbiBhXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsdXN0ZXIgYmVmb3JlIHRoZSBtYXJrZXJzIGFyZSBoaWRkZW4gYW5kIGEgY291bnRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgaXMgc2hvd24uXG4gKiAgICAgJ3N0eWxlcyc6IChvYmplY3QpIEFuIG9iamVjdCB0aGF0IGhhcyBzdHlsZSBwcm9wZXJ0aWVzOlxuICogICAgICAgJ3VybCc6IChzdHJpbmcpIFRoZSBpbWFnZSB1cmwuXG4gKiAgICAgICAnaGVpZ2h0JzogKG51bWJlcikgVGhlIGltYWdlIGhlaWdodC5cbiAqICAgICAgICd3aWR0aCc6IChudW1iZXIpIFRoZSBpbWFnZSB3aWR0aC5cbiAqICAgICAgICdhbmNob3InOiAoQXJyYXkpIFRoZSBhbmNob3IgcG9zaXRpb24gb2YgdGhlIGxhYmVsIHRleHQuXG4gKiAgICAgICAndGV4dENvbG9yJzogKHN0cmluZykgVGhlIHRleHQgY29sb3IuXG4gKiAgICAgICAndGV4dFNpemUnOiAobnVtYmVyKSBUaGUgdGV4dCBzaXplLlxuICogICAgICAgJ2JhY2tncm91bmRQb3NpdGlvbic6IChzdHJpbmcpIFRoZSBwb3NpdGlvbiBvZiB0aGUgYmFja2dvdW5kIHgsIHkuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIGdvb2dsZS5tYXBzLk92ZXJsYXlWaWV3XG4gKi9cbmZ1bmN0aW9uIE1hcmtlckNsdXN0ZXJlcihtYXAsIG9wdF9tYXJrZXJzLCBvcHRfb3B0aW9ucykge1xuICAgIC8vIE1hcmtlckNsdXN0ZXJlciBpbXBsZW1lbnRzIGdvb2dsZS5tYXBzLk92ZXJsYXlWaWV3IGludGVyZmFjZS4gV2UgdXNlIHRoZVxuICAgIC8vIGV4dGVuZCBmdW5jdGlvbiB0byBleHRlbmQgTWFya2VyQ2x1c3RlcmVyIHdpdGggZ29vZ2xlLm1hcHMuT3ZlcmxheVZpZXdcbiAgICAvLyBiZWNhdXNlIGl0IG1pZ2h0IG5vdCBhbHdheXMgYmUgYXZhaWxhYmxlIHdoZW4gdGhlIGNvZGUgaXMgZGVmaW5lZCBzbyB3ZVxuICAgIC8vIGxvb2sgZm9yIGl0IGF0IHRoZSBsYXN0IHBvc3NpYmxlIG1vbWVudC4gSWYgaXQgZG9lc24ndCBleGlzdCBub3cgdGhlblxuICAgIC8vIHRoZXJlIGlzIG5vIHBvaW50IGdvaW5nIGFoZWFkIDopXG4gICAgdGhpcy5leHRlbmQoTWFya2VyQ2x1c3RlcmVyLCBnb29nbGUubWFwcy5PdmVybGF5Vmlldyk7XG4gICAgdGhpcy5tYXBfID0gbWFwO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0FycmF5Ljxnb29nbGUubWFwcy5NYXJrZXI+fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5tYXJrZXJzXyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogIEB0eXBlIHtBcnJheS48Q2x1c3Rlcj59XG4gICAgICovXG4gICAgdGhpcy5jbHVzdGVyc18gPSBbXTtcblxuICAgIHRoaXMuc2l6ZXMgPSBbNTMsIDU2LCA2NiwgNzgsIDkwXTtcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5zdHlsZXNfID0gW107XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucmVhZHlfID0gZmFsc2U7XG5cbiAgICB2YXIgb3B0aW9ucyA9IG9wdF9vcHRpb25zIHx8IHt9O1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZ3JpZFNpemVfID0gb3B0aW9uc1snZ3JpZFNpemUnXSB8fCA2MDtcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5taW5DbHVzdGVyU2l6ZV8gPSBvcHRpb25zWydtaW5pbXVtQ2x1c3RlclNpemUnXSB8fCAyO1xuXG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7P251bWJlcn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMubWF4Wm9vbV8gPSBvcHRpb25zWydtYXhab29tJ10gfHwgbnVsbDtcblxuICAgIHRoaXMuc3R5bGVzXyA9IG9wdGlvbnNbJ3N0eWxlcyddIHx8IFtdO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuaW1hZ2VQYXRoXyA9IG9wdGlvbnNbJ2ltYWdlUGF0aCddIHx8XG4gICAgICAgIHRoaXMuTUFSS0VSX0NMVVNURVJfSU1BR0VfUEFUSF87XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5pbWFnZUV4dGVuc2lvbl8gPSBvcHRpb25zWydpbWFnZUV4dGVuc2lvbiddIHx8XG4gICAgICAgIHRoaXMuTUFSS0VSX0NMVVNURVJfSU1BR0VfRVhURU5TSU9OXztcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy56b29tT25DbGlja18gPSB0cnVlO1xuXG4gICAgaWYgKG9wdGlvbnNbJ3pvb21PbkNsaWNrJ10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuem9vbU9uQ2xpY2tfID0gb3B0aW9uc1snem9vbU9uQ2xpY2snXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuYXZlcmFnZUNlbnRlcl8gPSBmYWxzZTtcblxuICAgIGlmIChvcHRpb25zWydhdmVyYWdlQ2VudGVyJ10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuYXZlcmFnZUNlbnRlcl8gPSBvcHRpb25zWydhdmVyYWdlQ2VudGVyJ107XG4gICAgfVxuXG4gICAgdGhpcy5zZXR1cFN0eWxlc18oKTtcblxuICAgIHRoaXMuc2V0TWFwKG1hcCk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5wcmV2Wm9vbV8gPSB0aGlzLm1hcF8uZ2V0Wm9vbSgpO1xuXG4gICAgLy8gQWRkIHRoZSBtYXAgZXZlbnQgbGlzdGVuZXJzXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKHRoaXMubWFwXywgJ3pvb21fY2hhbmdlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBEZXRlcm1pbmVzIG1hcCB0eXBlIGFuZCBwcmV2ZW50IGlsbGVnYWwgem9vbSBsZXZlbHNcbiAgICAgICAgdmFyIHpvb20gPSB0aGF0Lm1hcF8uZ2V0Wm9vbSgpO1xuICAgICAgICB2YXIgbWluWm9vbSA9IHRoYXQubWFwXy5taW5ab29tIHx8IDA7XG4gICAgICAgIHZhciBtYXhab29tID0gTWF0aC5taW4odGhhdC5tYXBfLm1heFpvb20gfHwgMTAwLFxuICAgICAgICAgICAgdGhhdC5tYXBfLm1hcFR5cGVzW3RoYXQubWFwXy5nZXRNYXBUeXBlSWQoKV0ubWF4Wm9vbSk7XG4gICAgICAgIHpvb20gPSBNYXRoLm1pbihNYXRoLm1heCh6b29tLG1pblpvb20pLG1heFpvb20pO1xuXG4gICAgICAgIGlmICh0aGF0LnByZXZab29tXyAhPSB6b29tKSB7XG4gICAgICAgICAgICB0aGF0LnByZXZab29tXyA9IHpvb207XG4gICAgICAgICAgICB0aGF0LnJlc2V0Vmlld3BvcnQoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIodGhpcy5tYXBfLCAnaWRsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGF0LnJlZHJhdygpO1xuICAgIH0pO1xuXG4gICAgLy8gRmluYWxseSwgYWRkIHRoZSBtYXJrZXJzXG4gICAgaWYgKG9wdF9tYXJrZXJzICYmIChvcHRfbWFya2Vycy5sZW5ndGggfHwgT2JqZWN0LmtleXMob3B0X21hcmtlcnMpLmxlbmd0aCkpIHtcbiAgICAgICAgdGhpcy5hZGRNYXJrZXJzKG9wdF9tYXJrZXJzLCBmYWxzZSk7XG4gICAgfVxufVxuXG5cbi8qKlxuICogVGhlIG1hcmtlciBjbHVzdGVyIGltYWdlIHBhdGguXG4gKlxuICogQHR5cGUge3N0cmluZ31cbiAqIEBwcml2YXRlXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuTUFSS0VSX0NMVVNURVJfSU1BR0VfUEFUSF8gPSAnLi4vaW1hZ2VzL20nO1xuXG5cbi8qKlxuICogVGhlIG1hcmtlciBjbHVzdGVyIGltYWdlIHBhdGguXG4gKlxuICogQHR5cGUge3N0cmluZ31cbiAqIEBwcml2YXRlXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuTUFSS0VSX0NMVVNURVJfSU1BR0VfRVhURU5TSU9OXyA9ICdwbmcnO1xuXG5cbi8qKlxuICogRXh0ZW5kcyBhIG9iamVjdHMgcHJvdG90eXBlIGJ5IGFub3RoZXJzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWQuXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMiBUaGUgb2JqZWN0IHRvIGV4dGVuZCB3aXRoLlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgbmV3IGV4dGVuZGVkIG9iamVjdC5cbiAqIEBpZ25vcmVcbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5leHRlbmQgPSBmdW5jdGlvbihvYmoxLCBvYmoyKSB7XG4gICAgcmV0dXJuIChmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gb2JqZWN0LnByb3RvdHlwZSkge1xuICAgICAgICAgICAgdGhpcy5wcm90b3R5cGVbcHJvcGVydHldID0gb2JqZWN0LnByb3RvdHlwZVtwcm9wZXJ0eV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSkuYXBwbHkob2JqMSwgW29iajJdKTtcbn07XG5cblxuLyoqXG4gKiBJbXBsZW1lbnRhaW9uIG9mIHRoZSBpbnRlcmZhY2UgbWV0aG9kLlxuICogQGlnbm9yZVxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLm9uQWRkID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRSZWFkeV8odHJ1ZSk7XG59O1xuXG4vKipcbiAqIEltcGxlbWVudGFpb24gb2YgdGhlIGludGVyZmFjZSBtZXRob2QuXG4gKiBAaWdub3JlXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge307XG5cbi8qKlxuICogU2V0cyB1cCB0aGUgc3R5bGVzIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLnNldHVwU3R5bGVzXyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnN0eWxlc18ubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMCwgc2l6ZTsgc2l6ZSA9IHRoaXMuc2l6ZXNbaV07IGkrKykge1xuICAgICAgICB0aGlzLnN0eWxlc18ucHVzaCh7XG4gICAgICAgICAgICB1cmw6IHRoaXMuaW1hZ2VQYXRoXyArIChpICsgMSkgKyAnLicgKyB0aGlzLmltYWdlRXh0ZW5zaW9uXyxcbiAgICAgICAgICAgIGhlaWdodDogc2l6ZSxcbiAgICAgICAgICAgIHdpZHRoOiBzaXplXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbi8qKlxuICogIEZpdCB0aGUgbWFwIHRvIHRoZSBib3VuZHMgb2YgdGhlIG1hcmtlcnMgaW4gdGhlIGNsdXN0ZXJlci5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5maXRNYXBUb01hcmtlcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbWFya2VycyA9IHRoaXMuZ2V0TWFya2VycygpO1xuICAgIHZhciBib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIG1hcmtlcjsgbWFya2VyID0gbWFya2Vyc1tpXTsgaSsrKSB7XG4gICAgICAgIGJvdW5kcy5leHRlbmQobWFya2VyLmdldFBvc2l0aW9uKCkpO1xuICAgIH1cblxuICAgIHRoaXMubWFwXy5maXRCb3VuZHMoYm91bmRzKTtcbn07XG5cblxuLyoqXG4gKiAgU2V0cyB0aGUgc3R5bGVzLlxuICpcbiAqICBAcGFyYW0ge09iamVjdH0gc3R5bGVzIFRoZSBzdHlsZSB0byBzZXQuXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuc2V0U3R5bGVzID0gZnVuY3Rpb24oc3R5bGVzKSB7XG4gICAgdGhpcy5zdHlsZXNfID0gc3R5bGVzO1xufTtcblxuXG4vKipcbiAqICBHZXRzIHRoZSBzdHlsZXMuXG4gKlxuICogIEByZXR1cm4ge09iamVjdH0gVGhlIHN0eWxlcyBvYmplY3QuXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZ2V0U3R5bGVzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3R5bGVzXztcbn07XG5cblxuLyoqXG4gKiBXaGV0aGVyIHpvb20gb24gY2xpY2sgaXMgc2V0LlxuICpcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgem9vbU9uQ2xpY2tfIGlzIHNldC5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5pc1pvb21PbkNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuem9vbU9uQ2xpY2tfO1xufTtcblxuLyoqXG4gKiBXaGV0aGVyIGF2ZXJhZ2UgY2VudGVyIGlzIHNldC5cbiAqXG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIGF2ZXJhZ2VDZW50ZXJfIGlzIHNldC5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5pc0F2ZXJhZ2VDZW50ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5hdmVyYWdlQ2VudGVyXztcbn07XG5cblxuLyoqXG4gKiAgUmV0dXJucyB0aGUgYXJyYXkgb2YgbWFya2VycyBpbiB0aGUgY2x1c3RlcmVyLlxuICpcbiAqICBAcmV0dXJuIHtBcnJheS48Z29vZ2xlLm1hcHMuTWFya2VyPn0gVGhlIG1hcmtlcnMuXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZ2V0TWFya2VycyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlcnNfO1xufTtcblxuXG4vKipcbiAqICBSZXR1cm5zIHRoZSBudW1iZXIgb2YgbWFya2VycyBpbiB0aGUgY2x1c3RlcmVyXG4gKlxuICogIEByZXR1cm4ge051bWJlcn0gVGhlIG51bWJlciBvZiBtYXJrZXJzLlxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmdldFRvdGFsTWFya2VycyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlcnNfLmxlbmd0aDtcbn07XG5cblxuLyoqXG4gKiAgU2V0cyB0aGUgbWF4IHpvb20gZm9yIHRoZSBjbHVzdGVyZXIuXG4gKlxuICogIEBwYXJhbSB7bnVtYmVyfSBtYXhab29tIFRoZSBtYXggem9vbSBsZXZlbC5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5zZXRNYXhab29tID0gZnVuY3Rpb24obWF4Wm9vbSkge1xuICAgIHRoaXMubWF4Wm9vbV8gPSBtYXhab29tO1xufTtcblxuXG4vKipcbiAqICBHZXRzIHRoZSBtYXggem9vbSBmb3IgdGhlIGNsdXN0ZXJlci5cbiAqXG4gKiAgQHJldHVybiB7bnVtYmVyfSBUaGUgbWF4IHpvb20gbGV2ZWwuXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZ2V0TWF4Wm9vbSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1heFpvb21fO1xufTtcblxuXG4vKipcbiAqICBUaGUgZnVuY3Rpb24gZm9yIGNhbGN1bGF0aW5nIHRoZSBjbHVzdGVyIGljb24gaW1hZ2UuXG4gKlxuICogIEBwYXJhbSB7QXJyYXkuPGdvb2dsZS5tYXBzLk1hcmtlcj59IG1hcmtlcnMgVGhlIG1hcmtlcnMgaW4gdGhlIGNsdXN0ZXJlci5cbiAqICBAcGFyYW0ge251bWJlcn0gbnVtU3R5bGVzIFRoZSBudW1iZXIgb2Ygc3R5bGVzIGF2YWlsYWJsZS5cbiAqICBAcmV0dXJuIHtPYmplY3R9IEEgb2JqZWN0IHByb3BlcnRpZXM6ICd0ZXh0JyAoc3RyaW5nKSBhbmQgJ2luZGV4JyAobnVtYmVyKS5cbiAqICBAcHJpdmF0ZVxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmNhbGN1bGF0b3JfID0gZnVuY3Rpb24obWFya2VycywgbnVtU3R5bGVzKSB7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgY291bnQgPSBtYXJrZXJzLmxlbmd0aDtcbiAgICB2YXIgZHYgPSBjb3VudDtcbiAgICB3aGlsZSAoZHYgIT09IDApIHtcbiAgICAgICAgZHYgPSBwYXJzZUludChkdiAvIDEwLCAxMCk7XG4gICAgICAgIGluZGV4Kys7XG4gICAgfVxuXG4gICAgaW5kZXggPSBNYXRoLm1pbihpbmRleCwgbnVtU3R5bGVzKTtcbiAgICByZXR1cm4ge1xuICAgICAgICB0ZXh0OiBjb3VudCxcbiAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgfTtcbn07XG5cblxuLyoqXG4gKiBTZXQgdGhlIGNhbGN1bGF0b3IgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbihBcnJheSwgbnVtYmVyKX0gY2FsY3VsYXRvciBUaGUgZnVuY3Rpb24gdG8gc2V0IGFzIHRoZVxuICogICAgIGNhbGN1bGF0b3IuIFRoZSBmdW5jdGlvbiBzaG91bGQgcmV0dXJuIGEgb2JqZWN0IHByb3BlcnRpZXM6XG4gKiAgICAgJ3RleHQnIChzdHJpbmcpIGFuZCAnaW5kZXgnIChudW1iZXIpLlxuICpcbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5zZXRDYWxjdWxhdG9yID0gZnVuY3Rpb24oY2FsY3VsYXRvcikge1xuICAgIHRoaXMuY2FsY3VsYXRvcl8gPSBjYWxjdWxhdG9yO1xufTtcblxuXG4vKipcbiAqIEdldCB0aGUgY2FsY3VsYXRvciBmdW5jdGlvbi5cbiAqXG4gKiBAcmV0dXJuIHtmdW5jdGlvbihBcnJheSwgbnVtYmVyKX0gdGhlIGNhbGN1bGF0b3IgZnVuY3Rpb24uXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZ2V0Q2FsY3VsYXRvciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmNhbGN1bGF0b3JfO1xufTtcblxuXG4vKipcbiAqIEFkZCBhbiBhcnJheSBvZiBtYXJrZXJzIHRvIHRoZSBjbHVzdGVyZXIuXG4gKlxuICogQHBhcmFtIHtBcnJheS48Z29vZ2xlLm1hcHMuTWFya2VyPn0gbWFya2VycyBUaGUgbWFya2VycyB0byBhZGQuXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSBvcHRfbm9kcmF3IFdoZXRoZXIgdG8gcmVkcmF3IHRoZSBjbHVzdGVycy5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5hZGRNYXJrZXJzID0gZnVuY3Rpb24obWFya2Vycywgb3B0X25vZHJhdykge1xuICAgIGlmIChtYXJrZXJzLmxlbmd0aCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbWFya2VyOyBtYXJrZXIgPSBtYXJrZXJzW2ldOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucHVzaE1hcmtlclRvXyhtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChPYmplY3Qua2V5cyhtYXJrZXJzKS5sZW5ndGgpIHtcbiAgICAgICAgZm9yICh2YXIgbWFya2VyIGluIG1hcmtlcnMpIHtcbiAgICAgICAgICAgIHRoaXMucHVzaE1hcmtlclRvXyhtYXJrZXJzW21hcmtlcl0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghb3B0X25vZHJhdykge1xuICAgICAgICB0aGlzLnJlZHJhdygpO1xuICAgIH1cbn07XG5cblxuLyoqXG4gKiBQdXNoZXMgYSBtYXJrZXIgdG8gdGhlIGNsdXN0ZXJlci5cbiAqXG4gKiBAcGFyYW0ge2dvb2dsZS5tYXBzLk1hcmtlcn0gbWFya2VyIFRoZSBtYXJrZXIgdG8gYWRkLlxuICogQHByaXZhdGVcbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5wdXNoTWFya2VyVG9fID0gZnVuY3Rpb24obWFya2VyKSB7XG4gICAgbWFya2VyLmlzQWRkZWQgPSBmYWxzZTtcbiAgICBpZiAobWFya2VyWydkcmFnZ2FibGUnXSkge1xuICAgICAgICAvLyBJZiB0aGUgbWFya2VyIGlzIGRyYWdnYWJsZSBhZGQgYSBsaXN0ZW5lciBzbyB3ZSB1cGRhdGUgdGhlIGNsdXN0ZXJzIG9uXG4gICAgICAgIC8vIHRoZSBkcmFnIGVuZC5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdkcmFnZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBtYXJrZXIuaXNBZGRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhhdC5yZXBhaW50KCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLm1hcmtlcnNfLnB1c2gobWFya2VyKTtcbn07XG5cblxuLyoqXG4gKiBBZGRzIGEgbWFya2VyIHRvIHRoZSBjbHVzdGVyZXIgYW5kIHJlZHJhd3MgaWYgbmVlZGVkLlxuICpcbiAqIEBwYXJhbSB7Z29vZ2xlLm1hcHMuTWFya2VyfSBtYXJrZXIgVGhlIG1hcmtlciB0byBhZGQuXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSBvcHRfbm9kcmF3IFdoZXRoZXIgdG8gcmVkcmF3IHRoZSBjbHVzdGVycy5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5hZGRNYXJrZXIgPSBmdW5jdGlvbihtYXJrZXIsIG9wdF9ub2RyYXcpIHtcbiAgICB0aGlzLnB1c2hNYXJrZXJUb18obWFya2VyKTtcbiAgICBpZiAoIW9wdF9ub2RyYXcpIHtcbiAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICB9XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlcyBhIG1hcmtlciBhbmQgcmV0dXJucyB0cnVlIGlmIHJlbW92ZWQsIGZhbHNlIGlmIG5vdFxuICpcbiAqIEBwYXJhbSB7Z29vZ2xlLm1hcHMuTWFya2VyfSBtYXJrZXIgVGhlIG1hcmtlciB0byByZW1vdmVcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgdGhlIG1hcmtlciB3YXMgcmVtb3ZlZCBvciBub3RcbiAqIEBwcml2YXRlXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUucmVtb3ZlTWFya2VyXyA9IGZ1bmN0aW9uKG1hcmtlcikge1xuICAgIHZhciBpbmRleCA9IC0xO1xuICAgIGlmICh0aGlzLm1hcmtlcnNfLmluZGV4T2YpIHtcbiAgICAgICAgaW5kZXggPSB0aGlzLm1hcmtlcnNfLmluZGV4T2YobWFya2VyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbTsgbSA9IHRoaXMubWFya2Vyc19baV07IGkrKykge1xuICAgICAgICAgICAgaWYgKG0gPT0gbWFya2VyKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgIC8vIE1hcmtlciBpcyBub3QgaW4gb3VyIGxpc3Qgb2YgbWFya2Vycy5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG1hcmtlci5zZXRNYXAobnVsbCk7XG5cbiAgICB0aGlzLm1hcmtlcnNfLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmUgYSBtYXJrZXIgZnJvbSB0aGUgY2x1c3Rlci5cbiAqXG4gKiBAcGFyYW0ge2dvb2dsZS5tYXBzLk1hcmtlcn0gbWFya2VyIFRoZSBtYXJrZXIgdG8gcmVtb3ZlLlxuICogQHBhcmFtIHtib29sZWFuPX0gb3B0X25vZHJhdyBPcHRpb25hbCBib29sZWFuIHRvIGZvcmNlIG5vIHJlZHJhdy5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIG1hcmtlciB3YXMgcmVtb3ZlZC5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5yZW1vdmVNYXJrZXIgPSBmdW5jdGlvbihtYXJrZXIsIG9wdF9ub2RyYXcpIHtcbiAgICB2YXIgcmVtb3ZlZCA9IHRoaXMucmVtb3ZlTWFya2VyXyhtYXJrZXIpO1xuXG4gICAgaWYgKCFvcHRfbm9kcmF3ICYmIHJlbW92ZWQpIHtcbiAgICAgICAgdGhpcy5yZXNldFZpZXdwb3J0KCk7XG4gICAgICAgIHRoaXMucmVkcmF3KCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlcyBhbiBhcnJheSBvZiBtYXJrZXJzIGZyb20gdGhlIGNsdXN0ZXIuXG4gKlxuICogQHBhcmFtIHtBcnJheS48Z29vZ2xlLm1hcHMuTWFya2VyPn0gbWFya2VycyBUaGUgbWFya2VycyB0byByZW1vdmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSBvcHRfbm9kcmF3IE9wdGlvbmFsIGJvb2xlYW4gdG8gZm9yY2Ugbm8gcmVkcmF3LlxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLnJlbW92ZU1hcmtlcnMgPSBmdW5jdGlvbihtYXJrZXJzLCBvcHRfbm9kcmF3KSB7XG4gICAgLy8gY3JlYXRlIGEgbG9jYWwgY29weSBvZiBtYXJrZXJzIGlmIHJlcXVpcmVkXG4gICAgLy8gKHJlbW92ZU1hcmtlcl8gbW9kaWZpZXMgdGhlIGdldE1hcmtlcnMoKSBhcnJheSBpbiBwbGFjZSlcbiAgICB2YXIgbWFya2Vyc0NvcHkgPSBtYXJrZXJzID09PSB0aGlzLmdldE1hcmtlcnMoKSA/IG1hcmtlcnMuc2xpY2UoKSA6IG1hcmtlcnM7XG4gICAgdmFyIHJlbW92ZWQgPSBmYWxzZTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBtYXJrZXI7IG1hcmtlciA9IG1hcmtlcnNDb3B5W2ldOyBpKyspIHtcbiAgICAgICAgdmFyIHIgPSB0aGlzLnJlbW92ZU1hcmtlcl8obWFya2VyKTtcbiAgICAgICAgcmVtb3ZlZCA9IHJlbW92ZWQgfHwgcjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdF9ub2RyYXcgJiYgcmVtb3ZlZCkge1xuICAgICAgICB0aGlzLnJlc2V0Vmlld3BvcnQoKTtcbiAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufTtcblxuXG4vKipcbiAqIFNldHMgdGhlIGNsdXN0ZXJlcidzIHJlYWR5IHN0YXRlLlxuICpcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVhZHkgVGhlIHN0YXRlLlxuICogQHByaXZhdGVcbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5zZXRSZWFkeV8gPSBmdW5jdGlvbihyZWFkeSkge1xuICAgIGlmICghdGhpcy5yZWFkeV8pIHtcbiAgICAgICAgdGhpcy5yZWFkeV8gPSByZWFkeTtcbiAgICAgICAgdGhpcy5jcmVhdGVDbHVzdGVyc18oKTtcbiAgICB9XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGNsdXN0ZXJzIGluIHRoZSBjbHVzdGVyZXIuXG4gKlxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNsdXN0ZXJzLlxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmdldFRvdGFsQ2x1c3RlcnMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5jbHVzdGVyc18ubGVuZ3RoO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgdGhlIGdvb2dsZSBtYXAgdGhhdCB0aGUgY2x1c3RlcmVyIGlzIGFzc29jaWF0ZWQgd2l0aC5cbiAqXG4gKiBAcmV0dXJuIHtnb29nbGUubWFwcy5NYXB9IFRoZSBtYXAuXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZ2V0TWFwID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwXztcbn07XG5cblxuLyoqXG4gKiBTZXRzIHRoZSBnb29nbGUgbWFwIHRoYXQgdGhlIGNsdXN0ZXJlciBpcyBhc3NvY2lhdGVkIHdpdGguXG4gKlxuICogQHBhcmFtIHtnb29nbGUubWFwcy5NYXB9IG1hcCBUaGUgbWFwLlxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLnNldE1hcCA9IGZ1bmN0aW9uKG1hcCkge1xuICAgIHRoaXMubWFwXyA9IG1hcDtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBzaXplIG9mIHRoZSBncmlkLlxuICpcbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIGdyaWQgc2l6ZS5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5nZXRHcmlkU2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdyaWRTaXplXztcbn07XG5cblxuLyoqXG4gKiBTZXRzIHRoZSBzaXplIG9mIHRoZSBncmlkLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBzaXplIFRoZSBncmlkIHNpemUuXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuc2V0R3JpZFNpemUgPSBmdW5jdGlvbihzaXplKSB7XG4gICAgdGhpcy5ncmlkU2l6ZV8gPSBzaXplO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgdGhlIG1pbiBjbHVzdGVyIHNpemUuXG4gKlxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgZ3JpZCBzaXplLlxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmdldE1pbkNsdXN0ZXJTaXplID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWluQ2x1c3RlclNpemVfO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBtaW4gY2x1c3RlciBzaXplLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBzaXplIFRoZSBncmlkIHNpemUuXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuc2V0TWluQ2x1c3RlclNpemUgPSBmdW5jdGlvbihzaXplKSB7XG4gICAgdGhpcy5taW5DbHVzdGVyU2l6ZV8gPSBzaXplO1xufTtcblxuXG4vKipcbiAqIEV4dGVuZHMgYSBib3VuZHMgb2JqZWN0IGJ5IHRoZSBncmlkIHNpemUuXG4gKlxuICogQHBhcmFtIHtnb29nbGUubWFwcy5MYXRMbmdCb3VuZHN9IGJvdW5kcyBUaGUgYm91bmRzIHRvIGV4dGVuZC5cbiAqIEByZXR1cm4ge2dvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc30gVGhlIGV4dGVuZGVkIGJvdW5kcy5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5nZXRFeHRlbmRlZEJvdW5kcyA9IGZ1bmN0aW9uKGJvdW5kcykge1xuICAgIHZhciBwcm9qZWN0aW9uID0gdGhpcy5nZXRQcm9qZWN0aW9uKCk7XG5cbiAgICAvLyBUdXJuIHRoZSBib3VuZHMgaW50byBsYXRsbmcuXG4gICAgdmFyIHRyID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhib3VuZHMuZ2V0Tm9ydGhFYXN0KCkubGF0KCksXG4gICAgICAgIGJvdW5kcy5nZXROb3J0aEVhc3QoKS5sbmcoKSk7XG4gICAgdmFyIGJsID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhib3VuZHMuZ2V0U291dGhXZXN0KCkubGF0KCksXG4gICAgICAgIGJvdW5kcy5nZXRTb3V0aFdlc3QoKS5sbmcoKSk7XG5cbiAgICAvLyBDb252ZXJ0IHRoZSBwb2ludHMgdG8gcGl4ZWxzIGFuZCB0aGUgZXh0ZW5kIG91dCBieSB0aGUgZ3JpZCBzaXplLlxuICAgIHZhciB0clBpeCA9IHByb2plY3Rpb24uZnJvbUxhdExuZ1RvRGl2UGl4ZWwodHIpO1xuICAgIHRyUGl4LnggKz0gdGhpcy5ncmlkU2l6ZV87XG4gICAgdHJQaXgueSAtPSB0aGlzLmdyaWRTaXplXztcblxuICAgIHZhciBibFBpeCA9IHByb2plY3Rpb24uZnJvbUxhdExuZ1RvRGl2UGl4ZWwoYmwpO1xuICAgIGJsUGl4LnggLT0gdGhpcy5ncmlkU2l6ZV87XG4gICAgYmxQaXgueSArPSB0aGlzLmdyaWRTaXplXztcblxuICAgIC8vIENvbnZlcnQgdGhlIHBpeGVsIHBvaW50cyBiYWNrIHRvIExhdExuZ1xuICAgIHZhciBuZSA9IHByb2plY3Rpb24uZnJvbURpdlBpeGVsVG9MYXRMbmcodHJQaXgpO1xuICAgIHZhciBzdyA9IHByb2plY3Rpb24uZnJvbURpdlBpeGVsVG9MYXRMbmcoYmxQaXgpO1xuXG4gICAgLy8gRXh0ZW5kIHRoZSBib3VuZHMgdG8gY29udGFpbiB0aGUgbmV3IGJvdW5kcy5cbiAgICBib3VuZHMuZXh0ZW5kKG5lKTtcbiAgICBib3VuZHMuZXh0ZW5kKHN3KTtcblxuICAgIHJldHVybiBib3VuZHM7XG59O1xuXG5cbi8qKlxuICogRGV0ZXJtaW5zIGlmIGEgbWFya2VyIGlzIGNvbnRhaW5lZCBpbiBhIGJvdW5kcy5cbiAqXG4gKiBAcGFyYW0ge2dvb2dsZS5tYXBzLk1hcmtlcn0gbWFya2VyIFRoZSBtYXJrZXIgdG8gY2hlY2suXG4gKiBAcGFyYW0ge2dvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc30gYm91bmRzIFRoZSBib3VuZHMgdG8gY2hlY2sgYWdhaW5zdC5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIG1hcmtlciBpcyBpbiB0aGUgYm91bmRzLlxuICogQHByaXZhdGVcbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5pc01hcmtlckluQm91bmRzXyA9IGZ1bmN0aW9uKG1hcmtlciwgYm91bmRzKSB7XG4gICAgcmV0dXJuIGJvdW5kcy5jb250YWlucyhtYXJrZXIuZ2V0UG9zaXRpb24oKSk7XG59O1xuXG5cbi8qKlxuICogQ2xlYXJzIGFsbCBjbHVzdGVycyBhbmQgbWFya2VycyBmcm9tIHRoZSBjbHVzdGVyZXIuXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuY2xlYXJNYXJrZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZXNldFZpZXdwb3J0KHRydWUpO1xuXG4gICAgLy8gU2V0IHRoZSBtYXJrZXJzIGEgZW1wdHkgYXJyYXkuXG4gICAgdGhpcy5tYXJrZXJzXyA9IFtdO1xufTtcblxuXG4vKipcbiAqIENsZWFycyBhbGwgZXhpc3RpbmcgY2x1c3RlcnMgYW5kIHJlY3JlYXRlcyB0aGVtLlxuICogQHBhcmFtIHtib29sZWFufSBvcHRfaGlkZSBUbyBhbHNvIGhpZGUgdGhlIG1hcmtlci5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5yZXNldFZpZXdwb3J0ID0gZnVuY3Rpb24ob3B0X2hpZGUpIHtcbiAgICAvLyBSZW1vdmUgYWxsIHRoZSBjbHVzdGVyc1xuICAgIGZvciAodmFyIGkgPSAwLCBjbHVzdGVyOyBjbHVzdGVyID0gdGhpcy5jbHVzdGVyc19baV07IGkrKykge1xuICAgICAgICBjbHVzdGVyLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IHRoZSBtYXJrZXJzIHRvIG5vdCBiZSBhZGRlZCBhbmQgdG8gYmUgaW52aXNpYmxlLlxuICAgIGZvciAodmFyIGkgPSAwLCBtYXJrZXI7IG1hcmtlciA9IHRoaXMubWFya2Vyc19baV07IGkrKykge1xuICAgICAgICBtYXJrZXIuaXNBZGRlZCA9IGZhbHNlO1xuICAgICAgICBpZiAob3B0X2hpZGUpIHtcbiAgICAgICAgICAgIG1hcmtlci5zZXRNYXAobnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNsdXN0ZXJzXyA9IFtdO1xufTtcblxuLyoqXG4gKlxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLnJlcGFpbnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgb2xkQ2x1c3RlcnMgPSB0aGlzLmNsdXN0ZXJzXy5zbGljZSgpO1xuICAgIHRoaXMuY2x1c3RlcnNfLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5yZXNldFZpZXdwb3J0KCk7XG4gICAgdGhpcy5yZWRyYXcoKTtcblxuICAgIC8vIFJlbW92ZSB0aGUgb2xkIGNsdXN0ZXJzLlxuICAgIC8vIERvIGl0IGluIGEgdGltZW91dCBzbyB0aGUgb3RoZXIgY2x1c3RlcnMgaGF2ZSBiZWVuIGRyYXduIGZpcnN0LlxuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgY2x1c3RlcjsgY2x1c3RlciA9IG9sZENsdXN0ZXJzW2ldOyBpKyspIHtcbiAgICAgICAgICAgIGNsdXN0ZXIucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9LCAwKTtcbn07XG5cblxuLyoqXG4gKiBSZWRyYXdzIHRoZSBjbHVzdGVycy5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5yZWRyYXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNyZWF0ZUNsdXN0ZXJzXygpO1xufTtcblxuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGRpc3RhbmNlIGJldHdlZW4gdHdvIGxhdGxuZyBsb2NhdGlvbnMgaW4ga20uXG4gKiBAc2VlIGh0dHA6Ly93d3cubW92YWJsZS10eXBlLmNvLnVrL3NjcmlwdHMvbGF0bG9uZy5odG1sXG4gKlxuICogQHBhcmFtIHtnb29nbGUubWFwcy5MYXRMbmd9IHAxIFRoZSBmaXJzdCBsYXQgbG5nIHBvaW50LlxuICogQHBhcmFtIHtnb29nbGUubWFwcy5MYXRMbmd9IHAyIFRoZSBzZWNvbmQgbGF0IGxuZyBwb2ludC5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHR3byBwb2ludHMgaW4ga20uXG4gKiBAcHJpdmF0ZVxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmRpc3RhbmNlQmV0d2VlblBvaW50c18gPSBmdW5jdGlvbihwMSwgcDIpIHtcbiAgICBpZiAoIXAxIHx8ICFwMikge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICB2YXIgUiA9IDYzNzE7IC8vIFJhZGl1cyBvZiB0aGUgRWFydGggaW4ga21cbiAgICB2YXIgZExhdCA9IChwMi5sYXQoKSAtIHAxLmxhdCgpKSAqIE1hdGguUEkgLyAxODA7XG4gICAgdmFyIGRMb24gPSAocDIubG5nKCkgLSBwMS5sbmcoKSkgKiBNYXRoLlBJIC8gMTgwO1xuICAgIHZhciBhID0gTWF0aC5zaW4oZExhdCAvIDIpICogTWF0aC5zaW4oZExhdCAvIDIpICtcbiAgICAgICAgTWF0aC5jb3MocDEubGF0KCkgKiBNYXRoLlBJIC8gMTgwKSAqIE1hdGguY29zKHAyLmxhdCgpICogTWF0aC5QSSAvIDE4MCkgKlxuICAgICAgICBNYXRoLnNpbihkTG9uIC8gMikgKiBNYXRoLnNpbihkTG9uIC8gMik7XG4gICAgdmFyIGMgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xuICAgIHZhciBkID0gUiAqIGM7XG4gICAgcmV0dXJuIGQ7XG59O1xuXG5cbi8qKlxuICogQWRkIGEgbWFya2VyIHRvIGEgY2x1c3Rlciwgb3IgY3JlYXRlcyBhIG5ldyBjbHVzdGVyLlxuICpcbiAqIEBwYXJhbSB7Z29vZ2xlLm1hcHMuTWFya2VyfSBtYXJrZXIgVGhlIG1hcmtlciB0byBhZGQuXG4gKiBAcHJpdmF0ZVxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmFkZFRvQ2xvc2VzdENsdXN0ZXJfID0gZnVuY3Rpb24obWFya2VyKSB7XG4gICAgdmFyIGRpc3RhbmNlID0gNDAwMDA7IC8vIFNvbWUgbGFyZ2UgbnVtYmVyXG4gICAgdmFyIGNsdXN0ZXJUb0FkZFRvID0gbnVsbDtcbiAgICB2YXIgcG9zID0gbWFya2VyLmdldFBvc2l0aW9uKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGNsdXN0ZXI7IGNsdXN0ZXIgPSB0aGlzLmNsdXN0ZXJzX1tpXTsgaSsrKSB7XG4gICAgICAgIHZhciBjZW50ZXIgPSBjbHVzdGVyLmdldENlbnRlcigpO1xuICAgICAgICBpZiAoY2VudGVyKSB7XG4gICAgICAgICAgICB2YXIgZCA9IHRoaXMuZGlzdGFuY2VCZXR3ZWVuUG9pbnRzXyhjZW50ZXIsIG1hcmtlci5nZXRQb3NpdGlvbigpKTtcbiAgICAgICAgICAgIGlmIChkIDwgZGlzdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IGQ7XG4gICAgICAgICAgICAgICAgY2x1c3RlclRvQWRkVG8gPSBjbHVzdGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNsdXN0ZXJUb0FkZFRvICYmIGNsdXN0ZXJUb0FkZFRvLmlzTWFya2VySW5DbHVzdGVyQm91bmRzKG1hcmtlcikpIHtcbiAgICAgICAgY2x1c3RlclRvQWRkVG8uYWRkTWFya2VyKG1hcmtlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGNsdXN0ZXIgPSBuZXcgQ2x1c3Rlcih0aGlzKTtcbiAgICAgICAgY2x1c3Rlci5hZGRNYXJrZXIobWFya2VyKTtcbiAgICAgICAgdGhpcy5jbHVzdGVyc18ucHVzaChjbHVzdGVyKTtcbiAgICB9XG59O1xuXG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgY2x1c3RlcnMuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5jcmVhdGVDbHVzdGVyc18gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMucmVhZHlfKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBHZXQgb3VyIGN1cnJlbnQgbWFwIHZpZXcgYm91bmRzLlxuICAgIC8vIENyZWF0ZSBhIG5ldyBib3VuZHMgb2JqZWN0IHNvIHdlIGRvbid0IGFmZmVjdCB0aGUgbWFwLlxuICAgIHZhciBtYXBCb3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKHRoaXMubWFwXy5nZXRCb3VuZHMoKS5nZXRTb3V0aFdlc3QoKSxcbiAgICAgICAgdGhpcy5tYXBfLmdldEJvdW5kcygpLmdldE5vcnRoRWFzdCgpKTtcbiAgICB2YXIgYm91bmRzID0gdGhpcy5nZXRFeHRlbmRlZEJvdW5kcyhtYXBCb3VuZHMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIG1hcmtlcjsgbWFya2VyID0gdGhpcy5tYXJrZXJzX1tpXTsgaSsrKSB7XG4gICAgICAgIGlmICghbWFya2VyLmlzQWRkZWQgJiYgdGhpcy5pc01hcmtlckluQm91bmRzXyhtYXJrZXIsIGJvdW5kcykpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9DbG9zZXN0Q2x1c3Rlcl8obWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuLyoqXG4gKiBBIGNsdXN0ZXIgdGhhdCBjb250YWlucyBtYXJrZXJzLlxuICpcbiAqIEBwYXJhbSB7TWFya2VyQ2x1c3RlcmVyfSBtYXJrZXJDbHVzdGVyZXIgVGhlIG1hcmtlcmNsdXN0ZXJlciB0aGF0IHRoaXNcbiAqICAgICBjbHVzdGVyIGlzIGFzc29jaWF0ZWQgd2l0aC5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGlnbm9yZVxuICovXG5mdW5jdGlvbiBDbHVzdGVyKG1hcmtlckNsdXN0ZXJlcikge1xuICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyXyA9IG1hcmtlckNsdXN0ZXJlcjtcbiAgICB0aGlzLm1hcF8gPSBtYXJrZXJDbHVzdGVyZXIuZ2V0TWFwKCk7XG4gICAgdGhpcy5ncmlkU2l6ZV8gPSBtYXJrZXJDbHVzdGVyZXIuZ2V0R3JpZFNpemUoKTtcbiAgICB0aGlzLm1pbkNsdXN0ZXJTaXplXyA9IG1hcmtlckNsdXN0ZXJlci5nZXRNaW5DbHVzdGVyU2l6ZSgpO1xuICAgIHRoaXMuYXZlcmFnZUNlbnRlcl8gPSBtYXJrZXJDbHVzdGVyZXIuaXNBdmVyYWdlQ2VudGVyKCk7XG4gICAgdGhpcy5jZW50ZXJfID0gbnVsbDtcbiAgICB0aGlzLm1hcmtlcnNfID0gW107XG4gICAgdGhpcy5ib3VuZHNfID0gbnVsbDtcbiAgICB0aGlzLmNsdXN0ZXJJY29uXyA9IG5ldyBDbHVzdGVySWNvbih0aGlzLCBtYXJrZXJDbHVzdGVyZXIuZ2V0U3R5bGVzKCksXG4gICAgICAgIG1hcmtlckNsdXN0ZXJlci5nZXRHcmlkU2l6ZSgpKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbnMgaWYgYSBtYXJrZXIgaXMgYWxyZWFkeSBhZGRlZCB0byB0aGUgY2x1c3Rlci5cbiAqXG4gKiBAcGFyYW0ge2dvb2dsZS5tYXBzLk1hcmtlcn0gbWFya2VyIFRoZSBtYXJrZXIgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBtYXJrZXIgaXMgYWxyZWFkeSBhZGRlZC5cbiAqL1xuQ2x1c3Rlci5wcm90b3R5cGUuaXNNYXJrZXJBbHJlYWR5QWRkZWQgPSBmdW5jdGlvbihtYXJrZXIpIHtcbiAgICBpZiAodGhpcy5tYXJrZXJzXy5pbmRleE9mKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcmtlcnNfLmluZGV4T2YobWFya2VyKSAhPSAtMTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbTsgbSA9IHRoaXMubWFya2Vyc19baV07IGkrKykge1xuICAgICAgICAgICAgaWYgKG0gPT0gbWFya2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuXG4vKipcbiAqIEFkZCBhIG1hcmtlciB0aGUgY2x1c3Rlci5cbiAqXG4gKiBAcGFyYW0ge2dvb2dsZS5tYXBzLk1hcmtlcn0gbWFya2VyIFRoZSBtYXJrZXIgdG8gYWRkLlxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgbWFya2VyIHdhcyBhZGRlZC5cbiAqL1xuQ2x1c3Rlci5wcm90b3R5cGUuYWRkTWFya2VyID0gZnVuY3Rpb24obWFya2VyKSB7XG4gICAgaWYgKHRoaXMuaXNNYXJrZXJBbHJlYWR5QWRkZWQobWFya2VyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmNlbnRlcl8pIHtcbiAgICAgICAgdGhpcy5jZW50ZXJfID0gbWFya2VyLmdldFBvc2l0aW9uKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQm91bmRzXygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmF2ZXJhZ2VDZW50ZXJfKSB7XG4gICAgICAgICAgICB2YXIgbCA9IHRoaXMubWFya2Vyc18ubGVuZ3RoICsgMTtcbiAgICAgICAgICAgIHZhciBsYXQgPSAodGhpcy5jZW50ZXJfLmxhdCgpICogKGwtMSkgKyBtYXJrZXIuZ2V0UG9zaXRpb24oKS5sYXQoKSkgLyBsO1xuICAgICAgICAgICAgdmFyIGxuZyA9ICh0aGlzLmNlbnRlcl8ubG5nKCkgKiAobC0xKSArIG1hcmtlci5nZXRQb3NpdGlvbigpLmxuZygpKSAvIGw7XG4gICAgICAgICAgICB0aGlzLmNlbnRlcl8gPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG5nKTtcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlQm91bmRzXygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFya2VyLmlzQWRkZWQgPSB0cnVlO1xuICAgIHRoaXMubWFya2Vyc18ucHVzaChtYXJrZXIpO1xuXG4gICAgdmFyIGxlbiA9IHRoaXMubWFya2Vyc18ubGVuZ3RoO1xuICAgIGlmIChsZW4gPCB0aGlzLm1pbkNsdXN0ZXJTaXplXyAmJiBtYXJrZXIuZ2V0TWFwKCkgIT0gdGhpcy5tYXBfKSB7XG4gICAgICAgIC8vIE1pbiBjbHVzdGVyIHNpemUgbm90IHJlYWNoZWQgc28gc2hvdyB0aGUgbWFya2VyLlxuICAgICAgICBtYXJrZXIuc2V0TWFwKHRoaXMubWFwXyk7XG4gICAgfVxuXG4gICAgaWYgKGxlbiA9PSB0aGlzLm1pbkNsdXN0ZXJTaXplXykge1xuICAgICAgICAvLyBIaWRlIHRoZSBtYXJrZXJzIHRoYXQgd2VyZSBzaG93aW5nLlxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm1hcmtlcnNfW2ldLnNldE1hcChudWxsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChsZW4gPj0gdGhpcy5taW5DbHVzdGVyU2l6ZV8pIHtcbiAgICAgICAgbWFya2VyLnNldE1hcChudWxsKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZUljb24oKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBtYXJrZXIgY2x1c3RlcmVyIHRoYXQgdGhlIGNsdXN0ZXIgaXMgYXNzb2NpYXRlZCB3aXRoLlxuICpcbiAqIEByZXR1cm4ge01hcmtlckNsdXN0ZXJlcn0gVGhlIGFzc29jaWF0ZWQgbWFya2VyIGNsdXN0ZXJlci5cbiAqL1xuQ2x1c3Rlci5wcm90b3R5cGUuZ2V0TWFya2VyQ2x1c3RlcmVyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyXztcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBib3VuZHMgb2YgdGhlIGNsdXN0ZXIuXG4gKlxuICogQHJldHVybiB7Z29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzfSB0aGUgY2x1c3RlciBib3VuZHMuXG4gKi9cbkNsdXN0ZXIucHJvdG90eXBlLmdldEJvdW5kcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKHRoaXMuY2VudGVyXywgdGhpcy5jZW50ZXJfKTtcbiAgICB2YXIgbWFya2VycyA9IHRoaXMuZ2V0TWFya2VycygpO1xuICAgIGZvciAodmFyIGkgPSAwLCBtYXJrZXI7IG1hcmtlciA9IG1hcmtlcnNbaV07IGkrKykge1xuICAgICAgICBib3VuZHMuZXh0ZW5kKG1hcmtlci5nZXRQb3NpdGlvbigpKTtcbiAgICB9XG4gICAgcmV0dXJuIGJvdW5kcztcbn07XG5cblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBjbHVzdGVyXG4gKi9cbkNsdXN0ZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2x1c3Rlckljb25fLnJlbW92ZSgpO1xuICAgIHRoaXMubWFya2Vyc18ubGVuZ3RoID0gMDtcbiAgICBkZWxldGUgdGhpcy5tYXJrZXJzXztcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgbWFya2VycyBpbiB0aGUgY2x1c3Rlci5cbiAqXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBudW1iZXIgb2YgbWFya2VycyBpbiB0aGUgY2x1c3Rlci5cbiAqL1xuQ2x1c3Rlci5wcm90b3R5cGUuZ2V0U2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlcnNfLmxlbmd0aDtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgbGlzdCBvZiB0aGUgbWFya2VycyBpbiB0aGUgY2x1c3Rlci5cbiAqXG4gKiBAcmV0dXJuIHtBcnJheS48Z29vZ2xlLm1hcHMuTWFya2VyPn0gVGhlIG1hcmtlcnMgaW4gdGhlIGNsdXN0ZXIuXG4gKi9cbkNsdXN0ZXIucHJvdG90eXBlLmdldE1hcmtlcnMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJzXztcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBjZW50ZXIgb2YgdGhlIGNsdXN0ZXIuXG4gKlxuICogQHJldHVybiB7Z29vZ2xlLm1hcHMuTGF0TG5nfSBUaGUgY2x1c3RlciBjZW50ZXIuXG4gKi9cbkNsdXN0ZXIucHJvdG90eXBlLmdldENlbnRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmNlbnRlcl87XG59O1xuXG5cbi8qKlxuICogQ2FsY3VsYXRlZCB0aGUgZXh0ZW5kZWQgYm91bmRzIG9mIHRoZSBjbHVzdGVyIHdpdGggdGhlIGdyaWQuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuQ2x1c3Rlci5wcm90b3R5cGUuY2FsY3VsYXRlQm91bmRzXyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKHRoaXMuY2VudGVyXywgdGhpcy5jZW50ZXJfKTtcbiAgICB0aGlzLmJvdW5kc18gPSB0aGlzLm1hcmtlckNsdXN0ZXJlcl8uZ2V0RXh0ZW5kZWRCb3VuZHMoYm91bmRzKTtcbn07XG5cblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIGEgbWFya2VyIGxpZXMgaW4gdGhlIGNsdXN0ZXJzIGJvdW5kcy5cbiAqXG4gKiBAcGFyYW0ge2dvb2dsZS5tYXBzLk1hcmtlcn0gbWFya2VyIFRoZSBtYXJrZXIgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBtYXJrZXIgbGllcyBpbiB0aGUgYm91bmRzLlxuICovXG5DbHVzdGVyLnByb3RvdHlwZS5pc01hcmtlckluQ2x1c3RlckJvdW5kcyA9IGZ1bmN0aW9uKG1hcmtlcikge1xuICAgIHJldHVybiB0aGlzLmJvdW5kc18uY29udGFpbnMobWFya2VyLmdldFBvc2l0aW9uKCkpO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgdGhlIG1hcCB0aGF0IHRoZSBjbHVzdGVyIGlzIGFzc29jaWF0ZWQgd2l0aC5cbiAqXG4gKiBAcmV0dXJuIHtnb29nbGUubWFwcy5NYXB9IFRoZSBtYXAuXG4gKi9cbkNsdXN0ZXIucHJvdG90eXBlLmdldE1hcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1hcF87XG59O1xuXG5cbi8qKlxuICogVXBkYXRlcyB0aGUgY2x1c3RlciBpY29uXG4gKi9cbkNsdXN0ZXIucHJvdG90eXBlLnVwZGF0ZUljb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgem9vbSA9IHRoaXMubWFwXy5nZXRab29tKCk7XG4gICAgdmFyIG16ID0gdGhpcy5tYXJrZXJDbHVzdGVyZXJfLmdldE1heFpvb20oKTtcblxuICAgIGlmIChteiAmJiB6b29tID4gbXopIHtcbiAgICAgICAgLy8gVGhlIHpvb20gaXMgZ3JlYXRlciB0aGFuIG91ciBtYXggem9vbSBzbyBzaG93IGFsbCB0aGUgbWFya2VycyBpbiBjbHVzdGVyLlxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbWFya2VyOyBtYXJrZXIgPSB0aGlzLm1hcmtlcnNfW2ldOyBpKyspIHtcbiAgICAgICAgICAgIG1hcmtlci5zZXRNYXAodGhpcy5tYXBfKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWFya2Vyc18ubGVuZ3RoIDwgdGhpcy5taW5DbHVzdGVyU2l6ZV8pIHtcbiAgICAgICAgLy8gTWluIGNsdXN0ZXIgc2l6ZSBub3QgeWV0IHJlYWNoZWQuXG4gICAgICAgIHRoaXMuY2x1c3Rlckljb25fLmhpZGUoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBudW1TdHlsZXMgPSB0aGlzLm1hcmtlckNsdXN0ZXJlcl8uZ2V0U3R5bGVzKCkubGVuZ3RoO1xuICAgIHZhciBzdW1zID0gdGhpcy5tYXJrZXJDbHVzdGVyZXJfLmdldENhbGN1bGF0b3IoKSh0aGlzLm1hcmtlcnNfLCBudW1TdHlsZXMpO1xuICAgIHRoaXMuY2x1c3Rlckljb25fLnNldENlbnRlcih0aGlzLmNlbnRlcl8pO1xuICAgIHRoaXMuY2x1c3Rlckljb25fLnNldFN1bXMoc3Vtcyk7XG4gICAgdGhpcy5jbHVzdGVySWNvbl8uc2hvdygpO1xufTtcblxuXG4vKipcbiAqIEEgY2x1c3RlciBpY29uXG4gKlxuICogQHBhcmFtIHtDbHVzdGVyfSBjbHVzdGVyIFRoZSBjbHVzdGVyIHRvIGJlIGFzc29jaWF0ZWQgd2l0aC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZXMgQW4gb2JqZWN0IHRoYXQgaGFzIHN0eWxlIHByb3BlcnRpZXM6XG4gKiAgICAgJ3VybCc6IChzdHJpbmcpIFRoZSBpbWFnZSB1cmwuXG4gKiAgICAgJ2hlaWdodCc6IChudW1iZXIpIFRoZSBpbWFnZSBoZWlnaHQuXG4gKiAgICAgJ3dpZHRoJzogKG51bWJlcikgVGhlIGltYWdlIHdpZHRoLlxuICogICAgICdhbmNob3InOiAoQXJyYXkpIFRoZSBhbmNob3IgcG9zaXRpb24gb2YgdGhlIGxhYmVsIHRleHQuXG4gKiAgICAgJ3RleHRDb2xvcic6IChzdHJpbmcpIFRoZSB0ZXh0IGNvbG9yLlxuICogICAgICd0ZXh0U2l6ZSc6IChudW1iZXIpIFRoZSB0ZXh0IHNpemUuXG4gKiAgICAgJ2JhY2tncm91bmRQb3NpdGlvbjogKHN0cmluZykgVGhlIGJhY2tncm91bmQgcG9zdGl0aW9uIHgsIHkuXG4gKiBAcGFyYW0ge251bWJlcj19IG9wdF9wYWRkaW5nIE9wdGlvbmFsIHBhZGRpbmcgdG8gYXBwbHkgdG8gdGhlIGNsdXN0ZXIgaWNvbi5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgZ29vZ2xlLm1hcHMuT3ZlcmxheVZpZXdcbiAqIEBpZ25vcmVcbiAqL1xuZnVuY3Rpb24gQ2x1c3Rlckljb24oY2x1c3Rlciwgc3R5bGVzLCBvcHRfcGFkZGluZykge1xuICAgIGNsdXN0ZXIuZ2V0TWFya2VyQ2x1c3RlcmVyKCkuZXh0ZW5kKENsdXN0ZXJJY29uLCBnb29nbGUubWFwcy5PdmVybGF5Vmlldyk7XG5cbiAgICB0aGlzLnN0eWxlc18gPSBzdHlsZXM7XG4gICAgdGhpcy5wYWRkaW5nXyA9IG9wdF9wYWRkaW5nIHx8IDA7XG4gICAgdGhpcy5jbHVzdGVyXyA9IGNsdXN0ZXI7XG4gICAgdGhpcy5jZW50ZXJfID0gbnVsbDtcbiAgICB0aGlzLm1hcF8gPSBjbHVzdGVyLmdldE1hcCgpO1xuICAgIHRoaXMuZGl2XyA9IG51bGw7XG4gICAgdGhpcy5zdW1zXyA9IG51bGw7XG4gICAgdGhpcy52aXNpYmxlXyA9IGZhbHNlO1xuXG4gICAgdGhpcy5zZXRNYXAodGhpcy5tYXBfKTtcbn1cblxuXG4vKipcbiAqIFRyaWdnZXJzIHRoZSBjbHVzdGVyY2xpY2sgZXZlbnQgYW5kIHpvb20ncyBpZiB0aGUgb3B0aW9uIGlzIHNldC5cbiAqL1xuQ2x1c3Rlckljb24ucHJvdG90eXBlLnRyaWdnZXJDbHVzdGVyQ2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbWFya2VyQ2x1c3RlcmVyID0gdGhpcy5jbHVzdGVyXy5nZXRNYXJrZXJDbHVzdGVyZXIoKTtcblxuICAgIC8vIFRyaWdnZXIgdGhlIGNsdXN0ZXJjbGljayBldmVudC5cbiAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcmtlckNsdXN0ZXJlci5tYXBfLCAnY2x1c3RlcmNsaWNrJywgdGhpcy5jbHVzdGVyXyk7XG5cbiAgICBpZiAobWFya2VyQ2x1c3RlcmVyLmlzWm9vbU9uQ2xpY2soKSkge1xuICAgICAgICAvLyBab29tIGludG8gdGhlIGNsdXN0ZXIuXG4gICAgICAgIHRoaXMubWFwXy5maXRCb3VuZHModGhpcy5jbHVzdGVyXy5nZXRCb3VuZHMoKSk7XG4gICAgfVxufTtcblxuXG4vKipcbiAqIEFkZGluZyB0aGUgY2x1c3RlciBpY29uIHRvIHRoZSBkb20uXG4gKiBAaWdub3JlXG4gKi9cbkNsdXN0ZXJJY29uLnByb3RvdHlwZS5vbkFkZCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZGl2XyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xuICAgIGlmICh0aGlzLnZpc2libGVfKSB7XG4gICAgICAgIHZhciBwb3MgPSB0aGlzLmdldFBvc0Zyb21MYXRMbmdfKHRoaXMuY2VudGVyXyk7XG4gICAgICAgIHRoaXMuZGl2Xy5zdHlsZS5jc3NUZXh0ID0gdGhpcy5jcmVhdGVDc3MocG9zKTtcbiAgICAgICAgdGhpcy5kaXZfLmlubmVySFRNTCA9IHRoaXMuc3Vtc18udGV4dDtcbiAgICB9XG5cbiAgICB2YXIgcGFuZXMgPSB0aGlzLmdldFBhbmVzKCk7XG4gICAgcGFuZXMub3ZlcmxheU1vdXNlVGFyZ2V0LmFwcGVuZENoaWxkKHRoaXMuZGl2Xyk7XG5cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkRG9tTGlzdGVuZXIodGhpcy5kaXZfLCAnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhhdC50cmlnZ2VyQ2x1c3RlckNsaWNrKCk7XG4gICAgfSk7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgcG9zaXRpb24gdG8gcGxhY2UgdGhlIGRpdiBkZW5kaW5nIG9uIHRoZSBsYXRsbmcuXG4gKlxuICogQHBhcmFtIHtnb29nbGUubWFwcy5MYXRMbmd9IGxhdGxuZyBUaGUgcG9zaXRpb24gaW4gbGF0bG5nLlxuICogQHJldHVybiB7Z29vZ2xlLm1hcHMuUG9pbnR9IFRoZSBwb3NpdGlvbiBpbiBwaXhlbHMuXG4gKiBAcHJpdmF0ZVxuICovXG5DbHVzdGVySWNvbi5wcm90b3R5cGUuZ2V0UG9zRnJvbUxhdExuZ18gPSBmdW5jdGlvbihsYXRsbmcpIHtcbiAgICB2YXIgcG9zID0gdGhpcy5nZXRQcm9qZWN0aW9uKCkuZnJvbUxhdExuZ1RvRGl2UGl4ZWwobGF0bG5nKTtcbiAgICBwb3MueCAtPSBwYXJzZUludCh0aGlzLndpZHRoXyAvIDIsIDEwKTtcbiAgICBwb3MueSAtPSBwYXJzZUludCh0aGlzLmhlaWdodF8gLyAyLCAxMCk7XG4gICAgcmV0dXJuIHBvcztcbn07XG5cblxuLyoqXG4gKiBEcmF3IHRoZSBpY29uLlxuICogQGlnbm9yZVxuICovXG5DbHVzdGVySWNvbi5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnZpc2libGVfKSB7XG4gICAgICAgIHZhciBwb3MgPSB0aGlzLmdldFBvc0Zyb21MYXRMbmdfKHRoaXMuY2VudGVyXyk7XG4gICAgICAgIHRoaXMuZGl2Xy5zdHlsZS50b3AgPSBwb3MueSArICdweCc7XG4gICAgICAgIHRoaXMuZGl2Xy5zdHlsZS5sZWZ0ID0gcG9zLnggKyAncHgnO1xuICAgIH1cbn07XG5cblxuLyoqXG4gKiBIaWRlIHRoZSBpY29uLlxuICovXG5DbHVzdGVySWNvbi5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmRpdl8pIHtcbiAgICAgICAgdGhpcy5kaXZfLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuICAgIHRoaXMudmlzaWJsZV8gPSBmYWxzZTtcbn07XG5cblxuLyoqXG4gKiBQb3NpdGlvbiBhbmQgc2hvdyB0aGUgaWNvbi5cbiAqL1xuQ2x1c3Rlckljb24ucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5kaXZfKSB7XG4gICAgICAgIHZhciBwb3MgPSB0aGlzLmdldFBvc0Zyb21MYXRMbmdfKHRoaXMuY2VudGVyXyk7XG4gICAgICAgIHRoaXMuZGl2Xy5zdHlsZS5jc3NUZXh0ID0gdGhpcy5jcmVhdGVDc3MocG9zKTtcbiAgICAgICAgdGhpcy5kaXZfLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICB9XG4gICAgdGhpcy52aXNpYmxlXyA9IHRydWU7XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpY29uIGZyb20gdGhlIG1hcFxuICovXG5DbHVzdGVySWNvbi5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRNYXAobnVsbCk7XG59O1xuXG5cbi8qKlxuICogSW1wbGVtZW50YXRpb24gb2YgdGhlIG9uUmVtb3ZlIGludGVyZmFjZS5cbiAqIEBpZ25vcmVcbiAqL1xuQ2x1c3Rlckljb24ucHJvdG90eXBlLm9uUmVtb3ZlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZGl2XyAmJiB0aGlzLmRpdl8ucGFyZW50Tm9kZSkge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgdGhpcy5kaXZfLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5kaXZfKTtcbiAgICAgICAgdGhpcy5kaXZfID0gbnVsbDtcbiAgICB9XG59O1xuXG5cbi8qKlxuICogU2V0IHRoZSBzdW1zIG9mIHRoZSBpY29uLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdW1zIFRoZSBzdW1zIGNvbnRhaW5pbmc6XG4gKiAgICd0ZXh0JzogKHN0cmluZykgVGhlIHRleHQgdG8gZGlzcGxheSBpbiB0aGUgaWNvbi5cbiAqICAgJ2luZGV4JzogKG51bWJlcikgVGhlIHN0eWxlIGluZGV4IG9mIHRoZSBpY29uLlxuICovXG5DbHVzdGVySWNvbi5wcm90b3R5cGUuc2V0U3VtcyA9IGZ1bmN0aW9uKHN1bXMpIHtcbiAgICB0aGlzLnN1bXNfID0gc3VtcztcbiAgICB0aGlzLnRleHRfID0gc3Vtcy50ZXh0O1xuICAgIHRoaXMuaW5kZXhfID0gc3Vtcy5pbmRleDtcbiAgICBpZiAodGhpcy5kaXZfKSB7XG4gICAgICAgIHRoaXMuZGl2Xy5pbm5lckhUTUwgPSBzdW1zLnRleHQ7XG4gICAgfVxuXG4gICAgdGhpcy51c2VTdHlsZSgpO1xufTtcblxuXG4vKipcbiAqIFNldHMgdGhlIGljb24gdG8gdGhlIHRoZSBzdHlsZXMuXG4gKi9cbkNsdXN0ZXJJY29uLnByb3RvdHlwZS51c2VTdHlsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbmRleCA9IE1hdGgubWF4KDAsIHRoaXMuc3Vtc18uaW5kZXggLSAxKTtcbiAgICBpbmRleCA9IE1hdGgubWluKHRoaXMuc3R5bGVzXy5sZW5ndGggLSAxLCBpbmRleCk7XG4gICAgdmFyIHN0eWxlID0gdGhpcy5zdHlsZXNfW2luZGV4XTtcbiAgICB0aGlzLnVybF8gPSBzdHlsZVsndXJsJ107XG4gICAgdGhpcy5oZWlnaHRfID0gc3R5bGVbJ2hlaWdodCddO1xuICAgIHRoaXMud2lkdGhfID0gc3R5bGVbJ3dpZHRoJ107XG4gICAgdGhpcy50ZXh0Q29sb3JfID0gc3R5bGVbJ3RleHRDb2xvciddO1xuICAgIHRoaXMuYW5jaG9yXyA9IHN0eWxlWydhbmNob3InXTtcbiAgICB0aGlzLnRleHRTaXplXyA9IHN0eWxlWyd0ZXh0U2l6ZSddO1xuICAgIHRoaXMuYmFja2dyb3VuZFBvc2l0aW9uXyA9IHN0eWxlWydiYWNrZ3JvdW5kUG9zaXRpb24nXTtcbn07XG5cblxuLyoqXG4gKiBTZXRzIHRoZSBjZW50ZXIgb2YgdGhlIGljb24uXG4gKlxuICogQHBhcmFtIHtnb29nbGUubWFwcy5MYXRMbmd9IGNlbnRlciBUaGUgbGF0bG5nIHRvIHNldCBhcyB0aGUgY2VudGVyLlxuICovXG5DbHVzdGVySWNvbi5wcm90b3R5cGUuc2V0Q2VudGVyID0gZnVuY3Rpb24oY2VudGVyKSB7XG4gICAgdGhpcy5jZW50ZXJfID0gY2VudGVyO1xufTtcblxuXG4vKipcbiAqIENyZWF0ZSB0aGUgY3NzIHRleHQgYmFzZWQgb24gdGhlIHBvc2l0aW9uIG9mIHRoZSBpY29uLlxuICpcbiAqIEBwYXJhbSB7Z29vZ2xlLm1hcHMuUG9pbnR9IHBvcyBUaGUgcG9zaXRpb24uXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBjc3Mgc3R5bGUgdGV4dC5cbiAqL1xuQ2x1c3Rlckljb24ucHJvdG90eXBlLmNyZWF0ZUNzcyA9IGZ1bmN0aW9uKHBvcykge1xuICAgIHZhciBzdHlsZSA9IFtdO1xuICAgIHN0eWxlLnB1c2goJ2JhY2tncm91bmQtaW1hZ2U6dXJsKCcgKyB0aGlzLnVybF8gKyAnKTsnKTtcbiAgICB2YXIgYmFja2dyb3VuZFBvc2l0aW9uID0gdGhpcy5iYWNrZ3JvdW5kUG9zaXRpb25fID8gdGhpcy5iYWNrZ3JvdW5kUG9zaXRpb25fIDogJzAgMCc7XG4gICAgc3R5bGUucHVzaCgnYmFja2dyb3VuZC1wb3NpdGlvbjonICsgYmFja2dyb3VuZFBvc2l0aW9uICsgJzsnKTtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5hbmNob3JfID09PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuYW5jaG9yX1swXSA9PT0gJ251bWJlcicgJiYgdGhpcy5hbmNob3JfWzBdID4gMCAmJlxuICAgICAgICAgICAgdGhpcy5hbmNob3JfWzBdIDwgdGhpcy5oZWlnaHRfKSB7XG4gICAgICAgICAgICBzdHlsZS5wdXNoKCdoZWlnaHQ6JyArICh0aGlzLmhlaWdodF8gLSB0aGlzLmFuY2hvcl9bMF0pICtcbiAgICAgICAgICAgICAgICAncHg7IHBhZGRpbmctdG9wOicgKyB0aGlzLmFuY2hvcl9bMF0gKyAncHg7Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHlsZS5wdXNoKCdoZWlnaHQ6JyArIHRoaXMuaGVpZ2h0XyArICdweDsgbGluZS1oZWlnaHQ6JyArIHRoaXMuaGVpZ2h0XyArXG4gICAgICAgICAgICAgICAgJ3B4OycpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5hbmNob3JfWzFdID09PSAnbnVtYmVyJyAmJiB0aGlzLmFuY2hvcl9bMV0gPiAwICYmXG4gICAgICAgICAgICB0aGlzLmFuY2hvcl9bMV0gPCB0aGlzLndpZHRoXykge1xuICAgICAgICAgICAgc3R5bGUucHVzaCgnd2lkdGg6JyArICh0aGlzLndpZHRoXyAtIHRoaXMuYW5jaG9yX1sxXSkgK1xuICAgICAgICAgICAgICAgICdweDsgcGFkZGluZy1sZWZ0OicgKyB0aGlzLmFuY2hvcl9bMV0gKyAncHg7Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHlsZS5wdXNoKCd3aWR0aDonICsgdGhpcy53aWR0aF8gKyAncHg7IHRleHQtYWxpZ246Y2VudGVyOycpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc3R5bGUucHVzaCgnaGVpZ2h0OicgKyB0aGlzLmhlaWdodF8gKyAncHg7IGxpbmUtaGVpZ2h0OicgK1xuICAgICAgICAgICAgdGhpcy5oZWlnaHRfICsgJ3B4OyB3aWR0aDonICsgdGhpcy53aWR0aF8gKyAncHg7IHRleHQtYWxpZ246Y2VudGVyOycpO1xuICAgIH1cblxuICAgIHZhciB0eHRDb2xvciA9IHRoaXMudGV4dENvbG9yXyA/IHRoaXMudGV4dENvbG9yXyA6ICdibGFjayc7XG4gICAgdmFyIHR4dFNpemUgPSB0aGlzLnRleHRTaXplXyA/IHRoaXMudGV4dFNpemVfIDogMTE7XG5cbiAgICBzdHlsZS5wdXNoKCdjdXJzb3I6cG9pbnRlcjsgdG9wOicgKyBwb3MueSArICdweDsgbGVmdDonICtcbiAgICAgICAgcG9zLnggKyAncHg7IGNvbG9yOicgKyB0eHRDb2xvciArICc7IHBvc2l0aW9uOmFic29sdXRlOyBmb250LXNpemU6JyArXG4gICAgICAgIHR4dFNpemUgKyAncHg7IGZvbnQtZmFtaWx5OkFyaWFsLHNhbnMtc2VyaWY7IGZvbnQtd2VpZ2h0OmJvbGQnKTtcbiAgICByZXR1cm4gc3R5bGUuam9pbignJyk7XG59O1xuXG5cbi8vIEV4cG9ydCBTeW1ib2xzIGZvciBDbG9zdXJlXG4vLyBJZiB5b3UgYXJlIG5vdCBnb2luZyB0byBjb21waWxlIHdpdGggY2xvc3VyZSB0aGVuIHlvdSBjYW4gcmVtb3ZlIHRoZVxuLy8gY29kZSBiZWxvdy5cbndpbmRvd1snTWFya2VyQ2x1c3RlcmVyJ10gPSBNYXJrZXJDbHVzdGVyZXI7XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydhZGRNYXJrZXInXSA9IE1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuYWRkTWFya2VyO1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsnYWRkTWFya2VycyddID0gTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5hZGRNYXJrZXJzO1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsnY2xlYXJNYXJrZXJzJ10gPVxuICAgIE1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuY2xlYXJNYXJrZXJzO1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsnZml0TWFwVG9NYXJrZXJzJ10gPVxuICAgIE1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZml0TWFwVG9NYXJrZXJzO1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsnZ2V0Q2FsY3VsYXRvciddID1cbiAgICBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmdldENhbGN1bGF0b3I7XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydnZXRHcmlkU2l6ZSddID1cbiAgICBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmdldEdyaWRTaXplO1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsnZ2V0RXh0ZW5kZWRCb3VuZHMnXSA9XG4gICAgTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5nZXRFeHRlbmRlZEJvdW5kcztcbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGVbJ2dldE1hcCddID0gTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5nZXRNYXA7XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydnZXRNYXJrZXJzJ10gPSBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmdldE1hcmtlcnM7XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydnZXRNYXhab29tJ10gPSBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmdldE1heFpvb207XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydnZXRTdHlsZXMnXSA9IE1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZ2V0U3R5bGVzO1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsnZ2V0VG90YWxDbHVzdGVycyddID1cbiAgICBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmdldFRvdGFsQ2x1c3RlcnM7XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydnZXRUb3RhbE1hcmtlcnMnXSA9XG4gICAgTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5nZXRUb3RhbE1hcmtlcnM7XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydyZWRyYXcnXSA9IE1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUucmVkcmF3O1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsncmVtb3ZlTWFya2VyJ10gPVxuICAgIE1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUucmVtb3ZlTWFya2VyO1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsncmVtb3ZlTWFya2VycyddID1cbiAgICBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLnJlbW92ZU1hcmtlcnM7XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydyZXNldFZpZXdwb3J0J10gPVxuICAgIE1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUucmVzZXRWaWV3cG9ydDtcbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGVbJ3JlcGFpbnQnXSA9XG4gICAgTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5yZXBhaW50O1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsnc2V0Q2FsY3VsYXRvciddID1cbiAgICBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLnNldENhbGN1bGF0b3I7XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydzZXRHcmlkU2l6ZSddID1cbiAgICBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLnNldEdyaWRTaXplO1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsnc2V0TWF4Wm9vbSddID1cbiAgICBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLnNldE1heFpvb207XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydvbkFkZCddID0gTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5vbkFkZDtcbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGVbJ2RyYXcnXSA9IE1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZHJhdztcblxuQ2x1c3Rlci5wcm90b3R5cGVbJ2dldENlbnRlciddID0gQ2x1c3Rlci5wcm90b3R5cGUuZ2V0Q2VudGVyO1xuQ2x1c3Rlci5wcm90b3R5cGVbJ2dldFNpemUnXSA9IENsdXN0ZXIucHJvdG90eXBlLmdldFNpemU7XG5DbHVzdGVyLnByb3RvdHlwZVsnZ2V0TWFya2VycyddID0gQ2x1c3Rlci5wcm90b3R5cGUuZ2V0TWFya2VycztcblxuQ2x1c3Rlckljb24ucHJvdG90eXBlWydvbkFkZCddID0gQ2x1c3Rlckljb24ucHJvdG90eXBlLm9uQWRkO1xuQ2x1c3Rlckljb24ucHJvdG90eXBlWydkcmF3J10gPSBDbHVzdGVySWNvbi5wcm90b3R5cGUuZHJhdztcbkNsdXN0ZXJJY29uLnByb3RvdHlwZVsnb25SZW1vdmUnXSA9IENsdXN0ZXJJY29uLnByb3RvdHlwZS5vblJlbW92ZTtcblxuT2JqZWN0LmtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbihvKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yKHZhciBuYW1lIGluIG8pIHtcbiAgICAgICAgICAgIGlmIChvLmhhc093blByb3BlcnR5KG5hbWUpKVxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTsiLCJqUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgkKSB7XG5cbiAgICAvL3doZW4gdGhlIGxvY2F0aW9uLWFkZCBidXR0b24gaXMgY2xpY2tlZFxuICAgICQoJyNsb2NhdGlvbl9zZXR0aW5nX2FkZCcpLmNsaWNrKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvL2dldCB0aGUgY3VycmVudCBzZWxlY3RlZCBsb2NhdGlvblxuICAgICAgICB2YXIgbG9jYXRpb25faWQgPSAkKCcjbG9jYXRpb25fc2V0dGluZ19zZWxlY3QnKS52YWwoKTtcblxuICAgICAgICAvLyBpZiBpdCB3YXMgdGhlIHBsYWNlaG9sZGVyLCBxdWl0Li4uXG4gICAgICAgIGlmIChsb2NhdGlvbl9pZCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXQgdGhlIGN1cnJlbnQgbG9jYXRpb24gdGl0bGVcbiAgICAgICAgdmFyIGxvY2F0aW9uX3RpdGxlID0gJCgnI2xvY2F0aW9uX3NldHRpbmdfc2VsZWN0IG9wdGlvbjpzZWxlY3RlZCcpLnRleHQoKTtcbiAgICAgICAgdmFyIGRlZmF1bHRzID0gJCgnI2xvY2F0aW9uX3NldHRpbmdfc2VsZWN0IG9wdGlvbjpzZWxlY3RlZCcpLmRhdGEoJ2RlZmF1bHRzJyk7XG5cbiAgICAgICAgLy9yZW1vdmUgaXRlbSBmcm9tIHRoZSBvcHRpb25zICggd2UgZG9uJ3QgbmVlZCBpdCB0aGVyZSBhbnltb3JlIClcbiAgICAgICAgJCgnI2xvY2F0aW9uX3NldHRpbmdfc2VsZWN0IG9wdGlvbjpzZWxlY3RlZCcpLnJlbW92ZSgpO1xuXG4gICAgICAgIHZhciBjaGVja2VkID0gJyc7XG4gICAgICAgIGlmICh5b2FzdF93Y3Nlb19sb2NhbF90cmFuc2xhdGlvbnMuaGFzX2NhdGVnb3JpZXMgPT0gMCkge1xuICAgICAgICAgICAgY2hlY2tlZCArPSAnIGNoZWNrZWQ9XCJjaGVja2VkXCInO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9hcHBlbmQgYSBuZXcgcm93IHRvdCBodGUgdGFibGUgd2l0aCB0aGVzZSBsb2NhdGlvbiBzcGVjc1xuICAgICAgICAkKCd0Ym9keSNzaGlwcGluZ19sb2NhdGlvbnMnKS5hcHBlbmQoXG4gICAgICAgICAgICAnPHRyIGNsYXNzPVwibG9jYXRpb25cIiBkYXRhLWlkPVwiJyArIGxvY2F0aW9uX2lkICsgJ1wiIGRhdGEtdGl0bGU9XCInICsgZW5jb2RlVVJJKGxvY2F0aW9uX3RpdGxlKSArICdcIiBkYXRhLWRlZmF1bHRzPVxcJycgKyBKU09OLnN0cmluZ2lmeShkZWZhdWx0cykgKyAnXFwnICA+JyArXG4gICAgICAgICAgICAnPHRoIHNjb3BlPVwicm93XCIgY2xhc3M9XCJjaGVjay1jb2x1bW5cIj48L3RoPicgK1xuICAgICAgICAgICAgJzx0ZD4nICsgbG9jYXRpb25fdGl0bGUgKyAnPC90ZD4nICtcbiAgICAgICAgICAgICc8dGQ+PGxhYmVsIGZvcj1cInlvYXN0X3djc2VvX2xvY2FsX3BpY2t1cF9sb2NhdGlvbl9hbGxvd2VkWycgKyBsb2NhdGlvbl9pZCArICddXCIgY2xhc3M9XCJzY3JlZW4tcmVhZGVyLXRleHRcIj4nICsgeW9hc3Rfd2NzZW9fbG9jYWxfdHJhbnNsYXRpb25zLmxhYmVsX2FsbG93X2xvY2F0aW9uLnJlcGxhY2UoJyVzJywgbG9jYXRpb25fdGl0bGUpICsgJzwvbGFiZWw+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiJyArIGNoZWNrZWQgKyAnIG5hbWU9XCJ5b2FzdF93Y3Nlb19sb2NhbF9waWNrdXBfbG9jYXRpb25fYWxsb3dlZFsnICsgbG9jYXRpb25faWQgKyAnXVwiIC8+IDxzbWFsbD4nICsgZGVmYXVsdHMuc3RhdHVzICsgJzwvc21hbGw+PC90ZD4nICtcbiAgICAgICAgICAgICc8dGQ+PGxhYmVsIGZvcj1cInlvYXN0X3djc2VvX2xvY2FsX3BpY2t1cF9sb2NhdGlvbl9jb3N0WycgKyBsb2NhdGlvbl9pZCArICddXCIgY2xhc3M9XCJzY3JlZW4tcmVhZGVyLXRleHRcIj4nICsgeW9hc3Rfd2NzZW9fbG9jYWxfdHJhbnNsYXRpb25zLmxhYmVsX2Nvc3RzX2xvY2F0aW9uLnJlcGxhY2UoJyVzJywgbG9jYXRpb25fdGl0bGUpICsgJzwvbGFiZWw+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInlvYXN0X3djc2VvX2xvY2FsX3BpY2t1cF9sb2NhdGlvbl9jb3N0WycgKyBsb2NhdGlvbl9pZCArICddXCIgcGxhY2Vob2xkZXI9XCInICsgeW9hc3Rfd2NzZW9fbG9jYWxfdHJhbnNsYXRpb25zLnBsYWNlaG9sZGVyX2Nvc3RzX2xvY2F0aW9uICsgJ1wiIGNsYXNzPVwiaW5wdXQtdGV4dCByZWd1bGFyLWlucHV0XCIgPiA8c21hbGw+JyArIGRlZmF1bHRzLnByaWNlICsgJzwvc21hbGw+PC90ZD4nICtcbiAgICAgICAgICAgICc8dGQ+PGlucHV0IGNsYXNzPVwibG9jYXRpb25fcnVsZV9yZW1vdmVcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidXR0b25cIiB2YWx1ZT1cIicgKyB5b2FzdF93Y3Nlb19sb2NhbF90cmFuc2xhdGlvbnMubGFiZWxfcmVtb3ZlICsgJ1wiPjwvdGQ+JyArXG4gICAgICAgICAgICAnPC90cj4nXG4gICAgICAgICk7XG5cbiAgICAgICAgLy91bi1iaW5kIGFuZCByZS1iaW5kIGNsaWNrIGV2ZW50cywgYmVjYXVzZSBvdXIgRE9NIGhhcyBjaGFuZ2VkXG4gICAgICAgICQoJy5sb2NhdGlvbl9ydWxlX3JlbW92ZScpLnVuYmluZCgnY2xpY2snKTtcbiAgICAgICAgJCgnLmxvY2F0aW9uX3J1bGVfcmVtb3ZlJykub24oJ2NsaWNrJywgeW9hc3RfcmVtb3ZlX2xvY2F0aW9uKTtcblxuICAgIH0pO1xuXG4gICAgLy8gYmluZCBjbGljayBldmVudCBmb3IgdGhlIHJlbW92ZSBidXR0b25cbiAgICAkKCcubG9jYXRpb25fcnVsZV9yZW1vdmUnKS5vbignY2xpY2snLCB5b2FzdF9yZW1vdmVfbG9jYXRpb24pO1xuXG4gICAgLy8gU2hvdyBhbGVydCB3aGVuIHlvdSdyZSBhY3RpdmF0aW5nIHRoZSBMb2NhbCBTdG9yZSBQaWNrdXAuXG4gICAgJCgnI3dvb2NvbW1lcmNlX3lvYXN0X3djc2VvX2xvY2FsX3BpY2t1cF9lbmFibGVkJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICBpZiAoJHRoaXMuaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgICAgIHZhciBhbnN3ZXIgPSBjb25maXJtKHlvYXN0X3djc2VvX2xvY2FsX3RyYW5zbGF0aW9ucy53YXJuaW5nX2VuYWJsZV9waWNrdXApO1xuICAgICAgICAgICAgaWYgKGZhbHNlID09IGFuc3dlcikge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KTtcblxuXG5mdW5jdGlvbiB5b2FzdF9yZW1vdmVfbG9jYXRpb24oKSB7XG5cbiAgICAvLyBmaW5kIHRoZSByb3ctZWxlbWVudCBmb3IgdGhpcyBpdGVtXG4gICAgdmFyICRyb3cgPSBqUXVlcnkodGhpcykuY2xvc2VzdCgndHInKTtcblxuICAgIC8vZ2V0IHRoZSBzcGVjcyBmb3JtIHRoaXMgcm93XG4gICAgdmFyIGlkID0gJHJvdy5kYXRhKCdpZCcpO1xuICAgIHZhciB0aXRsZSA9ICRyb3cuZGF0YSgndGl0bGUnKTtcbiAgICB2YXIgZGVmYXVsdHMgPSAkcm93LmRhdGEoJ2RlZmF1bHRzJyk7XG5cbiAgICAvL3JlbW92ZSB0aGUgcm93XG4gICAgJHJvdy5yZW1vdmUoKTtcblxuICAgIC8vYnV0IHRoZSBzcGVjcyBiYWNrIGludG8gb3VyIG9wdGlvbnMvc2VsZWN0XG4gICAgalF1ZXJ5KCcjbG9jYXRpb25fc2V0dGluZ19zZWxlY3QnKS5hcHBlbmQoJzxvcHRpb24gdmFsdWU9XCInICsgaWQgKyAnXCIgZGF0YS1kZWZhdWx0cz1cXCcnICsgSlNPTi5zdHJpbmdpZnkoZGVmYXVsdHMpICsgJ1xcJz4nICsgZGVjb2RlVVJJKHRpdGxlKSArICc8L29wdGlvbj4nKTtcbn1cbiJdfQ==
