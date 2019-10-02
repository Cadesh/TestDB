// A SERIES OF TESTS TO CHECK THE INTEGRITY OF THE DATABASE

var async = require('async');
const fs = require('fs');
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
            saveToFile (result, "out_attributes.json")
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
            result = result.map(u => ({name: u.contentId, categories: u.categories}));
            saveToFile (result, "out_videos.json")
            videos = result

        db.close();
        });
    }); 
    return cb(null, videos)
}
//-----------------------------------------------

//-----------------------------------------------
//SAVE JSON AS CSV
//-----------------------------------------------
function saveToCSV(json, fileName) {
    json = Object.values(json);
    var csv = "";
    var keys = (json[0] && Object.keys(json[0])) || [];
    csv += keys.join(',') + '\n';
    for (var line of json) {
      csv += keys.map(key => line[key]).join(',') + '\n';
    }

    fs.writeFile(fileName, csv, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("csv file has been saved.");
    });

  }
//-----------------------------------------------

//-----------------------------------------------
// SELECT VIDEOS BY CATEGORY
//-----------------------------------------------
function getVideosByCategory(category) {
    console.log ('entered method getAllVideos by category')
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
            result = result.map(u => ({id: u._id, date: u.publishDate, categories: u.categories}));
            console.log("get videos: " + result.length);
 
            // SELECT THE VIDEOS BY THE CATEGORY
            //----------------------------------------
            var sample = new Array(); //empty array
            for (var k in result) {
                for( var key in result[k].categories){
                    if(result[k].categories[key] === category){
                        var locObj = result[k];
                        locObj.categories = [];
                        sample.push(result[k]);

                    }
                } 
            }
            console.log('Videos found: ' + sample.length);
            saveToCSV(sample, category.concat(".csv"));
            saveToFile (sample, category.concat(".json"));
            //-----------------------------------------

        db.close();
        });
    }); 
}
//-----------------------------------------------

//-----------------------------------------------
// SAVE DATA TO FILE
//-----------------------------------------------
function saveToFile (jsonData, fileName) {
  
    // stringify JSON Object
    var jsonContent = JSON.stringify(jsonData);
    //console.log(jsonContent);
    
    fs.writeFile(fileName, jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("file has been saved.");
    });
}
//-----------------------------------------------

function exitProgram() {
    console.log ('exiting');
    return process.exit(22);
}

//----------------------------------------------------
//EXECUTE FUNCTIONS ASYNCRONOUSLY 
//----------------------------------------------------
// result = async.series([
//     getAllAttributes,
//     getAllVideos,
//   ], 
// function(err) {
//   console.log('all functions complete')
// })
getVideosByCategory('wildlife');
//-----------------------------------------------------