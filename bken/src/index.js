const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const methodOverride = require("method-override");
const { engine } = require("express-handlebars");

const route = require("./routes");
const db = require("./config/db");

// Connect to DB
db.connect();

const app = express();
const port = 5000;

// Use static folder
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(methodOverride("_method"));

// HTTP logger
app.use(morgan('dev'));

// Lightweight request logger (method, url, and small body preview)
app.use((req, _res, next) => {
  const bodyPreview = (() => {
    try {
      const str = JSON.stringify(req.body);
      return str && str.length > 200 ? str.slice(0, 200) + '…' : str;
    } catch (_) {
      return undefined;
    }
  })();
  console.log(`[REQ] ${req.method} ${req.originalUrl}`, bodyPreview ? `body=${bodyPreview}` : '');
  next();
});

// Template engine
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));
// Cho phép truy cập ảnh tĩnh
app.use("/uploads", express.static(path.join(__dirname, "./app/uploads")));
// Routes init
route(app);

// Global error handler (logs errors to terminal)
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({ message: 'Server error', error: err?.message });
});

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
