import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";

const authToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw HttpError(401, "Not authorized");
    }

    const [bearer, token] = authorizationHeader.split(" ", 2);

    if (bearer !== "Bearer" || !token) {
      throw HttpError(401, "Not authorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    if (user.token !== token) {
      throw HttpError(401, "Not authorized");
    }

    req.user = {
      _id: user._id,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default authToken;