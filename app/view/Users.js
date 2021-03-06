Ext.define('FixedSummary.view.Users', {
    extend      : 'Ext.grid.Panel',
    alias       : 'widget.crdusers',
  columnLines : true,
	frame       : false,
	border      : 0,
	fixedsummarytips : true,
	features    : [{
				ftype   : 'fixedsummary',
			}]	,
	initComponent: function() {
	
	var me 			= this;
	
	this.store      = Ext.create('FixedSummary.store.Users');
	
	this.columns 	=[{
			xtype : 'rownumberer'
		},{
			xtype 	: 'actioncolumn',
			iconCls : 'icon-card',
			align   : 'center',
			text	: 'ID-Count',
			width	: 70,
			fixedSummaryType: "count",
			fixedSummaryRenderer :function(value, metadata, record) {
					return Ext.String.format('<span style="color:red;float:right;">{0} student{1}</span>',value, value !== 1 ? 's' : ''); }
			
		},{
			dataIndex: 'Name',
			text	 : 'Student Name',
			flex 	 : 1
		}, {
			dataIndex: 'Surname',
			text	 : 'Student Surname',
			flex 	 : 1
		},{
			text	 : 'Courses',
			columns  :[{
				dataIndex: 'Maths',
				text	 : 'Maths-Avg',
				flex 	 : 1,
				align	 : 'right',
				sortable : 'true',
				fixedSummaryType: 'average',
				fixedSummaryRenderer: Ext.util.Format.numberRenderer('0.00') 
			},{
				dataIndex: 'Physics',
				text	 : 'Physics-Avg',
				flex	 : 1,
				align	 : 'right',
				sortable : 'true',
				fixedSummaryType: 'average',
				fixedSummaryRenderer: Ext.util.Format.numberRenderer('0.00') 
			},{
				dataIndex: 'Chemistry',
				text	 : 'Chemistry-Avg',
				flex	 : 1,
				align	 : 'right',
				sortable : 'true',
				fixedSummaryType: 'average',
				fixedSummaryRenderer: Ext.util.Format.numberRenderer('0.00') 
			},{
				dataIndex: 'Biology',
				text	 : 'Biology-Avg',
				flex	 : 1,
				align	 : 'right',
				sortable : 'true',
				fixedSummaryType: 'average',
				fixedSummaryRenderer: Ext.util.Format.numberRenderer('0.00') 
			}]
		},{
			dataIndex: 'Absences',
			text	 : 'Absences - Min',
			flex 	 : 1,
			align	 : 'right',
			fixedSummaryType: "min",
			fixedSummaryRenderer: Ext.util.Format.numberRenderer('0.00') 
		},{
			dataIndex: 'Absences',
			text	 : 'Absences - Max',
			flex	 : 1,
			align	 : 'right',
			fixedSummaryType: "max",
			fixedSummaryRenderer: Ext.util.Format.numberRenderer('0.00') 
		},{
			dataIndex: 'Papers',
			text	 : 'Papers-Sum',
			flex	 : 1,
			align	 : 'right',
			fixedSummaryType: "sum",
			fixedSummaryRenderer: Ext.util.Format.numberRenderer('0.00') 
		}];

	this.callParent();
	}
	
});




