/*
 * Copyright (C) 2010, 2011 Alessandro Trombini
 *
 * This file is part of PixWeb.
 */

/**
 * @author Alessandro Trombini
 */

// the pointer
tools.pointer = function() {
	var tool = this;
	if (!eraserActive) {
		this.started = false;
	} else {
		console.log("pointer is just started");
		this.started = true;
	}
	this.isDrag = false;
	this.isResizeDrag = false;
	this.isDelete = false;
	var offsetx, offsety;
	// will save the # of the selection handle if the mouse is over one.
	this.expectResize = -1;
	// Happens when the mouse is clicked in the canvas
	this.mousedown = function(ev) {
		getMouse(ev);
		// we are over a selection box
		if (tool.expectResize !== -1) {
			tool.isResizeDrag = true;
			return;
		}
		if (tool.isDelete) {
			elements.remove(mySelIndex);
			mySel = null;
			mySelIndex = -1;
			dojo.byId('ereaser').setAttribute("style", "display:none");
			// clear the ghost canvas for next time
			clear(context);
			clear(ghostcontext);
			clear(ghostcontexto);
			// invalidate because we might need the selection border to
			// disappear
			invalidate();
			clearInterval(mainDraw);
			tool.started = false;
			canvas.style.cursor = 'crosshair';
			context.strokeStyle = color_stroke;
			context.fillStyle = color_fill;
		}
		if (mySel != null) {
			console.log(mx + ">" + mySel.x + " " + (mx > mySel.x) + ", " + my
					+ ">" + mySel.y + " " + (my > mySel.y) + ", " + mx + "<"
					+ (mySel.x + mySel.w) + " " + (mx < (mySel.x + mySel.w))
					+ ", " + my + "<" + (mySel.y + mySel.h) + " "
					+ (my < (mySel.x + mySel.w)));
			if (eraserActive) {
				invalidate();
				console.log("go to brush");
				ev_tool_change("brush");
				return;
			}
			// we are over a selection
			else if (mx > mySel.x && my > mySel.y && mx < (mySel.x + mySel.w)
					&& my < (mySel.y + mySel.h)) {
				tool.offsetx = mx - mySel.x;
				tool.offsety = my - mySel.y;
				mySel.x = mx - tool.offsetx;
				mySel.y = my - tool.offsety;
				tool.isDrag = true;
				return;
			}
		}
		clear(context);
		clear(ghostcontext);
		clear(ghostcontexto);
		var l = elements.length;
		for ( var i = l - 1; i >= 0; i--) {
			// draw element onto temp context
			elements[i].draw(context, 'black');
			// get image data at the mouse x,y pixel
			// var imageData = context.getImageData(mx, my, 1, 1);
			var imageData = context.getImageData(ev._x, ev._y, 1, 1);
			// if the mouse pixel exists, select and break
			if (imageData.data[3] > 0) {
				mySel = elements[i];
				mySelIndex = i;
				if (!mySel.shape) {
					dojo.byId('ereaser').removeAttribute("style",
							"display:none");
					dojo.byId('sizeLabel').removeAttribute("style",
							"display:none");
					dojo.byId('sizeLabel').innerHTML = "Eraser Size";
					dojo.byId('widget_sizeSpinner').removeAttribute("style",
							"display:none");
					dojo.byId('fillDrop').setAttribute("style", "display:none");
					dojo.byId('brushDrop').removeAttribute("style",
							"display:none");
					bc.resize();
				} else {
					dojo.byId('ereaser').setAttribute("style", "display:none");
					dojo.byId('sizeLabel').removeAttribute("style", "display:none");
					if(mySel.obj.type!="line"){
						dojo.byId('sizeLabel').innerHTML = "Stroke Size";
						dojo.byId('fillDrop').removeAttribute("style", "display:none");
					}else{
						dojo.byId('sizeLabel').innerHTML = "Line Size";
						dojo.byId('fillDrop').setAttribute("style", "display:none");
					}
                    dojo.byId('widget_sizeSpinner').removeAttribute("style", "display:none");
                    dojo.byId('brushDrop').setAttribute("style", "display:none");
                    bc.resize();
				}
				tool.offsetx = mx - mySel.x;
				console.log("mx: " + mx);
				console.log("mySel.x: " + mySel.x);
				console.log("offsetx: " + tool.offsetx);
				tool.offsety = my - mySel.y;
				console.log("my: " + my);
				console.log("mySel.y: " + mySel.y);
				console.log("offsety: " + tool.offsety);
				mySel.x = mx - tool.offsetx;
				console.log("mySel.x: " + mySel.x);
				mySel.y = my - tool.offsety;
				console.log("mySel.y: " + mySel.y);
				tool.started = true;
				tool.isDrag = true;
				// make mainDraw() fire every INTERVAL milliseconds.
				setInterval(mainDraw, INTERVAL);
				invalidate();
				clear(context);
				clear(ghostcontext);
				clear(ghostcontexto);
				return;
			} else {
				clear(context);
			}
		}
		// haven't returned means we have selected nothing
		mySel = null;
		mySelIndex = -1;
		dojo.byId('ereaser').setAttribute("style", "display:none");
		dojo.byId('sizeLabel').setAttribute("style", "display:none");
        dojo.byId('widget_sizeSpinner').setAttribute("style", "display:none");
        dojo.byId('fillDrop').setAttribute("style", "display:none");
        dojo.byId('brushDrop').setAttribute("style", "display:none");
        bc.resize();
		// clear the ghost canvas for next time
		clear(context);
		clear(ghostcontext);
		clear(ghostcontexto);
		// invalidate because we might need the selection border to
		// disappear
		invalidate();
		clearInterval(mainDraw);
		tool.started = false;
		canvas.style.cursor = 'crosshair';
		context.strokeStyle = color_stroke;
		context.fillStyle = color_fill;
	};
	// Happens when the mouse is moving inside the canvas
	this.mousemove = function(ev) {
		if (tool.started) {
			if (tool.isDrag) {
				getMouse(ev);
				mySel.new_x = mx - tool.offsetx;
				mySel.new_y = my - tool.offsety;
				if (mySel.new_x < 0 || mySel.new_x + mySel.w > canvaso.width) {
					mySel.new_x = mySel.x;
				} else {
					mySel.x = mySel.new_x;
				}
				if (mySel.new_y < 0 || mySel.new_y + mySel.h > canvaso.height) {
					mySel.new_y = mySel.y;
				} else {
					mySel.y = mySel.new_y;
				}
				// something is changing position so we better
				// invalidate the canvas!
				invalidate();
			} else if (tool.isResizeDrag) {
				// time to resize!
				var oldx = mySel.x;
				var oldy = mySel.y;
				// 0 1 2
				// 3 4
				// 5 6 7
				switch (tool.expectResize) {
				case 0:
					mySel.new_x = mx;
					mySel.new_y = my;
					mySel.new_w += oldx - mx;
					mySel.new_h += oldy - my;
					break;
				case 1:
					mySel.new_y = my;
					mySel.new_h += oldy - my;
					break;
				case 2:
					mySel.new_y = my;
					mySel.new_w = mx - oldx;
					mySel.new_h += oldy - my;
					break;
				case 3:
					mySel.new_x = mx;
					mySel.new_w += oldx - mx;
					break;
				case 4:
					mySel.new_w = mx - oldx;
					break;
				case 5:
					mySel.new_x = mx;
					mySel.new_w += oldx - mx;
					mySel.new_h = my - oldy;
					break;
				case 6:
					mySel.new_h = my - oldy;
					break;
				case 7:
					mySel.new_w = mx - oldx;
					mySel.new_h = my - oldy;
					break;
				}
				invalidate();
			}
			getMouse(ev);
			// if there's a selection see if we grabbed one of the
			// selection handles
			if (mySel !== null && !tool.isResizeDrag) {
				for ( var i = 0; i < 8; i++) {
					// 0 1 2
					// 3 4
					// 5 6 7
					var cur = selectionHandles[i];
					// we don't need to use the temp context because
					// selection handles will always be rectangles
					if (mx >= cur.x && mx <= cur.x + mySelBoxSize
							&& my >= cur.y && my <= cur.y + mySelBoxSize) {
						// we found one!
						tool.expectResize = i;
						invalidate();
						switch (i) {
						case 0:
							canvas.style.cursor = 'nw-resize';
							break;
						case 1:
							canvas.style.cursor = 'n-resize';
							break;
						case 2:
							canvas.style.cursor = 'ne-resize';
							break;
						case 3:
							canvas.style.cursor = 'w-resize';
							break;
						case 4:
							canvas.style.cursor = 'e-resize';
							break;
						case 5:
							canvas.style.cursor = 'sw-resize';
							break;
						case 6:
							canvas.style.cursor = 's-resize';
							break;
						case 7:
							canvas.style.cursor = 'se-resize';
							break;
						}
						return;
					}
				}
				if (mx > mySel.x && my > mySel.y && mx < (mySel.x + mySel.w)
						&& my < (mySel.y + mySel.h) && !eraserActive) {
					canvas.style.cursor = 'move';
				} else {
					canvas.style.cursor = 'crosshair';
				}

				// not over a selection box, return to normal
				tool.isResizeDrag = false;
				tool.expectResize = -1;
			}
			if (mySel !== null && mx >= deleteImgx && my >= deleteImgy
					&& mx <= deleteImgx + deleteImg.width
					&& my <= deleteImgy + deleteImg.height) {
				tool.isDelete = true;
			} else {
				tool.isDelete = false;
			}
		}
	};
	// This is called when you release the mouse button.
	this.mouseup = function(ev) {
		tool.isDrag = false;
		tool.isResizeDrag = false;
		tool.expectResize = -1;
		tool.isDelete = false;
	};
};