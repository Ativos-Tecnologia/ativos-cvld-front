"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react'

type FilterCondition = "equals" | "contains" | "startsWith" | "endsWith"

interface Filter {
  id: string
  column: string
  condition: FilterCondition
  value: string
}

interface AdvancedFilterProps {
  columns: { key: string; label: string }[]
  onFilterChange: (filters: Filter[]) => void
}

export function AdvancedFilter({ columns, onFilterChange }: AdvancedFilterProps) {
  const [filters, setFilters] = useState<Filter[]>([])
  const [open, setOpen] = useState(false)

  const addFilter = () => {
    const newFilter: Filter = {
      id: Math.random().toString(36).substr(2, 9),
      column: columns[0].key,
      condition: "equals",
      value: "",
    }
    setFilters([...filters, newFilter])
  }

  const removeFilter = (id: string) => {
    setFilters(filters.filter((f) => f.id !== id))
  }

  const updateFilter = (id: string, updates: Partial<Filter>) => {
    setFilters(
      filters.map((f) => (f.id === id ? { ...f, ...updates } : f))
    )
  }

  const applyFilters = () => {
    onFilterChange(filters)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          Filters
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Add a filter..." />
          <CommandEmpty>No filters found.</CommandEmpty>
          <CommandGroup>
            {filters.map((filter) => (
              <div key={filter.id} className="flex items-center p-2">
                <select
                  value={filter.column}
                  onChange={(e) => updateFilter(filter.id, { column: e.target.value })}
                  className="w-1/3 p-1 text-sm"
                >
                  {columns.map((col) => (
                    <option key={col.key} value={col.key}>
                      {col.label}
                    </option>
                  ))}
                </select>
                <select
                  value={filter.condition}
                  onChange={(e) => updateFilter(filter.id, { condition: e.target.value as FilterCondition })}
                  className="w-1/3 p-1 text-sm"
                >
                  <option value="equals">Equals</option>
                  <option value="contains">Contains</option>
                  <option value="startsWith">Starts with</option>
                  <option value="endsWith">Ends with</option>
                </select>
                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                  className="w-1/3 p-1 text-sm"
                  placeholder="Value"
                />
                <Button variant="ghost" size="sm" onClick={() => removeFilter(filter.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <CommandItem onSelect={addFilter}>
              <Plus className="mr-2 h-4 w-4" />
              Add filter
            </CommandItem>
          </CommandGroup>
        </Command>
        <div className="flex justify-end p-2">
          <Button onClick={applyFilters}>Apply Filters</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

