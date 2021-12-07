const { ObjectId } = require('mongodb');
const { reviews } = require('../config/mongoCollections')

class ReviewService {

    static async addReview(obj) {
        return await (await reviews()).insertOne(obj)
    }

    static async getReviewList() {
        const lst = await (await reviews()).aggregate([
            {
                "$lookup": {
                    "from": "users",
                    "localField": 'barberId',
                    "foreignField": '_id',
                    "as": "objBarber"
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": 'customerId',
                    "foreignField": '_id',
                    "as": "objCustomer"
                }
            },
            { "$unwind": "$objBarber" },
            { "$unwind": "$objCustomer" },
        ]).sort({ _id: -1 }).toArray()
        return lst;
    }

    static async getReviewListById(barberId) {
        const lst = await (await reviews()).aggregate([
            { "$match": { barberId: ObjectId(barberId) } },
            {
                "$lookup": {
                    "from": "users",
                    "localField": 'barberId',
                    "foreignField": '_id',
                    "as": "objBarber"
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": 'customerId',
                    "foreignField": '_id',
                    "as": "objCustomer"
                }
            },
            { "$unwind": "$objBarber" },
            { "$unwind": "$objCustomer" },
        ]).sort({ _id: -1 }).toArray()
        return lst;
    }

    static async getAverageReviewById(barberId) {
        const objReview = await (await reviews()).aggregate([
            { "$match": { barberId: ObjectId(barberId) } },
            { "$group": { _id: "$barberId", "noOfReview": { "$sum": 1 }, "TotalReview": { "$sum": "$rating" } } }
        ]).sort({ _id: -1 }).toArray()
        return objReview[0]
    }
}
module.exports = ReviewService;