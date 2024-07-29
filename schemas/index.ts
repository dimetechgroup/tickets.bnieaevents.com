import { z } from "zod";

export const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 3 characters long",
  }),
  email: z.string().email(),
  numberOfTickets: z
    .number({
      message: "Number of tickets required",
    })
    .int()
    .min(1, {
      message: "Number of tickets must be at least 1",
    })
    .refine((value) => value < 20, {
      message: "Number of tickets must be less than 20",
    }),

  chapter: z
    .string()
    .min(2, {
      message: "Chapter must be at least 3 characters long",
    })
    .optional(),
  currency: z
    .enum(["KES", "USD"])
    .refine((value) => ["KES", "USD"].includes(value), {
      message: "Select either KSH or USD",
      path: ["currency"],
    }),
});

export const GroupSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 3 characters long",
  }),

  first_name: z.string().min(2, {
    message: "Name must be at least 3 characters long",
  }),

  second_name: z.string().min(2, {
    message: "Name must be at least 3 characters long",
  }),

  third_name: z.string().min(2, {
    message: "Name must be at least 3 characters long",
  }),

  fourth_name: z.string().min(2, {
    message: "Name must be at least 3 characters long",
  }),

  fifth_name: z.string().min(2, {
    message: "Name must be at least 3 characters long",
  }),

  email: z.string().email(),
  numberOfTickets: z
    .number({
      message: "Number of tickets required",
    })
    .int()
    .min(1, {
      message: "Number of tickets must be at least 1",
    })
    .refine((value) => value < 20, {
      message: "Number of tickets must be less than 20",
    }),

  chapter: z
    .string()
    .min(2, {
      message: "Chapter must be at least 3 characters long",
    })
    .optional(),
  currency: z
    .enum(["KES", "USD"])
    .refine((value) => ["KES", "USD"].includes(value), {
      message: "Select either KSH or USD",
      path: ["currency"],
    }),
});
