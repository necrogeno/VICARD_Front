import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border-2 border-black rounded-md p-4">
        <h1>Datos</h1>
        <h2>Nombre:</h2>
        <h2>Apellidos:</h2>
        <h2>Puestos de trabajo:</h2>
        <h2>Direccion:</h2>
        <h2>Telefono:</h2>
        <h2>Email:</h2>
        <h2>Colonia:</h2>
        <h2>Unidad Aministrativa:</h2>
        <h2>Activo:</h2>
      </div>
    </div>
  );
}
