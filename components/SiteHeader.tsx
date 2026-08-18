import NavBar from "@/components/home/navBar";

/**
 * The global site navigation deliberately reuses the homepage navigation so
 * every route has the same visual language and interaction model.
 */
export default function SiteHeader() {
  return <NavBar position="fixed" />;
}
