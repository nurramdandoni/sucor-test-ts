"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const fetchUsers = ({ email, verifiedStatus, isBirthday }) => __awaiter(void 0, void 0, void 0, function* () {
    // Connect to the database
    const connection = yield promise_1.default.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'suco'
    });
    // Build the query
    let query = 'SELECT * FROM users a join profile b on a.idUser=b.idUser WHERE a.email = ?';
    const params = [email];
    if (verifiedStatus !== undefined) {
        query += ' AND a.status = ?';
        params.push(verifiedStatus);
    }
    if (isBirthday) {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        query += ` AND MONTH(b.tanggalLahir) = ${month} AND DAY(b.tanggalLahir) = ${day}`;
    }
    // Execute the query and return the results
    console.log("ini query", query);
    console.log("ini params", params);
    const [rows] = yield connection.execute(query, params);
    return rows;
});
fetchUsers({ email: "nurramdandoni@gmail.com", verifiedStatus: "Active", isBirthday: true })
    .then((users) => {
    console.log(users);
}).catch((err) => {
    console.log(err);
});
