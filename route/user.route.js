import express from "express";
import {
  comment,
  getarticle,
  getarticlecomment,
  getonearticle,
  like,
  sorting,
} from "../controller/user.controller.js";
import { verifyuser } from "../middleware/authentication.middleware.js";
const userroute = express.Router();
userroute.get("/getarticle", getarticle);
userroute.get("/getonearticle/:id", getonearticle);
userroute.post("/likeUnlikepost/:id", verifyuser, like);
userroute.post("/postcomment/:id", verifyuser, comment);
userroute.get("/getcomments/:id", getarticlecomment);
userroute.get('/sortingarticle',sorting);

export { userroute };
