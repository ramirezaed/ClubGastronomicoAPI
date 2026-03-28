//
import RoleModel from "@/modules/users/infrastructure/persistence/RoleModel";

const roles = [
  {
    name: "SuperAdmin",
    description: "acceso total al sistema",
    permission: ["*"], //el * indica acceso total
    is_active: true,
  },
  {
    name: "owner",
    description: "propietario de la empresa, gestiona su negocio",
    permissions: ["manage_branch", "manage_employees", "view_reports"],
    is_active: true,
  },
  {
    name: "employee",
    description: "empleado con acceso limitado",
    permissions: ["view_own_data"],
    is_active: true,
  },
];

export const seedRoles = async (): Promise<void> => {
  //recorre el array roles, y guarda cada elemento de ese array en role
  for (const role of roles) {
    // verifca que no exista ese rol en la db
    const existe = await RoleModel.findOne({ name: role.name });
    //si no existe el rol, lo crea
    if (!existe) {
      await RoleModel.create(role);
      console.log(`Rol "${role.name}" creado`);
    }
  }
};
