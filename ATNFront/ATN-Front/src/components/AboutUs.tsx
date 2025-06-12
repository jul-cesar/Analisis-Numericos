import { Award, BookOpen, School, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl">
        {/* --- Título Principal --- */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">
            Acerca de Nuestro Proyecto
          </h1>
          <p className="text-slate-400 mt-3 text-lg">
            Conoce al equipo y la motivación detrás del Analizador Numérico
            Interactivo.
          </p>
        </div>

        <div className="space-y-8">
          {/* --- Tarjeta de Descripción --- */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 sm:p-8 shadow-lg backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Nuestra Misión
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Hemos desarrollado esta herramienta con la pasión por unir las
              matemáticas y la programación. Nuestro objetivo es ofrecer una
              plataforma intuitiva y poderosa que no solo calcule derivadas e
              integrales, sino que también sirva como un laboratorio virtual
              para explorar y entender los principios del análisis numérico.
              Creemos que visualizar estos conceptos es clave para el
              aprendizaje.
            </p>
          </div>

          {/* --- Tarjeta de Autores --- */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Users className="text-cyan-400" />
              Los Autores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Autor 1 */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-cyan-500">
                  <AvatarImage
                    src="https://images8.alphacoders.com/948/948337.png"
                    alt="Avatar Julio"
                  />
                  <AvatarFallback>JM</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">
                    Julio Cesar Martinez
                  </h3>
                  <p className="text-cyan-400">Desarrollador Backend</p>
                </div>
              </div>
              {/* Autor 2 */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-cyan-500">
                  <AvatarImage
                    src="https://media.gq.com.mx/photos/5e990b2bbb662c00085a68b8/1:1/w_683,h_683,c_limit/Cristiano%20Ronaldo%20portada.jpg"
                    alt="Avatar Alex"
                  />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">
                    Alex Javier Betin
                  </h3>
                  <p className="text-cyan-400">Desarrollador Frontend</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- Tarjeta de Información Académica --- */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 sm:p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {/* Asignatura */}
              <div className="flex flex-col items-center">
                <BookOpen className="h-8 w-8 text-cyan-400 mb-2" />
                <h4 className="font-semibold text-slate-300">Asignatura</h4>
                <p className="text-lg text-white">
                  Análisis de Técnicas Numéricas
                </p>
              </div>
              {/* Universidad */}
              <div className="flex flex-col items-center">
                <School className="h-8 w-8 text-cyan-400 mb-2" />
                <h4 className="font-semibold text-slate-300">Universidad</h4>
                <p className="text-lg text-white">
                  Corporación Universitaria del Caribe (CECAR)
                </p>
              </div>
              {/* Docente */}
              <div className="flex flex-col items-center">
                <Award className="h-8 w-8 text-cyan-400 mb-2" />
                <h4 className="font-semibold text-slate-300">Docente</h4>
                <p className="text-lg text-white">
                  Carlos Segundo Cohen Manrrique
                </p>
              </div>
            </div>
          </div>

          {/* --- Mensaje Final --- */}
          <div className="text-center pt-8">
            <p className="text-slate-400">
              Gracias por utilizar nuestra herramienta. ¡Esperamos que te sea de
              gran ayuda en tus proyectos y estudios!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
