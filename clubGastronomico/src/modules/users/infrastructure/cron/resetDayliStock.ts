import { MenuItemModel } from "@/modules/users/infrastructure/persistence/MenuItems/MenuItemsModel";
import cron from "node-cron";

export const resetDailyStockJob = cron.schedule("0 0 * * *", async () => {
  try {
    await MenuItemModel.updateMany({ deleted_at: null }, [{ $set: { daily_stock: "$stock" } }]);

    console.log("Daily stock reseteado correctamente");
  } catch (error) {
    console.error("Error al resetear daily stock:", error);
  }
});
