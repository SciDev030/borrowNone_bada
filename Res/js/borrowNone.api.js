Osp.Core.Mixin.define("borrowNone.API",
{
	members:
	{
		/**
		 * Remove related calendar item by eventId
		 * @param {Number} id
		 */
		removeEvent: function(eventId)
		{
			var cal = null,
				calenderAPI = deviceapis.pim.calendar; 

			function successCallback(events)
			{
				for(var i = 0; i < events.length; i++)
				{
					console.log("deleted event > id := "+events[i].id);
					return true;
				}
			}

			function errorCallback(response) {
				alert("Error [" + response.code+"]\nType: "+response.name+"\nMessage: "+response.message);
				return false;
			}

			function getCals(cals)
			{
				for(var i = 0; i < cals.length; i++)
				{
					if(cals[i].type === 1);
					{
						cal = cals[i];
						cal.deleteEvent(successCallback, errorCallback, eventId);
					}
				}
			}

			calenderAPI.getCalendars(getCals, errorCallback);
		},

		/**
		 * Updated related calendar item by eventId
		 * @param {Object} data
		 * @param {Object} exportdata
		 * @param {Number} index
		 */
		updateEvent: function(data, index)
		{
			var cal,
				self = this,
				calenderAPI = deviceapis.pim.calendar;

			function errorCallback(response) {
				alert("Error [" + response.code+"]\nType: "+response.name+"\nMessage: "+response.message); return false;
			}


			function getCals(cals)
			{
				for(var i = 0; i < cals.length; i++)
				{
					if(cals[i].type === 1);
					{
						cal = cals[i];
						break;
					}
				}

				function eventUpdateSuccess(evt)
				{
					var enableNotify = localStorage.getItem('enableNotify'),
						di = deviceapis.deviceinteraction;

					if(enableNotify)
					{
						function notifyCB() {
							console.log("[borrowNone.db.js] updateEvent > success > event.id := "+event.id);
						}

						function notifyError() {
							console.log("Failed to notify\n"+e.message);
						}

						di.startNotify(notifyCB, notifyError, 300);
					}

					console.log("Updated event > id "+evt[0].id);

					self.saveEntry(data, index);
				}

				function successCallback(events)
				{
					/*
					for(var i = 0; i < events.length; i++)
					{
						var type = data.type === 'borrow' ? "[->] " : "[<-] ";
						var status = data.type === 'borrow' ? "borrowed from "+data.person : "borrowed to "+data.person;
						var date = new Date(Date.parse(data.endDate));
	
						events[i].description = status+"\n"+data.note;
						events[i].summary = type+data.title;
						events[i].startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	
						if(exportdata)
						{
							events[i].alarmTrigger = exportdata.time;
							events[i].alarmType = exportdata.modus;
						}
					}
					*/
					var type = data.type === (1 || 'borrow') ? "[->] " : "[<-] ",
						status = data.type === (1 || 'borrow') ? "borrowed from "+data.person : "borrowed to "+data.person,
						date = date.endDate ? data.endDate : data.date;

					date = new Date(date);

					events[0].description = status+"\n"+data.note;
					events[0].summary = type+data.title;
					events[0].startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());

					if(data.exportdata)
					{
						events[0].alarmTrigger = -exportdata.time;
						events[0].alarmType = exportdata.modus;
					}

					cal.updateEvent(eventUpdateSuccess, errorCallback, events[0]);
				}

				cal.findEvents(successCallback, errorCallback, {id: data.eventId});
			}

			calenderAPI.getCalendars(getCals, errorCallback);
		},

		/**
		 * Add a related calendar item for a dataset
		 * @param {Object} data
		 * @param {Object} exportdata
		 * @param {Number} index
		 */
		export2Calendar: function(data, index)
		{
			var self = this,
				calenderAPI = deviceapis.pim.calendar;

			function eventAddedCB(event)
			{
				var enableNotify = localStorage.getItem('enableNotify'),
					di = deviceapis.deviceinteraction;

				if(enableNotify)
				{
					function notifyCB() {
						console.log("[borrowNone.db.js] export2Calendar > success > event.id := "+event.id);
					}

					function notifyError() {
						console.log("Failed to notify\n"+e.message);
					}

					di.startNotify(notifyCB, notifyError, 300);
				}

				data.eventId = event.id;

				self.saveEntry(data, index);
			}

			function errorCallback(response)
			{
				alert("Error [" + response.code+"]\nType: "+response.name+"\nMessage: "+response.message);
			}

			function getCals(calendars)
			{
				var cal = null,
					type = null,
					date = null,
					event = null;

				for(var i = 0; i < calendars.length; i++)
				{
					if(calendars[i].type === 1);
					{
						cal = calendars[i];
						break;
					}
				}

				type = data.type === (1 || 'borrow') ? "[->] " : "[<-] ";
				status = data.type === (1 || 'borrow') ? "borrowed from "+data.person : "borrowed to "+data.person;
				date = data.endDate !== -1 ? data.endDate : data.date;
				event = cal.createEvent();

				date = new Date(date);

				event.summary = type+data.title;
				event.description = status+"\n"+data.note;
				event.startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());

				if(data.exportdata)
				{
					event.alarmTrigger = -exportdata.time; // negative integer as before the date mark
					event.alarmType = exportdata.modus;
				}

				cal.addEvent(eventAddedCB, errorCallback, event);
			}

			calenderAPI.getCalendars(getCals, errorCallback);
		},

		getContacts: function()
		{
			// MODIFY FOOTER
			this.showFooter(false); // hide footer on contactList

			// MODIFY HEADER
			this.BackButtonHeader(); // add back button to header
			this.headerObj.setTitleText(this.getMessage('IDS_TITLE_CONTACTS')); // change header title

			this.hideAllPages();
			this.showPage(this.contactList);

			this.setLoading(true); // show load animation

			var book = null,
				contact = null,
				contactArray = [],
				indices = [],
				indexString = '',
				contactList = this.contactList;
				item = null,
				self = this,
				runs = 0,
				runsMax = 0,
				boundsSetting = {x: 20, y: 0, width: 440, height: 100},
				contactAPI = deviceapis.pim.contact,
				popup = null;

			function findSuccess(contacts)
			{
				if(contacts.length > 0)
				{
					var contacts_length = contacts.length;

					for(var i = 0; i < contacts_length; i++)
					{
						var displayName = '',
							index = '';

						contact = contacts[i];

						// fullname contains firstname and lastname
						if(contact.firstName && contact.lastName)
						{
							displayName = contact.firstName+' '+contact.lastName;
						}

						// fullname contains firstname, but not lastname
						if(contact.firstName && !contact.lastName)
						{
							displayName = contact.firstName;
						}

						// fullname contains lastname, but not firstname
						if(!contact.firstName && contact.lastName)
						{
							displayName = contact.lastName;
						}

						if(!Osp.Core.ArrayHelper.contains(contactArray, displayName)) // if name already in contactArray
						{
							index = Osp.Core.StringHelper.substr(displayName,0,1); // cut only the first letter from name
							if(!Osp.Core.ArrayHelper.contains(indices, index)) // if index already in indices
							{
								indices.push(index);
							}

							contactArray.push(displayName); // push displayName to contactArray
						}
					}
					runs++;

					if(runs === runsMax) // check if all addressbooks are completed
					{
						contactArray.sort(); // alphabetic order

						for(var j = 0; j < contactArray.length; j++)
						{
							item =
							{
								height: 100,
								setting:
								{
									backgroundColor: {
										normal: '#000000',
										pressed: '#0674a5'
									},
									annex: 'normal',
									elements: []
								}
							};

							item.setting.elements.push({
								bounds: boundsSetting,
								text: contactArray[j],
								selectable: false,
								textSize: 40,
								textColor: {
									normal: '#FFFFFF',
									pressed: '#CCCCCC'},
								textSliding: true
							});

							contactList.addItem(item);
							contactList.updateList();
						}

						/*
						// generate fastScroll list
						if(contactList.getItemCount() > 1)
						{
							indices.sort();

							for(var k = 0; k < indices.length; k++)
							{
								indexString += indices[k];
							}
							contactList.setFastScrollIndex(indexString);
						}
						*/

						self.setLoading(false);
					}
				}
				else
				{
					contactList.updateList();
					self.setLoading(false);
				}
			}

			function addressBooksCB(books)
			{
				//self.setLoading(true);

				if(books.length > 0)
				{

					runsMax = books.length;

					for(var i = 0; i < books.length; i++)
					{
						book = books[i];

						book.findContacts(findSuccess, null);
					}
				}
				else
				{
					contactList.updateList();
					self.setLoading(false);
				}
			}

			contactAPI.getAddressBooks(addressBooksCB, null);
		},

		/**
		 * Start camera to take a picture directly or opens Content Picker to select are already saved picture
		 * @param mode
		 * @since 1.1.0
		 * @author Marco Büttner
		 */
		takeAPicture: function(mode)
		{
			var self = this,
				dataList = ['type:camera'],
				appControl = Osp.App.AppManager.findAppControl("osp.appcontrol.provider.camera", "osp.appcontrol.operation.capture"),
				result = null;

			if(mode === 'library')
			{
				dataList[0] = "selectionType:single";
				dataList[1] = "type:image";

				appControl = Osp.App.AppManager.findAppControl("osp.appcontrol.provider.media", "osp.appcontrol.operation.pick");
			}

			if(appControl)
			{
				function callback(cbtype, appControlId, operationId, resultList)
				{
					if(cbtype === 'onAppControlCompleted')
					{
						if(resultList[0] === 'Succeeded')
						{
							result = resultList[1];

							if(self.PAGE.CURRENT === 'editPage')
							{
								self.editPicURL.setText(result);
								self.editPicObj.setBackgroundImage(result);
								self.editPicObj.setVisible(true);
							}
							else
							{
								self.picURL.setText(result);
								self.picObj.setBackgroundImage(result);
								self.picObj.setVisible(true);
							}
						}
					}
				}

				appControl.start(dataList, callback);
			}
		}
	}
});