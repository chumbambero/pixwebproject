/*
 * Copyright (C) 2010, 2011 Alessandro Trombini
 *
 * This file is part of PixWeb.
 */

/**
 * @author Alessandro Trombini
 */

var line_width = 1;
var hasStroke = true;
var hasFill = false;
var brush_type = 'circleBrush';
var eraserActive = false;
var afterRotation = false;
var resizing = false;
var bc, cp1, cp2, cp3, cp4, cp5, pMenuBar, pSubMenu, pSubMenuItem1, pSubMenuItem2, pSubMenuItem3, pSubMenu2, myPalette, strokeColorSelected, fillColorSelected, f1, f2, f3, f4, f5;
var canvas, context, canvaso, contexto, ghostcanvas, ghostcontext, ghostcanvaso, ghostcontexto;
var deleteImgx, deleteImgy, rotateImgx, rotateImgy;
var ghostImage = new Image();
var deleteImg = new Image();
deleteImg.src = "CSS/images/icons/delete.png";
var rotateImg = new Image();
rotateImg.src = "CSS/images/icons/rotate.png";

// The active tool instance.
var name_default = 'undefined';
var tool;
var tool_default = 'pencil';
var color_stroke = '#000';
var color_fill = '#fff';
var colorStroke, colorFill;

// how often, in milliseconds, we check to see if a redraw
// is needed
var INTERVAL = 20;

// mouse coordinates
var mx, my;

// when set to true, the canvas will redraw everything
// invalidate() just sets this to false right now
// we want to call invalidate() whenever we make a
// change
var canvasValid = true;

// The node (if any) being selected.
// If in the future we want to select multiple objects, this
// will get turned into an array
var mySel;
var mySelIndex = -1;

// The selection color and width. Right now we have a black
// selection with a small width
var mySelColor = '#999';
var mySelWidth = 1;
var mySelBoxColor = 'darkred'; // New for selection boxes
var mySelBoxSize = 6;
var mySelPadding = 3;

// since we can drag from anywhere in a node
// instead of just its x/y corner, we need to save
// the offset of the mouse when we start dragging.
var offsetx, offsety;

// Padding and border style widths for mouse offsets
var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

// holds all our elements
var elements = [];
Array.prototype.remove = function(from, to){
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

// New, holds the 8 tiny boxes that will be our selection handles
// the selection handles will be in this order:
// 0 1 2
// 3 4
// 5 6 7
var selectionHandles = [];

//This object holds the implementation of each drawing tool.
var tools = {};

var pointerButton, pencilButton, lineButton, rectangleButton, circleButton, ellipseButton;
var selected_tool = tool_default;