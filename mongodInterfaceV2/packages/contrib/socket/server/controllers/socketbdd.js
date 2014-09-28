
exports.getFullConnection = function(){

    var mongoose = require('mongoose'),
        Admin = mongoose.mongo.Admin;

    /// create a connection to the DB    
    var connection = mongoose.createConnection('mongodb://localhost:27017/');

    return {connection:connection, Admin:Admin};
}

exports.getConnectionDB = function(name){
    var mongoose = require('mongoose'),
        Admin = mongoose.mongo.Admin;

    /// create a connection to the DB    
    //var connection = mongoose.createConnection('mongodb://localhost:27017/'+name);
    //mongoose.connect('mongodb://localhost/'+name);
    var conn2 = mongoose.createConnection('mongodb://localhost/'+name);
    return conn2;
}

//RECUPERE TOUTES LES BDDS DE MONGODB
exports.mongoGetAllDatabases = function(socket){
    var imports = this.getFullConnection(),
        Admin = imports.Admin,
        connection = imports.connection,
        allDatabases;

    connection.on('open', function() {
        new Admin(connection.db).listDatabases(function(err, result) {
            allDatabases = result.databases; 
            for(var i = 0; i< allDatabases.length; i++){
                console.log(allDatabases[i]);
                socket.emit('showAllDatabases',{
                    bdd:allDatabases[i]
                });
            }
            /*socket.emit('showRender3D',{

            });*/
        });
    });

}

exports.getBddTableByNameAll = function(socket,collec,finalRequest){
    var connection = this.getConnectionDB(collec);
    //db.getCollectionsName();
    connection.on('open', function (ref) {
        console.log('Connected to mongo server.');
        //trying to get collection names
        connection.db.collectionNames(function (err, names) {
            allTables = names; 
            for(var i = 0; i< allTables.length; i++){
                console.log(allTables[i]);
                socket.emit('retrieveAllTables',{
                    table:allTables[i]
                });
            }
            if(finalRequest == true){
                socket.emit('getAllDatasAfterTables',{
                   
                });
            }
        });
    });
}


exports.getAllDatasAfterTables = function(socket,collec,finalRequest){
    console.log('getAllDatasAfterTables');
    var bddTable = collec.split('.');
    for(var i = 0; i< bddTable.length; i++){
        if(i == 0)
            nameBdd=bddTable[0];
        else if(i==1)
             nameTable=bddTable[1];
        else
            nameTable+='.'+bddTable[i];
    }
    var connection = this.getConnectionDB(nameBdd);
    var closure = this;
    //db.getCollectionsName();
    connection.once('open', function callback () {
        closure.findCollection(nameTable, {}, connection,function (err, docs) {
            
            var headerDocs = [];
            for (var key in docs[0]) {
                headerDocs.push(key);
            }
           
            socket.emit('retrieveAllDatas',{
                datas:docs,
                headerDocs: headerDocs
            });
            console.log(finalRequest);
        if(finalRequest == true){
                socket.emit('showRender3D',{
                    
                });
            }
            
           
        });
        
    });
    
}


exports.mongoGetAllDatabasesData = function(socket){
    var imports = this.getFullConnection(),
        Admin = imports.Admin,
        connection = imports.connection,
        allDatabases;
    var closure = this;

    connection.on('open', function() {
        new Admin(connection.db).listDatabases(function(err, result) {
            allDatabases = result.databases;
            var connection = [];
            for(var i = 0; i< allDatabases.length; i++){
                console.log(allDatabases[i].name);
                
                //connection[i] = closure.getConnectionDB(allDatabases[i].name);
            }
            socket.emit('getAllTablesAfterBdd',{

            });
            //closure.getDatas(connection);
            /*for(var j = 0; j < connection.length; j++){
                    connection[j].on('open', function (ref) {
                        console.log('Connected to mongo server.');
                        //trying to get collection names
                        connection[j].db.collectionNames(function (err, names) {
                            allTables = names;
                            if(allTables){
                                for(var h = 0; h< allTables.length; h++){
                                    console.log(allTables[h]);
                                    
                                }
                            }
                        });
                    });
                }*/
           
        });
    });

}

exports.getDatas = function(connection){
   //for(var j = 0; j < connection.length; j++){
        /*connection[j].on('open', function (ref) {
            console.log('Connected to mongo server.');
            //trying to get collection names
            connection[j].db.collectionNames(function (err, names) {
                allTables = names;
                if(allTables){
                    for(var h = 0; h< allTables.length; h++){
                        console.log(allTables[h]);
                        
                    }
                }
            });
        });*/
    //}
}

exports.getAllTablesByBddName = function(socket, name){
    /*var imports = this.getConnectionDB(),
        Admin = imports.Admin,
        connection = imports.connection,
        allDatabases;*/
    var connection = this.getConnectionDB(name);
    //db.getCollectionsName();
    connection.on('open', function (ref) {
        console.log('Connected to mongo server.');
        //trying to get collection names
        connection.db.collectionNames(function (err, names) {
            allTables = names; 
            for(var i = 0; i< allTables.length; i++){
                console.log(allTables[i]);
                socket.emit('showAllTables',{
                    table:allTables[i]
                });
            }
        });
    });
}

exports.findCollection = function(collec, query,connect, callback){
    connect.db.collection(collec, function (err, collection) {
        collection.find(query).toArray(callback);
    });
}

exports.getAllDataByTable = function(socket, nameTable, nameBdd){
    var bddTable = nameTable.split('.');
    for(var i = 0; i< bddTable.length; i++){
        if(i == 0)
            nameBdd=bddTable[0];
        else if(i==1)
             nameTable=bddTable[1];
        else
            nameTable+='.'+bddTable[i];
    }
    console.log(nameBdd+'   '+nameTable);
    var connection = this.getConnectionDB(nameBdd);
    var closure = this;
    //db.getCollectionsName();
    connection.once('open', function callback () {
        closure.findCollection(nameTable, {}, connection,function (err, docs) {
            
            var headerDocs = [];
            for (var key in docs[0]) {
                headerDocs.push(key);
            }
           
            socket.emit('showAllDatas',{
                datas:docs,
                headerDocs: headerDocs
            });
        });
    });
}
