Osp.Core.Mixin.define("borrowNone.Util",
{
	members:
	{
		/**
		 * Returns the translated message of id. If id not found it will return null
		 * @param {String} id
		 * @returns {String} message
		 */
		getMessage: function(id)
		{
			var message = Osp.App.AppResource.getString(id); 
			return message;
		},

		/**
		 * Checks are the given fields are empty. If one of the fields empty the check fails
		 * @param {Object} fields
		 * @returns {Boolean
		 * @author Marco Büttner
		 * @since 1.3.0}
		 */
		isFieldEmpty: function(fields)
		{
			var fieldsLength =  fields.length,
				field = null,
				message = '';

			for(var i = 0; i < fieldsLength; i++)
			{
				field = fields[i];
				if(!field.getText())
				{
					alert("["+field.getTitleText()+"] "+this.getMessage("IDS_ERROR_EMPTY"));
					return false;
				}
			}
			return true;
		},

		/**
		 * Check if the start date before end date, if true the check is successful else it fails
		 * @author Marco Büttner
		 * @since 1.3.0
		 * @param {Object} start
		 * @param {Object} end
		 * @returns {Boolean}
		 */
		isStartBeforeEnd: function(start, end)
		{
			if(end.getText() && new Date(end.getText()) < new Date(start.getText()))
			{
				alert(this.getMessage("IDS_ERROR_END_BEFORE_START"));
				return false;
			}

			return true;
		},

		/**
		 * Includes checks for empty fields and date logic
		 * @param {Object} fields
		 * @param {Object} start
		 * @param {Object} end
		 * @returns {Boolean}
		 */
		CheckFields: function(fields, start, end)
		{
			var chk1 = this.isFieldEmpty(fields),
				chk2 = this.isStartBeforeEnd(start, end);

			if(chk1 && chk2)
			{
				return true;
			}
			else
			{
				this.setLoading(false);
				return false;
			}
		},

		/**
		 * simple check
		 * @param {Object} fields
		 * @returns {Boolean}
		 */
		checkEmptyFields: function(fields)
		{
			var field = null;

			for(var i = 0; i < fields.length; i++)
			{
				field = fields[i];
				if(!field.getText())
				{
					return false;
				}
			}
			return true;
		},

		/**
		 * Clean up the current shown form
		 * @author Marco Büttner
		 * @since 1.1.0 
		 */
		clearForm: function()
		{
			var isSelected;

			switch(this.PAGE.CURRENT)
			{
				case 'addPage':
					isSelected = this.exportToggle.isSelected(); 

					this.titleField.setText("");
					this.personField.setText("");
					this.startDateField.setText("");
					this.endDateField.setText("");
					this.picURL.setText("");
					this.picObj.setBackgroundImage("");
					this.noteArea.setText("");
					this.timeValueField.setText("");
					this.alarmTypeGroupObj.setSelectedItem(this.typeMode2CheckButton);

					if(isSelected)
					{
						this.exportToggle.setSelected(false);
					}
					break;

				case 'editPage':
					isSelected = this.editExportToggle.isSelected(); 

					this.editTitleField.setText("");
					this.editPersonField.setText("");
					this.editStartDateField.setText("");
					this.editEndDateField.setText("");
					this.editPicURL.setText("");
					this.editPicObj.setBackgroundImage("");
					this.editNoteArea.setText("");
					this.editTimeValueField.setText("");
					this.editAlarmTypeGroupObj.setSelectedItem(this.editTypeMode2CheckButton);

					if(isSelected)
					{
						this.editExportToggle.setSelected(false);
					}
					break;
			}
			this.setLoading(false);
		}
	}
});