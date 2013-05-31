Ext.define('Libraries.feature.FixedSummary', {
    extend: 'Ext.grid.feature.Feature',
    alias: 'feature.fixedsummary',

    init: function() {
  	var summaryColumns    = this.getSummaryColumnsConfig(),
	summaryFields     = this.getSummaryFieldsConfig(summaryColumns),
	summaryGridConfig = {
		xtype            : 'grid',
		itemId           : 'fixedsummarygrid',
		frame            : false,
		border           : this.grid.border,
		height           : 22,
		layout			 : 'auto',
		dock             : 'bottom',
		bodyStyle        : this.grid.bodyStyle,
		bodyCls          : this.grid.bodyCls,
		hideHeaders      : true,
		disableSelection : true,
		columns 	     : summaryColumns,
		viewConfig       : {
			markDirty   : false,
			getRowClass : function(record, index, rowParams){
				return 'fixedsummaryrow' ;
			}
		},
		store           : Ext.create('Ext.data.Store', {
			fields : summaryFields
			})
		};
		
		Ext.apply(summaryGridConfig, this.grid.fixedConfig);
		
		if (!this.isSummaryVisible)
			return;
		
		this.grid.summarize   = Ext.bind(this.summarize, this);
		
		this.grid.dockedItems = this.grid.dockedItems || [];
		this.grid.dockedItems.push(summaryGridConfig);
		
		this.grid.on({
			scope        : this,
			boxready     : this.onBoxReady,
			viewready	 : this.onSummarize
		});
    },
	
	isScrollable : function(el){
        var dom = el.dom;
        return {
			x : dom.scrollWidth > dom.clientWidth,
			y : dom.scrollHeight > dom.clientHeight
		}
	},
	
	generateSummaryRecord: function(){
        var grid           = this.grid,
			summaryGrid    = this.summaryGrid,
			store          = grid.store,
			summaryStore   = summaryGrid.store,
			summaryColumns = summaryGrid.columns,
			summaryModel   = Ext.create(summaryStore.model),
			calculated     = {},
			col, sCol, aTip;
		
		for (i = 0, j = summaryColumns.length; i < j; ++i) {
			sCol = summaryColumns[i];
			col  = sCol.gridColumn;
		
			if(col.fixedSummaryType){
				calculated.count = this.getSummary(store, 'count', col.dataIndex, false);
				
				if ((col.fixedsummarycoltype === 'int')|| (col.fixedsummarycoltype === 'float')){
					calculated.min     = this.getSummary(store, 'min', col.dataIndex, false);
					calculated.max     = this.getSummary(store, 'max', col.dataIndex, false);
					calculated.average = this.getSummary(store, 'average', col.dataIndex, false);
					calculated.sum     = this.getSummary(store, 'sum', col.dataIndex, false);
				}
			
				summaryModel.set(sCol.dataIndex, calculated[col.fixedSummaryType]);
				
				sCol.gridColumn.fixedsummarydata = {
					type    : col.fixedsummarycoltype,
					min     : calculated.min,
					max     : calculated.max,
					average : calculated.average,
					sum     : calculated.sum,
					count   : calculated.count
				};
				
				aTip = sCol.gridColumn.fixedsummarytooltip;
				
				if (aTip)
					aTip.update(aTip.tpl.apply(sCol.gridColumn.fixedsummarydata));
			}
		}

        return summaryModel;
    },
	
	 getSummary: function(store, type, field, group){
        if (type) {
            if (Ext.isFunction(type))
                return store.aggregate(type, null, group, [field]);

            switch (type) {
                case 'count':
                    return store.count(group);
                case 'min':
                    return store.min(field, group);
                case 'max':
                    return store.max(field, group);
                case 'sum':
                    return store.sum(field, group);
                case 'average':
		    return store.average(field, group);
                default:
                    return group ? {} : '';
            }
        }
    },
	
	getSummaryColumnsConfig: function(){
		var newColumns       = [],
			isSummaryVisible = false, 
			aCol, actualColumns, anActualCol;	
			
		for (var i=0, j=this.grid.columns.length; i<j; i++){
			aCol             = this.grid.columns[i];
			actualColumns    = this.getActualColumnsByColumn(aCol);
			
			for (var m = 0, n=actualColumns.length; m<n; m++){
				anActualCol      = actualColumns[m];
				isSummaryVisible = (isSummaryVisible || (!Ext.isEmpty(anActualCol.fixedSummaryType )));
				
				newColumns.push({
					text       : anActualCol.text,
					gridColumn : anActualCol,
					dataIndex  : (anActualCol.dataIndex || '') + '_' + anActualCol.id,
					align      : 'right',
					flex       : anActualCol.flex,
					width      : anActualCol.width,
					renderer   : anActualCol.fixedSummaryRenderer
				});
			}
		}
		
		this.isSummaryVisible = isSummaryVisible;
		
		return newColumns;
	},
	
	getSummaryFieldsConfig: function(columns){
		var fields = [],
			aCol;
		
		for (var i=0, j=columns.length; i<j; i++){
			aCol = columns[i];
			
			fields.push({
				name    : aCol.dataIndex,
				type    : 'float',
				useNull : true
			});
		}
		
		return fields;
	},
	
	onBoxReady : function(grid, width, height, eoptions){
		this.summaryGrid = this.grid.getDockedItems('grid[itemId="fixedsummarygrid"]')[0];
		
		this.summaryGrid.view.el.dom.style.overflowX = 'hidden';
		
		this.grid.on({
			scope        : this,
			columnresize : this.onColumnResize,
			columnmove	 : this.onColumnMove,
			columnhide	 : this.onColumnHide,
			columnshow	 : this.onColumnShow,
			scroll       : this.onScroll
		});
		
		this.grid.store.on({
			scope        : this,
			load         : this.onSummarize,
			add          : this.onSummarize,
			remove       : this.onSummarize,
			update       : this.onSummarize
		});
		
		this.grid.view.el.on({
			scope        : this,
			scroll       : this.onScroll
		});
		
		var actualColumns = this.getFlatColumns(),
			aCol,type,tip = [
				'<table style="width:100%; padding:0px; margin:0px; background-color:#fff;" cellpadding="0" cellspacing="0">',
				'	<tr>',
				'		<td style="padding:5px; background-color:#e7f29b; text-align:center;" colspan="2">',
				'			<span style="color: red;">Summary</span>',
				'		</td>',
				'	</tr>',
				'	<tr style="border-bottom:dotted 1px Silver;">',
				'		<td style="padding:3px;" align="left">',
				'			Count',
				'		</td>',
				'		<td style="padding:3px;" align="right">',
				'			<b>{count:this.renderNumber}</b>',
				'		</td>',
				'	</tr>',
				'<tpl if="type==\'int\' || type==\'float\'">',
				'	<tr style="border-bottom:dotted 1px Silver;">',
				'		<td style="padding:3px;" align="left">',
				'			Sum',
				'		</td>',
				'		<td style="padding:3px;" align="right">',
				'			<b>{sum:this.renderNumber}</b>',
				'		</td>',
				'	</tr>',
				'	<tr style="border-bottom:dotted 1px Silver;">',
				'		<td style="padding:3px;" align="left">',
				'			Min',
				'		</td>',
				'		<td style="padding:3px;" align="right">',
				'			<b>{min:this.renderNumber}</b>',
				'		</td>',
				'	</tr>',
				'	<tr style="border-bottom:dotted 1px Silver;">',
				'		<td style="padding:3px;" align="left">',
				'			Max',
				'		</td>',
				'		<td style="padding:3px;" align="right">',
				'			<b>{max:this.renderNumber}</b>',
				'		</td>',
				'	</tr>',
				'	<tr style="border-bottom:dotted 1px Silver;">',
				'		<td style="padding:3px;" align="left">',
				'			Average',
				'		</td>',
				'		<td style="padding:3px;" align="right">',
				'			<b>{average:this.renderNumber}</b>',
				'		</td>',
				'	</tr>',
				'</tpl>',
				
				'</table>'
			].join('');
		
		if (this.grid.fixedsummarytips)
			for (var i=0, j=actualColumns.length; i<j; i++){
				aCol = actualColumns[i];
				type = this.findType(aCol);
				
				if (aCol.fixedSummaryType){
					aCol.fixedsummarycoltype = type;
					aCol.fixedsummarytooltip = Ext.create('Ext.tip.ToolTip', {
						target      : aCol.el.dom,
						tpl         : new Ext.XTemplate(tip, {
							renderNumber : this.renderNumber
						}),
						padding     : 0,
						bodyPadding : 0,
						margin      : 0,
						frame       : false,
						border      : 0,
						bodyBorder  : 0,
						showDelay   : 1000,
						dismissDelay: 0
					});
				}
			}			
	},
	
	renderNumber : function(val){
		return Ext.util.Format.number(val, '0.00');
	},
	
	findType : function(column){
		var fields = this.grid.store.model.getFields(),
			aCol;
		
		for (var i=0, j=fields.length; i<j; i++)
			if(fields[i].name == column.dataIndex)
				return fields[i].type.type;
				
		return null;
	},
	
	onScroll : function(e, t, eoptions){
		var scrollLeft = this.grid.view.el.getScroll().left,
			gridView   = this.summaryGrid.view;
			
		gridView.el.scrollTo( 'left', scrollLeft);
	},
	
	onSummarize : function(record){
		return this.summarize();
	},
	
	summarize : function(record){
		var summaryData = (record ? this.createSummaryRecord(record) : this.generateSummaryRecord());
		
		this.summaryGrid.store.loadRecords([summaryData]);
	},
	
	createSummaryRecord : function(record){
		var summaryColumns = this.summaryGrid.columns,
			summaryRecord  = {},
			aSummaryCol, aGridCol;
		
		for (var i=0, j=summaryColumns.length; i<j; i++){
			aSummaryCol = summaryColumns[i];
			aGridCol    = aSummaryCol.gridColumn;
			
			if (aGridCol)
				if (aGridCol.dataIndex)
					if (record[aGridCol.dataIndex])
						summaryRecord[aSummaryCol.dataIndex] = record[aGridCol.dataIndex];
		}
		
		return Ext.create(this.summaryGrid.store.model, summaryRecord);
	},
	
	getActualColumnsByColumn : function(column, actualColumns){
		actualColumns = actualColumns || [];
		
		var nestedColumns = column.items.items || [];
		
		if (nestedColumns.length > 0)
			for (var i=0, j=nestedColumns.length; i<j; i++)
				this.getActualColumnsByColumn(nestedColumns[i], actualColumns);
		else
			actualColumns.push(column);
		
		return actualColumns;
	},
	
	getFlatColumns : function(){
		var columns = [],
			aCol, actualColumns;
			
		for (var i = 0;i<this.grid.columns.length;i++){
			aCol             = this.grid.columns[i];
			actualColumns    = this.getActualColumnsByColumn(aCol);
			
			for (var m = 0, n=actualColumns.length; m<n; m++)
				columns.push(actualColumns[m]);
		}
		
		return columns;
	},
	
	getColumnIndex : function(column){
		var flatColumns = this.getFlatColumns();
		
		for (var i=0, j=flatColumns.length; i<j; i++){
			if (flatColumns[i] == column)
				return i;
		}
		
		return -1;
	},
	
	onColumnResize : function(header, column, width, eoptions){
		this.summaryGrid.getView().getEl().setOpacity(0);
		clearTimeout(this._colResizeTimeOut);
		this._colResizeTimeOut = Ext.defer(this.syncColumnWidths, 50, this);
	},
	
	syncColumnWidths : function(){
		var columns           = this.getFlatColumns(),
			isGridScrollableY = this.isScrollable(this.grid.getView().getEl()).y,
			aCol;
		
		Ext.suspendLayouts();
		
		this.summaryGrid.getView().getEl().dom.style.overflowY = (isGridScrollableY ? 'scroll' : 'hidden');
		
		for (var i=0, j=columns.length; i<j; i++){
			aCol      = this.summaryGrid.columns[i];
			aCol.flex = null;
			aCol.setWidth(columns[i].getWidth());
		}
		
		Ext.resumeLayouts(true);
		
		this.summaryGrid.getView().getEl().setOpacity(1, true);
	},
	
	onColumnMove : function( header, column, fromIndex, toIndex, eoptions ){
		var length = this.getActualColumnsByColumn(column).length;
		
		if (fromIndex < toIndex)
			toIndex -= 1;
		
		if(length > 0){
			for(var i = 0 ; i < length; i++){
				if (fromIndex < toIndex){	
					this.summaryGrid.headerCt.move(fromIndex, toIndex);	
				}
				else{
					this.summaryGrid.headerCt.move(fromIndex+i, toIndex+i);
				}
			}
		}
		else{
			this.summaryGrid.headerCt.move(fromIndex, toIndex);	
		}
		
		this.summaryGrid.getView().refresh();
	},
	
	onColumnHide : function(header, column, eOpts){
		var colIndex = this.getColumnIndex(column);

		if (colIndex === -1)
			return;
		
		this.summaryGrid.columns[colIndex].hide();
	},
	
	onColumnShow : function(header, column, eOpts){
		var colIndex = this.getColumnIndex(column);

		if (colIndex === -1)
			return;
		
		this.summaryGrid.columns[colIndex].show();
	}
})
