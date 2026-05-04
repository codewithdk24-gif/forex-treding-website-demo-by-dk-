import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id') || 'U12345';

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Fallback if user doesn't exist yet in DB
      return NextResponse.json({
        success: true,
        data: {
          id: userId,
          name: 'Institutional Trader',
          balance: 289341.15,
          tier: 'VIP'
        }
      });
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, balance } = await request.json();
    
    const { data, error } = await supabase
      .from('users')
      .update({ balance })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
