import jwt from "jsonwebtoken";
export const verifyuser = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
    if (!token) {
      return res.status(404).json({ success: false, msg: "token not found" });
    }
    const decode = jwt.verify(token, process.env.ACCESSTOKEN);
    req.user = decode;
    console.log("DECODED TOKEN:", req.user);
    next();
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
export const verifyadmin = async (req, res,next) => {
  try {
    const header = req.headers["authorization"];
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
    if (!token) {
      return res.status(404).json({ success: false, msg: "token not found" });
    }
    const decode = jwt.verify(token, process.env.ACCESSTOKEN);
    if (decode.role !== "admin") {
      return res
        .status(403)
        .json({ sucess: false, msg: "Access denied. Admins only!" });
    }
    req.user = decode;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
