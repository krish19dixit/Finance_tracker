import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import UserSetting from '@/models/UserSetting';

export async function GET() {
  try {
    await connectToDatabase();
    // For a single-user app, we can use a fixed userId or find the first one
    const settings = await UserSetting.findOne({ userId: 'default_user' });
    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await UserSetting.create({
        userId: 'default_user',
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
      });
      return NextResponse.json({ success: true, data: defaultSettings });
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    console.error('Settings GET error:', error);
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

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const settings = await UserSetting.findOneAndUpdate(
      { userId: 'default_user' },
      body,
      { new: true, upsert: true, runValidators: true }
    );
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    console.error('Settings PUT error:', error);
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
