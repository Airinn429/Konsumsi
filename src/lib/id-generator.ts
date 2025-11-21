import { PrismaClient } from '@prisma/client';

const PREFIX_PADDING = 3;

type SupportedModel = 'order' | 'approver' | 'jenisKegiatan' | 'jenisKonsumsi' | 'lokasi';

type PrefixMap = Record<SupportedModel, string>;

const PREFIXES: PrefixMap = {
  order: 'ORD',
  approver: 'APR',
  jenisKegiatan: 'JKN',
  jenisKonsumsi: 'JKS',
  lokasi: 'LOKASI',
};

function resolveModelDelegate(prisma: PrismaClient, model: SupportedModel) {
  switch (model) {
    case 'order':
      return prisma.order;
    case 'approver':
      return prisma.approver;
    case 'jenisKegiatan':
      return prisma.jenisKegiatan;
    case 'jenisKonsumsi':
      return prisma.jenisKonsumsi;
    case 'lokasi':
      return prisma.lokasi;
    default:
      throw new Error(`Unsupported model for ID generation: ${model}`);
  }
}

export async function generatePrefixedId(
  prisma: PrismaClient,
  model: SupportedModel,
) {
  const prefix = PREFIXES[model];
  const delegate = resolveModelDelegate(prisma, model) as {
    findFirst: (args: unknown) => Promise<{ id: string } | null>;
  };

  const lastRecord = await delegate.findFirst({
    where: {
      id: {
        startsWith: `${prefix}-`,
      },
    },
    orderBy: {
      id: 'desc',
    },
    select: {
      id: true,
    },
  });

  let nextNumber = 1;
  if (lastRecord?.id) {
    const parts = lastRecord.id.split('-');
    const numberPart = parts[parts.length - 1];
    const parsed = parseInt(numberPart, 10);
    if (!Number.isNaN(parsed)) {
      nextNumber = parsed + 1;
    }
  }

  const padded = String(nextNumber).padStart(PREFIX_PADDING, '0');
  return `${prefix}-${padded}`;
}
