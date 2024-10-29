import Order from "../models/order.model.js";
import User from "../models/user.model.js";

export const OnlyMineData = async (req, res, next) => {
  try {
    const { username } = req.params;

    const selectedUser = await User.findOne({ username }).select("-password");
    const loggedUsername = req.user.username;
    console.log(selectedUser, loggedUsername);

    if (selectedUser?.username !== loggedUsername)
      return res.status(404).json({ error: "You can't view others data" });

    const UserOrders = await Order.find({
      customerUsername: username,
    }).select(["-_id", "-customerName", "-customerPhoneNo", "-ipLocation"]);

    req.orders = UserOrders;
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in OnlyMineData middleware", error.message);
  }
};
