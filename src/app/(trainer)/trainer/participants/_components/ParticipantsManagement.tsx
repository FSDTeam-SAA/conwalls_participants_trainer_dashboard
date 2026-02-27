"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { AddParticipantsModal } from "./AddParticipantsModal";
import { EditParticipantModal } from "../[id]/_components/EditParticipantModal";
import { DeleteParticipantsModal } from "./DeleteParticipantsModal";
import Link from "next/link";

interface Participant {
  id: number;
  username: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

const dummyParticipants: Participant[] = [
  {
    id: 1,
    username: "Darrell Steward",
    email: "redaniel@gmail.com",
    role: "Participants",
    status: "Active",
  },
  {
    id: 2,
    username: "Cody Fisher",
    email: "cody.fisher@example.com",
    role: "Participants",
    status: "Active",
  },
  {
    id: 3,
    username: "Jenny Wilson",
    email: "jenny.wilson@example.com",
    role: "Participants",
    status: "Active",
  },
  {
    id: 4,
    username: "Floyd Miles",
    email: "floyd.miles@example.com",
    role: "Participants",
    status: "Inactive",
  },
  {
    id: 5,
    username: "Esther Howard",
    email: "esther.howard@example.com",
    role: "Participants",
    status: "Active",
  },
  {
    id: 6,
    username: "Cameron Williamson",
    email: "cameron.w@example.com",
    role: "Participants",
    status: "Active",
  },
  {
    id: 7,
    username: "Brooklyn Simmons",
    email: "brooklyn.s@example.com",
    role: "Participants",
    status: "Active",
  },
  {
    id: 8,
    username: "Leslie Alexander",
    email: "leslie.a@example.com",
    role: "Participants",
    status: "Inactive",
  },
  {
    id: 9,
    username: "Robert Fox",
    email: "robert.fox@example.com",
    role: "Participants",
    status: "Active",
  },
  {
    id: 10,
    username: "Savannah Nguyen",
    email: "savannah.n@example.com",
    role: "Participants",
    status: "Active",
  },
];

const ITEMS_PER_PAGE = 8;

export default function ParticipantsManagement() {
  const [participants] = useState<Participant[]>(dummyParticipants);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(participants.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentParticipants = participants.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-3 font-sans">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Participants Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Dashboard <span className="text-gray-400">&gt;</span>{" "}
            <span className="text-gray-600 font-medium">
              Participants Management
            </span>
          </p>
        </div>

        {/* <Button className="bg-[#BADA55] hover:bg-[#BADA55]/90 text-[#00253E] font-semibold px-5 h-[56px] flex items-center gap-2 shadow-sm rounded-[8px]">
          <Plus size={18} />
          Add New Participants
        </Button> */}
        <AddParticipantsModal />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f0f7e6] hover:bg-[#f0f7e6] border-none">
              <TableHead className="text-gray-600 font-semibold py-4 px-6 w-[220px]">
                User name
              </TableHead>
              <TableHead className="text-gray-600 font-semibold py-4 px-6">
                Email
              </TableHead>
              <TableHead className="text-gray-600 font-semibold py-4 px-6 text-center">
                Role
              </TableHead>
              <TableHead className="text-gray-600 font-semibold py-4 px-6 text-center">
                Status
              </TableHead>
              <TableHead className="text-gray-600 font-semibold py-4 px-6 text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentParticipants.map((participant) => (
              <TableRow
                key={participant.id}
                className="border-b border-gray-100 hover:bg-[#fafdf7] transition-colors"
              >
                {/* Username */}
                <TableCell className="py-4 px-6 font-medium text-gray-800">
                  {participant.username}
                </TableCell>

                {/* Email */}
                <TableCell className="py-4 px-6 text-gray-500 text-sm">
                  {participant.email}
                </TableCell>

                {/* Role Badge */}
                <TableCell className="py-4 px-6 text-center">
                  <Badge
                    variant="outline"
                    className="border-[#00253E] text-[#3a7d1e] bg-transparent rounded-full px-4 py-0.5 font-medium text-xs"
                  >
                    {participant.role}
                  </Badge>
                </TableCell>

                {/* Status Badge */}
                <TableCell className="py-4 px-6 text-center">
                  <Badge
                    className={`rounded-full px-4 py-0.5 font-medium text-xs border-0 ${
                      participant.status === "Active"
                        ? "bg-[#00AC00] text-white hover:bg-[#00AC00]/90"
                        : "bg-gray-200 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {participant.status}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    {/* View Projects Button */}
                    <Link href={`/trainer/darrell-steward`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-[#edf7e4] hover:bg-[#d4f0be] text-[#3a7d1e] font-medium text-xs rounded-md px-3 py-1.5 h-auto flex items-center gap-1.5"
                      >
                        <Eye size={13} />
                        View Projects
                      </Button>
                    </Link>

                    {/* Edit Button */}
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600"
                    >
                      <Pencil size={14} />
                    </Button> */}
                    <EditParticipantModal />

                    {/* Delete Button */}
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(participant.id)}
                      className="h-8 w-8 bg-red-100 hover:bg-red-200 rounded-md text-red-500"
                    >
                      <Trash2 size={14} />
                    </Button> */}
                    <DeleteParticipantsModal id={participant.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Table Footer — Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#fafdf7] border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {startIdx + 1} to{" "}
            {Math.min(startIdx + ITEMS_PER_PAGE, participants.length)} of{" "}
            {participants.length} results
          </p>

          <div className="flex items-center gap-1.5">
            {/* Prev */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 border-gray-200 text-gray-500 hover:border-[#6abf4b] hover:text-[#3a7d1e] disabled:opacity-40 rounded-md"
            >
              <ChevronLeft size={15} />
            </Button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 rounded-md font-medium text-sm border ${
                  currentPage === page
                    ? "bg-[#6abf4b] text-white border-[#6abf4b] hover:bg-[#59a83c]"
                    : "border-gray-200 text-gray-600 hover:border-[#6abf4b] hover:text-[#3a7d1e]"
                }`}
              >
                {page}
              </Button>
            ))}

            {/* Next */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-9 w-9 border-gray-200 text-gray-500 hover:border-[#6abf4b] hover:text-[#3a7d1e] disabled:opacity-40 rounded-md"
            >
              <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
