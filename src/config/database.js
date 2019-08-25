module.exports = {
  dialect : 'postgres',
  host: 'localhost',
  username:'postgres',
  password:'docker',
  database:'gobarber',
    define: {
      timestamp:false,
      underscored:true,
      underscoredAll:true,
    }
};
