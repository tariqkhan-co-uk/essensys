//(function(){
	//'use strict';
	var technicalTest = {
		// Initialisation logic
		init:function(tableId, fileLocation) {
			var thisObj = this, table = document.getElementById(tableId);
			this.showStatus(table);
			this.loadData(fileLocation, function(results) {
				table.getElementsByTagName('tbody')[0].innerHTML = thisObj.processData(results);
			}, function(errors) {
				thisObj.showStatus(table, 'Error: '+errors);
			});
			this.showHide('showHide');
		},
		// Display operation status or custom messaging
		showStatus:function(table, text) {
			table.getElementsByTagName('td')[0].innerHTML = text ? text : 'Loading data...';
		},
		// Load and return CSV data else return error details
		loadData: function(fileLocation, onComplete, onError) {
			var xhr = new XMLHttpRequest();
			if(!xhr) {
				onError('Cannot create an XMLHTTP instance');
			} else {
				xhr.open('GET', fileLocation, false);
				xhr.onreadystatechange = function() {
					if(xhr.readyState === XMLHttpRequest.DONE) {
						if(xhr.status === 200) {
							onComplete(xhr.responseText);
						} else {
							onError(xhr.statusText);
						}
					}
				}
				try {
					xhr.send();
				} catch(e) {
					onError(e.message);
				}
			}
		},
		// Process data and return string containing markup required to display html table data
		processData:function(data) {
			var output	= "",
				columns	= false,
				rows	= data.split(/\r\n|\n/),
				count	= rows.length,
				headers	= rows[0].split(',');
			while(count--) { // Remove empty rows
				if(/^[,\s]*$/.test(rows[count])) {
					rows.splice(count, 1);
				}
			}
			rows.splice(0, 1); // Remove the headers row or first row
			count++;
			while(count < rows.length) {
				output += count % 2 === 0 ? "<tr>\n" : "<tr class=\"even\">\n";
				columns = rows[count].split(',');
				for(var i = 0; i < columns.length; i++) {
					output += "<td data-header=\""+headers[i]+"\">"+columns[i].replace(/_/g, '')+"</td>\n";
				}
				output += "</tr>\n";
				count++;
			}
			return output;
		},
		// Enable show/hide functionality element id
		showHide:function(id) {
			var	thisObj = this;
				showHide = document.getElementById(id),
				showHidePanel = showHide.getAttribute('href');
				showHidePanel = document.getElementById(showHidePanel.substring(1));

				showHide.setAttribute('aria-expanded', false);
				showHide.setAttribute('aria-controls', showHidePanel.id);
				showHideChild = document.createElement('span');
				showHideChild.innerHTML = 'Show ';
				showHide.insertBefore(showHideChild, showHide.firstChild);

				showHidePanel.setAttribute('aria-expanded', false);
				showHidePanel.setAttribute('aria-labelledby', showHide.id);
				showHidePanel.setAttribute('role', 'region');
				showHidePanel.setAttribute('tabindex', -1);
				showHidePanel.style.display = 'none';

				showHide.addEventListener('click', function(event) {
					thisObj.toggleRegion(showHide, showHidePanel);
					event.preventDefault();
				});
				showHide.addEventListener('keydown', function(event) {
					if(event.keyCode == 13 || event.keyCode == 32) { // If enter or space key
						thisObj.toggleRegion(showHide, showHidePanel);
						event.preventDefault();
					}
				});
		},
		// Toggle the display of the show/hide region
		toggleRegion:function(showHide, showHidePanel) {
			var state = showHidePanel.getAttribute('aria-expanded');
			if(state === 'false') {
				showHide.setAttribute('aria-expanded', true);
				showHide.getElementsByTagName('span')[0].innerHTML = 'Hide ';
				showHidePanel.setAttribute('aria-expanded', true);
				showHidePanel.style.display = 'block';
				showHidePanel.focus();
			} else {
				showHide.setAttribute('aria-expanded', false);
				showHide.getElementsByTagName('span')[0].innerHTML = 'Show ';
				showHidePanel.setAttribute('aria-expanded', false);
				showHidePanel.style.display = 'none';
				showHide.focus();
			}
		}
	}
	// Call to Initialisation method parsing the id of the table and the CSV file location and filename
	technicalTest.init('table', 'Test_csv.csv');
//})();
