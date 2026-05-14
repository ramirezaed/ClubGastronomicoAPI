// export const seedSubscriptionPlans = async (): Promise<void> => {
//   for (const plan of plans) {
//     const exists = await SubscriptionModel.findOne({ name: plan.name });

//     if (!exists) {
//       await SubscriptionModel.create(plan);
//       console.log(`Plan "${plan.name}" creado`);
//     }
//   }
// };
