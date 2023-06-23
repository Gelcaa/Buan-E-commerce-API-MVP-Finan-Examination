const express = require('express');
const mongoose = require('mongoose');
const app = express();

const port = 3000;

mongoose.connect("mongodb+srv://admin:admin123@dlsud-sandbox.buqsgnm.mongodb.net/E-commerce?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }


);
let db = mongoose.connection;

//middleware
app.use(express.json())

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');



app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);

// for get
app.get('/hello', (req, res) => {
    res.send('Hello from our backend!')
})

db.on("error", console.error.bind(console, "Connection Error."));
db.once("open", () => console.log("Connected to MongoDB."))

app.listen(port, () => console.log(`Server is running at port ${port}`));