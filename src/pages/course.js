import React, { useState, useEffect } from "react"
import Navbar from "../components/navbar/navbar"
import Footer from "../components/footer/footer"
import AcordeonEpisodio from "../components/episodio/acordeon_episodios"
import queryString from 'query-string'
import GridLoader from "react-spinners/GridLoader"
import Fade from 'react-reveal/Fade'
import Avatar from "../components/avatar"
import { css } from "@emotion/core"
import { obtCursoExtendido } from '../api'
import { Link, useHistory } from "react-router-dom"

const override = css`
  display: block;
  margin: 50px auto;
  background-color: 'green';
`;

const calcularTotalHoras = (clases) => {
    let totalMinutos = 0;

    // Sumo todas las horas y minutos
    clases.map(clase => {
        const hm = clase.duracion.split(' ');
        const horas = parseInt(hm[0], 10);
        const minutos = parseInt(hm[1], 10);
        totalMinutos += minutos;
        totalMinutos += (horas * 60);
        return { totalMinutos }
    })

    // Obtengo las horas y minutos completos
    const horas = totalMinutos / 60;
    const horasCompletas = Math.trunc(horas); // Parte entera
    const minutosCompletos = Math.trunc((horas % 1) * 60); // Parte decimal

    // Lo paso a formato horario
    return `${horasCompletas}h ${minutosCompletos}m`;
}

export default function Course(props) {
    const idCurso = queryString.parse(props.location.search).id;
    const [curso, estCurso] = useState({});
    const [cargando, estCargando] = useState(true);
    const history = useHistory();

    useEffect(() => {
        estCargando(true);
        obtCursoExtendido(idCurso)
            .then(curso => {
                estCurso(curso);
                estCargando(false);
            })
    }, [idCurso]);

    const navegar = (idEpisodio) => {
        history.push(`/course-player/?id=${idCurso}&episode=${idEpisodio}`);
    }

    return (
        <div>
            <Navbar />
            <div className="contenedor contenedor-60 cuerpo-pagina">
                <GridLoader css={override} loading={cargando} size={20} />
                {
                    !cargando && curso.id
                    &&
                    <Fade bottom>
                        <h2 className="titulo-seccion mt-5 mb-5 text-left titulo-curso">{curso.titulo}</h2>
                        <div className="contenedor-controles-curso">
                            <a target="_blank" className="boton btn-principal btn-rep-curso d-block" href={curso.urlInscripcion}>
                                <i className="fas fa-edit mr-3"></i>
                                    Inscribirme
                                </a>
                            <div className="contenedor-data-cursos">
                                <div className="mr-md-5">
                                    <i className="fas fa-layer-group"></i>{' '}
                                    {curso.clases && curso.clases.length} Clases
                                </div>
                                <div>
                                    <i className="far fa-clock"></i>{' '}
                                    {calcularTotalHoras(curso.clases)}
                                </div>
                            </div>
                        </div>
                        <p className="descripcion-curso">
                            {curso.descExtendida}
                        </p>
                        <h3 className="subtitulo-descripcion-curso">¿Qué aprenderás?</h3>
                        <p className="descripcion-curso">
                            {curso.objetivo}
                        </p>
                        <h3 className="subtitulo-descripcion-curso">Requisitos</h3>
                        <ul className="requisitos-curso">
                            {
                                curso.requisitos.map((requisito, indice) => (
                                    <li key={indice}>{requisito}</li>
                                ))
                            }
                        </ul>
                        <div className="contenedor-curso-profesor">
                            <div className="contenedor-img">
                                <Avatar img={curso.profesor.img} />
                            </div>
                            <div className="contenedor-descripcion">
                                <h4>
                                    <Link to={`/teacher-detail/?id=${curso.profesor.id}`}>
                                        {curso.profesor.nombres + ' ' + curso.profesor.apellidos}
                                    </Link>
                                </h4>
                                <p className="descripcion-curso">
                                    {curso.profesor.sobreMi}
                                </p>
                            </div>
                        </div>
                        <h3 className="subtitulo-descripcion-curso">Lista de clases</h3>
                        {
                            curso.clases && curso.clases.length > 0
                                ?
                                <AcordeonEpisodio
                                    episodios={curso.clases}
                                    machucar={navegar} />
                                :
                                <p className="descripcion-curso">Aún no hay videos</p>
                        }
                    </Fade>
                }
                {
                    !cargando && !curso.id
                    &&
                    <p>No se pudo cargar el curso</p>
                }
            </div>
            <Footer />
        </div>
    )
}