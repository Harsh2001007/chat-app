import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSideBar = async (req, resp) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    resp.status(200).json(filteredUser);
  } catch (error) {
    console.log("Error is getUsersForSideBar", error);
    resp.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getMessages = async (req, resp) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderID: myId, receiverId: userToChatId },
        { senderID: userToChatId, receiverId: myId },
      ],
    });

    resp.status(200).json(messages);
  } catch (error) {
    console.log("error occured in message controller", error);
    resp.status(500).json({
      message: "Internal server Error",
    });
  }
};

export const sendMessage = async (req, resp) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderID = req.user._id;

    let imgaeUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imgaeUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderID,
      receiverId,
      text,
      image: imgaeUrl,
    });

    await newMessage.save();

    // Real Time functionality goes here => socket.io

    resp.status(200).json(newMessage);
  } catch (error) {
    console.log("error in sending message", error);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};
