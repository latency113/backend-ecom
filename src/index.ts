import 'dotenv/config';
import cors from 'cors';
import express, { Request, Response } from "express";
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use(cors());

import {
  categoryControllers,
  productController,
  userControllers,
  cartControllers,       // Import cartControllers
  cartItemControllers,   // Import cartItemControllers
  orderControllers,      // Import orderControllers
  orderItemControllers,  // Import orderItemControllers
  reviewControllers,     // Import reviewControllers
  authControllers,       // Import authControllers
  uploadControllers,     // Import uploadControllers
  addressControllers,    // Import addressControllers
  adminDashboardControllers // Import adminDashboardControllers
} from './feature/controllers/index.js';

userControllers(app);
categoryControllers(app);
productController(app);
cartControllers(app);       // Call cartControllers
cartItemControllers(app);   // Call cartItemControllers
orderControllers(app);      // Call orderControllers
orderItemControllers(app);  // Call orderItemControllers
reviewControllers(app);     // Call reviewControllers
authControllers(app);       // Call authControllers
uploadControllers(app);     // Call uploadControllers
addressControllers(app);    // Call addressControllers
adminDashboardControllers(app); // Call adminDashboardControllers
app.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});

// Serve static files from the 'uploads' directory
app.use('/api/v1/uploads', express.static('uploads'));

app.use((req: Request, res: Response) => {
  res.status(404).send("Route not found");
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
