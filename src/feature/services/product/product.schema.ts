import z from "zod";

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  description: z.string().min(5).max(1000),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  imgUrl: z.string().url().nullable().optional(),
  categoryId: z.string().uuid(),
});

export type Product = z.infer<typeof ProductSchema>;


// model Product {
//   id          String  @id @default(uuid())
//   name        String
//   description String? @db.Text
//   price       Float
//   stock       Int     @default(0)
//   imgUrl      String?
//   categoryId  String

//   // Relations
//   category   Category    @relation(fields: [categoryId], references: [id])
//   orderItems OrderItem[]
//   cartItems  CartItem[]
//   reviews    Review[]

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }