'use strict';

angular.module('mean.socket').controller('MeanSocketController', ['$scope', '$state', 'Global', 'MeanSocket',
	function($scope, $state, Global, MeanSocket) {
		$scope.global = Global;
		$scope.bdds = [];
		$scope.tables = [];
		$scope.datas = [];
		$scope.showSelector = true;
		$scope.nameBddCurrent = '';
		$scope.showDataTable = false;
		$scope.headerDocs = [];
		$scope.allTables = [];
		$scope.allDatas = [];

		$scope.package = {
			name: 'socket'
		};
	
		$scope.socketAfterSend = function(message) {
			$scope.message = {};
		};

		$scope.socketAfterJoin = function(channel, messages) {
			$scope.activeChannel = channel;
			$scope.messages = messages;
		};

		$scope.socketAfterGet = function(message) {
			$scope.messages.push(message);
		};

		$scope.socketAfterGetChannels = function(channels) {
			$scope.channels = channels;
		};

		$scope.createNewChannel = function(channel) {
			$scope.activeChannel = channel;
			$scope.newChannel = '';
		};

		/*-----------------------------------------------------------*/
		/*-----------------------------------------------------------*/
		/************** BDD  CONTROLLER   REAL-TIME SOCKET.IO ********/
		/*-----------------------------------------------------------*/
		/*-----------------------------------------------------------*/


		$scope.showVisualisation3D = function(){
			$scope.showSelector = false;
		}
		$scope.showVisualisationNormal = function(){
			$scope.showSelector = true;
		}
		$scope.getAllDatabases = function(){
			//console.log('showalldatabases event in meansocket!')
			
			MeanSocket.emit('getAllDatabases', {
		 		name: $scope.global.user._id
			});
			console.log('emit Client');
		}
		$scope.getAllDatabasesData = function(){
			//console.log('showalldatabasesData event in meansocket!')
			
			MeanSocket.emit('showAllDatabasesData', {
		 		name: $scope.global.user._id
			});
			console.log('emit Client');
		}
		MeanSocket.on('showAllDatabasesData', function showAllDatabasesData(data) {
	 		//$scope.bdds.push(bdd);
	 		console.log(data);
	 	});
		MeanSocket.on('showAllDatabases', function showAllDatabases(bdd) {
	 		$scope.bdds.push(bdd);
	 	});
		MeanSocket.on('getAllTablesAfterBdd', function getAllTablesAfterBdd(bdd) {
	 		for(var i =0; i<$scope.bdds.length; i++){
	 			//console.log('getTable : '+$scope.bdds[i].bdd.name);
	 			//$scope.getBddTableByNameAll($scope.bdds[i].bdd.name);

	 			if(i == ($scope.bdds.length-1)){
	 				var finalRequest = true;
	 			}else{
	 				var finalRequest = false;
	 			}
	 			MeanSocket.emit('getBddTableByNameAll',{
	 				collectionName: $scope.bdds[i].bdd.name,
	 				finalRequest: finalRequest
	 			});
	 		}
	 	});
	 	MeanSocket.on('retrieveAllTables', function retrieveAllTables(table) {
	 		$scope.allTables.push(table);
	 	});

	 	MeanSocket.on('retrieveAllDatas', function retrieveAllDatas(retrieve) {
	 		$scope.allDatas.push({datas:retrieve.datas, header: retrieve.headerDocs});
	 	});

	 	MeanSocket.on('getAllDatasAfterTables', function getAllDatasAfterTables() {
	 		console.log($scope.allTables);
	 		console.log($scope.allTables.length);
	 		for(var i =0; i<$scope.allTables.length; i++){
	 			//console.dir($scope.allTables[i]);
	 			//$scope.getBddTableByNameAll($scope.bdds[i].bdd.name);
	 			if(i == ($scope.allTables.length-1)){
	 				var finalRequest = true;
	 			}else{
	 				var finalRequest = false;
	 			}

	 			console.log(finalRequest+'  : finalRequest');
	 			MeanSocket.emit('getAllDatasAfterTables',{
	 				collectionName: $scope.allTables[i].table.name,
	 				finalRequest: finalRequest
	 			});
	 			
	 		}
	 	});



		MeanSocket.on('showRender3D',function showRender3D(){
			console.log('showRender !');

			var dataObject3D = {};
			dataObject3D.bdd = [];
			dataObject3D.table = [];
			dataObject3D.datas = [];
			for(var i =0; i<$scope.bdds.length; i++){
				dataObject3D.bdd.push($scope.bdds[i].bdd.name);
			}
			for(var i =0; i<$scope.allTables.length; i++){
				/*var bddTable = $scope.allTables[i].table.name;
				var nameBdd ='';
				var nameTable ='';
				bddTable = bddTable.split('.');
			    for(var i = 0; i< bddTable.length; i++){
			        if(i == 0)
			            nameBdd=bddTable[0];
			        else if(i==1)
			             nameTable=bddTable[1];
			        else
			            nameTable+='.'+bddTable[i];
			    }
			    console.log(nameBdd+'   '+nameTable);*/
			    /*
			    var arrayTmp = [];
			    arrayTmp.push(nameTable);
			    arrayTmp.push(nameBdd);*/
				dataObject3D.table.push($scope.allTables[i].table.name);
			}
			for(var i =0; i<$scope.allDatas.length; i++){
				dataObject3D.datas.push($scope.allDatas[i]);
			}

			console.log(dataObject3D);
			init(dataObject3D,'bases');
			animate();
		});

		$scope.getBddTableByName = function(nameBdd){
			console.log('CLIENT SIDE : '+nameBdd);
			$scope.tables = [];
			$scope.showDataTable = false;
			MeanSocket.emit('getBddTableByName', {
		 		name: $scope.global.user._id,
		 		bddName: nameBdd
			});
		}
		MeanSocket.on('showAllTables', function showAllTables(table,nameBdd) {
	 		$scope.tables.push(table);
	 		$scope.nameBddCurrent = nameBdd;
	 	});

		$scope.getAllDataByTable = function(nameTable,nameBdd){
			console.log('CLIENT SIDE : '+nameTable);
			$scope.datas = [];
			MeanSocket.emit('getAllDataByTable', {
		 		name: $scope.global.user._id,
		 		tableName: nameTable,
		 		bddName: nameBdd
			});
		}
		MeanSocket.on('showAllDatas', function showAllDatas(object) {
			$scope.headerDocs = object.headerDocs;
			$scope.showDataTable = true;
			for(var i =0; i< object.datas.length; i++){
				$scope.datas.push(object.datas[i]);
			}
	 		
	 	});
	 	

		/*-----------------------------------------------------------*/
		/*-----------------------------------------------------------*/
		/************** BDD  CONTROLLER   REAL-TIME SOCKET.IO ********/
		/*-----------------------------------------------------------*/
		/*-----------------------------------------------------------*/







		// $scope.channel = {
		// 	name: ''
		// };

		// // 			// //App info
		// // // $scope.channels = [];
		// $scope.listeningChannels = [];
		// // // $scope.activeChannel = null;
		// // // $scope.userName = $scope.global.user._id;
		// // // $scope.messages = [];

		// // // ///////////////////////////////////////////////////////////////////////
		// // // ///////////////////////////////////////////////////////////////////////
		// // // //Socket.io listeners
		// // // ///////////////////////////////////////////////////////////////////////
		// // // ///////////////////////////////////////////////////////////////////////

		// // // MeanSocket.on('channels', function channels(channels) {
		// // // 	console.log('channels', channels);

		// // // 	console.log(channels);
		// // // 	$scope.channels = channels;
		// // // 	$scope.channels = channels;
		// // // });

		// // // MeanSocket.on('message:received', function messageReceived(message) {
		// // // 	$scope.messages.push(message);
		// // // });

		// // // MeanSocket.emit('user:joined', {
		// // // 	name: $scope.global.user._id
		// // // });

		// // // MeanSocket.on('user:joined', function(user) {
		// // // 	console.log('user:joined');
		// // // 	$scope.messages.push(user);
		// // // });

		// $scope.listenChannel = function listenChannel(channel) {
		// 	MeanSocket.on('messages:channel:' + channel, function messages(messages) {
		// 		alert(channel)
		// 		MeanSocket.activeChannel = channel;
		// 		$scope.afterJoin({
		// 			messages: messages,
		// 			channel: channel
		// 		});
		// 	});

		// 	MeanSocket.on('message:channel:' + channel, function message(message) {
		// 		console.log('got message: ', message);
		// 		console.log(channel, MeanSocket.activeChannel)
		// 		if (channel === MeanSocket.activeChannel) {
		// 			$scope.meanSocketAfterGet({
		// 				message: message
		// 			});
		// 		}
		// 	});

		// 	MeanSocket.on('message:remove:channel:' + channel, function(removalInfo) {

		// 	});

		// 	if ($scope.listeningChannels.indexOf(channel) === -1)
		// 		$scope.listeningChannels.push(channel);

		// };

		// // Join

		// $scope.joinChannel = function joinChannel(channel) {
		// 	alert(channel);
		// 	//Listen to channel if we dont have it already.
		// 	if ($scope.listeningChannels.indexOf(channel) === -1) {
		// 		$scope.listenChannel(channel);
		// 	}

		// 	MeanSocket.emit('channel:join', {
		// 		channel: channel,
		// 		name: $scope.global.user._id
		// 	});
		// };

		// //Auto join the defaultChannel
		// console.log(typeof MeanSocket.activeChannel)
		// if (typeof MeanSocket.activeChannel === 'undefined')
		// 	$scope.joinChannel('mean');

		// // $scope.$watch('joinToChannel', function() {
		// // 	if ($scope.joinToChannel)
		// // 		$scope.joinChannel($scope.joinToChannel);
		// // });
	}
]);