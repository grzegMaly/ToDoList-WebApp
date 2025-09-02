const ListModel = require('../models/listModel');
const {mongo: {ObjectId}} = require('mongoose');

class ListController {
    getUserListDocs = async (req, res, next) => {

        const {user} = req;
        try {
            const listDocs = await ListModel.find({
                ownerId: user._id
            });
            return res.status(200)
                .json({
                    data: listDocs,
                })
        } catch (error) {
            return res.status(500)
                .json({
                    message: "Something went wrong"
                });
        }
    }

    createListDocument = async (req, res) => {

        const {user} = req;
        const {content, done} = req.body;
        try {
            const listDoc = await ListModel.create({
                ownerId: user._id,
                content,
                done
            });
            return res.status(201)
                .json({
                    data: listDoc
                });
        } catch (error) {
            return res.status(500)
                .json({
                    message: "Something went wrong"
                });
        }
    }

    updateListDoc = async (req, res, next) => {

        const {listId} = req.params;
        const {done} = req.body;
        console.log(listId, done)
        try {
            const listDoc = await ListModel.findByIdAndUpdate(listId, {
                done
            }, {new: true});
            return res.status(200)
                .json({
                    data: listDoc
                });
        } catch (error) {
            return res.status(500)
                .json({
                    message: "Something went wrong"
                });
        }
    }

    deleteListDoc = async (req, res, next) => {

        console.log("DUUUUUUPPAAAA")
        const {listId} = req.params;
        const {user} = req;
        console.log(listId, "DELETE")

        try {
            const result = await ListModel.deleteOne({_id: new ObjectId(listId), ownerId: user._id});
            if (result.deletedCount !== 1) {
                return res.status(400)
                    .json({
                        message: "Bad list id or unauthorized"
                    });
            }
            return res.status(204)
                .end();
        } catch (error) {
            return res.status(500)
                .json({
                    message: "Something went wrong"
                });
        }
    }
}

module.exports = new ListController();