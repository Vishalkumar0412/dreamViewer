

import env from "./config/env.js";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";


connectDatabase()
app.listen(env.PORT,()=>{
    console.log("server is running on port",env.PORT)
})