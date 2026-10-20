import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';
const HEADERS = [
  'Order Date', 'Order #', 'Order ID', 'Email', 'Customer',
  'Financial Status', 'Fulfillment Status', 'Items', 'Currency',
  'Subtotal', 'Discounts', 'Tax', 'Total', 'Payment Method', 'Source'
];

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const order = body?.order;
    if (!order || typeof order !== 'object' || !order.id) {
      return Response.json({ error: 'Missing order payload' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const authHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    // One shared config record holds the sales spreadsheet; the first order
    // creates the spreadsheet ("Mazrood Orders") and remembers its ID.
    const svc = base44.asServiceRole.entities.OrderSyncConfig;
    const { items } = await svc.filter({}, { limit: 1 });
    let cfg = items?.[0] || null;
    let sheetId = cfg?.spreadsheet_id || null;
    let sheetUrl = cfg?.spreadsheet_url || '';

    if (!sheetId) {
      const createRes = await fetch(SHEETS_API, {
        method: 'POST',
        headers: authHeaders,
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          properties: { title: 'Mazrood Orders' },
          sheets: [{ properties: { title: 'Orders' } }]
        })
      });
      if (!createRes.ok) throw new Error(`Sheheets create failed (${createRes.status})`);
      const created = await createRes.json();
      sheetId = created.spreadsheetId;
      sheetUrl = created.spreadsheetUrl || '';
      const headerRes = await fetch(
        `${SHEETS_API}/${sheetId}/values/Orders!A1:O1?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: authHeaders,
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({ values: [HEADERS] })
        }
      );
      if (!headerRes.ok) throw new Error(`Header write failed (${headerRes.status})`);
      cfg = await svc.create({ spreadsheet_id: sheetId, spreadsheet_url: sheetUrl });
    }

    const lineItems = Array.isArray(order.line_items) ? order.line_items : [];
    const itemCount = lineItems.reduce((n, it) => n + (it.quantity || 1), 0);
    const customer = order.customer
      ? [order.customer.first_name, order.customer.last_name].filter(Boolean).join(' ')
      : '';
    const row = [
      order.created_at || order.processed_at || '',
      order.name || `#${order.order_number || order.id}`,
      String(order.id),
      order.email || '',
      customer,
      order.financial_status || '',
      order.fulfillment_status || '',
      itemCount,
      order.currency || order.presentment_currency || '',
      order.subtotal_price || order.current_subtotal_price || '',
      order.total_discounts || '',
      order.total_tax || '',
      order.total_price || order.current_total_price || '',
      (order.payment_gateway_names || []).join(', '),
      order.source_name || ''
    ];

    const appendRes = await fetch(
      `${SHEETS_API}/${sheetId}/values/Orders!A:O:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: authHeaders,
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({ values: [row] })
      }
    );
    if (!appendRes.ok) throw new Error(`Sheets append failed (${appendRes.status})`);

    return Response.json({
      ok: true,
      order: row[1],
      sheet: cfg?.spreadsheet_url || sheetUrl
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}