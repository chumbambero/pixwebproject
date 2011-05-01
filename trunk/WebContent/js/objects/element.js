// Element object to hold data for all drawn elements
function Element(){
    this.data = null;
    this.x = null;
    this.y = null;
    this.w = null;
    this.h = null;
    this.new_x = null;
    this.new_y = null;
    this.new_w = null;
    this.new_h = null;
    this.shape = null;
    this.strokesize = null;
    this.strokecolor = null;
    this.fillcolor = null;
    this.obj = null;
}

// New methods on the Element class
Element.prototype = {
    // we used to have a solo draw function
    // but now each element is responsible for its own drawing
    // mainDraw() will call this with the normal canvas
    // mousedown will call this with the temp canvas with 'black'
    draw: function(ctx, optionalColor){
        if (ctx === context) {
            ctx.fillStyle = 'black'; // always want black for the
            // temp canvas
        }
        
        if (mySel === this) {
            adjustDrawingTemp(ctx, this);
        }
        else {
            adjustDrawing(ctx, this);
        }
        
        // draw selection
        // this is a stroke along the box and also 8 new selection
        // handles
        if (mySel === this) {
            ctx.strokeStyle = mySelColor;
            ctx.lineWidth = mySelWidth;
            ctx.strokeRect(this.x - mySelPadding, this.y - mySelPadding, this.w + mySelPadding * 2, this.h + mySelPadding * 2);
            // draw the boxes
            var half = mySelBoxSize / 2;
            // 0 1 2
            // 3   4
            // 5 6 7
            // top left, middle, right
            selectionHandles[0].x = this.x - mySelPadding - half;
            selectionHandles[0].y = this.y - mySelPadding - half;
            selectionHandles[1].x = this.x + this.w / 2 - half;
            selectionHandles[1].y = this.y - mySelPadding - half;
            selectionHandles[2].x = this.x + mySelPadding + this.w - half;
            selectionHandles[2].y = this.y - mySelPadding - half;
            // middle left
            selectionHandles[3].x = this.x - mySelPadding - half;
            selectionHandles[3].y = this.y + this.h / 2 - half;
            // middle right
            selectionHandles[4].x = this.x + mySelPadding + this.w - half;
            selectionHandles[4].y = this.y + this.h / 2 - half;
            // bottom left, middle, right
            selectionHandles[5].x = this.x - mySelPadding - half;
            selectionHandles[5].y = this.y + mySelPadding + this.h - half;
            selectionHandles[6].x = this.x + this.w / 2 - half;
            selectionHandles[6].y = this.y + mySelPadding + this.h - half;
            selectionHandles[7].x = this.x + mySelPadding + this.w - half;
            selectionHandles[7].y = this.y + mySelPadding + this.h - half;
            
            ctx.fillStyle = mySelBoxColor;
            for (var i = 0; i < 8; i++) {
                var cur = selectionHandles[i];
                ctx.fillRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
            }
            if (eraserActive) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            }
            
            deleteImgx = this.x + this.w / 2 - Math.ceil(deleteImg.width / 2);
            deleteImgy = this.y + this.h + mySelPadding * 2;
            ctx.drawImage(deleteImg, deleteImgx, deleteImgy);
        }
    } // end draw
};

// add en element to elements
function addElement(mousedownx, mousedowny, mouseupx, mouseupy, strokesize, strokecolor, fillcolor, shape, obj){
    var el = new Element;
    el.strokesize = strokesize;
    el.strokecolor = strokecolor;
    el.fillcolor = fillcolor;
    el.shape = shape;
    el.obj = obj;
    if (mousedownx <= mouseupx && mousedowny <= mouseupy) {
        el.x = el.new_x = mousedownx - Math.ceil(el.strokesize / 2);
        el.y = el.new_y = mousedowny - Math.ceil(el.strokesize / 2);
        el.w = el.new_w = mouseupx - mousedownx + Math.ceil(el.strokesize / 2) * 2;
        el.h = el.new_h = mouseupy - mousedowny + Math.ceil(el.strokesize / 2) * 2;
    }
    else 
        if (mousedownx > mouseupx && mousedowny <= mouseupy) {
            el.x = el.new_x = mouseupx - Math.ceil(el.strokesize / 2);
            el.y = el.new_y = mousedowny - Math.ceil(el.strokesize / 2);
            el.w = el.new_w = mousedownx - mouseupx + Math.ceil(el.strokesize / 2) * 2;
            el.h = el.new_h = mouseupy - mousedowny + Math.ceil(el.strokesize / 2) * 2;
        }
        else 
            if (mousedownx <= mouseupx && mousedowny > mouseupy) {
                el.x = el.new_x = mousedownx - Math.ceil(el.strokesize / 2);
                el.y = el.new_y = mouseupy - Math.ceil(el.strokesize / 2);
                el.w = el.new_w = mouseupx - mousedownx + Math.ceil(el.strokesize / 2) * 2;
                el.h = el.new_h = mousedowny - mouseupy + Math.ceil(el.strokesize / 2) * 2;
            }
            else {
                el.x = el.new_x = mouseupx - Math.ceil(el.strokesize / 2);
                el.y = el.new_y = mouseupy - Math.ceil(el.strokesize / 2);
                el.w = el.new_w = mousedownx - mouseupx + Math.ceil(el.strokesize / 2) * 2;
                el.h = el.new_h = mousedowny - mouseupy + Math.ceil(el.strokesize / 2) * 2;
            }
    // try {
    // try {
    // var imgd = context.getImageData(el.x, el.y, el.w, el.h);
    // }
    // catch (e) {
    // netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
    // var imgd = context.getImageData(el.x, el.y, el.w, el.h);
    // }
    // } catch (e) {
    // throw new Error("unable to access image data: " + e)
    // }
    el.data = context.getImageData(el.x, el.y, el.w, el.h);
    elements.push(el);
    invalidate();
}