const Product = require('../models/product');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
//Create Product (Admin only)

module.exports.createProductController = (req, res) => {
  const token = req.headers.authorization;
  
  // Verify the token and check if the user is an admin
const trimmedToken = token.trim();
jwt.verify(trimmedToken, 'gelca', (err, decoded) => {
  if (err) {
    console.log(err);
    return res.status(403).json({ message: 'Invalid token' });
  }
    const isAdmin = decoded.isAdmin;
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admin can access' });
    }
    
    // Create the product
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      isActive: true,
      createdOn: new Date()
    });

    newProduct.save()
      .then(result => res.send(result))
      .catch(err => res.send(err));
  });
};


//Retrieve all products
module.exports.getAllProductsController = (req, res) => {
  Product.find()
    .then(products => {
      res.send(products);
    })
    .catch(err => {
      res.send(err);
    });
};

// Retrieve active products
module.exports.getActiveProductsController = (req, res) => {
  Product.find({ isActive: true })
    .then(products => {
      res.send(products);
    })
    .catch(err => {
      res.send(err);
    });
};

// Retrieve a single product by ID
module.exports.getProductByIdController = (req, res) => {

  Product.findById(req.params.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: 'Not found' });
      }
      res.send(product);
    })
    .catch(err => {
      res.send(err);
    });
};


//Update Product information (Admin only)
module.exports.updateProductController = (req, res) => {
  const token = req.headers.authorization;


  const trimmedToken = token.trim();


  jwt.verify(trimmedToken, 'gelca', (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    const isAdmin = decoded.isAdmin;
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admin can access' });
    }

    const { name, description, price,isActive } = req.body; // Extract the updated product information from the request body
    const productId = req.params.productId;

    Product.findByIdAndUpdate(
      productId,
    { name, description, price, isActive },
    { new: true }
    )
      .then(updatedProduct => {
        if (!updatedProduct) {
          return res.status(404).json({ message: 'Product not found' });
        }
        res.send(updatedProduct);
      })
      .catch(err => {
        res.send(err);
      });
  });
};


// Archive Product (Admin only)
module.exports.archiveProductController = (req, res) => {

      const token = req.headers.authorization;
  
  // Verify the token and check if the user is an admin
const trimmedToken = token.trim();
    jwt.verify(trimmedToken, 'gelca', (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: 'Invalid token' });
        }
        const isAdmin = decoded.isAdmin;
        if (!isAdmin) {
            return res.status(403).json({ message: 'Only admin can access' });
        }
    

        Product.findByIdAndUpdate(req.params.productId, { isActive: false }, { new: true })
            .then(archivedProduct => {
                if (!archivedProduct) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                res.send(archivedProduct);
            })
            .catch(err => {
                res.send(err);
            });
    });
};

