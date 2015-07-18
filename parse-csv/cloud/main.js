
// Use Parse.Cloud.define to define as many cloud functions as you want.
var Mandrill = require('mandrill');
Mandrill.initialize('LmFjaaOMRN-IMp2sAMQPxg');

// Parse query to read data from database and email it
Parse.Cloud.define("getLibrary", function(request, response) {
  var query = new Parse.Query("Library");
  var res = [];
  query.find({

    success: function(results) {
	  var finalCSV = "";
  	  for (var i = 0; i < results.length; ++i) {
       	res = results[i].attributes;

       	for (var key in res) {
 		  if (res.hasOwnProperty(key)) {
    	    finalCSV += res[key] + ','
  		  }
		}
		finalCSV = finalCSV.slice(0,-1) + '\n';		
      }
      response.success(finalCSV);
  	},

    error: function() {
      response.error("Library lookup failed");
    },

  });
});


Parse.Cloud.define("sendCSV", function(request, response) {
	Mandrill.sendEmail({
		message: {
			text:'Please find CSV report attached.', 
	      	subject: 'CSV File From App', 
	      	from_email: 'parse-csv@test.com', 
	      	from_name: 'Parse CSV',
	      	to: [{
	      		email: 'successive.testing@gmail.com',
	      		name: 'SS Testing'
	      	}],
	      	attachments: [{
	      		type: 'text/csv',
	      		name: 'file.csv',
	      		content: request.params.attach
	      	}]
		},
		async: true
	},{
		success: function(httpResponse) {
			console.log(httpResponse);
			response.success("Email sent!");
		},
		error: function(httpResponse) {
			console.error(httpResponse);
			response.error("Uh oh, something went wrong");
		}
	});
    
});







