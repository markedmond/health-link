/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { HeartPulse, Search, Plus, Minus, AlertTriangle, AlertCircle, RefreshCw, BarChart2 } from "lucide-react";
import { MedicineStock, User } from "../types";

interface MedicineInventoryProps {
  currentUser: User;
  medicines: MedicineStock[];
  onUpdateStock: (id: string, newQty: number) => void;
  onAddStockLog: (desc: string) => void;
}

export default function MedicineInventory({
  currentUser,
  medicines,
  onUpdateStock,
  onAddStockLog
}: MedicineInventoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [adjustQtyInput, setAdjustQtyInput] = useState<Record<string, string>>({});
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("All");

  // Search filter
  const filteredMedicines = medicines.filter((m) => {
    const s_lower = searchTerm.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(s_lower) || m.category.toLowerCase().includes(s_lower);
    const matchCategory = activeCategoryFilter === "All" || m.category === activeCategoryFilter;
    return matchSearch && matchCategory;
  });

  const handleAdjustStock = (medId: string, action: "add" | "deduct") => {
    const amountStr = adjustQtyInput[medId];
    const amount = parseInt(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("Please provide a correct integer quantity to adjust inventory.");
      return;
    }

    const currentMed = medicines.find(m => m.medicine_id === medId);
    if (!currentMed) return;

    let newQty = currentMed.current_stock;
    if (action === "add") {
      newQty += amount;
      onAddStockLog(`Replenished +${amount} ${currentMed.unit} of ${currentMed.name} ${currentMed.dosage}`);
    } else {
      if (newQty < amount) {
        alert("Action rejected: deduction exceeding available pharmacy stock is disabled.");
        return;
      }
      newQty -= amount;
      onAddStockLog(`Dispensed -${amount} ${currentMed.unit} of ${currentMed.name} ${currentMed.dosage} to patient`);
    }

    onUpdateStock(medId, newQty);
    setAdjustQtyInput({
      ...adjustQtyInput,
      [medId]: ""
    });
  };

  return (
    <div className="space-y-5 max-h-full overflow-y-auto pb-8 pr-1" id="inventory_view">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-[#E2E8F0] rounded-xl shadow-xs mt-1">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-[#1E293B] tracking-tight font-sans">Barangay Pharmacy Stockpile</h2>
          <p className="text-xs text-slate-500 font-medium font-sans">Track and adjust daily stocks of pediatric drops, tablets, and nebulizers</p>
        </div>
        
        <div className="text-xs font-bold bg-amber-50 text-amber-700 px-3 py-2 rounded-lg border border-amber-200 flex items-center gap-1.5 font-sans">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>Low Stocks: {medicines.filter(m => m.current_stock <= m.minimum_threshold).length} items require replenishment</span>
        </div>
      </div>

      {/* Searching Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="inventory_filters">
        <div className="md:col-span-3 relative flex items-center">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none z-10 shrink-0">
            <Search className="h-[18px] w-[18px] min-w-[18px] min-h-[18px]" />
          </span>
          <input
            type="text"
            placeholder="Search matching items list (e.g. Amlodipine, Losartan, Cefuroxime syrup)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-slate-800 border border-[#E2E8F0] rounded-xl pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] transition-all shadow-xs placeholder-slate-400 font-sans"
            style={{ paddingLeft: "2.75rem" }}
          />
        </div>

        <div>
          <select
            value={activeCategoryFilter}
            onChange={(e) => setActiveCategoryFilter(e.target.value)}
            className="w-full bg-white text-slate-800 border border-[#E2E8F0] rounded-xl px-3 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] cursor-pointer shadow-xs font-sans font-bold"
          >
            <option value="All">All Categories</option>
            <option value="Cardiovascular">Cardiovascular</option>
            <option value="Antidiabetic">Antidiabetic</option>
            <option value="Vitamins">Vitamins</option>
            <option value="Antibiotic">Antibiotic</option>
            <option value="Respiratory">Respiratory</option>
          </select>
        </div>
      </div>

      {/* Grid items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="medicines_stock_grid">
        {filteredMedicines.map((med) => {
          const isLow = med.current_stock <= med.minimum_threshold;
          return (
            <div 
              key={med.medicine_id} 
              className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all shadow-xs hover:shadow-sm ${
                isLow 
                  ? "bg-red-50/40 hover:bg-red-50/70 border-red-200" 
                  : "bg-white hover:bg-slate-50/60 border-[#E2E8F0]"
              }`}
              id={`med_card_${med.medicine_id}`}
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-[#0B7886] font-bold tracking-wider block font-sans">
                      {med.category}
                    </span>
                    <h4 className="text-sm font-bold text-[#1E293B] font-sans mt-0.5">{med.name}</h4>
                    <span className="text-xs text-slate-550 font-medium font-sans leading-none">{med.dosage}</span>
                  </div>
 
                   {isLow && (
                    <span className="p-1 px-2.5 rounded bg-red-100 border border-red-200 text-[#C53030] text-[9px] font-bold flex items-center gap-1 font-sans">
                      <AlertTriangle className="h-3 w-3 text-[#C53030]" />
                      <span>Low stock</span>
                    </span>
                  )}
                </div>
 
                 <div className="bg-slate-50 border border-[#E2E8F0] p-3 rounded-lg flex justify-between items-center text-xs">
                  <span className="text-slate-550 font-bold font-sans">Current stockpile:</span>
                  <span className={`font-mono font-bold text-sm ${isLow ? "text-[#C53030]" : "text-slate-800"}`}>
                    {med.current_stock} <span className="text-[10px] tracking-normal font-sans font-medium text-slate-500">{med.unit}</span>
                  </span>
                </div>
              </div>
 
               {/* Adjust Stock Panel */}
              <div className="pt-3 border-t border-[#E2E8F0] flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Qty"
                  value={adjustQtyInput[med.medicine_id] || ""}
                  onChange={(e) => setAdjustQtyInput({
                    ...adjustQtyInput,
                    [med.medicine_id]: e.target.value
                  })}
                  className="w-16 bg-white border border-[#E2E8F0] rounded-lg p-2 text-center text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886]"
                />
                <button
                  onClick={() => handleAdjustStock(med.medicine_id, "add")}
                  className="flex-1 py-2 bg-[#0B7886]/10 hover:bg-[#0B7886] text-[#0B7886] hover:text-white rounded-lg text-[10px] font-bold transition-all shrink-0 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 shrink-0" />
                  <span>Add</span>
                </button>
                <button
                  onClick={() => handleAdjustStock(med.medicine_id, "deduct")}
                  className="flex-1 py-2 bg-red-50 hover:bg-[#C53030] text-[#C53030] hover:text-white rounded-lg text-[10px] font-bold transition-all shrink-0 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5 shrink-0" />
                  <span>Deduct</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
