import { MenuItemModel } from "@/modules/users/infrastructure/persistence/MenuItems/MenuItemsModel";
import cron from "node-cron";

export const resetDailyStockJob = cron.schedule("0 0 * * *", async () => {
  //se resetea cada 10 segundos para probar si funciona
  //export const resetDailyStockJob = cron.schedule("*/10 * * * * *", async () => {
  try {
    const items = await MenuItemModel.find({ deleted_at: null });

    for (const item of items) {
      item.daily_stock = item.stock;
      await item.save();
    }

    console.log("Daily stock reseteado correctamente");
  } catch (error) {
    console.error("Error al resetear daily stock:", error);
  }
});
