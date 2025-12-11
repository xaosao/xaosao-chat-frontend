import { useEffect, useRef, useState, createContext, useContext, ReactNode } from "react";

interface ContextMenuPosition {
  x: number;
  y: number;
}

interface ContextMenuContextType {
  isOpen: boolean;
  position: ContextMenuPosition;
  menuId: string | null;
  openMenu: (id: string, x: number, y: number) => void;
  closeMenu: () => void;
}

const ContextMenuContext = createContext<ContextMenuContextType | null>(null);

export function ContextMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 });
  const [menuId, setMenuId] = useState<string | null>(null);

  const openMenu = (id: string, x: number, y: number) => {
    setMenuId(id);
    setPosition({ x, y });
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setMenuId(null);
  };

  useEffect(() => {
    const handleClick = () => closeMenu();
    const handleScroll = () => closeMenu();

    if (isOpen) {
      document.addEventListener("click", handleClick);
      document.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  return (
    <ContextMenuContext.Provider value={{ isOpen, position, menuId, openMenu, closeMenu }}>
      {children}
    </ContextMenuContext.Provider>
  );
}

function useContextMenu() {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error("useContextMenu must be used within a ContextMenuProvider");
  }
  return context;
}

interface ContextMenuTriggerProps {
  id: string;
  children: ReactNode;
}

export function ContextMenuTrigger({ id, children }: ContextMenuTriggerProps) {
  const { openMenu } = useContextMenu();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openMenu(id, e.clientX, e.clientY);
  };

  return (
    <div onContextMenu={handleContextMenu}>
      {children}
    </div>
  );
}

interface ContextMenuProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function ContextMenu({ id, children, className = "" }: ContextMenuProps) {
  const { isOpen, position, menuId, closeMenu } = useContextMenu();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Adjust position if menu goes outside viewport
      if (position.x + rect.width > viewportWidth) {
        menuRef.current.style.left = `${viewportWidth - rect.width - 10}px`;
      }
      if (position.y + rect.height > viewportHeight) {
        menuRef.current.style.top = `${viewportHeight - rect.height - 10}px`;
      }
    }
  }, [isOpen, position]);

  if (!isOpen || menuId !== id) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className={`fixed z-50 min-w-[160px] rounded-xl bg-modalBg border border-borderColor shadow-lg py-1 ${className}`}
      style={{
        left: position.x,
        top: position.y,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

interface ContextMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ContextMenuItem({ children, onClick, className = "" }: ContextMenuItemProps) {
  const { closeMenu } = useContextMenu();

  const handleClick = () => {
    onClick?.();
    closeMenu();
  };

  return (
    <div
      className={`px-4 py-2 cursor-pointer hover:bg-dropdownOptionHover text-sm ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
