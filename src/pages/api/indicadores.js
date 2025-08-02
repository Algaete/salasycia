export async function GET() {
  try {
    console.log('Obteniendo indicadores económicos...');
    
    const response = await fetch('https://mindicador.cl/api');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extraer los indicadores más relevantes
    const indicadores = {
      uf: {
        nombre: 'Unidad de Fomento',
        valor: data.uf?.valor || 'N/A',
        fecha: data.uf?.fecha || 'N/A'
      },
      dolar: {
        nombre: 'Dólar',
        valor: data.dolar?.valor || 'N/A',
        fecha: data.dolar?.fecha || 'N/A'
      },
      euro: {
        nombre: 'Euro',
        valor: data.euro?.valor || 'N/A',
        fecha: data.euro?.fecha || 'N/A'
      },
      ipc: {
        nombre: 'IPC',
        valor: data.ipc?.valor || 'N/A',
        fecha: data.ipc?.fecha || 'N/A'
      },
      utm: {
        nombre: 'UTM',
        valor: data.utm?.valor || 'N/A',
        fecha: data.utm?.fecha || 'N/A'
      }
    };
    
    console.log('Indicadores obtenidos:', indicadores);
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: indicadores,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error obteniendo indicadores:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Error al obtener indicadores económicos',
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 