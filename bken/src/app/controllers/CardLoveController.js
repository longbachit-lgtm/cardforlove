const CardLove = require("../models/CardLove");
const { mongooseToObject } = require("../../util/mongoose");

class CardLoveController {
    // [GET] /cards
    // ?page=1&limit=20&q=keyword
    async index(req, res, next) {
        try {
            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
            const skip = (page - 1) * limit;

            const q = (req.query.q || "").trim();
            // cập nhật lại filter nếu có thay đổi field model
            const filter = q
                ? {
                    $or: [
                        { person_one: new RegExp(q, "i") },
                        { person_two: new RegExp(q, "i") },
                    ],
                }
                : {};

            const [items, total] = await Promise.all([
                CardLove.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
                CardLove.countDocuments(filter),
            ]);

            res.json({
                data: items,
                meta: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit) || 1,
                },
            });
        } catch (err) {
            next(err);
        }
    }

    // [GET] /cards/:id
    async show(req, res, next) {
        try {
            const item = await CardLove.findById(req.params.id).lean();
            if (!item) return res.status(404).json({ message: "CardLove not found" });
            res.json({ data: item });
        } catch (err) {
            next(err);
        }
    }

    // [POST] /cards
    async store(req, res, next) {
        try {
            // cập nhật lại theo schema mới nếu model thay đổi field
            const payload = {
                person_one: req.body.person_one,
                img_person_one: req.body.img_person_one ?? null,
                person_two: req.body.person_two,
                img_person_two: req.body.img_person_two ?? null,
                start_date: req.body.start_date ?? null,
                url_youtube: req.body.url_youtube ?? null,
                message: req.body.message ?? null,
                message_color: req.body.message_color ?? "gradient-romantic",
                // Nếu có các field mới, bổ sung tại đây
            };

            const created = await CardLove.create(payload);
            res.status(201).json({ data: created });
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /cards/:id  (cập nhật toàn bộ)
    // [PATCH] /cards/:id (cập nhật một phần) — bạn có thể reuse method này cho cả PATCH
    async update(req, res, next) {
        try {
            // cập nhật lại các field cần update theo model mới
            const update = {
                ...(req.body.person_one !== undefined && { person_one: req.body.person_one }),
                ...(req.body.img_person_one !== undefined && { img_person_one: req.body.img_person_one }),
                ...(req.body.person_two !== undefined && { person_two: req.body.person_two }),
                ...(req.body.img_person_two !== undefined && { img_person_two: req.body.img_person_two }),
                ...(req.body.start_date !== undefined && { start_date: req.body.start_date }),
                ...(req.body.url_youtube !== undefined && { url_youtube: req.body.url_youtube }),
                ...(req.body.message !== undefined && { message: req.body.message }),
                ...(req.body.message_color !== undefined && { message_color: req.body.message_color }),
                // Nếu model có field mới, update thêm ở đây
            };

            const item = await CardLove.findByIdAndUpdate(req.params.id, update, {
                new: true,
                runValidators: true,
            }).lean();

            if (!item) return res.status(404).json({ message: "CardLove not found" });
            res.json({ data: item });
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /cards/:id  (soft delete)
    async destroy(req, res, next) {
        try {
            const item = await CardLove.findById(req.params.id);
            if (!item) return res.status(404).json({ message: "CardLove not found" });

            await item.delete(); // soft delete (mongoose-delete)
            res.status(204).send(); // No Content
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] /cards/:id/restore  (khôi phục soft delete)
    async restore(req, res, next) {
        try {
            // cần dùng CardLove.restore({ _id }) do item đã bị xoá
            const result = await CardLove.restore({ _id: req.params.id });
            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "CardLove not found or not deleted" });
            }
            const item = await CardLove.findById(req.params.id).lean();
            res.json({ data: item, restored: true });
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /cards/:id/force  (xoá hẳn khỏi DB)
    async forceDestroy(req, res, next) {
        try {
            const deleted = await CardLove.deleteOne({ _id: req.params.id }, { paranoid: false });
            if (deleted.deletedCount === 0) {
                return res.status(404).json({ message: "CardLove not found" });
            }
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

    // [GET] /cards/deleted  (liệt kê bản ghi đã xoá mềm)
    async deleted(req, res, next) {
        try {
            const items = await CardLove.findDeleted().lean();
            res.json({ data: items });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CardLoveController();