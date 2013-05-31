Ext.define('FixedSummary.view.Viewport', {
extend       : 'Ext.container.Viewport',
id        	 : 'appViewport',
layout   	 : 'border',
requires 	 : [
	'FixedSummary.view.Users'
],
initComponent: function() {
	
	this.items = [{
				region       : 'west',
				width        : 200,
				collapseMode : 'mini',
				bodyCls      : 'noBorder',
				frame        : false,
				border       : 0,
				split        : true,
				collapsible  : true,
				preventHeader: true,
				enableToggle : true,
				bodyStyle    : 'padding:10px;',
				layout       : {
					type  : 'vbox',
					align : 'stretch'
					},
				html		 :[
							  '<b>Instructions :</b></br> ',
							  'Put the mouse over the desired column-header and wait until the tooltip appears.The tooltip will remain ',
							  'there until you move the mouse out of the header.</br></br>',
							  'This tooltip contains a table with all the available summary values for the chosen column.</br></br>',
							  'If the type of the column is "int" or "float" you will see count, sum, min, max, average</br>',
							  'In any other case you will see only count.</br></br>',
							  'The tooltip will appear only if the column has a fixedSummaryType.'
							  ].join('')
			},{
				region        : 'center',
				id            : 'appCenter',
				xtype         : 'container',
				layout        : 'card',
				frame         : false,
				border        : 0,
				margin        : '0 4 4 0',
				items		  :[{
					xtype  : 'panel',
					id	   : 'appCards',
					layout : 'card',
					items  :[{
						xtype  : 'crdusers',
						itemId : 'crdUsers'
						}]
					}]
			}];		
		
        this.callParent();
    }
	
});

