const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;

const ObjectId = require("mongodb").ObjectID;

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//console.log(process.env.DB_USER)
app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tn7le.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err )
  const productCollection = client.db("pcGame").collection("products");
  const orderCollection = client.db("pcGame").collection("orders");

 
  app.get('/product', (req, res) => {
    productCollection.find()
    .toArray((err, items) => {
        res.send(items)
    })
})


app.get('/product/:season', (req, res) => {
    console.log(req.params.season);
  productCollection.find({season: req.params.season})
  .toArray( (err, documents) => {
    console.log(documents)
      res.send(documents[0]);
  })
})


 
  app.post('/addProduct' , (req, res) => {
  const newProduct = req.body;
  console.log('adding new product:', newProduct);
  productCollection.insertOne(newProduct) 
  .then(result => {
       console.log('inserted count:', result)
       res.send(result.insertedCount >0)
  })

  })

  app.post('/addOrder' , (req, res) => {
    const newOrder = req.body;
    console.log(newOrder);
    orderCollection.insertOne(newOrder) 
    .then(result => {
         //console.log('inserted count:', result)
         res.send(result.insertedCount >0)
    })
    })


    


  app.get('/order/:email', (req, res) => {
    //console.log(req.query.email);
    orderCollection.find({"email": req.params.email})

    //orderCollection.find({email: req.query.email})
.toArray((err,documents) =>{
        console.log(documents);
        res.send(documents);
        
       })

  })


/////////////////////////////////////////////////


app.delete('deleteProduct/:id', (req, res) => {

   const id = ObjectId(req.params.id);
   console.log('delete this', id)
    productCollection.findOneAndDelete({_id: id})
  .then(documents => res.send(!!documents.value))
 


      })




   console.log('Database connection successfully')
  
  


});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})