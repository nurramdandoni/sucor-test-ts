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
const node_cron_1 = __importDefault(require("node-cron"));
const fetchUsers = (params) => __awaiter(void 0, void 0, void 0, function* () {
    // Connect to the database
    //   1a KOneksi database mysql
    const connection = yield promise_1.default.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'suco'
    });
    // Build the query
    //   1b get data user dengan parameter email, status user dan validasi tanggal lahir user
    let query = 'SELECT * FROM users a join profile b on a.idUser=b.idUser WHERE ';
    const paramsQuery = [];
    if (params.verifiedStatus !== undefined) {
        query += ' a.status = ?';
        paramsQuery.push(params.verifiedStatus);
    }
    if (params.isBirthday) {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        query += ` AND MONTH(b.tanggalLahir) = ${month} AND DAY(b.tanggalLahir) = ${day}`;
    }
    //   console.log(query)
    // Execute the query and return the results
    //   1c eksekusi query sebagai array 
    const [rows] = yield connection.execute(query, paramsQuery);
    return rows;
});
const sendNotification = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: "nurramdandoni@gmail.com",
            pass: "bzjbpzstogabfjfp", // ubah dengan sandi sementara anda
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
const generatePromoCode = ({ name, startDate, endDate, idNotifikasi }) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate unique code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    // Store the promo code data in database
    const connection = yield promise_1.default.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'suco'
    });
    const queryGetNotificationInfo = 'SELECT * FROM notifikasi WHERE idNotifikasi = ?';
    const paramsNotifInfo = [idNotifikasi];
    const getInfo = yield connection.execute(queryGetNotificationInfo, paramsNotifInfo);
    const info = getInfo[0][0];
    const query = 'INSERT INTO promo (kodePromo, namaPromo, tanggalMulai, tanggalAkhir,idNotifikasi) VALUES (?, ?, ?, ?, ?)';
    const params = [code, name, startDate, endDate, idNotifikasi];
    yield connection.execute(query, params);
    // Return the generated promo code data
    const promoCode = {
        code,
        name: info.namaNotifikasi,
        startDate,
        endDate
    };
    console.log(promoCode);
    return promoCode;
});
// ROle 0 : Scheduler Waktu Tertentu dikirim setiap pukul 08:30. jika ignin setiap menit * * * * *
const task = node_cron_1.default.schedule('* * * * *', () => {
    // kode inti
    // ROle 1 Flowchart funcsi untuk menampilkan User Yang Valid dan Berulang tahun hari ini 
    fetchUsers({ email: "nurramdandoni@gmail.com", verifiedStatus: "Active", isBirthday: true })
        .then((users) => {
        console.log("Hasil", users);
        //   ROle 2 Looping User List
        for (let i = 0; i < users.length; i++) {
            const dataUser = users[i];
            // console.log("param Send ",dataUser.namaDepan)
            //   Role 3 Generate Code Promo Per User
            const datapromo = generatePromoCode({ name: "Promo Ulang Tahun", startDate: "2023-03-01", endDate: "2023-03-04", idNotifikasi: 1 });
            const params = {
                to: dataUser.email,
                subject: "Promo Spesial Ulang Tahun",
                text: `Selamat Ulang Tahun ${dataUser.namaDepan} ${dataUser.namaBelakang} ada Promo Spesial Untukmu`,
            };
            //   Role 4 Send Email
            sendNotification(params);
        }
    }).catch((err) => {
        console.log(err);
    });
});
//   panggil task
task.start();
