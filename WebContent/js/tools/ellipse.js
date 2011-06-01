/*
 * Copyright (C) 2010, 2011 Alessandro Trombini
 *
 * This file is part of PixWeb.
 */

/**
 * @author Alessandro Trombini
 */

// The ellipse tool.
tools.ellipse = function() {
	var tool = this;
	this.started = false;
	var mousedownx, mousedowny, x, y, w, h, cx, cy, rx, ry, stroke, fill;
	var k = 4 * ((Math.sqrt(2) -1) / 3);
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
		getMouse(ev);
		tool.mousedownx = mx;
		tool.mousedowny = my;
	};
	// This function is called every time you move the mouse.
	this.mousemove = function(ev) {
		if (!tool.started) {
			return;
		}
		getMouse(ev);
		tool.w = Math.abs(mx - tool.mousedownx);
		tool.h = Math.abs(my - tool.mousedowny);
		tool.x = Math.min(mx, tool.mousedownx);
		tool.y = Math.min(my, tool.mousedowny);
		clear(context);
		if (!tool.w || !tool.h) {
			return;
		}
		drawEllipse(tool.mousedownx, tool.mousedowny, mx, my, context);
	};
	// This is called when you release the mouse button.
	this.mouseup = function(ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
			addElement(tool.x, tool.y, tool.x+tool.w, tool.y+tool.h, line_width, tool.stroke, tool.fill, true, false, false, new Ellipse());
			img_update();
		}
	};
};

function drawEllipse(x1, y1, x2, y2, ctx) {
	 
	var dx = Math.abs(x2-x1);
	var dy = Math.abs(y2-y1);

	var KAPPA = 4 * ((Math.sqrt(2) -1) / 3);
	var rx = (x2-x1)/2;
	var ry = (y2-y1)/2;	
	var cx = x1+rx;
	var cy = y1+ry;

	ctx.beginPath();
	ctx.moveTo(cx, cy - ry);
	ctx.bezierCurveTo(cx + (KAPPA * rx), cy - ry,  cx + rx, cy - (KAPPA * ry), cx + rx, cy);  
	ctx.bezierCurveTo(cx + rx, cy + (KAPPA * ry), cx + (KAPPA * rx), cy + ry, cx, cy + ry); 
	ctx.bezierCurveTo(cx - (KAPPA * rx), cy + ry, cx - rx, cy + (KAPPA * ry), cx - rx, cy); 
	ctx.bezierCurveTo(cx - rx, cy - (KAPPA * ry), cx - (KAPPA * rx), cy - ry, cx, cy - ry); 
	ctx.closePath();

	ctx.fill();
	ctx.stroke();
}