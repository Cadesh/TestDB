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
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
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
// GET ALL ATTRIBUTES FROM ATTRIBUTES COLLECTION
//-----------------------------------------------
function getAllAttributes(cb) {
    console.log ('entered method getAllAttributes')
    var attributes;
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(catDB);
        dbo.collection('attributes').find().toArray(function(err, result) {
            if (err) throw err;
            if (result.length == 0) {
                console.log ("Collection attributes is empty");
                return cb(err);
            } 
            //take out unecessary info
            result = result.map(u => ({name: u.name, type: u.type}));
            attributes = result;

        db.close();
        });
    });
    return cb(null, attributes);
}

//-----------------------------------------------
// GET ALL VIDEOS FROM VIDEOS COLLECTION
//-----------------------------------------------
function getAllVideos(cb) {
    console.log ('entered method getAllVideos')
    var videos;
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(catDB);
        dbo.collection('videos').find().toArray(function(err, result) {
            if (err) throw err;
            if (result.length == 0) {
                console.log ("Collection videos is empty");
                return cb(err);
            } 
            //take out unecessary info
            result = result.map(u => ({name: u.contentId, attributes: u.attributes, categories: u.categories}));
            videos = result

        db.close();
        });
    }); 
    return cb(null, videos)
}

function exitProgram() {
    console.log ('exiting');
    return process.exit(22);
}

//----------------------------------------------------
//EXECUTE FUNCTIONS ASYNCRONOUSLY 
//----------------------------------------------------
result = async.series([
    getAllAttributes,
    getAllVideos
  ], 
function(err) {
  console.log('all functions complete')
})
//-----------------------------------------------------