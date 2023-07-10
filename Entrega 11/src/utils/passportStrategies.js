import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import { usersModel } from "../DAO/mongoDB/models/User.js";
import cartModel from "../DAO/mongoDB/models/Cart.js";

passport.use(
  "githubSignup",
  new GithubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      passReqToCallback: true,
    },

    async (req, accessToken, refreshToken, profile, done) => {
      const { name, email } = profile._json;
      try {
        const dbUser = await usersModel.findOne({ email });

        if (dbUser) {
          done(null, dbUser);
          return;
        }

        const newCart = await cartModel.create({ products: [] });

        const newUser = {
          name: name.split(" ")[0],
          lastName: name.split(" ")[1] || "",
          email,
          password: " ",
          cartId: newCart._id,
        };

        const newDbUser = await usersModel.create(newUser);

        done(null, newDbUser);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  const serializeUser = {
    _id: user._id,
    name: user.name,
    cartId: user.cartId,
  };
  done(null, serializeUser);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
