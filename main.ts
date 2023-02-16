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
}

interface NotificationParams {
    to: string;
    subject: string;
    text: string;
  }

const fetchUsers = async (params: UserFilterField): Promise<User[]> => {
  // Connect to the database
  const connection = await mysql.createConnection({
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

fetchUsers({email:"nurramdandoni@gmail.com",verifiedStatus:"Active",isBirthday:true})
.then(
  (users) => {
    console.log(users);
    const params: NotificationParams = {
        to: "nurramdandoni@gmail.com",
        subject: "Test Email Suco",
        text: "This is a test email Suco",
      };
    sendNotification(params)
  }
).catch(
  (err) => {
    console.log(err);
  }
);