/*
getAll
getById
create
update
remove
*/
const Product = require('../models/Product');

module.exports.getAll = async (req, res) => {
    try {
        const products = await Product.find(); 
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            "error": {"message": error.message} 
        });
    }
}
module.exports.getById = async (req, res) => {
    try {
        const product = await Product.findOne({ sku: req.params.id });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product with this sku not found'
            });
        }
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            "error": {"message": error.message} 
        });
    }
}
module.exports.remove = async (req, res) => {
    try{
        const product = await Product.findOne({sku: req.params.id});
        if(product){
            await product.deleteOne();
            res.status(200).json({
                success: true,
                data: "Product deleted"
            });
        }else {
            res.status(404).json({
                success: false,
                "error": {"message": 'Product not found'}
            });
        }
    }catch(e){
        res.status(500).json({ 
            success: false, 
            "error": {"message": e.message} 
        });
    }
}
module.exports.create = async (req, res) => {
    try{
        const product = await Product.findOne({sku: req.body.sku});
        if(product) {
            res.status(409).json({
                success: false,
                "error": {"message": 'Product already exists'}
            });
        } else {
            const newProduct = new Product({
                title: req.body.title,
                sku: req.body.sku,
                price: req.body.price,
                categoryId: req.body.categoryId,
                userId: req.user.id
            });
            await newProduct.save();
            res.status(201).json({
                success: true,
                data: newProduct
            });
        }
    } catch(e) {
        res.status(500).json({ 
            success: false, 
            "error": {"message": e.message} 
        });
    }
}
module.exports.update = async (req, res) => {
    try{
        const product = await Product.findOne({ sku: req.params.id });
        if(product) {
            product.title = req.body.title || product.title;
            product.sku = req.body.sku || product.sku;
            product.price = req.body.price || product.price;
            product.categoryId = req.body.categoryId || product.categoryId;
            if (req.user && req.user.id) {
                product.userId = req.user.id;
            }
            await product.save();
            res.status(201).json({
                success: true,
                data: product
            })
        }
        else {
            res.status(404).json({
                success: false,
                "error": {"message": 'Product'}
            })
        }
    } catch(e) {
        res.status(500).json({ 
            success: false, 
            "error": {"message": e.message} 
        });
    }
}