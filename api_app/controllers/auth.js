const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys')

module.exports.login = async (req, res) => {
    try{
        const userdb = await User.findOne({email: req.body.email});
        if(userdb) {
            const isRulePassword = await bcrypt.compare(req.body.password, userdb.password);
            if(isRulePassword) {
                const token = jwt.sign({
                    email: userdb.email,
                    userId: userdb._id
                }, keys.jwt, {expiresIn: 60*60*60});
                res.status(200).json({
                    success: true,
                    data: `Bearer ${token}`
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    "error": {"message": 'Authorization error'}
                });
            }
        }
        else {
            res.status(400).json({
                success: false,
                "error": {"message": 'Authorization error'}
            });
        }
    } catch(e) {
        res.status(500).json({
            success: false,
            "error": {"message": e.message}
        })
    }
}

module.exports.register = async (req, res) => {
    const userdb = await User.findOne({email: req.body.email});
    if(userdb) {
        res.status(409).json({
            success: false,
            "error": {"message": 'This email already exists'}
        });
    } else{
        const salt = bcrypt.genSaltSync(10);
        const password_h = await bcrypt.hashSync(req.body.password, salt);
        const createdAt = new Date();
        const user = new User({
            email: req.body.email,
            password: password_h,
            createdAt: createdAt.toLocaleString(),
            updatedAt: 0
        });
        try{
            await user.save();
            res.status(201).json({
                success: true,
                data: user
            })
        } catch(e) {
            res.status(500).json({
                success: false,
                "error": {"message": e.message}
            })
        }
    }
}

module.exports.updateUser = async (req, res) => {
    const userdb = await User.findOne({email: req.body.email});
    if(userdb) {
        const isRulePassword = await bcrypt.compare(req.body.password, userdb.password);
        if(isRulePassword) {
            try{
                let updatedAt = new Date();
                userdb.email = req.body.newEmail || userdb.email,
                userdb.password = req.body.newPassword || userdb.password;
                userdb.updatedAt = updatedAt.toLocaleString();
                await userdb.save();
                res.status(200).json({
                    success: true,
                    data: userdb
                });
            } catch(e) {
                res.status(500).json({
                    success: false,
                    "error": {"message": e.message}
                })
            }
        } else {
            res.status(400).json({
                success: false,
                "error": {"message": 'Authorization error'}
            });
        }
    } else{
            res.status(400).json({
                success: false,
                "error": {"message": 'Authorization error'}
            });
    }
}