import app from './app.js';
import dotenv from 'dotenv';
import connect from './db/connect.js'


dotenv.config({
    path: './.env'
}
)

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connect();
})