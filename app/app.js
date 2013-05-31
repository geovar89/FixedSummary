  Ext.BLANK_IMAGE_URL = 'http://m.UploadEdit.com/b015/1369958927431.gif';
	Ext.tip.QuickTipManager.enable();

	Ext.Loader.setConfig({
		enabled        : true,  //???-->mode(debug:true, production:false)
		disableCaching : false,  //???-->mode(debug:true, production:false)
		paths          : {
			'FixedSummary'   : './app',
			'SoftOne' : './app/classes/softone'
		}
	});
	
	Ext.application({
		name               : 'FixedSummary',
		requires           : [
			'FixedSummary.view.Viewport',
			'SoftOne.feature.FixedSummary'
		],
		models      : [],
		controllers : [],
		
		launch      : function() {
			this.viewport = Ext.create('FixedSummary.view.Viewport');
			//this.viewport.getStore().load();
		}
	});
