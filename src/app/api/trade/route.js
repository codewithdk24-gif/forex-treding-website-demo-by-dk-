import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Mapping frontend trade object to DB schema
    const tradeData = {
      user_id: body.user_id || 'U12345',
      symbol: body.symbol,
      type: body.type,
      entry_price: body.entry,
      size: body.size,
      tp: body.tp,
      sl: body.sl,
      status: body.status || 'ACTIVE'
    };

    const { data, error } = await supabase
      .from('trades')
      .insert([tradeData])
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data: {
        ...body,
        id: data.id, // Use real DB ID
        time: data.created_at
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('trades')
      .update({ 
        status: 'CLOSED', 
        close_price: body.closePrice, 
        pnl: body.pnl,
        closed_at: new Date().toISOString()
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        closeTime: data.closed_at
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'U12345';

  try {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data.map(t => ({
        id: t.id,
        symbol: t.symbol,
        type: t.type,
        entry: t.entry_price,
        size: t.size,
        tp: t.tp,
        sl: t.sl,
        pl: t.pnl,
        status: t.status,
        time: t.created_at,
        closePrice: t.close_price,
        closeTime: t.closed_at
      }))
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
