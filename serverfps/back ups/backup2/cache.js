const redis = require('redis');

var client = redis.createClient();

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

client.on('connect', function(){
  console.log('connected');
});

//set_cache("key","value");
//set_cache("key2","value2");
//all_cache()
//get_cache(["key","key2"]);
//del_cache(["key"]);
//set_cache("key2","[value2, value3");
//get_cache(["key","key2"]);
//app_cache("key2",", value3, value4]");
//get_cache(["key","key2"]);

function set_cache(key,value){
  client.set(key, value, redis.print);
}

function app_cache(key,value){
  client.append(key, value, redis.print);
}

function get_cache(array_of_keys){
  client.mget(array_of_keys, redis.print);
}

function del_cache(key){
  client.del(key, redis.print);
}

function all_cache(){
  client.keys('*', function (err, keys) {
    console.log(keys);
    });
}

module.exports = function(){

this.set_cache = function (key,value){
  client.set(key, value);
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
  client.keys('*', function (err, keys) {
    data = keys;
    });
  return data;
}
};
