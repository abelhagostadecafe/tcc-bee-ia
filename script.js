/* ============================================================
   BEE IA — JAVASCRIPT
   Índice:
   1. Dados: matérias, categorias, prompts, IA por matéria
   2. Navegação entre páginas + menu mobile
   3. Renderização e filtros da biblioteca de prompts
   4. Renderização da seção IA por matéria
   5. Copiar prompt para a área de transferência
   6. Scroll reveal (animações leves)
   ============================================================ */
(function(){
  "use strict";

  /* ---------- 1. DADOS ---------- */

  var SUBJECTS = [
    {id:'portugues',   name:'Português',               icon:'📖'},
    {id:'matematica',  name:'Matemática',               icon:'➗'},
    {id:'geografia',   name:'Geografia',                icon:'🌎'},
    {id:'historia',    name:'História',                 icon:'🏛️'},
    {id:'ciencias',    name:'Ciências',                 icon:'🧪'},
    {id:'biologia',    name:'Biologia',                 icon:'🧬'},
    {id:'quimica',     name:'Química',                  icon:'⚗️'},
    {id:'fisica',      name:'Física',                   icon:'⚡'},
    {id:'ingles',      name:'Inglês',                   icon:'🇺🇸'},
    {id:'espanhol',    name:'Espanhol',                 icon:'🇪🇸'},
    {id:'artes',       name:'Artes',                    icon:'🎨'},
    {id:'edfisica',    name:'Educação Física',          icon:'🏃'},
    {id:'tecnologia',  name:'Informática',   icon:'💻'},
    {id:'filosofia',   name:'Filosofia',                icon:'🧠'},
    {id:'sociologia',  name:'Sociologia',               icon:'👥'}
  ];

  var CATEGORIES = {
    plano:      {label:'Plano de aula',            icon:'', desc:function(s){return 'Gera um plano de aula completo de '+s+', com objetivo, uma habilidade da BNCC relacionada e sugestão de avaliação.';}},
    exercicios: {label:'Exercícios',                icon:'', desc:function(s){return 'Cria uma lista de exercícios de '+s+' organizada em fácil, médio e difícil, já com gabarito.';}},
    avaliacao:  {label:'Avaliação',                 icon:'', desc:function(s){return 'Monta uma avaliação de '+s+' pronta para aplicação, com questões e critérios de correção.';}},
    adaptada:   {label:'Atividade adaptada',        icon:'', desc:function(s){return 'Ajuda a adaptar uma atividade de '+s+' para alunos com necessidades específicas de aprendizagem.';}},
    resumo:     {label:'Resumo / Material de apoio',icon:'', desc:function(s){return 'Cria um resumo ou material de apoio de '+s+' para revisão dos alunos.';}},
    projeto:    {label:'Trabalho / Projeto',        icon:'', desc:function(s){return 'Propõe um trabalho ou projeto de '+s+', com etapas, prazos e critérios de avaliação.';}},
    ludica:     {label:'Atividade lúdica',          icon:'', desc:function(s){return 'Cria uma atividade lúdica de '+s+' para fixar o conteúdo de forma divertida.';}}
  };

  // Cada matéria possui 7 prompts (plano, exercicios, avaliacao, adaptada, resumo, projeto, ludica)
  var PROMPTS = [
    /* ---------------- PORTUGUÊS ---------------- */
    {subject:'portugues', cat:'plano', title:'Plano de aula de Língua Portuguesa', text:'Crie um plano de aula de Língua Portuguesa sobre [TEMA] para alunos do [ANO/SÉRIE]. Inclua objetivo de aprendizagem, habilidade da BNCC relacionada, uma explicação inicial, uma atividade prática e uma forma de avaliação, considerando uma aula de [DURAÇÃO DA AULA].'},
    {subject:'portugues', cat:'exercicios', title:'Banco de questões de interpretação e gramática', text:'Crie [QUANTIDADE DE QUESTÕES] questões de Língua Portuguesa sobre [TEMA] para alunos do [ANO/SÉRIE], divididas em fácil, médio e difícil. Inclua ao menos duas questões de interpretação de texto e duas de gramática, e apresente o gabarito comentado ao final.'},
    {subject:'portugues', cat:'avaliacao', title:'Prova de Língua Portuguesa', text:'Elabore uma prova de Língua Portuguesa sobre [TEMA] para alunos do [ANO/SÉRIE], com [QUANTIDADE DE QUESTÕES] questões (múltipla escolha e dissertativas), um pequeno texto de apoio para interpretação e uma grade de correção para as questões dissertativas.'},
    {subject:'portugues', cat:'adaptada', title:'Atividade adaptada para inclusão', text:'Adapte a seguinte atividade de Língua Portuguesa sobre [TEMA] para um aluno com [NECESSIDADE ESPECÍFICA], mantendo o mesmo objetivo pedagógico, mas simplificando a linguagem, aumentando o tamanho da fonte sugerido e reduzindo o número de comandos por questão. Atividade original: [COLE A ATIVIDADE AQUI].'},
    {subject:'portugues', cat:'resumo', title:'Resumo de conteúdo gramatical ou literário', text:'Crie um resumo didático sobre [TEMA] de Língua Portuguesa, destinado a alunos do [ANO/SÉRIE], com linguagem simples, tópicos organizados, exemplos práticos e um pequeno quadro de palavras-chave ao final.'},
    {subject:'portugues', cat:'projeto', title:'Projeto de produção textual', text:'Crie uma proposta de projeto de produção textual sobre [TEMA/GÊNERO TEXTUAL] para alunos do [ANO/SÉRIE], com objetivo, etapas de execução, prazo sugerido, critérios de avaliação e uma sugestão de como socializar os textos produzidos com a turma.'},
    {subject:'portugues', cat:'ludica', title:'Jogo de vocabulário e gramática', text:'Crie um jogo educativo sobre [TEMA] de Língua Portuguesa para alunos do [ANO/SÉRIE], que possa ser aplicado em sala em até [DURAÇÃO DA AULA], explicando regras, materiais necessários e uma variação mais difícil do jogo.'},

    /* ---------------- MATEMÁTICA ---------------- */
    {subject:'matematica', cat:'exercicios', title:'Lista de exercícios por nível de dificuldade', text:'Crie [QUANTIDADE DE QUESTÕES] questões de matemática sobre [TEMA], destinadas a alunos do [ANO/SÉRIE]. Divida as questões em fácil, médio e difícil e apresente o gabarito ao final.'},
    {subject:'matematica', cat:'plano', title:'Plano de aula de Matemática', text:'Crie um plano de aula de matemática sobre [TEMA] para alunos do [ANO/SÉRIE]. Inclua objetivo, habilidades, explicação, atividade prática e avaliação.'},
    {subject:'matematica', cat:'avaliacao', title:'Prova com resolução passo a passo', text:'Elabore uma prova de matemática sobre [TEMA] para alunos do [ANO/SÉRIE], com [QUANTIDADE DE QUESTÕES] questões de complexidade crescente e apresente, em um segundo bloco, a resolução passo a passo de cada questão para conferência do professor.'},
    {subject:'matematica', cat:'adaptada', title:'Problema reescrito em três níveis', text:'Reescreva o seguinte problema de matemática sobre [TEMA] em três versões: uma mais simples, uma no nível padrão do [ANO/SÉRIE] e uma mais desafiadora, mantendo o mesmo contexto. Problema original: [COLE O PROBLEMA AQUI].'},
    {subject:'matematica', cat:'resumo', title:'Resumo de fórmulas e conceitos', text:'Crie um resumo visual em tópicos sobre [TEMA] de matemática para alunos do [ANO/SÉRIE], destacando fórmulas, passos de resolução e um exemplo resolvido para cada fórmula apresentada.'},
    {subject:'matematica', cat:'projeto', title:'Projeto de matemática aplicada ao cotidiano', text:'Crie uma proposta de projeto que aplique [TEMA] de matemática a uma situação do cotidiano dos alunos do [ANO/SÉRIE], incluindo objetivo, etapas, materiais necessários e uma forma de apresentação final dos resultados.'},
    {subject:'matematica', cat:'ludica', title:'Jogo matemático em grupo', text:'Crie um jogo em grupo para praticar [TEMA] de matemática com alunos do [ANO/SÉRIE], explicando regras, materiais, tempo estimado de aplicação e uma forma de pontuação.'},

    /* ---------------- GEOGRAFIA ---------------- */
    {subject:'geografia', cat:'plano', title:'Plano de aula de Geografia', text:'Crie um plano de aula de Geografia sobre [TEMA] para alunos do [ANO/SÉRIE], incluindo objetivo, habilidade da BNCC, uso de mapas ou imagens de satélite, atividade prática e avaliação, para uma aula de [DURAÇÃO DA AULA].'},
    {subject:'geografia', cat:'exercicios', title:'Questões com leitura de mapas', text:'Crie [QUANTIDADE DE QUESTÕES] questões de Geografia sobre [TEMA] para alunos do [ANO/SÉRIE], incluindo ao menos duas questões de leitura e interpretação de mapas, divididas em fácil, médio e difícil, com gabarito ao final.'},
    {subject:'geografia', cat:'avaliacao', title:'Prova com análise de mapa ou gráfico', text:'Elabore uma prova de Geografia sobre [TEMA] para alunos do [ANO/SÉRIE], com [QUANTIDADE DE QUESTÕES] questões, incluindo uma questão que peça a análise de um gráfico ou mapa, e apresente a grade de correção.'},
    {subject:'geografia', cat:'adaptada', title:'Atividade adaptada sem leitura complexa de mapas', text:'Adapte uma atividade sobre [TEMA] de Geografia para um aluno com [NECESSIDADE ESPECÍFICA], substituindo leitura de mapas complexos por descrições verbais simples e reduzindo o número de itens por questão.'},
    {subject:'geografia', cat:'resumo', title:'Resumo por causas e consequências', text:'Crie um resumo esquematizado sobre [TEMA] de Geografia para alunos do [ANO/SÉRIE], organizado por tópicos, com destaque para causas, consequências e dados importantes relacionados ao tema.'},
    {subject:'geografia', cat:'projeto', title:'Pesquisa relacionando o tema à realidade local', text:'Crie uma proposta de projeto de pesquisa sobre [TEMA] de Geografia para alunos do [ANO/SÉRIE], relacionando o tema à realidade local dos estudantes, com etapas, prazos e critérios de avaliação.'},
    {subject:'geografia', cat:'ludica', title:'Gincana de localização e capitais', text:'Crie um jogo ou gincana sobre [TEMA] de Geografia (por exemplo, localização em mapas ou capitais) para alunos do [ANO/SÉRIE], explicando regras e materiais necessários.'},

    /* ---------------- HISTÓRIA ---------------- */
    {subject:'historia', cat:'plano', title:'Plano de aula de História', text:'Crie um plano de aula de História sobre [TEMA] para alunos do [ANO/SÉRIE], incluindo objetivo, habilidade da BNCC, contextualização histórica, atividade com fontes históricas e avaliação.'},
    {subject:'historia', cat:'exercicios', title:'Questões com trecho de fonte histórica', text:'Crie [QUANTIDADE DE QUESTÕES] questões de História sobre [TEMA] para alunos do [ANO/SÉRIE], divididas em fácil, médio e difícil, incluindo ao menos uma questão baseada em um trecho de fonte histórica, com gabarito comentado.'},
    {subject:'historia', cat:'avaliacao', title:'Prova com linha do tempo', text:'Elabore uma prova de História sobre [TEMA] para alunos do [ANO/SÉRIE], com [QUANTIDADE DE QUESTÕES] questões objetivas e dissertativas, incluindo uma linha do tempo para o aluno completar.'},
    {subject:'historia', cat:'adaptada', title:'Texto histórico simplificado', text:'Simplifique um texto sobre [TEMA] de História para um aluno com [NECESSIDADE ESPECÍFICA], mantendo os fatos históricos essenciais, usando frases curtas e vocabulário mais acessível.'},
    {subject:'historia', cat:'resumo', title:'Resumo cronológico do tema', text:'Crie um resumo cronológico sobre [TEMA] de História para alunos do [ANO/SÉRIE], destacando datas, personagens e eventos principais em ordem cronológica.'},
    {subject:'historia', cat:'projeto', title:'Trabalho com múltiplos pontos de vista', text:'Crie uma proposta de trabalho em grupo sobre [TEMA] de História para alunos do [ANO/SÉRIE], em que os alunos pesquisem diferentes pontos de vista sobre o mesmo evento e apresentem suas conclusões para a turma.'},
    {subject:'historia', cat:'ludica', title:'Júri simulado ou dramatização histórica', text:'Crie uma atividade de dramatização ou júri simulado sobre [TEMA] de História para alunos do [ANO/SÉRIE], com papéis definidos e um roteiro básico de discussão.'},

    /* ---------------- CIÊNCIAS ---------------- */
    {subject:'ciencias', cat:'plano', title:'Plano de aula de Ciências', text:'Crie um plano de aula de Ciências sobre [TEMA] para alunos do [ANO/SÉRIE], incluindo objetivo, habilidade da BNCC, explicação inicial, um experimento simples e uma forma de avaliação.'},
    {subject:'ciencias', cat:'exercicios', title:'Questões com explicação da resposta', text:'Crie [QUANTIDADE DE QUESTÕES] questões de Ciências sobre [TEMA] para alunos do [ANO/SÉRIE], divididas em fácil, médio e difícil, com gabarito e uma breve explicação da resposta correta em cada questão.'},
    {subject:'ciencias', cat:'avaliacao', title:'Prova com análise de imagem ou experimento', text:'Elabore uma prova de Ciências sobre [TEMA] para alunos do [ANO/SÉRIE], com [QUANTIDADE DE QUESTÕES] questões, incluindo uma questão que envolva a análise de uma imagem ou experimento.'},
    {subject:'ciencias', cat:'adaptada', title:'Experimento adaptado e acessível', text:'Adapte uma atividade experimental sobre [TEMA] de Ciências para um aluno com [NECESSIDADE ESPECÍFICA], propondo alternativas seguras e acessíveis para a participação dele na atividade.'},
    {subject:'ciencias', cat:'resumo', title:'Resumo com exemplos do cotidiano', text:'Crie um resumo em tópicos sobre [TEMA] de Ciências para alunos do [ANO/SÉRIE], com linguagem simples e exemplos do cotidiano, indicando onde poderiam entrar imagens ou ilustrações.'},
    {subject:'ciencias', cat:'projeto', title:'Projeto de investigação científica', text:'Crie uma proposta de projeto de investigação científica sobre [TEMA] para alunos do [ANO/SÉRIE], com uma pergunta de pesquisa, hipóteses, materiais e etapas para testar as hipóteses.'},
    {subject:'ciencias', cat:'ludica', title:'Experimento prático e lúdico', text:'Crie uma atividade prática e lúdica sobre [TEMA] de Ciências para alunos do [ANO/SÉRIE], usando materiais simples e acessíveis, explicando o passo a passo e a explicação científica por trás do resultado.'},

    /* ---------------- BIOLOGIA ---------------- */
    {subject:'biologia', cat:'plano', title:'Plano de aula de Biologia', text:'Crie um plano de aula de Biologia sobre [TEMA] para alunos do [ANO/SÉRIE], incluindo objetivo, habilidade da BNCC, explicação do conteúdo, uma atividade prática ou estudo de caso e avaliação.'},
    {subject:'biologia', cat:'exercicios', title:'Questões com esquema descrito em texto', text:'Crie [QUANTIDADE DE QUESTÕES] questões de Biologia sobre [TEMA] para alunos do [ANO/SÉRIE], divididas em fácil, médio e difícil, incluindo pelo menos uma questão com esquema ou imagem descrita em texto, com gabarito.'},
    {subject:'biologia', cat:'avaliacao', title:'Prova com questão relacional dissertativa', text:'Elabore uma prova de Biologia sobre [TEMA] para alunos do [ANO/SÉRIE], com [QUANTIDADE DE QUESTÕES] questões, incluindo uma questão dissertativa que peça a relação entre dois conceitos do conteúdo.'},
    {subject:'biologia', cat:'adaptada', title:'Explicação com termos técnicos simplificados', text:'Adapte uma atividade sobre [TEMA] de Biologia para um aluno com [NECESSIDADE ESPECÍFICA], substituindo termos técnicos complexos por explicações mais simples, sem perder o rigor científico essencial.'},
    {subject:'biologia', cat:'resumo', title:'Resumo esquemático com quadro comparativo', text:'Crie um resumo esquemático sobre [TEMA] de Biologia para alunos do [ANO/SÉRIE], organizando o conteúdo em tópicos, com definições curtas e um quadro comparativo quando fizer sentido.'},
    {subject:'biologia', cat:'projeto', title:'Pesquisa relacionando biologia a temas atuais', text:'Crie uma proposta de projeto de pesquisa sobre [TEMA] de Biologia para alunos do [ANO/SÉRIE], relacionando o conteúdo a questões ambientais ou de saúde atuais.'},
    {subject:'biologia', cat:'ludica', title:'Jogo de associação de conceitos', text:'Crie um jogo de perguntas e respostas ou de associação sobre [TEMA] de Biologia para alunos do [ANO/SÉRIE], explicando regras e materiais necessários.'},

    /* ---------------- QUÍMICA ---------------- */
    {subject:'quimica', cat:'plano', title:'Plano de aula de Química', text:'Crie um plano de aula de Química sobre [TEMA] para alunos do [ANO/SÉRIE], incluindo objetivo, habilidade da BNCC, explicação teórica, um experimento simples e seguro, e avaliação.'},
    {subject:'quimica', cat:'exercicios', title:'Lista de exercícios com resolução comentada', text:'Crie [QUANTIDADE DE QUESTÕES] questões de Química sobre [TEMA] para alunos do [ANO/SÉRIE], divididas em fácil, médio e difícil, incluindo cálculos quando aplicável, com gabarito e resolução comentada.'},
    {subject:'quimica', cat:'avaliacao', title:'Prova com cálculo estequiométrico', text:'Elabore uma prova de Química sobre [TEMA] para alunos do [ANO/SÉRIE], com [QUANTIDADE DE QUESTÕES] questões, incluindo pelo menos uma questão envolvendo equação química ou cálculo estequiométrico.'},
    {subject:'quimica', cat:'adaptada', title:'Explicação com analogias do cotidiano', text:'Reescreva uma explicação sobre [TEMA] de Química de forma mais simples para um aluno com [NECESSIDADE ESPECÍFICA], usando analogias do dia a dia para substituir a linguagem técnica sempre que possível.'},
    {subject:'quimica', cat:'resumo', title:'Resumo de fórmulas com exemplo resolvido', text:'Crie um resumo em tópicos sobre [TEMA] de Química para alunos do [ANO/SÉRIE], com as principais fórmulas, definições e um exemplo resolvido de cada tipo de cálculo relacionado ao tema.'},
    {subject:'quimica', cat:'projeto', title:'Projeto sobre química no cotidiano', text:'Crie uma proposta de projeto sobre [TEMA] de Química para alunos do [ANO/SÉRIE], relacionando o conteúdo a produtos ou processos do cotidiano, com etapas de pesquisa e apresentação.'},
    {subject:'quimica', cat:'ludica', title:'Experimento demonstrativo seguro', text:'Crie uma atividade lúdica ou experimento demonstrativo seguro sobre [TEMA] de Química para alunos do [ANO/SÉRIE], explicando materiais, passo a passo e a explicação científica do fenômeno.'},

    /* ---------------- FÍSICA ---------------- */
    {subject:'fisica', cat:'plano', title:'Plano de aula de Física', text:'Crie um plano de aula de Física sobre [TEMA] para alunos do [ANO/SÉRIE], incluindo objetivo, habilidade da BNCC, explicação teórica, um experimento ou demonstração prática e avaliação.'},
    {subject:'fisica', cat:'exercicios', title:'Lista de problemas com resolução passo a passo', text:'Crie [QUANTIDADE DE QUESTÕES] questões de Física sobre [TEMA] para alunos do [ANO/SÉRIE], divididas em fácil, médio e difícil, incluindo problemas de cálculo, com gabarito e resolução passo a passo.'},
    {subject:'fisica', cat:'avaliacao', title:'Prova conceitual e de cálculo', text:'Elabore uma prova de Física sobre [TEMA] para alunos do [ANO/SÉRIE], com [QUANTIDADE DE QUESTÕES] questões, incluindo uma questão conceitual e uma questão de cálculo com fórmulas.'},
    {subject:'fisica', cat:'adaptada', title:'Explicação com analogias do dia a dia', text:'Explique [TEMA] de Física de forma simplificada e com analogias do cotidiano para um aluno com [NECESSIDADE ESPECÍFICA], evitando fórmulas complexas sem antes explicar o conceito por trás delas.'},
    {subject:'fisica', cat:'resumo', title:'Resumo de fórmulas e unidades de medida', text:'Crie um resumo em tópicos sobre [TEMA] de Física para alunos do [ANO/SÉRIE], com as principais fórmulas, unidades de medida e um exemplo resolvido para cada fórmula.'},
    {subject:'fisica', cat:'projeto', title:'Construção de modelo ou experimento caseiro', text:'Crie uma proposta de projeto prático sobre [TEMA] de Física para alunos do [ANO/SÉRIE], como a construção de um modelo ou experimento caseiro, com lista de materiais e etapas.'},
    {subject:'fisica', cat:'ludica', title:'Desafio em grupo sobre o tema', text:'Crie uma atividade lúdica ou desafio em grupo sobre [TEMA] de Física para alunos do [ANO/SÉRIE], explicando regras, materiais e a relação com o conteúdo estudado.'},

    /* ---------------- INGLÊS ---------------- */
    {subject:'ingles', cat:'plano', title:'Plano de aula em inglês (lesson plan)', text:'Crie, em inglês, um plano de aula sobre [TEMA] para alunos do [ANO/SÉRIE] com nível [NÍVEL DOS ALUNOS] (básico, intermediário ou avançado), incluindo objetivo, atividade de aquecimento (warm-up), explicação do conteúdo, atividade prática e avaliação.'},
    {subject:'ingles', cat:'exercicios', title:'Exercícios de gramática ou vocabulário', text:'Crie [QUANTIDADE DE QUESTÕES] exercícios em inglês sobre [TEMA] (gramática ou vocabulário) para alunos do [ANO/SÉRIE] no nível [NÍVEL DOS ALUNOS], divididos em fácil, médio e difícil, com gabarito ao final.'},
    {subject:'ingles', cat:'avaliacao', title:'Prova com reading comprehension', text:'Elabore uma prova de inglês sobre [TEMA] para alunos do [ANO/SÉRIE] no nível [NÍVEL DOS ALUNOS], com [QUANTIDADE DE QUESTÕES] questões, incluindo um pequeno texto para interpretação (reading comprehension) e questões de gramática.'},
    {subject:'ingles', cat:'adaptada', title:'Texto simplificado em inglês', text:'Adapte um texto em inglês sobre [TEMA] para um aluno com [NECESSIDADE ESPECÍFICA] ou nível [NÍVEL DOS ALUNOS] mais básico, simplificando o vocabulário e as estruturas gramaticais, mantendo o sentido original.'},
    {subject:'ingles', cat:'resumo', title:'Resumo de vocabulário com tradução', text:'Crie um resumo de vocabulário e expressões sobre [TEMA] em inglês, com tradução para o português, destinado a alunos do [ANO/SÉRIE] no nível [NÍVEL DOS ALUNOS].'},
    {subject:'ingles', cat:'projeto', title:'Projeto de produção oral ou escrita', text:'Crie uma proposta de projeto de produção oral ou escrita em inglês sobre [TEMA] para alunos do [ANO/SÉRIE], com etapas, critérios de avaliação e sugestão de apresentação final (vídeo, diálogo ou texto).'},
    {subject:'ingles', cat:'ludica', title:'Jogo de vocabulário em inglês', text:'Crie um jogo em inglês para praticar vocabulário sobre [TEMA] com alunos do [ANO/SÉRIE] no nível [NÍVEL DOS ALUNOS], explicando regras e materiais necessários.'},

    /* ---------------- ESPANHOL ---------------- */
    {subject:'espanhol', cat:'plano', title:'Plano de aula em espanhol (plan de clase)', text:'Crie, em espanhol, um plano de aula sobre [TEMA] para alunos do [ANO/SÉRIE] no nível [NÍVEL DOS ALUNOS], incluindo objetivo, atividade de aquecimento, explicação, atividade prática e avaliação.'},
    {subject:'espanhol', cat:'exercicios', title:'Exercícios de gramática ou vocabulário', text:'Crie [QUANTIDADE DE QUESTÕES] exercícios em espanhol sobre [TEMA] (gramática ou vocabulário) para alunos do [ANO/SÉRIE] no nível [NÍVEL DOS ALUNOS], divididos em fácil, médio e difícil, com gabarito.'},
    {subject:'espanhol', cat:'avaliacao', title:'Prova com texto para interpretação', text:'Elabore uma prova de espanhol sobre [TEMA] para alunos do [ANO/SÉRIE] no nível [NÍVEL DOS ALUNOS], com [QUANTIDADE DE QUESTÕES] questões, incluindo um pequeno texto para interpretação e questões de gramática.'},
    {subject:'espanhol', cat:'adaptada', title:'Texto simplificado em espanhol', text:'Adapte um texto em espanhol sobre [TEMA] para um aluno com [NECESSIDADE ESPECÍFICA] ou nível [NÍVEL DOS ALUNOS] mais básico, simplificando vocabulário e estruturas, mantendo o sentido original.'},
    {subject:'espanhol', cat:'resumo', title:'Resumo de vocabulário com tradução', text:'Crie um resumo de vocabulário e expressões em espanhol sobre [TEMA], com tradução para o português, para alunos do [ANO/SÉRIE] no nível [NÍVEL DOS ALUNOS].'},
    {subject:'espanhol', cat:'projeto', title:'Projeto de produção oral ou escrita', text:'Crie uma proposta de projeto de produção oral ou escrita em espanhol sobre [TEMA] para alunos do [ANO/SÉRIE], com etapas, critérios de avaliação e sugestão de apresentação final.'},
    {subject:'espanhol', cat:'ludica', title:'Jogo de vocabulário em espanhol', text:'Crie um jogo em espanhol para praticar vocabulário sobre [TEMA] com alunos do [ANO/SÉRIE] no nível [NÍVEL DOS ALUNOS], explicando regras e materiais necessários.'},

    /* ---------------- ARTES ---------------- */
    {subject:'artes', cat:'plano', title:'Plano de aula de Artes', text:'Crie um plano de aula de Artes sobre [TEMA] para alunos do [ANO/SÉRIE], incluindo objetivo, habilidade da BNCC, contextualização (artista, movimento ou técnica), atividade prática e avaliação.'},
    {subject:'artes', cat:'exercicios', title:'Questões teóricas sobre história da arte', text:'Crie [QUANTIDADE DE QUESTÕES] questões teóricas sobre [TEMA] de Artes (história da arte, elementos visuais etc.) para alunos do [ANO/SÉRIE], divididas em fácil, médio e difícil, com gabarito.'},
    {subject:'artes', cat:'avaliacao', title:'Avaliação teórica e prática', text:'Elabore uma avaliação de Artes sobre [TEMA] para alunos do [ANO/SÉRIE], combinando questões teóricas e critérios claros para avaliar uma produção artística prática relacionada ao tema.'},
    {subject:'artes', cat:'adaptada', title:'Atividade artística com materiais alternativos', text:'Adapte uma atividade artística sobre [TEMA] para um aluno com [NECESSIDADE ESPECÍFICA], sugerindo materiais alternativos e ajustes na técnica sem alterar o objetivo criativo da atividade.'},
    {subject:'artes', cat:'resumo', title:'Resumo sobre movimento, técnica ou artista', text:'Crie um resumo sobre [TEMA] de Artes (movimento artístico, técnica ou artista) para alunos do [ANO/SÉRIE], com linguagem acessível e principais características a serem observadas em obras relacionadas.'},
    {subject:'artes', cat:'projeto', title:'Projeto artístico com etapas de criação', text:'Crie uma proposta de projeto artístico sobre [TEMA] para alunos do [ANO/SÉRIE], com etapas de criação, materiais sugeridos e critérios de avaliação da produção final.'},
    {subject:'artes', cat:'ludica', title:'Atividade de apreciação ou criação artística', text:'Crie uma atividade lúdica de apreciação ou criação artística sobre [TEMA] para alunos do [ANO/SÉRIE], que possa ser feita em uma aula de [DURAÇÃO DA AULA].'},

    /* ---------------- EDUCAÇÃO FÍSICA ---------------- */
    {subject:'edfisica', cat:'plano', title:'Plano de aula de Educação Física', text:'Crie um plano de aula de Educação Física sobre [TEMA] (esporte, jogo ou capacidade física) para alunos do [ANO/SÉRIE], incluindo objetivo, aquecimento, atividade principal, volta à calma e avaliação.'},
    {subject:'edfisica', cat:'exercicios', title:'Questões teóricas sobre regras e história', text:'Crie uma sequência de [QUANTIDADE DE QUESTÕES] exercícios teóricos sobre [TEMA] de Educação Física (regras, história do esporte etc.) para alunos do [ANO/SÉRIE], divididos em fácil, médio e difícil, com gabarito.'},
    {subject:'edfisica', cat:'avaliacao', title:'Critérios de avaliação prática e teórica', text:'Elabore critérios de avaliação prática e teórica sobre [TEMA] de Educação Física para alunos do [ANO/SÉRIE], considerando participação, desempenho motor e uma parte teórica curta sobre regras ou conceitos.'},
    {subject:'edfisica', cat:'adaptada', title:'Atividade física adaptada e inclusiva', text:'Adapte uma atividade de Educação Física sobre [TEMA] para um aluno com [NECESSIDADE ESPECÍFICA], propondo variações seguras que permitam a participação dele junto com a turma.'},
    {subject:'edfisica', cat:'resumo', title:'Resumo de regras e conceitos básicos', text:'Crie um resumo sobre as regras e conceitos básicos de [TEMA] para alunos do [ANO/SÉRIE], em linguagem simples, destacando os pontos mais importantes.'},
    {subject:'edfisica', cat:'projeto', title:'Torneio ou projeto esportivo na escola', text:'Crie uma proposta de projeto ou torneio sobre [TEMA] para alunos do [ANO/SÉRIE], incluindo organização das equipes, regras adaptadas e forma de avaliação da participação.'},
    {subject:'edfisica', cat:'ludica', title:'Jogo ou brincadeira sobre o tema', text:'Crie um jogo ou brincadeira sobre [TEMA] para alunos do [ANO/SÉRIE], adequado ao espaço disponível na escola, explicando regras, materiais e tempo estimado.'},

    /* ---------------- TECNOLOGIA ---------------- */
    {subject:'tecnologia', cat:'plano', title:'Plano de aula de Tecnologia', text:'Crie um plano de aula sobre [TEMA] de Informática/Tecnologia para alunos do [ANO/SÉRIE], incluindo objetivo, explicação do conceito, uma atividade prática no computador ou sem uso de tela e avaliação.'},
    {subject:'tecnologia', cat:'exercicios', title:'Questões sobre lógica e uso seguro da internet', text:'Crie [QUANTIDADE DE QUESTÕES] questões sobre [TEMA] de Tecnologia (lógica de programação, uso seguro da internet etc.) para alunos do [ANO/SÉRIE], divididas em fácil, médio e difícil, com gabarito.'},
    {subject:'tecnologia', cat:'avaliacao', title:'Avaliação teórica e tarefa prática', text:'Elabore uma avaliação sobre [TEMA] de Tecnologia para alunos do [ANO/SÉRIE], com [QUANTIDADE DE QUESTÕES] questões teóricas e uma tarefa prática simples relacionada ao tema.'},
    {subject:'tecnologia', cat:'adaptada', title:'Atividade offline sem uso de computador', text:'Adapte uma atividade de Tecnologia sobre [TEMA] para um aluno com [NECESSIDADE ESPECÍFICA] ou sem acesso a computador em casa, propondo uma versão que possa ser feita apenas com papel ou de forma offline.'},
    {subject:'tecnologia', cat:'resumo', title:'Resumo de conceitos de tecnologia', text:'Crie um resumo sobre [TEMA] de Tecnologia para alunos do [ANO/SÉRIE], com linguagem simples, principais conceitos e exemplos do uso desse conteúdo no dia a dia.'},
    {subject:'tecnologia', cat:'projeto', title:'Projeto de criação digital', text:'Crie uma proposta de projeto sobre [TEMA] de Tecnologia para alunos do [ANO/SÉRIE], como a criação de um pequeno programa, jogo ou apresentação digital, com etapas e critérios de avaliação.'},
    {subject:'tecnologia', cat:'ludica', title:'Atividade desplugada de pensamento computacional', text:'Crie uma atividade desplugada (sem uso de computador) para ensinar [TEMA] de pensamento computacional para alunos do [ANO/SÉRIE], explicando materiais e passo a passo.'},

    /* ---------------- FILOSOFIA ---------------- */
    {subject:'filosofia', cat:'plano', title:'Plano de aula de Filosofia', text:'Crie um plano de aula de Filosofia sobre [TEMA] para alunos do [ANO/SÉRIE], incluindo objetivo, contextualização do conceito ou filósofo, uma pergunta disparadora para debate e avaliação.'},
    {subject:'filosofia', cat:'exercicios', title:'Questões com análise de trecho filosófico', text:'Crie [QUANTIDADE DE QUESTÕES] questões sobre [TEMA] de Filosofia para alunos do [ANO/SÉRIE], divididas em fácil, médio e difícil, incluindo ao menos uma questão de análise de um trecho de texto filosófico, com gabarito comentado.'},
    {subject:'filosofia', cat:'avaliacao', title:'Avaliação dissertativa e argumentativa', text:'Elabore uma avaliação de Filosofia sobre [TEMA] para alunos do [ANO/SÉRIE], com [QUANTIDADE DE QUESTÕES] questões dissertativas que estimulem a argumentação dos alunos.'},
    {subject:'filosofia', cat:'adaptada', title:'Explicação filosófica com exemplos do cotidiano', text:'Reescreva uma explicação sobre [TEMA] de Filosofia de forma mais simples para um aluno com [NECESSIDADE ESPECÍFICA], usando exemplos do cotidiano para substituir termos abstratos.'},
    {subject:'filosofia', cat:'resumo', title:'Resumo de conceitos e filósofos', text:'Crie um resumo sobre [TEMA] de Filosofia para alunos do [ANO/SÉRIE], explicando os principais conceitos e, se houver, as ideias centrais do(s) filósofo(s) relacionados ao tema.'},
    {subject:'filosofia', cat:'projeto', title:'Debate ou seminário filosófico', text:'Crie uma proposta de debate ou seminário sobre [TEMA] de Filosofia para alunos do [ANO/SÉRIE], com perguntas norteadoras, divisão de grupos com posições diferentes e critérios de avaliação.'},
    {subject:'filosofia', cat:'ludica', title:'Dinâmica de perguntas reflexivas', text:'Crie uma dinâmica ou jogo de perguntas reflexivas sobre [TEMA] de Filosofia para alunos do [ANO/SÉRIE], que estimule a discussão em grupo.'},

    /* ---------------- SOCIOLOGIA ---------------- */
    {subject:'sociologia', cat:'plano', title:'Plano de aula de Sociologia', text:'Crie um plano de aula de Sociologia sobre [TEMA] para alunos do [ANO/SÉRIE], incluindo objetivo, contextualização do conceito sociológico, uma atividade prática relacionando o tema à realidade dos alunos e avaliação.'},
    {subject:'sociologia', cat:'exercicios', title:'Lista de questões sobre o tema', text:'Crie [QUANTIDADE DE QUESTÕES] questões sobre [TEMA] de Sociologia para alunos do [ANO/SÉRIE], divididas em fácil, médio e difícil, com gabarito comentado.'},
    {subject:'sociologia', cat:'avaliacao', title:'Avaliação dissertativa com exemplos atuais', text:'Elabore uma avaliação de Sociologia sobre [TEMA] para alunos do [ANO/SÉRIE], com [QUANTIDADE DE QUESTÕES] questões dissertativas que relacionem o conceito estudado a exemplos da sociedade atual.'},
    {subject:'sociologia', cat:'adaptada', title:'Explicação sociológica simplificada', text:'Reescreva uma explicação sobre [TEMA] de Sociologia de forma mais simples para um aluno com [NECESSIDADE ESPECÍFICA], utilizando exemplos concretos e evitando jargões técnicos sem explicação.'},
    {subject:'sociologia', cat:'resumo', title:'Resumo de conceitos e autores', text:'Crie um resumo sobre [TEMA] de Sociologia para alunos do [ANO/SÉRIE], explicando os principais conceitos e autores relacionados, quando houver, de forma acessível.'},
    {subject:'sociologia', cat:'projeto', title:'Pesquisa de campo ou entrevista', text:'Crie uma proposta de pesquisa de campo ou entrevista sobre [TEMA] de Sociologia para alunos do [ANO/SÉRIE], com roteiro de perguntas, etapas e forma de apresentação dos resultados.'},
    {subject:'sociologia', cat:'ludica', title:'Dinâmica de grupo sobre o conceito', text:'Crie uma dinâmica de grupo sobre [TEMA] de Sociologia para alunos do [ANO/SÉRIE], que ajude a discutir o conceito de forma prática e participativa.'}
  ];

  // IA por matéria — recomendações de ferramentas
  var IA_MATERIA = [
    {subject:'portugues', tools:[
      {name:'ChatGPT ou Claude', level:'muito', use:'Geram textos de apoio, resumos e roteiros de redação. ', example:'Peça um roteiro de redação dissertativo-argumentativa sobre um tema atual, com sugestões de repertório sociocultural.'},
      {name:'NotebookLM', level:'adequada', use:'Organizar textos e livros enviados pelo professor, gerando resumos e perguntas de estudo a partir desse material.', example:'Envie um conto e peça um roteiro de perguntas de interpretação baseado apenas nesse texto.'}
    ]},
    {subject:'matematica', tools:[
      {name:'ChatGPT, Claude ou Gemini', level:'adequada', use:'Explicar conceitos passo a passo e gerar listas de exercícios organizadas por dificuldade.', example:'Peça a explicação de um método de resolução com um exemplo resolvido linha a linha.', note:'Modelos de IA podem errar em cálculos mais complexos — sempre confira as contas antes de usar com os alunos.'},
      {name:'Microsoft Copilot (Excel/Word)', level:'util', use:'Organizar planilhas de notas e gerar gráficos simples de desempenho da turma.', example:'Peça uma fórmula para calcular a média da turma automaticamente em uma planilha.'}
    ]},
    {subject:'geografia', tools:[
      {name:'ChatGPT, Claude ou Gemini', level:'muito', use:'Criar roteiros de aula, comparar dados entre regiões e propor atividades com uso de mapas.', example:'Peça uma comparação entre dois biomas brasileiros organizada em forma de tabela.'},
      {name:'NotebookLM', level:'adequada', use:'Resumir relatórios ou documentos enviados pelo professor sobre um tema geográfico específico.', example:'Envie um relatório sobre desmatamento e peça um resumo em tópicos para os alunos.'},
      {name:'Canva com IA', level:'util', use:'Criar infográficos e mapas ilustrativos simples para apoiar a explicação do conteúdo.', example:'Gerar um infográfico simples sobre o ciclo da água.'}
    ]},
    {subject:'historia', tools:[
      {name:'ChatGPT ou Claude', level:'muito', use:'Criar linhas do tempo, roteiros de aula e análises de trechos de fontes históricas fornecidas pelo professor.', example:'Envie um trecho de um documento histórico e peça perguntas de interpretação sobre ele.'},
      {name:'Perplexity', level:'adequada', use:'Pesquisar rapidamente sobre eventos históricos, já com indicação das fontes usadas na resposta.', example:'Perguntar sobre datas e desdobramentos de um evento histórico, conferindo depois as fontes indicadas.'}
    ]},
    {subject:'ciencias', tools:[
      {name:'ChatGPT, Claude ou Gemini', level:'muito', use:'Explicar conceitos científicos e propor roteiros de experimentos simples e seguros.', example:'Peça um roteiro de experimento sobre densidade usando apenas materiais recicláveis.'},
      {name:'Perplexity', level:'adequada', use:'Checar informações científicas mais recentes, já com indicação de fontes consultadas.', example:'Confirmar um dado científico atualizado antes de usá-lo em uma aula.'}
    ]},
    {subject:'biologia', tools:[
      {name:'ChatGPT ou Claude', level:'muito', use:'Explicar processos biológicos, propor estudos de caso e gerar questões sobre o conteúdo.', example:'Peça um estudo de caso sobre um problema ambiental para discutir ecologia com a turma.'},
      {name:'Perplexity', level:'adequada', use:'Buscar dados atualizados sobre temas como genética ou saúde, com indicação de fontes.', example:'Verificar um dado estatístico atual sobre um tema de saúde pública.'}
    ]},
    {subject:'quimica', tools:[
      {name:'ChatGPT ou Claude', level:'adequada', use:'Explicar reações químicas de forma didática e gerar listas de exercícios.', example:'Peça a explicação de um tipo de reação química usando um exemplo do cotidiano.', note:'Sempre confira fórmulas, equações balanceadas e cálculos estequiométricos gerados pela IA.'},
      {name:'Gemini', level:'util', use:'Oferecer uma segunda explicação, com outra abordagem, para um mesmo conceito.', example:'Pedir uma explicação alternativa, com outra analogia, para um conceito considerado difícil.'}
    ]},
    {subject:'fisica', tools:[
      {name:'ChatGPT ou Claude', level:'adequada', use:'Explicar conceitos físicos e resolver problemas passo a passo.', example:'Peça a resolução comentada de um problema de cinemática.', note:'Revise sempre fórmulas e cálculos antes de apresentar o material aos alunos.'},
      {name:'Perplexity', level:'util', use:'Pesquisar aplicações reais e atuais de um conceito físico no dia a dia.', example:'Buscar exemplos atuais de aplicação de energia renovável relacionados ao conteúdo.'}
    ]},
    {subject:'ingles', tools:[
      {name:'ChatGPT ou Claude', level:'muito', use:'Simular pequenas conversas em inglês, corrigir textos e gerar exercícios de vocabulário e gramática.', example:'Peça um diálogo simples em inglês sobre um tema do cotidiano, no nível da turma.'},
      {name:'Microsoft Copilot (Word)', level:'util', use:'Auxiliar na revisão de textos em inglês escritos pelos alunos.', example:'Pedir sugestões de correção gramatical para um texto colado no Word.'}
    ]},
    {subject:'espanhol', tools:[
      {name:'ChatGPT ou Claude', level:'muito', use:'Gerar diálogos, exercícios de vocabulário e gramática em espanhol.', example:'Peça um pequeno diálogo em espanhol sobre uma situação do cotidiano dos alunos.'},
      {name:'Gemini', level:'adequada', use:'Explicar regras gramaticais de outra forma, quando a primeira explicação não for suficiente.', example:'Pedir uma segunda explicação para uma regra de conjugação verbal.'}
    ]},
    {subject:'artes', tools:[
      {name:'Canva com recursos de IA', level:'muito', use:'Criar referências visuais, moodboards e materiais gráficos para apoiar a explicação da aula.', example:'Gerar um moodboard com referências visuais de um estilo ou movimento artístico específico.'},
      {name:'ChatGPT ou Claude', level:'adequada', use:'Pesquisar e explicar sobre movimentos artísticos e biografias de artistas.', example:'Peça um resumo sobre as principais características de um movimento artístico.'}
    ]},
    {subject:'edfisica', tools:[
      {name:'ChatGPT ou Claude', level:'adequada', use:'Criar planos de aula, explicar regras de esportes e sugerir adaptações de atividades físicas.', example:'Peça uma adaptação de um jogo para incluir um aluno com mobilidade reduzida.', note:'Ferramentas de IA não substituem a orientação prática e a supervisão do professor durante a atividade física.'}
    ]},
    {subject:'tecnologia', tools:[
      {name:'ChatGPT ou Claude', level:'muito', use:'Explicar lógica de programação, gerar exercícios de pensamento computacional e sugerir atividades desplugadas.', example:'Peça uma atividade desplugada para ensinar o conceito de algoritmo sem usar computador.'},
      {name:'Ferramentas de IA para código (como GitHub Copilot)', level:'util', use:'Ajudar professores que já programam a criar pequenos exemplos de código para a aula.', example:'Gerar um exemplo simples de código para demonstrar um conceito de lógica de programação.'}
    ]},
    {subject:'filosofia', tools:[
      {name:'ChatGPT ou Claude', level:'muito', use:'Explicar conceitos filosóficos, propor perguntas de debate e resumir correntes de pensamento.', example:'Peça três perguntas para provocar um debate em sala sobre um conceito filosófico estudado.'},
      {name:'Perplexity', level:'adequada', use:'Checar referências e citações atribuídas a filósofos antes de usá-las em aula.', example:'Confirmar se uma citação atribuída a um filósofo é realmente dele.'}
    ]},
    {subject:'sociologia', tools:[
      {name:'ChatGPT ou Claude', level:'muito', use:'Explicar conceitos sociológicos e relacionar teorias a fatos sociais atuais.', example:'Peça uma explicação de um conceito sociológico usando um exemplo da atualidade.'},
      {name:'Perplexity', level:'adequada', use:'Pesquisar dados e estatísticas sociais atualizadas, com indicação de fontes.', example:'Buscar dados recentes sobre um tema social específico para discutir em aula.'}
    ]}
  ];

  var LEVEL_LABEL = {muito:'Muito adequada', adequada:'Adequada', util:'Pode ser útil'};

  function subjectById(id){
    for(var i=0;i<SUBJECTS.length;i++){ if(SUBJECTS[i].id===id) return SUBJECTS[i]; }
    return null;
  }

  /* ---------- 2. NAVEGAÇÃO ---------- */

  var pages = document.querySelectorAll('.page');
  var navLinks = document.querySelectorAll('[data-nav]');
  var mobileNav = document.getElementById('mobileNav');
  var menuToggle = document.getElementById('menuToggle');

  function showPage(id){
    var found = false;
    pages.forEach(function(p){
      if(p.id === id){ p.classList.add('active'); found = true; }
      else{ p.classList.remove('active'); }
    });
    if(!found){ document.getElementById('inicio').classList.add('active'); id = 'inicio'; }

    navLinks.forEach(function(a){
      if(a.getAttribute('data-target') === id){ a.setAttribute('aria-current','page'); }
      else{ a.removeAttribute('aria-current'); }
    });

    closeMobileMenu();
    window.scrollTo({top:0, behavior:'auto'});
  }

  // Navega para uma aba principal (hub), sem matéria selecionada
  function goTo(id){
    if(window.location.hash !== '#'+id){
      window.location.hash = id;
    } else {
      router();
    }
  }

  // Navega para a página dedicada de uma matéria dentro de uma aba (prompts ou por-materia)
  function goToSubject(section, subjectId){
    var target = section + '/' + subjectId;
    if(window.location.hash !== '#'+target){
      window.location.hash = target;
    } else {
      router();
    }
  }

  navLinks.forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      goTo(a.getAttribute('data-target'));
    });
  });

  // Roteador central: lê o hash (ex.: "prompts/matematica") e decide o que mostrar
  function router(){
    var hash = window.location.hash.replace('#','') || 'inicio';
    var parts = hash.split('/');
    var pageId = parts[0];
    var subjectId = parts[1] || null;

    showPage(pageId);

    if(pageId === 'prompts'){ renderPromptsRoute(subjectId); }
    if(pageId === 'por-materia'){ renderMateriaRoute(subjectId); }
  }

  window.addEventListener('hashchange', router);

  function openMobileMenu(){
    mobileNav.classList.add('open');
    menuToggle.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu(){
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }
  menuToggle.addEventListener('click', function(){
    if(mobileNav.classList.contains('open')) closeMobileMenu();
    else openMobileMenu();
  });

  function normalize(str){
    return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  }

  /* ---------- 3. BIBLIOTECA DE PROMPTS (uma página por matéria) ---------- */

  // monta lista completa com dados derivados (nome/ícone da matéria, categoria, descrição)
  var ALL_PROMPTS = PROMPTS.map(function(p, idx){
    var subj = subjectById(p.subject);
    var cat = CATEGORIES[p.cat];
    return {
      idx: idx,
      subjectId: p.subject,
      subjectName: subj.name,
      subjectIcon: subj.icon,
      catId: p.cat,
      catLabel: cat.label,
      catIcon: cat.icon,
      title: p.title,
      desc: cat.desc(subj.name),
      text: p.text
    };
  });

  var promptsHubEl = document.getElementById('promptsHub');
  var promptsDetailEl = document.getElementById('promptsDetail');
  var promptsSubjectHub = document.getElementById('promptsSubjectHub');
  var promptsDetailHead = document.getElementById('promptsDetailHead');
  var catFilterEl = document.getElementById('catFilter');
  var promptSearchEl = document.getElementById('promptSearch');
  var grid = document.getElementById('promptsGrid');
  var countEl = document.getElementById('resultsCount');

  // Preenche filtro de finalidade (uma vez)
  Object.keys(CATEGORIES).forEach(function(key){
    var opt = document.createElement('option');
    opt.value = key;
    opt.textContent = CATEGORIES[key].icon + ' ' + CATEGORIES[key].label;
    catFilterEl.appendChild(opt);
  });

  // Monta o hub (grade de matérias) da biblioteca de prompts
  function buildPromptsHub(){
    promptsSubjectHub.innerHTML = SUBJECTS.map(function(s){
      var count = ALL_PROMPTS.filter(function(p){ return p.subjectId === s.id; }).length;
      return (
        '<button class="subject-hub-card" type="button" data-subject="' + s.id + '">' +
          '<span class="hub-ic">' + s.icon + '</span>' +
          '<span class="hub-name">' + s.name + '</span>' +
          '<span class="hub-count">' + count + ' prompts</span>' +
        '</button>'
      );
    }).join('');
  }
  buildPromptsHub();

  promptsSubjectHub.addEventListener('click', function(e){
    var btn = e.target.closest('.subject-hub-card');
    if(!btn) return;
    goToSubject('prompts', btn.dataset.subject);
  });

  document.getElementById('hubSearchPrompts').addEventListener('input', function(e){
    filterSubjectHub(promptsSubjectHub, e.target.value);
  });
  document.getElementById('hubSearchMateria').addEventListener('input', function(e){
    filterSubjectHub(materiaSubjectHub, e.target.value);
  });
  function filterSubjectHub(hubEl, query){
    var q = normalize(query.trim());
    var cards = hubEl.querySelectorAll('.subject-hub-card');
    var visibleCount = 0;
    cards.forEach(function(card){
      var name = normalize(card.querySelector('.hub-name').textContent);
      var match = !q || name.indexOf(q) !== -1;
      card.style.display = match ? '' : 'none';
      if(match) visibleCount++;
    });
  }

  document.getElementById('promptsBack').addEventListener('click', function(){ goTo('prompts'); });

  var promptState = { subject:null, query:'', cat:'all' };
  var currentList = [];

  promptSearchEl.addEventListener('input', function(e){
    promptState.query = e.target.value;
    applyFilters();
  });
  catFilterEl.addEventListener('change', function(e){
    promptState.cat = e.target.value;
    applyFilters();
  });
  document.getElementById('clearFilters').addEventListener('click', function(){
    promptState.query = '';
    promptState.cat = 'all';
    promptSearchEl.value = '';
    catFilterEl.value = 'all';
    applyFilters();
  });

  // Mostra o hub ou a página de uma matéria específica, de acordo com o hash
  function renderPromptsRoute(subjectId){
    var subj = subjectId ? subjectById(subjectId) : null;

    if(!subj){
      promptsHubEl.hidden = false;
      promptsDetailEl.hidden = true;
      return;
    }

    promptsHubEl.hidden = true;
    promptsDetailEl.hidden = false;

    promptState.subject = subj.id;
    promptState.query = '';
    promptState.cat = 'all';
    promptSearchEl.value = '';
    catFilterEl.value = 'all';

    promptsDetailHead.innerHTML =
      '<span class="hub-ic">' + subj.icon + '</span>' +
      '<div><h2>Prompts de ' + subj.name + '</h2>' +
      '<p>7 prompts prontos para copiar e adaptar às suas turmas.</p></div>';

    applyFilters();
  }

  function applyFilters(){
    var q = normalize(promptState.query.trim());
    currentList = ALL_PROMPTS.filter(function(p){
      if(p.subjectId !== promptState.subject) return false;
      if(promptState.cat !== 'all' && p.catId !== promptState.cat) return false;
      if(q){
        var haystack = normalize(p.title + ' ' + p.desc + ' ' + p.text + ' ' + p.catLabel);
        if(haystack.indexOf(q) === -1) return false;
      }
      return true;
    });
    renderPrompts();
  }

  function highlight(text){
    var escaped = text
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return escaped.replace(/\[([^\]]+)\]/g, '<mark class="ph">[$1]</mark>');
  }

  function renderPrompts(){
    var total = ALL_PROMPTS.filter(function(p){ return p.subjectId === promptState.subject; }).length;
    countEl.innerHTML = 'Mostrando <strong>' + currentList.length + '</strong> de ' + total + ' prompts';

    if(currentList.length === 0){
      grid.innerHTML = '<div class="no-results"><span class="big">🐝</span>Nenhum prompt encontrado com esses filtros.<br>Tente ajustar a busca ou limpar os filtros.</div>';
      return;
    }

    var html = currentList.map(function(p, i){
      return (
        '<article class="prompt-card">' +
          '<div class="prompt-card-head">' +
            '<span class="tag tag-subject">' + p.subjectIcon + ' ' + p.subjectName + '</span>' +
            '<span class="tag tag-cat">' + p.catIcon + ' ' + p.catLabel + '</span>' +
          '</div>' +
          '<h3 class="prompt-title">' + p.title + '</h3>' +
          '<p class="prompt-desc">' + p.desc + '</p>' +
          '<button class="btn-toggle" data-action="toggle" data-i="' + i + '" aria-expanded="false">Ver prompt completo <span class="chev">▾</span></button>' +
          '<div class="prompt-body" id="pbody-' + i + '">' +
            '<div class="prompt-body-inner">' +
              '<p class="prompt-text">' + highlight(p.text) + '</p>' +
              '<button class="btn-copy" data-action="copy" data-i="' + i + '">📋 Copiar prompt</button>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    grid.innerHTML = html;
  }

  grid.addEventListener('click', function(e){
    var btn = e.target.closest('button[data-action]');
    if(!btn) return;
    var i = parseInt(btn.dataset.i, 10);
    var item = currentList[i];
    if(!item) return;

    if(btn.dataset.action === 'toggle'){
      var body = document.getElementById('pbody-' + i);
      var isOpen = body.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      btn.innerHTML = isOpen ? 'Ocultar prompt <span class="chev">▾</span>' : 'Ver prompt completo <span class="chev">▾</span>';
    }

    if(btn.dataset.action === 'copy'){
      copyToClipboard(item.text, btn);
    }
  });

  /* ---------- 5. COPIAR PARA A ÁREA DE TRANSFERÊNCIA ---------- */
  function copyToClipboard(text, btn){
    function onSuccess(){
      var original = btn.textContent;
      btn.textContent = '✅ Copiado!';
      btn.classList.add('copied');
      setTimeout(function(){
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1800);
    }
    function fallback(){
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try{ document.execCommand('copy'); onSuccess(); }
      catch(err){ btn.textContent = '⚠️ Copie manualmente'; }
      document.body.removeChild(ta);
    }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(onSuccess).catch(fallback);
    } else {
      fallback();
    }
  }

  /* ---------- 4. IA POR MATÉRIA (uma página por matéria) ---------- */

  var materiaHubEl = document.getElementById('materiaHub');
  var materiaDetailEl = document.getElementById('materiaDetail');
  var materiaSubjectHub = document.getElementById('materiaSubjectHub');
  var materiaDetailHead = document.getElementById('materiaDetailHead');
  var materiaGrid = document.getElementById('materiaGrid');

  function buildMateriaHub(){
    materiaSubjectHub.innerHTML = SUBJECTS.map(function(s){
      var entry = IA_MATERIA.filter(function(m){ return m.subject === s.id; })[0];
      var count = entry ? entry.tools.length : 0;
      return (
        '<button class="subject-hub-card" type="button" data-subject="' + s.id + '">' +
          '<span class="hub-ic">' + s.icon + '</span>' +
          '<span class="hub-name">' + s.name + '</span>' +
          '<span class="hub-count">' + count + ' ferramenta' + (count === 1 ? '' : 's') + '</span>' +
        '</button>'
      );
    }).join('');
  }
  buildMateriaHub();

  materiaSubjectHub.addEventListener('click', function(e){
    var btn = e.target.closest('.subject-hub-card');
    if(!btn) return;
    goToSubject('por-materia', btn.dataset.subject);
  });

  document.getElementById('materiaBack').addEventListener('click', function(){ goTo('por-materia'); });

  function materiaCardHtml(m){
    var subj = subjectById(m.subject);
    var toolsHtml = m.tools.map(function(t){
      return (
        '<div class="tool-block">' +
          '<div class="tool-name-row">' +
            '<span class="tool-name">' + t.name + '</span>' +
            '<span class="level-badge ' + t.level + '">' + LEVEL_LABEL[t.level] + '</span>' +
          '</div>' +
          '<p class="tool-use">' + t.use + '</p>' +
          '<p class="tool-example">"' + t.example + '"</p>' +
          (t.note ? '<p class="tool-note">⚠️ ' + t.note + '</p>' : '') +
        '</div>'
      );
    }).join('');

    return (
      '<div class="materia-card reveal in-view">' +
        '<div class="materia-head">' +
          '<span class="ic">' + subj.icon + '</span>' +
          '<h3>' + subj.name + '</h3>' +
        '</div>' +
        toolsHtml +
      '</div>'
    );
  }

  function renderMateriaRoute(subjectId){
    var subj = subjectId ? subjectById(subjectId) : null;

    if(!subj){
      materiaHubEl.hidden = false;
      materiaDetailEl.hidden = true;
      return;
    }

    materiaHubEl.hidden = true;
    materiaDetailEl.hidden = false;

    materiaDetailHead.innerHTML =
      '<span class="hub-ic">' + subj.icon + '</span>' +
      '<div><h2>IA para ' + subj.name + '</h2>' +
      '<p>Ferramentas que tendem a ajudar mais nessa disciplina, com exemplos de uso.</p></div>';

    var entry = IA_MATERIA.filter(function(m){ return m.subject === subj.id; })[0];
    materiaGrid.innerHTML = entry ? materiaCardHtml(entry) : '<p class="hub-empty">Em breve, novas recomendações para esta matéria.</p>';
  }

  // Primeira renderização, de acordo com o hash atual da URL
  router();

  /* ---------- 6. SCROLL REVEAL ---------- */
  if('IntersectionObserver' in window){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:0.12});

    document.addEventListener('DOMContentLoaded', function(){
      document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });
    });
    // caso o script rode após DOMContentLoaded
    if(document.readyState !== 'loading'){
      document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });
    }
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in-view'); });
  }

})();
