// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo.' }, { status: 400 });
    }

    // Convertir el archivo a Buffer para escribirlo en disco
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Definir la ruta de destino: public/Fotos/nombre-del-archivo.ext
    const publicDirectory = path.join(process.cwd(), 'public', 'Fotos');
    
    // Asegurar que la carpeta exista, si no, crearla
    await fs.mkdir(publicDirectory, { recursive: true });

    const filePath = path.join(publicDirectory, file.name);
    
    // Guardar archivo en el sistema de archivos local
    await fs.writeFile(filePath, buffer);

    // Retornamos la URL relativa que se guardará en la base de datos
    const dbUrlPath = `/Fotos/${file.name}`;
    return NextResponse.json({ url: dbUrlPath });

  } catch (error: any) {
    console.error('Error al guardar el archivo de forma local:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}