import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import "./navigation.css";

export default function ResponsiveSidebar({ children, className, scopeClass, title, role }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const closeAfterNavigation = (event) => {
    if (!event.defaultPrevented && event.target.closest("a[href], [data-navigation-item]")) setOpen(false);
  };

  return (
    <>
      <aside className={`${className} ft-sidebar`}>{children}</aside>
      <div className="ft-mobile-navigation">
        <Link to="/" className="ft-mobile-navigation__brand" aria-label="FinTeen — Trang chủ">
          <img src="/brand/finteen-logo-v2.webp" alt="FinTeen" />
          <span>{title}</span>
        </Link>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button type="button" className="ft-navigation-toggle" aria-label={`Mở menu ${title}`}>
              <Menu size={20} aria-hidden="true" /><span>Menu</span>
            </button>
          </DialogTrigger>
          <DialogContent className={`${scopeClass} ft-sidebar-drawer`} data-ws-role={role}>
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <DialogDescription className="sr-only">Chọn một mục để chuyển trang trong không gian làm việc.</DialogDescription>
            <aside className={`${className} ft-sidebar ft-sidebar--drawer`} onClick={closeAfterNavigation}>{children}</aside>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
