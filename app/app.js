  Ext.BLANK_IMAGE_URL = './resources/images/s.gif';
	Ext.tip.QuickTipManager.enable();

	Ext.Loader.setConfig({
		enabled        : true,  //???-->mode(debug:true, production:false)
		disableCaching : false,  //???-->mode(debug:true, production:false)
		paths          : {
			'FixedSummary'   : './app',
			'Libraries' : './app/classes/libraries'
		}
	});
	
	Ext.application({
		name               : 'FixedSummary',
		requires           : [
			'FixedSummary.view.Viewport',
			'Libraries.feature.FixedSummary'
		],
		models      : [],
		controllers : [],
		
		launch      : function() {
			this.viewport = Ext.create('FixedSummary.view.Viewport');
		}
	});
