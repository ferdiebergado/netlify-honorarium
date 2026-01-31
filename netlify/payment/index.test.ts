import { XMLParser } from 'fast-xml-parser';
import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';
import { generateCertification, type CertificationData } from '.';

describe('generateCertification (integration)', () => {
  const data: CertificationData = {
    payee: 'John Doe',
    role: 'Speaker',
    activity: 'Go Conference',
    venue: 'Manila',
    startDate: new Date('2024-01-01').toDateString(),
    endDate: new Date('2024-01-02').toDateString(),
    honorarium: 15000,
    taxRate: 10,
    focal: 'Jane Smith',
    position: 'Coordinator',
    activityCode: 'AC-2026-001',
  };

  async function extractDocumentXml(doc: Buffer): Promise<string> {
    const zip = await JSZip.loadAsync(doc);
    const xml = await zip.file('word/document.xml')?.async('text');

    if (!xml) {
      throw new Error('document.xml not found in docx');
    }

    return xml;
  }

  it('applies patches to the generated DOCX', async () => {
    const { doc, filename } = await generateCertification([data]);

    expect(filename).toBe('certification-AC-2026-001');
    expect(doc).toBeInstanceOf(Buffer);

    const xml = await extractDocumentXml(doc);

    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xml);

    const xmlString = JSON.stringify(parsed);

    expect(xmlString).toContain('JOHN DOE');
    expect(xmlString).toContain('Speaker');
    expect(xmlString).toContain('Go Conference');
    expect(xmlString).toContain('Manila');
    expect(xmlString).toContain('JANE SMITH');
    expect(xmlString).toContain('Coordinator');

    expect(xmlString).toMatch(/₱|PHP|15,000/);

    expect(xmlString).toMatch(/January|February|2024/);
  });

  it('merges multiple certifications into one document', async () => {
    const { doc } = await generateCertification([data, { ...data, payee: 'Alice Doe' }]);

    const xml = await extractDocumentXml(doc);

    expect(xml).toContain('JOHN DOE');
    expect(xml).toContain('ALICE DOE');
  });
});
