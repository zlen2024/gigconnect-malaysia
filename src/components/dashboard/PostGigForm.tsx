import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { uploadFile } from "@/lib/upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "Design",
  "Tutoring",
  "Tech",
  "Writing",
  "Delivery",
  "Manual Labor",
  "Other"
];

interface PostGigFormProps {
  onSuccess?: () => void;
}

export function PostGigForm({ onSuccess }: PostGigFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    delivery_time: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to post a gig.",
      });
      setLoading(false);
      return;
    }

    let imageUrl = null;
    if (imageFile) {
      try {
        imageUrl = await uploadFile(imageFile, "gig-images");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error uploading image",
          description: "Failed to upload image.",
        });
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase
      .from("gigs")
      .insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        delivery_time: parseInt(formData.delivery_time),
        images: imageUrl ? [imageUrl] : null,
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error posting gig",
        description: error.message,
      });
    } else {
      toast({
        title: "Success!",
        description: "Your gig has been posted.",
      });
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        delivery_time: "",
      });
      setImageFile(null);
      if (onSuccess) onSuccess();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold">Post a Gig</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Gig</DialogTitle>
          <DialogDescription>
            Offer your services to the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Gig Title</Label>
            <Input
              id="title"
              placeholder="I will design your logo..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(val) => setFormData({ ...formData, category: val })} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Gig Image (Optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (RM)</Label>
              <Input
                id="price"
                type="number"
                placeholder="50"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery">Delivery (Days)</Label>
              <Input
                id="delivery"
                type="number"
                placeholder="3"
                value={formData.delivery_time}
                onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what you will provide..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Publish Gig"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
