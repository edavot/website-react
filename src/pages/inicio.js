import React, { useState, useEffect } from "react"

// Componentes
import CalendarioCursos from "../components/calendario"
import PanoramaInicio from "../components/panoramaInicio"
import Estadisticas from "../components/estadisticas/estadisticas"
import NuestrosCursos from "../components/nuestroscursos/nuestroscursos"
import Testimonios from "../components/testimonios/testimonios"
import Footer from "../components/footer/footer"
import ImgFlechita from '../img/flechita.png'

export default function Inicio() {

  const [verTodo, estVerTodo] = useState(false);
  const [ancho, estAncho] = useState(0);

  const alternarVerTodo = () => {
    estVerTodo(!verTodo);
  }

  const actAncho = () => {
    estAncho(window.innerWidth);
  }

  useEffect(() => {
    if (ancho === 0) {
      estAncho(window.innerWidth);
    }

    if (ancho < 768) {
      estVerTodo(false);
    } else {
      estVerTodo(true);
    }

    window.addEventListener('resize', actAncho);
    return () => window.removeEventListener('resize', actAncho);
  }, [ancho]);

  let clasesContenedorVerTodo = 'contenedor contenedor-85 d-flex justify-content-end d-md-none';
  if (!verTodo) {
    clasesContenedorVerTodo += ' pb-4';
  }

  return (
    <div>
      <PanoramaInicio />
      <Estadisticas />
      <NuestrosCursos />
      <div className={clasesContenedorVerTodo}>
        <button className="btn-alternador-vista" onClick={alternarVerTodo}>
          {verTodo ? 'Viendo todo ' : 'Ver todo '}
          <img src={ImgFlechita} className={verTodo && 'rotacion-flechita'} alt="flechita" />
        </button>
      </div>
      {
        verTodo &&
        <>
          <CalendarioCursos />
          <Testimonios />
          <Footer />
        </>
      }
    </div>
  )
}
