import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center px-4 py-10">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10 w-full max-w-5xl">
        <h2 className="text-4xl font-bold text-white text-center mb-10">
          Póngase en contacto con <span className="text-red-400">OnBoarding</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Info Section */}
          <div className="text-white space-y-6">
            <div>
              <h3 className="text-2xl font-semibold">Información de contacto</h3>
              <p className="text-gray-300">
                ¿Tiene alguna pregunta o necesita ayuda? Estamos aquí para ayudarle en su viaje por
                la electrónica.
              </p>
            </div>
            <div>
              <p>
                <strong>📍 Tienda Virtual</strong>
              </p>
              <p>
                <strong>📧 Email:</strong> d.aldanadupre@gmail.com
              </p>
              <p>
                <strong>📞 Phone:</strong> (123) 456-7890
              </p>
            </div>
          </div>

          {/* Form Section */}
          <form className="space-y-6">
            <div>
              <label className="block text-white mb-1">Nombre</label>
              <input
                type="text"
                placeholder="Nombre completo..."
                className="w-full px-4 py-2 bg-white/20 border border-white/30 text-white rounded-xl placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Dirección de correo</label>
              <input
                type="email"
                placeholder="correo"
                className="w-full px-4 py-2 bg-white/20 border border-white/30 text-white rounded-xl placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Comentarios</label>
              <textarea
                rows="4"
                placeholder="Escriba aqui sus Comentarios..."
                className="w-full px-4 py-2 bg-white/20 border border-white/30 text-white rounded-xl placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-purple-500 text-white font-semibold py-2 rounded-xl hover:opacity-90 transition-all duration-300"
            >
              Enviar mensaje 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
