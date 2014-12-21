Osp.Core.Mixin.define("borrowNone.Events",
{
	members:
	{
		PAGE:
		{
			PREVIOUS: null,
			CURRENT: null
		},

		CHECKBUTTON:
		{
			STATE: null
		},

		BOX:
		{
			STATE: null
		},

		ID:
		{
			DATE: null,
			ENDDATE: null,
			BORROWTYPE:
			{
				FROM: null,
				TO: null
			},
			EXPORTMODE_1: null,
			EXPORTMODE_2: null,
			EXPORTMODE_3: null
		},

		LISTENER:
		{
			HEADER: null,
			FOOOTER: null,
			LIST:
			{
				BORROW: null,
				LOAN: null,
				CONTACT: null
			},
			CHECKBUTTON:
			{
				BORROW: null,
				LOAN: null
			}
		},

		onCheckButtonAction: function(e)
		{
			var actionId = e.getData().actionId;

			switch(actionId)
			{
				// TYPE
				case 1:
					this.CHECKBUTTON.STATE = 'borrow';
					break;
				case 2:
					this.CHECKBUTTON.STATE = 'loan';
					break;

				// ALLOW ALWAYS EXPORT
				case 3: // on
					localStorage.setItem("allowExport", "yes");
					break;
				case 4: // off
					localStorage.removeItem("allowExport");
					break;
				
				// ENABLE SUCCESS NOTIFY
				case 5: // on
					localStorage.setItem("enableNotify", "on");
					break;
				case 6: // off
					localStorage.removeItem("enableNotify");
					break;

				// EXPORT MENU
				case 10:
					this.showExportMenu(this.PAGE.CURRENT, true);
					break;
				case 11:
					this.showExportMenu(this.PAGE.CURRENT, false);
					break;
			}
		},

		onFooterAction: function(e)
		{
			var actionId = e.getData().actionId,
				self = this;

			switch(actionId)
			{
				// ADDPAGE
				case 1:
					var allowExport = localStorage.getItem("allowExport");

					this.headerObj.removeAllItems();
					this.headerObj.removeAllButtons();
					this.headerObj.setHeaderStyle('title');
					this.headerObj.setTitleText(this.getMessage('IDS_TITLE_NEW_ITEM'));

					this.SaveCancelButtons(3);

					if(this.PAGE.CURRENT === "borrowList")
					{
						this.radioGroupObj.setSelectedItem(this.borrowCheckbutton);
						this.PAGE.PREVIOUS = this.PAGE.CURRENT;
					}

					if(this.PAGE.CURRENT === "loanList")
					{
						this.radioGroupObj.setSelectedItem(this.loanCheckbutton);
						this.PAGE.PREVIOUS = this.PAGE.CURRENT;
					}

					this.ID.DATE  = this.startDateField;
					this.ID.ENDDATE  = this.endDateField;
					this.ID.BORROWTYPE.FROM = this.borrowCheckbutton;
					this.ID.BORROWTYPE.TO = this.loanCheckbutton;
					this.ID.EXPORTMODE_0 = this.typeMode1CheckButton;
					this.ID.EXPORTMODE_1 = this.typeMode2CheckButton;
					this.ID.EXPORTMODE_2 = this.typeMode3CheckButton;

					if(allowExport)
					{
						this.exportToggle.setSelected(true);
						this.timeValueField.setVisible(true);
						this.typeMode1CheckButton.setVisible(true);
						this.typeMode2CheckButton.setVisible(true);
						this.typeMode3CheckButton.setVisible(true);
					}

					this.PAGE.CURRENT = "addPage";

					this.footerObj.setItemEnabled(0, false);

					this.hideAllPages();
					this.showPage(this.addPanel);
					break;

				// DELETELIST
				case 2:
					this.hideAllPages();

					// borrowPanel
					if(this.borrowList.isVisible() && this.borrowList.getItemCount() > 0)
					{
						this.borrowList.removeListenerById(this.LISTENER.LIST.BORROW);

						this.updateList(this.borrowList, 'mark');

						this.DeleteCancelButtons();

						this.showPage(this.borrowList);

					}

					// loanPanel
					if(this.loanList.isVisible() && this.loanList.getItemCount() > 0)
					{
						this.loanList.removeListenerById(this.LISTENER.LIST.LOAN);

						this.updateList(this.loanList, 'mark');

						this.DeleteCancelButtons();

						this.showPage(this.loanList);
					}
					break;

				// SAVE
				case 3:
					this.setLoading(true);

					var titleField = this.titleField,
						personField = this.personField,
						typeField = this.radioGroupObj,
						startDateField = this.startDateField,
						endDateField = this.endDateField,
						noteArea = this.noteArea,
						picURLField = this.picURL,
						timeValueField = this.timeValueField,
						modusField = this.alarmTypeGroupObj,
						requiredFields = [titleField, personField, startDateField],
						exportToggle = this.exportToggle;

					if(this.CheckFields(requiredFields, startDateField, endDateField))
					{
						// vars
						var title = titleField.getText(),
							person = personField.getText(),
							type = typeField.getSelectedItem() == this.ID.BORROWTYPE.FROM ? 1 : 2,
							start = Date.parse(startDateField.getText()).getTime(),
							end = endDateField.getText() ? Date.parse(endDateField.getText()).getTime() : -1,
							note = noteArea.getText(),
							pic = picURLField.getText(),
							time = 0,
							modus = 1,
							exportData = null,
							bufferItem = {
								"title": title,
								"type": type,
								"person": person,
								"date": start,
								"endDate": end,
								"pic": pic,
								"note": note,
								"eventId": -1
							};

						if(exportToggle.isSelected())
						{
							time = parseInt(timeValueField.getText(), 10);

							if(modusField.getSelectedItem() == this.ID.EXPORTMODE_0) // if no alarm
							{
								modus = 0;
							}

							if(modusField.getSelectedItem() == this.ID.EXPORTMODE_1) // if alarm + display
							{
								modus = 1;
							}

							if(modusField.getSelectedItem() == this.ID.EXPORTMODE_2) // if alarm + display
							{
								modus = 2;
							}

							exportData = {
								"time": time,
								"modus": modus
							};

							this.export2Calendar(bufferItem, exportData);
						}
						else // without calendar export
						{
							this.saveEntry(bufferItem);
						}
					}

					this.setLoading(false);
					break;

					// CANCEL
				case 4:
					if(this.PAGE.CURRENT === 'editPage')
					{
						this.hideAllPages();
						this.showPage(this.detailPanel);

						var index = this.detailIdLabelValue.getText(),
							db = localStorage.getItem("db"),
							data = JSON.parse(db).results,
							itemData = data[index];

						// MODIFY HEADER
						this.BackButtonHeader();
						this.headerObj.setTitleText(itemData.title);

						// MODIFY FOOTER
						this.EditDeleteButtons();

						this.clearForm();
					}
					else if(this.PAGE.CURRENT === 'addPage')
					{
						// MODIFY HEADER
						this.DefaultHeader();

						// MODIFY FOOTER
						this.AddDeleteButtons();

						this.hideAllPages();

						if(this.PAGE.PREVIOUS === 'borrowList' || this.PAGE.PREVIOUS == null)
						{
							this.showPage(this.borrowList);
						}

						if(this.PAGE.PREVIOUS === 'loanList')
						{
							this.showPage(this.loanList);
						}

						this.clearForm();
					}
					else
					{
						var itemsCount = 0,
							item = null,
							self = this;

						if(this.borrowList.isVisible())
						{
							this.updateList(this.borrowList, 'normal');

							this.AddDeleteButtons();

							this.LISTENER.LIST.BORROW = this.borrowList.addListener('listItemStateChange', this.onListAction, this);
						}

						if(this.loanList.isVisible())
						{
							this.updateList(this.loanList, 'mark');

							this.AddDeleteButtons();

							this.LISTENER.LIST.LOAN = this.loanList.addListener('listItemStateChange', this.onListAction, this);
						}
					}
					break;

				// DELETE FROM LIST
				case 5:
					var saveItem = {}; // open buffer object
						itemsCount = 0,
						item = null,
						idx = 0,
						dbResults = JSON.parse(localStorage.getItem('db')).results;

					if(this.borrowList.isVisible())
					{
						dbResults = this.removeFromList(this.borrowList, dbResults);

						saveItem.results = dbResults; // add changed dbResults to buffer object
						localStorage.setItem('db', JSON.stringify(saveItem)); // save buffer object to db

						if(this.isDBEmpty())
						{
							localStorage.removeItem('db');
						}

						this.AddDeleteButtons();

						this.LISTENER.LIST.BORROW = this.borrowList.addListener('listItemStateChange', this.onListAction, this);

						this.updateList(this.borrowList, 'normal');
					}

					if(this.loanList.isVisible())
					{
						dbResults = this.removeFromList(this.loanList, dbResults);

						saveItem.results = dbResults; // add changed dbResults to buffer object
						localStorage.setItem('db', JSON.stringify(saveItem)); // save buffer object to db

						if(this.isDBEmpty())
						{
							localStorage.removeItem('db');
						}

						this.AddDeleteButtons();

						this.LISTENER.LIST.LOAN = this.loanList.addListener('listItemStateChange', this.onListAction, this);

						this.updateList(this.loanList, 'normal');
					}
					break;

				// EDIT
				case 6:
					var allowExport = localStorage.getItem('allowExport');

					// change PAGE.CURRENT to 'editPage'
					this.PAGE.CURRENT = 'editPage';

					// MODIFY HEADER
					this.EditItemHeader();

					// MODIFY FOOTER
					this.SaveCancelButtons(8);

					var title = this.detailTitleLabelValue.getText(),
						person = this.detailPersonLabelValue.getText(),
						date = this.detailStartDateLabelValue.getText(),
						enddate = this.detailEndDateLabelValue.getText(),
						type = this.detailTypeLabelValue.getText(),
						note = this.detailNoteLabelValue.getText(),
						pic = this.detailPicLabelValue.getText(),
						id = this.detailIdLabelValue.getText(),
						box = type === ('loan') ? this.editLoanCheckbutton : this.editBorrowCheckbutton;

					this.ID.DATE  = this.editStartDateField;
					this.ID.ENDDATE  = this.editEndDateField;
					this.ID.BORROWTYPE.FROM = this.editBorrowCheckbutton;
					this.ID.BORROWTYPE.TO = this.editLoanCheckbutton;
					this.ID.EXPORTMODE_0 = this.editTypeMode1CheckButton;
					this.ID.EXPORTMODE_1 = this.editTypeMode2CheckButton;
					this.ID.EXPORTMODE_2 = this.editTypeMode3CheckButton;

					// fill edit fields
					this.editRadioGroupObj.setSelectedItem(box);
					this.editTitleField.setText(title);
					this.editPersonField.setText(person);
					this.editStartDateField.setText(date);
					this.editEndDateField.setText(enddate);
					this.editNoteArea.setText(note);

					if(allowExport)
					{
						this.showExportMenu(this.PAGE.CURRENT, true);
					}

					// hide all pages except editPage
					this.hideAllPages();
					this.showPage(this.editPanel);
					break;

				// DELETE ITEM FROM DETAILPAGE
				case 7:
					var index = this.detailIdLabelValue.getText(), // read index
						db = localStorage.getItem('db'), // open DB
						dbResults = JSON.parse(db).results; // query results

					dbResults.splice(index, 1); // remove item from dbResults

					var saveItem = {}; // create new object
					saveItem.results = dbResults; // fill results key with changed dbResults;
					localStorage.setItem('db', JSON.stringify(saveItem)); // save it on DB

					if(this.isDBEmpty())
					{
						localStorage.removeItem('db');
					}

					this.loadDB(); // reload db

					// modify header
					this.headerObj.setHeaderStyle(Osp.Ui.Controls.HeaderStyle.SEGMENTED);
					this.headerObj.addItem({actionId : 1, text : 'From'});
					this.headerObj.addItem({actionId : 2, text : 'To'});

					// modify footer
					this.AddDeleteButtons();

					this.hideAllPages();

					if(this.PAGE.PREVIOUS === 'borrowList')
					{
						this.showPage(this.borrowList);
					}

					if(this.PAGE.PREVIOUS === 'loanList')
					{
						this.showPage(this.loanList);

						this.headerObj.setItemSelected(1);
					}
					break;

				// SAVE EDIT
				case 8:
					this.setLoading(true);
					this.footerObj.setItemEnabled(0, false);

					var self = this,
						title = this.editTitleField,
						person = this.editPersonField,
						startDate = this.editStartDateField,
						endDate = this.editEndDateField,
						required = [title, person, startDate],
						index = this.detailIdLabelValue.getText();

					if(this.CheckFields(required, startDate, endDate))
					{
						var title = this.editTitleField.getText(),
							person = this.editPersonField.getText(),
							type = this.editRadioGroupObj.getSelectedItem() == this.ID.BORROWTYPE.FROM ? 1 : 2,
							start = Date.parse(this.editStartDateField.getText()).getTime(),
							end = this.editEndDateField.getText() ? Date.parse(this.editStartDateField.getText()).getTime() : -1,
							note = this.editNoteArea.getText(),
							pic = this.editPicURL.getText(),
							time = parseInt(this.editTimeValueField.getText(), 10),
							modus = null,
							eventId = this.detailEventIdLabelValue.getText() ? parseInt(this.detailEventIdLabelValue.getText(), 10) : -1,
							bufferItem = {
								"title": title,
								"type": type,
								"person": person,
								"date": start,
								"endDate": end,
								"pic": pic,
								"note": note,
								"eventId": eventId
							},
							exportData = null;

						if(exportToggle.isSelected())
						{
							time = parseInt(timeValueField.getText(), 10);

							if(modusField.getSelectedItem() == this.ID.EXPORTMODE_0) // if no alarm
							{
								modus = 0;
							}

							if(modusField.getSelectedItem() == this.ID.EXPORTMODE_1) // display only
							{
								modus = 1;
							}

							if(modusField.getSelectedItem() == this.ID.EXPORTMODE_2) // if alarm + display
							{
								modus = 2;
							}

							exportData = {
								"time": time,
								"modus": modus
							};

							if(!eventId)
							{
								this.export2Calendar(bufferItem, exportData, index);
							}
							else
							{
								this.updateEvent(bufferItem, exportData, index);
							}
						}
						else // without calendar export
						{
							this.saveEntry(bufferItem, index);
						}
					}
					break;
			}
		},

		onHeaderAction: function(e)
		{
			var actionId = e.getData().actionId;

			switch(actionId)
			{
				// BORROW
				case 1:
					this.hideAllPages();

					if(!this.borrowList.isVisible())
					{
						this.showPage(this.borrowList);
					}

					this.PAGE.CURRENT = 'borrowList';
					break;

				// LOAN
				case 2:
					this.hideAllPages();

					if(!this.loanList.isVisible())
					{
						this.showPage(this.loanList);
					}

					this.PAGE.CURRENT = 'loanList';
					break;

				// EXIT
				case 3:
					var userConfirm = confirm('Application will close now. Continue?');

					if(userConfirm)
					{
						Osp.App.Application.terminate();
					}
					break;

				// BACK
				case 4:
					if(this.contactList.isVisible())
					{
						this.showFooter(true);

						this.headerObj.removeAllItems(); // clean header
						this.headerObj.removeAllButtons(); // clean header
						this.headerObj.setHeaderStyle('title'); // set header style to "title"

						this.contactList.removeAllItems(); // clean contactList

						this.hideAllPages();

						if(this.PAGE.CURRENT === 'addPage')
						{
							this.headerObj.setTitleText(this.getMessage('IDS_TITLE_NEW_ITEM')); // update header text

							this.SaveCancelButtons(3); // add save (id:3) and cancel button.

							this.showPage(this.addPanel);
						}
						else
						{
							this.headerObj.setTitleText(this.getMessage('IDS_TITLE_EDIT_ITEM')); // update header text

							this.SaveCancelButtons(8); // add save (id:3) and cancel button.

							this.showPage(this.editPanel);
						}
					}
					else
					{
						this.showFooter(true);

						// MODIFY HEADER
						this.DefaultHeader();

						// MODIFY FOOTER
						this.AddDeleteButtons();

						this.hideAllPages();

						if(this.PAGE.PREVIOUS === 'borrowList')
						{
							this.showPage(this.borrowList);

							if(this.borrowList.getItemCount() === 0)
							{
								this.borrowList.removeAllItems();
							}
							this.borrowList.updateList();
						}

						if(this.PAGE.PREVIOUS === 'loanList')
						{
							this.showPage(this.loanList);

							this.headerObj.setItemSelected(1);

							if(this.loanList.getItemCount() == 0)
							{
								this.loanList.removeAllItems();
							}
							this.loanList.updateList();
						}
					}
					break;

				// SETTINGS
				case 5:
					var allowExport = localStorage.getItem("allowExport"),
						enableNotify = localStorage.getItem("enableNotify"),
						db = localStorage.getItem('db'),
						file = 'export.db',
						location = 'documents/borrowNone/data',
						fileSystemAPI = deviceapis.filesystem,
						importButton = this.importButton;

					function onSuccess(dir)
					{
						importButton.setEnabled(true);
					}

					function resolveCB(dir)
					{
						dir.listFiles(onSuccess, onError, {name: file});
					}

					function onError(e)
					{
						console.log("e.message := "+e.message);
						importButton.setEnabled(false);
					}

					fileSystemAPI.resolve(resolveCB, onError, location, 'r');

					if(this.borrowList.isVisible())
					{
						this.PAGE.PREVIOUS = 'borrowList';
					}

					if(this.loanList.isVisible())
					{
						this.PAGE.PREVIOUS = 'loanList';
					}

					// MODIFY HEADER
					this.BackButtonHeader();
					this.headerObj.setTitleText(this.getMessage('IDS_TITLE_SETTINGS'));

					// MODIFY FOOTER
					this.showFooter(false);

					if(allowExport)
					{
						this.allowExportCB.setSelected(true);
					}

					if(enableNotify)
					{
						this.allowNotifyCB.setSelected(true);
					}

					if(this.isDBEmpty())
					{
						this.exportButton.setEnabled(false);
					}
					else
					{
						this.exportButton.setEnabled(true);	
					}

					this.hideAllPages();
					this.showPage(this.settingsPanel);
					break;
			}
		},

		onButtonAction: function(e)
		{
			var self = this,
				actionId = e.getData().actionId;

			switch(actionId)
			{
				// CAMERA
				case 1:
					this.takeAPicture('camera');
					break;

				// LIBRARY
				case 2:
					this.takeAPicture('library');
					break;

				// CONTACTS
				case 3:
					this.getContacts();
					break;

				// EXPORT
				case 4:
					this.exportDB();
					break;

				// IMPORT
				case 5:
					this.importDB();
					break;
			}
		},

		onListAction: function(e)
		{
			var list = e.getData().source; // get list
				item = list.getItemAt(e.getData().index); // get listIndex

			if(this.loanList.isVisible() || this.borrowList.isVisible())
			{
				this.PAGE.PREVIOUS = this.borrowList.isVisible() ? 'borrowList' : 'loanList';

				var index = item.setting.descriptionText, // get arrayIndex
					db = localStorage.getItem('db'), // query db
					data  = JSON.parse(db).results, // query results
					itemData = data[index], // query one specific item
					eventId = (itemData.eventId && itemData.eventId !== -1) ? itemData.eventId : "",
					date = itemData.date,
					endDate = (itemData.endDate && itemData.endDate !== -1) ? itemData.endDate : "",
					type = "";

				if(itemData.type === 2 || itemData.type === 'loan')
				{
					type = "./images/00_icon_arrow-r.png";
				}

				if(itemData.type === 1 || itemData.type === 'borrow')
				{
					type = "./images/00_icon_arrow-l.png";
				}

				if(Osp.Core.Check.isPositiveNumber(date))
				{
					date = new Date(date).toLocaleDateString();
				}
				else
				{
					date = new Date(Date.parse(date)).toLocaleDateString();
				}

				if(endDate)
				{
					if(Osp.Core.Check.isPositiveNumber(endDate))
					{
						endDate = new Date(endDate).toLocaleDateString();
					}
					else
					{
						endDate = new Date(Date.parse(endDate)).toLocaleDateString();
					}
				}

				// set data
				this.detailPicLabelValue.setBackgroundImage(itemData.pic);
				this.detailTypeLabelValue.setBackgroundImage(type);
				this.detailPersonLabelValue.setText(itemData.person);
				this.detailStartDateLabelValue.setText(date);
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
			}
			else
			{
				var contactItem = item.setting.elements;

				this.headerObj.removeAllItems();
				this.headerObj.removeAllButtons();
				this.headerObj.setHeaderStyle('title');

				this.showFooter(true);

				this.contactList.removeAllItems();

				this.hideAllPages();

				if(this.PAGE.CURRENT === 'addPage')
				{
					this.headerObj.setTitleText(this.getMessage('IDS_TITLE_NEW_ITEM'));

					this.SaveCancelButtons(3);

					this.personField.setText(contactItem[0].text);

					if(this.checkEmptyFields([this.titleField, this.personField, this.atartDateField]))
					{
						this.footerObj.setItemEnabled(0, true);
					}
					else
					{
						this.footerObj.setItemEnabled(0, false);
					}

					this.showPage(this.addPanel);
				}
				else
				{
					this.headerObj.setTitleText(this.getMessage('IDS_TITLE_EDIT_ITEM'));

					this.SaveCancelButtons(8);

					this.editPersonField.setText(contactItem[0].text);

					if(this.checkEmptyFields([this.editTitleField, this.editPersonField, this.editStartDateField]))
					{
						this.footerObj.setItemEnabled(0, true);
					}
					else
					{
						this.footerObj.setItemEnabled(0, false);
					}

					this.showPage(this.editPanel);
				}
			}
		},

		onFastScrollIndexAction: function(e)
		{
			var index = e.getData().index,
				source = e.getData().source;

			console.log(index);
			console.log(source);
		},

		onContextChange: function(e)
		{
			var text = e.getData().text,
				source = e.getData().source, 
				chk1 = false,
				chk2 = false;

			if(this.PAGE.CURRENT === 'addPage')
			{
				chk1 = this.checkEmptyFields([this.titleField, this.personField, this.startDateField]);
			}

			if(this.PAGE.CURRENT === 'editPage')
			{
				chk1 = this.checkEmptyFields([this.editTitleField, this.editPersonField, this.editStartDateField]);
			}

			if(source == this.ID.DATE || source == this.ID.ENDDATE)
			{
				if(!Date.parse(text))
				{
					this.showPopup(source.getTitleText(), this.getMessage('IDS_ERROR_NO_DATE'), "ok");
					chk2 = false;
				}
				else
				{
					chk2 = true;
				}
			}

			if(chk1 && chk2)
			{
				this.footerObj.setItemEnabled(0, true);
			}
		}
	}
});