import { SearchInput } from "@/components/common/SearchInput";
import { Button } from "@/components/common/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn("bg-slate-900 text-white px-6 py-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-white">HASS</h1>
        </div>

        <div className="flex justify-center">
          <SearchInput
            placeholder="Search"
            showShortcut
            shortcutKey="⌘K"
            className="w-[480px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-slate-600"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 h-9 w-9 rounded-md"
          >
            <HelpCircle className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 h-9 w-9 rounded-md"
          >
            <Bell className="w-5 h-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-0"
            >
              2
            </Badge>
          </Button>

          <div className="flex items-center gap-2 ml-2">
            <Avatar className="w-7 h-7">
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback className="bg-slate-700 text-white text-xs">
                JD
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-white">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
