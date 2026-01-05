import prisma from "@/providers/database/database.provider";

export const getDashboardStats = async () => {
  const totalProducts = await prisma.product.count();
  const totalUsers = await prisma.user.count();

  // Orders today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const ordersToday = await prisma.order.count({
    where: {
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  // Pending orders
  const pendingOrders = await prisma.order.count({
    where: {
      status: "PENDING", // Assuming an enum or string value for status
    },
  });

  return {
    totalProducts,
    totalUsers,
    ordersToday,
    pendingOrders,
  };
};
