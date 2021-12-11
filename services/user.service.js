const { ObjectId } = require('mongodb');
const { users } = require('../config/mongoCollections');
class UserService {
    static async getColl() {
        const res = await users()
        return res;
    }

    static async getUsers() {
        const lst = await (await users()).find({}).toArray()
        return lst;
    }

    static async getUserByEmail(userEmail) {
        const lst = await (await users()).findOne({ userEmail: userEmail })
        return lst;
    }

    static async getCustomers() {
        const lst = await (await users()).find({ type: "CUSTOMER" }).sort({ _id: -1 }).toArray()
        return lst;
    }

    static async getBarbers() {
        const lst = await (await users()).find({ type: "BARBER" }).sort({ _id: -1 }).toArray()
        return lst;
    }

    static async getApprovedBarbers() {
        const lst = await (await users()).find({ type: "BARBER", status: "APPROVED" }).sort({ _id: -1 }).toArray()
        return lst;
    }

    static async getUser(_id) {
        const lst = await (await users()).findOne({ _id: ObjectId(_id) })
        return lst;
    }

    static async getUserbyUsername(userName) {
        const lst = await (await users()).findOne({ userName })
        return lst;
    }

    static async addUser(obj) {
        return await (await users()).insertOne(obj)
    }

    static async editUser(_id, obj) {
        return await (await users()).updateOne({ _id: ObjectId(_id) }, { $set: obj })
    }

    static async deleteUser(_id) {
        return await (await users()).deleteOne({ _id: ObjectId(_id) })
    }
}

module.exports = UserService;