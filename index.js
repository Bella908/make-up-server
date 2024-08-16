const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://glow:i78uYwm8nl0w1eqQ@cluster0.ld1lprp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";






// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const itemCollection = client.db('glow').collection('product');


    app.get('/items', async (req, res) => {
      try {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 10;
          const searchQuery = req.query.search || ''; 
          const brand = req.query.brand || ''; 
          const category = req.query.category || ''; 
          const minPrice = parseFloat(req.query.minPrice) || 0;
          const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_VALUE;

          const skip = (page - 1) * limit;

          // Build the search and filter criteria
          const filter = {
              productName: { $regex: searchQuery, $options: 'i' },
              ...(brand && { brand: { $regex: brand, $options: 'i' } }), // Case-insensitive filter for brand name
              ...(category && { category: { $regex: category, $options: 'i' } }), // Case-insensitive filter for category name
              price: { $gte: minPrice, $lte: maxPrice } // Price range filter
          };

          // Fetch filtered items with pagination
          const cursor = itemCollection.find(filter).skip(skip).limit(limit);
          const result = await cursor.toArray();
          const totalItems = await itemCollection.countDocuments(filter);

          res.send({
              totalItems,
              totalPages: Math.ceil(totalItems / limit),
              currentPage: page,
              items: result
          });
      } catch (error) {
          console.error('Error fetching items with filters:', error);
          res.status(500).send('Server error');
      }
  });

  
  
  
    
    app.get('/count',async(req , res) =>{
        const count = itemCollection.estimatedDocumentCount();
        
        res.send({count});

    })



    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);




app.get('/',(req,res) =>{
    res.send('Simple')
})

app.listen(port,() =>{
    console.log(`simple,${port}`)
})