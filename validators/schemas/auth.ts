// {
//   "emails": {
//     "addresses": [
//       "user@example.com"
//     ]
//   },
//   "data": {
//     "subject": "string",
//     "html_content": "string"
//   }
// }

import { z } from "zod";

export const SendEmailSchema = z.object({
  emails: z.object({
    addresses: z.array(z.email()),
  }),
  data: z.object({
    subject: z.string(),
    html_content: z.string(),
  }),
});

export type SendEmailType = z.infer<typeof SendEmailSchema>;
