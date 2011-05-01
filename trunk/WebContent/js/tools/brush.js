// The drawing brush.
tools.brush = function() {
	var tool = this;
	this.smallerx, this.smallery, this.biggerx, this.biggery, this.oldmx,
			this.oldmy;
	if (!eraserActive) {
		this.started = false;
	} else {
		console.log("eraser in brush started");
		this.started = true;
		context.globalCompositeOperation = 'copy';
		context.lineWidth = line_width;
		context.strokeStyle = 'rgba(0, 0, 0, 0)';
		context.fillStyle = "rgba(0,0,0,0)";
		tool.smallerx = mx - Math.ceil(line_width / 2);
		tool.biggerx = mx + Math.ceil(line_width / 2);

		tool.smallery = my - Math.ceil(line_width / 2);
		tool.biggery = my + Math.ceil(line_width / 2);
		tool.oldmx = mx;
		tool.oldmy = my;
		mx = tool.smallerx;
		my = tool.smallery;
		if (brush_type == 'circleBrush') {
			drawCircleBrush(tool.oldmx, tool.oldmy, Math.ceil(line_width / 2));
		} else if (brush_type == 'squareBrush') {
			drawSquareBrush()
		}
	}
	// This is called when you start holding down the mouse
	// button.
	// This starts the brush drawing.
	this.mousedown = function(ev) {
		if (!eraserActive) {
			tool.started = true;
			context.lineWidth = line_width;
			context.strokeStyle = color_stroke;
			context.fillStyle = color_stroke;
			getMouse(ev);
			tool.smallerx = mx - Math.ceil(line_width / 2);
			tool.biggerx = mx + Math.ceil(line_width / 2);

			tool.smallery = my - Math.ceil(line_width / 2);
			tool.biggery = my + Math.ceil(line_width / 2);
			tool.oldmx = mx;
			tool.oldmy = my;
			mx = tool.smallerx;
			my = tool.smallery;
			if (brush_type == 'circleBrush') {
				drawCircleBrush(tool.oldmx, tool.oldmy, Math
						.ceil(line_width / 2));
			} else if (brush_type == 'squareBrush') {
				drawSquareBrush()
			}
		}
	};
	// This function is called every time you move the mouse.
	// Obviously, it only
	// draws if the tool.started state is set to true (when you
	// are holding down
	// the mouse button).
	this.mousemove = function(ev) {
		if (tool.started) {
			if (eraserActive) {
				console.log("mousemove of eraser is started");
			}
			getMouse(ev);
			tool.oldmx = mx;
			tool.oldmy = my;
			mx = mx - Math.ceil(line_width / 2);
			my = my - Math.ceil(line_width / 2);
			if (brush_type == 'circleBrush') {
				drawCircleBrush(tool.oldmx, tool.oldmy, Math
						.ceil(line_width / 2));
			} else if (brush_type == 'squareBrush') {
				drawSquareBrush()
			}
			if (mx < tool.smallerx) {
				tool.smallerx = mx;
			}
			if (mx + line_width > tool.biggerx) {
				tool.biggerx = mx + line_width;
			}
			if (my < tool.smallery) {
				tool.smallery = my;
			}
			if (my + line_width > tool.biggery) {
				tool.biggery = my + line_width;
			}
		}
	};
	// This is called when you release the mouse button.
	this.mouseup = function(ev) {
		if (tool.started) {
			getMouse(ev);
			tool.started = false;
			if (!eraserActive) {
				if (mx < tool.smallerx) {
					tool.smallerx = mx;
				}
				if (mx + line_width > tool.biggerx) {
					tool.biggerx = mx + line_width;
				}
				if (my < tool.smallery) {
					tool.smallery = my;
				}
				if (my + line_width > tool.biggery) {
					tool.biggery = my + line_width;
				}
				addElement(tool.smallerx, tool.smallery, tool.biggerx,
						tool.biggery, line_width, color_stroke, false, null,
						null);
				img_update();
			} else {
				console.log("set new data from eraser");
				mySel.data = context.getImageData(mySel.x, mySel.y, mySel.w,
						mySel.h);
				context.globalCompositeOperation = 'source-over';
				console.log("return to pointer");
				ev_tool_change("pointer");
			}
		}
	};
};

// Auxiliary functions for the circle brush tool
function drawCircleBrush(cx, cy, r) {
	context.beginPath();
	context.arc(cx, cy, r, 0, Math.PI * 2, true);
	context.closePath();
	// context.stroke();
	context.fill();
}

// Auxiliary functions for the square brush tool
function drawSquareBrush() {
	// context.strokeRect(mx, my, line_width, line_width);
	context.fillRect(mx, my, line_width, line_width);
}