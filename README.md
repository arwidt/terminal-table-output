# terminal-table-output

Create and print tables in the terminal.

## Installation

	npm install terminal-table-output

## Usage

Use this syntax

	var tto = require('terminal-table-output').create();
	tto.col('foo')
		.col('bar)
		.col('foobar')
		.row()
		.col('onoff')
		.col('extraextra')
		.line()
		.col('table')
		.col('delux')
		.print(true);
or this

	tto.pushrow(['foo', 'bar', 'foobar'])
		.pushrow(['onoff', 'extraextra'])
		.line()
		.pushrow(['table', 'delux'])
		.print(true);
		
both will output
	
	foo   | bar        | foobar
	onoff | extraextra |
	===========================
	table | delux      |
	
## Settings

You can send in a settings object with the create function.  
With these you can set the character that fills the text that has less width than the longest.
And you can set the delimiter between columns.

	var tto = require('terminal-table-output')
				.create({
					fill: "-",
					border: "/",
					line: ">"
				});
				
Would output the example above in the following way.

	foo--/bar-------/foobar
	onoff/extraextra/
	>>>>>>>>>>>>>>>>>>>>>>>
	table/delay-----/
	
Default settings  
**fill:** " "  
**border:** " | "  
**line:** "="  

