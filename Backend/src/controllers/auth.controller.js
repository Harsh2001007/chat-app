import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, resp) => {
  const { fullname, email, password } = req.body;

  try {
    if (password.lenght < 6) {
      return resp
        .status(400)
        .json({ message: "password must be more than 6 characters" });
    }

    const user = User.findOne({ email });

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
      //
    } else {
      resp.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {}
};

export const login = (req, resp) => {
  resp.send("login routes");
};

export const logout = (req, resp) => {
  resp.send("logout routes");
};
