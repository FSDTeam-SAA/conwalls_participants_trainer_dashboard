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
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface Participant {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalData: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    items: Participant[];
    paginationInfo: PaginationInfo;
  };
}

const ITEMS_PER_PAGE = 8;

export default function ParticipantsManagement() {
  const [currentPage, setCurrentPage] = useState(1);

  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken ?? "";

  const { data: apiData, isLoading } = useQuery<ApiResponse>({
    queryKey: ["participants", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/trainer/participants?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );
      if (!res.ok) {
        throw new Error("Failed to fetch participants");
      }
      return res.json();
    },
  });

  const participants = apiData?.data?.items ?? [];
  const paginationInfo = apiData?.data?.paginationInfo;
  const totalPages = paginationInfo?.totalPages ?? 1;
  const totalData = paginationInfo?.totalData ?? 0;
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;

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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-gray-400 text-sm"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : participants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-gray-400 text-sm"
                >
                  No participants found.
                </TableCell>
              </TableRow>
            ) : (
              participants.map((participant) => (
                <TableRow
                  key={participant._id}
                  className="border-b border-gray-100 hover:bg-[#fafdf7] transition-colors"
                >
                  {/* Username */}
                  <TableCell className="py-4 px-6 font-medium text-gray-800">
                    {participant.name}
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
                      {participant.role === "PARTICIPANT"
                        ? "Participants"
                        : participant.role}
                    </Badge>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="py-4 px-6 text-center">
                    <Badge
                      className={`rounded-full px-4 py-0.5 font-medium text-xs border-0 ${
                        participant.isVerified
                          ? "bg-[#00AC00] text-white hover:bg-[#00AC00]/90"
                          : "bg-gray-200 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {participant.isVerified ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      {/* View Projects Button */}
                      <Link
                        href={`/trainer/darrell-steward/${participant._id}`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-[#edf7e4] hover:bg-[#d4f0be] text-[#3a7d1e] font-medium text-xs px-3 py-1.5 h-auto flex items-center gap-1.5 rounded-[8px] border-[#d4f0be]"
                        >
                          <Eye size={13} />
                          View Projects
                        </Button>
                      </Link>

                      <EditParticipantModal id={participant._id}/>

                      <DeleteParticipantsModal id={participant._id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Table Footer — Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#fafdf7] border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {totalData === 0 ? 0 : startIdx + 1} to{" "}
            {Math.min(startIdx + ITEMS_PER_PAGE, totalData)} of {totalData}{" "}
            results
          </p>

          <div className="flex items-center gap-1.5">
            {/* Prev */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1 || !paginationInfo?.hasPrevPage}
              className="h-9 w-9 border-[#00253E] text-[#00253E] hover:bg-[#BADA55] hover:text-[#00253E] disabled:opacity-40 rounded-md"
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
                className={`h-9 w-9 rounded-md font-medium text-sm border-[#00253E] ${
                  currentPage === page
                    ? "bg-[#BADA55] text-[#00253E]"
                    : "text-[#00253E] hover:bg-[#BADA55]"
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
              disabled={
                currentPage === totalPages || !paginationInfo?.hasNextPage
              }
              className="h-9 w-9 border-[#00253E] text-[#00253E] hover:bg-[#BADA55] hover:text-[#00253E] disabled:opacity-40 rounded-md"
            >
              <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
