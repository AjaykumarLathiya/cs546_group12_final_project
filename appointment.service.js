const { ObjectId } = require('mongodb');
const { appointments } = require('../config/mongoCollections')

class AppointmentService {

    static async getAppointmentList() {
        const lst = await (await appointments()).aggregate([
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

    static async addAppointment(obj) {
        return await (await appointments()).insertOne(obj)
    }

    static async getAppointmentListForCustomer(customerId) {
        const lst = await (await appointments()).aggregate([
            { "$match": { customerId: ObjectId(customerId) } },
            {
                "$lookup": {
                    "from": "users",
                    "localField": 'barberId',
                    "foreignField": '_id',
                    "as": "objBarber"
                }
            },
            { "$unwind": "$objBarber" },
        ]).sort({ _id: -1 }).toArray()
        return lst;
    }

    static async getAppointmentListForBarber(barberId) {
        const lst = await (await appointments()).aggregate([
            { "$match": { barberId: ObjectId(barberId) } },
            {
                "$lookup": {
                    "from": "users",
                    "localField": 'customerId',
                    "foreignField": '_id',
                    "as": "objCustomer"
                }
            },
            { "$unwind": "$objCustomer" },
        ]).sort({ _id: -1 }).toArray()
        return lst;
    }

    static async editAppointment(_id, obj) {
        return await (await appointments()).updateOne({ _id: ObjectId(_id) }, { $set: obj })
    }
}
module.exports = AppointmentService;