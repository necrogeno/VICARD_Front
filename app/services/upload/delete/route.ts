// app/api/upload/delete/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: Request) {
  try {
    const { fotoUrl } = await request.json();

    if (!fotoUrl || fotoUrl === 'N/A') {
      return NextResponse.json({ message: 'No hay foto válida para eliminar.' }, { status: 200 });
    }

    // Obtener la ruta absoluta del archivo en el servidor
    // fotoUrl ejemplo: "/Fotos/sebastian-Acosta-Ortiz.jpeg"
    const filePath = path.join(process.cwd(), 'public', fotoUrl);

    // Verificar si el archivo existe antes de intentar eliminarlo
    try {
      await fs.access(filePath);
      await fs.unlink(filePath); // Elimina el archivo físicamente
      return NextResponse.json({ message: 'Archivo anterior eliminado con éxito.' });
    } catch {
      return NextResponse.json({ error: 'El archivo no existe en la ruta especificada.' }, { status: 404 });
    }

  } catch (error: any) {
    console.error('Error al eliminar archivo local:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}