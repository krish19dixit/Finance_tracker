import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET() {
  await connectToDatabase();

  try {
    const transactions = await Transaction.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: transactions });
  } catch (error: any) {
    console.error('Transactions GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const transaction = await Transaction.create(body);
    return NextResponse.json({ success: true, data: transaction });
  } catch (error: any) {
    console.error('Transactions POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      },
      { status: 500 },
    );
  }
}