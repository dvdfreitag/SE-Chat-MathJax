var stop = false;
var update = true;

if(window.MathJax === undefined)
{
	var script = document.createElement("script");
	script.type="text/javascript";
	script.src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
	var config='MathJax.Hub.Config({"HTML-CSS": { ' +
			   'webFont: "TeX", ' +
			   'preferredFont: "TeX", ' + 
			   'availableFonts: ["STIX","TeX"], ' +
			   'linebreaks: { automatic:true }, '+
			   'EqnChunk: (MathJax.Hub.Browser.isMobile ? 10 : 50) }, ' +
			   'tex2jax: { inlineMath: [ ["$", "$"] ], displayMath: [ ["$$","$$"] ], processEscapes: true, ignoreClass: "tex2jax_ignore|dno|last-message" }, ' +
			   'TeX: { extensions: ["mhchem.js", "enclose.js", "cancel.js"], noUndefined: { attributes: { mathcolor: "red", mathbackground: "#FFEEEE", mathsize: "90%25" } } }, ' +
			   'messageStyle: "none"}); ' +
			   'MathJax.Hub.Startup.onload();';
				   
	if(window.opera) {
		script.innerHTML = config;
	} else {
		script.text = config;
	}
		
	document.getElementsByTagName("head")[0].appendChild(script);
	
	$('#chat-buttons').prepend('<button class="button" id="math-button">MathJax</button>');
	$('#math-button').click(function() {
		$('body').append('<div id="jax-popup-bg" class="wmd-prompt-background" style="position: fixed; top: 0px; z-index: 1000; opacity: 0.5; left: 0px; width: 100%; height: 100%;"></div>' +
						 '<div id="jax-popup" style="top: 50%; left: 50%; display: block; padding: 10px; position: fixed; width: 150px; z-index: 1001; margin-top: -93.5px; margin-left: -113px;" class="wmd-prompt-dialog">' +
							 '<div align="center">' +
								 '<b>MathJax</b><br>' + 
								 'Interval:' +
								 '<input type="text" id="jax-heartbeat" style="width: 80px; margin-left: 10px" title="In miliseconds" value="' + beatInterval + '"/><br>' +
								 '<input type="checkbox" id="jax-update" title="Use an ajax handler instead of a heartbeat">Update</input>' +
								 '<input type="checkbox" id="jax-disable" style="margin-left: 10px" title="Temporarily stops MathJax from updating">Disable</input>' +
							 '</div>' +
							
							 '<button id="jax-ok" class="button">Ok</button>' +
							 '<button id="jax-cancel" style="margin-left: 10px" class="button">Cancel</button>' +
							 '<script type="text/javascript">' +
								 '$("#jax-update").prop("checked", update);' +
								 '$("#jax-disable").prop("checked", stop);' +
								 '$("#jax-heartbeat").prop("disabled", !update || stop);' +
								 '$("#jax-update").prop("disabled", stop);' +
							 
								 '$("#jax-ok").click(function() {' +
									 'if($.isNumeric($("#jax-heartbeat").val()) && parseInt($("#jax-heartbeat").val()) >= 1000) {' +
										 'if($("#jax-update").prop("checked") && !$("#jax-disable").prop("checked")) {' +
											 'beatInterval = parseInt($("#jax-heartbeat").val());' +
										 '}' +
										 
										 'if(!$("#jax-disable").prop("checked")) {' +
											 'update = $("#jax-update").prop("checked");' +
										 '}' +
										 
										 'stop = $("#jax-disable").prop("checked");' +
										 '$("#jax-popup").remove();' +
										 '$("#jax-popup-bg").remove();' +
									 '} else {' +
										 'alert("Values must be numeric and no less than 1000");' +
									 '}' +
								 '});' +
								 
								 '$("#jax-cancel").click(function() {' +
									 '$("#jax-popup").remove();' +
									 '$("#jax-popup-bg").remove();' +
								 '});' +
									 
								 '$("#jax-update").click(function() {' +
									 '$("#jax-heartbeat").prop("disabled", !$("#jax-update").prop("checked"));' +
								 '});' +
								 
								 '$("#jax-disable").click(function() {' +
									 '$("#jax-heartbeat").prop("disabled", $("#jax-disable").prop("checked"));' +
									 '$("#jax-update").prop("disabled", $("#jax-disable").prop("checked"));' +
								 '});' +
							 '</script>' +
						 '</div>');
	});
} else {
	if(window.MathJax !== undefined)
		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

$('document').ready(function() {
	beat();
});

$('html').ajaxComplete(function() {
	if(!update && !stop)
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
});

var beatInterval = 5000;
function beat() {
	setTimeout(function() {	
		if(window.MathJax !== undefined)
		{
			MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

			$.each($('script[type="math/tex"]'), function(index, value) { 
				if ($(value).parent().data('events') === undefined) { 
					$(value).parent().click(function() { 
						if ($(value).parent().html().split($(value).html() || []).length - 1 === 1) {
							$(value).parent().append(' \\$' + $(value).html() + '\\$');
						}
					}); 
				} 
			});
		}
	
		if(update && !stop)
			beat();

	}, beatInterval);
};