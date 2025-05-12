const express = require("express");
const cors = require("cors");
const { adminRouter } = require("./routes/admin");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");

const app = express();
app.use(cors());
app.use(express.json());
 
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/course", courseRouter);

app.listen(8000, () => console.log("Server running on port 8000"));