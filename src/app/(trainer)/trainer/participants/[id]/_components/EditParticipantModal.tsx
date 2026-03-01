"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Pencil, Save, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Props {
  id: string;
}

export function EditParticipantModal({ id }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const queryClient = useQueryClient();
  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken ?? "";

  // ✅ GET SINGLE PARTICIPANT
  const { data: singleParticipantData } = useQuery({
    queryKey: ["single-participant", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/trainer/participant/${id}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!res.ok) throw new Error("Failed to fetch participant details");
      return res.json();
    },
    enabled: !!id,
  });

  // ✅ Default value set from API
  useEffect(() => {
    const participant = singleParticipantData?.data;
    if (participant) {
      setFormData({
        fullName: participant.name || "",
        email: participant.email || "",
        phone: participant.phone || "",
        password: "",
        role: participant.role || "PARTICIPANT",
      });
    }
  }, [singleParticipantData]);

  // ✅ UPDATE MUTATION
  const editUpdateParticipant = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/trainer/update-participant`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`
           },
          body: JSON.stringify({
            participantId: id,
            name: formData.fullName,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update participant");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      setIsOpen(false);
      toast.success("Participant updated successfully!");
    },

    onError: () => {
      toast.error("Failed to update participant. Please try again.");
    }
  });

  // ✅ Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editUpdateParticipant.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-gray-100 hover:bg-gray-200 rounded-[8px] text-gray-600 border border-gray-200"
        >
          <Pencil size={14} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] p-0 gap-0 !rounded-2xl border-0 shadow-2xl [&>button]:hidden bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-6 pb-0">
            <div className="flex items-start justify-between">
              <DialogTitle className="text-xl font-bold text-gray-800">
                Edit Participant
              </DialogTitle>
              <DialogClose asChild>
                <button
                  type="button"
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
                >
                  <X size={14} />
                </button>
              </DialogClose>
            </div>
            <DialogDescription className="text-[14px] text-[#00253E] my-2 leading-relaxed">
              Update the participant details below and click Save to apply changes.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pt-4 pb-6 flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-gray-700">Full Name</Label>
              <Input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="h-11 !rounded-[8px] border-[#00253E] text-sm focus-visible:ring-[#6abf4b] focus-visible:border-[#6abf4b]"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-gray-700">Email Address</Label>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-11 !rounded-[8px] border-[#00253E] text-sm focus-visible:ring-[#6abf4b] focus-visible:border-[#6abf4b]"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="h-11 !rounded-[8px] border-[#00253E] text-sm focus-visible:ring-[#6abf4b] focus-visible:border-[#6abf4b]"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="h-11 !rounded-[8px] border-[#00253E] text-sm pr-10 focus-visible:ring-[#6abf4b] focus-visible:border-[#6abf4b]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-gray-700">Role</Label>
              <Input
                disabled
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="h-11 !rounded-[8px] border-[#00253E] text-sm focus-visible:ring-[#6abf4b] focus-visible:border-[#6abf4b]"
              />
            </div>

            <DialogFooter className="flex items-center gap-3 mt-1 sm:justify-start">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11 rounded-lg border-gray-200 text-gray-600 font-medium"
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                disabled={editUpdateParticipant.isPending}
                className="flex-1 h-11 !rounded-[8px] bg-[#6abf4b] hover:bg-[#59a83c] text-black font-semibold"
              >
                <Save size={16} />
                {editUpdateParticipant.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}