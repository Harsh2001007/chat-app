import cloudinary from "../lib/cloudinary.js";
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

export const login = async (req, resp) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return resp.status(400).json({ message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return resp.status(401).json({ message: "Invalid Credentials" });
    }

    generateToken(user._id, resp);

    resp.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilepic,
    });
  } catch (error) {
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, resp) => {
  try {
    resp.cookie("jwt", "", { maxAge: 0 });
    return resp.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    resp.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateProfile = async (req, resp) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return resp.status(404).json({ message: "profile pic not found" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilepic: uploadResponse.secure_url },
      { new: true }
    );

    resp.status(200).json(updatedUser);
  } catch (error) {
    return resp.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const checkAuth = async (req, resp) => {
  try {
    resp.status(200).json(req.user);
  } catch (error) {
    console.log("Error in check auth controller", error);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};
