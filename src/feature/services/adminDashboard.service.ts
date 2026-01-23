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

export const getRevenueReport = async () => {
  // Aggregate revenue by status, excluding CANCELLED orders
  const orders = await prisma.order.findMany({
    where: {
      status: {
        not: "CANCELLED"
      }
    },
    select: {
      totalAmount: true,
      status: true,
      createdAt: true,
    }
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const completedRevenue = orders
    .filter(o => o.status === "DELIVERED")
    .reduce((sum, order) => sum + order.totalAmount, 0);
  
  const pendingRevenue = orders
    .filter(o => o.status === "PENDING" || o.status === "PROCESSING" || o.status === "SHIPPED")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  // Group by month for chart/table
  const monthlyRevenue: Record<string, number> = {};
  orders.forEach(order => {
    const month = order.createdAt.toISOString().substring(0, 7); // YYYY-MM
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.totalAmount;
  });

  const monthlyData = Object.keys(monthlyRevenue).sort().map(month => ({
    month,
    revenue: monthlyRevenue[month]
  }));

  return {
    totalRevenue,
    completedRevenue,
    pendingRevenue,
    monthlyData,
    totalOrders: orders.length
  };
};
