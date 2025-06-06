import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showShortcut?: boolean;
  shortcutKey?: string;
}

const SearchInput = ({
  className,
  showShortcut = false,
  shortcutKey = "⌘K",
  ...props
}: SearchInputProps) => {
  const isDarkTheme = className?.includes("bg-slate-800");

  return (
    <div className="relative">
      <Search
        className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
          isDarkTheme ? "text-slate-400" : "text-muted-foreground"
        )}
      />
      <Input
        className={cn("pl-10", showShortcut && "pr-12", className)}
        {...props}
      />
      {showShortcut && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <kbd
            className={cn(
              "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100",
              isDarkTheme
                ? "bg-slate-700 border-slate-600 text-slate-300"
                : "bg-muted border-border text-muted-foreground"
            )}
          >
            {shortcutKey}
          </kbd>
        </div>
      )}
    </div>
  );
};

export { SearchInput };
