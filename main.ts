interface UserFilterField {
    email: string;
    verifiedStatus?: boolean;
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
      user: 'username',
      password: 'password',
      database: 'database_name'
    });
  
    // Build the query
    let query = 'SELECT * FROM users WHERE email = ?';
    const params = [email];
  
    if (verifiedStatus !== undefined) {
      query += ' AND verified = ?';
      params.push(verifiedStatus);
    }
  
    if (isBirthday) {
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      query += ` AND MONTH(birthday) = ${month} AND DAY(birthday) = ${day}`;
    }
  
    // Execute the query and return the results
    const [rows] = await connection.execute(query, params);
    return rows as User[];
  };