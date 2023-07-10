import { usersModel } from "../DAO/mongoDB/models/User.js";
import cartModel from "../DAO/mongoDB/models/Cart.js";
import { compareData, hashData } from "../utils/hash.js";

class UserManager {
  async createUser(req, res) {
    const { email, password } = req.body;
    const user = await usersModel.findOne({ email });

    if (user) {
      const userExist = true;
      res.render("signup", { userExist });
    } else {
      const newCart = await cartModel.create({ products: [] });
      const hashPassword = await hashData(password);
      const newUser = {
        ...req.body,
        password: hashPassword,
        cartId: newCart._id,
      };
      await usersModel.create(newUser);
      req.session.user = newUser;
      res.redirect("/products");
    }
  }

  async loginUser(req, res) {
    const { email, password } = req.body;
    const user = await usersModel.findOne({ email });

    if (user) {
      const isPasswordValid = await compareData(password, user.password);

      if (!isPasswordValid) {
        const badData = true;
        return res.render("login", { badData });
      }

      req.session.user = user;
      res.redirect("/products");
    } else {
      const noUser = true;
      res.render("login", { noUser });
    }
  }

  async logoutUser(req, res) {
    req.session.destroy();
    res.status(200).json({ message: "ok" });
  }
}

export default UserManager;
