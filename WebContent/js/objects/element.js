/*
 * Copyright (C) 2010, 2011 Alessandro Trombini
 *
 * This file is part of PixWeb.
 */

/**
 * @author Alessandro Trombini
 */

// Element object to hold data for all drawn elements
function Element() {
	this.data = null;
	this.tmp_data = null;
	this.x = null;
	this.y = null;
	this.w = null;
	this.h = null;
	this.new_x = null;
	this.new_y = null;
	this.new_w = null;
	this.new_h = null;
	this.angle = 0;
	this.tmp_angle = 0;
	this.final_angle = 0;
	this.angle_changing = false;
	this.shape = null;
	this.text = null; 
	this.strokesize = null;
	this.strokecolor = null;
	this.fillcolor = null;
	this.obj = null;
	this.selection = new Selection();
}

// New methods on the Element class
Element.prototype = {
	// we used to have a solo draw function
	// but now each element is responsible for its own drawing
	// mainDraw() will call this with the normal canvas
	// mousedown will call this with the temp canvas with 'black'
	draw : function(ctx, optionalColor) {
		if (ctx === context) {
			ctx.fillStyle = 'black'; // always want black for the
			// temp canvas
		}

		// draw selection
		// this is a stroke along the box and also 8 new selection
		// handles
		if (mySel === this) {
			ctx.save();
			if (this.angle != 0 && !this.angle_changing) {
				ctx.translate(this.selection.x + this.selection.w / 2, this.selection.y + this.selection.h / 2);
				ctx.rotate(this.angle);
			}
			if (this.tmp_angle!=0 && this.angle_changing) {
				ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
				ctx.rotate(this.tmp_angle);
			}
			adjustDrawingTemp(ctx, this);
			ctx.restore();
			ctx.strokeStyle = mySelColor;
			ctx.lineWidth = mySelWidth;
			if (this.angle_changing) {
				ctx.save();
				ctx.translate(this.selection.x + this.selection.w / 2, this.selection.y + this.selection.h / 2);
				ctx.rotate(this.selection.angle);
				ctx.strokeRect(0 - this.selection.w / 2, 0 - this.selection.h / 2, this.selection.w, this.selection.h);
			} else {
//				ctx.restore();
				ctx.strokeRect(this.selection.x, this.selection.y, this.selection.w, this.selection.h);
			}
			// draw the boxes
			var half = mySelBoxSize / 2;
			// 0 1 2
			// 3 4
			// 5 6 7
			if (this.angle_changing) {
				// top left, middle, right
				selectionHandles[0].x = 0 - half - this.selection.w / 2;
				selectionHandles[0].y = 0 - half - this.selection.h / 2;
				selectionHandles[1].x = 0 - half;
				selectionHandles[1].y = 0 - half - this.selection.h / 2;
				selectionHandles[2].x = 0 + this.selection.w / 2 - half;
				selectionHandles[2].y = 0 - half - this.selection.h / 2;
				// middle left
				selectionHandles[3].x = 0 - half - this.selection.w / 2;
				selectionHandles[3].y = 0 - half;
				// middle right
				selectionHandles[4].x = 0 + this.selection.w / 2 - half;
				selectionHandles[4].y = 0 - half;
				// bottom left, middle, right
				selectionHandles[5].x = 0 - half - this.selection.w / 2;
				selectionHandles[5].y = 0 + this.selection.h / 2 - half;
				selectionHandles[6].x = 0 - half;
				selectionHandles[6].y = 0 + this.selection.h / 2 - half;
				selectionHandles[7].x = 0 + this.selection.w / 2 - half;
				selectionHandles[7].y = 0 + this.selection.h / 2 - half;
			} else {
//				ctx.restore();
				// top left, middle, right
				selectionHandles[0].x = this.selection.x - half;
				selectionHandles[0].y = this.selection.y - half;
				selectionHandles[1].x = this.selection.x + this.selection.w / 2 - half;
				selectionHandles[1].y = this.selection.y - half;
				selectionHandles[2].x = this.selection.x + this.selection.w - half;
				selectionHandles[2].y = this.selection.y - half;
				// middle left
				selectionHandles[3].x = this.selection.x - half;
				selectionHandles[3].y = this.selection.y + this.selection.h / 2 - half;
				// middle right
				selectionHandles[4].x = this.selection.x + this.selection.w - half;
				selectionHandles[4].y = this.selection.y + this.selection.h / 2 - half;
				// bottom left, middle, right
				selectionHandles[5].x = this.selection.x - half;
				selectionHandles[5].y = this.selection.y + this.selection.h - half;
				selectionHandles[6].x = this.selection.x + this.selection.w / 2 - half;
				selectionHandles[6].y = this.selection.y + this.selection.h - half;
				selectionHandles[7].x = this.selection.x + this.selection.w - half;
				selectionHandles[7].y = this.selection.y + this.selection.h - half;
			}

			ctx.fillStyle = mySelBoxColor;
			for ( var i = 0; i < 8; i++) {
				var cur = selectionHandles[i];
				ctx.fillRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
			}
			if (eraserActive) {
				ctx.fillStyle = 'rgba(0, 0, 0, 0)';
			}

			if (this.angle_changing) {
				deleteImgx = 0 - Math.ceil(deleteImg.width / 2);
				deleteImgy = 0 + this.selection.h/2;
				ctx.drawImage(deleteImg, deleteImgx, deleteImgy);
				rotateImgx = 0 - Math.ceil(rotateImg.width / 2);
				rotateImgy = 0 - rotateImg.height - this.selection.h/2;
				ctx.drawImage(rotateImg, rotateImgx, rotateImgy);
			} else {
//				ctx.restore();
				deleteImgx = this.selection.x + this.selection.w / 2 - Math.ceil(deleteImg.width / 2);
				deleteImgy = this.selection.y + this.selection.h;
				ctx.drawImage(deleteImg, deleteImgx, deleteImgy);
				rotateImgx = this.selection.x + this.selection.w / 2 - Math.ceil(rotateImg.width / 2);
				rotateImgy = this.selection.y - rotateImg.height;
				ctx.drawImage(rotateImg, rotateImgx, rotateImgy);
			}
			if (this.angle_changing) {
				ctx.restore();
			}
//			console.log(this.angle*(360/(2*Math.PI)), this.x, this.y, this.x+this.w, this.y+this.h,
//					this.x*Math.cos(-this.angle)-this.y*Math.sin(-this.angle),
//					this.x*Math.sin(-this.angle)+this.y*Math.cos(-this.angle));
		} else {
			ctx.save();
			if (this.angle != 0) {
				ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
				ctx.rotate(this.angle);
			}
			adjustDrawing(ctx, this);
			ctx.restore();
		}
	} // end draw
};

// add en element to elements
function addElement(mousedownx, mousedowny, mouseupx, mouseupy, strokesize,
		strokecolor, fillcolor, shape, img, txt, obj) {
	var el = new Element;
	el.strokesize = strokesize;
	el.strokecolor = strokecolor;
	el.fillcolor = fillcolor;
	el.shape = shape;
	el.text = txt;
	el.obj = obj;
	if (mousedownx <= mouseupx && mousedowny <= mouseupy) {
		el.x = el.new_x = el.selection.x = mousedownx - Math.ceil(el.strokesize / 2);
		el.y = el.new_y = el.selection.y = mousedowny - Math.ceil(el.strokesize / 2);
		el.w = el.new_w = el.selection.w = mouseupx - mousedownx + Math.ceil(el.strokesize / 2)
				* 2;
		el.h = el.new_h = el.selection.h = mouseupy - mousedowny + Math.ceil(el.strokesize / 2)
				* 2;
	} else if (mousedownx > mouseupx && mousedowny <= mouseupy) {
		el.x = el.new_x = el.selection.x = mouseupx - Math.ceil(el.strokesize / 2);
		el.y = el.new_y = el.selection.y = mousedowny - Math.ceil(el.strokesize / 2);
		el.w = el.new_w = el.selection.w = mousedownx - mouseupx + Math.ceil(el.strokesize / 2)
				* 2;
		el.h = el.new_h = el.selection.h = mouseupy - mousedowny + Math.ceil(el.strokesize / 2)
				* 2;
	} else if (mousedownx <= mouseupx && mousedowny > mouseupy) {
		el.x = el.new_x = el.selection.x = mousedownx - Math.ceil(el.strokesize / 2);
		el.y = el.new_y = el.selection.y = mouseupy - Math.ceil(el.strokesize / 2);
		el.w = el.new_w = el.selection.w = mouseupx - mousedownx + Math.ceil(el.strokesize / 2)
				* 2;
		el.h = el.new_h = el.selection.h = mousedowny - mouseupy + Math.ceil(el.strokesize / 2)
				* 2;
	} else {
		el.x = el.new_x = el.selection.x = mouseupx - Math.ceil(el.strokesize / 2);
		el.y = el.new_y = el.selection.y = mouseupy - Math.ceil(el.strokesize / 2);
		el.w = el.new_w = el.selection.w = mousedownx - mouseupx + Math.ceil(el.strokesize / 2)
				* 2;
		el.h = el.new_h = el.selection.h = mousedowny - mouseupy + Math.ceil(el.strokesize / 2)
				* 2;
	}
	el.selection.x -= mySelPadding;
	el.selection.y -= mySelPadding;
	el.selection.w += mySelPadding*2;
	el.selection.h += mySelPadding*2;
//	if(img){
		try {
			try {
				var imgd = context.getImageData(el.x, el.y, el.w, el.h);
			}
			catch (e) {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				var imgd = context.getImageData(el.x, el.y, el.w, el.h);
			}
		} catch (e) {
			throw new Error("unable to access image data: " + e)
		}
		el.data = el.tmp_data = imgd;
//	} else {
//		el.data = el.tmp_data = context.getImageData(el.x, el.y, el.w, el.h);
//	}
	elements.push(el);
	invalidate();
}