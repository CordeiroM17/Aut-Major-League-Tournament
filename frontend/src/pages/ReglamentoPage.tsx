import React from 'react';
import { Header } from '../components/Header';

export const ReglamentoPage: React.FC = () => {
  // Números romanos para las reglas
  const romanNumbers = [
    'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'
  ];
  // Contenido de las reglas
  const reglas = [
    {
      titulo: 'ESTRUCTURA Y FORMATO DEL TORNEO',
      items: [
        'Modalidad de Juego: Grieta del Invocador. Servidor LAS. Torneo de Reclutamiento.',
        'Charla Inaugural (Obligatoria): Todos los capitanes deben presentarse a la charla inaugural del torneo para la organización y logística del mismo. La fecha y hora se notificará por todos los canales de comunicación oficiales. En caso de inasistencia, se le quitará al equipo la posibilidad de realizar baneos en el primer mapa.',
        'Formato de Competencia (Sistema Suizo): El torneo contará con 16 equipos confirmados. Se utilizará un Sistema Suizo donde los equipos con registros similares se enfrentarán entre sí. Las rondas iniciales serán a Partida Única (Bo1). La fase eliminatoria (Playoffs) se disputará bajo el sistema Fearless Draft: los campeones utilizados no podrán repetirse en la misma serie de b03 para los cuartos, semis y tercer lugar y b05 para la final.'
      ]
    },
    {
      titulo: 'INSCRIPCIÓN Y REEMBOLSOS',
      items: [
        'Compromiso de Equipo: una vez inscriptos, los equipos se hacen responsables de cumplir con su participación.',
        'Política de Reembolsos: no se aceptarán reembolsos bajo ningún concepto si faltan 5 días o menos para el inicio del torneo.',
        'Cada equipo debe contar con un mínimo de 5 jugadores titulares y se recomienda tener suplentes para cumplir con los compromisos.'
      ]
    },
    {
      titulo: 'PREMIACIÓN (FEBRERO 2026)',
      items: [
        'Primer Lugar: $500.000 ARS.',
        'Segundo Lugar: $100.000 ARS.',
        'Tercer Lugar: inscripción gratuita al siguiente torneo o $50.000 ARS (a elección del equipo).',
        'Método de pago: Los premios se entregarán mediante transferencia de forma directa al capitán del equipo tras finalizar el torneo.'
      ]
    },
    {
      titulo: 'VISIBILIDAD Y STREAMING',
      items: [
        'Prohibición de Streamer Mode: está prohibido usar el "Streamer Mode" en partidas oficiales para que los casters puedan identificar a los jugadores por sus nicknames dentro del juego.',
        'Coordinación de Transmisión: los equipos pueden solicitar el stream oficial (Twitch/Kick) avisando al Staff. Cada equipo es libre de transmitir sus propias partidas si así lo desea.'
      ]
    },
    {
      titulo: 'COORDINACIÓN Y FAIRPLAY',
      items: [
        'Responsabilidad de Capitanes: son los encargados de coordinar los horarios con sus rivales.',
        'Cambios de Horario: se deben acordar entre capitanes de equipos y se deben avisar con 24hs de antelación al Staff.',
        'Supervisión técnica: el Staff podrá ingresar a las llamadas de Discord en cualquier momento para asegurar el Fairplay y brindar soporte.'
      ]
    },
    {
      titulo: 'CÓDIGO DE HONOR',
      items: [
        'Cuentas de Jugador:',
        'Todos los participantes deben ser Nivel 30+.',
        'Rango permitido: Jugadores amateur desde Hierro hasta Challenger.',
        'Queda estrictamente prohibido el uso de smurfs o scripts. El incumplimiento resultará en descalificación del equipo y baneo permanente del jugador.',
        'Es un torneo amateur así que no se aceptan equipos/players profesionales/exprofesionales.',
        'Se exige respeto absoluto. El "trash-talking" es parte del show, pero la discriminación, racismo o xenofobia resultarán en descalificación inmediata.'
      ]
    },
    {
      titulo: 'COORDINACIÓN DE PARTIDAS',
      items: [
        'Puntualidad: Los equipos tienen un tiempo de tolerancia de 10 minutos una vez creada la sala. No presentarse o exceder el tiempo resultará en derrota por walkover (WO).',
        'Discord Oficial: Es obligatorio que todos los capitanes y jugadores estén presentes en el servidor de Discord de la liga para recibir soporte y coordinar encuentros.'
      ]
    },
    {
      titulo: 'REGLAS DENTRO DEL JUEGO',
      items: [
        'Pausas: Cada equipo tiene derecho a pausas tácticas/técnicas (máximo 15 minutos) avisando previamente en el chat general (/pause).',
        'Remakes: Solo se permitirá reiniciar la partida si ocurre un error crítico antes del minuto 1:30 y no hubo contacto entre jugadores.'
      ]
    }
  ];
  return (
    <div className="bg-[#152a42] min-h-screen text-[#f3f3f3]">
      <Header active="reglamento" />
      <div className="relative w-full h-[220px] sm:h-[320px] flex flex-col items-center justify-center overflow-hidden px-2 sm:px-0 pb-8">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="/src/resources/Loop_1.webm"
          autoPlay
          loop
          muted
          style={{ opacity: 0.3 }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mt-2 mb-2">Reglamento oficial para la<br/>Aut Major League</h1>
          <p className="text-lg sm:text-xl text-center mt-2 mb-2 font-semibold">Por Demacia y por la Gloria</p>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Presentación izquierda */}
        <div className="bg-[#152A42] p-6 sm:p-12 flex flex-col justify-start min-h-[220px] sm:min-h-[320px] w-full">
          <span className="text-2xl font-bold text-[#d7b84a] mb-4">REGLAMENTO OFICIAL: AUT MAJOR LEAGUE</span>
          <p className="text-base text-[#f3f3f3] leading-relaxed mb-6">
            Bienvenidos a la Aut Major League. A continuación se detallan las normas y estructura del torneo. La organización se reserva el derecho de tomar decisiones finales ante cualquier situación no prevista en este reglamento para asegurar la integridad de la Aut Major League.
          </p>
          <img src="/src/resources/poro.png" alt="Poro" className="w-24 sm:w-32 mx-auto mt-2" />
        </div>
        {/* Reglas a la derecha */}
        <div className="bg-[#101a28] p-6 sm:p-12 flex flex-col justify-start min-h-[220px] sm:min-h-[320px] w-full">
          <div className="space-y-8">
            {reglas.map((regla, idx) => (
              <div key={regla.titulo} className="flex items-start">
                <span className="text-[#d7b84a] text-3xl font-bold mr-4 min-w-[2.5rem] text-center">{romanNumbers[idx]}</span>
                <div>
                  <span className="text-[#d7b84a] font-bold text-lg">{regla.titulo}</span>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {regla.items.map((item, i) => (
                      <li key={i} className="text-[#f3f3f3]">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#d7b84a] mt-8">Nota Final: La organización se reserva el derecho de tomar decisiones finales ante cualquier situación no prevista en este reglamento para asegurar la integridad de la Aut Major League.</p>
        </div>
      </div>
    </div>
  );
};
