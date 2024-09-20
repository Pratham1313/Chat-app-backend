import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userID, res) => {
  try {
    const token = jwt.sign(
      { userID },
      "EgFE4Xu3j-mVhW3RrWYe0DWNlgPcrhP9idy4s3W7Y5w",
      {
        expiresIn: "15d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      httpOnly: true,
      sameSite: "strict",
      secure: "production" === "production", // Set secure flag in production
    });

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default generateTokenAndSetCookie;
