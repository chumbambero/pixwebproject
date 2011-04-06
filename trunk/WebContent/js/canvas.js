// Keep everything in anonymous function, called on window load.
if (window.addEventListener) {
	window
			.addEventListener('load', function() {
				
				dojo.require("dijit.ColorPalette");
				// menu
				dojo.require("dijit.MenuBar");
				dojo.require("dijit.MenuBarItem");
				dojo.require("dijit.PopupMenuBarItem");
				dojo.require("dijit.Menu");
				dojo.require("dijit.MenuItem");
				dojo.require("dijit.PopupMenuItem");
				// dialog
				 dojo.require("dijit.form.Button");
				 dojo.require("dijit.Dialog");
				 dojo.require("dijit.form.TextBox");
				 dojo.require("dijit.form.ValidationTextBox");
				 
				 dojo.require("dijit.form.ComboBox");
				 dojo.require("dojo.data.ItemFileReadStore");
				 
				 dojo.require("dojox.data.GoogleSearchStore");
				
// function initHTML(){
// var content = document.getElementById("pixWeb");
// include(content, "menu_bar.html");
// include(content, "menu.html");
// include(content, "canvas.html");
// include(content, "new_img_form.html");
// include(content, "load_img_form.html");
// include(content, "load_img_url_form.html");
// include(content, "load_img_google_form.html");
// }
				 
				 var canvas, context, canvaso, contexto;

				// The active tool instance.
					var name_default = 'undefined';
					var tool;
					var tool_default = 'rect';
					var color = '#000000';

					function init() {
						// Find the canvas element.
					canvaso = document.getElementById('imageView');
					if (!canvaso) {
						alert('Error: I cannot find the canvas element!');
						return;
					}

					if (!canvaso.getContext) {
						alert('Error: no canvas.getContext!');
						return;
					}

					// Get the 2D canvas context.
					contexto = canvaso.getContext('2d');
					if (!contexto) {
						alert('Error: failed to getContext!');
						return;
					}
					
					document.getElementById("imageName").appendChild(document.createElement("h3"));
					var imageName = document.createTextNode(name_default);
					document.getElementById("imageName").lastChild.appendChild(imageName);

					// Add the temporary canvas.
					var container = canvaso.parentNode;
					canvas = document.createElement('canvas');
					if (!canvas) {
						alert('Error: I cannot create a new canvas element!');
						return;
					}

					canvas.id = 'imageTemp';
					canvas.width = canvaso.width;
					canvas.height = canvaso.height;
					container.appendChild(canvas);

					context = canvas.getContext('2d');

					// Get the tool select input.
					// var tool_select = document.getElementById('dtool');
					// if (!tool_select) {
					// alert('Error: failed to get the dtool element!');
					// return;
					// }
					// tool_select.addEventListener('change', ev_tool_change,
					// false);

					// Activate the default tool.
					if (tools[tool_default]) {
						tool = new tools[tool_default]();
						// tool_select.value = tool_default;
					}

					// Attach the mousedown, mousemove and mouseup event
					// listeners.
					canvas.addEventListener('mousedown', ev_canvas, false);
					canvas.addEventListener('mousemove', ev_canvas, false);
					canvas.addEventListener('mouseup', ev_canvas, false);
				}

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

				// The event handler for any changes made to the tool selector.
				function ev_tool_change(ev) {
					if (tools[this.value]) {
						tool = new tools[this.value]();
					}
				}

				// The event handler for any changes made to the tool selector.
// function ev_color_change(ev) {
// alert(this.value);
// context.strokeStyle = val;
// }

				// This function draws the #imageTemp canvas on top of
				// #imageView, after which
				// #imageTemp is cleared. This function is called each time when
				// the user
				// completes a drawing operation.
				function img_update() {
					contexto.drawImage(canvas, 0, 0);
					context.clearRect(0, 0, canvas.width, canvas.height);
				}

				// //////////////////////////////////////////////////////////////////////////////////////////////
				// MENU BAR
				// //////////////////////////////////////////////////////////////////////////////////////////////
				var pMenuBar;
				dojo.addOnLoad(function() {
					pMenuBar = new dijit.MenuBar( {});
					// ///////////////////////////////////
					// File Menu
					// ///////////////////////////////////
					var pSubMenu = new dijit.Menu( {});
					// New Image
					pSubMenu.addChild(new dijit.MenuItem( {
						label : "New Image",
							}));
					// Load Image
					pSubMenu.addChild(new dijit.MenuItem( {
						label : "Load Image"
					}));
					// Save Image
					pSubMenu.addChild(new dijit.MenuItem( {
						label : "Save Image",
						onClick : function(ev) {
							window.open(canvaso.toDataURL("image/png"));
							ev.preventDefault();
						}
					}));
					pMenuBar.addChild(new dijit.PopupMenuBarItem( {
						label : "File",
						popup : pSubMenu
					}));
					// ///////////////////////////////////
					// Edit Menu
					// ///////////////////////////////////
					var pSubMenu2 = new dijit.Menu( {});
					// Clear Canvas
					pSubMenu2.addChild(new dijit.MenuItem( {
						label : "Clear Canvas",
						onClick : function() {
							contexto.clearRect(0, 0, canvas.width,
									canvas.height);
						}
					}));
					pMenuBar.addChild(new dijit.PopupMenuBarItem( {
						label : "Edit",
						popup : pSubMenu2
					}));

					pMenuBar.placeAt("menuBar");
					pMenuBar.startup();
				});

				// ///////////////////////////////////
				// New Dialog
				// ///////////////////////////////////
				dojo.addOnLoad(function() {
					newDlg = dijit.byId("newDialog");
					dojo.connect(dijit.byId("dijit_MenuItem_0"), "onClick",
							newDlg, "show");
					imgSub = dijit.byId("newSubmit");
					dojo.connect(imgSub, "onClick", function() {
						checkData();
				});
				});

				// This function check if the data in the new image dialog have
				// a correct format
				function checkData() {
					var data = newDlg.attr('value');
					if (!validateNumeric(data.width)) {
						alert(data.width
								+ " for width input is not a valid number");
						return false;
					} else if (!validateNumeric(data.height)) {
						alert(data.height
								+ " for height input is not a valid number");
						return false;
					} else {
						canvas.width = data.width;
						canvas.height = data.height;
						canvaso.width = data.width;
						canvaso.height = data.height;
						document.getElementById("imageName").lastChild.removeChild(document.getElementById("imageName").lastChild.lastChild);
						imageName = document.createTextNode(data.name);
						document.getElementById("imageName").lastChild.appendChild(imageName);
						return true;
					}
				}

				function validateNumeric(strValue) {
					/***********************************************************
					 * DESCRIPTION: Validates that a string contains only valid
					 * numbers.
					 * 
					 * PARAMETERS: strValue - String to be tested for validity
					 * 
					 * RETURNS: True if valid, otherwise false.
					 **********************************************************/
					var objRegExp = /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/;

					// check for numeric characters
					return objRegExp.test(strValue);
				}
				
				// ///////////////////////////////////
				// Load Dialog
				// ///////////////////////////////////
				dojo.addOnLoad(function() {
					loadDlg = dijit.byId("loadDialog");
					dojo.connect(dijit.byId("dijit_MenuItem_1"), "onClick",
							loadDlg, "show");
					dojo.addOnLoad(function() {
						
						var loadSource = new dojo.data.ItemFileReadStore({
				            url: "ComboBoxItems/load.json"
				        });

				        var loadComboBox = dijit.byId("loadComboBox");
				        loadComboBox.setAttribute("name", "loadSource");
				        loadComboBox.setAttribute("value", "URL");
				        loadComboBox.setAttribute("store", loadSource);
				        loadComboBox.setAttribute("searchAttr", "name");
				    });
					loadSub = dijit.byId("loadSubmit");
					dojo.connect(loadSub, "onClick", function() {
						loadNext();
					});
				});
				
				// This function open the url dialog after click on the next
				// butto of the Load Dialog
				function loadNext(){
					var loadComboBoxValue = dijit.byId('loadComboBox').attr('value');
					if(loadComboBoxValue == 'URL'){
						// ///////////////////////////////////
						// Url Dialog
						// ///////////////////////////////////
						urlDlg = dijit.byId("urlDialog");
						urlDlg.show();
						dojo.addOnLoad(function() {
							var urlSource = new dojo.data.ItemFileReadStore({
								url: "ComboBoxItems/url.json"
							});
							var urlComboBox = dijit.byId("urlComboBox");
							urlComboBox.setAttribute("name", "urlSource");
							urlComboBox.setAttribute("value", "Automatically Resizing Image");
							urlComboBox.setAttribute("store", urlSource);
							urlComboBox.setAttribute("searchAttr", "name");
						});
						urlSub = dijit.byId("urlSubmit");
						dojo.connect(urlSub, "onClick", function() {
							urlOk("urlComboBox", urlDlg);
						});
					} 
					else if(loadComboBoxValue == 'Google Image Search'){
						// ///////////////////////////////////
						// Google Dialog
						// ///////////////////////////////////
						googleDlg = dijit.byId("googleDialog");
						googleDlg.show();
						dojo.addOnLoad(function() {
							var googleSource = new dojo.data.ItemFileReadStore({
								url: "ComboBoxItems/url.json"
							});
							var googleComboBox = dijit.byId("googleComboBox");
							googleComboBox.setAttribute("name", "googleSource");
							googleComboBox.setAttribute("value", "Automatically Resizing Image");
							googleComboBox.setAttribute("store", googleSource);
							googleComboBox.setAttribute("searchAttr", "name");
						});
						googleSearch = dijit.byId("googleSearchButton");
						dojo.connect(googleSearch, "onClick", function() {
							doSearch();
						});
						googleSub = dijit.byId("googleSubmit");
						dojo.connect(googleSub, "onClick", function() {
							urlOk("googleComboBox", googleDlg);
						});
					} else {
						alert("Sorry but the selected type of loading is not implemented");
					}
				}
				
				function doSearch() {

			        var store = new dojox.data.GoogleImageSearchStore();
			        var query = {
			            text: dojo.byId("googleSearchInput").value
			        };

			        var callbackFunction = function(items
			        /* Array */
			        ) {

			            var table = dojo.byId("googleResultTable");
			            var tableBody = table.tBodies[0];
			            dojo.empty(tableBody);

			            // Show the table
			            dojo.style(table, "display", "");

			            dojo.forEach(items, function(item, index) {
			            	if(validateImageUrl(store.getValue(item, 'unescapedUrl'))){
			            		var row = dojo.create("tr", {},
			            				tableBody);
			            		
			            		var sizeCell = dojo.create("td", {
			            			innerHTML: store.getValue(item, "width") + "x" + store.getValue(item, "height") + " px",
			            		},
			            		row);
			            		
			            		var imgCell = dojo.create("td", {
			            		},
			            		row);
			            		var link = dojo.create("button", {
			            			target: "_blank",
			            		},
			            		imgCell);
			            		dojo.create("img", {
			            			src: store.getValue(item, "tbUrl")
			            		},
			            		link);
			            		
			            		link.setAttribute("onClick", "dojo.byId('googleTextBox').value = '"+store.getValue(item, 'unescapedUrl')+"'");
			            	}
			                
			            })
			        };

			        var onErrorFunction = function() {
			            alert("An error occurred getting Google Search data");
			        }

			        store.fetch({
			            query: query,
			            count: 50,
			            start: 0,
			            onComplete: callbackFunction,
			            onError: onErrorFunction
			        });

			    }
				
				// This function check if the data in an url input have a
				// correct format
				function urlOk(cbox, dlg){
					var urlTypeValue = dijit.byId(cbox).attr('value');
					if(cbox=="urlComboBox")
						urlTextValue = dlg.attr('value').urlTextBox;
					if(cbox=="googleComboBox")
						urlTextValue = dlg.attr('value').googleTextBox;
					if(validateImageUrl(urlTextValue)){
						var img = new Image();
						img.src = urlTextValue;
						// when image loaded
						img.onload = function() {
							var w = img.width;
							var h = img.height;
							if(w>canvaso.width||h>canvaso.height){
								if(urlTypeValue=="Automatically Resizing Canvas"){
									// make destination have same dimensions as
									// image
									if(w>canvaso.width){
										canvaso.width = w;
										canvas.width = w;
									}
									if(h>canvaso.height){
										canvaso.height = h;
										canvas.height = h;
									}
								}
								else {
									if(w>canvaso.width){
										img.width = canvaso.width;
										img.height = Math.round(h * canvaso.width / w);
										w = img.width;
										h = img.height;
									}
									if(h>canvaso.height){
										img.height = canvaso.height;
										img.width = Math.round(w * canvaso.height / h);
										w = img.width;
										h = img.height;
									}
								}
							}
					        // transfer image to context
					        context.drawImage(img, 0, 0, w, h);
					        img_update();
					     }    
					}
				}
				
				function validateImageUrl(strValue) {
					/***********************************************************
					 * DESCRIPTION: Validates that a string contains only valid
					 * URL for an image.
					 * 
					 * PARAMETERS: strValue - String to be tested for validity
					 * 
					 * RETURNS: True if valid, otherwise false.
					 **********************************************************/
					var objRegExp = new RegExp("^https?://(?:[a-z\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|gif|png)$");

					// check for numeric characters
					return objRegExp.test(strValue);
				}

				// //////////////////////////////////////////////////////////////////////////////////////////////
				// COLOR PALETTE
				// //////////////////////////////////////////////////////////////////////////////////////////////

				dojo.addOnLoad(function() {
					var myPalette = new dijit.ColorPalette( {
						palette : "7x10",
						onChange : function(val) {
							context.strokeStyle = val;
							document.getElementById("selectedColor").setAttribute("style", "background:"+val);
						}
					}, "placeHolder");
				});

				// //////////////////////////////////////////////////////////////////////////////////////////////
				// TOOLS
				// //////////////////////////////////////////////////////////////////////////////////////////////

				// This object holds the implementation of each drawing tool.
				var tools = {};

				// The drawing pencil.
				tools.pencil = function() {
					var tool = this;
					this.started = false;

					// This is called when you start holding down the mouse
					// button.
					// This starts the pencil drawing.
					this.mousedown = function(ev) {
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
						}
					};

					// This is called when you release the mouse button.
					this.mouseup = function(ev) {
						if (tool.started) {
							tool.mousemove(ev);
							tool.started = false;
							img_update();
						}
					};
				};

				// The rectangle tool.
				tools.rect = function() {
					var tool = this;
					this.started = false;

					this.mousedown = function(ev) {
						tool.started = true;
						tool.x0 = ev._x;
						tool.y0 = ev._y;
					};

					this.mousemove = function(ev) {
						if (!tool.started) {
							return;
						}

						var x = Math.min(ev._x, tool.x0), y = Math.min(ev._y,
								tool.y0), w = Math.abs(ev._x - tool.x0), h = Math
								.abs(ev._y - tool.y0);

						context.clearRect(0, 0, canvas.width, canvas.height);

						if (!w || !h) {
							return;
						}

						context.strokeRect(x, y, w, h);
					};

					this.mouseup = function(ev) {
						if (tool.started) {
							tool.mousemove(ev);
							tool.started = false;
							img_update();
						}
					};
				};

				// The line tool.
				tools.line = function() {
					var tool = this;
					this.started = false;

					this.mousedown = function(ev) {
						tool.started = true;
						tool.x0 = ev._x;
						tool.y0 = ev._y;
					};

					this.mousemove = function(ev) {
						if (!tool.started) {
							return;
						}

						context.clearRect(0, 0, canvas.width, canvas.height);

						context.beginPath();
						context.moveTo(tool.x0, tool.y0);
						context.lineTo(ev._x, ev._y);
						context.stroke();
						context.closePath();
					};

					this.mouseup = function(ev) {
						if (tool.started) {
							tool.mousemove(ev);
							tool.started = false;
							img_update();
						}
					};
				};

				function include(element, filename) {
					var txtFile = new XMLHttpRequest();
					var url = "" + window.location;
					var arr = url.split("/");
					url = ""
					for (part in arr) {
						if (arr[part] != "index.html")
							url += arr[part] + "/";
					}
					txtFile.open("GET", url + filename, true);
					txtFile.send(null);
					txtFile.onreadystatechange = function() {
						// Makes sure the document is ready to parse.
						if (txtFile.readyState === 4) {
							// When running the code locally I would get
							// XMLHttpRequest status 0, and XMLHttpRequest
							// statusText unknown.
							// Makes sure it's
							// found the file.
							if (txtFile.status === 200) {
								allText = txtFile.responseText;
								var elementHtml = element.innerHTML;
								element.innerHTML+=elementHtml+allText;
								// element.innerHTML = allText;
								// Will separate each line into an array
								// lines = txtFile.responseText.split("\n");
							}
						}
					}
				}

// initHTML();
				
				init();

			}, false);
}