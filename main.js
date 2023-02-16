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
const nodemailer_1 = __importDefault(require("nodemailer"));
const fetchUsers = (params) => __awaiter(void 0, void 0, void 0, function* () {
    // Connect to the database
    const connection = yield promise_1.default.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'suco'
    });
    // Build the query
    let query = 'SELECT * FROM users a join profile b on a.idUser=b.idUser WHERE a.email = ?';
    const paramsQuery = [params.email];
    if (params.verifiedStatus !== undefined) {
        query += ' AND a.status = ?';
        paramsQuery.push(params.verifiedStatus);
    }
    if (params.isBirthday) {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        query += ` AND MONTH(b.tanggalLahir) = ${month} AND DAY(b.tanggalLahir) = ${day}`;
    }
    // Execute the query and return the results
    const [rows] = yield connection.execute(query, paramsQuery);
    return rows;
});
const sendNotification = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: "nurramdandoni@gmail.com",
            pass: "bzjbpzstogabfjfp",
        },
    });
    const mailOptions = {
        from: "nurramdandoni@gmail.com",
        to: params.to,
        subject: params.subject,
        text: params.text,
    };
    try {
        const info = yield transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    }
    catch (err) {
        console.error("Failed to send email: ", err);
    }
});
fetchUsers({ email: "nurramdandoni@gmail.com", verifiedStatus: "Active", isBirthday: true })
    .then((users) => {
    console.log(users);
    const params = {
        to: "nurramdandoni@gmail.com",
        subject: "Test Email Suco",
        text: "This is a test email Suco",
    };
    sendNotification(params);
}).catch((err) => {
    console.log(err);
});
