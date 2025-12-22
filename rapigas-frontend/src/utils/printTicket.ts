export const printTicket = (venta: any) => {
    // Configura el tamaño para impresora térmica (58mm o 80mm)
    const ventana = window.open('', 'PRINT', 'height=600,width=400');

    if (ventana) {
        ventana.document.write(`
            <html>
            <head>
                <style>
                    body { font-family: 'Courier New', monospace; font-size: 12px; width: 100%; margin: 0; padding: 10px; }
                    .header { text-align: center; margin-bottom: 10px; }
                    .line { border-bottom: 1px dashed black; margin: 5px 0; }
                    .total { font-size: 16px; font-weight: bold; text-align: right; margin-top: 10px; }
                    .footer { text-align: center; margin-top: 20px; font-size: 10px; }
                    table { width: 100%; }
                    td.price { text-align: right; }
                </style>
            </head>
            <body>
                <div class="header">
                    <strong>RAPIGAS</strong><br>
                    RUC: 0999999999001<br>
                    Tel: 0987654321
                </div>
                <div>
                    Fecha: ${new Date(venta.fecha_venta).toLocaleString()}<br>
                    Cliente: ${venta.cliente ? venta.cliente.nombre : 'Consumidor Final'}
                </div>
                <div class="line"></div>
                <table>
                    ${venta.detalles.map((d: any) => `
                        <tr>
                            <td>${d.cantidad} x ${d.producto?.nombre}</td>
                            <td class="price">$${(d.cantidad * d.precio).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </table>
                <div class="line"></div>
                <div class="total">TOTAL: $${parseFloat(venta.total).toFixed(2)}</div>
                <div class="footer">
                    ¡Gracias por su compra!<br>
                    Guarde este ticket
                </div>
            </body>
            </html>
        `);

        ventana.document.close();
        ventana.focus();
        // Esperar un momento a que carguen estilos
        setTimeout(() => {
            ventana.print();
            ventana.close();
        }, 500);
    }
};