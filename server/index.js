const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/user");
const { auth } = require("./middleware/auth");


const config = require("./config/key")

const app = express();

mongoose.connect(config.mongoURI,
    { useNewUrlParser: true }).then(() => console.log("connected to DB"))
    .catch(err => console.error(err));



app.get("/", (req, res) => {
    res.json({ "hello": "Auth. API" })
})

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());


/*app.get("/", (req, res) => {
    res.send("hello world")
});
*/

app.get("/api/user/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    })
})

app.post("/api/users/register", (req, res) => {
    const user = new User(req.body)

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true,
            userData: doc
        })
    })

})

app.post("/api/user/login", (req, res) => {
    //find the email
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });
        //comparePassword
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({ loginSuccess: false, message: "wrong password" })
            }
        })
        //generateToken
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err)
            res.cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess: true
                })

        })
    })
})

app.get("/api/user/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
        if (err) return res.json({ successs: false, err })
        return res.status(200).send({
            success: true
        })
    })
})


const port = process.env.PORT || 5001

app.listen(port, () => {
    console.log(`Server running at ${port}.`);
});
