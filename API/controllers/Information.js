import { Information } from "../models/Information.js";
import { Comment } from "../models/Comment.js";
import { Account } from "../models/Account.js"

export const getInfo = async (req, res) => {
  try {
    const info = await Information.findOne({
      username: req.query.username,
    }).populate("user", '-password');
    const comment = await Comment.find({ id_info: req.query.username })
    let tong = 0
    let dem = 0
    let trungbinh = 0
    comment.forEach(element => {
      if (element.evaluate) {
        tong = tong + element.evaluate
        dem = dem + 1
      }
    })
    if (tong === 0) {
      trungbinh = 0
    } else {
      trungbinh = tong / dem
    }
    res.json({
      status: "success",
      account: info,
      total_comment: comment.length,
      evalute: Math.floor(trungbinh),
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
export const updateInfo = async (req, res) => {
  try {
    const updateInfo = {
      avatar: req.body.avatar,
      full_name: req.body.full_name
    };
    const updateAcc = {
      email: req.body.email,
    }
    const filter = { username: req.body.user };
    let update = await Information.find(filter)
    if (update.length > 0) {
      const search = Information.find(filter)
      if (search.lenght > 0) {
        return res.json({ success: false, mgs: 'Tên đăng nhập đã tồn tại' })
      }
      else {
        Information.findOneAndUpdate(filter, updateInfo, { new: true })
          .then(data => {
            try {
              Account.findOneAndUpdate(filter, updateAcc, { new: true })
                .then(data => {
                  return res.json({ success: true, mgs: 'Cập nhật thông tin thành công' })
                })
            }
            catch {
              return res.json({ success: true, mgs: 'Cập nhật thông tin thất bại' })
            }
          })
      }
    }
    else return res.json({ success: false, mgs: 'Tài khoản không tồn tại' })
  }
  catch {

  }
}