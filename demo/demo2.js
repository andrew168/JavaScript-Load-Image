/*
 * JavaScript Load Image Demo JS
 * https://github.com/blueimp/JavaScript-Load-Image
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*global window, document, loadImage, HTMLCanvasElement, $ */

$(function () {
    'use strict';

    var result = $('#result'),
        currentFile,
        replaceResults = function (img) {
            if ((img.src || img instanceof HTMLCanvasElement)) {
                result.children().replaceWith(img);
            }
        },

        showFirst = function (img) {
            if ((img.src || img instanceof HTMLCanvasElement)) {
                result.children().replaceWith(img);
            }
            crop();
        },

        displayImage = function (file, options) {
            currentFile = file;
            loadImage(
                    file,
                    showFirst,
                    options
                );
        },
        dropChangeHandler = function (e) {
            e.preventDefault();
            e = e.originalEvent;
            var target = e.dataTransfer || e.target,
                file = target && target.files && target.files[0],
                options = {
                    maxWidth: result.width(),
                    orientation: 2
                    // canvas: true
                };
            if (!file) {
                return;
            }
            loadImage.parseMetaData(file, function (data) {
                if (data.exif) {
                    options.orientation = data.exif.get('Orientation');
                }
                displayImage(file, options);
                // crop();
            });
        };

    // Hide URL/FileReader API requirement message in capable browsers:
    if (window.createObjectURL || window.URL || window.webkitURL || window.FileReader) {
        result.children().hide();
    }
    $('#file-input').on('change', dropChangeHandler);
    function crop() {
        var img = result.find('img, canvas')[0];
        var coordinates = {
            x: 500,
            y: 500,
            w: 512,
            h: 512
        };

        if (img && coordinates) {
            replaceResults(loadImage.scale(img, {
                left: coordinates.x,
                top: coordinates.y,
                sourceWidth: coordinates.w,
                sourceHeight: coordinates.h,
                minWidth: result.width()
            }));
        }
    }
});
