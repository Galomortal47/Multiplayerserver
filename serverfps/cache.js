const redis = require('redis');

var client = redis.createClient();

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

client.on('connect', function(){
  //console.log('connected');
});

module.exports = function(){

this.set_cache = function (key,time,value){
  client.setex(key, time, value);
}

var data = 'test';

this.get_cache = function (array_of_keys){
  client.mget(array_of_keys, function(err, docs){
		data = docs;
	});
	return data;
}

this.del_cache = function (key){
  client.del(key);
}

this.all_cache = function (key){
  client.keys(key, function (err, keys) {
    client.mget(keys, function(err, docs){
  		data = docs;
  	});
    });
  return data;
}

this.clean_all_cache = function(){
  client.flushdb();
}

};
