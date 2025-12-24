import { patchDocument, PatchType, TextRun, type IPatch } from 'docx';

export const patchDoc = async (template: string, tags: Record<string, string>) => {
  try {
    const data = Buffer.from(template, 'base64');

    const patches = Object.fromEntries(
      Object.entries(tags).map(([tag, text]) => {
        const patch: IPatch = {
          type: PatchType.PARAGRAPH,
          children: [new TextRun(text)],
        };
        return [tag, patch];
      })
    );

    const doc = await patchDocument({
      outputType: 'nodebuffer',
      data,
      patches,
    });

    console.log('Document patched successfully.');
    return doc;
  } catch (error) {
    console.error('Failed to patch document:', error);
  }
};
