import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RoomModal = ({ isOpen, onClose, isEdit, roomData, onSubmit }) => {
  const [name, setName] = useState(roomData?.name || "");
  const [type, setType] = useState(roomData?.type || "living");
  const [image, setImage] = useState(roomData?.image || "");
  const [floor, setFloor] = useState(roomData?.floor || 1);

  const roomTypes = [
    { id: "living", label: "Living Room", icon: "ri-sofa-line" },
    { id: "bedroom", label: "Bedroom", icon: "ri-hotel-bed-line" },
    { id: "kitchen", label: "Kitchen", icon: "ri-fridge-line" },
    { id: "bathroom", label: "Bathroom", icon: "ri-shower-room-line" },
    { id: "office", label: "Office", icon: "ri-computer-line" },
    { id: "hallway", label: "Hallway", icon: "ri-door-line" },
    { id: "garage", label: "Garage", icon: "ri-car-line" },
    { id: "outdoor", label: "Outdoor", icon: "ri-plant-line" },
    { id: "other", label: "Other", icon: "ri-home-line" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: roomData?.id,
      name,
      type,
      image,
      floor: parseInt(floor),
      createdAt: roomData?.createdAt || new Date().toISOString(),
    });
    onClose(); // Close modal after submit
  };

  // Reset state when modal opens/closes or roomData changes
  React.useEffect(() => {
    setName(roomData?.name || "");
    setType(roomData?.type || "living");
    setImage(roomData?.image || "");
    setFloor(roomData?.floor || 1);
  }, [isOpen, roomData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1e1e2e] text-white border border-gray-800">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Room" : "Add New Room"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 bg-[#121218] border-gray-700 focus:ring-2 focus:ring-[#2563eb]"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <div className="col-span-3 grid grid-cols-3 gap-2">
                {roomTypes.map((roomType) => (
                  <div
                    key={roomType.id}
                    className={`flex flex-col items-center p-3 border rounded-md cursor-pointer transition-colors ${
                      type === roomType.id
                        ? "bg-[#2563eb]/10 border-[#2563eb]"
                        : "border-gray-700 hover:bg-gray-800"
                    }`}
                    onClick={() => setType(roomType.id)}
                  >
                    <i
                      className={`${roomType.icon} text-xl mb-2 ${
                        type === roomType.id
                          ? "text-[#2563eb]"
                          : "text-gray-400"
                      }`}
                    ></i>
                    <span
                      className={`text-xs ${
                        type === roomType.id ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {roomType.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/room-image.jpg"
                className="col-span-3 bg-[#121218] border-gray-700 focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="floor" className="text-right">
                Floor
              </Label>
              <Select
                value={floor.toString()}
                onValueChange={(value) => setFloor(parseInt(value))}
              >
                <SelectTrigger className="col-span-3 bg-[#121218] border-gray-700 focus:ring-2 focus:ring-[#2563eb]">
                  <SelectValue placeholder="Select a floor" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e2e] border-gray-700">
                  <SelectItem value="-1">Basement</SelectItem>
                  <SelectItem value="0">Ground Floor</SelectItem>
                  <SelectItem value="1">First Floor</SelectItem>
                  <SelectItem value="2">Second Floor</SelectItem>
                  <SelectItem value="3">Third Floor</SelectItem>
                  <SelectItem value="4">Fourth Floor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name}
              className="bg-[#2563eb] hover:bg-[#1e40af]"
            >
              {isEdit ? "Update Room" : "Add Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomModal;
