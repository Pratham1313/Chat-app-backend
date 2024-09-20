import jwt from "jsonwebtoken";
import User from "../model/usermodel.js";

export default async function protectedRoute(req, res, next) {
  try {
    const token = req.body?.token || req.query?.token;
    console.log("123");
    if (!token) {
      return res.status(401).json({ error: "no token provided (JWT)" });
    }

    const decoded = jwt.verify(
      token,
      "EgFE4Xu3j-mVhW3RrWYe0DWNlgPcrhP9idy4s3W7Y5w"
    );
    if (!decoded) {
      return res.status(402).json({ error: "invalid token (JWT)" });
    }

    const user = await User.findById(decoded.userID).select("-password");
    if (!user) {
      return res.status(403).json({ error: "invalid user (JWT)" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("protected route - error - >", error.message);
    res.status(500).json({ error: "internal server error" });
  }
}
