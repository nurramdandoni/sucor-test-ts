import  mysql  from 'mysql2/promise';

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

const fetchUsers = async ({ email, verifiedStatus, isBirthday }: UserFilterField): Promise<User[]> => {
  // Connect to the database
  const connection = await mysql.createConnection({
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
  const [rows] = await connection.execute(query, params);
  return rows as User[];

};

fetchUsers({email:"nurramdandoni@gmail.com",verifiedStatus:"Active",isBirthday:true})
.then(
  (users) => {
    console.log(users);
  }
).catch(
  (err) => {
    console.log(err);
  }
);