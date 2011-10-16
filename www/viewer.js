/*
 * Various forest viewer widgets and utilities.
 *
 * Copyright (C) 2009  Andrzej Zaborowski
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

/*
 * Forest utilities
 *
 * Forest is generally defined as a set / list of trees.  For forests
 * that are results of syntactic analysis, this definition is broader
 * than necessary.
 *
 * Here, a forest is a special kind of graph similar to a tree although
 * slightly different.  Like a tree, it is a directed acyclic graph
 * with a special element called the root.  Instead of a single list
 * of children, each non-leaf node can have many lists of children,
 * specifically a non-empty set of lists of children.  No node can appear
 * more than once on one list, but it can appear on multiple lists of
 * chilren a single parent node, or of different parents.
 *
 * Each node has a start and end corresponding to the phrase's beginning
 * and ending in the parsed text.  The start-end intervals of nodes
 * on any children list sum up to the parent's start-end interval and
 * can't overlap between the children on one list.
 *
 * Nodes have multiple lists of children where there is ambiguity in
 * the derivation of the phrase because more than one grammar rule
 * could be applied.  Nodes have multiple parents where the same
 * derivation of a subphrase is used in different possible derivations
 * of a higher-level construct.  A leaf always represents a terminal
 * node and a non-terminal symbol is represented by an internal node.
 */
function forest(nodes, root) {
	var q = [ root ];

	var ndmap = {};
	for (var nid in nodes)
		if ("nid" in nodes[nid])
			ndmap[nodes[nid].nid] = nodes[nid];
		else
			ndmap[nid] = nodes[nid];

	this.nodes = {};

	while (q.length) {
		var nid = q.shift();
		if (nid in this.nodes)
			continue;
		this.nodes[nid] = new forestnode(ndmap[nid], nid);

		if (this.nodes[nid].terminal || this.nodes[nid].leaf)
			continue;
		for (var rnum in this.nodes[nid].children) {
			var chlist = this.nodes[nid].children[rnum].child;
			for (var chnum in chlist)
				if (typeof(chlist[chnum]) == 'object')
					q.push(chlist[chnum].nid);
				else
					q.push(chlist[chnum]);
		}
	}

	this.root = this.nodes[root];

	this.root.set_default_tree(this, {});
}

forest.prototype.get_depth = function() {
	return this.root.get_depth();
}

function forestnode(inputnode, nid) {
	this.nid = nid;

	for (var prop in inputnode)
		if (prop[0] != '#')
			this[prop] = inputnode[prop];

	if (!("attrs" in this))
		this.attrs = this.nonterminal ? this.nonterminal :
			(this.terminal ? this.terminal : {});
	if (!("attrs_order" in this)) {
		this.attrs_order = [];
		for (var attr in this.attrs)
			this.attrs_order.push(attr);
	}

	if (this.terminal && this.terminal.length)
		this.terminal = this.terminal[0];

	if (!("space" in this))
		this.space = 0.0;

	if (this.terminal || this.leaf) {
		this.leaf = true;
		if (!this.terminal || !('subtrees' in this) ||
				this.subtrees == 1)
			return;

		throw "Wrong subtrees number at a leaf " +
			this.label + " with nid " + this.nid;
	}

	if (!this.children)
		throw "Non-leaf node with no children found: " +
			this.label + ", nid " + this.nid;

	if ("child" in this.children)
		this.children = [ this.children ];
	else if (typeof(this.children[0]) == "string" &&
			(this.children.length & 1) == 0) {
		var chld = this.children;
		this.children = [];
		for (var i = 0; i < chld.length; i += 2)
			this.children.push({ rule: chld[i],
					child: chld[i + 1] });
	} else if (!this.children.length)
		throw "Non-leaf with no children found: " +
			this.label + ", nid " + this.nid;
	for (var i in this.children) {
		for (var p in this.children[i])
			if (p[0] == "#")
				delete this.children[i][p];
		if ("nid" in this.children[i].child ||
				typeof(this.children[i].child) == 'number' ||
				typeof(this.children[i].child) == 'string')
			this.children[i].child = [ this.children[i].child ];
		if (typeof(this.children[i].child[0]) != 'number' &&
				typeof(this.children[i].child[0]) != 'string' &&
				!("nid" in this.children[i].child[0]))
			throw "Bad children list in node " + this.nid;
	}
}

forestnode.prototype.get_depth = function(nidmap) {
	var max = 0;
	var map = nidmap;

	if (nidmap == null)
		map = {};

	if (!this.leaf) {
		for (var chlistnum in this.children) {
			var chlist = this.children[chlistnum].child;
			for (var chnum in chlist) {
				var chdepth;
				if (chlist[chnum].nid in map)
					chdepth = map[chlist[chnum].nid];
				else
					chdepth = chlist[chnum].get_depth(map);
				if (chdepth > max)
					max = chdepth;
			}
		}
	}

	return map[this.nid] = max + 1;
}

forestnode.prototype.get_min_depths = function() {
	var q = [ this ];
	var map = {};
	map[this.nid] = 0;

	while (q.length) {
		var nd = q.shift();

		for (var chlistnum in nd.children) {
			var chlist = nd.children[chlistnum].child;
			for (var chnum in chlist) {
				if (chlist[chnum].nid in map)
					continue;
				map[chlist[chnum].nid] = map[nd.nid] + 1;
				if (chlist[chnum].leaf)
					continue;
				q.push(chlist[chnum]);
			}
		}
	}

	return map;
}

/*
 * Viewer
 */
function forestviewer(element) {
	this.display = element;
	this.location = "";
	this.data = "";
	this.tips = {};
	this.rules = {};
	this.helper = {};

	var reccheck = 0;
	this.watch("location", function(prop, oldval, newval) {
			this.unload();

			if (!newval.length)
				return newval;

			this.display.innerHTML = "Loading the forest...";
			var this_obj = this;
			if (request_forest(newval, function(r) {
						if (reccheck)
							return;
						reccheck ++;
						this_obj.load(r);
						reccheck --;
					}, function(err) {
						this_obj.location = "";
						this_obj.display.innerHTML =
							err;
					}))
				return newval;

			return oldval;
		});

	this.watch("data", function(prop, oldval, newval) {
			if (reccheck)
				return newval;
			reccheck ++;

			this.unload();

			if (!newval) {
				reccheck --;
				return newval;
			}

			this.display.innerHTML = "Loading the forest...";
			this.load(newval);

			reccheck --;
			return newval;
		});

	this.watch("forest", function(prop, oldval, newval) {
			if (reccheck)
				return newval;
			reccheck ++;

			this.unload();

			if (!newval) {
				reccheck --;
				return newval;
			}

			this.display.innerHTML = "Loading the forest...";
			this.showforest(newval);

			reccheck --;
			return newval;
		});

	this.watch("nodevisible", function(prop, oldval, newval) {
			this.isnodevisible = newval;
			this.relayout();
			return newval;
		});

	if (!document.getElementById("generalinfo")) {
		var info = document.createElement("div");
		info.id = "generalinfo";
		this.display.offsetParent.appendChild(info);
	}

	this.general = document.getElementById("generalinfo");
	this.popup = document.getElementById("generalinfo");

	this.borderwidth = 0;
	this.style = "default";

	/* We overwrite user's settings.  This is because there's no way
	 * to easily retrieve actual client area size with padding on, in DOM,
	 * without rewriting part of the rendering engine... with no padding,
	 * clientWidth (in pixels) == style.width and children absolute
	 * position are relative to clientLeft.  Not knowing that, we
	 * would need to create another div inside this.display and make
	 * sure it has no non-default style set with .style.cssText = ""
	 * perhaps? */
	this.display.style.padding = "0px";
	this.display.style.margin = "0px";
}

var forests = [];
var forest_id = 0;
forestviewer.prototype.unload = function() {
	this.anim_cancel();

	if (this.helper.before_unload)
		this.helper.before_unload(this);

	if (this.blackboard) {
		this.blackboard.removeChild(this.image);
		this.display.removeChild(this.blackboard);
		if (this.ruler)
			this.display.removeChild(this.ruler);

		if (this.startnode)
			this.startnode.hide(this);

		/* Unref */
		delete this["image"];
		delete this["blackboard"];
		if (this.ruler)
			delete this["ruler"];
	}

	if (this.id in forests)
		delete forests[this.id];
	if (this.startnode)
		delete this["startnode"];
	if (this.nodes)
		delete this["nodes"];
	if (this.forest)
		delete this["forest"];

	this.popup_hide();

	/* TODO: detach */
}

forestviewer.prototype.init_ui = function() {
	this.widths = new Array(this.startnode.to);
	this.columns = new Array(this.startnode.to + 1);
	/* For now all columns have equal widths */

	for (var i = this.startnode.from; i < this.startnode.to; i ++)
		this.widths[i] = 1.0;

	this.columns[this.startnode.from] = 0;
	for (var i = this.startnode.from + 1; i <= this.startnode.to; i ++)
		this.columns[i] = this.columns[i - 1] + this.widths[i - 1];

	this.graph_ns = "http://www.w3.org/2000/svg";

	this.blackboard = document.createElement("div");
	this.image = document.createElementNS(this.graph_ns, "svg");
	this.blackboard.className = "blackboard";
	this.blackboard.style.position = "absolute";
	if (!this.noruler) {
		this.ruler = document.createElement("div");
		this.ruler.className = "ruler ruler-" + this.style;
		this.ruler.style.position = "absolute";
	}

	var ncsty = null;
	try {
		if ("style" in this)
			ncsty = get_style(".nodecircle-" + this.style).style;
	} catch(e) {
		try {
			ncsty = get_style(".nodecircle").style;
		} catch(e) {}
	}
	var scale = ncsty == null ? "1" : ncsty.width;
	if (scale.ends_in("%"))
		this.scale = this.display.clientWidth * parseInt(scale) * 0.01;
	else
		this.scale = parseInt(scale);
	this.nodeheight = 50.0 / this.scale;

	this.nodebgcolour = ncsty == null ? "white" : ncsty.backgroundColor;

	var this_obj = this;
	attach(this.nativescroll ? this.blackboard : this.display, "mousedown",
			function(evt) { this_obj.down(evt); }, true);
	attach(document, "mouseup",
			function(evt) { this_obj.up(evt); }, false);
	attach(document, "mousemove",
			function(evt) { this_obj.move(evt); }, false);

	var separators = "() ,:;[]";
	var this_obj = this;
	this.add_attr_spans = function(container, attr, value) {
		var str = "";
		var prev = -1;
		var add = function(txt, re) {
			str = "";

			var span = document.createElement("span");
			span.innerHTML = txt.to_xml_safe();

			container.appendChild(span);

			if (prev != -1 && prev != false)
				return;

			/* TODO: replace all chars with \\xXY ?
			 * Note we can't use \\b because non-ASCII letters
			 * are incorrectly treated as non-word characters.
			 */
			if (re[1])
				re[1] = new RegExp("([\\[\\( ,:;]|^)" +
						re[1].replace(/\./g, "\\.") +
						"([\\]\\[\\(\\) ,:;]|$)");
			attach(span, "mouseover", function(evt) {
						this_obj.highlight(re);
						span.style.color = "white";
					}, false);
			attach(span, "mouseout", function(evt) {
						this_obj.highlight([ "" ]);
						span.style.color = "";
					}, false);
		}

		if (value == undefined)
			add(attr, [ attr, "" ], true);
		else {
			for (var c = 0; c < value.length; c ++) {
				var sep = separators.indexOf(value[c]) > -1;
				if (sep != prev && prev != -1)
					add(str, [ attr, str ]);
				prev = sep;
				str += value[c];
			}
			add(str, [ attr, str ]);
		}
	}

	this.html_left = 0;
	this.html_top = 0;

	/* Should not matter */
	this.image.setAttributeNS(null, "preserveAspectRatio", "none");

	this.startnode.update_children(this);
	this.startnode.update_depth();
	this.startnode.place(0, this);

	this.step = 100;
	this.anim_update();

	this.show();

	this.blackboard.appendChild(this.image);
	this.display.innerHTML = "";
	this.display.appendChild(this.blackboard);
	if (this.ruler)
		this.display.appendChild(this.ruler);

	/* TODO: must do this whenever this.display is resized
	 * (must also adjust this.html_left, this.html_top) */
	this.rulerheight = (this.ruler ? this.ruler.offsetHeight : 0);
	if (!this.fixed_height) {
		var voffset = this.display.offsetHeight -
			this.display.clientHeight - this.borderwidth;
		this.display.style.height = (this.html_height +
				this.rulerheight + voffset) + "px";
	}
	this.visibleheight = this.display.scrollHeight - this.rulerheight;
	if (this.ruler)
		this.ruler.style.top = this.visibleheight + "px";
	/* Note ruler must have no margin and blackboard must have no
	 * margin padding or border for that to work. */

	if (this.variablewidth) {
		for (var i = this.startnode.from; i <= this.startnode.to; i ++)
			this.columns[i] = 0;
		if (!("horiz_space" in this))
			this.horiz_space = 10;
		this.startnode.relayout(this);
		this.startnode.update_depth();
		/* TODO: only until relayout learns setting x1 */
		this.startnode.place(0, this);
		this.step = 100;
		this.anim_update();
		this.show(this);
	}

	this.recenter();

	this.id = forest_id ++;
	forests[this.id] = this;

	if (this.helper.after_loaded)
		this.helper.after_loaded(this);
}

forestviewer.prototype.recenter = function() {
	/* Center */
	if (this.html_width < this.display.clientWidth) {
		this.html_left = (this.display.clientWidth -
				this.html_width) / 2;
		this.update_viewbox(0);
	}
}

forestviewer.prototype.showforest = function(input) {
	this.unload();

	if (this.nativescroll)
		this.display.style.overflow = "auto";
	else
		this.display.style.overflow = "hidden";

	if (!input.forest && input.packet && input.packet.name) {
		var menu = "<h2>Packet " + input.packet.name.to_xml_safe() +
			"</h2> contains:<br /><p>\n";

		if (input.packet.forest)
			for (var fnum in input.packet.forest) {
				forest = input.packet.forest[fnum];
				/* TODO: use onclick to set location */
				menu += "<a href=\"" +
					window.location.pathname + "?" +
					forest.file + "\">Forest " +
					forest.file.to_xml_safe() +
					"</a><br />\n";
			}

		menu += "</p>";
		this.display.innerHTML = menu;

		return;
	}

	if (this.helper.prepare)
		this.helper.prepare(input);

	var forest = input;
	if (input.forest)
		forest = input.forest;

	if (this.popup_on_init)
		this.set_general_info(forest);
	this.forest = forest; /* TODO: recurse check */
	this.nodes = forest.nodes;
	this.startnode = forest.root;

	/* From here on, we should be independent of input format */

	this.init_ui();
}

forestviewer.prototype.load = function(input) {
	if (this.nativescroll) /* TODO: move to stylesheet? */
		this.display.style.overflow = "auto";
	else
		this.display.style.overflow = "hidden";

	if (!input.forest && input.packet && input.packet.name) {
		var menu = "<h2>Packet " + input.packet.name.to_xml_safe() +
			"</h2> contains:<br /><p>\n";

		if (input.packet.forest)
			for (var fnum in input.packet.forest) {
				forest = input.packet.forest[fnum];
				/* TODO: use onclick to set location */
				menu += "<a href=\"" +
					window.location.pathname + "?" +
					forest.file + "\">Forest " +
					forest.file.to_xml_safe() +
					"</a><br />\n";
			}

		menu += "</p>";
		this.display.innerHTML = menu;

		return;
	}

	if (this.helper.prepare)
		this.helper.prepare(input);

	if ("forest" in input)
		input = input.forest;
	if (!input.stats || !input.text) {
		this.location = "";
		this.display.innerHTML = "Couldn't parse input";
		return;
	}

	if ("from" in input.node)
		input.node = [ input.node ]; /* Ugly work-around */

	if (!input.startnode || !parseInt(input.stats.trees)) {
		this.display.innerHTML = "";
		return;
	}

	if (!input.startnode.label)
		input.startnode.label = input.startnode["#text"];

	/* Locate the start node */
	var startnid = null;
	var newforest;

	try {
		for (var nnum in input.node) {
			var node = input.node[nnum];
			if (node.nonterminal && node.nonterminal.category ==
					input.startnode.label &&
					node.from == input.startnode.from &&
					node.to == input.startnode.to) {
				if (startnid != null)
					throw "multiple start nodes present";

				startnid = nnum;
			}
		}

		if (startnid == null)
			throw "no start nodes present";

		newforest = new forest(input.node, startnid);
	} catch (e) {
		this.display.innerHTML = "Can't parse: " + e;
		return;
	}

	this.unload();

	if (this.popup_on_init)
		this.set_general_info(newforest);
	this.forest = newforest; /* TODO: recurse check */
	this.nodes = newforest.nodes;
	this.startnode = newforest.root;

	/* From here on, we should be independent of input format */

	this.init_ui();
}

forestviewer.prototype.show = function() {
	this.treeheight = this.nodeheight *
		(this.startnode.depth[1] + this.startnode.depth[3] * 0.5);

	var svg_left = this.columns[this.startnode.from];
	var svg_right = this.columns[this.startnode.to];
	var svg_top = 0;
	var svg_bottom = this.treeheight;

	this.html_width = this.scale *
		(this.columns[this.startnode.to] -
		 this.columns[this.startnode.from]);
	this.html_height = svg_bottom * this.scale;

	this.image.style.width = Math.round(this.html_width) + "px";
	this.image.style.height = Math.round(this.html_height) + "px";
	this.update_viewbox(1);
	this.image.setAttributeNS(null, "viewBox", "" +
			svg_left + " " + svg_top + " " +
			(svg_right - svg_left) + " " +
			(svg_bottom - svg_top));

	if (this.ruler)
		this.startnode.show_ruler(this); /* TODO: only when needed! */
	this.startnode.show(this);

	if (this.rulerheight) {
		var voffset = this.display.offsetHeight -
			this.display.clientHeight - this.borderwidth;
		if (!this.fixed_height)
			this.display.style.height = (this.html_height +
					this.rulerheight + voffset) + "px";
		// TODO: fix fixed_height upstream
		this.visibleheight = this.html_height;
		this.ruler.style.top = this.visibleheight + "px";
	}
}

forestviewer.prototype.anim_update = function() {
	/* TODO: add inertia? */
	var p = 100.0 - this.step;
	p *= p * 0.0001;
	p = 1.0 - p;

	function node_done(node) {
		node.x = node.x1;
		node.y = node.y1;
		node.animating = 0;

		for (var chnum in node.current_children)
			node_done(node.current_children[chnum]);
	}

	function node_update(node) {
		if (node.animating)
			node.opacity = "" + p;

		/* Seems more stable than x1 * p + x0 * (1 - p) */
		node.x = node.x0 + (node.x1 - node.x0) * p;
		node.y = node.y0 + (node.y1 - node.y0) * p;

		for (var chnum in node.current_children)
			node_update(node.current_children[chnum]);
	}

	if (this.step < 100)
		node_update(this.startnode);
	else
		node_done(this.startnode);

	this.anim_timer = null;
	if (this.step < 100)
		this.anim_sched();
}

forestviewer.prototype.anim_cancel = function() {
	if (this.anim_timer) { /* Note: racy */
		clearTimeout(this.anim_timer);
		this.anim_timer = null;
	}
}

forestviewer.prototype.anim_sched = function() {
	this.anim_cancel();

	var this_obj = this;
	this_obj.anim_timer = setTimeout(function() {
			this_obj.step += 10;
			this_obj.anim_update();
			this_obj.show(); }, 50);
}

forestviewer.prototype.anim_start = function() {
	function node_update(node) {
		node.x0 = node.x;
		node.y0 = node.y;

		for (var chnum in node.current_children)
			node_update(node.current_children[chnum]);
	}

	this.anim_cancel();
	node_update(this.startnode);

	this.step = 0;
	this.anim_sched();
}

forestviewer.prototype.update_viewbox = function(size, x, y) {
	if (x == null)
		x = this.html_left;
	if (y == null)
		y = this.html_top;

	this.blackboard.style.left = Math.round(x) + "px";
	this.blackboard.style.top = Math.round(y) + "px";
	if (this.ruler)
		this.ruler.style.left = this.blackboard.style.left;
	if (size) {
		this.blackboard.style.width =
			Math.round(this.html_width) + "px";
		this.blackboard.style.height =
			Math.round(this.html_height) + "px";
		if (this.ruler)
			this.ruler.style.width = this.blackboard.style.width;
	}
}

forestviewer.prototype.popup_show = function(style, x, y) {
	if (x == null)
		x = this.display.offsetLeft + "px";
	else
		x = Math.round(this.display.offsetLeft +
				this.display.clientLeft -
				this.display.scrollLeft +
				this.html_left + x * this.scale) + "px";
	if (y == null)
		y = "30%"
	else
		y = Math.round(this.display.offsetTop +
				this.display.clientTop -
				this.display.scrollTop +
				this.html_top + y * this.scale) + "px";

	this.popup.style.position = "absolute";
	this.popup.style.left = x;
	this.popup.style.top = y;
	this.popup.className = style;
	this.popup.style.visibility = "visible";
	this.popped = true;
}

forestviewer.prototype.popup_hide = function() {
	this.popped = false;
	if (this.popup)
		this.popup.style.visibility = "hidden";
}

forestviewer.prototype.popup_update = function() {
	this.popped = this.popup.style.visibility == "visible";
}

forestviewer.prototype.set_general_info = function(forest) {
	this.general.innerHTML = "<p>The input was \"" +
		forest.text.to_xml_safe() + "\".</p>\n";
	this.general.innerHTML += "<p>Processing took " +
		("" + forest.stats.cputime).to_xml_safe() + " seconds.</p>\n";
	if (forest.stats.trees > 1)
		this.general.innerHTML += "<p>" +
			forest.stats.trees + " trees generated.</p>\n";
	else if (forest.stats.trees == 1)
		this.general.innerHTML += "<p>Parser produced a single " +
			"tree.</p>\n";
	else
		this.general.innerHTML += "<p>Parsing failed.</p>\n";

	this.general.innerHTML += "<p><a href=\"#\">Tree View</a> | " +
			"<a href=\"#\">Spreadsheet View</a></p>\n";

	this.popup_show("general");
}

forestviewer.prototype.down = function(evt) {
	if (evt.preventDefault)
		evt.preventDefault();
	else
		evt.returnValue = false;

	this.popup_update();
	this.pop = !this.over && !this.popped;
	if (this.over && !this.popped) {
		clearTimeout(this.over.popup_timer);
		this.timeout();
	} else if (this.popped)
		this.popup_hide();

	this.down_x = parseInt(evt.pageX);
	this.down_y = parseInt(evt.pageY);
	if (this.nativescroll) {
		this.down_scrollx = this.display.scrollLeft;
		this.down_scrolly = this.display.scrollTop;
	}

	this.moving = true;
}

forestviewer.prototype.up = function(evt) {
	if (!this.moving)
		return;
	this.moving = false;

	var dx = parseInt(evt.pageX) - this.down_x;
	var dy = parseInt(evt.pageY) - this.down_y;

	if ((dx == 0 && dy > -2 && dy < 2) || (dy == 0 && dx > -2 && dx < 2)) {
		if (this.pop && this.popup_on_init)
			this.set_general_info(this.forest);
		return;
	}

	if (this.nativescroll) {
		this.display.scrollLeft = this.down_scrollx - dx;
		this.display.scrollTop = this.down_scrolly - dy;
		return;
	}

	this.html_left += dx;
	this.html_top += dy;

	if (this.html_left < this.display.clientWidth - this.html_width)
		this.html_left = this.display.clientWidth - this.html_width;
	if (this.html_top < this.visibleheight - this.html_height)
		this.html_top = this.visibleheight - this.html_height;

	if (this.html_width < this.display.clientWidth)
		this.html_left = (this.display.clientWidth -
				this.html_width) / 2;
	else if (this.html_left > 0)
		this.html_left = 0;
	if (this.html_top > 0)
		this.html_top = 0;

	this.update_viewbox();
}

forestviewer.prototype.move = function(evt) {
	if (evt.preventDefault)
		evt.preventDefault();
	else
		evt.returnValue = false;

	if (!this.moving)
		return;

	var x = parseInt(evt.pageX);
	var y = parseInt(evt.pageY);

	if (this.nativescroll) {
		this.display.scrollLeft = this.down_scrollx - (x - this.down_x);
		this.display.scrollTop = this.down_scrolly - (y - this.down_y);
		return;
	}

	x = this.html_left + x - this.down_x;
	y = this.html_top + y - this.down_y;

	if (x < this.display.clientWidth - this.html_width)
		x = this.display.clientWidth - this.html_width;
	if (y < this.visibleheight - this.html_height)
		y = this.visibleheight - this.html_height;

	if (this.html_width < this.display.clientWidth)
		x = (this.display.clientWidth - this.html_width) / 2;
	else if (x > 0)
		x = 0;
	if (y > 0)
		y = 0;

	this.update_viewbox(0, x, y);
}

/* TODO: this needs to do the fade-in for new nodes and move the
 * existing ones .  */
forestviewer.prototype.relayout = function(nofade) {
	var pos = {};

	if (!this.forest)
		return;

	this.anim_update();
	this.anim_cancel();
	/* (Race) */

	this.startnode.hide(this);

	function node_save_pos(node) {
		pos[node.nid] = 1;

		for (var chnum in node.current_children)
			node_save_pos(node.current_children[chnum]);
	}
	node_save_pos(this.startnode);

	this.startnode.update_children(this);
	this.startnode.update_depth();
	this.startnode.place(0, this);

	function node_update(node) {
		if (!(node.nid in pos)) {
			/* TODO */
			node.x = node.x1;
			node.y = node.y1;
		}
		if (!nofade || (node.nid in pos)) {
			node.animating = 1;
			node.opacity = "0";
		}

		for (var chnum in node.current_children)
			node_update(node.current_children[chnum]);
	}
	node_update(this.startnode);

	if (this.variablewidth) {
		this.columns[this.startnode.from] = 0;
		for (var i = this.startnode.from + 1;
				i <= this.startnode.to; i ++)
			this.columns[i] = this.columns[i - 1] +
					this.widths[i - 1];
	}

	this.anim_start();
	this.show();

	if (this.variablewidth) {
		/* TODO: needs to be animated */
		for (var i = this.startnode.from; i <= this.startnode.to; i ++)
			this.columns[i] = 0;
		this.startnode.relayout(this);
		this.startnode.place(0, this);
		this.anim_update();
		this.show();
	}
}

forestviewer.prototype.highlight = function(re) {
	for (var forest in forests)
		forests[forest].startnode.highlight(re, this);
}

forestviewer.prototype.add_tips = function(tips) {
	/*this.tips = this.tips.concat(tips);*/
	for (var tip in tips)
		this.tips[tip] = tips[tip];
}

forestviewer.prototype.add_rules = function(rules) {
	var re = /s\([a-z0-9_]+\)/;
	for (var i in rules) {
		var matches = rules[i].match(re);
		if (!matches)
			continue;
		var pos = rules[i].indexOf("s(");
		var end = rules[i].substr(pos).indexOf(")");
		if (pos > -1 && end > -1)
			this.rules[rules[i].substr(pos + 2, end - 2)] =
				rules[i];
	}
}

forestviewer.prototype.get_html = function() {
	return this.display.innerHTML;
}

/*
 * Forest node
 */
forestnode.prototype.set_default_tree = function(forest, done) {
	if (this.nid in done)
		return;
	done[this.nid] = true;

	if (!("current" in this))
		this.current = 0;

	if (this.leaf)
		return;

	var children = this.children;
	if (forest.copy)
		this.children = [];
	for (var rulenum in children) {
		var child = children[rulenum].child;

		/* Note: could convert node.children to a rule => child
		 * dictionary?  */
		if (child.nid)
			child = children[rulenum].child = [ child ];

		if (forest.copy)
			this.children[rulenum] = {
				heads: children[rulenum].heads,
				rule: children[rulenum].rule,
				"child": [] };

		for (var chnum in child) {
			var nid = child[chnum];
			if (typeof(nid) == "object" && "nid" in nid)
				nid = nid.nid;
			if (!(nid in forest.nodes))
				throw "Referred node " + nid + " not found";

			var subnode = forest.nodes[nid];
			this.children[rulenum].child[chnum] = subnode;
			subnode.set_default_tree(forest, done);
		}
	}
}

forestnode.prototype.update_children = function(viewer) {
	if (this.leaf) {
		this.current_children = [];
		return;
	}

	var children = [];
	var heads = [];
	var orig_heads = this.children[this.current].heads == undefined ?
			[] : this.children[this.current].heads;
	for (var chnum in this.children[this.current].child) {
		var child = this.children[this.current].child[chnum];
		var visible = true;

		child.update_children(viewer);

		if (viewer.isnodevisible)
			visible = viewer.isnodevisible(child, this);

		if (orig_heads.indexOf(parseInt(chnum)) > -1) {
			if (visible)
				heads.push(children.length);
			else
				for (var headnum in child.current_heads)
					heads.push(children.length +
						child.current_heads[headnum]);
		}

		if (visible)
			children.push(child);
		else
			children = children.concat(child.current_children);
	}
	this.current_children = children;
	this.current_heads = heads;
}

forestnode.prototype.update_depth = function() {
	var space = (this.hidden ? 0 : this.elem_space ?
			this.elem_space : 0.5) + this.space;
	if (this.leaf) {
		if (this.incomplete)
			space += 0.6;
		this.depth = [ space, space + 0.2, space, 0 ]; /* Hack (0.2) */
		return;
	}

	this.depth = [ 0x1000, -1, space, -1 ]
	for (var chnum in this.current_children) {
		var subnode = this.current_children[chnum];

		subnode.update_depth();

		if (subnode.depth[0] + space < this.depth[0])
			this.depth[0] = subnode.depth[0] + space;
		if (subnode.depth[1] + space > this.depth[1])
			this.depth[1] = subnode.depth[1] + space;
		if (subnode.depth[3] + 1 > this.depth[3])
			this.depth[3] = subnode.depth[3] + 1;
	}
}

/* TODO: rename these two as horiz layout and vert layout */
forestnode.prototype.place = function(y, viewer) {
	var height = viewer.nodeheight * 0.5;

	this.x1 = (viewer.columns[this.from] + viewer.columns[this.to]) * 0.5;
	this.y1 = y * viewer.nodeheight + height * 0.5;
	if (this.hidden) {
		if (this.terminal)
			/* Hidden terminals are at ruler cells */
			this.y1 = viewer.nodeheight *
				(viewer.startnode.depth[1] +
					viewer.startnode.depth[3] * 0.5);
		else
			this.y1 -= height;
	}

	y += this.depth[2] + (viewer.startnode.depth[1] +
			viewer.startnode.depth[3] * 0.5 - y -
			this.depth[1]) / this.depth[3];
	for (var chnum in this.current_children)
		this.current_children[chnum].place(y, viewer);
}

/* A smarter version of this could have different width spaces between
 * columns, basically there would be a left x and right x value for
 * every column and some smarter logic.. (various possible things to do
 * there.)  */
forestnode.prototype.relayout = function(viewer) {
	/* Note this assumes left-to-right order */
	for (var chnum in this.current_children)
		this.current_children[chnum].relayout(viewer);

	if (!this.elem && !this.ruler)
		return;

	var subwidth = viewer.columns[this.to] - viewer.columns[this.from];
	var width = this.elem ? this.elem.offsetWidth : 0;
	if (this.ruler) {
		var rwidth = this.ruler_span.offsetWidth;
		if (rwidth > width)
			width = rwidth;
	}
	width += viewer.horiz_space; /* TODO: should use a css property */
	width = width * 1.0 / viewer.scale;

	if (this.elem && this.elem_space == undefined)
		this.elem_space = this.elem.offsetHeight / viewer.scale /
			viewer.nodeheight;

	if (subwidth >= width)
		return;
	if (subwidth < 0.001) {
		viewer.columns[this.to] = viewer.columns[this.from] + width;
		return;
	}

	for (var c = this.from + 1; c <= this.to; c ++)
		viewer.columns[c] = viewer.columns[this.from] +
			(viewer.columns[c] - viewer.columns[this.from]) *
			width / subwidth;
}

forestnode.prototype.update_info = function(onover, onout, onwheel, viewer) {
	var text = this.terminal ? "\"" + this.terminal.base + "\"" :
			this.nonterminal.category;
	this.info.innerHTML = "";

	this.elem = document.createElement("span");
	this.elem.innerHTML = text.to_xml_safe();
	this.elem.className =
		this.terminal ? "terminal-node" : "nonterminal-node";

	this.info.appendChild(this.elem);
	attach(this.elem, "mouseover", onover, false);
	attach(this.elem, "mouseout", onout, false);

	if (!this.children)
		return;

	var rulename = "";
	if (this.children[this.current].rule)
		rulename = this.children[this.current].rule.to_xml_safe();

	/* TODO: use images */
	//var left = this.current ? "&lt;" : " ";
	//var right = this.current < this.children.length - 1 ? "&gt;" : " ";

	var rule = document.createElement("span");
	rule.className = "rule rule-" + viewer.style;
	//rule.innerHTML = left + " " + rulename + " " + right;
	rule.innerHTML = rulename + " ";
	this.info.appendChild(document.createElement("br"));
	this.info.appendChild(rule);

	if (this.children.length > 1) {
		var this_obj = this;

		var left = document.createElement("div");
		left.className = "switcher-left";
		left.onclick = function(evt) {
			if (this_obj.current)
				this_obj.switch_subtree(-1, viewer);
		};

		var right = document.createElement("div");
		right.className = "switcher-right";
		right.onclick = function(evt) {
			if (this_obj.current < this_obj.children.length - 1)
				this_obj.switch_subtree(1, viewer);
		};

		var switcher = document.createElement("span");
		switcher.appendChild(left);
		for (var rulenum = 0; rulenum < this.children.length;
				rulenum ++) {
			var mid = document.createElement("div");
			mid.className = (rulenum == this.current) ?
				"switcher-current" : "switcher-middle";
			mid.rulenum = rulenum;
			mid.onclick = function(evt) {
				this_obj.switch_subtree(this.rulenum -
						this_obj.current, viewer);
			};

			switcher.appendChild(mid);
		}
		switcher.appendChild(right);

		rule.appendChild(switcher);
		rule.title = "Użyj kółka myszy aby wybrać inne poddrzewo."
	}

	attach(rule, "DOMMouseScroll", onwheel, false);
}

forestnode.prototype.highlight = function(re, viewer) {
	if (this.graph) {
		/* TODO: Use stylesheet classes instead */
		var match = this.attrs[re[0]] && this.attrs[re[0]].match(re[1]);
		/*this.elem.style.color = match ? "white" : "black";*/
		this.graph.setAttributeNS(null, "stroke-width",
				match ? 0.05 : 0);
	}

	if (this.elem) {
		var match = this.attrs[re[0]] && this.attrs[re[0]].match(re[1]);
		if (match && !this.orig_class) {
			this.orig_class = this.elem.className;
			this.elem.className += " highlighted-node " +
					"highlighted-node-" + viewer.style;
		} else if (!match && this.orig_class) {
			this.elem.className = this.orig_class;
			delete this.orig_class;
		}
	}

	for (var chnum in this.current_children)
		this.current_children[chnum].highlight(re, viewer);
}

var separators = "() ,:;[]";
forestnode.prototype.popup_fill = function(viewer) {
	viewer.popup.innerHTML = "";

	for (var num in this.attrs_order) {
		var name = this.attrs_order[num];

		viewer.add_attr_spans(viewer.popup, name);
		viewer.popup.appendChild(document.createTextNode(": "));

		viewer.add_attr_spans(viewer.popup, name, this.attrs[name]);
		viewer.popup.appendChild(document.createElement("br"));
	}

	if (viewer.helper.popup_info) {
		var userinfo = document.createElement("div");
		viewer.helper.popup_info(this, userinfo, viewer);
		viewer.popup.appendChild(userinfo);
		return;
	}

	if (this.leaf)
		return;

	for (var i in viewer.tips) {
		var match = 0;
		for (var j in viewer.tips[i])
			if (viewer.tips[i][j] == this.nonterminal.category)
				match = 1;
		if (!match)
			continue;

		var tip = document.createElement("p");
		tip.className = "tip";
		tip.innerHTML = i.to_xml_safe();
		viewer.popup.appendChild(tip);
		break;
	}

	if (!this.children || !this.children[this.current].rule)
		return;

	if (!(this.children[this.current].rule in viewer.rules))
		return;
	var rule = viewer.rules[this.children[this.current].rule];
	var pre = document.createElement("pre");
	pre.innerHTML = rule.to_xml_safe();
	viewer.popup.appendChild(pre);
}

/* TODO: this needs to be handled more generically */
function node_orth(node) {
	if (node.terminal)
		return node.terminal.orth;

	var chld = node.children[0].child;
	var orth = "";
	for (var chnum in chld) {
		var sub = node_orth(chld[chnum]);
		if (".,".indexOf(sub[0]) == -1 && orth)
			orth += " ";
		orth += sub;
	}
	return orth;
}

forestnode.prototype.show_ruler = function(viewer) {
	if (this.leaf) {
		var left = Math.round(viewer.columns[this.from] * viewer.scale);
		var right = Math.round(viewer.columns[this.to] * viewer.scale);
		if (!this.ruler) {
			this.ruler = document.createElement("div");
			this.ruler.className = "lexeme lexeme-" + viewer.style;
			this.ruler.style.position = "absolute";

			this.ruler_span = document.createElement("span");
			if (viewer.helper.update_ruler_info)
				viewer.helper.update_ruler_info(this);
			else
				this.ruler_span.innerHTML =
					node_orth(this).to_xml_safe();

			this.ruler.appendChild(this.ruler_span);
			viewer.ruler.appendChild(this.ruler);
		}

		this.ruler.style.left = left + "px";
		this.ruler.style.width = (right - left) + "px";

		return;
	}

	for (var chnum in this.current_children)
		this.current_children[chnum].show_ruler(viewer);
}

forestnode.prototype.show_default = function(viewer) {
	/* Note: all the constants in this function are arbitrary numbers
	 * taken out of thin air.  Change them to try to improve the
	 * tree's appearance.  */
	var maxwidth = viewer.columns[this.to] - viewer.columns[this.from];
	var width = maxwidth * 0.9;
	var height = viewer.nodeheight * 0.5;

	if (!this.graph && !this.hidden) {
		this.graph = document.createElementNS(viewer.graph_ns,
				"ellipse");
		this.graph.setAttributeNS(null, "stroke-width", 0);
		this.graph.setAttributeNS(null, "stroke", "black");
		this.graph.setAttributeNS(null, "fill", viewer.nodebgcolour);

		viewer.image.appendChild(this.graph);
	}
	if (this.graph) {
		this.graph.setAttributeNS(null, "cx", this.x);
		this.graph.setAttributeNS(null, "cy", this.y);
		this.graph.setAttributeNS(null, "rx", width * 0.5);
		this.graph.setAttributeNS(null, "ry", height * 0.5);
	}

	if (!this.info && !this.hidden) {
		this.info = document.createElement("div");
		this.info.className = "nodelabel nodelabel-" + viewer.style;
		this.info.style.position = "absolute";

		var this_obj = this;
		var onafter = function() {
			this_obj.popup_timer = null;
			this_obj.popup_fill(viewer);

			viewer.popup_show(this_obj.terminal ? "terminal" :
					"nonterminal", this_obj.x, this_obj.y);
		}
		var onover = function(evt) {
			viewer.over = this_obj;
			if (this.moving)
				return;

			viewer.timeout = onafter;
			this_obj.popup_timer = setTimeout(onafter, 1000);
		}
		var onout = function(evt) {
			viewer.over = null;
			if (!this_obj.popup_timer)
				return;

			clearTimeout(this_obj.popup_timer);
			this_obj.popup_timer = null;
		}
		var onwheel = function(evt) {
			this_obj.wheel(evt, viewer);
		}
		var onswitch = function(d) {
			this_obj.switch_subtree(d, viewer);
		}
		var onresize = function() {
			this_obj.resize_commit(viewer);
		}
		if (viewer.helper.update_node_info)
			viewer.helper.update_node_info(this, onover, onout,
				onwheel, onswitch, onresize,
				viewer.add_attr_spans, function() {
					viewer.over = null;
					viewer.popup_hide();
				});
		else
			this.update_info(onover, onout, onwheel, viewer);

		viewer.blackboard.appendChild(this.info);
	}
	if (this.info) {
		this.info.style.left =
			Math.round((this.x - maxwidth * 0.5) *
				viewer.scale) + "px";
		this.info.style.top =
			Math.round((this.y - height * 0.3) *
				viewer.scale) + "px";
		this.info.style.width =
			Math.round(maxwidth * viewer.scale) + "px";
		this.info.style.height =
			Math.round(viewer.nodeheight * ((this.elem_space ?
						this.elem_space + 0.5 : 1) +
					this.space) * viewer.scale) + "px";
		if (this.opacity)
			this.info.style.opacity = this.opacity;

		if (viewer.helper.update_node_pos)
			viewer.helper.update_node_pos(this, viewer);
	}

	if (this.leaf) {
		/* TODO: set position */
		if (this.incomplete && !this.decoration) {
			this.decoration = new Array();
			var y = this.y + (this.elem_space ? this.elem_space +
					0.1 : 0.3) * viewer.nodeheight;
			for (var i = 0; i < 6; i ++) {
				var w = 0.05 / (i + 1);
				var x = width * (0.2 + 0.035 * i);
				var deco = document.createElementNS(
						viewer.graph_ns, "line");

				y += w * 0.5;
				deco.setAttributeNS(null, "stroke-width", w);
				deco.setAttributeNS(null, "fill", "none");
				deco.setAttributeNS(null, "stroke",
						viewer.nodebgcolour);
				deco.setAttributeNS(null, "x1", this.x - x);
				deco.setAttributeNS(null, "y1", y);
				deco.setAttributeNS(null, "x2", this.x + x);
				deco.setAttributeNS(null, "y2", y);
				y += w * 0.5 + 0.015;

				viewer.image.appendChild(deco);
				this.decoration.push(deco);
			}
		}
		return;
	}
	if (this.current_children.length == 0)
		return;

	var left = 0;
	var right = 0;

	for (var chnum in this.current_children) {
		if (this.current_children[chnum].x > this.x + 0.01)
			right ++;
		if (this.current_children[chnum].x < this.x - 0.01)
			left ++;
	}

	var yoff = this.current_children[0].y - this.y;
	var xs = -left; /* TODO: assumes left-to-right iteration */
	var ys = 0;
	if (left > right &&
		left + right < this.current_children.length)
		xs ++;
	else if (left == right &&
		left + right == this.current_children.length)
		xs += 0.5;
	for (var chnum in this.current_children) {
		var child = this.current_children[chnum];
		child.show(viewer);

		var xoff = child.x - this.x;
		if (xoff > 0.01)
			ys =-- right;

		var x0 = xs * 0.07;
		var x1 = xoff * 0.45;
		var x2 = xoff * 0.92;
		var x3 = xoff * 0.98;
		var y0 = height * 0.4;
		var y1 = height * 0.15 + ys * 0.03;
		var y2 = height * 0.2 + ys * 0.03;
		var y3 = viewer.nodeheight * 0.45 - y2 - y1;
		var y4 = yoff - height;

		var path =
			/* First move a little straight south */
			"0," + y1 + " " +
			/* Then turn in the direction of child node */
			(x1 - x0) + "," + y2 + " " +
			/* Now we should be just above it, turn down again */
			(x2 - x1) + "," + y3 + " " + (x3 - x2) + "," + y4;

		if (Math.abs(x3 - x0) < Math.abs(y2))
			path = "0," + y1 + " " +
				(x3 - x0) + "," + (y2 + y3 + y4);

		if (!child.link) {
			child.link = document.createElementNS(viewer.graph_ns,
					"path");
			child.link.setAttributeNS(null, "stroke-width", 0.05);
			child.link.setAttributeNS(null, "fill", "none");
			child.link.setAttributeNS(null, "stroke",
					viewer.nodebgcolour);

			viewer.image.appendChild(child.link);

			if (this.current_heads.indexOf(parseInt(chnum)) > -1) {
				child.linkhead = document.createElement("div");
				child.linkhead.className = "head";
				child.linkhead.style.position = "absolute";
				child.linkhead.innerHTML = "&#9660;";
				viewer.blackboard.appendChild(child.linkhead);
/*				child.link.setAttributeNS(null,
						"id", "w" + child.nid);
				child.linkhead = document.createElementNS(
						viewer.graph_ns, "text");
				child.linkhead.setAttributeNS(null,
						"fill", "black");
				child.linkhead.setAttributeNS(null,
						"font-size", "20");
				child.linkhead.setAttributeNS(null,
						"font-family", "Verdana");

				var tp = document.createElementNS(
						viewer.graph_ns, "textPath");
				tp.setAttributeNS(
						"http://www.w3.org/1999/xlink",
						"xlink:href", "#w" + child.nid);
				tp.appendChild(document.createTextNode(
						"Hello!&#9664;"));
				child.linkhead.appendChild(tp);

				viewer.image.appendChild(child.linkhead);
*/
			}
		}

		child.link.setAttributeNS(null, "d", "M" +
			/* Start shifted in the direction of the child node */
			(this.x + x0) + "," + (this.y + y0) + " t" + path);

		//	/* Start shifted in the direction of the child node */
		//	(this.x + xoff * 0.1) + "," + (this.y + height * 0.2) +
		//	/* First move a little straight south */
		//	" t" + (xoff * 0.1) + "," + (height * 0.3) + " " +
		//	/* Then turn in the direction of child node (horiz) */
		//	(xoff * 0.4) + "," + (viewer.nodeheight * 0.2) + " " +
		//	/* Now we should be just above it, turn down again */
		//	(xoff * 0.35) + "," + (viewer.nodeheight * 0.25));

		if (child.linkhead) {
			child.linkhead.style.left =
				Math.round((child.x - 0.2) *
					viewer.scale) + "px";
			child.linkhead.style.top =
				Math.round((child.y - height) *
					viewer.scale) + "px";
			child.linkhead.style.width =
				Math.round(viewer.scale * 0.4) + "px";
		}

		if (xoff < -0.01)
			ys += 1.0;
		xs += 1.0;
	}
}

forestnode.prototype.show_simple = function(viewer) {
	/* Note: all the constants in this function are arbitrary numbers
	 * taken out of thin air.  Change them to try to improve the
	 * tree's appearance.  */
	var maxwidth = viewer.columns[this.to] - viewer.columns[this.from];
	var width = maxwidth * 0.9;
	if (width < 0.9)
		width = maxwidth;
	var height = viewer.nodeheight * 0.5;

	if (!this.info && !this.hidden) {
		this.info = document.createElement("div");
		this.info.className = "nodelabel nodelabel-" + viewer.style;
		this.info.style.position = "absolute";

		var this_obj = this;
		var onafter = function() {
			this_obj.popup_timer = null;
			this_obj.popup_fill(viewer);

			viewer.popup_show(this_obj.terminal ? "terminal" :
					"nonterminal", this_obj.x, this_obj.y);
		}
		var onover = function(evt) {
			viewer.over = this_obj;
			if (this.moving)
				return;

			viewer.timeout = onafter;
			this_obj.popup_timer = setTimeout(onafter, 1000);
		}
		var onout = function(evt) {
			viewer.over = null;
			if (!this_obj.popup_timer)
				return;

			clearTimeout(this_obj.popup_timer);
			this_obj.popup_timer = null;
		}
		var onwheel = function(evt) {
			this_obj.wheel(evt, viewer);
		}
		var onswitch = function(d) {
			this_obj.switch_subtree(d, viewer);
		}
		var onresize = function() {
			this_obj.resize_commit(viewer);
		}
		if (viewer.helper.update_node_info)
			viewer.helper.update_node_info(this, onover, onout,
				onwheel, onswitch, onresize,
				viewer.add_attr_spans, function() {
					viewer.over = null;
					viewer.popup_hide();
				});
		else
			this.update_info(onover, onout, onwheel, viewer);

		viewer.blackboard.appendChild(this.info);
	}
	if (this.info) {
		this.info.style.left =
			Math.round((this.x - maxwidth * 0.5) *
				viewer.scale) + "px";
		this.info.style.top =
			Math.round((this.y - height * 0.3) *
				viewer.scale) + "px";
		this.info.style.width =
			Math.round(maxwidth * viewer.scale) + "px";
		this.info.style.height =
			Math.round(viewer.nodeheight * ((this.elem_space ?
						this.elem_space + 0.5 : 1) +
					this.space) * viewer.scale) + "px";
		if (this.opacity)
			this.info.style.opacity = this.opacity;
	}

	if (this.leaf) {
		if (this.incomplete && !this.decoration) {
			this.decoration = new Array();
			for (var i = 0; i < 6; i ++) {
				var deco = document.createElementNS(
						viewer.graph_ns, "line");

				deco.setAttributeNS(null, "fill", "none");
				deco.setAttributeNS(null, "stroke",
						viewer.nodebgcolour);

				viewer.image.appendChild(deco);
				this.decoration.push(deco);
			}
		}
		if (this.decoration) {
			var y = this.y + (this.elem_space ? this.elem_space -
					0.1 : 0.4) * viewer.nodeheight;
			var deco_height = 0.05;
			var break_height = 0.015;
			var max_height = viewer.treeheight - y;
			var h = 0;
			for (var i = 0; i < this.decoration.length; i ++)
				h += deco_height / (i + 1);
			var maxh = max_height - break_height *
				this.decoration.length;
			if (h < maxh) {
				var half = (maxh - h) * 0.5;
				deco_height *= (h + half) / h;
				break_height += half / this.decoration.length;
			}
			for (var i = 0; i < this.decoration.length; i ++) {
				var w = deco_height / (i + 1);
				var x = width * (0.2 + 0.04 * i);

				y += w * 0.5;
				var deco = this.decoration[i];
				deco.setAttributeNS(null, "stroke-width", w);
				deco.setAttributeNS(null, "x1", this.x - x);
				deco.setAttributeNS(null, "y1", y);
				deco.setAttributeNS(null, "x2", this.x + x);
				deco.setAttributeNS(null, "y2", y);
				y += w * 0.5 + break_height;
			}
		}
		return;
	}

	var ch = this.current_children;
	var midy = viewer.treeheight;
	for (var chnum in ch)
		if (ch[chnum].y < midy)
			midy = ch[chnum].y;
	midy = (midy + this.y) * 0.5;

	for (headnum in this.current_heads) {
		var child = ch[this.current_heads[headnum]];
		if (child.headlink)
			continue;

		child.headlink = document.createElementNS(
				viewer.graph_ns, "path");
		child.headlink.setAttributeNS(null, "stroke-width", 0.15);
/*		child.headlink.setAttributeNS(null,
				"stroke-dasharray", "0.1,0.1"); */
		child.headlink.setAttributeNS(null, "fill", "none");
		child.headlink.setAttributeNS(null, "stroke", "#cccccc");
		child.headlink.setAttributeNS(null, "stroke-linejoin", "round");

/*		child.linkhead = document.createElement("div");
		child.linkhead.className = "head";
		child.linkhead.style.position = "absolute";
		child.linkhead.innerHTML = "&#9660;";
		viewer.blackboard.appendChild(child.linkhead); */

		/* Must be added first to stay at the bottom */
		viewer.image.appendChild(child.headlink);
	}
	for (var chnum in ch) {
		var child = ch[chnum];
		child.show(viewer);

		if (!child.link) {
			child.link = document.createElementNS(viewer.graph_ns,
					"path");
			child.link.setAttributeNS(null, "stroke-width", 0.016);
			child.link.setAttributeNS(null, "fill", "none");
			child.link.setAttributeNS(null, "stroke",
					viewer.nodebgcolour);

			viewer.image.appendChild(child.link);
		}

		child.link.setAttributeNS(null, "d",
			"M" + this.x + "," + this.y +
			" V" + midy +
			" H" + child.x +
			" V" + child.y);

		if (child.linkhead) {
			child.linkhead.style.left =
				Math.round((child.x - 0.2) *
					viewer.scale) + "px";
			child.linkhead.style.top =
				Math.round((child.y - height) *
					viewer.scale) + "px";
			child.linkhead.style.width =
				Math.round(viewer.scale * 0.4) + "px";
		}

		if (child.headlink) {
			child.headlink.setAttributeNS(null, "d",
				"M" + this.x + "," + this.y +
				" V" + midy +
				" H" + child.x +
				" V" + child.y);
		}
	}
}

forestnode.prototype.set_style = function(viewer) {
	var style = viewer.style;

	if (style == undefined || !(("show_" + style) in forestnode.prototype))
		style = "default";

	this.show = forestnode.prototype["show_" + style];
	this.show(viewer);
}
forestnode.prototype.show = forestnode.prototype.set_style;

forestnode.prototype.hide = function(viewer) {
	if (this.graph) {
		viewer.image.removeChild(this.graph);
		delete this["graph"];
	}

	if (this.link) {
		viewer.image.removeChild(this.link);
		delete this["link"];

		if (this.linkhead) {
			viewer.blackboard.removeChild(this.linkhead);
			delete this["linkhead"];
		}
		if (this.headlink) {
			viewer.image.removeChild(this.headlink);
			delete this["headlink"];
		}
	}

	if (this.decoration) {
		for (var i in this.decoration)
			viewer.image.removeChild(this.decoration[i]);
		delete this["decoration"];
	}

	if (this.info) {
		viewer.blackboard.removeChild(this.info);
		delete this["elem"];
		if (this.rule)
			delete this["rule"];
		delete this["info"];
	}

	if (this.ruler) {
		viewer.ruler.removeChild(this.ruler);
		delete this["ruler"];
		delete this["ruler_span"];
	}

	if ("show" in this)
		delete this["show"];

	for (var chnum in this.current_children)
		this.current_children[chnum].hide(viewer);
}

forestnode.prototype.nopopup = function() {
	forest.over = null;
}

forestnode.prototype.wheel = function(evt, viewer) {
	if (evt.preventDefault)
		evt.preventDefault();
	else
		evt.returnValue = false;

	var delta = 0;
	if (!evt)		/* For IE. */
		evt = window.event;
	if (evt.wheelDelta) {	/* IE/Opera. */
		delta = evt.wheelDelta / 120;
		if (window.opera)
			delta = delta * 2;
	} else if (evt.detail)	/* Mozilla case. */
		delta = -evt.detail / 3;

	if (delta < 0 && this.current < this.children.length - 1)
		this.switch_subtree(1, viewer);
	else if (delta > 0 && this.current)
		this.switch_subtree(-1, viewer);
}

forestnode.prototype.switch_subtree = function(d, viewer) {
	var newsubtree = this.current + d;

	viewer.anim_update();
	viewer.anim_cancel();
	/* (Race) */

	this.hide(viewer);
	this.current = newsubtree;

	viewer.startnode.update_children(viewer);
	viewer.startnode.update_depth();
	viewer.startnode.place(0, viewer);

	function node_update(node) {
		node.x = node.x1;
		node.y = node.y1;
		if (node.nid != this.nid) {
			node.opacity = "0";
			node.animating = 1;
		}

		for (var chnum in node.current_children)
			node_update(node.current_children[chnum]);
	}
	node_update(this);

	if (viewer.variablewidth) {
		viewer.columns[viewer.startnode.from] = 0;
		for (var i = viewer.startnode.from + 1;
				i <= viewer.startnode.to; i ++)
			viewer.columns[i] = viewer.columns[i - 1] +
					viewer.widths[i - 1];
	}

	viewer.anim_start();
	viewer.show();

	if (viewer.variablewidth) {
		/* TODO: needs to be animated */
		for (var i = viewer.startnode.from; i <= viewer.startnode.to;
				i ++)
			viewer.columns[i] = 0;
		viewer.startnode.relayout(viewer);
		viewer.startnode.place(0, viewer);
		viewer.anim_update();
		viewer.show();
	}
}

forestnode.prototype.resize_commit = function(viewer) {
	viewer.anim_update();
	viewer.anim_cancel();
	/* (Race) */

	delete this.elem_space;
	this.relayout(viewer);

	viewer.startnode.update_depth();
	viewer.startnode.place(0, viewer);

	if (viewer.variablewidth) {
		viewer.columns[viewer.startnode.from] = 0;
		for (var i = viewer.startnode.from + 1;
				i <= viewer.startnode.to; i ++)
			viewer.columns[i] = viewer.columns[i - 1] +
					viewer.widths[i - 1];
	}

	viewer.anim_start();
	viewer.show();

	if (viewer.variablewidth) {
		/* TODO: needs to be animated */
		for (var i = viewer.startnode.from; i <= viewer.startnode.to;
				i ++)
			viewer.columns[i] = 0;
		viewer.startnode.relayout(viewer);
		viewer.startnode.place(0, viewer);
		viewer.anim_update();
		viewer.show();
	}
}

/*
 * Syntactic spreadsheets
 */
function synspreadviewer(element) {
	this.display = element;
	this.data = "";

	this.watch("forest", function(prop, oldval, newval) {
			this.unload();

			if (!newval)
				return newval;

			this.display.innerHTML = "Loading the forest...";
			this.load(newval);
			return newval;
		});

	this.isnodevisible = this.nodevisible = function(x) { return true; };
	this.watch("nodevisible", function(prop, oldval, newval) {
			this.isnodevisible = newval;
			if (this.forest)
				this.relayout();
			return newval;
		});

	this.ismergeable = this.nodemergeable = function(x) { return false; };
	this.watch("nodemergeable", function(prop, oldval, newval) {
			this.ismergeable = newval;
			if (this.forest)
				this.relayout();
			return newval;
		});

	this.terminals = this.showterminals = true;
	this.watch("showterminals", function(prop, oldval, newval) {
			this.terminals = newval;
			if (this.forest)
				this.relayout();
			return newval;
		});

	this.nonterminals = this.shownonterminals = true;
	this.watch("shownonterminals", function(prop, oldval, newval) {
			this.nonterminals = newval;
			if (this.forest)
				this.relayout();
			return newval;
		});

	this.maxtrees = this.maxtreecount = 32;
	this.watch("maxtreecount", function(prop, oldval, newval) {
			this.maxtrees = newval;
			if (this.forest)
				this.relayout();
			return newval;
		});

	this.watch("cellfill_fn", function(prop, oldval, newval) {
			this.cellfill = newval;
			if (this.forest)
				this.relayout();
			return newval;
		});

	this.showtbrulers = true;

	/* We overwrite user's settings.  This is because there's no way
	 * to easily retrieve actual client area size with padding on, in DOM,
	 * without rewriting part of the rendering engine... with no padding,
	 * clientWidth (in pixels) == style.width and children absolute
	 * position are relative to clientLeft.  Not knowing that, we
	 * would need to create another div inside this.display and make
	 * sure it has no non-default style set with .style.cssText = ""
	 * perhaps? */
	this.display.style.padding = "0px";
	this.display.style.margin = "0px";
}

synspreadviewer.prototype.load = function(forest) {
	var row;

	this.unload();

	this.display.innerHTML = "";

	this.footer = document.createElement("div");
	this.header = document.createElement("div");
	this.leftruler = document.createElement("div");
	this.rightruler = document.createElement("div");
	this.blackboard = document.createElement("div");
	this.footer.style.position = "absolute";
	this.header.style.position = "absolute";
	this.leftruler.style.position = "absolute";
	this.rightruler.style.position = "absolute";
	this.blackboard.style.position = "absolute";
	this.footer.style.overflow = "hidden";
	this.header.style.overflow = "hidden";
	this.leftruler.style.overflow = "hidden";
	this.rightruler.style.overflow = "hidden";
	this.display.style.overflow = "hidden";

	if (this.showtbrulers) {
		this.display.appendChild(this.header);
		this.display.appendChild(this.footer);
	}
	this.display.appendChild(this.leftruler);
	this.display.appendChild(this.rightruler);
	this.display.appendChild(this.blackboard);

	this.current = forest;
	this.relayout();
}

synspreadviewer.prototype.unload = function() {
	this.destroy_cells();
	if (this.blackboard) {
		this.display.removeChild(this.blackboard);
		if (this.showtbrulers) {
			this.display.removeChild(this.header);
			this.display.removeChild(this.footer);
		}
		this.display.removeChild(this.leftruler);
		this.display.removeChild(this.rightruler);
		delete this.blackboard;
		delete this.header;
		delete this.footer;
		delete this.leftruler;
		delete this.rightruler;
	}
	delete this.nidmap;
	delete this.treecount;
	delete this.treelist;
}

synspreadviewer.prototype.relayout = function() {
	if (!this.current)
		return;

	this.destroy_cells();
	this.make_cells();
	this.update_selection();
	this.update_sizes();
}

/* Assign cell positions to nodes, handle merged nodes, tree counting etc */
synspreadviewer.prototype.recalc_stats = function() {
	/* Some parent nodes may be merged into a single cell with
	 * their only child and grand child and so on, if they form an
	 * uninteresting sequence (e.g. no branches, no ambiguity and
	 * same or similar morphologic/syntactic attributes).  We can't
	 * merge nodes that have multiple parents in the forest (appear
	 * in multiple subforests) with their parents however, so we
	 * find them and count the parents.  */
	this.parents = {};
	var this_obj = this;
	var countparents = function(node) {
		if (node.nid in this_obj.parents) {
			this_obj.parents[node.nid] ++;
			return;
		}
		this_obj.parents[node.nid] = 1;
		for (var rulenum in node.children) {
			var chld = node.children[rulenum].child;
			for (var chnum in chld)
				countparents(chld[chnum]);
		}
	}
	countparents(this.current.root);

	/* For each node count the number of possible subtrees rooted
	 * there.  The complexity is O(n).  */
	this.subtrees = {};
	var countsubtrees = function(node) {
		if (node.nid in this_obj.subtrees)
			return this_obj.subtrees[node.nid];
		if (node.leaf)
			return this_obj.subtrees[node.nid] = 1;
		this_obj.subtrees[node.nid] = 0;
		for (var rulenum in node.children) {
			var chld = node.children[rulenum].child;
			var subs = 1;
			for (var chnum in chld)
				subs *= countsubtrees(chld[chnum]);
			this_obj.subtrees[node.nid] += subs;
		}
		return this_obj.subtrees[node.nid];
	}
	countsubtrees(this.current.root);

	/* For each node count the actual individual trees containing
	 * that node.  This is tricky and the solution given here is
	 * quite complex just to keep the complexity linear relative
	 * to the number of nodes in forests where nodes have many
	 * parents.  */
	this.treecount = {};
	var q0 = [ this.current.root.nid ];
	var q = {};
	var othertrees = {};
	othertrees[this.current.root.nid] = 1;
	while (q0.length) {
		var node = this.current.nodes[q0.shift()];

		this.treecount[node.nid] =
			this.subtrees[node.nid] * othertrees[node.nid];

		if (node.leaf)
			continue;

		for (var rulenum in node.children) {
			var chld = node.children[rulenum].child;
			var trees = 1;
			for (var chnum in chld)
				trees *= this.subtrees[chld[chnum].nid];
			for (var chnum in chld) {
				var subnid = chld[chnum].nid;
				var othersubtrees =
					trees / this.subtrees[subnid] *
					othertrees[node.nid];
				if (!(subnid in q)) {
					q[subnid] = this.parents[subnid];
					othertrees[subnid] = 0;
				}
				q[subnid] --;
				othertrees[subnid] += othersubtrees;
				if (!q[subnid]) {
					delete q[subnid];
					q0.push(subnid);
				}
			}
		}
	}
	for (var nid in q)
		throw "Not all nodes of the forest could be processed " +
			"when counting trees -- likely bad topology.";

	/* Generate the first this.maxtrees indivitual tree numbers for
	 * each node of the forest.  This also decides the order of
	 * trees.  The complexity should be O(n * this.maxtrees), but
	 * it's a little hard to see and the constant factors are
	 * certainly high.  This part needs more thought.. (TODO)  */
	this.treelist = {};
	var done = {};
	var listtrees = function(node, gettreeid, othertrees) {
		if (node.nid in done)
			return;

		if (!(node.nid in this_obj.treelist))
			this_obj.treelist[node.nid] = [];
		var list = this_obj.treelist[node.nid];
		var subs = this_obj.subtrees[node.nid];
		var localid = 0;

		while (list.length < this_obj.maxtrees) {
			var a = localid % subs;
			var b = (localid - a) / subs;
			var newtreeid = gettreeid(a, b);
			if (newtreeid < 0)
				break;
			list.push(newtreeid);
			localid ++;
		}

		if (node.leaf) {
			if (list.length >= this_obj.maxtrees)
				done[node.nid] = true;
			return;
		}

		var startid = 0;
		var thisdone = list.length >= this_obj.maxtrees;
		for (var rulenum in node.children) {
			var chld = node.children[rulenum].child;
			var trees = 1;
			var denom = 1;
			var modulo = 1;
			for (var chnum in chld)
				trees *= this_obj.subtrees[chld[chnum].nid];
			for (var chnum in chld) {
				var subnid = chld[chnum].nid;
				var subsubs = this_obj.subtrees[subnid];

				modulo *= subsubs;

				var fun = function(a, b) {
					var c = b % denom;
					var x = a * denom + c +
						(b - c) * subsubs;
					a = x % trees;
					b = (x - a) / trees;
					return gettreeid(startid + a, b);
				}

				var othersubtrees = /* Currently unused */
					trees / subsubs * othertrees;
				listtrees(chld[chnum], fun, othersubtrees);

				denom *= subsubs;

				if (!(subnid in done))
					thisdone = false;
			}
			startid += trees;
		}
		if (thisdone)
			done[node.nid] = true;
	}
	listtrees(this.current.root, function(a, b) { return b ? -1 : a; }, 1);
}

synspreadviewer.prototype.recalc_positions = function() {
	this.nidmap = {};
	var allcols = {};
	var tcols = {};
	var mcols = {};
	var this_obj = this;
	var calcrow = function(node, parent) {
		if (node.nid in this_obj.nidmap)
			return;

		if (!node.leaf)
			for (var rulenum in node.children) {
				var chld = node.children[rulenum].child;
				for (var chnum in chld)
					calcrow(chld[chnum], node);
			}

		if (!this_obj.terminals && node.terminal)
			return;
		if (!this_obj.nonterminals && node.nonterminal)
			return;

		if (this_obj.isnodevisible &&
				!this_obj.isnodevisible(node, parent))
			return;
		if (this_obj.ismergeable && !node.leaf &&
				node.children.length == 1 &&
				node.children[0].child.length == 1) {
			var ch = node.children[0].child[0];
			if (ch.from == node.from && ch.to == node.to &&
					!ch.terminal &&
					this_obj.parents[ch.nid] == 1 &&
					this_obj.ismergeable(ch, node)) {
				this_obj.nidmap[node.nid] =
					this_obj.nidmap[ch.nid];
				return;
			}
		}

		var cols = node.terminal ? tcols : mcols;
		var min = -1;

		/* Find a free row in the spreadsheet */
		for (var pos = node.from; pos < node.to; pos ++)
			if (pos in cols && cols[pos] > min)
				min = cols[pos];
		var row = min + 1;

		/* Mark it as occupied */
		for (var pos = node.from; pos < node.to; pos ++)
			cols[pos] = row;
		this_obj.nidmap[node.nid] = row;
	}
	calcrow(this.current.root, null);

	/* Place all the non-terminals below the last terminal */
	var min = 0;
	for (var pos in tcols)
		if (tcols[pos] >= min)
			min = tcols[pos] + 1;
	for (var nid in this.nidmap)
		if (!this.current.nodes[nid].terminal)
			this.nidmap[nid] += min;
	this.termrows = min;
}

synspreadviewer.prototype.make_cells = function(single) {
	/* For now do this once.  TODO: do this always, and only, when the
	 * the forest is changed, do it in the forest class.  */
	if (!this.treelist)
		this.recalc_stats();
	this.recalc_positions();

	var allcols = {};
	for (var nid in this.nidmap) {
		var nd = this.current.nodes[nid];
		allcols[nd.from] = 1;
		allcols[nd.to] = 1;
	}
	var cols = [];
	for (var pos in allcols)
		cols.push(pos);
	cols.sort(function(x, y) { return x - y });
	this.pos_to_col = {};
	for (var pos in cols)
		this.pos_to_col[cols[pos]] = parseInt(pos);

	this.rows = [];
	this.single_column_nodes = {};
	for (var nid in this.nidmap) {
		while (this.nidmap[nid] >= this.rows.length)
			this.rows.push(new Array(cols.length));

		var nd = this.current.nodes[nid];
		var from = this.pos_to_col[nd.from];
		var to = this.pos_to_col[nd.to];
		var row = this.rows[this.nidmap[nid]];

		if (nd.to == cols[from + 1] && allcols[nd.from] == 1) {
			allcols[nd.from] = node_orth(nd);
			this.single_column_nodes[from] = nid;
		}

		if (!(from in row))
			row[from] = [];
		row[from].push(nd);
	}

	this.cellid = {};
	this.rowid = [];
	var tcid = 1;
	var ntcid = 1;

	this.table = document.createElement("table");
	this.table.className = "synspreadviewer-table";
	for (var rownum = 0; rownum < this.rows.length; rownum ++) {
		this.rowid.push(rownum < this.termrows ?
				"T." + (rownum + 1) :
				("M." + (rownum + 1 - this.termrows)));

		var row = this.table.insertRow(-1);
		for (var col = 0; col < cols.length - 1; col ++) {
			var cell = row.insertCell(-1);
			var nds = this.rows[rownum][col];
			if (nds == undefined)
				continue;

			var cid;
			if (nds[0].terminal)
				cid = "T-" + (tcid ++);
			else
				cid = "M-" + (ntcid ++);
			for (var nnum in nds)
				this.cellid[nds[nnum].nid] = cid;

			var from = this.pos_to_col[nds[0].from];
			var to = this.pos_to_col[nds[0].to];

			cell.colSpan = "" + (to - from);
			cell.className = nds[0].terminal ?
				"synspreadviewer-terminal" :
				"synspreadviewer-nonterminal";

			if (this.cellfill) {
				this.cellfill(cell, nds, rownum, col,
						this.rowid, this.cellid,
						this.treecount[nds[0].nid],
						this.treecount[
							this.current.root.nid],
						this.treelist[nds[0].nid]);

				col += to - from - 1;
				continue;
			}

			var label = "?";
			if (nds[0].terminal)
				label = nds[0].terminal.base;
			else if (nds[0].nonterminal)
				label = nds[0].nonterminal.category;

			cell.innerHTML = label.to_xml_safe() + "<br />" +
				this.treecount[nds[0].nid] + " / " +
				this.treecount[this.current.root.nid];

			col += to - from - 1;
		}
	}

	this.blackboard.innerHTML = "";
	this.blackboard.appendChild(this.table);

	this.single = single;
	if (single) {
		var tbrows = [];
		var start = 0, stop = this.rows.length;
		if (this.showtbrulers) {
			tbrows = [
				this.table.insertRow(-1),
				this.table.insertRow(0),
			];
			start ++;
			stop ++;
		}
		for (var i in tbrows) {
			var row = tbrows[i];

			for (var col = 0; col < cols.length - 1; col ++) {
				var cell = row.insertCell(-1);
				var label = allcols[cols[col]];
				if (label == 1)
					label = "";

				cell.innerHTML =
					"<div>" + label.to_xml_safe() +
					"</div>";
				cell.className = "synspreadviewer-ruler";
			}
		}

		for (var rnum = 0; rnum < this.table.rows.length; rnum ++) {
			var row = this.table.rows[rnum];
			var cells = [
				row.insertCell(0),
				row.insertCell(-1),
			];
			if (rnum < start || rnum >= stop) {
				cells[0].className = cells[1].className =
					"synspreadviewer-empty";
				continue;
			}
			var label = this.rowid[rnum - start];
			label = "<div>" + label.to_xml_safe() + "</div>";

			cells[0].innerHTML = cells[1].innerHTML =
				label;
			cells[0].className = cells[1].className =
				"synspreadviewer-ruler";
		}

		return;
	}

	this.tbrulers = [ 0, 0 ];
	for (var i in this.tbrulers) {
		var ruler = document.createElement("table");
		var row = ruler.insertRow(-1);

		ruler.className = "synspreadviewer-ruler";

		for (var col = 0; col < cols.length - 1; col ++) {
			var cell = row.insertCell(-1);
			var label = allcols[cols[col]];
			if (label == 1)
				label = "";

			cell.innerHTML =
				"<div>" + label.to_xml_safe() + "</div>";
		}
		this.tbrulers[i] = ruler;
	}
	this.header.innerHTML = "";
	this.header.appendChild(this.tbrulers[0]);
	this.footer.innerHTML = "";
	this.footer.appendChild(this.tbrulers[1]);

	this.lrrulers = [ 0, 0 ];
	for (var i in this.lrrulers) {
		var ruler = document.createElement("table");

		ruler.className = "synspreadviewer-ruler";

		for (var rnum = 0; rnum < this.rows.length; rnum ++) {
			var row = ruler.insertRow(-1);
			var cell = row.insertCell(-1);
			var label = this.rowid[rnum];

			cell.innerHTML =
				"<div>" + label.to_xml_safe() + "</div>";
		}
		this.lrrulers[i] = ruler;
	}
	this.leftruler.innerHTML = "";
	this.leftruler.appendChild(this.lrrulers[0]);
	this.rightruler.innerHTML = "";
	this.rightruler.appendChild(this.lrrulers[1]);
}

synspreadviewer.prototype.select_tree = function(treeid) {
	var this_obj = this;
	var select = function(nd, id) {
		if (nd.leaf)
			return;

		var rulenum, chld;
		for (rulenum in nd.children) {
			chld = nd.children[rulenum].child;

			var trees = 1;
			for (var chnum in chld)
				trees *= this_obj.subtrees[chld[chnum].nid];

			if (id < trees)
				break;

			id -= trees;
		}

		nd.current = parseInt(rulenum);

		for (var chnum in chld) {
			var subsubs = this_obj.subtrees[chld[chnum].nid];
			var sid = id % subsubs;
			id -= sid;
			id /= subsubs;

			select(chld[chnum], sid);
		}
	};
	select(this.current.root, treeid);

	this.update_selection();
}

synspreadviewer.prototype.update_selection = function() {
	this.current.root.update_children(this);

	var selected = {};
	var select = function(nd) {
		selected[nd.nid] = 1;
		for (var chnum in nd.current_children)
			select(nd.current_children[chnum]);
	};
	select(this.current.root);

	for (var rownum = 0; rownum < this.rows.length; rownum ++)
		for (var col = 0; col < this.rows[rownum].length; col ++) {
			var nds = this.rows[rownum][col];
			if (nds == undefined)
				continue;

			var actrow = rownum;
			var actcol = col;
			if (this.single) {
				if (this.showtbrulers)
					actrow ++;
				actcol ++;
			}

			var cell = this.table.rows[rownum].cells[col];
			if (cell == undefined)
				continue;

			var classes = cell.className;

			classes = classes.replace("synspreadviewer-selected",
					"");
			if (nds[0].nid in selected)
				classes += " synspreadviewer-selected";

			cell.className = classes;
		}
}

synspreadviewer.prototype.destroy_cells = function() {
	if (this.table) {
		this.blackboard.removeChild(this.table);
		if (!this.single) {
			this.leftruler.removeChild(this.lrrulers[0]);
			this.rightruler.removeChild(this.lrrulers[1]);
			this.header.removeChild(this.tbrulers[0]);
			this.footer.removeChild(this.tbrulers[1]);
		}
		delete this.table;
		delete this.lrrulers;
		delete this.tbrulers;
		delete this.single_column_nodes;
	}
}

synspreadviewer.prototype.update_sizes = function(fullsize) {
	/* Ugly ugly: Make the container smaller than the content to
	 * calculate the scroll bars and decorations size.. */
	this.blackboard.style.overflowX = "scroll";
	this.blackboard.style.overflowY = "scroll";
	var decorwidth = this.blackboard.offsetWidth -
		this.blackboard.clientWidth;
	var decorheight = this.blackboard.offsetHeight -
		this.blackboard.clientHeight;

	var width = this.display.clientWidth;
	var height = this.display.clientHeight;
	var twidth = this.table.offsetWidth;
	var theight = this.table.offsetHeight;
	var lrwidth = this.leftruler.offsetWidth + this.rightruler.offsetWidth;
	var tbheight = this.footer.offsetHeight + this.header.offsetHeight;

	if (this.single) {
		lrwidth = 0;
		tbheight = 0;
	}

	if (fullsize) {
		decorwidth = decorheight = 0;
		width = twidth + lrwidth;
		height = theight + tbheight;
	}

	var vspace = height - tbheight - theight;
	if (vspace - decorheight >= 0)
		decorwidth = 0;

	var hspace = width - lrwidth - twidth;
	if (hspace - decorwidth >= 0)
		decorheight = 0;

	if (vspace - decorheight < 0) {
		this.blackboard.style.height = (height - tbheight) + "px";
		this.blackboard.style.top = this.header.offsetHeight + "px";
		this.blackboard.style.overflowY = "scroll";
	} else {
		this.blackboard.style.height = (theight + decorheight) + "px";
		this.blackboard.style.top = ((vspace / 2) +
				this.header.offsetHeight) + "px";
		this.blackboard.style.overflowY = "hidden";
	}

	if (hspace - decorwidth < 0) {
		this.blackboard.style.width = (width - lrwidth) + "px";
		this.blackboard.style.left = this.leftruler.offsetWidth + "px";
		this.blackboard.style.overflowX = "scroll";
	} else {
		this.blackboard.style.width = (twidth + decorwidth) + "px";
		this.blackboard.style.left = ((hspace / 2) +
				this.leftruler.offsetWidth) + "px";
		this.blackboard.style.overflowX = "hidden";
	}

	if (this.single)
		return;

	this.header.style.left =
		(this.blackboard.offsetLeft + this.blackboard.clientLeft -
		 this.header.clientLeft) + "px";
	this.header.style.top =
		(this.blackboard.offsetTop -
		 this.header.offsetHeight) + "px";
	this.header.style.width =
		this.blackboard.clientWidth + "px";

	this.footer.style.left =
		(this.blackboard.offsetLeft + this.blackboard.clientLeft -
		 this.footer.clientLeft) + "px";
	this.footer.style.top =
		(this.blackboard.offsetTop +
		 this.blackboard.offsetHeight) + "px";
	this.footer.style.width =
		this.blackboard.clientWidth + "px";

	this.leftruler.style.left =
		(this.blackboard.offsetLeft -
		 this.leftruler.offsetWidth) + "px";
	this.leftruler.style.top =
		(this.blackboard.offsetTop + this.blackboard.clientTop -
		 this.leftruler.clientTop) + "px";
	this.leftruler.style.height =
		this.blackboard.clientHeight + "px";

	this.rightruler.style.left =
		(this.blackboard.offsetLeft +
		 this.blackboard.offsetWidth) + "px";
	this.rightruler.style.top =
		(this.blackboard.offsetTop + this.blackboard.clientTop -
		 this.rightruler.clientTop) + "px";
	this.rightruler.style.height =
		this.blackboard.clientHeight + "px";

	this.tbrulers[0].width = this.table.offsetWidth + "px";
	this.tbrulers[1].width = this.table.offsetWidth + "px";
	var cols = this.tbrulers[0].rows[0].cells.length;
	var border = this.tbrulers[0].rows[0].cells[0].offsetWidth -
		this.tbrulers[0].rows[0].cells[0].childNodes[0].clientWidth;
	for (var col = 0; col < cols; col ++) {
		var row = this.nidmap[this.single_column_nodes[col]];
		var cells = this.table.rows[row].cells;
		var rcol = 0;

		for (var pos = 0; pos != col; rcol ++)
			pos += cells[rcol].colSpan;

		for (var i in this.tbrulers) {
			var cell = this.tbrulers[i].rows[0].cells[col];
			cell.childNodes[0].style.width =
				(cells[rcol].offsetWidth - border) + "px";
		}
	}

	var rows = this.lrrulers[0].rows.length;
	var border = this.lrrulers[0].rows[0].offsetHeight -
		this.lrrulers[0].rows[0].cells[0].childNodes[0].clientHeight;
	for (var row = 0; row < rows; row ++)
		for (var i in this.lrrulers) {
			var cell = this.lrrulers[i].rows[row];
			cell.childNodes[0].childNodes[0].style.height =
				(this.table.rows[row].offsetHeight - border) +
				"px";
		}

	var this_obj = this;
	this.blackboard.onscroll = function(evt) {
		this_obj.footer.scrollLeft = this_obj.blackboard.scrollLeft;
		this_obj.header.scrollLeft = this_obj.blackboard.scrollLeft;
		this_obj.leftruler.scrollTop = this_obj.blackboard.scrollTop;
		this_obj.rightruler.scrollTop = this_obj.blackboard.scrollTop;
	}
}

synspreadviewer.prototype.get_html = function() {
	if (!this.current)
		return "";

	this.destroy_cells();
	this.make_cells(true);
	this.update_sizes(true);

	var ret = this.display.innerHTML;

	this.destroy_cells();
	this.make_cells();
	this.update_selection();
	this.update_sizes();

	return ret;
}

/*
 * Utils
 */
String.prototype.to_xml_safe = function() {
	return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").
		replace(/>/g, "&gt;");
}

String.prototype.ends_in = function(ending) {
	return this.substr(this.length - ending.length) == ending;
}

function dump(arr, nl, tab, level) {
	if (!level)
		level = "";
	if (!nl)
		nl = "\n";
	if (!tab)
		tab = "  ";

	if (typeof(arr) == 'object' && 'length' in arr) {
		var text = "[" + nl;
		for (var item in arr)
  			text += level + tab +
				dump(arr[item], nl, tab, level + tab) +
				"," + nl;
		return text + level + "]";
	} else if (typeof(arr) == 'object') {
		var text = "{" + nl;
		for (var item in arr)
  			text += level + tab + item + ": " +
				dump(arr[item], nl, tab, level + tab) + nl;
		return text + level + "}";
	} else
		return "" + arr + " (" + typeof(arr) + ")";
}

function dump_json(arr, nl, tab, level) {
	if (!level)
		level = "";
	if (!nl)
		nl = "\n";
	if (!tab)
		tab = "  ";

	if (typeof(arr) == 'object' && 'length' in arr) {
		var text = "[" + nl;
		for (var item in arr)
  			text += level + tab +
				dump_json(arr[item], nl, tab, level + tab) +
				"," + nl;
		return text + level + "]";
	} else if (typeof(arr) == 'object') {
		var text = "{" + nl;
		for (var item in arr) {
			if (item == "#text")
				continue;
  			text += level + tab + "\"" + item + "\": " +
				dump_json(arr[item], nl, tab, level + tab) +
				"," + nl;
		}
		return text + level + "}";
	} else if (typeof(arr) == 'string')
		return "\"" + arr + "\"";
	else
		return "" + arr;
}

/* This really shouldn't be here... */
var ints = {
	"nid": 1, "from": 1, "to": 1, "subtrees": 1,
	"trees": 1, "nodes": 1, "inferences": 1
};
var bools = {
	"chosen": 1, "nps": 1, "head": 1,
};

function parse_xml(xml) {
	var children = {};
	var count = 0;

	if (xml.nodeName == "#text")
		return xml.nodeValue;

	/* "in" doesn't work here */
	for (var chnum = 0; chnum < xml.childNodes.length; chnum ++) {
		var item = xml.childNodes[chnum];
		var name = item.nodeName;

		if (!(name in children)) {
			children[name] = [];
			count ++;
		}

		var val = parse_xml(item);
		if (typeof(val) == "string" && name in ints)
			val = parseInt(val);
		else if (typeof(val) == "string" && name in bools)
			val = (val == "true");
		children[name].push(val);
	}
	if (xml.attributes)
		for (var chnum = 0; chnum < xml.attributes.length; chnum ++) {
			var item = xml.attributes[chnum];
			var name = item.nodeName;

			if (!(name in children)) {
				children[name] = [];
				count ++;
			}

			if (name in ints)
				children[name].push(parseInt(item.nodeValue));
			else if (name in bools)
				children[name].push(item.nodeValue == "true");
			else
				children[name].push(item.nodeValue);
		}

	for (var chname in children)
		if (children[chname].length == 1)
			children[chname] = children[chname][0];

	if (count == 1 && children["#text"])
		return children["#text"];

	return children;
}

var interp = { ",": 1, ".": 1 };
function parse_text(text) {
	var words = [];
	var word = "";

	for (var i = 0; i < text.length; i ++) {
		var chr = text[i];

		if (!(chr in whitespace || chr in interp)) {
			word += chr;
			continue;
		}

		if (word != "") {
			words.push(word);
			word = "";
		}

		if (chr in interp)
			words.push(chr);
	}

	return words;
}

function get_style(name) {
	for (var stnum in document.styleSheets) {
		var rules;
		if (document.styleSheets[stnum].cssRules)
			rules = document.styleSheets[stnum].cssRules;
		else
			rules = document.styleSheets[stnum].rules;

		for (var rulenum in rules)
			/* TODO: work around some firefox bug causing
			 * warnings (note that ("selectorText" in ...) does
			 * not seem to work).  */
			if (rules[rulenum].selectorText == name)
				return rules[rulenum];
	}
	throw "not found";
}

function attach(obj, evt, fn, capt) {
	if (obj.addEventListener) {
		if (navigator.appName.indexOf("Netscape") == -1)
			if (evt == "DOMMouseScroll")
				evt = "mousewheel";
		if (navigator.userAgent.indexOf("Safari") != -1) {
			if (evt == "DOMMouseScroll")
				obj.onmousewheel = fn;
			else
				obj.addEventListener(evt, fn, capt);
		} else
			obj.addEventListener(evt, fn, capt);
	} else {
		if (evt == "DOMMouseScroll")
			obj.attachEvent("onmousewheel", fn);
		else
			obj.attachEvent("on" + evt, fn);
	}
};

function eval_json(str) {
	var ret;
	eval("ret = " + str);
	return ret;
}

/*
 * File loader
 * (TODO: Try to support JSON-P)
 */
var c = function(value) { return value; }
var cq = [];
function request_forest(treeurl, cb, err_cb, data) {
	var http_request;
	var xml = treeurl.ends_in(".xml");
	var mime = xml ? "text/xml" : "text/plain";

	if (window.XMLHttpRequest) { /* Mozilla, webkit,... */
		http_request = new XMLHttpRequest();
		if (http_request.overrideMimeType)
			http_request.overrideMimeType(mime);
	} else if (window.ActiveXObject) { /* IE */
		try {
			http_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			http_request = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	if (!http_request)
		throw "I couldn\'t make no XMLHttp object :-("

	http_request.onreadystatechange = function() {
		if (http_request.readyState != 4)
			return;

		if (http_request.status == 200) {
			var resp = xml ?
				parse_xml(http_request.responseXML) :
				http_request.responseText.substr(0, 2) == "c(" ?
				eval(http_request.responseText) :
				eval_json(http_request.responseText);

			if (data)
				cb(resp, data);
			else
				cb(resp);
			return;
		}

		/* TODO: handle the error (retry? display error
		 * in a non-obtrusive text field?) */
		/* TODO: or fall back to JSON-P immediately? */

		err_cb("Error " + http_request.status +
			" reading the forest description");

		if (http_request.status == 0) {
			/* TODO: switch to JSON-P mode */
		}
	}
	http_request.open('GET', treeurl, true);
	http_request.send(null);

	return http_request;
}

/*
 * XML parser
 */
function dom_parser(str) {
	if (window.DOMParser) /* Mozilla, webkit,... */
		return new DOMParser().parseFromString(str, "text/xml");
	else if (window.ActiveXObject) { /* IE */
		var doc;
		try {
			doc = new ActiveXObject("Msxml2.XMLDOM");
		} catch (e) {
			doc = new ActiveXObject("Microsoft.XMLDOM");
		}
		doc.async = "false";
		doc.loadXML(str);
		return doc;
	}
	throw "I couldn\'t make no XMLDOM object :-("
}
