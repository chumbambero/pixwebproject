/*
 * Copyright (C) 2010, 2011 Alessandro Trombini
 *
 * This file is part of PixWeb.
 */

/**
 * @author Alessandro Trombini
 */

// The circle tool.
tools.circle = function() {
	var tool = this;
	this.started = false;
	var mousedownx, mousedowny, x, y, r, stroke, fill;
	// This is called when you start holding down the mouse
	// button.
	this.mousedown = function(ev) {
		tool.started = true;
		tool.stroke;
		tool.fill;
		context.lineWidth = line_width;
		if (hasStroke) {
			tool.stroke = color_stroke;
		} else {
			tool.stroke = 'rgba(0, 0, 0, 0)';
		}
		if (hasFill) {
			tool.fill = color_fill;
		} else {
			tool.fill = 'rgba(0, 0, 0, 0)';
		}
		context.strokeStyle = tool.stroke;
		context.fillStyle = tool.fill;
		tool.mousedownx = ev._x;
		tool.mousedowny = ev._y;
	};
	// This function is called every time you move the mouse.
	this.mousemove = function(ev) {
		if (!tool.started) {
			return;
		}
		var w = Math.abs(ev._x - tool.mousedownx), h = Math.abs(ev._y
				- tool.mousedowny);
		tool.x = Math.min(ev._x, tool.mousedownx), tool.y = Math.min(ev._y,
				tool.mousedowny), tool.r = Math.min(w, h) / 2;

		clear(context);
		if (!w || !h) {
			return;
		}
		context.beginPath();
		context.arc(tool.x + tool.r, tool.y + tool.r, tool.r, 0, Math.PI * 2,
				true);
		context.closePath();
		context.stroke();
		context.fill();
	};
	// This is called when you release the mouse button.
	this.mouseup = function(ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
			addElement(tool.x, tool.y, tool.x + tool.r * 2,
					tool.y + tool.r * 2, line_width, tool.stroke, tool.fill,
					true, new Circle());
			img_update();
		}
	};
};