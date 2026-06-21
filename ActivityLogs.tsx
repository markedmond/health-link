/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, Clock, Search, Trash2, Eye } from "lucide-react";
import { AuditLog, User } from "../types";

interface ActivityLogsProps {
  currentUser: User;
  auditLogs: AuditLog[];
  onClearLogs?: () => void;
}

export default function ActivityLogs({
  currentUser,
  auditLogs,
  onClearLogs
}: ActivityLogsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = auditLogs.filter((log) => {
    const s_lower = searchTerm.toLowerCase();
    return (
      log.user_name.toLowerCase().includes(s_lower) ||
      log.action.toLowerCase().includes(s_lower) ||
      log.details.toLowerCase().includes(s_lower)
    );
  });

  return (
    <div className="space-y-6 max-h-full overflow-y-auto pb-8 pr-1" id="activity_view">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-4 border border-slate-850 rounded-xl mt-1">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-white tracking-tight">Security Audit Trail logs (RA 10173)</h2>
          <p className="text-xs text-slate-400">Strict chronological track of all patient file creations, updates, and accesses</p>
        </div>

        {currentUser.role === "Admin" && onClearLogs && (
          <button
            onClick={() => {
              if (confirm("Are you sure you want to purge the security audit log? Under local regulations, this trail should remain complete.")) {
                onClearLogs();
              }
            }}
            className="px-3.5 py-2 hover:bg-rose-500/10 border border-slate-705 text-rose-455 text-rose-400 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Archive Logs</span>
          </button>
        )}
      </div>

      {/* Searching Filters */}
      <div className="relative flex items-center">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none z-10 shrink-0">
          <Search className="h-[18px] w-[18px] min-w-[18px] min-h-[18px]" />
        </span>
        <input
          type="text"
          placeholder="Filter audit entries by nurse/doctor name, particular actions, or details..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800 text-slate-150 border border-slate-705 rounded-xl pr-4 py-2.5 text-xs focus:outline-none"
          style={{ paddingLeft: "2.75rem" }}
        />
      </div>

      {/* Logs stack */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-xl overflow-hidden shadow-xl" id="log_records_list">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-750 flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
          <span>Action Verification Logs</span>
          <span>Total: {filteredLogs.length}</span>
        </div>

        <div className="divide-y divide-slate-750">
          {filteredLogs.length === 0 ? (
            <p className="p-8 text-center text-slate-450 text-xs py-12 italic">No logs found match the filter parameters.</p>
          ) : (
            filteredLogs.map((log) => (
              <div 
                key={log.log_id} 
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-750/10 text-xs"
                id={`audit_row_${log.log_id}`}
              >
                <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-205 text-xs bg-slate-900 border border-slate-705 px-2 py-0.5 rounded font-mono">
                      {log.action}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-350">{log.user_name}</span>
                    <span className="text-[9px] uppercase font-bold text-teal-400 font-mono tracking-wide px-1.5 py-0.5 rounded bg-teal-500/5 border border-teal-500/10">
                      {log.user_role}
                    </span>
                  </div>
                  
                  <p className="text-slate-400 leading-normal font-mono font-medium text-[11px]">
                    "{log.details}"
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 shrink-0 text-right md:-mt-2">
                  <Clock className="h-3.5 w-3.5 text-slate-500 font-bold shrink-0" />
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
