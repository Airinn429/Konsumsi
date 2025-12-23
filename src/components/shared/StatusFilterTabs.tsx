//Tab filter status.

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BadgeCheck, FolderClock, ListTodo, X, XCircle } from "lucide-react";
import { OrderStatus } from "@/types/consumption";

interface StatusFilterTabsProps {
    activeFilter: OrderStatus | 'All';
    onFilterChange: (status: OrderStatus | 'All') => void;
    counts: Record<OrderStatus | 'All', number>;
    isMounted?: boolean;
}

export const StatusFilterTabs: React.FC<StatusFilterTabsProps> = ({ activeFilter, onFilterChange, counts, isMounted = true }) => {
    const filters: { label: string; value: OrderStatus | 'All'; icon: React.ElementType }[] = [
        { label: "All", value: "All", icon: ListTodo },
        { label: "Menunggu", value: "Pending", icon: FolderClock },
        { label: "Disetujui", value: "Approved", icon: BadgeCheck },
        { label: "Ditolak", value: "Rejected", icon: XCircle },
        { label: "Dibatalkan", value: "Cancelled", icon: X },
    ];

    return (
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-thin">
            {filters.map(filter => {
                const Icon = filter.icon;
                return (
                    <Button
                        key={filter.value}
                        variant={activeFilter === filter.value ? "default" : "outline"}
                        size="sm"
                        className={cn(
                            "flex items-center gap-2 transition-all duration-300 flex-shrink-0",
                            activeFilter === filter.value
                                ? "text-white bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                : "bg-background text-foreground"
                        )}
                        onClick={() => onFilterChange(filter.value)}
                    >
                        <Icon className="h-4 w-4" />
                        <span>{filter.label}</span>
                        {isMounted && (
                            <span className={cn(
                                "ml-1 text-xs font-bold px-2 py-0.5 rounded-full",
                                activeFilter === filter.value
                                    ? "bg-white text-violet-700"
                                    : "bg-violet-200 dark:bg-violet-700 text-violet-600 dark:text-violet-300"
                            )}>
                                {counts[filter.value]}
                            </span>
                        )}
                    </Button>
                );
            })}
        </div>
    );
}