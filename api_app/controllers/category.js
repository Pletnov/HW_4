/*
getAll
getById
remove
create
update
*/
const Category = require('../models/Category');
const Product = require('../models/Product');

module.exports.getAll = async (req, res) => {
    try {
        const categories = await Category.find(); 
        res.status(200).json({
            success: true,
            data: categories
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
        const category = await Category.findOne({slug: req.params.id});
        if (!category) {
            return res.status(404).json({
                success: false,
                "error": {"message": 'Category with this slug not found'} 
            });
        }
        else {
            res.status(200).json({
                success: true,
                data: category
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            "error": {"message": error.message} 
        });
    }
}
module.exports.remove = async (req, res) => {
    try{
        const category = await Category.findOne({ slug: req.params.id });
        if(category) {
            await Product.deleteMany({ categoryId: category._id });
            await category.deleteOne();
            res.status(200).json({
                success: true,
                data: "Category was deleted"
            });
        }
        else{
            res.status(404).json({
                "success": false,
                "error" : {message: "Category not found"}
            });
        }
    } catch(e) {
        res.status(500).json({ 
            success: false, 
            "error": {"message": e.message} 
        });
    }
}
module.exports.create = async (req, res) => {
    try{
        const category = await Category.findOne({name: req.body.name, slug: req.body.slug});
        if(!category) {
            const new_category = new Category({
                name: req.body.name,
                slug: req.body.slug,
                user: req.user.id
            });
            await new_category.save();
            res.status(201).json({
                success: true,
                data: new_category
            })
        }
        else {
            res.status(409).json({
                success: false,
                "error": {"message": 'This category alredy exists'}
            })
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
        const category = await Category.findOne({ slug: req.params.id });
        if(category) {
            category.name = req.body.name || category.name;
            category.slug = req.body.slug || category.slug;
            if (req.user && req.user.id) {
                category.user = req.user.id;
            }
            await category.save();
            res.status(201).json({
                success: true,
                data: category
            })
        }
        else {
            res.status(404).json({
                succes: false,
                "error": {"message": 'Category not found'}
            })
        }
    } catch(e) {
        res.status(500).json({ 
            success: false, 
            "error": {"message": e.message} 
        });
    }
}