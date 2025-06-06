"use client";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { ArrowUpDown, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { SortField, SortOptions } from "@/lib/reportUtils";

interface SortDropdownProps {
  sortOptions: SortOptions;
  onSortChange: (sortOptions: SortOptions) => void;
  className?: string;
}

const sortFields: { field: SortField; label: string }[] = [
  { field: "startDate", label: "Start Date" },
  { field: "hostName", label: "Host Name" },
  { field: "executionName", label: "Execution Name" },
  { field: "executionState", label: "Execution State" },
  { field: "type", label: "Type" },
  { field: "executedBy", label: "Executed By" },
  { field: "progress", label: "Progress" },
];

const SortDropdown = ({
  sortOptions,
  onSortChange,
  className,
}: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFieldChange = (field: SortField) => {
    onSortChange({
      ...sortOptions,
      field,
    });
    setIsOpen(false);
  };

  const handleDirectionToggle = () => {
    onSortChange({
      ...sortOptions,
      direction: sortOptions.direction === "asc" ? "desc" : "asc",
    });
  };

  const currentFieldLabel =
    sortFields.find((f) => f.field === sortOptions.field)?.label ||
    "Start Date";

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        icon={ArrowUpDown}
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        Sort
        <ChevronDown className="w-4 h-4 ml-1" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Sort By</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {currentFieldLabel}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDirectionToggle}
                    className="p-1 h-auto"
                  >
                    {sortOptions.direction === "asc" ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                {sortFields.map(({ field, label }) => (
                  <button
                    key={field}
                    onClick={() => handleFieldChange(field)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                      "hover:bg-gray-100",
                      sortOptions.field === field
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{label}</span>
                      {sortOptions.field === field && (
                        <div className="flex items-center gap-1">
                          {sortOptions.direction === "asc" ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : (
                            <ArrowDown className="w-3 h-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Direction:</span>
                  <div className="flex bg-gray-100 rounded-md p-1">
                    <button
                      onClick={() =>
                        onSortChange({ ...sortOptions, direction: "asc" })
                      }
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded transition-all",
                        sortOptions.direction === "asc"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      <ArrowUp className="w-3 h-3 inline mr-1" />
                      Asc
                    </button>
                    <button
                      onClick={() =>
                        onSortChange({ ...sortOptions, direction: "desc" })
                      }
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded transition-all",
                        sortOptions.direction === "desc"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      <ArrowDown className="w-3 h-3 inline mr-1" />
                      Desc
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export { SortDropdown };
