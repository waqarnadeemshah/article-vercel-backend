import articles from "../model/article.js";
import Comment from "../model/comment.js";
import Like from "../model/like.js";

export const getarticle = async (req, res) => {
  try {
    const status = "published";
    const articledata = await articles.find({ status: status });
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
export const getonearticle = async (req, res) => {
  try {
    const paramsid = req.params.id;
    const status = "published";
    const articledata = await articles.findOne({
      status: status,
      _id: paramsid,
    });
    if (!articledata) {
      return res
        .status(404)
        .json({ success: false, msg: "not found a article" });
    }
    articledata.views += 1;
    await articledata.save();

    res.status(200).json({ success: true, articledata });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
export const like = async (req, res) => {
  try {
    const userid = req.user.id;
    const paramsid = req.params.id;
    const likeexist = await Like.findOne({ user: userid, article: paramsid });
    if (likeexist) {
      await Like.deleteOne({ _id: likeexist._id });
      await articles.findOneAndUpdate(
        { _id: paramsid },
        { $inc: { likesCount: -1 } },
      );
      return res.json({ success: true, liked: false, msg: "Unliked article" });
    }
    const liked = new Like({
      user: userid,
      article: paramsid,
    });
    await liked.save();
    await articles.findOneAndUpdate(
      { _id: paramsid },
      { $inc: { likesCount: 1 } },
    );
    return res.json({ success: true, liked: true, msg: "like article" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
export const comment = async (req, res) => {
  try {
    const userid = req.user.id;
    const paramsid = req.params.id;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res
        .status(400)
        .json({ success: false, msg: "Comment is required" });
    }
    const commentdata = new Comment({
      user: userid,
      article: paramsid,
      text,
    });
    await commentdata.save();
    await articles.findOneAndUpdate(
      { _id: paramsid },
      { $inc: { commentsCount: 1 } },
    );
    res.json({ success: true, msg: "Comment added", commentdata });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
export const getarticlecomment = async (req, res) => {
  try {
    const paramsid = req.params.id;
    const commentdata = await Comment.find({ article: paramsid })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    if (!commentdata) {
      return res
        .status(404)
        .json({ success: false, msg: "no comment in this article" });
    }
    res.status(200).json({ success: true, commentdata });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


export const sorting = async (req, res) => {
  try {
    const { sort, search } = req.query;

    //  SEARCH 
    let searchQuery = {};

    if (search) {
      searchQuery = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      };
    }

    //  SORT LOGIC
    let sortOption = { createdAt: -1 }; // default

    if (sort === "mostliked") {
      sortOption = { likesCount: -1 };
    } else if (sort === "mostcomment") {
      sortOption = { commentsCount: -1 };
    } else if (sort === "mostview") {
      sortOption = { viewsCount: -1 };
    } else if (sort === "mostrecent") {
      sortOption = { createdAt: -1 };
    }

    const article = await articles
      .find(searchQuery)
      .sort(sortOption);

    res.status(200).json({
      success: true,
      articlesort: article,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
