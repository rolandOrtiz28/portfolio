const express = require('express')
const router = express.Router();
const Product = require('../model/product')
const catchAsync = require('../utils/catchAsync');





// all products
router.get('/products', async (req, res) => {

    const products = await Product.find({});

    res.render('products/index', { products });

});


// creating product
router.post('/products', catchAsync(async (req, res) => {
    try {

        const product = new Product(req.body.product)
        const saveProduct = product.save();
        res.redirect('/products')
    } catch (err) {
        console.log(err.message);
        res.redirect('/products')
    }
}))

router.get('/products/new', (req, res) => {

    res.render('product/new-product')
})

//show product
router.get('/products/:id', catchAsync(async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            req.flash('error', "We cannot find that product")
            return res.redirect('/products')
        }
        res.render('products/show', { product })

    } catch (err) {
        next(err)
    }
}))
//update product
router.get('/products/:id/edit', async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        if (!product) {
            req.flash('error', "We cannot find that product")
            return res.redirect('/products')
        }
        res.render('products/edit', { product })
    } catch (err) {
        console.log(err.message);
        res.redirect('/products')
    }
})

//show
router.put('/products/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
    await product.save();
    req.flash('success', 'Product updated')
    res.redirect(`/products`)

}))


//delete product
router.delete('/:id', catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        return res.redirect('/products');
    } catch (err) {
        console.log(err.message);
        res.redirect('/products')
    }
}))






module.exports = router;