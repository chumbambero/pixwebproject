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
		this.started = true;
	}
	this.isDrag = false;
	this.isResizeDrag = false;
	this.isDelete = false;
	this.isRotate = false;
	this.isRotateStart = false;
	var offsetx, offsety, selectionoffsetx, selectionoffsety;
	var vertex_x, vertex_y, hypotenusa_x, hypotenusa_y, cateto_x, cateto_y, hypotenusa, adja_cathetus, anti_cathetus, angle;
	// will save the # of the selection handle if the mouse is over one.
	this.expectResize = -1;
	// Happens when the mouse is clicked in the canvas
	this.mousedown = function(ev) {
		getMouse(ev);
		// we are over a selection box
		if (tool.expectResize !== -1) {
			if (mySel.shape && mySel.angle != 0) {
				return;
			}
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
		if (tool.isRotate) {
			vertex_x = mySel.selection.x + mySel.selection.w / 2,
					vertex_y = mySel.selection.y + mySel.selection.h / 2,
					hypotenusa_x = rotateImgx + rotateImg.width / 2,
					hypotenusa_y = rotateImgy + rotateImg.height / 2;
			tool.isRotateStart = true;
			return;
		}
		if (mySel != null) {
			if (eraserActive) {
				invalidate();
				ev_tool_change("brush");
				return;
			}
			// we are over a selection
			else if (mx > mySel.selection.x && my > mySel.selection.y
					&& mx < (mySel.selection.x + mySel.selection.w)
					&& my < (mySel.selection.y + mySel.selection.h)) {
				tool.selectionoffsetx = mx - mySel.selection.x;
				tool.selectionoffsety = my - mySel.selection.y;
				mySel.selection.x = mx - tool.selectionoffsetx;
				mySel.selection.y = my - tool.selectionoffsety;
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
			try {
				try {
					var imageData = context.getImageData(mx, my, 1, 1);
				} catch (e) {
					netscape.security.PrivilegeManager
							.enablePrivilege("UniversalBrowserRead");
					var imageData = context.getImageData(mx, my, 1, 1);
				}
			} catch (e) {
				throw new Error("unable to access image data: " + e)
			}
			// var imageData = context.getImageData(ev._x, ev._y, 1, 1);
			// if the mouse pixel exists, select and break
			if (imageData.data[3] > 0) {
				mySel = elements[i];
				mySelIndex = i;
				if ((!mySel.shape) && (!mySel.text)) {
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
					dojo.byId('bold').setAttribute("style", "display:none");
					dojo.byId('italic').setAttribute("style", "display:none");
					dojo.byId('widget_fonts').setAttribute("style",
							"display:none");
					dojo.byId('separator')
							.setAttribute("style", "display:none");
					dojo.byId('separator1').setAttribute("style",
							"display:none");
					dojo.byId('textarea').setAttribute("style",
					"display:none");
					bc.resize();
				} else {
					if (!mySel.shape) {
						dojo.byId('ereaser').setAttribute("style",
								"display:none");
						dojo.byId('sizeLabel').removeAttribute("style",
								"display:none");
						dojo.byId('sizeLabel').innerHTML = "Text Size";
						dojo.byId('widget_sizeSpinner').removeAttribute(
								"style", "display:none");
						dojo.byId('fillDrop').setAttribute("style",
								"display:none");
						dojo.byId('brushDrop').setAttribute("style",
								"display:none");
						dojo.byId('bold').removeAttribute("style",
								"display:none");
						dojo.byId('italic').removeAttribute("style",
								"display:none");
						dojo.byId('widget_fonts').removeAttribute("style",
								"display:none");
						dojo.byId('separator').removeAttribute("style",
								"display:none");
						dojo.byId('separator1').removeAttribute("style",
								"display:none");
						dojo.byId('textarea').removeAttribute("style",
								"display:none");
					} else {
						dojo.byId('ereaser').setAttribute("style",
								"display:none");
						dojo.byId('sizeLabel').removeAttribute("style",
								"display:none");
						if (mySel.obj.type != "line") {
							dojo.byId('sizeLabel').innerHTML = "Stroke Size";
							dojo.byId('fillDrop').removeAttribute("style",
									"display:none");
						} else {
							dojo.byId('sizeLabel').innerHTML = "Line Size";
							dojo.byId('fillDrop').setAttribute("style",
									"display:none");
						}
						dojo.byId('widget_sizeSpinner').removeAttribute(
								"style", "display:none");
						dojo.byId('brushDrop').setAttribute("style",
								"display:none");
						dojo.byId('bold').setAttribute("style", "display:none");
						dojo.byId('italic').setAttribute("style", "display:none");
						dojo.byId('widget_fonts').setAttribute("style",
								"display:none");
						dojo.byId('separator')
								.setAttribute("style", "display:none");
						dojo.byId('separator1').setAttribute("style",
								"display:none");
						dojo.byId('textarea').setAttribute("style",
								"display:none");
						bc.resize();
					}
				}
				tool.selectionoffsetx = mx - mySel.selection.x;
				tool.selectionoffsety = my - mySel.selection.y;
				mySel.selection.x = mx - tool.selectionoffsetx;
				mySel.selection.y = my - tool.selectionoffsety;
				tool.offsetx = mx - mySel.x;
				tool.offsety = my - mySel.y;
				mySel.x = mx - tool.offsetx;
				mySel.y = my - tool.offsety;
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
		dojo.byId('bold').setAttribute("style", "display:none");
		dojo.byId('italic').setAttribute("style", "display:none");
		dojo.byId('widget_fonts').setAttribute("style", "display:none");
		dojo.byId('separator').setAttribute("style", "display:none");
		dojo.byId('separator1').setAttribute("style", "display:none");
		dojo.byId('textarea').setAttribute("style", "display:none");
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
				mySel.selection.x = mx - tool.selectionoffsetx;
				mySel.selection.y = my - tool.selectionoffsety;
				mySel.new_x = mx - tool.offsetx;
				mySel.new_y = my - tool.offsety;
				if (mySel.selection.x <= 0) {
					mySel.selection.x = 0;
					mySel.new_x = mySel.x = 0 + mySelPadding;
				} else if ((mySel.selection.x + mySel.selection.w) >= canvaso.width) {
					mySel.selection.x = canvaso.width - mySel.selection.w;
					mySel.new_x = mySel.x = canvaso.width - mySel.selection.w
							+ mySelPadding;
				} else {
					mySel.x = mySel.new_x;
				}
				if (mySel.selection.y <= 0) {
					mySel.selection.y = 0;
					mySel.new_y = mySel.y = 0 + mySelPadding;
				} else if ((mySel.selection.y + mySel.selection.h) >= canvaso.height) {
					mySel.selection.y = canvaso.height - mySel.selection.h;
					mySel.new_y = mySel.y = canvaso.height - mySel.selection.h
							+ mySelPadding;
				} else {
					mySel.y = mySel.new_y;
				}
				// something is changing position so we better
				// invalidate the canvas!
				invalidate();
			} else if (tool.isResizeDrag) {
				// time to resize!
				var oldx = mySel.selection.x;
				var oldy = mySel.selection.y;
				var myangle = mySel.angle * 360 / (2 * Math.PI);
				var expectRotation;
				if ((myangle >= 0 && myangle <= 23)
						|| (myangle >= 339 && myangle <= 359)) {
					expectRotation = 0;
				} else if (myangle >= 24 && myangle <= 68) {
					expectRotation = 1;
				} else if (myangle >= 69 && myangle <= 113) {
					expectRotation = 2;
				} else if (myangle >= 114 && myangle <= 158) {
					expectRotation = 3;
				} else if (myangle >= 159 && myangle <= 203) {
					expectRotation = 4;
				} else if (myangle >= 204 && myangle <= 248) {
					expectRotation = 5;
				} else if (myangle >= 249 && myangle <= 293) {
					expectRotation = 6;
				} else {
					expectRotation = 7;
				}
				// 0 1 2
				// 3 4
				// 5 6 7
				switch (tool.expectResize) {
				case 0:
					mySel.selection.x = mx;
					mySel.selection.y = my;
					mySel.selection.w += oldx - mx;
					mySel.selection.h += oldy - my;
					switch (expectRotation) {
					case 0:
						mySel.new_x = mySel.selection.x + mySelPadding;
						mySel.new_y = mySel.selection.y + mySelPadding;
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						break;
					case 1:
						mySel.new_x = mySel.selection.x + mySelPadding;
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						break;
					case 2:
						mySel.new_x = mySel.selection.x + mySelPadding;
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						mySel.new_h = mySel.h + (oldy - my);
						break;
					case 3:
						mySel.new_h = mySel.h + (oldy - my);
						break;
					case 4:
						mySel.new_h = mySel.h + (oldy - my);
						mySel.new_w = mySel.w + (oldx - mx);
						break;
					case 5:
						mySel.new_w = mySel.w + (oldx - mx);
						break;
					case 6:
						mySel.new_w = mySel.w + (oldx - mx);
						mySel.new_y = mySel.selection.y + mySelPadding;
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						break;
					case 7:
						mySel.new_y = mySel.selection.y + mySelPadding;
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						break;
					}
					break;
				case 1:
					mySel.selection.y = my;
					mySel.selection.h += oldy - my;
					mySel.selection.centerx = mySel.selection.x
							+ mySel.selection.w / 2;
					switch (expectRotation) {
					case 0:
						mySel.new_y = mySel.selection.y + mySelPadding;
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						// console.log("x: "+mySel.x, "selextion.x:
						// "+mySel.selection.x, "y: "+mySel.y, "selection.y:
						// "+mySel.selection.y, "w: "+mySel.w, "selection.w:
						// "+mySel.selection.w, "h: "+mySel.h, "selection.h:
						// "+mySel.selection.h, mySel.angle, mySel.tmp_angle,
						// mySel.selection.angle);
						break;
					case 1:
						mySel.new_y = mySel.selection.y + mySelPadding;
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						mySel.new_w = mySel.w + (oldy - my);
						mySel.new_x = mySel.selection.centerx - mySel.new_w / 2;
						break;
					case 2:
						mySel.new_w = mySel.w + (oldy - my);
						mySel.new_x = mySel.selection.centerx - mySel.new_w / 2;
						break;
					case 3:
						mySel.new_w = mySel.w + (oldy - my);
						mySel.new_x = mySel.selection.centerx - mySel.new_w / 2;
						mySel.new_h = mySel.h + (oldy - my);
						break;
					case 4:
						mySel.new_h = mySel.h + (oldy - my);
						break;
					case 5:
						mySel.new_w = mySel.w + (oldy - my);
						mySel.new_h = mySel.h + (oldy - my);
						break;
					case 6:
						mySel.new_w = mySel.w + (oldy - my);
						break;
					case 7:
						mySel.new_y = mySel.selection.y + mySelPadding;
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						mySel.new_w = mySel.w + (oldy - my);
						break;
					}
					break;
				case 2:
					mySel.selection.y = my;
					mySel.selection.w = mx - oldx;
					mySel.selection.h += oldy - my;
					mySel.selection.centerx = mySel.selection.x
							+ mySel.selection.w / 2;
					switch (expectRotation) {
					case 0:
						mySel.new_y = mySel.selection.y + mySelPadding;
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						break;
					case 1:
						mySel.new_y = mySel.selection.y + mySelPadding;
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						break;
					case 2:
						mySel.new_y = mySel.selection.y + mySelPadding;
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						mySel.new_w = mySel.w + (oldx - mx);
						mySel.new_x = mySel.selection.centerx - mySel.new_w / 2;
						break;
					case 3:
						mySel.new_w = mySel.w + (oldx - mx);
						mySel.new_x = mySel.selection.centerx - mySel.new_w / 2;
						break;
					case 4:
						mySel.new_w = mySel.w + (oldx - mx);
						mySel.new_x = mySel.selection.centerx - mySel.new_w / 2;
						mySel.new_h = mySel.h + (my - oldy);
						break;
					case 5:
						mySel.new_h = mySel.h + (my - oldy);
						break;
					case 6:
						mySel.new_h = mySel.h + (my - oldy);
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						break;
					case 7:
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						break;
					}
					break;
				case 3:
					mySel.selection.x = mx;
					mySel.selection.w += oldx - mx;
					mySel.selection.centery = mySel.selection.y
							+ mySel.selection.h / 2;
					switch (expectRotation) {
					case 0:
						mySel.new_x = mySel.selection.x + mySelPadding;
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						break;
					case 1:
						mySel.new_x = mySel.selection.x + mySelPadding;
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						mySel.new_h = mySel.h + (oldx - mx);
						break;
					case 2:
						mySel.new_h = mySel.h + (oldx - mx);
						break;
					case 3:
						mySel.new_h = mySel.h + (oldx - mx);
						mySel.new_w = mySel.w + (oldx - mx);
						break;
					case 4:
						mySel.new_w = mySel.w + (oldx - mx);
						break;
					case 5:
						mySel.new_h = mySel.h + (oldx - mx);
						mySel.new_y = mySel.selection.centery - mySel.new_h / 2;
						mySel.new_w = mySel.w + (oldx - mx);
						break;
					case 6:
						mySel.new_h = mySel.h + (oldx - mx);
						mySel.new_y = mySel.selection.centery - mySel.new_h / 2;
						break;
					case 7:
						mySel.new_x = mySel.selection.x + mySelPadding;
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						mySel.new_h = mySel.h + (oldx - mx);
						mySel.new_y = mySel.selection.centery - mySel.new_h / 2;
						break;
					}
					break;
				case 4:
					mySel.selection.w = mx - oldx;
					mySel.selection.centerx = mySel.selection.x
							+ mySel.selection.w / 2;
					mySel.selection.centery = mySel.selection.y
							+ mySel.selection.h / 2;
					switch (expectRotation) {
					case 0:
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						break;
					case 1:
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						mySel.new_h = mySel.h + (oldx - mx);
						mySel.new_y = mySel.selection.centery - mySel.new_h / 2;
						break;
					case 2:
						mySel.new_h = mySel.h + (oldx - mx);
						mySel.new_y = mySel.selection.centery - mySel.new_h / 2;
						break;
					case 3:
						mySel.new_w = mySel.w + (oldx - mx);
						mySel.new_x = mySel.selection.centerx - mySel.new_w / 2;
						mySel.new_h = mySel.h + (oldx - mx);
						mySel.new_y = mySel.selection.centery - mySel.new_h / 2;
						break;
					case 4:
						mySel.new_w = mySel.w + (oldx - mx);
						mySel.new_x = mySel.selection.centerx - mySel.new_w / 2;
						break;
					case 5:
						mySel.new_w = mySel.w + (oldx - mx);
						mySel.new_x = mySel.selection.centerx - mySel.new_w / 2;
						mySel.new_h = mySel.h + (oldx - mx);
						break;
					case 6:
						mySel.new_h = mySel.h + (oldx - mx);
						break;
					case 7:
						mySel.new_h = mySel.h + (oldx - mx);
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						break;
					}
					break;
				case 5:
					mySel.selection.x = mx;
					mySel.selection.w += oldx - mx;
					mySel.selection.h = my - oldy;
					mySel.selection.centery = mySel.selection.y
							+ mySel.selection.h / 2;
					switch (expectRotation) {
					case 0:
						mySel.new_x = mySel.selection.x + mySelPadding;
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						break;
					case 1:
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						break;
					case 2:
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						mySel.new_w = mySel.w + (oldx - mx);
						break;
					case 3:
						mySel.new_w = mySel.w + (oldx - mx);
						break;
					case 4:
						mySel.new_w = mySel.w + (oldx - mx);
						mySel.new_h = mySel.h + (oldy - my);
						mySel.new_y = mySel.selection.centery - mySel.new_h / 2;
						break;
					case 5:
						mySel.new_h = mySel.h + (oldy - my);
						mySel.new_y = mySel.selection.centery - mySel.new_h / 2;
						break;
					case 6:
						mySel.new_h = mySel.h + (oldy - my);
						mySel.new_y = mySel.selection.centery - mySel.new_h / 2;
						mySel.new_x = mySel.selection.x + mySelPadding;
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						break;
					case 7:
						mySel.new_x = mySel.selection.x + mySelPadding;
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						break;
					}
					break;
				case 6:
					mySel.selection.h = my - oldy;
					mySel.selection.centerx = mySel.selection.x
							+ mySel.selection.w / 2;
					mySel.selection.centery = mySel.selection.y
							+ mySel.selection.h / 2;
					switch (expectRotation) {
					case 0:
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						break;
					case 1:
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						mySel.new_w = mySel.w + (oldy - my);
						break;
					case 2:
						mySel.new_w = mySel.w + (oldy - my);
						break;
					case 3:
						mySel.new_w = mySel.w + (oldy - my);
						mySel.new_h = mySel.h + (oldy - my);
						mySel.new_y = mySel.selection.centery - mySel.new_h / 2;
						break;
					case 4:
						mySel.new_h = mySel.h + (oldy - my);
						mySel.new_y = mySel.selection.centery - mySel.new_h / 2;
						break;
					case 5:
						mySel.new_h = mySel.h + (oldy - my);
						mySel.new_y = mySel.selection.centery - mySel.new_h / 2;
						mySel.new_w = mySel.w + (oldy - my);
						mySel.new_x = mySel.selection.centerx - mySel.new_w / 2;
						break;
					case 6:
						mySel.new_w = mySel.w + (oldy - my);
						mySel.new_x = mySel.selection.centerx - mySel.new_w / 2;
						break;
					case 7:
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						mySel.new_w = mySel.w + (oldy - my);
						mySel.new_x = mySel.selection.centerx - mySel.new_w / 2;
						break;
					}
					break;
				case 7:
					mySel.selection.w = mx - oldx;
					mySel.selection.h = my - oldy;
					mySel.selection.centerx = mySel.selection.x
							+ mySel.selection.w / 2;
					mySel.selection.centery = mySel.selection.y
							+ mySel.selection.h / 2;
					switch (expectRotation) {
					case 0:
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						break;
					case 1:
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						break;
					case 2:
						mySel.new_w = mySel.selection.w - mySelPadding * 2;
						mySel.new_h = mySel.h + (oldy - my);
						mySel.new_y = mySel.selection.centery - mySel.new_h / 2;
						break;
					case 3:
						mySel.new_h = mySel.h + (oldy - my);
						mySel.new_y = mySel.selection.centery - mySel.new_h / 2;
						break;
					case 4:
						mySel.new_h = mySel.h + (oldy - my);
						mySel.new_y = mySel.selection.centery - mySel.new_h / 2;
						mySel.new_w = mySel.w + (oldx - mx);
						mySel.new_x = mySel.selection.centerx - mySel.new_w / 2;
						break;
					case 5:
						mySel.new_w = mySel.w + (oldx - mx);
						mySel.new_x = mySel.selection.centerx - mySel.new_w / 2;
						break;
					case 6:
						mySel.new_w = mySel.w + (oldx - mx);
						mySel.new_x = mySel.selection.centerx - mySel.new_w / 2;
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						break;
					case 7:
						mySel.new_h = mySel.selection.h - mySelPadding * 2;
						break;
					}
					break;
				}
				compute_selection(mySel, mySel.selection.x + mySel.selection.w
						/ 2, mySel.selection.y + mySel.selection.h / 2);
				// console.log(tool.expectResize, expectRotation,
				// mySel.selection.x, mySel.selection.y, mySel.x, mySel.y,
				// (oldx-mx), (oldy-my));
				invalidate();
			} else if (tool.isRotateStart) {
				getMouse(ev);
				var angle = 0;
				mySel.angle_changing = true;
				cateto_x = mx, cateto_y = my;
				hypotenusa = Math.sqrt(Math.pow(hypotenusa_x - vertex_x, 2)
						+ Math.pow(hypotenusa_y - vertex_y, 2));
				adja_cathetus = Math.sqrt(Math.pow(cateto_x - vertex_x, 2)
						+ Math.pow(cateto_y - vertex_y, 2));
				anti_cathetus = Math.sqrt(Math.pow(cateto_x - hypotenusa_x, 2)
						+ Math.pow(cateto_y - hypotenusa_y, 2));
				if (cateto_x >= vertex_x) {
					angle = Math.acos((Math.pow(hypotenusa, 2)
							+ Math.pow(adja_cathetus, 2) - Math.pow(
							anti_cathetus, 2))
							/ (2 * hypotenusa * adja_cathetus))
							* (360 / (2 * Math.PI));
				} else {
					angle = Math.acos((Math.pow(anti_cathetus, 2)
							+ Math.pow(hypotenusa, 2) - Math.pow(adja_cathetus,
							2))
							/ (2 * hypotenusa * anti_cathetus))
							* (360 / (2 * Math.PI)) + 180;
				}
				mySel.selection.angle = angle;
				mySel.tmp_angle = mySel.angle * (360 / (2 * Math.PI)) + angle;
				if (mySel.tmp_angle >= 360) {
					mySel.tmp_angle -= 360;
				}
				if (mySel.selection.angle >= 360) {
					mySel.selection.angle -= 360;
				}
				mySel.tmp_angle = 2 * Math.PI * (mySel.tmp_angle / 360);
				mySel.selection.angle = 2 * Math.PI
						* (mySel.selection.angle / 360);
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
				if (mx > mySel.selection.x && my > mySel.selection.y
						&& mx < (mySel.selection.x + mySel.selection.w)
						&& my < (mySel.selection.y + mySel.selection.h)
						&& !eraserActive) {
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
			if (mySel !== null && mx >= rotateImgx && my >= rotateImgy
					&& mx <= rotateImgx + rotateImg.width
					&& my <= rotateImgy + rotateImg.height) {
				tool.isRotate = true;
			} else {
				tool.isRotate = false;
			}
		}
	};
	// This is called when you release the mouse button.
	this.mouseup = function(ev) {
		tool.isDrag = false;
		if (tool.isResizeDrag) {
			if (!mySel.shape) { // ((!mySel.shape) ||
				// (mySel.shape&&mySel.final_angle!=0))
				mySel.data = mySel.tmp_data;
				mySel.x = mySel.new_x;
				mySel.y = mySel.new_y;
				mySel.w = mySel.new_w;
				mySel.h = mySel.new_h;
			}
			tool.isResizeDrag = false;
		}
		tool.expectResize = -1;
		tool.isDelete = false;
		if (tool.isRotateStart) {
			tool.isRotateStart = false;
			mySel.angle_changing = false;
			mySel.selection.angle = 0;
			mySel.angle = mySel.tmp_angle;
			mySel.final_angle = mySel.tmp_angle;
			compute_selection(mySel, vertex_x, vertex_y);
			if (!mySel.shape) { // ((!mySel.shape) ||
				// (mySel.shape&&mySel.final_angle!=0))
				clearInterval(mainDraw);
				afterRotation = true;
				invalidate();
				mainDraw();
				var row = [];
				var col = [];
				for ( var j = mySel.selection.x + mySelPadding + 1; j < ((mySel.selection.x + mySel.selection.w)
						- mySelPadding - 1); j++) {
					for ( var k = mySel.selection.y + mySelPadding + 1; k < ((mySel.selection.y + mySel.selection.h)
							- mySelPadding - 1); k++) {
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
//				console.log("x: " + mySel.x, "y: " + mySel.y, "w: " + mySel.w,
//						"h: " + mySel.h);
				mySel.new_x = mySel.x = Math.min.apply(null, row);
				mySel.new_y = mySel.y = Math.min.apply(null, col);
				mySel.new_w = mySel.w = Math.max.apply(null, row) - mySel.x;
				mySel.new_h = mySel.h = Math.max.apply(null, col) - mySel.y;
				afterRotation = false;
				mySel.angle = mySel.tmp_angle = 0;
				try {
					try {
						var imgd = context.getImageData(mySel.x, mySel.y,
								mySel.w, mySel.h);
					} catch (e) {
						netscape.security.PrivilegeManager
								.enablePrivilege("UniversalBrowserRead");
						var imgd = context.getImageData(mySel.x, mySel.y,
								mySel.w, mySel.h);
					}
				} catch (e) {
					throw new Error("unable to access image data: " + e)
				}
				mySel.data = imgd;
				// mySel.data = context.getImageData(mySel.x, mySel.y, mySel.w,
				// mySel.h);
				clear(context);
				setInterval(mainDraw, INTERVAL);
			}
			invalidate();
		}
	};
};