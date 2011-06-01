/*
 * Copyright (C) 2010, 2011 Alessandro Trombini
 *
 * This file is part of PixWeb.
 */

/**
 * @author Alessandro Trombini
 */

// The general-purpose event handler. This function just
// determines the mouse
// position relative to the canvas element.
function ev_canvas(ev) {
	if (ev.layerX || ev.layerX == 0) { // Firefox
		ev._x = ev.layerX;
		ev._y = ev.layerY;
	} else if (ev.offsetX || ev.offsetX == 0) { // Opera
		ev._x = ev.offsetX;
		ev._y = ev.offsetY;
	}

	// Call the event handler of the tool.
	var func = tool[ev.type];
	if (func) {
		func(ev);
	}
}

// The event handler for any changes made to the color stroke
// selector.
function ev_colorStroke_click(ev) {
	if (fillColorSelected) {
		colorFill.removeAttribute("class");
		colorStroke.setAttribute("class", "selected");
		fillColorSelected = false;
		strokeColorSelected = true;
	}
}

// The event handler for any changes made to the color fill
// selector.
function ev_colorFill_click(ev) {
	if (strokeColorSelected) {
		colorStroke.removeAttribute("class");
		colorFill.setAttribute("class", "selected");
		strokeColorSelected = false;
		fillColorSelected = true;
	}
}

function ev_tool_change(value) {
	if (tools[value]) {
		tool = new tools[value]();
		if (selected_tool == 'pointer' && (!eraserActive)) {
			pointerButton.attr('disabled', false);
		} else if (selected_tool == 'pencil') {
			pencilButton.attr('disabled', false);
		} else if (selected_tool == 'brush') {
			brushButton.attr('disabled', false);
		} else if (selected_tool == 'line') {
			lineButton.attr('disabled', false);
		} else if (selected_tool == 'rect') {
			rectangleButton.attr('disabled', false);
		} else if (selected_tool == 'circle') {
			circleButton.attr('disabled', false);
		} else if (selected_tool == 'ellipse') {
			ellipseButton.attr('disabled', false);
		} else if (selected_tool == 'text') {
			textButton.attr('disabled', false);
		}
		if (value == 'pointer' || (selected_tool == 'brush' && eraserActive)) {
			pointerButton.attr('disabled', true);
		} else if (value == 'pencil') {
			pencilButton.attr('disabled', true);
		} else if (value == 'brush' && (!eraserActive)) {
			brushButton.attr('disabled', true);
		} else if (value == 'line') {
			lineButton.attr('disabled', true);
		} else if (value == 'rect') {
			rectangleButton.attr('disabled', true);
		} else if (value == 'circle') {
			circleButton.attr('disabled', true);
		} else if (value == 'ellipse') {
			ellipseButton.attr('disabled', true);
		} else if (value == 'text') {
			textButton.attr('disabled', true);
		}
		selected_tool = value;
	}
}