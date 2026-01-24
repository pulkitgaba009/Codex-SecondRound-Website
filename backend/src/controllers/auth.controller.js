import dotenv from "dotenv";

dotenv.config();

const authentication = (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ success: true });
  }

  res.status(401).json({ success: false });
}

export default authentication;