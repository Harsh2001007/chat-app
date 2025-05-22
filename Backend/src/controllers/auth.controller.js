import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, resp) => {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      return resp.status(400).json({
        message: "All fields are mandatory",
      });
    }

    if (password.lenght < 6) {
      return resp
        .status(400)
        .json({ message: "password must be more than 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return resp.status(400).json({ message: "user already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate JWT token here
      generateToken(newUser._id, resp);
      await newUser.save();

      resp.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilePic: newUser.profilepic,
      });
    } else {
      resp.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("error in signup controller", error.message);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = (req, resp) => {
  resp.send("login routes");
};

export const logout = (req, resp) => {
  resp.send("logout routes");
};
