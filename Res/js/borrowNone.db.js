Osp.Core.Mixin.define("borrowNone.DB",
{
	members:
	{
		updateExportFile: function()
		{
			var dir = 'documents/borrowNone/data',
				file = null,
				fileSystemAPI = deviceapis.filesystem,
				self = this,
				title = '',
				message = '',
				style = 'ok';

			function onSuccess(dir)
			{
				file = dir.resolve('export.db');

				self.writeToFile(file);
			}

			function onError(e)
			{
				self.setLoading(false);
				console.log("updateExportFile() > Error Code: " + e.code);
				console.log("updateExportFile() > Error Message: " + e.message);

				switch(e.message)
				{
					case 'NOT_FOUND_ERR':
						message = self.getMessage('IDS_ERROR_EXPORT_FILE_NOT_FOUND');
						break;

					case 'SECURITY_ERR':
						message = self.getMessage('IDS_ERROR_EXPORT_MISSING_PERMISSION');
						break;

					default:
						message = self.getMessage('IDS_ERROR_UNKNOWN_ERROR');
						break;
				}

				title = self.getMessage('IDS_ERROR_EXPORT'),

				self.showPopup(title, message, 'ok');
			}

			fileSystemAPI.resolve(onSuccess, onError, dir, "rw");
		},

		writeToFile: function(file)
		{
			var db = localStorage.getItem('db'),
				self = this,
				exportObject = {},
				title = '',
				message = '';

			exportObject.results = JSON.parse(db).results;

			function streamCB(fileStream)
			{
				try
				{
					fileStream.write(JSON.stringify(exportObject));
					fileStream.close();

					self.setLoading(false);

					if(!self.importButton.isEnabled())
					{
						self.importButton.setEnabled(true);
					}

					title = self.getMessage('IDS_EXPORT');
					message = self.getMessage('IDS_EXPORT_COMPLETED');

					self.showPopup(title, message, 'none', 2000);
				}
				catch (e)
				{
					self.setLoading(false);
					console.log("writeToFile("+file+") > Error Code: " + e.code);
					console.log("writeToFile("+file+") > Error Message: " + e.message);
				}
			}

			function streamError(e)
			{
				self.setLoading(false);
				console.log("writeToFile("+file+") > Error Code: " + e.code);
				console.log("writeToFile("+file+") > Error Message: " + e.message);

				switch(e.message)
				{
					case 'NOT_FOUND_ERR':
						message = self.getMessage('IDS_ERROR_EXPORT_FILE_NOT_FOUND');
						break;

					case 'SECURITY_ERR':
						message = self.getMessage('IDS_ERROR_EXPORT_MISSING_PERMISSION');
						break;

					default:
						message = self.getMessage('IDS_ERROR_UNKNOWN_ERROR');
						break;
				}

				title = self.getMessage('IDS_ERROR_EXPORT'),

				self.showPopup(title, message,'ok');
			}

			file.openStream(streamCB, streamError, 'w', 'UTF-8');
		},

		createFile: function() {
			var file = null,
				fileSystemAPI = deviceapis.filesystem,
				dir = 'documents/borrowNone/data',
				self = this;

			function onSuccess(dir) {
				try {
					file = dir.createFile('export.db');

					if(file)
					{
						self.writeToFile(file);
					}
				}
				catch (e)
				{
					self.setLoading(false);
					console.log("createFile() > Error Code: " + e.code);
					console.log("createFile() > Error Message: " + e.message);
				}
			}

			function onError(e)
			{
				self.setLoading(false);
				console.log("createFile() > Error Code: " + e.code);
				console.log("createFile() > Error Message: " + e.message);

				switch(e.message)
				{
					case 'NOT_FOUND_ERR':
						message = self.getMessage('IDS_ERROR_EXPORT_FILE_NOT_FOUND');
						break;

					case 'SECURITY_ERR':
						message = self.getMessage('IDS_ERROR_EXPORT_MISSING_PERMISSION');
						break;

					default:
						message = self.getMessage('IDS_ERROR_UNKNOWN_ERROR');
						break;
				}

				title = self.getMessage('IDS_ERROR_EXPORT'),

				self.showPopup(title, message,'ok');
			}

			fileSystemAPI.resolve(onSuccess, onError, dir, "rw");
		},

		createDirectory: function() {
			var dir = null,
				fileSystemAPI = deviceapis.filesystem,
				dirname = 'documents',
				self = this,
				title = '',
				message = '';

			function onSuccess(dir)
			{
				try
				{
					newDir = dir.createDirectory("borrowNone/data");

					if(newDir)
					{
						localStorage.setItem("exportFolder", "1");
						self.createFile();
					}
				}
				catch (e)
				{
					self.setLoading(false);
					console.log("createDirectory() > Error Code: " + e.code);
					console.log("createDirectory() > Error Message: " + e.message);
				}
			}

			function onError(e)
			{
				self.setLoading(false);
				console.log("createDirectory() > Error Code: " + e.code);
				console.log("createDirectory() > Error Message: " + e.message);

				switch(e.message)
				{
					case 'NOT_FOUND_ERR':
						message = self.getMessage('IDS_ERROR_EXPORT_FILE_NOT_FOUND');
						break;
	
					case 'SECURITY_ERR':
						message = self.getMessage('IDS_ERROR_EXPORT_MISSING_PERMISSION');
						break;
	
					default:
						message = self.getMessage('IDS_ERROR_UNKNOWN_ERROR');
						break;
				}

				title = self.getMessage('IDS_ERROR_EXPORT'),

				self.showPopup(title, message,'ok');
			}

			fileSystemAPI.resolve(onSuccess, onError, dirname, "rw");
		},

		exportDB: function()
		{
			var exportFolder = localStorage.getItem("exportFolder");

			this.setLoading(true);

			if(exportFolder)
			{
				this.updateExportFile();
			}
			else
			{
				this.createDirectory();
			}
		},

		importDB: function()
		{
			this.setLoading(true);

			var self = this,
				fileSystemAPI = deviceapis.filesystem,
				location = 'documents/borrowNone/data',
				file = null,
				title = '',
				message = '',
				results = null,
				saveObject = {},
				db = localStorage.getItem('db'),
				imported = 0,
				check = null;

			function writeToDB(content)
			{
				if(content)
				{
					content = JSON.parse(content).results;

					if(!db)
					{
						saveObject.results = cnt;

						localStorage.setItem('db', JSON.stringify(saveObject));
					}
					else
					{
						try {
							results = JSON.parse(db).results;

							for(var i = 0; i < content.length; i++)
							{
								check = self.containsObject(content[i], results);

								if(!check)
								{
									results.push(content[i]);
									imported++;
								}
							}

							saveObject.results = results;

							localStorage.setItem('db', JSON.stringify(saveObject));
						}
						catch(e)
						{
							self.setLoading(false);

							title = self.getMessage('IDS_ERROR_IMPORT'),
							message = self.getMessage('IDS_ERROR_IMPORT_FILE_CORRUPTED');

							self.showPopup(title, e.message,'ok');
						}
					}

					self.loadDB();

					self.exportButton.setEnabled(true);

					localStorage.setItem("exportFolder", "1");

					title = self.getMessage('IDS_IMPORT');
					message = self.getMessage('IDS_IMPORT_COMPLETED');
					message2 = imported === 1 ? imported +" "+self.getMessage('IDS_IMPORTED_ITEMS') : imported +" "+self.getMessage('IDS_IMPORTED_ITEM');

					self.showPopup(title, message, 'none', 2000);

					setTimeout(function() {
						self.showPopup(title, message2, 'none', 2000);
					}, 2200);
				}
				else
				{
					title = self.getMessage('IDS_ERROR_IMPORT'),
					message = self.getMessage('IDS_ERROR_IMPORT_FILE_CORRUPTED');

					self.showPopup(title, message,'ok');
				}
			}

			function onSuccess(dir)
			{
				try
				{
					file = dir.resolve('export.db');

					file.readAsText(writeToDB, onError, 'UTF-8');
				}
				catch (e)
				{
					self.setLoading(false);

					self.showPopup(self.getMessage('IDS_ERROR'), e.message,'ok');
				}
			}

			function onError(e)
			{
				self.setLoading(false);

				self.showPopup(self.getMessage('IDS_ERROR'), e.message,'ok');
			}

			fileSystemAPI.resolve(onSuccess, onError, location, 'r');
		},

		/**
		 * Save a JSON to database.
		 * If no index available then it must be a new item. Else it is an existing item and must be updated
		 * @param {Object} data
		 * @param {Number} index
		 * @since 1.0.0
		 * @author Marco Büttner
		 * @public
		 */
		saveEntry: function(data, index)
		{
			var db = localStorage.getItem('db'),
				enableNotify = localStorage.getItem('enableNotify'),
				deviceInteractionAPI = deviceapis.deviceinteraction,
				saveItem = {},
				dbResults = null,
				saveArray = null;

			if(!db) // empty database
			{
				saveArray = [];
				saveArray[0] = data;
				saveItem.results = saveArray; // prepare datbase with key "results"
			}
			else
			{
				dbResults = JSON.parse(db).results; // read out database by "results" key

				if(index) // if item has an index then update item by index
				{
					dbResults[index] = data;
				}
				else // else add item on the end
				{
					dbResults.push(data);
				}

				saveItem.results = dbResults; // prepare database with key "results"
			}

			localStorage.setItem('db', JSON.stringify(saveItem)); // save buffer item "saveItem" to database (as string)

			if(enableNotify) // use enable notification on settings
			{
				function notifySuccess()
				{
					console.log("[borrowNone.db.js] saveEntry > success");
				}

				function notifyError(e)
				{
					console.log("notify error > "+e.message);
				}
				deviceInteractionAPI.startNotify(notifySuccess, notifyError, 700);
			}

			this.loadDB(); // reload db

			if(index)
			{
				db = localStorage.getItem('db'); // query db

				var data  = JSON.parse(db).results, // query results
					itemData = data[index], // query one specific item
					eventId = itemData.eventId !== -1 ? itemData.eventId : ""; // if eventId available then use it else make a emptry string
					endDate = itemData.endDate !== -1 ? new Date(itemData.endDate).toLocaleDateString() : ""; // if eventId available then use it else make a emptry string

				// set changed data
				this.detailPicLabelValue.setBackgroundImage(itemData.pic);
				this.detailTypeLabelValue.setText(itemData.type);
				this.detailPersonLabelValue.setText(itemData.person);
				this.detailStartDateLabelValue.setText(new Date(itemData.date).toLocaleDateString());
				this.detailEndDateLabelValue.setText(endDate);
				this.detailNoteLabelValue.setText(itemData.note);
				this.detailIdLabelValue.setText(index);
				this.detailEventIdLabelValue.setText(eventId);
				this.detailTitleLabelValue.setText(itemData.title);

				// modify header
				this.BackButtonHeader();
				this.headerObj.setTitleText(itemData.title);

				// modify footer
				this.EditDeleteButtons();

				// show detail page and hide all other pages
				this.hideAllPages();
				this.showPage(this.detailPanel);

				this.PAGE.CURRENT = null; // set to default
			}
			else
			{
				this.clearForm();

				// MODIFY HEADER
				this.DefaultHeader();

				// MODIFY FOOTER
				this.AddDeleteButtons();

				// change back to borrow or loan page - depens of the new type
				this.hideAllPages();
				

				if(data.type === 1 || data.type === 'borrow')
				{
					this.PAGE.CURRENT = 'borrowList';
					this.showPage(this.borrowList);
				}
				else
				{
					this.PAGE.CURRENT = 'loanList';

					this.showPage(this.loanList);

					this.headerObj.setItemSelected(1);
				}
			}
		},

		isDBEmpty: function()
		{
			var db = localStorage.getItem('db');

			if(db && db === "{}" || !db)
			{
				return true;
			}
			else
			{
				return false;
			}
		},

		containsObject: function(obj, list) {
			var i;
			for (i = 0; i < list.length; i++)
			{
				if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
					return true;
				}
			}

			return false;
		}
	}
});