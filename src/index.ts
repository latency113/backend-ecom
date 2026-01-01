import 'dotenv/config';
import express, { Request, Response } from "express";
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;


import { categoryControllers, productController, userControllers } from './feature/controllers/index.js';
userControllers(app);
categoryControllers(app);
productController(app);
app.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});
app.use((req: Request, res: Response) => {
  res.status(404).send("Route not found");
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
