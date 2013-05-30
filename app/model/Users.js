Ext.define('FixedSummary.model.Users', {
  extend: 'Ext.data.Model',
	
	fields: [{
		name: 'id',
		type: 'int'
	},
	{
		name: 'Name',
		type: 'string'
	},
	{
		name: 'Surname',
		type: 'string'
	},
	{
		name: 'Maths',
		type: 'int'
	},
	{
		name: 'Physics',
		type: 'int'
	},
	{
		name: 'Chemistry',
		type: 'int'
	},
	{
		name: 'Biology',
		type: 'int'
	},
	{
		name: 'Absences',
		type: 'int'
	},
	{
		name: 'Papers',
		type: 'int'
	}]
});
