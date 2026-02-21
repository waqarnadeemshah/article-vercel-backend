import express from "express";
import { login, logout, signup } from "../controller/auth.controller.js";
const authroute=express.Router();
authroute.post('/signup',signup);
authroute.post('/login',login);
authroute.post('/logout',logout)
export {authroute}