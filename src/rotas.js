const express = require('express')
const consultas = require('./controladores/consultas')

const rotas = express()

rotas.get('/consultas', consultas.listarConsultas)
rotas.post('/consultas', consultas.criarConsulta)
rotas.put('/consultas/:identificadorConsulta/paciente', consultas.atualizarConsultaPaciente)
rotas.delete('/consultas/:identificadorConsulta', consultas.cancelarConsultaPaciente)
rotas.post('/consultas/finalizar', consultas.finalizarConsultaComLaudo )
rotas.get('/consultas/laudo', consultas.infoLaudo)
rotas.get('/consultas/medico', consultas.consultaPorMedico)

module.exports = rotas