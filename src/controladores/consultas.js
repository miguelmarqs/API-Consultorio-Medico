let {consultorio, consultas, consultasFinalizadas, laudos} = require('../bancodedados')

const listarConsultas = (req, res) =>{
    const { senha_consultorio, cnes_consultorio } = req.query;

    if (!senha_consultorio || !cnes_consultorio) {
        return res.status(401).json({mensagem: "Cnes ou senha obrigatórios!"})
    }

    if(senha_consultorio !== consultorio.senha || cnes_consultorio !== consultorio.cnes){
        return res.status(401).json({mensagem: "Cnes ou senha inválidos!"})
    }

    return res.json(consultas);
}

const criarConsulta = (req, res) =>{
    const { tipoConsulta, valorConsulta, paciente, } = req.body;

    //verifica se todos os campos foram informados 
    if (!tipoConsulta || !valorConsulta || !paciente) {
        return res.status(400).json({mensagem: 'Todos os campos são obrigatórios!'})
    }  

    //Verificar se o valor da consulta é numerico
    if (typeof valorConsulta !== 'number') {
        return res.status(400).json({ mensagem: 'O valor da consulta deve ser um número!' });
    }
    
    //Verificar se o CPF informado já não está vinculado a nenhuma consulta que não foi finalizada
    const cpfPaciente = consultas.find(consulta => consulta.paciente.cpf === paciente.cpf && !consulta.finalizada);
    if (cpfPaciente) {
        return res.status(400).json({ mensagem: 'O paciente já tem uma consulta em andamento!' });
    }

    //Validar se o tipo da consulta informado consta nas especialidade dos médicos na base
    const medico = consultorio.medicos.find(medico => medico.especialidade === tipoConsulta);
    if (!medico) {
        return res.status(400).json({ mensagem: 'Não temos médicos disponíveis para essa especialidade!' });
    }
    
    //Vincular o identificador do médico especializado que irá atender a consulta em questão no momento de criação da consulta
    let consultaId = consultas.length + 1
    let novaConsulta = {
        identificador: consultaId,
        tipoConsulta,
        valorConsulta,
        paciente,
        identificadorMedico: medico.identificador,
        finalizada: false,
    }
    //Adicionar a consulta ao banco de dados

    consultas.push(novaConsulta);

    //Sem conteúdo no corpo (body) da resposta

    return res.status(204).send();
}

const atualizarConsultaPaciente = (req, res) => {
    const { identificadorConsulta } = req.params;
    const { nome, cpf, dataNascimento, celular, email, senha } = req.body;

    //Verificar se todos os campos foram informados
    if (!nome || !cpf || !dataNascimento || !celular || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
    }

    //Verificar se o identificador da consulta é válido
    const consulta = consultas.find(consulta => consulta.identificador === Number(identificadorConsulta));
    if (!consulta) {
        return res.status(404).json({ mensagem: 'Identificador da consulta inválido!' });
    }

    //Verificar se o CPF informado já não está vinculado a outra consulta não finalizada
    const cpfPaciente = consultas.find(outraConsulta => outraConsulta.paciente.cpf === cpf && outraConsulta.identificador !== consulta.identificador && !outraConsulta.finalizada);
    if (cpfPaciente) {
        return res.status(400).json({ mensagem: 'O paciente já tem uma consulta em andamento!' });
    }

    //Verificar se o E-mail informado já não está vinculado a outra consulta não finalizada
    const emailPaciente = consultas.find(outraConsulta => outraConsulta.paciente.email === email && outraConsulta.identificador !== consulta.identificador && !outraConsulta.finalizada);
    if (emailPaciente) {
        return res.status(400).json({ mensagem: 'O paciente já tem uma consulta em andamento!' });
    }

    //Verificar se a consulta não está finalizada
    if (consulta.finalizada) {
        return res.status(400).json({ mensagem: 'Não é possível atualizar uma consulta finalizada!' });
    }

    //Atualizar os dados do paciente na consulta médica
    consulta.paciente = {
    nome,
    cpf,
    dataNascimento,
    celular,
    email,
    senha,
    };

    return res.status(204).send();
}

const cancelarConsultaPaciente = (req, res) => {
    const { identificadorConsulta } = req.params;
  
    //Encontrar a consulta pelo identificador
    const consulta = consultas.find(consulta => consulta.identificador === Number(identificadorConsulta));
  
    //Verificar se a consulta existe
    if (!consulta) {
        return res.status(404).json({ mensagem: 'Consulta inexistente!' });
    }
  
    //Verificar se a consulta está finalizada
    if (consulta.finalizada) {
        return res.status(400).json({ mensagem: 'A consulta só pode ser removida se a mesma não estiver finalizada' });
    }
  
    //Remover a consulta do banco de dados
    const consultaIndex = consultas.findIndex(consulta => consulta.identificador === Number(identificadorConsulta));
    consultas.splice(consultaIndex, 1);
  
    return res.status(204).send();
};

const finalizarConsultaComLaudo = (req, res) => {
    const { identificadorConsulta, textoMedico } = req.body;
  
    //Verificar se todos os campos foram informados
    if (!identificadorConsulta || !textoMedico) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
    }
  
    //Verificar se o identificador da consulta existe
    const consulta = consultas.find(consulta => consulta.identificador === Number(identificadorConsulta));
  
    if (!consulta) {
        return res.status(404).json({ mensagem: 'Identificador da consulta inválido!' });
    }
  
    //Verificar se a consulta já está finalizada
    if (consulta.finalizada) {
        return res.status(400).json({ mensagem: 'A consulta já está finalizada!' });
    }
  
    //Verificar se o texto do médico possui um tamanho válido
    if (textoMedico.length <= 0 || textoMedico.length > 200) {
        return res.status(400).json({ mensagem: 'O tamanho do textoMedico não está dentro do esperado' });
    }
  
    //Criiar um novo registro de laudo
    const novoLaudo = {
        identificador: laudos.length + 1,
        identificadorConsulta: consulta.identificador,
        identificadorMedico: consulta.identificadorMedico,
        textoMedico,
        paciente: consulta.paciente,
    };
  
    //Registrar a consulta como finalizada
    consulta.finalizada = true;
  
    //Atualizar a consulta médica finalizada e o laudo na persistência de dados
    consultasFinalizadas.push(consulta);
    laudos.push(novoLaudo);
  
    return res.status(204).send();
};

const infoLaudo = (req, res) =>{
    const { identificador_consulta, senha } = req.query;

  //Verificar se o identificador da consulta e a senha foram informados
    if (!identificador_consulta || !senha) {
        return res.status(400).json({ mensagem: 'Identificador da consulta e senha são obrigatórios!' });
    }

  //Verificar se a consulta médica informada existe
    const consulta = consultas.find(consulta => consulta.identificador === Number(identificador_consulta));

    if (!consulta) {
        return res.status(404).json({ mensagem: 'Consulta médica não encontrada!' });
    }

  //Verificar se a senha informada é válida
    if (senha !== consulta.paciente.senha) {
        return res.status(401).json({ mensagem: 'Senha inválida!' });
    }

  //Verificar se existe um laudo para a consulta informada
    const laudo = laudos.find(laudo => laudo.identificadorConsulta === consulta.identificador);

    if (!laudo) {
        return res.status(404).json({ mensagem: 'Laudo não encontrado para esta consulta!' });
    }

  //Retornar as informações do laudo e das entidades relacionadas
    return res.status(200).json(laudo);
};

const consultaPorMedico = (req, res) => {
    const { identificador_medico } = req.query;
  
    //Verificar se o identificador do médico foi informado
    if (!identificador_medico) {
        return res.status(400).json({ mensagem: 'Identificador do médico é obrigatório!' });
    }
  
    //Verificar se o médico existe
    const consultasMedico = consultasFinalizadas.filter(consulta => consulta.identificadorMedico === Number(identificador_medico));
  
    if (consultasMedico.length === 0) {
        return res.status(404).json({ mensagem: 'O médico informado não existe na base!' });
    }
  
    //Retornar as consultas vinculadas ao médico
    return res.status(200).json(consultasMedico);
  };

  

module.exports = {
    listarConsultas,
    criarConsulta,
    atualizarConsultaPaciente,
    cancelarConsultaPaciente,
    finalizarConsultaComLaudo,
    infoLaudo,
    consultaPorMedico
}