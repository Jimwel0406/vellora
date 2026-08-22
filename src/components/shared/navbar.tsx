import { auth } from "@/lib/auth";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const session = await auth();
  return <NavbarClient session={session} />;
}
