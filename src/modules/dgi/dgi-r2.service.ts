import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface StoreDocumentsInput {
  entrepriseId: string;
  factureId: string;
  year: string;
  xml: Buffer;
  pdf: Buffer;
}

export interface StoredDocumentKeys {
  xmlKey: string;
  pdfKey: string;
}

const PRESIGN_TTL = 3600; // 1 hour

@Injectable()
export class DGIR2Service {
  private readonly logger = new Logger(DGIR2Service.name);
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(private config: ConfigService) {
    const accountId = this.config.get<string>('R2_ACCOUNT_ID')!;
    const accessKeyId = this.config.get<string>('R2_ACCESS_KEY_ID')!;
    const secretAccessKey = this.config.get<string>('R2_SECRET_ACCESS_KEY')!;

    // Use dedicated invoices bucket if configured, otherwise fall back to the
    // existing bucket (OK for dev/testing — use a separate bucket in production
    // with R2 object lock for the 10-year legal retention requirement).
    this.bucket =
      this.config.get<string>('R2_DOCUMENTS_BUCKET_NAME') ??
      this.config.get<string>('R2_BUCKET_NAME') ??
      'sayerli-invoices';

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async store(input: StoreDocumentsInput): Promise<StoredDocumentKeys> {
    const prefix = `invoices/${input.entrepriseId}/${input.year}/${input.factureId}`;
    const xmlKey = `${prefix}/document.xml`;
    const pdfKey = `${prefix}/document.pdf`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: xmlKey,
        Body: input.xml,
        ContentType: 'application/xml',
        Metadata: {
          entrepriseId: input.entrepriseId,
          factureId: input.factureId,
          type: 'ubl-2.1',
        },
      }),
    );

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: pdfKey,
        Body: input.pdf,
        ContentType: 'application/pdf',
        Metadata: {
          entrepriseId: input.entrepriseId,
          factureId: input.factureId,
          type: 'invoice-pdf',
        },
      }),
    );

    this.logger.log(`Stored DGI documents: ${xmlKey}, ${pdfKey}`);
    return { xmlKey, pdfKey };
  }

  async presignedUrl(key: string): Promise<string> {
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.s3, cmd, { expiresIn: PRESIGN_TTL });
  }
}
