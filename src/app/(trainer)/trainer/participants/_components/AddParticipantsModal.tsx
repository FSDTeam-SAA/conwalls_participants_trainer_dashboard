import { useState } from "react";
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
import { Eye, EyeOff, Plus, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function AddParticipantsModal() {
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const session = useSession();
    const TOKEN = session?.data?.user?.accessToken ?? "";

  const addParticipantMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/trainer/connect-participant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: formData.role,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to add participant");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      setFormData({ fullName: "", email: "", phone: "", password: "", role: "" });
      setOpen(false);
    //   queryClient.invalidateQueries({ queryKey: ["participants",] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addParticipantMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button className="bg-[#BADA55] hover:bg-[#BADA55]/90 text-[#00253E] font-semibold px-5 h-[56px] flex items-center gap-2 shadow-sm rounded-[8px]">
            <Plus size={18} />
            Add New Participants
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px] p-0 gap-0 rounded-2xl border-0 shadow-2xl [&>button]:hidden bg-white">
          <DialogHeader className="px-6 pt-6 pb-0">
            <div className="flex items-start justify-between">
              <DialogTitle className="text-xl font-bold text-gray-800">
                Add New Participants
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
            <DialogDescription className="text-xs text-gray-400 mt-1 leading-relaxed">
              Want to delete this Revenue, remember if you delete this it not
              show again in your dashboard.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pt-4 pb-6 flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Butlar Mane"
                className="h-11 rounded-lg border-gray-200 text-sm placeholder:text-gray-400 focus-visible:ring-[#6abf4b] focus-visible:border-[#6abf4b]"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Butlar@email.com"
                className="h-11 rounded-lg border-gray-200 text-sm placeholder:text-gray-400 focus-visible:ring-[#6abf4b] focus-visible:border-[#6abf4b]"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Phone Number{" "}
                <span className="text-gray-400 font-normal">( Optional )</span>
              </Label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+997 9384u35803"
                className="h-11 rounded-lg border-gray-200 text-sm placeholder:text-gray-400 focus-visible:ring-[#6abf4b] focus-visible:border-[#6abf4b]"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="h-11 rounded-lg border-gray-200 text-sm pr-10 placeholder:text-gray-400 focus-visible:ring-[#6abf4b] focus-visible:border-[#6abf4b]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-gray-700">Role</Label>
              <Input
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Participants"
                className="h-11 rounded-lg border-gray-200 text-sm placeholder:text-gray-400 focus-visible:ring-[#6abf4b] focus-visible:border-[#6abf4b]"
              />
            </div>

            <DialogFooter className="flex items-center gap-3 mt-1 sm:justify-start">
              {/* Cancel */}
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11 rounded-lg border-gray-200 text-gray-600 font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                    <X size={11} className="text-gray-500" />
                  </span>
                  Cancel
                </Button>
              </DialogClose>

              {/* Add */}
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={addParticipantMutation.isPending}
                className="flex-1 h-11 rounded-lg bg-[#6abf4b] hover:bg-[#59a83c] text-white font-semibold flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                {addParticipantMutation.isPending ? "Adding..." : "Add"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}