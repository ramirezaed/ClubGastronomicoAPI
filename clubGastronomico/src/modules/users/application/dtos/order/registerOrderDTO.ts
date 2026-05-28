// export interface registerOrderDTO {
//   company_id: string;
//   customer: {
//     name: string;
//     address: string;
//     phone?: string;
//     telefram_id?: string;
//     telegram_username: string;
//   };
//   items: {
//     menuItems_id: string;
//     category_id: string;
//     item_name: string;
//     category_name: string;
//     quantity: number;
//     unit_price: number;
//     time?: number;
//   }[];
// }

export interface registerOrderDTO {
  customer: {
    name: string;
    address: string;
    phone?: string;
    telegram_username?: string;
  };
  items: {
    menuItems_id: string;
    quantity: number;
  }[];
}
