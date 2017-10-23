
var NIAID = NIAID || {} ;

// Namespaces
$.extend( NIAID, {
	CRDB: {},
});

// UI Object
$.extend( NIAID.CRDB, {
	UI: function( args )
	{
		var crdb = this;
	
		crdb.timeBuckets = {
			green: 0 ,
			yellow: 0,
			orange: 0,
			red: 0,
			purple: 0
		} ;
		
		crdb.now = moment() ;
		crdb.plusSixMonths = moment().add( 6, "M" );
		crdb.pastMonth = moment().subtract( 1, "M");
		crdb.pastSixMonths = moment().subtract( 6, "M");

	}

}) ;

NIAID.CRDB.UI.prototype.addToTimeBucket = function () {
	var crdb = this ;

	
}

NIAID.CRDB.UI.prototype.configureGrid = function () {
	var crdb = this ;
	var options = {
		datatype: 'local',
		loadonce: true ,
		height: 200,
       	        width:995,
		colNames:['Id', 'Title', 'NIAIDADDSEncodedAbsURL',"Last Reviewed", "Review Deadline" , "Status", "Role Coordinator", "Role Owner" ],
	   	colModel:[
	   		{
	   			name:'Id',
	   			index:'Id', 
	   			hidden: true ,
	   			sorttype: 'number' 
	   		},
	   		{
	   			name:'Title',
	   			index: function (rowObject) {
	   			    var theTitle = (rowObject.Title).toUpperCase();
	   			    var firstChar = theTitle.substring(0, 1);
	   			    var re = /[a-zA-Z0-9]$/
	   			    if (firstChar.search(re) == -1)
	   			    {
	   			        theTitle = theTitle.substr(1, (theTitle.length) - 1);
	   			    }
	   			    return theTitle;
	   			},
	   			sorttype: 'text',
	   			formatter: function ( value, options, rowObject ) {
	   				var url = "<a target='_blank' href='" + rowObject.NIAIDADDSEncodedAbsURL  + "'>" + value + " </a>" ;
	   				return url ;
	   			},
	   			width:310
	   		},
	   		{
	   			name: 'NIAIDADDSEncodedAbsURL',
	   			index: 'NIAIDADDSEncodedAbsURL',
	   			hidden: true 
	   		},
	   		{
	   			name:'lastReviewedDate',
	   			index: 'lastReviewedDate', 
	   			shrinkToFit: true ,
	   			sorttype: function( value, rowData) { 
	   				return rowData.lastReviewedDate;
	   			},
	   			formatter: function(cellValue, options, rowObject) { 
	   				return moment(rowObject.lastReviewedDate).format("YYYY-MM-DD") ; 
	   			},
	   		    width:90
	   		},
	   		{
	   			name:'reviewDeadline',
	   			index: 'reviewDeadline', 
	   			shrinkToFit: true ,
	   			sorttype: function( value, rowObject) { 
	   				return rowObject.reviewDeadline ; 
	   			},
	   			formatter: function(cellValue, options, rowObject) { 
	   				return rowObject.reviewDeadline.fromNow();
	   			},
	   		    width: 100
	   		} ,
	   		{
	   			name:'NIAIDADDSModerationStatus',
	   			index: 'NIAIDADDSModerationStatus', 
	   			shrinkToFit: true,
	   			width: 60
	   		} ,
	   		{
	   		    name: 'NIAIDADDSRoleCoordinator',
	   		    index: 'NIAIDADDSRoleCoordinator',
	   		    shrinkToFit: true,
			    width: 185
	   		},
	   		{
	   		    name: 'NIAIDADDSRoleOwner',
	   		    index: 'NIAIDADDSRoleOwner',
	   		    shrinkToFit: true,
			    width: 185
	   		}

	   		/*,
	   		{
	   			name:'NIAIDADDSDateLastReviewed',
	   			index:'NIAIDADDSDateLastReviewed', 
	   			width:147
	   		} */
	   	],
	   	multiselect: false,
		caption: "Review Information",
	    footerrow: true,
		userDAtaonFooter: true,
	   	rowNum: crdb.rowNum

	   	/*
	   	grouping:true, 
		groupingView : { 
		    groupField : ['reviewDeadline'],
		    groupDataSorted : true 
		},
	   	
	   	pager: "#CRDB_Pager"
	   	*/
	   	

	};

	crdb.futureReviewGrid.jqGrid('clearGridData');
	options.caption = "Upcoming Reviews";
	//options.colNames =['Id', 'Title', 'NIAIDADDSEncodedAbsURL',"Next Review Date", "Review Deadline" , "Status", "Role Coordinator", "Role Owner" ];
	crdb.futureReviewGrid.jqGrid(options);
	
	crdb.pastReviewGrid.jqGrid('clearGridData');
	options.caption = "Past Due Reviews";
	crdb.pastReviewGrid.jqGrid(options);
	
	$("#exporttbl1").on("click", function(){
		createExcelFromGrid("CRDB_FutureReviewDeadline", "TestableDownload");
	//		separator: ",",
	//		separatorReplace : "",
	//		quote : '"',
	//		escquote : '"',
	//		newLine : "\r\n",
	//		replaceNewLine : " ",
	//		includeCaption : true,
	//		includeLabels : true,
	//		includeGroupHeade : true,
	//		includeFooter: true,
	//		fileName : "TestDownloadable.xlsx",
	//		maxlength : 40
	//		returnAsString : false
	})
	
	var createExcelFromGrid = function(gridID,filename) {
		var grid = $('#' + gridID);
		var rowIDList = grid.getDataIDs();
		var row = grid.getRowData(rowIDList[0]);
		var colNames = [];
		var i = 0;
		for(var cNames in row) {
			colNames[i++] = cNames; //Capture Column Names
		}
		var html = "";
		for(var j=0;j<rowIDList.length;j++) {
			row = grid.getRowData(rowIDList[j]); // Get Each Row
			for(var i = 0 ; i<colNames.length ; i++){
				html += row[colNames[i]] + ';'; //Create a CSV delimited with ;
			}
			html += '\n';
		}
		html += '\n';
		
		var a = document.createElement('a');
		a.id = 'ExcelDL';
		a.href = 'data.application/vnd.ms-excel,' + html;
		a.download = filename ? filename + ".xls" : 'DataList.xls';
		document.body.appendChild(a);
		a.click(); //Downloads the excel document
		document.getElementById('ExcelDL').remove();
	}
};

NIAID.CRDB.UI.prototype.populateResults = function ( data ) {
	var crdb = this ;

	$.each( data, function(index, item) {
		try {
			var lastReview = moment( item.NIAIDADDSDateLastReviewed );//.add(1,"d"); 
			item.lastReviewedDate = moment( item.NIAIDADDSDateLastReviewed );//.add(1,"d");
			//item.reviewDeadline= lastReview.add(1,"y");
			item.reviewDeadline= lastReview.add(6,"M");
	
			/*

				crdb.now = moment() ;
				crdb.plusSixMonths = moment().add( 6, "M" );
				crdb.pastMonth = moment().subtract( 1, "M");
				crdb.pastSixMonths = moment().subtract( 6, "M");

			*/
			var grid ;
		
			if ( item.reviewDeadline > crdb.currentDate )
			{
				grid= crdb.futureReviewGrid;
			}
			else
			{
				grid= crdb.pastReviewGrid;
			}
			
			if ( item.reviewDeadline > crdb.now  && item.reviewDeadline < crdb.plusSixMonths )
			{
				crdb.timeBuckets.green += 1;
			}
			else if ( item.reviewDeadline > crdb.pastMonth && item.reviewDeadline <= crdb.now )
			{
				crdb.timeBuckets.yellow +=1 ;
			}
			else if ( item.reviewDeadline > crdb.pastSixMonths && item.reviewDeadline <= crdb.pastMonth ) 
			{
				crdb.timeBuckets.orange += 1 ;
			}
			else
			{
				crdb.timeBuckets.red += 1 ;
			}

			crdb.addToTimeBucket( item.reviewDeadline  ) ;

			grid.jqGrid( 'addRowData', item.Id, item );	

		} catch(err) {	
			
		}
								
		
	} );
};


NIAID.CRDB.UI.prototype.showLoadingMessage = function () {

	var crdb = this ;

	$("div.loading").show() ;

}

NIAID.CRDB.UI.prototype.hideLoadingMessage = function () {

	var crdb = this ;

	$("div.loading").hide() ;

}


NIAID.CRDB.UI.prototype.getResults = function( data )  
{

	var crdb = this ;
	crdb.showLoadingMessage();


	crdb.count = data.length;

	var next = data.__next ;
	if (next == undefined)
	{
			crdb.populateResults(data);

			setTimeout( function() 
			{
				crdb.futureReviewGrid.jqGrid( "sortGrid", "reviewDeadline", "asc" )	;
				crdb.pastReviewGrid.jqGrid( "sortGrid", "reviewDeadline", "desc" ) ;

				crdb.hideLoadingMessage() ;

				crdb.buildPieChart() ;

			}, 100);
				
	}
	else
	{
				crdb.populateResults(data);

				crdb.getResults(next);
	}

	 
}; 


NIAID.CRDB.UI.prototype.buildPieChart = function(  )  {
	var crdb = this ;
	//var css = { height: crdb.chartHeight, width: "480px" } ;
	var css1 = { height: "500px", width: "750px"} ;//290
	var css2 = { height: crdb.chartHeight, width: "750px"} ;//680
		
	crdb.barChart.css( css2 );
	crdb.pieChart.css( css1 );

	var data = [
		{
			label: "Upcoming",
			data: crdb.timeBuckets.green,
			color: "#00FF00"
		},
		{
			label: "Month<1 ", 
			data: crdb.timeBuckets.yellow,
			color: "#FFFF00" 
		},
		{
			label: "1-6 Months" ,
			data: crdb.timeBuckets.orange,
			color: "#FF8000"
		},
		{
			label: "Month>6", 
			data: crdb.timeBuckets.red,
			color: "#FF0000"
		}
	];

	crdb.pieChart.plot( data, 
	{ 
		series: 
		{ 
			pie: { show: true,
				   label: 
		           {      
				        show:true,
				        verticalAlign: 'bottom',
				        formatter: function (label, series) 
				        {                
	                		return '<div style="padding: 2px; text-align: bottom;font-size:small;">' +  Math.round(series.percent) +"%</div>" ;
			           	},
		           },
		         }
		},
		
		legend: 
		{
			show: true 
		}
	});

	crdb.barChart.plot( [

	{
		color: "#00FF00" ,
		bars: { show: true, align: "center" },
		data: [ ["Upcoming", crdb.timeBuckets.green ] ]

	},

	{
	    color:  "#FFFF00", 
		bars: { show: true , align: "center" },
		data: [ ["Month <1", crdb.timeBuckets.yellow ] ] //Less than a Month
	},

	{
		color: "#FF8000" ,
		bars: { show: true , align: "center" },
		data: [ ["1-6 Months", crdb.timeBuckets.orange ] ] //One to Six Months
	},

	{
		color: "#FF0000" ,
		bars: { show: true , align: "center" },
		data: [ ["Month >6", crdb.timeBuckets.red ] ] //Past Six Months
	}

	], { 
		xaxis: { mode: "categories", tickLength: 0 },
		grid: {
				hoverable: true,
				clickable: true
			} 
		} );

};


