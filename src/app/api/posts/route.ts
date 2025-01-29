import { NextRequest } from "next/server";
import { IncomingForm } from "formidable";
import cloudinary from "@/lib/cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

export function POST(req: NextRequest) {
  const form = new IncomingForm();
}
