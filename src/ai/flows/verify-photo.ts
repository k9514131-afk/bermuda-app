'use server';
/**
 * @fileOverview فلو التحقق من حقيقة الصورة الشخصية للموظفين.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VerifyPhotoInputSchema = z.object({
  photoDataUri: z.string().describe("رابط الصورة بتنسيق Data URI ليتم فحصها."),
});

const VerifyPhotoOutputSchema = z.object({
  isRealPerson: z.boolean().describe("ما إذا كانت الصورة لشخص حقيقي في صورة فوتوغرافية."),
  reasoning: z.string().describe("سبب القرار (سواء كانت كرتون، أفاتار، أو صورة حقيقية)."),
});

export async function verifyPhoto(input: { photoDataUri: string }) {
  return verifyPhotoFlow(input);
}

const verifyPhotoFlow = ai.defineFlow(
  {
    name: 'verifyPhotoFlow',
    inputSchema: VerifyPhotoInputSchema,
    outputSchema: VerifyPhotoOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: [
        { text: "أنت خبير أمن فندقي. قم بتحليل هذه الصورة. حدد ما إذا كانت صورة فوتوغرافية حقيقية لإنسان (صورة ملف شخصي احترافية) أم أنها صورة كرتونية، أو أفاتار، أو رسم توضيحي، أو شخصية مولدة رقمياً. الموظفون يحتاجون فقط لصور حقيقية. أجب بـ true إذا كانت فوتوغرافية حقيقية، و false إذا كانت أي شيء آخر (كرتون، أفاتار، إلخ)." },
        { media: { url: input.photoDataUri } }
      ],
      output: { schema: VerifyPhotoOutputSchema }
    });

    return output!;
  }
);
