Osp.Core.Mixin.define("borrowNone.Ui",
{
	members:
	{
		CONST:
		{
			BODYHEIGHT: 0
		},

		/**
		 * Generate all UI elements
		 * @author Marco Büttner
		 * @since 1.0.0
		 */
		loadUI: function()
		{
			this.mainForm = new Osp.Ui.Controls.Form({style:Osp.Ui.Controls.FormStyle.INDICATOR | Osp.Ui.Controls.FormStyle.HEADER | Osp.Ui.Controls.FormStyle.FOOTER});
			this.mainForm.setOrientation('portrait');
			this.frameObj.addControl(this.mainForm);
			this.frameObj.setCurrentForm(this.mainForm);

			this.CONST.BODYHEIGHT = this.getBodyHeight(this.mainForm, true);

			this.createHeader();
			this.createFooter();
			this.createBody();
		},

		/**
		 * Generate default Header
		 * @since 1.0.0
		 * @author Marco Büttner
		 */
		createHeader: function()
		{
			this.headerObj = this.mainForm.getHeader();
			this.DefaultHeader();

			this.headerObj.addListener("actionPerform", this.onHeaderAction, this);
		},

		/**
		 * Generate default footer
		 * @since 1.0.0
		 * @author Marco Büttner
		 */
		createFooter: function()
		{
			this.footerObj = this.mainForm.getFooter();

			this.AddDeleteButtons();

			this.footerObj.setButtonTextColor({normal: '#ffffff', disabled: '#989898'});
			this.footerObj.setItemTextColor({normal: '#ffffff', disabled: '#989898'});
			this.footerObj.setButtonColor({pressed: '#5fa8dc', disabled: '#526474'});
			this.footerObj.setItemColor({pressed: '#5fa8dc', disabled: '#526474'});

			this.footerObj.addListener("actionPerform", this.onFooterAction, this);
		},

		/**
		 * Generate all body elements
		 * @author Marco Büttner
		 * @since 1.0.0
		 */
		createBody: function()
		{
			var allowExport = localStorage.getItem('allowExport');

			// "FROM"-List
			this.borrowList = new Osp.Ui.Controls.List({
				bounds: {x: 0, y: 0, width: 480, height: this.CONST.BODYHEIGHT},
				itemDivider : true,
				fastScroll : false
			});
			this.borrowList.setBackgroundColor('#000000');
			this.borrowList.setImageOfEmptyList('images/00_icon_empty.png' , {width : 256, height:256});
			this.borrowList.updateList();

			this.LISTENER.LIST.BORROW = this.borrowList.addListener('listItemStateChange', this.onListAction, this);

			this.mainForm.addControl(this.borrowList);

			// "TO"-LIST
			this.loanList = new Osp.Ui.Controls.List({
				bounds: {x: 0, y: 0, width: 480, height: this.CONST.BODYHEIGHT},
				itemDivider : true,
				fastScroll : false
			});
			this.loanList.setBackgroundColor('#000000');
			this.loanList.setImageOfEmptyList('images/00_icon_empty.png' , {width : 256, height:256});
			this.loanList.updateList();

			this.LISTENER.LIST.LOAN = this.loanList.addListener('listItemStateChange', this.onListAction, this);

			this.mainForm.addControl(this.loanList);


			// ADDPAGE //
			this.addPanel = new Osp.Ui.Controls.ScrollPanel({
				bounds: {x: 0, y: 0, width: 480, height: this.CONST.BODYHEIGHT}
			});
			this.addPanel.setBackgroundColor('#000000');
			this.mainForm.addControl(this.addPanel);

			// NEW_TITLE
			this.titleField = new Osp.Ui.Controls.EditField({
				bounds: {x:20, y:5, width:440, height:102},
				limitLength: 200,
				editFieldStyle: 'text',
				groupStyle: 'single',
				editFieldTitleStyle: 'top',
				enableClear: false,
				showTitle: true
			});
			this.titleField.setTitleText(this.getMessage('IDS_FIELD_TITLE'));
			this.titleField.setGuideText(this.getMessage('IDS_FIELD_REQUIRED'));
			this.titleField.setFocusable(true);

			// NEW_BORROWCHECK_BTN
			this.borrowCheckbutton = new Osp.Ui.Controls.CheckButton({
				bounds: {x: 20, y: this.setY(this.titleField, 15), width:215, height:72},
				style: Osp.Ui.Controls.CheckButtonStyle.MARK,
				groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE,
				backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT,
				text: this.getMessage('IDS_BUTTON_FROM')
			});
			this.borrowCheckbutton.setActionId(1);

			// NEW_LOANCHECK_BTN
			this.loanCheckbutton = new Osp.Ui.Controls.CheckButton({
				bounds: {x: 245, y: this.setY(this.titleField, 15), width:215, height:72},
				style: Osp.Ui.Controls.CheckButtonStyle.MARK,
				groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE,
				backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT,
				text: this.getMessage('IDS_BUTTON_TO')
			});
			this.loanCheckbutton.setActionId(2);

			// NEW_RADIOGROUP
			this.radioGroupObj = new Osp.Ui.Controls.RadioGroup();
			this.radioGroupObj.add(this.borrowCheckbutton);
			this.radioGroupObj.add(this.loanCheckbutton);

			// NEW_PERSON
			this.personField = new Osp.Ui.Controls.EditField({
				bounds: {x: 20, y: this.setY(this.loanCheckbutton, 15), width:330, height:102},
				limitLength: 200,
				editFieldStyle: 'text',
				groupStyle: 'single',
				editFieldTitleStyle: 'top',
				enableClear: false,
				showTitle: true
			});
			this.personField.setTitleText(this.getMessage('IDS_FIELD_PERSON'));
			this.personField.setGuideText(this.getMessage('IDS_FIELD_REQUIRED'));
			this.personField.setFocusable(true);

			// NEW_PERSON_BTN
			this.personButton = new Osp.Ui.Controls.Button({
				text:'',
				bounds: {x: 365, y: this.setY(this.loanCheckbutton, 26), width: 80, height: 80},
				actionId: 3
			});
			this.personButton.setIcon(this.setIcon('contact'), {x:9,y:9,width:45,height:45});

			// NEW_STARTDATE
			this.startDateField = new Osp.Ui.Controls.EditField({
				bounds: {x: 20, y: this.setY(this.personField, 15), width: 215, height: 102},
				limitLength: 20,
				editFieldStyle: 'text',
				groupStyle: 'single',
				editFieldTitleStyle: 'top',
				enableClear: false,
				showTitle: true
			});
			this.startDateField.setTitleText(this.getMessage('IDS_FIELD_START_DATE'));
			this.startDateField.setGuideText(this.getMessage('IDS_FIELD_REQUIRED'));
			this.startDateField.setFocusable(true);
			this.startDateField.setTextSize(29);

			// NEW_ENDDATE
			this.endDateField = new Osp.Ui.Controls.EditField({
				bounds: {x: 245, y: this.setY(this.personField, 15), width: 215, height: 102},
				limitLength: 20,
				editFieldStyle: 'text',
				groupStyle: 'single',
				editFieldTitleStyle: 'top',
				enableClear: false,
				showTitle: true
			});
			this.endDateField.setTitleText(this.getMessage('IDS_FIELD_END_DATE'));
			this.endDateField.setTextSize(29);

			// NEW_CAM_BTN
			this.cameraButton = new Osp.Ui.Controls.Button({
				text:'',
				bounds: {x: 20, y: this.setY(this.endDateField, 15), width: 80, height: 80},
				actionId: 1
			});
			this.cameraButton.setIcon(this.setIcon('camera'), {x:9,y:9,width:45,height:45});

			// NEW_LIB_BTN
			this.libraryButton = new Osp.Ui.Controls.Button({
				text:'',
				bounds: {x: 110, y: this.setY(this.endDateField, 15), width: 80, height: 80},
				actionId: 2
			});
			this.libraryButton.setIcon(this.setIcon('library'), {x:9,y:9,width:45,height:45});

			// NEW_PREVIEW
			this.previewLabel = new Osp.Ui.Controls.Label({
				bounds: {x: 225, y: this.setY(this.endDateField, 30), width: 150, height: 40},
				text: this.getMessage('IDS_FIELD_PREVIEW'),
				multiLine: false
			});
			this.previewLabel.setTextSize(this.STYLE.TEXT.SIZE.TINY);

			// NEW_PICOBJ
			this.picObj = new Osp.Ui.Controls.Label({
				bounds: {x: 360, y: this.setY(this.endDateField, 15), width: 80, height: 80},
				multiLine: false
			});
			this.picObj.setVisible(false);

			// NEW_PICURL
			this.picURL = new Osp.Ui.Controls.EditField({
				bounds: {x: 0, y: 0, width: 0, height: 0},
				limitLength: 255
			});
			this.picURL.setEnabled(false);
			this.picURL.setVisible(false); 

			// NEW_NOTEAREA
			this.noteArea = new Osp.Ui.Controls.EditArea({
				bounds: {x: 20, y: this.setY(this.picObj, 15), width: 440, height: 160},
				limitLength: 1000
			});
			this.noteArea.setGuideText(this.getMessage('IDS_FIELD_NOTE_TEXT'));

			// NEW_EXPORTTOGGLE
			this.exportToggle = new Osp.Ui.Controls.CheckButton({
				bounds: {x: 20, y: this.setY(this.noteArea, 25), width: 440, height: 72},
				style: Osp.Ui.Controls.CheckButtonStyle.ONOFF,
				groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE,
				backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT,
				text: this.getMessage('IDS_BUTTON_ADD_TO_CALENDAR')
			});
			this.exportToggle.setActionId(10, 11);

			// NEW_ENDDATE
			this.timeValueField = new Osp.Ui.Controls.EditField({
				bounds: {x: 20, y: this.setY(this.exportToggle, 10), width: 440, height: 102},
				limitLength: 3,
				editFieldStyle: 'number',
				groupStyle: Osp.Ui.Controls.GroupStyle.MIDDLE,
				editFieldTitleStyle: 'top',
				enableClear: false,
				showTitle: true
			});
			this.timeValueField.setTitleText(this.getMessage('IDS_FIELD_ALARM_TIME'));
			this.timeValueField.setTextSize(28);
			this.timeValueField.setVisible(false);

			this.typeMode1CheckButton = new Osp.Ui.Controls.CheckButton({
				bounds: {x: 20, y: this.setY(this.timeValueField, 10), width: 440, height: 72},
				style: Osp.Ui.Controls.CheckButtonStyle.MARK,
				groupStyle: Osp.Ui.Controls.GroupStyle.TOP,
				backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT,
				text: this.getMessage('IDS_BUTTON_NO_ALARM')
			});

			this.typeMode2CheckButton = new Osp.Ui.Controls.CheckButton({
				bounds: {x: 20, y: this.setY(this.typeMode1CheckButton, 0), width: 440, height: 72},
				style: Osp.Ui.Controls.CheckButtonStyle.MARK,
				groupStyle: Osp.Ui.Controls.GroupStyle.MIDDLE,
				backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT,
				text: this.getMessage('IDS_BUTTON_DISPLAY_ONLY')
			});

			this.typeMode3CheckButton = new Osp.Ui.Controls.CheckButton({
				bounds: {x: 20, y: this.setY(this.typeMode2CheckButton, 0), width: 440, height: 72},
				style: Osp.Ui.Controls.CheckButtonStyle.MARK,
				groupStyle: Osp.Ui.Controls.GroupStyle.BOTTOM,
				backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT,
				text: this.getMessage('IDS_BUTTON_DISPLAY_SOUND')
			});

			// NEW_RADIOGROUP
			this.alarmTypeGroupObj = new Osp.Ui.Controls.RadioGroup();
			this.alarmTypeGroupObj.add(this.typeMode1CheckButton);
			this.alarmTypeGroupObj.add(this.typeMode2CheckButton);
			this.alarmTypeGroupObj.add(this.typeMode3CheckButton);
			this.alarmTypeGroupObj.setSelectedItem(this.typeMode2CheckButton);

			this.typeMode1CheckButton.setVisible(false);
			this.typeMode2CheckButton.setVisible(false);
			this.typeMode3CheckButton.setVisible(false);

			if(allowExport)
			{
				this.exportToggle.setSelected(true);
				this.typeMode1CheckButton.setVisible(true);
				this.typeMode2CheckButton.setVisible(true);
				this.typeMode3CheckButton.setVisible(true);
			}

			// NEW_EVENTLISTENER
			this.titleField.addListener('textValueChange', this.onContextChange, this);
			this.personField.addListener('textValueChange', this.onContextChange, this);
			this.startDateField.addListener('textValueChange', this.onContextChange, this);
			this.endDateField.addListener('textValueChange', this.onContextChange, this);
			this.personButton.addListener('actionPerform', this.onButtonAction, this);
			this.cameraButton.addListener('actionPerform', this.onButtonAction, this);
			this.libraryButton.addListener('actionPerform', this.onButtonAction, this);
			this.borrowCheckbutton.addListener('actionPerform', this.onCheckButtonAction, this);
			this.loanCheckbutton.addListener('actionPerform', this.onCheckButtonAction, this);
			this.exportToggle.addListener('actionPerform', this.onCheckButtonAction, this);

			// add forms to addPanel
			this.addPanel.addControl(this.titleField);
			this.addPanel.addControl(this.borrowCheckbutton);
			this.addPanel.addControl(this.loanCheckbutton);
			this.addPanel.addControl(this.personField);
			this.addPanel.addControl(this.personButton);
			this.addPanel.addControl(this.startDateField);
			this.addPanel.addControl(this.endDateField);
			this.addPanel.addControl(this.picURL);
			this.addPanel.addControl(this.picObj);
			this.addPanel.addControl(this.previewLabel);
			this.addPanel.addControl(this.cameraButton);
			this.addPanel.addControl(this.libraryButton);
			this.addPanel.addControl(this.noteArea);
			this.addPanel.addControl(this.exportToggle);
			this.addPanel.addControl(this.timeValueField);
			this.addPanel.addControl(this.typeMode1CheckButton);
			this.addPanel.addControl(this.typeMode2CheckButton);
			this.addPanel.addControl(this.typeMode3CheckButton);


			// CONTACTLIST //
			this.contactList = new Osp.Ui.Controls.List({
				bounds: {x: 0, y: 0, width: 480, height: this.getBodyHeight(this.mainForm, false)},
				itemDivider : true,
				fastScroll : false
			});
			this.contactList.setBackgroundColor('#000000');
			this.contactList.setImageOfEmptyList('images/00_icon_empty.png' , {width : 256, height:256});

			this.contactList.updateList();

			this.contactList.addListener('listItemStateChange', this.onListAction, this);
			this.contactList.addListener('fastScrollIndexSelect', this.onFastScrollIndexAction, this);

			this.mainForm.addControl(this.contactList);


			// SETTINGSPAGE //
			this.settingsPanel = new Osp.Ui.Controls.Panel({
				bounds: {x: 0, y: 0, width: 480, height: this.getBodyHeight(this.mainForm, false)},
				groupStyle: 'none'
			});
			this.settingsPanel.setBackgroundColor('#000000');
			this.mainForm.addControl(this.settingsPanel);

			// SETTINGS_ALLOWEXPORT
			this.allowExportCB = new Osp.Ui.Controls.CheckButton({
				bounds: {x: 20, y: 10, width: 440, height: 72},
				style:Osp.Ui.Controls.CheckButtonStyle.ONOFF, 
				groupStyle:Osp.Ui.Controls.GroupStyle.TOP,
				backGroundStyle:Osp.Ui.Controls.BackgroundStyle.DEFAULT,
				text: this.getMessage('IDS_BUTTON_ALLOW_EXPORT')
			});
			this.allowExportCB.setActionId(3, 4);

			// SETTING_ALLOWNOTIFY
			this.allowNotifyCB = new Osp.Ui.Controls.CheckButton({
				bounds: {x: 20,y: this.setY(this.allowExportCB, 0), width: 440, height: 72},
				style:Osp.Ui.Controls.CheckButtonStyle.ONOFF, 
				groupStyle:Osp.Ui.Controls.GroupStyle.BOTTOM,
				backGroundStyle:Osp.Ui.Controls.BackgroundStyle.DEFAULT,
				text: this.getMessage('IDS_BUTTON_ENABLE_NOTIFY')
			});
			this.allowNotifyCB.setActionId(5, 6);

			this.exportButton = new Osp.Ui.Controls.Button({
				text: this.getMessage('IDS_BUTTON_EXPORT_DB'),
				bounds: {x: 20, y: this.setY(this.allowNotifyCB, 30), width: 440, height: 60},
				actionId: 4
			});

			this.importButton = new Osp.Ui.Controls.Button({
				text: this.getMessage('IDS_BUTTON_IMPORT_DB'),
				bounds: {x: 20, y: this.setY(this.exportButton, 5), width: 440, height: 60},
				actionId: 5
			});
			this.importButton.setEnabled(false);

			this.allowExportCB.addListener('actionPerform', this.onCheckButtonAction,this);
			this.allowNotifyCB.addListener('actionPerform', this.onCheckButtonAction,this);
			this.exportButton.addListener('actionPerform', this.onButtonAction,this);
			this.importButton.addListener('actionPerform', this.onButtonAction,this);

			this.settingsPanel.addControl(this.allowExportCB);
			this.settingsPanel.addControl(this.allowNotifyCB);
			this.settingsPanel.addControl(this.exportButton);
			this.settingsPanel.addControl(this.importButton);


			// DETAILPAGE //
			this.detailPanel = new Osp.Ui.Controls.ScrollPanel({
				bounds: {x: 0, y: 0, width: 480, height: this.CONST.BODYHEIGHT}
			});
			this.detailPanel.setBackgroundColor('#000000');
			this.mainForm.addControl(this.detailPanel);

			// DETAIL_ID
			this.detailIdLabelValue = new Osp.Ui.Controls.Label({
				bounds: {x: 0, y: 0, width: 0, height: 0},
				text:'',
				multiLine: false
			});
			this.detailIdLabelValue.setVisible(false);
			// DETAIL_EVENTID
			this.detailEventIdLabelValue = new Osp.Ui.Controls.Label({
				bounds: {x: 0, y: 0, width: 0, height: 0},
				text:'',
				multiLine: false
			});
			this.detailEventIdLabelValue.setVisible(false);
			// DETAIL_TITLE
			this.detailTitleLabelValue = new Osp.Ui.Controls.Label({
				bounds: {x: 0, y: 0, width: 0, height: 0},
				text:'',
				multiLine: false
			});
			this.detailTitleLabelValue.setVisible(false);

			// DETAIL_PIC
			this.detailPicLabelValue = new Osp.Ui.Controls.Label({
				bounds: {x: 227, y: 10, width: 200, height: 200},
				text:'',
				multiLine: false
			});

			// DETAIL_TYPE
			this.detailTypeLabel = new Osp.Ui.Controls.Label({
				bounds: {x: 20, y: 10, width: 215, height: 40},
				text: this.getMessage('IDS_FIELD_TYPE'),
				multiLine: false
			});
			this.detailTypeLabel.setTextSize(this.STYLE.TEXT.SIZE.TINY);
			this.detailTypeLabelValue = new Osp.Ui.Controls.Label({
				bounds: {x: 20, y: this.setY(this.detailTypeLabel, 5), width: 60, height: 60},
				text:'',
				multiLine: false
			});
			this.detailTypeLabelValue.setTextColor(this.STYLE.TEXT.COLOR.HIGHLIGHTED);

			// DETAIL_PERSON
			this.detailPersonLabel = new Osp.Ui.Controls.Label({
				bounds: {x: 20, y: this.setY(this.detailTypeLabelValue, 10), width: 215, height: 40},
				text: this.getMessage('IDS_FIELD_PERSON'),
				multiLine: false
			});
			this.detailPersonLabel.setTextSize(this.STYLE.TEXT.SIZE.TINY);
			this.detailPersonLabelValue = new Osp.Ui.Controls.Label({
				bounds: {x: 20, y: this.setY(this.detailPersonLabel, 5), width: 215, height: 40},
				text:'',
				multiLine: false
			});
			this.detailPersonLabelValue.setTextColor(this.STYLE.TEXT.COLOR.HIGHLIGHTED);

			// DETAIL_STARTDATE
			this.detailStartDateLabel = new Osp.Ui.Controls.Label({
				bounds: {x: 20, y: this.setY(this.detailPersonLabelValue, 10), width: 215, height: 40},
				text:this.getMessage('IDS_FIELD_START_DATE'),
				multiLine: false
			});
			this.detailStartDateLabel.setTextSize(this.STYLE.TEXT.SIZE.TINY);
			this.detailStartDateLabelValue = new Osp.Ui.Controls.Label({
				bounds: {x: 20, y: this.setY(this.detailStartDateLabel, 5), width: 440, height: 40},
				text:'',
				multiLine: false
			});
			this.detailStartDateLabelValue.setTextColor(this.STYLE.TEXT.COLOR.HIGHLIGHTED);

			// DETAIL_ENDDATE
			this.detailEndDateLabel = new Osp.Ui.Controls.Label({
				bounds: {x: 20, y: this.setY(this.detailStartDateLabelValue, 10), width: 215, height: 40},
				text:this.getMessage('IDS_FIELD_END_DATE'),
				multiLine: false
			});
			this.detailEndDateLabel.setTextSize(this.STYLE.TEXT.SIZE.TINY);
			this.detailEndDateLabelValue = new Osp.Ui.Controls.Label({
				bounds: {x: 20, y: this.setY(this.detailEndDateLabel, 5), width: 440, height: 40},
				text:'',
				multiLine: false
			});
			this.detailEndDateLabelValue.setTextColor(this.STYLE.TEXT.COLOR.HIGHLIGHTED);

			// DETAIL_NOTE
			this.detailNoteLabelValue = new Osp.Ui.Controls.Label({
				bounds: {x: 20, y: this.setY(this.detailEndDateLabelValue, 10), width: 440, height: 100},
				text:'',
				multiLine: true
			});

			this.detailPanel.addControl(this.detailIdLabelValue);
			this.detailPanel.addControl(this.detailEventIdLabelValue);
			this.detailPanel.addControl(this.detailTitleLabelValue);
			this.detailPanel.addControl(this.detailPicLabelValue);
			this.detailPanel.addControl(this.detailTypeLabel);
			this.detailPanel.addControl(this.detailTypeLabelValue);
			this.detailPanel.addControl(this.detailPersonLabel);
			this.detailPanel.addControl(this.detailPersonLabelValue);
			this.detailPanel.addControl(this.detailStartDateLabel);
			this.detailPanel.addControl(this.detailStartDateLabelValue);
			this.detailPanel.addControl(this.detailEndDateLabel);
			this.detailPanel.addControl(this.detailEndDateLabelValue);
			this.detailPanel.addControl(this.detailNoteLabelValue);


			// EDITPAGE //
			this.editPanel = new Osp.Ui.Controls.ScrollPanel({
				bounds: {x: 0, y: 0, width: 480, height: this.CONST.BODYHEIGHT}
			});
			this.editPanel.setBackgroundColor('#000000');
			this.mainForm.addControl(this.editPanel);

			// EDITT_ITLE
			this.editTitleField = new Osp.Ui.Controls.EditField({
				bounds: {x: 20, y: 5, width: 440, height: 102},
				limitLength: 200,
				editFieldStyle: 'text',
				groupStyle: 'single',
				editFieldTitleStyle: 'top',
				enableClear: false,
				showTitle: true
			});
			this.editTitleField.setTitleText(this.getMessage('IDS_FIELD_TITLE'));
			this.editTitleField.setGuideText('Required!');

			// EDIT_BORROWCHECK_BTN
			this.editBorrowCheckbutton = new Osp.Ui.Controls.CheckButton({
				bounds: {x: 20, y: this.setY(this.editTitleField, 15), width: 210, height: 72},
				style: Osp.Ui.Controls.CheckButtonStyle.MARK,
				groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE,
				backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT,
				text: this.getMessage('IDS_BUTTON_FROM')
			});
			this.editBorrowCheckbutton.setActionId(1);

			// EDIT_LOANCHECK_BTN
			this.editLoanCheckbutton = new Osp.Ui.Controls.CheckButton({
				bounds: {x: 250, y: this.setY(this.editTitleField, 15), width: 210, height: 72},
				style: Osp.Ui.Controls.CheckButtonStyle.MARK,
				groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE,
				backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT,
				text: this.getMessage('IDS_BUTTON_TO')
			});
			this.editLoanCheckbutton.setActionId(2);

			// EDIT_RADIOGROUP
			this.editRadioGroupObj = new Osp.Ui.Controls.RadioGroup();
			this.editRadioGroupObj.add(this.editBorrowCheckbutton);
			this.editRadioGroupObj.add(this.editLoanCheckbutton);

			// EDIT_PERSON
			this.editPersonField = new Osp.Ui.Controls.EditField({
				bounds: {x:20, y: this.setY(this.editLoanCheckbutton, 15), width: 330, height:102},
				limitLength: 200,
				editFieldStyle: 'text',
				groupStyle: 'single',
				editFieldTitleStyle: 'top',
				enableClear: false,
				showTitle: true
			});
			this.editPersonField.setTitleText(this.getMessage('IDS_FIELD_PERSON'));
			this.editPersonField.setGuideText('Required!');

			// EDIT_PERSON_BTN
			this.editPersonButton = new Osp.Ui.Controls.Button({
				text:'',
				bounds: {x: 360, y: this.setY(this.editLoanCheckbutton, 26), width: 80, height: 80},
				actionId: 3
			});
			this.editPersonButton.setIcon(this.setIcon('contact'), {x:9,y:9,width:45,height:45});

			// EDIT_STARTDATE
			this.editStartDateField = new Osp.Ui.Controls.EditField({
				bounds: {x: 20, y: this.setY(this.editPersonField, 15), width: 210, height: 102},
				limitLength: 20,
				editFieldStyle: 'text',
				groupStyle: 'single',
				editFieldTitleStyle: 'top',
				enableClear: false,
				showTitle: true
			});
			this.editStartDateField.setTitleText(this.getMessage('IDS_FIELD_START_DATE'));
			this.editStartDateField.setGuideText('Required!');
			this.editStartDateField.setTextSize(29);
			

			// EDIT_ENDDATE
			this.editEndDateField = new Osp.Ui.Controls.EditField({
				bounds: {x: 250, y: this.setY(this.editPersonField, 15), width: 210, height: 102},
				limitLength: 20,
				editFieldStyle: 'text',
				groupStyle: 'single',
				editFieldTitleStyle: 'top',
				enableClear: false,
				showTitle: true
			});
			this.editEndDateField.setTitleText(this.getMessage('IDS_FIELD_END_DATE'));
			this.editEndDateField.setTextSize(29);

			// EDIT_CAM_BTN
			this.editCameraButton = new Osp.Ui.Controls.Button({
				text:'',
				bounds: {x: 20, y: this.setY(this.editEndDateField, 15), width: 80, height: 80},
				actionId: 1
			});
			this.editCameraButton.setIcon(this.setIcon('camera'), {x:9,y:9,width:45,height:45});

			// EDIT_LIB_BTN
			this.editLibraryButton = new Osp.Ui.Controls.Button({
				text:'',
				bounds: {x: 110, y: this.setY(this.editEndDateField, 15), width: 80, height: 80},
				actionId: 2
			});
			this.editLibraryButton.setIcon(this.setIcon('library'), {x:9, y:9,width:45,height:45});

			// EDIT_PREVIEW
			this.editPreviewLabel = new Osp.Ui.Controls.Label({
				bounds: {x: 240, y: this.setY(this.editEndDateField, 30), width: 150, height: 40},
				text: this.getMessage('IDS_FIELD_PREVIEW'),
				multiLine: false
			});

			// EDIT_PICOBJ
			this.editPicObj = new Osp.Ui.Controls.Label({
				bounds: {x: 380, y: this.setY(this.endDateField, 15), width: 80, height: 80},
				multiLine: false
			});
			this.editPicObj.setVisible(false);

			// EDIT_PICURL
			this.editPicURL = new Osp.Ui.Controls.EditField({
				bounds: {x: 0, y: 0, width: 0, height: 0},
				limitLength: 255
			});
			this.editPicURL.setEnabled(false);
			this.editPicURL.setVisible(false); 

			// EDIT_NOTEAREA
			this.editNoteArea = new Osp.Ui.Controls.EditArea({
				bounds: {x: 20, y: this.setY(this.editPicObj, 15), width: 440, height: 160},
				limitLength: 1000
			});
			this.editNoteArea.setGuideText(this.getMessage('IDS_FIELD_NOTE_TEXT'));

			// EDIT_EXPORTTOGGLE
			this.editExportToggle = new Osp.Ui.Controls.CheckButton({
				bounds: {x: 20, y: this.setY(this.editNoteArea, 25), width: 440, height: 72},
				style: Osp.Ui.Controls.CheckButtonStyle.ONOFF,
				groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE,
				backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT,
				text: this.getMessage('IDS_BUTTON_ADD_TO_CALENDAR')
			});
			this.editExportToggle.setActionId(10, 11);

			// EDIT_TIMEVALUE
			this.editTimeValueField = new Osp.Ui.Controls.EditField({
				bounds: {x: 20, y: this.setY(this.editExportToggle, 10), width: 440, height: 102},
				limitLength: 3,
				editFieldStyle: 'number',
				groupStyle: Osp.Ui.Controls.GroupStyle.MIDDLE,
				editFieldTitleStyle: 'top',
				enableClear: false,
				showTitle: true
			});
			this.editTimeValueField.setTitleText(this.getMessage('IDS_FIELD_ALARM_TIME'));
			this.editTimeValueField.setTextSize(28);
			this.editTimeValueField.setVisible(false);

			this.editTypeMode1CheckButton = new Osp.Ui.Controls.CheckButton({
				bounds: {x: 20, y: this.setY(this.editTimeValueField, 10), width: 440, height: 72},
				style: Osp.Ui.Controls.CheckButtonStyle.MARK,
				groupStyle: Osp.Ui.Controls.GroupStyle.TOP,
				backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT,
				text: this.getMessage('IDS_BUTTON_NO_ALARM')
			});

			this.editTypeMode2CheckButton = new Osp.Ui.Controls.CheckButton({
				bounds: {x: 20, y: this.setY(this.editTypeMode1CheckButton, 0), width: 440, height: 72},
				style: Osp.Ui.Controls.CheckButtonStyle.MARK,
				groupStyle: Osp.Ui.Controls.GroupStyle.MIDDLE,
				backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT,
				text: this.getMessage('IDS_BUTTON_DISPLAY_ONLY')
			});

			this.editTypeMode3CheckButton = new Osp.Ui.Controls.CheckButton({
				bounds: {x: 20, y: this.setY(this.editTypeMode2CheckButton, 0), width: 440, height: 72},
				style: Osp.Ui.Controls.CheckButtonStyle.MARK,
				groupStyle: Osp.Ui.Controls.GroupStyle.BOTTOM,
				backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT,
				text: this.getMessage('IDS_BUTTON_DISPLAY_SOUND')
			});

			// NEW_RADIOGROUP
			this.editAlarmTypeGroupObj = new Osp.Ui.Controls.RadioGroup();
			this.editAlarmTypeGroupObj.add(this.editTypeMode1CheckButton);
			this.editAlarmTypeGroupObj.add(this.editTypeMode2CheckButton);
			this.editAlarmTypeGroupObj.add(this.editTypeMode3CheckButton);
			this.editAlarmTypeGroupObj.setSelectedItem(this.editTypeMode2CheckButton);

			this.editTypeMode1CheckButton.setVisible(false);
			this.editTypeMode2CheckButton.setVisible(false);
			this.editTypeMode3CheckButton.setVisible(false);

			if(allowExport)
			{
				this.editExportToggle.setSelected(true);
				this.editTypeMode1CheckButton.setVisible(true);
				this.editTypeMode2CheckButton.setVisible(true);
				this.editTypeMode3CheckButton.setVisible(true);
			}


			this.editStartDateField.addListener('textValueChange', this.onContextChange, this);
			this.editEndDateField.addListener('textValueChange', this.onContextChange, this);
			this.editPersonButton.addListener('actionPerform', this.onButtonAction, this);
			this.editCameraButton.addListener('actionPerform', this.onButtonAction, this);
			this.editLibraryButton.addListener('actionPerform', this.onButtonAction, this);
			this.editBorrowCheckbutton.addListener('actionPerform', this.onCheckButtonAction, this);
			this.editLoanCheckbutton.addListener('actionPerform', this.onCheckButtonAction, this);
			this.editExportToggle.addListener('actionPerform', this.onCheckButtonAction, this);

			// add forms to addPanel
			this.editPanel.addControl(this.editTitleField);
			this.editPanel.addControl(this.editBorrowCheckbutton);
			this.editPanel.addControl(this.editLoanCheckbutton);
			this.editPanel.addControl(this.editPersonField);
			this.editPanel.addControl(this.editPersonButton);
			this.editPanel.addControl(this.editStartDateField);
			this.editPanel.addControl(this.editEndDateField);
			this.editPanel.addControl(this.editPreviewLabel);
			this.editPanel.addControl(this.editPicURL);
			this.editPanel.addControl(this.editPicObj);
			this.editPanel.addControl(this.editCameraButton);
			this.editPanel.addControl(this.editLibraryButton);
			this.editPanel.addControl(this.editNoteArea);
			this.editPanel.addControl(this.editExportToggle);
			this.editPanel.addControl(this.editTimeValueField);
			this.editPanel.addControl(this.editTypeMode1CheckButton);
			this.editPanel.addControl(this.editTypeMode2CheckButton);
			this.editPanel.addControl(this.editTypeMode3CheckButton);

			this.hideAllPages();
			this.showPage(this.borrowList);
		},

		// HEADERS
		/**
		 * Generate defaultHeader Style
		 * Style: SEGMENTED
		 * Items: "from", "to"
		 * Buttons: "settings", "exit"
		 * @author Marco Büttner
		 * @since 1.1.0
		 */
		DefaultHeader: function()
		{
			this.headerObj.setHeaderStyle(Osp.Ui.Controls.HeaderStyle.SEGMENTED);
			this.headerObj.addItem({actionId: 1, text : this.getMessage('IDS_BUTTON_FROM')});
			this.headerObj.addItem({actionId: 2, text : this.getMessage('IDS_BUTTON_TO')});
			this.headerObj.setButton(Osp.Ui.Controls.ButtonPosition.LEFT, {
				actionId: 5,
				icon: this.setIcon('settings')
			});
			/*
			this.headerObj.setButton(Osp.Ui.Controls.ButtonPosition.RIGHT, {
				actionId: 3,
				icon: {
					normal: 'images/header/00_icon_exit.png',
					pressed: 'images/header/00_icon_exit_pressed.png'
				}
			});
			*/
		},

		/**
		 * Generate Header with "Title"-Style and set Titletext to "Edit Item"
		 * @author Marco Büttner
		 * @since 1.1.0
		 */
		EditItemHeader: function()
		{
			this.headerObj.removeAllItems();
			this.headerObj.removeAllButtons();
			this.headerObj.setHeaderStyle('title');
			this.headerObj.setTitleText(this.getMessage('IDS_TITLE_EDIT_ITEM'));
		},

		/**
		 * Generate Header with "Title"-Style and Backbutton on the right side
		 * @author Marco Büttner
		 * @since 1.1.0
		 */
		BackButtonHeader: function()
		{
			this.headerObj.removeAllItems();
			this.headerObj.removeAllButtons();
			this.headerObj.setHeaderStyle('title');
			this.headerObj.setButton('right', {
				actionId: 4,
				icon: this.setIcon('back')
			});
		},

		// FOOTER BUTTONS
		/**
		 * Generate Add and Delete button on the footer
		 * @author Marco Büttner
		 * @since 1.1.0
		 */
		AddDeleteButtons: function()
		{
			this.footerObj.removeAllItems();
			this.footerObj.addItem({
				actionId: 1,
				text: this.getMessage('IDS_BUTTON_ADD')
			});
			this.footerObj.addItem({
				actionId: 2,
				text: this.getMessage('IDS_BUTTON_DELETE')
			});
		},

		/**
		 * Generate Save and Cancel button on the footer
		 * @param {Number} actionIdSave
		 * @author Marco Büttner
		 * @since 1.1.0
		 */
		SaveCancelButtons: function(actionIdSave)
		{
			this.footerObj.removeAllItems();
			this.footerObj.addItem({
				actionId: actionIdSave, // 8 or 3
				text: this.getMessage('IDS_BUTTON_SAVE')
			});
			this.footerObj.addItem({
				actionId: 4,
				text: this.getMessage('IDS_BUTTON_CANCEL')
			});
		},

		/**
		 * Generate Delete and Cancel button on the footer
		 * @author Marco Büttner
		 * @since 1.1.0
		 */
		DeleteCancelButtons: function()
		{
			this.footerObj.removeAllItems();
			this.footerObj.addItem({
				actionId: 5,
				text: this.getMessage('IDS_BUTTON_DELETE')
			});
			this.footerObj.addItem({
				actionId: 4,
				text: this.getMessage('IDS_BUTTON_CANCEL')
			});
		},

		/**
		 * Generates Edit and Delete button on the footer
		 * @author Marco Büttner
		 * @since 1.1.0 
		 */
		EditDeleteButtons: function()
		{
			this.footerObj.removeAllItems();
			this.footerObj.addItem({
				actionId: 6,
				text: this.getMessage('IDS_BUTTON_EDIT')
			});
			this.footerObj.addItem({
				actionId: 7,
				text: this.getMessage('IDS_BUTTON_DELETE')
			});
		},

		/**
		 * Set or stop the load animation on the header
		 * @author Marco Büttner
		 * @param {Boolean} boolean
		 * @since 1.0.0
		 */
		setLoading: function(boolean)
		{
			var hdObj = this.headerObj;

			if(boolean)
			{
				hdObj.setProgressIcon("./images/loader/anim.gif");
			}
			else
			{
				hdObj.setProgressIcon(null);
			}
		},

		/**
		 * Returns object of icon by iconName
		 * @param {String} iconName
		 * @returns {Object} icon
		 * @since 1.2.0
		 * @author Marco Büttner
		 */
		setIcon: function(iconName)
		{
			var icon = null;

			if(iconName === 'camera')
			{
				icon = {
					normal:'images/00_icon_camera.png',
					pressed:'images/00_icon_camera_p.png'
				};
			}

			if(iconName === 'library')
			{
				icon = {
					normal:'images/00_icon_library.png',
					pressed:'images/00_icon_library_p.png'
				};
			}

			if(iconName === 'contact')
			{
				icon = {
					normal:'images/00_icon_contact.png',
					pressed:'images/00_icon_contact_p.png'
				};
			}

			if(iconName === 'settings')
			{
				icon = {
					normal: 'images/header/00_icon_settings.png',
					pressed: 'images/header/00_icon_settings_pressed.png'
				};
			}

			if(iconName === 'back')
			{
				icon = {
					normal: 'images/header/00_icon_back.png',
					pressed: 'images/header/00_icon_back_pressed.png'
				};
			}

			return icon;
		},

		/**
		 * Read out current ClientAreaBounds and return the height of this. Required mainForm object.
		 * If withFooter is set to true, the bodyHeight reduced by the height of the footer, else it will return the height with the addition place
		 * @param {Object} mainForm
		 * @param {Boolean} withFooter
		 * @returns {Number} bodyHeight
		 * @since 1.3.0
		 * @author Marco Büttner
		 */
		getBodyHeight: function(mainForm, withFooter)
		{
			var bodyHeight = mainForm.getClientAreaBounds().height,
				wvgaFooterHeight = 76,
				hvgaFooterHeight = 72;

			if(withFooter)
			{
				return bodyHeight;
			}
			else
			{
				return bodyHeight = bodyHeight === 614 ? bodyHeight+wvgaFooterHeight : bodyHeight+hvgaFooterHeight;
			}
		},

		/**
		 * Show or hide the footer section
		 * @param {Boolean} show
		 * @since 1.3.0
		 * @author Marco Büttner
		 */
		showFooter: function(show)
		{
			this.mainForm.setActionBarsVisible(Osp.Ui.Controls.FormActionBar.FOOTER, show); // show footer
		},

		/**
		 * Hide all generated pages
		 * @since 1.3.0
		 * @author Marco Büttner
		 */
		hideAllPages: function()
		{
			// hide loan, add, detail and edit panel
			this.borrowList.setVisible(false);
			this.loanList.setVisible(false);
			this.addPanel.setVisible(false);
			this.contactList.setVisible(false);
			this.detailPanel.setVisible(false);
			this.editPanel.setVisible(false);
			this.settingsPanel.setVisible(false);
		},

		/**
		 * Show generated page
		 * @param {Object} page
		 * @since 1.3.0
		 * @author Marco Büttner
		 */
		showPage: function(page)
		{
			page.setVisible(true);
		},

		/**
		 * Returns the new y position for the item.
		 * It calculate by height and y position of the previous element and specific given margin number.  
		 * @param {Object} previousElem
		 * @param {Number} margin
		 * @returns {Number} y 
		 * @since 1.3.0
		 * @author Marco Büttner
		 */
		setY: function(previousElem, margin)
		{
			var y = previousElem.getY(),
				height = previousElem.getHeight();

			return y + height + margin;
		},

		/**
		 * Show or hide the exportMenu on edit or add page.
		 * @param {String} page
		 * @param {Boolean} visible
		 * @since 1.3.0
		 * @author Marco Büttner
		 */
		showExportMenu: function(page, visible)
		{
			if(page === 'editPage')
			{
				if(visible)
				{
					this.editExportToggle.setSelected(true);
					this.editTimeValueField.setVisible(true);
					this.editTypeMode1CheckButton.setVisible(true);
					this.editTypeMode2CheckButton.setVisible(true);
					this.editTypeMode3CheckButton.setVisible(true);
				}
				else
				{
					this.editExportToggle.setSelected(false);
					this.editTimeValueField.setVisible(false);
					this.editTypeMode1CheckButton.setVisible(false);
					this.editTypeMode2CheckButton.setVisible(false);
					this.editTypeMode3CheckButton.setVisible(false);
				}
			}

			if(page === 'addPage')
			{
				if(visible)
				{
					this.exportToggle.setSelected(true);
					this.timeValueField.setVisible(true);
					this.typeMode1CheckButton.setVisible(true);
					this.typeMode2CheckButton.setVisible(true);
					this.typeMode3CheckButton.setVisible(true);
				}
				else
				{
					this.exportToggle.setSelected(false);
					this.timeValueField.setVisible(false);
					this.typeMode1CheckButton.setVisible(false);
					this.typeMode2CheckButton.setVisible(false);
					this.typeMode3CheckButton.setVisible(false);
				}
			}
		},

		/**
		 * Shows a popup with related informations
		 * @param {String} title
		 * @param {String} message
		 * @param {String} style
		 * @param {Number} timeout
		 * @author Marco Büttner
		 * @since 1.3.0
		 */
		showPopup: function(title, message, style, timeout)
		{
			var config = {
				title : title,
				message : message,
				style : style,
				timeout: timeout ? timeout : 0
			};
			var messageBoxObj = new Osp.Ui.Controls.MessageBox(config);

			messageBoxObj.showAndWait();

			messageBoxObj.addListener('actionPerform', this.onMessageBoxAction, this)
		},

		/**
		 * Update layout modus for a given list 
		 * @param {Object} _list
		 * @param {String} _modus
		 * @since 1.3.0
		 * @author Marco Büttner
		 */
		updateList: function(_list, _modus) {
			var itemsCount = _list.getItemCount(); 

			for(var i = itemsCount - 1; i >= 0; i--)
			{
				item = _list.getItemAt(i);
				item.setting.annex = _modus;
			}
			_list.updateList(); // update the whole list without errors

			if(_modus === 'mark')
			{
				for(var i = itemsCount - 1; i >= 0; i--)
				{
					if(_list.isItemChecked(i))
					{
						_list.setItemChecked(i, false);
					}
				}
			}
		},

		/**
		 * Remove a item from the list and database
		 * @param {Object} _list
		 * @param {Object} dbItems
		 * @returns {Object} dbItems
		 */
		removeFromList: function(_list, dbItems) {
			var itemsCount = _list.getItemCount(),
				dbItem = null;

			for(var i = itemsCount - 1; i >= 0; i--)
			{
				if(_list.isItemChecked(i)) // check item for checked state to delete
				{
					item = _list.getItemAt(i); // select item
					idx = parseInt(item.setting.descriptionText, 10); // read out index in dbResults

					_list.removeItemAt(i); // remove from list
					dbItem = dbItems[idx];

					if(dbItem.eventId)
					{
						this.removeEvent(dbItem.eventId);
					}

					dbItems.splice(idx, 1); // remove from dbResults
				}
			}

			return dbItems;
		}
	}
});