## API Consultório Médico

A API permite :

- Criar consulta médica
- Listar consultas médicas
- Atualizar os dados de uma consulta
- Excluir uma consulta médica
- Finalizar uma consulta médica
- Listar o laudo de uma consulta
- Listar as consultas que um médico atendeu

## Passo a passo para executar o projeto

### Clonar o repositório
Abra um terminal e navegue até o diretório onde você deseja clonar o projeto. Em seguida, execute o seguinte comando:

````bash
git clone https://github.com/miguelmarqs/API-Consultorio-Medico.git

````
### Instalar as dependências
Navegue até o diretório do projeto e execute o seguinte comando:
````bash
npm install
````

### Executar o projeto
Navegue até o diretório do projeto e execute o seguinte comando:
````bash
npm run dev
````

## Projeto detalhado
#### Criando uma consulta médica usando JSON. "POST"
![image](https://github.com/miguelmarqs/API-Consultorio-Medico/assets/82917066/153d2b13-fb49-4a8f-a368-9b72e6077c18)

````javascript
{
  "tipoConsulta": "ODONTOLOGIA",
  "valorConsulta": 5000,
  "paciente": {
    "nome": "John Doe 3",
    "cpf": "55132392033",
    "dataNascimento": "2022-02-02",
    "celular": "11999997777",
    "email": "john@doe3.com",
    "senha": "1234"
  }
}
````

Caso a paciente já esteja em uma consulta deverá retornar um seguinte mensagem:
"O paciente já tem uma consulta em andamento!"

### Listando uma consulta médica. "GET"
![image](https://github.com/miguelmarqs/API-Consultorio-Medico/assets/82917066/6c3b01f3-5b2d-4c87-a876-9d8ed80d7aaf)

### Atualizando os dados de uma consulta médica usando JSON. "PUT"
![image](https://github.com/miguelmarqs/API-Consultorio-Medico/assets/82917066/98318a75-9964-4937-a3ea-99f3c0a493ad)

Se a consulta ja for finalizada não será possivel atualizar os dados retornando a seguinte mensagem:
"Não é possível atualizar uma consulta finalizada!"

### Excluindo uma consulta médica. "DELETE"
![image](https://github.com/miguelmarqs/API-Consultorio-Medico/assets/82917066/8b641c29-56c2-4a76-99da-c0ce6e550393)

````javascript
{
  "nome": "John Doe",
  "cpf": "55132392051",
  "dataNascimento": "2022-02-02",
  "celular": "11999997777",
  "email": "john@doe.com",
  "senha": "1234"
}
````

Só é possivel excluir a consulta se ela estiver em andamento

### Finalizando uma consulta. "POST"
![image](https://github.com/miguelmarqs/API-Consultorio-Medico/assets/82917066/59dcc045-7c87-48ec-b54b-593f79b167c2)

````javascript
{
	"identificadorConsulta": 1,
	"textoMedico": "XPTO"
}
````

### Obtendo o laudo do médico sobre a consulta.(caso a consulta já esteja finalizada) "GET" 
![image](https://github.com/miguelmarqs/API-Consultorio-Medico/assets/82917066/a441e90c-1c0e-44eb-9518-8898e92bb908)


### Verificando as consultas pelo médico. "GET"
![image](https://github.com/miguelmarqs/API-Consultorio-Medico/assets/82917066/41087ddf-7406-460d-a006-739f91b6ecd9)

