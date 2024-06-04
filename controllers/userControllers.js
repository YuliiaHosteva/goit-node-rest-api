import fs from "node:fs/promises";
import User from "../model/userModel.js";
import path from "node:path";
import Jimp from "jimp";
import HttpError from "../helpers/HttpError.js";
import { sendVerificationMail } from "../mail.js";

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "File not provided");
    }

    if (!req.user || !req.user._id) {
      throw HttpError(401, "Not authorized");
    }

    const tempPath = req.file.path;
    const newPath = path.resolve("public/avatars", req.file.filename);

    const image = await Jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(tempPath);

    await fs.rename(tempPath, newPath);

    const avatarURL = `/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
        req.user._id,
         { avatarURL },
         { new: true }
    );

    if (!user) {
      throw HttpError(404, "User not found");    }

    res.send({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });

    res.send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

const requestVerificationToken = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    if (user.verificationToken = null) 
      throw HttpError(401, "User already verificated"
    )

    sendVerificationMail({
      to: email,
      verificationToken: user.verificationToken,
    });

    res.send({
      message: "Verification email sent",
    });

  } catch (error) {
    next(error);
  }
};

export { uploadAvatar, verifyUser, requestVerificationToken };
