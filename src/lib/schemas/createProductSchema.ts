import { z } from 'zod';

// const fileSchema = z
//   .instanceof(File)
//   .refine((file) => file.size > 0, {
//     message: 'A file must be uploaded'
//   })
//   .transform((file) => ({
//     ...file,
//     preview: URL.createObjectURL(file)
//   }));
const fileSchema = z.object({
  preview: z.string().url(),
  lastModified: z.number(),
  name: z.string(),
  webkitRelativePath: z.string(),
  size: z.number().min(1, 'File size must be greater than 0'),
  type: z.string(),
  arrayBuffer: z
    .function()
    .args()
    .returns(z.promise(z.instanceof(ArrayBuffer))),
  slice: z
    .function()
    .args(z.number().optional(), z.number().optional(), z.string().optional())
    .returns(z.instanceof(Blob)),
  stream: z.function().args().returns(z.instanceof(ReadableStream)),
  text: z.function().args().returns(z.promise(z.string()))
});

export const createProductSchema = z
  .object({
    name: z.string({ required_error: 'Name of product is required' }),
    description: z
      .string({ required_error: 'Description is required' })
      .min(10, {
        message: 'Description must be at least 10 characters'
      }),
    price: z.coerce
      .number({ required_error: 'Price is required' })
      .min(100, 'Price must be at least $1.00'),
    type: z.string({ required_error: 'Type is required' }),
    brand: z.string({ required_error: 'Brand is required' }),
    quantityInStock: z.coerce
      .number({ required_error: 'Quantity is required' })
      .min(1, 'Quantity must be at least 1'),
    pictureUrl: z.string().optional(),
    file: fileSchema.optional()
  })
  .refine((data) => data.file || data.pictureUrl, {
    message: 'Either a file or pictureUrl must be provided',
    path: ['file']
  });

export type CreateProductSchema = z.infer<typeof createProductSchema>;
