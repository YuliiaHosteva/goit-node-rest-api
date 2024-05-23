import fs from "node:fs/promises";
import User from "../model/userModel.js";
import path from "node:path";
import Jimp from "jimp";

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "File not provided" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).send({ message: "Not authorized" });
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
      return res.status(404).send({ message: "User not found" });
    }

    res.send({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

export { uploadAvatar };
