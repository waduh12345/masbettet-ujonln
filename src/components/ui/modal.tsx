import * as React from "react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <Button variant="outline" onClick={onClose} className="text-red-600">
            X
          </Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};