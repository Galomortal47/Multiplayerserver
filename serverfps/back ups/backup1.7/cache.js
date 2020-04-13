const redis = require('redis');

var client = redis.createClient();

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

client.on('connect', function(){
  //console.log('connected');
});

//set_cache("key", 20,"value");
//set_cache("name:key2", 20,"value2");
//all_cache("*name:*");
//get_cache(["key","key2"]);
//del_cache(["key"]);
//clean_all_cache();
//ttl_cache('key')

function clean_all_cache(){
  client.flushdb();
}

function set_cache(key, time,value){
  client.setex(key, time, value, redis.print);
}

function get_cache(array_of_keys){
  client.mget(array_of_keys, redis.print);
}

function del_cache(key){
  client.del(key, redis.print);
}

function all_cache(key){
  client.keys(key, function (err, keys) {
    console.log(keys);
  });
}

function ttl_cache(key){
  client.ttl(key, redis.print);
}

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
