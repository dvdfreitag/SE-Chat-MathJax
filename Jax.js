var stop = false;
var update = true;
var beatInterval = 5000;

MathJax =
{
	tex:
	{
		inlineMath:
		[
			[
				"$",
				"$"
			]
		],
		displayMath:
		[
			[
				"$$",
				"$$"
			]
		],
		processEscapes: true,
		noundefined:
		{
			color: "red",
			background: "#FFEEEE",
			size: "90%25"
		},
		packages:
		{
			'[+]':
			[
				'base',
				'enclose',
				'cancel',
				'mhchem'
			]
		}
	},
	options:
	{
		ignoreHtmlClass: "tex2jax_ignore|dno|last-message"
	},
	loader:
	{
		load:
		[
			'[tex]/enclose',
			'[tex]/cancel',
			'[tex]/mhchem'
		]
	},
	startup:
	{
		pageReady: () =>
		{
			return MathJax.startup.defaultPageReady().then(() =>
			{
				console.log("MathJax is loaded, initial typesetting is triggered");
			});
		}
	}
};

$('document').ready(() =>
{
	var popup =
`<div id="jax-popup-bg" class="wmd-prompt-background" style="position: fixed; top: 0px; z-index: 1000; opacity: 0.5; left: 0px; width: 100%; height: 100%;"></div>
<div id="jax-popup" style="top: 50%; left: 50%; display: block; padding: 10px; position: fixed; width: 150px; z-index: 1001; margin-top: -93.5px; margin-left: -113px;" class="wmd-prompt-dialog">
	<div align="center">
		<b>MathJax</b>
		<br>

		Interval:
		<input type="text" id="jax-heartbeat" style="width: 80px; margin-left: 10px" title="In miliseconds" value="` + beatInterval + `"/>
		<br>

		<input type="checkbox" id="jax-update" title="Use an ajax handler instead of a heartbeat">Update</input>
		<input type="checkbox" id="jax-disable" style="margin-left: 10px" title="Temporarily stops MathJax from updating">Disable</input>
	</div>

	<button id="jax-ok" class="button">Ok</button>
	<button id="jax-cancel" style="margin-left: 10px" class="button">Cancel</button>

	<script type="text/javascript">
		// Set the initial UI state from globals
		$("#jax-update").prop("checked", update);
		$("#jax-disable").prop("checked", stop);
		$("#jax-heartbeat").prop("disabled", !update || stop);
		$("#jax-update").prop("disabled", stop);

		// Register an onClick() event handler to the Add button
		$("#jax-ok").click(function()
		{
			// If the configured hearbeat timeout is a valid number and greater than 1 second,
			if ($.isNumeric($("#jax-heartbeat").val()) && parseInt($("#jax-heartbeat").val()) >= 1000)
			{
				// ... and we're configured to update automatically,
				if ($("#jax-update").prop("checked") && !$("#jax-disable").prop("checked"))
				{
					// ... update the heartbeat timeout value
					beatInterval = parseInt($("#jax-heartbeat").val());
				}

				// ... and we're enabled,
				if (!$("#jax-disable").prop("checked"))
				{
					// ... set the global update value
					update = $("#jax-update").prop("checked");
				}

				// set the global stop value
				stop = $("#jax-disable").prop("checked");

				// Finally, clean up the popup window
				$("#jax-popup").remove();
				$("#jax-popup-bg").remove();
			}
			else
			{
				// Otherwise, let the user know the timeout value is not valid
				alert("Interval values must be numeric and no less than 1000");
			}
		});

		// Register an onClick() event handler to the canel button,
		$("#jax-cancel").click(function()
		{
			// ... to clean up the popup window
			$("#jax-popup").remove();
			$("#jax-popup-bg").remove();
		});

		// Register an onClick() event handler to the update checkbox,
		$("#jax-update").click(function()
		{
			// ... which enables or disables the heartbeat text box as needed
			$("#jax-heartbeat").prop("disabled", !$("#jax-update").prop("checked"));
		});

		// Register an onClick() event handler to the disable checkbox,
		$("#jax-disable").click(function()
		{
			// ... which enables or disables the heartbeat text box and update check box as needed
			$("#jax-heartbeat").prop("disabled", $("#jax-disable").prop("checked"));
			$("#jax-update").prop("disabled", $("#jax-disable").prop("checked"));
		});
	</script>
</div>`;

	// Create a script object to add the MathJax configuration
	var script = document.createElement("script");
	script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.js";

	// Add MathJax to the page
	document.getElementsByTagName("head")[0].appendChild(script);

	// Create MathJax button in the chat buttons list
	$('#chat-buttons').prepend('<button class="button" id="math-button">MathJax</button>');

	$('#math-button').click(function()
	{
		$('body').append(popup);
	});

	// Run first heartbeat
	beat();
});

$('html').ajaxComplete(() =>
{
	if(!update && !stop)
	{
		typeset();
	}
});

function typeset()
{
	// Run a synchronous typeset operation in MathJax on the entire page
	MathJax.typeset();

	// For each item which has been typeset,
	$.each($('script[type="math/tex"]'), function(index, value)
	{
		if ($(value).parent().data('events') === undefined)
		{
			// ... append an onClick() event,
			$(value).parent().click(function()
			{
				if ($(value).parent().html().split($(value).html() || []).length - 1 === 1)
				{
					// ... which will display the original LaTeX code with tags
					$(value).parent().append(' \\$' + $(value).html() + '\\$');
				}
			});
		}
	});
}

/**
 * Hearbeat function to typeset all LaTeX messages posted into the chat window
 */
function beat()
{
	// Create a timeout function using the configured interval
	setTimeout(() =>
	{
		typeset();

		if (update && !stop)
		{
			beat();
		}
	}, beatInterval);
};
