import { NavItem } from "@/types/global/menu.type";
import { atom } from "jotai";

export const menuOpenAtom = atom<boolean>(false);
export const menuRoutinesAtom = atom<NavItem[]>([
  {
    icon: "FiSettings",
    name: "Configurações",
    authorized: false,
    code: "A",
    subItems: [
      {name: "Logs",              path: "/settings/logger",            code: "A1", pro: false, authorized: false },
      {name: "Templates",         path: "/settings/templates",         code: "A2", pro: false, authorized: false },
      {name: "Triggers",          path: "/settings/triggers",          code: "A3", pro: false, authorized: false },
      {name: "Auditoria",         path: "/settings/audits",            code: "A4", pro: false, authorized: false },
      {name: "Perfil de Usuário", path: "/master-data/profile-users",  code: "A5", pro: false, authorized: false },
    ]
  },
  {
    icon: "FiGrid",
    name: "Cadastros",
    authorized: false,
    code: "B",
    path: "/master-data/users",
    subItems: [
      {name: "Usuários", path: "/master-data/users", code: "B1", icon: "MdPeople", pro: false, authorized: false },
    ]
  },
  {
    icon: "FiGrid",
    name: "Eventos",
    authorized: false,
    code: "F",
    path: "/events",
    subItems: [
      {name: "Eventos", path: "/events",  code: "F1", icon: "MdEvent", pro: false, authorized: false },
    ]
  },
  {
    icon: "FiGrid",
    name: "Certificados",
    authorized: false,
    code: "D",
    path: "/certificates",
    subItems: [
      {name: "Certificados", path: "/certificates", code: "D1", icon: "MdBrush", pro: false, authorized: false },
    ]
  },
  {
    icon: "FiGrid",
    name: "Meus Certificados",
    authorized: false,
    code: "E",
    path: "/my-certificates",
    subItems: [
      {name: "Meus Certificados", path: "/my-certificates", code: "E1", icon: "MdWorkspacePremium", pro: false, authorized: false },
    ]
  }
]);