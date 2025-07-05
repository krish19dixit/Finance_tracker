import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const transaction = await Transaction.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!transaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" });
    }
    return NextResponse.json({ success: true, data: transaction });
  } catch (error: any) {
    console.error('Transactions DELETE error:', error);
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const deletedTransaction = await Transaction.deleteOne({ _id: params.id });
    if (!deletedTransaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error('Transactions PUT error:', error);
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