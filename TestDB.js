// A SERIES OF TESTS TO CHECK THE INTEGRITY OF THE DATABASE

var async = require('async');
var MongoClient = require('mongodb').MongoClient;

//----------------------------------------------------------
// SOME GLOBAL PARAMETERS
//----------------------------------------------------------
catDB = 'vubble'; // name of the database
//----------------------------------------------------------

//----------------------------------------------
// CREATE MONGO DB MODEL
//----------------------------------------------

var url = "mongodb://localhost:27017/";

//-----------------------------------------------
// LIST ALL COLLECTIONS (TABLES) IN A DATABASE 
//-----------------------------------------------
function listAllCollections() {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(catDB);
        
        let cols = function() {
            return dbo.listCollections().toArray().then(collections => { return collections } )
        };
        let userToken = cols()
        userToken.then(function(result) {
            console.log(result) // "Some User token"
        });
        db.close();
    });
}

//-----------------------------------------------
// LIST ALL ATTRIBUTES FROM ATTRIBUTES COLLECTION
//-----------------------------------------------
function getAllAttributes() {
    console.log ('entered method getAllAttributes')
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(catDB);
        dbo.collection('attributes').find().toArray(function(err, result) {
            if (err) throw err;
            if (result.length == 0) {
                console.log ("Collection attributes is empty");
                return
            } 
            //take out unecessary info
            result = result.map(u => ({name: u.name, type: u.type}));
            console.log (result);

        db.close();
        });
    });
}

function exitProgram() {
    console.log ('exiting');
    return process.exit(22);
}

listAllCollections();
getAllAttributes();

//

// var arg = ''
// async.waterfall([
//     // A list of functions
//     function(callback){
//         // Function no. 1 in sequence
//         getAllAttributes();
//         callback(null, arg);
//     },
//     function(arg, callback){
//         // Function no. 2 in sequence
//         exitProgram();
//         callback(null);
//     }
//   ],    
//   function(err, results){
//      // Optional final callback will get results for all prior functions
//   });


// MongoClient.connect(url, function(err, db) {
//     MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db(catDB);
//         dbo.createCollection('attributes', function(err, res) {
//             if (err) throw err;
//             console.log("requestTbl created!");
//             db.close();
//         });
//         dbo.createCollection('videos', function(err, res) {
//             if (err) throw err;
//             console.log("responseTbl created!");
//             db.close();
//         });
        
//     });
// });
//-----------------------------------------------