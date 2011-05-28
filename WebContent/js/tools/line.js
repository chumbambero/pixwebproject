/*
 * Copyright (C) 2010, 2011 Alessandro Trombini
 *
 * This file is part of PixWeb.
 */

/**
 * @author Alessandro Trombini
 */

// The line tool.
tools.line = function() {
	var tool = this;
	this.started = false;
	var mousedownx, mousedowny, mouseupx, mouseupy;
	// This is called when you start holding down the mouse
	// button.
	this.mousedown = function(ev) {
		tool.started = true;
		context.lineWidth = line_width;
		tool.mousedownx = ev._x;
		tool.mousedowny = ev._y;
	};
	// This function is called every time you move the mouse.
	this.mousemove = function(ev) {
		if (!tool.started) {
			return;
		}
		clear(context);
		context.beginPath();
		context.moveTo(tool.mousedownx, tool.mousedowny);
		context.lineTo(ev._x, ev._y);
		context.stroke();
		context.closePath();
	};
	// This is called when you release the mouse button.
	this.mouseup = function(ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
			tool.mouseupx = ev._x;
			tool.mouseupy = ev._y;
			addElement(tool.mousedownx, tool.mousedowny, tool.mouseupx,
					tool.mouseupy, line_width, color_stroke,
					"rgba(0, 0, 0, 0)", true, false, new Line(tool.mousedownx,
							tool.mousedowny, tool.mouseupx, tool.mouseupy));
			img_update();
		}
	};
};