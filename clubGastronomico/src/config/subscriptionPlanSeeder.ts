import SubscriptionModel from "@/modules/users/infrastructure/persistence/subscription/subscriptionModel";
const plans = [
  {
    name: "Free",
    price: "0",
    is_active: true,
  },
  {
    name: "Basic",
    price: "19.99",
    is_active: true,
  },
  {
    name: "Premium",
    price: "49.99",
    is_active: true,
  },
];

export const seedSubscriptionPlans = async (): Promise<void> => {
  for (const plan of plans) {
    const exists = await SubscriptionModel.findOne({ name: plan.name });

    if (!exists) {
      await SubscriptionModel.create(plan);
      console.log(`Plan "${plan.name}" creado`);
    }
  }
};
