var mongoose = require('mongoose');

var employeeSchema = mongoose.Schema({
	
   userId:  String,
   fName:   String,
   lName:   String,
   addr1:   String,
   addr2:   String,
   role:    String,
   updated: Date,
   created: Date
});

var Employee = mongoose.model('employee', employeeSchema);

mongoose.connect('mongodb://localhost:27017/roster');
//mongoose.connect('mongodb://admin:admin@ds147421.mlab.com:47421/employees');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db not connected...'));
db.once('open', function callback() {});

var sessionToken = "";

module.exports = {
  postToken:         postToken,
  getEmployees:      getEmployees,
  getSingleEmployee: getSingleEmployee,
  createEmployee:    createEmployee,
  updateEmployee:    updateEmployee,
  deleteEmployee:    deleteEmployee
};

function checkToken(token)
{
   return true; // (token == sessionToken);
}

function postToken(req, res, next) {

   sessionToken = req.swagger.params.body.value.token;
   console.log("postToken() " + sessionToken);
	  
   res.json("OK" );
}
	
function getEmployees(req, res, next) {

   var size = req.swagger.params.size.value;
   var user = req.swagger.params.user.value;

   console.log("getEmployees() size=" + size + " user=" + user);
   
   if (checkToken(req.headers.token) != true) {
	  res.code = 455;
      return res.json("{code: 400, message: 'Invalid Token'}");
   };
   
   if (user == undefined) {
	  Employee.find({}, {}, {limit:size}, function(err, data) {
         if(err) {
            return next(err);
         }
            res.json(data);}); 
   }
   else {   
	  Employee.find({'userId':user}, {}, {limit:size}, function(err, data) {
         if(err) {
            return next(err);
         }
            res.json(data);}); 
   }
}

function getSingleEmployee(req, res, next) {
  
   var userId = parseInt(req.swagger.params.id.value);
   console.log('getSingleEmployee() userId=' + userId);
 
   if (checkToken(req.headers.token) != true) {
	  res.code = 455;
      return res.json("{code: 400, message: 'Invalid Token'}");
   };
 
   Employee.findOne({'userId':userId} , function(err, data) {
      if(err) {
         return next(err);
      }
         res.json(data);
   });
}

function createEmployee(req, res, next) {

   console.log("createEmployee() userId=" + req.swagger.params.body.value.userId);
 
   if (checkToken(req.headers.token) != true) {
	  res.code = 455;
      return res.json("{code: 400, message: 'Invalid Token'}");
   };

   var currentDateTime = new Date();

   var employee = new Employee({
      userId:  req.swagger.params.body.value.userId,
      fName:   req.swagger.params.body.value.fName,
      lName:   req.swagger.params.body.value.lName,
      addr1:   req.swagger.params.body.value.addr1, 
      addr2:   req.swagger.params.body.value.addr2,
      role:    req.swagger.params.body.value.role,
	  created: currentDateTime,
	  updated: currentDateTime
      });
		
   employee.save(function(err, data) {
      if(err) {
         return next(err);
      }
      res.status(200)
         .json({
            status:  'success',
            message: 'Created Employee'
      });        
   });
}

function updateEmployee(req, res, next) {
	
   var userId = parseInt(req.swagger.params.id.value);
   console.log("updateEmployee() userId=" + userId);
   
   if (checkToken(req.headers.token) != true) {
	  res.code = 455;
      return res.json("{code: 400, message: 'Invalid Token'}");
   };

   var currentDateTime = new Date();
   
   req.swagger.params.body.value.updated = currentDateTime;
      
   Employee.findOneAndUpdate({'userId':userId} , 
                           {$set:req.swagger.params.body.value} ,
						   function(err, data) {
      if(err) {
         return next(err);
      }
      res.status(200)
         .json({
            status:  'success',
            message: 'Updated Employee'
      });       
  });
}

function deleteEmployee(req, res, next) {

   var userId = parseInt(req.swagger.params.id.value);
   console.log("deleteEmployee() userId=" + userId);

   if (checkToken(req.headers.token) != true) {
	  res.code = 455;
      return res.json("{code: 400, message: 'Invalid Token'}");
   };
   
   Employee.findOneAndRemove({'userId':userId} , function(err, data) {
      if(err) {
         return next(err);
      }
	  if (data == null)
      res.status(200)
         .json({
            status:  'no success',
            message: 'Deleted Employee'
      })
	  else
      res.status(200)
         .json({
            status:  'success',
            message: 'Deleted Employee'
      })
       
  });
}
