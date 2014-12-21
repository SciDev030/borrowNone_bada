Osp.Core.Class.define("borrowNone",
{
	//TODO: Datenstruktur anpassen (waiting for test)
	//TODO: GitHub repo aufsetzen (after release)
	extend: Osp.Core.Object,
	include: [borrowNone.API, borrowNone.DB, borrowNone.Events,  borrowNone.Ui, borrowNone.Util, borrowNone.Style],
	construct: function(frameObj) 
	{
		this.frameObj = Osp.Ui.Controls.Frame.getInstance();
	},

	members:
	{
		/**
		 * Initialize function
		 * @author Marco Büttner
		 * @since 1.0.0
		 */
		launch: function()
		{
			var test = true;

			if(test)
			{
				var testdb = [
					{"title": "Test item1", "type": "borrow", "person": "Jacob", "date": "2014-14-12", "endDate": "2014-17-12", "pic": "", "note": "", "eventId": -1},
					{"title": "Test item2", "type": "loan", "person": "Jacob", "date": "2014-14-12", "endDate": "2014-17-12", "pic": "", "note": "", "eventId": null},
					{"title": "Test item3", "type": 1, "person": "Jacob", "date": "2014-14-12", "endDate": "", "pic": "", "note": "", "eventId": -1},
					{"title": "Test item4", "type": 1, "person": "Jacob", "date": 1419090276000, "endDate": -1, "pic": "", "note": "", "eventId": -1},
					{"title": "Test item5", "type": 2, "person": "Jacob", "date": 1419090276000, "endDate": -1, "pic": "", "note": "", "eventId": -1}
				];

				var saveItem = {};
				saveItem.results = testdb;

				localStorage.setItem("db", JSON.stringify(saveItem));
			}

			this.PAGE.CURRENT = 'borrowList'; // default page for application
			this.loadUI(); // load UI elements
			this.loadDB(); // load the current db
		},

		/**
		 * Load all data from localStorage by key "db" (database) and generates the list for "from" and "to"
		 * Must use after all changes you make
		 * @author Marco Büttner
		 * @since 1.0.0
		 */
		loadDB: function()
		{
			var fromList = this.borrowList,
				toList = this.loanList,
				db = localStorage.getItem('db'); // load data from database

			fromList.removeAllItems(); // clean list
			toList.removeAllItems(); // clean list

			fromList.updateList(); // update cleaned list
			toList.updateList(); // update cleaned list

			if(db)
			{
				var data = JSON.parse(db).results,
					dataItem = null,
					listItem = null,
					toItem = null,
					boundsSetting = null;

				for(var idx = 0; idx < data.length; idx++)
				{
					dataItem = data[idx];

					boundsSetting = {x: 20, y: 0, width: 440, height: 100};

					listItem =
					{
						height: 100,
						setting:
						{
							backgroundColor: {
								normal: '#000000',
								pressed: '#0674a5'
							},
							descriptionText: idx+'', // store index in description text
							annex: 'normal',
							elements: []
						}
					};

					if(dataItem.pic)
					{
						listItem.setting.elements.push({
							image: {
								normal: {
									src: dataItem.pic,
									bounds: {
										x: 10,
										y: 5,
										width: 90,
										height : 90
									}
								},
								pressed: {
									src : dataItem.pic,
									bounds: {
										x: 11,
										y: 6,
										width: 90, height : 90
									}
								}
							}
						});
						boundsSetting = {x: 110, y: 0, width: 370, height: 100};
					}

					listItem.setting.elements.push({
						bounds: boundsSetting,
						text: dataItem.title,
						selectable: false,
						textSize: 40,
						textColor: {
							normal: '#FFFFFF',
							pressed: '#EAEAEA'
						},
						textSliding: dataItem.title.length >= 22 ? true : false
					});

					if(dataItem.type === 1 || dataItem.type === 'borrow') // type can be number (>1.2) or string (<1.3) 
					{
						fromList.addItem(listItem);
					}
					else
					{
						toList.addItem(listItem);
					}
				}
			}
			else
			{
				console.info("loadDB() > database empty");
			}

			fromList.updateList();
			toList.updateList();

			this.setLoading(false);
		}
	}
});