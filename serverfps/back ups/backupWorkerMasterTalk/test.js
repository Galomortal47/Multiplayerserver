cluster.on('message',(worker,msg,handle) =>{
  console.log(msg);
  worker.send('hi worker');
});


process.send('hi master');

process.on('message',(msg) =>{
  console.log(msg);
});
