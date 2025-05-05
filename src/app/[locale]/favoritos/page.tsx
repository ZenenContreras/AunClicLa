import FavoritePage from "@/modules/user/ui/FavoritePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis Favoritos | Tu Tienda",
  description: "Gestiona tus productos favoritos",
};

export default function FavoritosPage() {
  return <FavoritePage />;
}
