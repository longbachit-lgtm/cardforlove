const coursesRouter = require("./courses");

const authRouter = require("./auth");
const uploadRouter = require("./upload");
const userRouter = require("./user");
const targetRoute = require("./target");
const cardRoute = require("./card");
function route(app) {
  app.use("/courses", coursesRouter);
  app.use("/auth", authRouter);
  app.use("/upload", uploadRouter);
  app.use("/user", userRouter);
  app.use("/target", targetRoute);
   app.use("/card", cardRoute);

}

module.exports = route;
