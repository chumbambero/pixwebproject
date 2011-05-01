// The rectangle tool.
tools.rect = function() {
	var tool = this;
	this.started = false;
	var mousedownx, mousedowny, mouseupx, mouseupy, x, y, w, h, stroke, fill;
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
		tool.x = Math.min(ev._x, tool.mousedownx), tool.y = Math.min(ev._y,
				tool.mousedowny), tool.w = Math.abs(ev._x - tool.mousedownx),
				tool.h = Math.abs(ev._y - tool.mousedowny);

		clear(context);
		if (!tool.w || !tool.h) {
			return;
		}
		context.fillRect(tool.x, tool.y, tool.w, tool.h);
		context.strokeRect(tool.x, tool.y, tool.w, tool.h);
	};
	// This is called when you release the mouse button.
	this.mouseup = function(ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
			context.strokeStyle = color_stroke;
			context.fillStyle = color_fill;
			tool.mouseupx = ev._x;
			tool.mouseupy = ev._y;
			addElement(tool.x, tool.y, tool.x + tool.w, tool.y + tool.h,
					line_width, tool.stroke, tool.fill, true, new Rectangle());
			img_update();
		}
	};
};