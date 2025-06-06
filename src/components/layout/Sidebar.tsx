import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Server,
  Play,
  Settings,
  Shield,
  ChevronDown,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/common/Button";

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: Server, label: "Environments", active: false, hasSubmenu: true },
  { icon: Play, label: "Executions", active: false },
  { icon: Settings, label: "Configuration", active: false },
  { icon: Shield, label: "Reports", active: true },
  { icon: User, label: "Administration", active: false, hasSubmenu: true },
];

const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div
      className={cn(
        "w-64 bg-[#E6EAF1] border-r border-slate-200 flex flex-col h-full",
        className
      )}
    >
      <nav className="flex-1 px-3 py-6">
        {navigationItems.map((item, index) => (
          <div key={index} className="mb-1">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-left h-9 px-3 rounded-md",
                item.active
                  ? "bg-white text-slate-900 font-medium"
                  : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              )}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
              {item.hasSubmenu && <ChevronDown className="w-4 h-4 ml-auto" />}
            </Button>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/avatar.jpg" />
            <AvatarFallback className="bg-slate-300 text-slate-700">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              John Doe
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 hover:text-slate-700 h-8 w-8"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export { Sidebar };
