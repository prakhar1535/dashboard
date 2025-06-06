"use client";
import { Button } from "@/components/common/Button";
import { Heading } from "@/components/common/Heading";
import { SearchInput } from "@/components/common/SearchInput";
import { ChevronLeft, Download, Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportsTable } from "./ReportsTable";
import { FilterDropdown } from "./FilterDropdown";
import { SortDropdown } from "./SortDropdown";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  ExecutionData,
  FilterOptions,
  SortOptions,
  TimePeriod,
  processReportsData,
  parseFiltersFromURL,
  parseSortFromURL,
  copyToClipboard,
  exportToPDF,
} from "@/lib/reportUtils";

interface ReportsHeaderProps {
  className?: string;
}

const mockData: ExecutionData[] = [
  {
    id: "20230401",
    hostName: "BEAT",
    hostIP: "192.168.0.100",
    executionName: "BEAT",
    startDate: "2024-12-20 08:28:36",
    executionState: "success",
    progress: 55,
    type: "Template",
    executedBy: "Shreya",
  },
  {
    id: "20230402",
    hostName: "Monthly_scan_3",
    hostIP: "192.168.0.100",
    executionName: "Monthly_scan_3",
    startDate: "2024-12-19 19:49:33",
    executionState: "warning",
    progress: 30,
    type: "Test case",
    executedBy: "Mayank",
  },
  {
    id: "20230403",
    hostName: "Weekly_report_2",
    hostIP: "192.168.0.100",
    executionName: "Weekly_report_2",
    startDate: "2024-12-18 19:17:15",
    executionState: "error",
    progress: 95,
    type: "Template",
    executedBy: "Vignesh",
  },
  {
    id: "20230404",
    hostName: "Weekly_report_2",
    hostIP: "192.168.0.100",
    executionName: "Weekly_report_2",
    startDate: "2024-12-17 19:17:15",
    executionState: "warning",
    progress: 30,
    type: "Test case",
    executedBy: "Vignesh",
  },
  {
    id: "20230405",
    hostName: "Weekly_report_2",
    hostIP: "192.168.0.100",
    executionName: "Weekly_report_2",
    startDate: "2024-12-16 19:17:15",
    executionState: "success",
    progress: 80,
    type: "Template",
    executedBy: "Mayank",
  },
  {
    id: "20230406",
    hostName: "Security_Scan",
    hostIP: "192.168.0.101",
    executionName: "Security_Scan",
    startDate: "2024-12-15 10:30:00",
    executionState: "success",
    progress: 100,
    type: "Security",
    executedBy: "Shreya",
  },
  {
    id: "20230407",
    hostName: "Performance_Test",
    hostIP: "192.168.0.102",
    executionName: "Performance_Test",
    startDate: "2024-12-14 14:15:22",
    executionState: "error",
    progress: 25,
    type: "Performance",
    executedBy: "Vignesh",
  },
  {
    id: "20230408",
    hostName: "Database_Backup",
    hostIP: "192.168.0.103",
    executionName: "Database_Backup",
    startDate: "2024-11-25 02:00:00",
    executionState: "success",
    progress: 100,
    type: "Backup",
    executedBy: "Shreya",
  },
  {
    id: "20230409",
    hostName: "API_Test",
    hostIP: "192.168.0.104",
    executionName: "API_Test",
    startDate: "2024-11-20 16:45:30",
    executionState: "warning",
    progress: 75,
    type: "Test case",
    executedBy: "Mayank",
  },
  {
    id: "20230410",
    hostName: "Load_Test",
    hostIP: "192.168.0.105",
    executionName: "Load_Test",
    startDate: "2024-10-15 11:20:15",
    executionState: "error",
    progress: 45,
    type: "Performance",
    executedBy: "Vignesh",
  },
];

const ReportsHeader = ({ className }: ReportsHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [filters, setFilters] = useState<FilterOptions>(() =>
    parseFiltersFromURL(searchParams)
  );
  const [sortOptions, setSortOptions] = useState<SortOptions>(() =>
    parseSortFromURL(searchParams)
  );
  const [activeFilter, setActiveFilter] = useState<TimePeriod>(
    filters.timePeriod
  );
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const filterButtons: TimePeriod[] = ["Weekly", "Monthly", "Yearly", "Custom"];

  const updateURL = useCallback(
    (
      newFilters: FilterOptions,
      newSortOptions: SortOptions,
      newSearchQuery: string
    ) => {
      const params = new URLSearchParams();

      if (newSearchQuery.trim()) {
        params.set("search", newSearchQuery);
      }

      if (newFilters.timePeriod !== "Yearly") {
        params.set("period", newFilters.timePeriod);
      }

      if (newFilters.executionState && newFilters.executionState.length > 0) {
        params.set("states", newFilters.executionState.join(","));
      }

      if (newFilters.type && newFilters.type.length > 0) {
        params.set("types", newFilters.type.join(","));
      }

      if (newFilters.executedBy && newFilters.executedBy.length > 0) {
        params.set("executors", newFilters.executedBy.join(","));
      }

      if (newSortOptions.field !== "startDate") {
        params.set("sortField", newSortOptions.field);
      }
      if (newSortOptions.direction !== "desc") {
        params.set("sortDir", newSortOptions.direction);
      }

      const newURL = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.replace(newURL, { scroll: false });
    },
    [router, pathname]
  );

  const handleTimePeriodChange = (period: TimePeriod) => {
    setActiveFilter(period);
    const newFilters = { ...filters, timePeriod: period };
    setFilters(newFilters);
    updateURL(newFilters, sortOptions, searchQuery);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setActiveFilter(newFilters.timePeriod);
    updateURL(newFilters, sortOptions, searchQuery);
  };

  const handleSortChange = (newSortOptions: SortOptions) => {
    setSortOptions(newSortOptions);
    updateURL(filters, newSortOptions, searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);
    updateURL(filters, sortOptions, newSearchQuery);
  };

  const handleShare = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  const handleExport = async () => {
    // Ensure this only runs on the client side
    if (typeof window === "undefined") {
      console.error("PDF export is only available on the client side");
      return;
    }

    try {
      setIsExporting(true);
      await exportToPDF(processedData, filters, searchQuery);
    } catch (error) {
      console.error("Export failed:", error);
      // You could add a toast notification here for error feedback
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const newFilters = parseFiltersFromURL(searchParams);
    const newSortOptions = parseSortFromURL(searchParams);
    const newSearchQuery = searchParams.get("search") || "";

    setFilters(newFilters);
    setSortOptions(newSortOptions);
    setSearchQuery(newSearchQuery);
    setActiveFilter(newFilters.timePeriod);
  }, [searchParams]);

  const processedData = useMemo(() => {
    console.log("Processing data:", {
      originalDataLength: mockData.length,
      searchQuery,
      filters,
      sortOptions,
    });
    const result = processReportsData(
      mockData,
      searchQuery,
      filters,
      sortOptions
    );
    console.log("Processed data length:", result.length);
    return result;
  }, [searchQuery, filters, sortOptions]);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <Heading level={1} size="2xl">
            Reports
          </Heading>
          <p className="text-muted-foreground mt-1">
            View reports for hosts and projects scans
          </p>
        </div>
      </div>

      <div className="bg-white rounded-md p-4 space-y-6">
        <div className="">
          <div className="flex space-x-4">
            <button className="py-1.5 cursor-pointer px-3 bg-black/5 rounded-md text-black font-medium">
              Hosts
            </button>
            <button className="py-1.5 cursor-pointer px-3  rounded-md text-black font-medium">
              Projects
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-end sm:flex-row gap-4 items-center">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex flex-wrap gap-3">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="flex">
                  {filterButtons.map((filter, index) => (
                    <motion.button
                      key={filter}
                      onClick={() => handleTimePeriodChange(filter)}
                      className={cn(
                        "px-4 py-2 text-sm font-medium relative transition-all duration-200",
                        "border-r border-gray-200 last:border-r-0",
                        index === 0 && "rounded-l-lg",
                        index === filterButtons.length - 1 && "rounded-r-lg",
                        activeFilter === filter
                          ? "text-gray-900 bg-[#F7F7F7] "
                          : "text-gray-700 bg-white hover:bg-gray-50"
                      )}
                      style={{
                        boxShadow:
                          activeFilter === filter
                            ? "inset 0 3px 1px rgba(0, 0, 0, .3), inset 0 1px 3px rgba(0, 0, 0, 0.2)"
                            : "inset 0 -2px 1px rgba(0, 0, 0, .3), inset 0 1px 3px rgba(0, 0, 0, 0.2)",
                      }}
                      whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{
                        scale: 0.98,
                        transition: { duration: 0.1 },
                      }}
                      initial={false}
                      animate={{
                        scale: activeFilter === filter ? 0.98 : 1,
                        transition: { duration: 0.2 },
                      }}
                    >
                      {activeFilter === filter && (
                        <motion.div
                          className="absolute  rounded-inherit"
                          layoutId="activeBackground"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative z-10">{filter}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <FilterDropdown
              data={mockData}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />

            <SortDropdown
              sortOptions={sortOptions}
              onSortChange={handleSortChange}
            />

            <SearchInput
              placeholder="Search reports..."
              className="w-64"
              value={searchQuery}
              onChange={handleSearchChange}
            />

            <Button
              variant="outline"
              size="sm"
              icon={shareSuccess ? Check : Share2}
              onClick={handleShare}
              className={cn(
                "transition-colors",
                shareSuccess && "border-green-500 bg-green-50 text-green-700"
              )}
            >
              {shareSuccess ? "Copied!" : "Share"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleExport}
              disabled={isExporting || processedData.length === 0}
            >
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>

        <ReportsTable data={processedData} />
      </div>
    </div>
  );
};

export { ReportsHeader };
