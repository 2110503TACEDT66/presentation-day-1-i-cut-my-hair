const User = require('../models/User');

exports.register = async (req, res, next) => {
    try {
        const { name, tel, email, password, role } = req.body;

        const user = await User.create({
            name,
            tel,
            email,
            password,
            role
        });
        //const token= user.getSignedJwtToken();
        //res.status(200).json({success:true, token});
        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({
            success: false
        });
        console.log(err.stack);
    }
};

exports.login = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                msg: 'please provide email and password'
            });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid credentials'
            });
        }
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid credentials'
            });
        }

        //const token = user.getSignedJwtToken();

        /*res.status(200).json({
            success: true,
            token
        });*/
        sendTokenResponse(user, 200, res);
    } catch (err) {
        return res.status(401).json({
            success: false,
            msg: 'Cannot convert email or password to string'
        });
    }
};