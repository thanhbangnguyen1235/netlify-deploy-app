import { Film } from "../models/Film.js";
import escapeStringRegexp from "escape-string-regexp";

export const searchFilms = async (req, res, next) => {
  try {
    const ListFilms = await Film.find({}, {
      title: 1,
      poster_path: 1,
    });
    res.status(200).json({
      page: 1,
      results: ListFilms,
      total: ListFilms.length,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};
