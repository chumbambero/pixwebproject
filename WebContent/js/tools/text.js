/*
 * Copyright (C) 2010, 2011 Alessandro Trombini
 *
 * This file is part of PixWeb.
 */

/**
 * @author Alessandro Trombini
 */

// The drawing text.
tools.text = function() {
	var tool = this;
	this.started = false;
	var x, y, w, h, stroke, fill, style, size, font, text, bold, italic;
	// This is called when you start holding down the mouse
	// button.
	this.mousedown = function(ev) {
		getMouse(ev);
		tool.started = true;
		tool.x = mx;
		tool.y = my;
	};
	// This function is called every time you move the mouse.
	this.mousemove = function(ev) {
		getMouse(ev);
		clear(context);
		if (!tool.started) {
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
			tool.size = line_width;
			tool.font = font_type;
			tool.bold = bold;
			tool.italic = italic;
			tool.style = "";
			if(tool.bold){
				tool.style += "bold ";
			}
			if(tool.italic){
				tool.style += "italic ";
			}
			tool.style += tool.size + "px "+ tool.font;
			context.font = tool.style;
			tool.text = text_content;
			context.fillText(tool.text, mx, my);
			context.strokeText(tool.text, mx, my);
			console.log(bold);
			console.log(italic);
		}
	};
	// This is called when you release the mouse button.
	this.mouseup = function(ev) {
		if (tool.started) {
			tool.started = false;
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
			tool.size = line_width;
			tool.font = font_type;
			tool.bold = bold;
			tool.italic = italic;
			tool.style = "";
			if(tool.bold){
				tool.style += "bold ";
			}
			if(tool.italic){
				tool.style += "italic ";
			}
			tool.style += tool.size + "px "+ tool.font;
			context.font = tool.style;
			tool.text = text_content;
			context.fillText(tool.text, tool.x, tool.y);
			var row = [];
			var col = [];
			for ( var j = 0; j < canvas.width; j++) {
				for ( var k = 0; k < canvas.height; k++) {
					try {
						try {
							var imgd = context.getImageData(j, k, 1, 1);
						} catch (e) {
							netscape.security.PrivilegeManager
									.enablePrivilege("UniversalBrowserRead");
							var imgd = context.getImageData(j, k, 1, 1);
						}
					} catch (e) {
						throw new Error("unable to access image data: " + e)
					}
					// if(context.getImageData(j, k, 1, 1).data[3]!=0){
					if (imgd.data[3] != 0) {
						row.push(j);
						col.push(k);
					}
				}
			}
			tool.x = Math.min.apply(null, row);
			tool.y = Math.min.apply(null, col);
			tool.w = Math.max.apply(null, row) - tool.x;
			tool.h = Math.max.apply(null, col) - tool.y;
			addElement(tool.x, tool.y, tool.x + tool.w, tool.y + tool.h,
					line_width, tool.stroke, tool.fill, false, false, true, 
					new Text(tool.size, tool.font, tool.text, tool.bold, tool.italic));
			img_update();
		}
	};
};