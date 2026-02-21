import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import user from "../model/user.js";
import jwt from "jsonwebtoken";
export const signup = [
  check("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("first name should be 2 lenght longer")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("name contains alphabets only !!!"),

  check("email")
    .isEmail()
    .withMessage("Please enter the email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password length should be atleast 6 longer")
    .matches(/^[A-Za-z0-9\s]+$/),

  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ success: false, error: error.array() });
      }
      const existemail = await user.findOne({ email });
      if (existemail) {
        return res.status(400).json({
          success: false,
          msg: "already register this email try another email",
        });
      }
      const hashdedpassword = await bcrypt.hash(password, 10);
      const userdata = new user({
        name,
        email,
        password: hashdedpassword,
        role,
      });
      await userdata.save();
      res.status(201).json({ success: true, msg: "user has been register" });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
];
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.name,
    },
    process.env.ACCESSTOKEN,
    { expiresIn: "1h" }
  );
};
const generaterefreshtoken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.refreshtoken,
    { expiresIn: "7h" }
  );
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userdata = await user.findOne({ email });
    if (!userdata) {
      return res.status(404).json({ success: false, msg: "user not found" });
    }
    const passwordcheck = await bcrypt.compare(password, userdata.password);
    if (!passwordcheck) {
      return res
        .status(404)
        .json({ success: false, msg: "passowrd is incorrect" });
    }
    const Accesstoken = generateAccessToken(userdata);
    const refreshtoken = generaterefreshtoken(userdata);
    userdata.refreshtoken = refreshtoken;
    await userdata.save();
    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res
      .status(200)
      .json({
        success: true,
        userid: userdata._id,
        name: userdata.name,
        role: userdata.role,
        token: Accesstoken
      });

  } catch (error) {
     return res.status(500).json({ success: false, error: error.message });
  }
};
export const logout=async(req,res)=>{
    try {
            const refreshtoken=req.cookies.refreshtoken;
    if(!refreshtoken){
        return res.status(404).json({success:false,msg:"token is missing"})
    }
    const userdata=await user.findOne({refreshtoken});
    userdata.refreshtoken=null
    await userdata.save();
     res.clearCookie("refreshtoken");
    res.status(200).json({ sucess: true, msg: "loggout sucessfully" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
        
    }

}
