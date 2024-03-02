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