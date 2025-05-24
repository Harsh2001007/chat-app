import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, resp, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return resp
        .status(401)
        .json({ message: "unauthorized, no token proviced" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return resp.status(401).json({
        message: "Invalid Token",
      });
    }
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return resp.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return resp.status(401).json({
      message: "Internal Server Error",
    });
  }
};
