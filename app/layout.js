import "../styles/globals.css";
export const metadata = { title: "Home in Every Bite", description: "South African bites freshly baked to order." };
export default function RootLayout({ children }) {
  return (<html lang="en"><body>{children}</body></html>);
}
