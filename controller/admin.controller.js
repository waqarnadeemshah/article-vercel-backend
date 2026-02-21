import articles from "../model/article.js";
import { v2 as cloudinary } from "cloudinary";

export const addarticle = async (req, res) => {
  try {
    const { title, content, category, status } = req.body;
    const images = req.files?.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));
    const articledata = new articles({
      title,
      content,
      images,
      category,
      status,
    });
    await articledata.save();
    res.status(201).json({ success: true, msg: "article has been added" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
export const deletearticle = async (req, res) => {
  try {
    const paramsid = req.params.id;

    const articledata = await articles.findById({ _id: paramsid });
    if (!articledata) {
      return res
        .status(404)
        .json({ success: false, msg: "not find a article" });
    }
    if (articledata.images && articledata.images.length > 0) {
      for (let img of articledata.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }
    await articles.findByIdAndDelete({ _id: paramsid });
    res
      .status(200)
      .json({ success: true, msg: "article has been deleted sucessfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updatearticle = async (req, res) => {
  try {
    const paramsid = req.params.id;
    const { title, content, category, status } = req.body;

    const articledata = await articles.findById(paramsid);
    if (!articledata) {
      return res.status(404).json({ success: false, msg: "Article not found" });
    }

    let existingimg = articledata.images;

   
    if (req.files && req.files.length > 0) {

      // delete old images
      for (let img of articledata.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

    
      let imageupate = req.files.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }));
      existingimg=imageupate
    }

    await articles.findByIdAndUpdate(
      paramsid,
      {
        title,
        content,
        images: existingimg,
        category,
        status,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      msg: "Article updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const viewarticle = async (req, res) => {
  try {
    const articledata = await articles.find();
    if (!articledata) {
      return res
        .status(404)
        .json({ success: false, msg: "not found a article" });
    }
    res.status(200).json({ success: true, articledata });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
