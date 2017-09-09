var MEMOS = (function () {
	var initMemos = function initMemos() {
		$("<div />", {  
			"class" : "add-memo",
			text : "Add",
			click : function () { сreateMemo(); }
		}).prependTo(document.body);
	},
	
	сreateMemo = function сreateMemo(data) {
		data = data || { id : +new Date(), text : "Пиши тут", top : "40px", left : "40px" }
		
		return $("<div />", {
			'id' : data.id,			
			"class" : "memo"
			 })
			.prepend($("<div />", { "class" : "memo-header"} )
				.append($("<span />", { 
					"class" : "memo-status", 
					click : saveMemo
				}))
				.append($("<span />", {
					text : "delete",					
					"class" : "close-memo",  
					click : function () { deleteMemo($(this).parents(".memo").attr("id")); }//???
				}))
			)
			.append($("<div />", { 
				keypress : markUnsaved,
				html : data.text, 
				"class" : "memo-content",
				contentEditable : true
 			}))
		.draggable({ 
			stack : ".memo",
		    handle : "div.memo-header",
			start : markUnsaved,
			stop  : saveMemo	
		 })
		.css({
			position: "absolute",
			"left": data.left,
			"top" : data.top
		})
		.focusout(saveMemo)
		.appendTo(document.body);
	},
	
	openMemos = function openMemos() {
	initMemos && initMemos();
		for (var i = 0; i < localStorage.length; i++) {
			сreateMemo(JSON.parse(localStorage.getItem(localStorage.key(i))));
		}
	},
	saveMemo = function saveMemo() {
		var that = $(this),  memo = (that.hasClass("memo-status") || that.hasClass("memo-content")) ? that.parents('div.memo'): that,
				object = {
					id  : memo.attr("id"),
					top : memo.css("top"),
					left: memo.css("left"),
					text: memo.children(".memo-content").html()				}
		localStorage.setItem("memo-" + object.id, JSON.stringify(object));	
		memo.find(".memo-status").text("saved");
	},
	deleteMemo = function deleteMemo(id) {
		localStorage.removeItem("memo-" + id);
		$("#" + id).fadeOut(500, function () { $(this).remove(); });
	},
	markUnsaved = function markUnsaved() {
		var that = $(this), memo = that.hasClass("memo-content") ? that.parents("div.memo") : that;
		memo.find(".memo-status").text("unsaved");
	}
	return {
		init   : initMemos,
		open   : openMemos,
		"new"  : сreateMemo,
		remove : deleteMemo,
	};
}());
