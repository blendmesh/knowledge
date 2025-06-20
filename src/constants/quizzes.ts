export const mockQuizzes = [
  // Fundamentos Terraform
  {
    courseId: "a18be5d8-843f-480e-8be6-ec4454c12d43",
    questions: [
      {
        id: "tf1",
        type: "multiple",
        question: "O que é o Terraform?",
        options: [
          "Uma linguagem de programação",
          "Uma ferramenta de infraestrutura como código",
          "Um serviço de nuvem",
          "Um sistema operacional"
        ],
        correct: "Uma ferramenta de infraestrutura como código"
      },
      {
        id: "tf2",
        type: "multiple",
        question: "Qual comando inicializa um diretório Terraform?",
        options: [
          "terraform start",
          "terraform init",
          "terraform plan",
          "terraform apply"
        ],
        correct: "terraform init"
      },
      {
        id: "tf3",
        type: "multiple",
        question: "Qual comando mostra as mudanças que serão feitas sem aplicá-las?",
        options: [
          "terraform plan",
          "terraform apply",
          "terraform destroy",
          "terraform validate"
        ],
        correct: "terraform plan"
      },
      {
        id: "tf4",
        type: "multiple",
        question: "Para que serve o arquivo terraform.tfstate?",
        options: [
          "Armazenar variáveis",
          "Guardar o estado da infraestrutura",
          "Definir provedores",
          "Executar comandos"
        ],
        correct: "Guardar o estado da infraestrutura"
      },
      {
        id: "tf5",
        type: "multiple",
        question: "Como definir uma variável em Terraform?",
        options: [
          "variable \"nome\" {}",
          "var nome = {}",
          "let nome = {}",
          "set nome {}"
        ],
        correct: "variable \"nome\" {}"
      },
      {
        id: "tf6",
        type: "truefalse",
        question: "O Terraform pode ser usado com múltiplos provedores de nuvem.",
        correct: true
      },
      {
        id: "tf7",
        type: "multiple",
        question: "Qual comando destrói todos os recursos gerenciados pelo Terraform?",
        options: [
          "terraform remove",
          "terraform destroy",
          "terraform delete",
          "terraform clean"
        ],
        correct: "terraform destroy"
      },
      {
        id: "tf8",
        type: "multiple",
        question: "O que é um módulo em Terraform?",
        options: [
          "Um arquivo de configuração",
          "Um bloco de código reutilizável",
          "Um comando",
          "Um provedor"
        ],
        correct: "Um bloco de código reutilizável"
      },
      {
        id: "tf9",
        type: "truefalse",
        question: "O comando terraform apply executa as mudanças planejadas.",
        correct: true
      },
      {
        id: "tf10",
        type: "multiple",
        question: "Como referenciar uma variável chamada 'region'?",
        options: [
          "var.region",
          "${region}",
          "region.value",
          "variable.region"
        ],
        correct: "var.region"
      }
    ]
  },

  // Fundamentos Cloudformation
  {
    courseId: "f535d90d-f8b7-4de2-b87c-516fe04eb95e",
    questions: [
      {
        id: "cf1",
        type: "multiple",
        question: "O que é o AWS CloudFormation?",
        options: [
          "Um serviço de banco de dados",
          "Uma ferramenta de infraestrutura como código",
          "Um serviço de monitoramento",
          "Um sistema operacional"
        ],
        correct: "Uma ferramenta de infraestrutura como código"
      },
      {
        id: "cf2",
        type: "multiple",
        question: "Qual formato NÃO é aceito para templates CloudFormation?",
        options: [
          "YAML",
          "JSON",
          "XML",
          "Ambos YAML e JSON são aceitos"
        ],
        correct: "XML"
      },
      {
        id: "cf3",
        type: "multiple",
        question: "O que é um Stack no CloudFormation?",
        options: [
          "Um recurso de rede",
          "Um conjunto de recursos gerenciados como uma unidade",
          "Um bucket S3",
          "Um template"
        ],
        correct: "Um conjunto de recursos gerenciados como uma unidade"
      },
      {
        id: "cf4",
        type: "multiple",
        question: "Como referenciar um parâmetro em um template YAML?",
        options: [
          "!Ref Parametro",
          "${Parametro}",
          "param.Parametro",
          "Parametro.value"
        ],
        correct: "!Ref Parametro"
      },
      {
        id: "cf5",
        type: "truefalse",
        question: "É possível atualizar um Stack existente no CloudFormation.",
        correct: true
      },
      {
        id: "cf6",
        type: "multiple",
        question: "O que é um Change Set?",
        options: [
          "Um template de backup",
          "Um conjunto de alterações propostas antes da aplicação",
          "Um recurso de rede",
          "Uma política de segurança"
        ],
        correct: "Um conjunto de alterações propostas antes da aplicação"
      },
      {
        id: "cf7",
        type: "multiple",
        question: "Qual comando AWS CLI cria um stack?",
        options: [
          "aws cloudformation create-stack",
          "aws cloudformation new-stack",
          "aws cloudformation deploy",
          "aws stack create"
        ],
        correct: "aws cloudformation create-stack"
      },
      {
        id: "cf8",
        type: "multiple",
        question: "O que é Drift Detection?",
        options: [
          "Detectar mudanças não gerenciadas pelo CloudFormation",
          "Detectar falhas de rede",
          "Detectar erros de sintaxe",
          "Detectar mudanças em buckets S3"
        ],
        correct: "Detectar mudanças não gerenciadas pelo CloudFormation"
      },
      {
        id: "cf9",
        type: "truefalse",
        question: "CloudFormation pode criar recursos em múltiplas regiões em um único stack.",
        correct: false
      },
      {
        id: "cf10",
        type: "multiple",
        question: "Qual recurso define valores de saída em um template?",
        options: [
          "Outputs",
          "Parameters",
          "Resources",
          "Mappings"
        ],
        correct: "Outputs"
      }
    ]
  },

  // Microsserviços BBF com Terraform
  {
    courseId: "622ff635-ef47-4ef4-baaa-b00d66df0ce2",
    questions: [
      {
        id: "mt1",
        type: "multiple",
        question: "O que é uma Landing Zone na AWS?",
        options: [
          "Um bucket S3",
          "Uma configuração inicial de contas e redes",
          "Um serviço de banco de dados",
          "Um template CloudFormation"
        ],
        correct: "Uma configuração inicial de contas e redes"
      },
      {
        id: "mt2",
        type: "multiple",
        question: "O que é um workspace em Terraform?",
        options: [
          "Um ambiente isolado de execução",
          "Um arquivo de configuração",
          "Um provedor",
          "Um recurso de rede"
        ],
        correct: "Um ambiente isolado de execução"
      },
      {
        id: "mt3",
        type: "multiple",
        question: "Como dividir uma arquitetura em módulos facilita o uso do Terraform?",
        options: [
          "Permite reutilização e organização do código",
          "Aumenta o tempo de execução",
          "Dificulta o versionamento",
          "Reduz a segurança"
        ],
        correct: "Permite reutilização e organização do código"
      },
      {
        id: "mt4",
        type: "multiple",
        question: "O que é BFF em arquitetura de microsserviços?",
        options: [
          "Backend For Frontend",
          "Best Friend Forever",
          "Backend Function Framework",
          "Basic Frontend Framework"
        ],
        correct: "Backend For Frontend"
      },
      {
        id: "mt5",
        type: "truefalse",
        question: "É possível usar módulos do Terraform para criar múltiplos ambientes (dev, QA, prod).",
        correct: true
      },
      {
        id: "mt6",
        type: "multiple",
        question: "Qual comando seleciona um workspace?",
        options: [
          "terraform workspace select",
          "terraform select workspace",
          "terraform set workspace",
          "terraform workspace use"
        ],
        correct: "terraform workspace select"
      },
      {
        id: "mt7",
        type: "multiple",
        question: "O que é testado em testes de integração de infraestrutura?",
        options: [
          "A existência e configuração dos recursos criados",
          "A performance do código",
          "A sintaxe dos arquivos",
          "A documentação"
        ],
        correct: "A existência e configuração dos recursos criados"
      },
      {
        id: "mt8",
        type: "multiple",
        question: "Como garantir consistência entre ambientes usando Terraform?",
        options: [
          "Utilizando módulos e variáveis",
          "Executando comandos manualmente",
          "Editando o tfstate manualmente",
          "Ignorando arquivos de configuração"
        ],
        correct: "Utilizando módulos e variáveis"
      },
      {
        id: "mt9",
        type: "truefalse",
        question: "O Terraform pode ser integrado a pipelines CI/CD.",
        correct: true
      },
      {
        id: "mt10",
        type: "multiple",
        question: "Qual recurso AWS é usado para isolar redes em uma Landing Zone?",
        options: [
          "VPC",
          "EC2",
          "Lambda",
          "S3"
        ],
        correct: "VPC"
      }
    ]
  },

  // Microsserviços BBF com Cloudformation
  {
    courseId: "aaf1f1c4-18f2-4ed0-aabc-00b6ba12180f",
    questions: [
      {
        id: "mc1",
        type: "multiple",
        question: "O que é um template YAML no CloudFormation?",
        options: [
          "Um arquivo de configuração declarativo",
          "Um script de shell",
          "Um arquivo de imagem",
          "Um bucket S3"
        ],
        correct: "Um arquivo de configuração declarativo"
      },
      {
        id: "mc2",
        type: "multiple",
        question: "O que são micro-stacks em CloudFormation?",
        options: [
          "Stacks menores e independentes",
          "Recursos de rede",
          "Funções Lambda",
          "Buckets S3"
        ],
        correct: "Stacks menores e independentes"
      },
      {
        id: "mc3",
        type: "multiple",
        question: "Como definir parâmetros em um template CloudFormation?",
        options: [
          "Parameters",
          "Outputs",
          "Resources",
          "Mappings"
        ],
        correct: "Parameters"
      },
      {
        id: "mc4",
        type: "multiple",
        question: "O que é um Change Set?",
        options: [
          "Um conjunto de alterações propostas antes da aplicação",
          "Um recurso de rede",
          "Um bucket S3",
          "Um template de backup"
        ],
        correct: "Um conjunto de alterações propostas antes da aplicação"
      },
      {
        id: "mc5",
        type: "truefalse",
        question: "É possível dividir uma aplicação em múltiplos stacks no CloudFormation.",
        correct: true
      },
      {
        id: "mc6",
        type: "multiple",
        question: "Qual recurso AWS é usado para hospedar containers na arquitetura BFF?",
        options: [
          "ECS",
          "S3",
          "Lambda",
          "CloudFront"
        ],
        correct: "ECS"
      },
      {
        id: "mc7",
        type: "multiple",
        question: "O que é Drift Detection?",
        options: [
          "Detectar mudanças não gerenciadas pelo CloudFormation",
          "Detectar falhas de rede",
          "Detectar erros de sintaxe",
          "Detectar mudanças em buckets S3"
        ],
        correct: "Detectar mudanças não gerenciadas pelo CloudFormation"
      },
      {
        id: "mc8",
        type: "multiple",
        question: "Como referenciar um output de outro stack?",
        options: [
          "Usando !ImportValue",
          "Usando !Ref",
          "Usando !GetAtt",
          "Usando !Sub"
        ],
        correct: "Usando !ImportValue"
      },
      {
        id: "mc9",
        type: "truefalse",
        question: "CloudFormation permite versionar a infraestrutura como código.",
        correct: true
      },
      {
        id: "mc10",
        type: "multiple",
        question: "Qual recurso define valores de saída em um template?",
        options: [
          "Outputs",
          "Parameters",
          "Resources",
          "Mappings"
        ],
        correct: "Outputs"
      }
    ]
  }
];