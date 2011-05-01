// The drawing pencil.
tools.pencil = function() {
	var tool = this;
	this.started = false;
	this.smallerx, this.smallery, this.biggerx, this.biggery;
	context.lineWidth = 1;
	context.strokeStyle = color_stroke;
	// This is called when you start holding down the mouse
	// button.
	// This starts the pencil drawing.
	this.mousedown = function(ev) {
		tool.smallerx = tool.biggerx = ev._x;
		tool.smallery = tool.biggery = ev._y;
		context.beginPath();
		context.moveTo(ev._x, ev._y);
		tool.started = true;
	};
	// This function is called every time you move the mouse.
	// Obviously, it only
	// draws if the tool.started state is set to true (when you
	// are holding down
	// the mouse button).
	this.mousemove = function(ev) {
		if (tool.started) {
			context.lineTo(ev._x, ev._y);
			context.stroke();
			if (ev._x < tool.smallerx) {
				tool.smallerx = ev._x;
			}
			if (ev._x > tool.biggerx) {
				tool.biggerx = ev._x;
			}
			if (ev._y < tool.smallery) {
				tool.smallery = ev._y;
			}
			if (ev._y > tool.biggery) {
				tool.biggery = ev._y;
			}
		}
	};
	// This is called when you release the mouse button.
	this.mouseup = function(ev) {
		if (tool.started) {
			// tool.mousemove(ev);
			tool.started = false;
			if (ev._x < tool.smallerx) {
				tool.smallerx = ev._x;
			}
			if (ev._x > tool.biggerx) {
				tool.biggerx = ev._x;
			}
			if (ev._y < tool.smallery) {
				tool.smallery = ev._y;
			}
			if (ev._y > tool.biggery) {
				tool.biggery = ev._y;
			}
			addElement(tool.smallerx, tool.smallery, tool.biggerx,
					tool.biggery, 1, color_stroke, false, null, null);
			img_update();
		}
	};
};