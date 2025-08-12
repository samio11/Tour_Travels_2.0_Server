import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUploaded } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUploaded,
  params: {
    public_id: (req, file) => {
      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-") // empty space remove replace with dash
        .replace(/\./g, "-")
        // eslint-disable-next-line no-useless-escape
        .replace(/[^a-z0-9\-\.]/g, ""); // non alpha numeric - !@#$

      const extension = file.originalname.split(".").pop();
      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileName +
        "-" +
        extension;
      return uniqueFileName;
    },
  },
});

export const multerUpload = multer({ storage: storage });
