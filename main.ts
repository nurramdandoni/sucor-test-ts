import  mysql  from 'mysql2/promise';
import nodemailer from "nodemailer";
interface UserFilterField {
  email: string;
  verifiedStatus?: string;
  isBirthday?: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  verified: boolean;
  birthday?: Date;
  namaDepan?:string;
  namaBelakang?:string;
}
// interface UserSend extends User {
//     idUser: number,
//     name: string;
//     email: string;
//     verified: boolean;
//     birthday?: Date;
//     username: string,
//     password: string,
//     status: string,
//     idProfile: number,
//     namaDepan: string,
//     namaBelakang: string,
//     jeniskelamin: string,
//     tempatLahir: Date,
//     tanggalLahir: Date,    
//     ketBio: string
// }

interface NotificationParams {
    to: string;
    subject: string;
    text: string;
  }

  interface CreatePromoField {
    name: string;
    startDate: string;
    endDate: string;
    idNotifikasi:number;
  }
  
  interface PromoCode {
    code: string;
    name: string;
    startDate: string;
    endDate: string;
  }

const fetchUsers = async (params: UserFilterField): Promise<User[]> => {
  // Connect to the database
  //   1a KOneksi database mysql
  const connection = await mysql.createConnection({
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
  const [rows] = await connection.execute(query, paramsQuery);
  return rows as User[];

};

const sendNotification = async (params: NotificationParams) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "nurramdandoni@gmail.com", // isi dengan email yang diinginkan
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
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (err) {
      console.error("Failed to send email: ", err);
    }
  }

  const generatePromoCode = async ({name, startDate, endDate,idNotifikasi}: CreatePromoField): Promise<PromoCode> => {
    // Generate unique code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  
    // Store the promo code data in database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'suco'
    });
    const queryGetNotificationInfo = 'SELECT * FROM notifikasi WHERE idNotifikasi = ?';
    const paramsNotifInfo = [idNotifikasi]
    const getInfo:any= await connection.execute(queryGetNotificationInfo,paramsNotifInfo);
    const info:{
        idNotifikasi: number,
        namaNotifikasi: string,
        amount: number,
        percent: number,
        keteranganNotifikasi:string
    } = getInfo[0][0]
    const query = 'INSERT INTO promo (kodePromo, namaPromo, tanggalMulai, tanggalAkhir,idNotifikasi) VALUES (?, ?, ?, ?, ?)';
    const params = [code,name, startDate, endDate,idNotifikasi];
    await connection.execute(query, params);
  
    // Return the generated promo code data
    const promoCode: PromoCode = {
      code,
      name:info.namaNotifikasi,
      startDate,
      endDate
    };
    console.log(promoCode)
    return promoCode;
  };


// ROle 0 : Scheduler Waktu Tertentu

// ROle 1 Flowchart funcsi untuk menampilkan User Yang Valid dan Berulang tahun hari ini 
fetchUsers({email:"nurramdandoni@gmail.com",verifiedStatus:"Active",isBirthday:true})
.then(
  (users) => {
    console.log("Hasil",users);
    //   ROle 2 Looping User List
    for(let i=0;i<users.length;i++){
        const dataUser: User = users[i]
        // console.log("param Send ",dataUser.namaDepan)
        //   Role 3 Generate Code Promo Per User
        const datapromo = generatePromoCode({name:"Promo Ulang Tahun", startDate:"2023-03-01", endDate:"2023-03-04",idNotifikasi:1})
        const params: NotificationParams = {
            to: dataUser.email,
            subject: "Promo Spesial Ulang Tahun",
            text: `Selamat Ulang Tahun ${dataUser.namaDepan} ${dataUser.namaBelakang} ada Promo Spesial Untukmu`,
          };
        //   Role 4 Send Email
        sendNotification(params)
    }
  }
).catch(
  (err) => {
    console.log(err);
  }
);