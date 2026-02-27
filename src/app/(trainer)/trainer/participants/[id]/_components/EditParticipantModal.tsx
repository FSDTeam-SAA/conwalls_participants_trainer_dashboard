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
import { Eye, EyeOff, Pencil, Save, X } from "lucide-react";

export function EditParticipantModal() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600"
          >
            <Pencil size={14} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px] p-0 gap-0 rounded-2xl border-0 shadow-2xl [&>button]:hidden bg-white">
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
            <DialogDescription className="text-xs text-gray-400 mt-1 leading-relaxed">
              Update the participant details below and click Save to apply
              changes.
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

              {/* Save */}
              <Button
                type="submit"
                className="flex-1 h-11 rounded-lg bg-[#6abf4b] hover:bg-[#59a83c] text-white font-semibold flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Save
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
