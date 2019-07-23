const express = require('express')
const consola = require('consola')
const bodyParser = require('body-parser')
const cors = require('cors')
const { Nuxt, Builder } = require('nuxt')
const app = express()

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database(__dirname+'\\whiteboard.sqlite3');
var content = []; 

db.serialize(function () {
  var result = {}; 
  db.each('SELECT * FROM personal',  function(err, row) {
      if (err){
          console.log('エラー：'+err);
      }else{
          result['user']=row.name;
          result['schedule']=row.schedule;
      }
  }, function(err, count){  //←complete処理追加
      if (err){
        console.log('エラー：'+err);
      }else{
        if (count == 0){
          console.log('0件');
        }else{
          content.push(result);
          console.log('complete');
        }
      }
  });
  result = {};
})
db.close();


// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }


  app.get('/', (req, res) => {
    (async () => {
      req.data = content;
      const result = await nuxt.renderRoute('/', { req });
      res.send(result.html);
    })();
  });

  // Give nuxt middleware to express
  app.use(nuxt.render)
  app.use(cors())


  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })




  

  // // POST されたデータを受け取るための設定を行う
  // app.post('/test', function(req, res) {
  //   res.send({
  //     message: 'Hello world!'
  //   })
  // })


  // ルータを設定する
  // const restApiRoot = '/api';
  // app.use(restApiRoot, require('./routes/router'));


}
start()
