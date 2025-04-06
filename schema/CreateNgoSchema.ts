import { FaceIcon } from "@radix-ui/react-icons";
import { z } from "zod";

export const CreateNgoSchema = z.object({
  name: z.string(),
  address: z.coerce.date(),
  city: z.string(),
  province: z.string(),
  postalcode: z.string(),
  country:z.string(),
  phone:z.coerce.number().positive(),
  website: z.string(),
  linkedinURL: z.string().optional(),
  facebookURL: z.string().optional(),
  twitterURL: z.string().optional(),
  photo:z.string(),
  mession:z.string(),
  description: z.string().optional(),

});
export type CreateCreateNgoSchemaType=z.infer<typeof CreateNgoSchema>