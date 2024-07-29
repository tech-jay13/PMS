import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import connectDB from "./config/database";
import productRoutes from "./routes/productRoutes";
import fs from "fs";
import path from "path";

const app = express();
const port = 3000;

connectDB();

app.use(express.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "PMS",
      version: "1.0.0",
      description: "A product management service API",
    },
    servers: [
      {
        url: process.env.HOSTED_URL ?? `http://localhost:${port}`,
      },
    ],
  },
  apis: [path.join(__dirname, "../swagger/swagger.yaml")],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/products", productRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
