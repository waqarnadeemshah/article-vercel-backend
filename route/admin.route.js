import express from "express";
import { addarticle, deletearticle, updatearticle, viewarticle } from "../controller/admin.controller.js";
import upload from "../middleware/multer.middleware.js";
import { verifyadmin } from "../middleware/authentication.middleware.js";
const adminroute=express.Router();
adminroute.use(verifyadmin)
adminroute.post('/addarticle',upload.array('images',5),addarticle);
adminroute.delete('/deletearticle/:id',deletearticle);
adminroute.put('/updatearticle/:id',upload.array('images',5),updatearticle);
adminroute.get('/viewarticle',viewarticle)
export {adminroute}