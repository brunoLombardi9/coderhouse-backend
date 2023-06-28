import { Router } from "express";

const logoutRouter = Router();

logoutRouter.get("/", async (req, res) => {
    req.session.destroy()
    res.status(200).json({message: "ok"})
})

export default logoutRouter;