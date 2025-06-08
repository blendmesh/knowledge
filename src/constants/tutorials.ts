export const mockTutorials = [
  {
    "id": "ff9e5d7d-005c-466c-8e32-b30f30a1eb5b",
    "title": "Preparar o ferramental e ambiente",
    "description": "Preparar o ambiente de desenvolvimento: instalação do Terraform, configuração do AWS CLI e organização da estrutura de arquivos do projeto.",
    "tool": "Terraform",
    "level": "iniciante",
    "tags": [
      "Terraform",
      "Ambiente",
      "Fundamentos",
      "AWS"
    ],
    "date": "2025-06-08",
    "url": "/tutorials/ff9e5d7d-005c-466c-8e32-b30f30a1eb5b",
    "markdown": "# Preparar o ferramental e ambiente\n\n## Objetivo\n\nNeste tutorial introdutório, você aprenderá a preparar o seu ambiente de desenvolvimento para trabalhar com o Terraform. Iremos abordar a instalação do Terraform, a configuração do AWS CLI, a organização da estrutura do projeto e a validação do primeiro template.\n\n## Conteúdo\n\n1. Instalando o Terraform\n- Para sistemas Unix/Linux:\n\n```bash\nwget https://releases.hashicorp.com/terraform/1.5.0/terraform_1.5.0_linux_amd64.zip\nunzip terraform_1.5.0_linux_amd64.zip\nsudo mv terraform /usr/local/bin/\n```\n\n- Para Windows:\nBaixe o executável no site da HashiCorp e adicione-o ao PATH do sistema.\n\n2. Instalando e Configurando o AWS CLI\n\n- Instale o AWS CLI baixando o instalador apropriado:\n\n```bash\ncurl \"https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip\" -o \"awscliv2.zip\"\nunzip awscliv2.zip\nsudo ./aws/install\n```\n\n- Configure as credenciais com:\n\n```bash\naws configure\n```\n\n- Informe a Access Key, Secret Key, região (por exemplo, us-east-1) e output format (json, text, etc.).\n\n3. Organizando a Estrutura de Arquivos\n\nCrie uma pasta para o seu projeto e, dentro dela, organize os arquivos da seguinte forma:\n\n```\nmeu-projeto/\n├── main.tf\n├── variables.tf\n├── outputs.tf\n└── terraform.tfvars (opcional)\n```\n\n4. No arquivo main.tf, comece declarando o provider:\n\n```tf\nprovider \"aws\" {\n  region = var.aws_region\n}\n```\n\n5. Validando a Configuração\n\nAbra o terminal, navegue até a pasta do projeto e execute:\n\n```bash\nterraform init\nterraform validate\n```\n\n6. Esses comandos garantem que o Terraform esteja instalado corretamente e que o seu template não contenha erros de sintaxe.\n\n## Conclusão\nCom esses passos, você terá configurado o ambiente para o uso do Terraform e estará pronto para prosseguir para os conceitos básicos. Este tutorial é a base sobre a qual você construirá conhecimentos mais avançados nos vídeos seguintes.\n"
  },
  {
    "id": "723dc4aa-284e-4cb9-9fc5-bc2fb61fb68f",
    "title": "Funções Básicas",
    "description": "Introduzir a construção de recursos utilizando HCL (HashiCorp Configuration Language). Vamos criar uma VPC, subnets e uma instância EC2 como exemplo.",
    "tool": "Terraform",
    "level": "iniciante",
    "tags": [
      "Terraform",
      "Fundamentos",
      "VPC",
      "Subnet",
      "EC2",
      "AWS"
    ],
    "date": "2025-06-08",
    "url": "/tutorials/723dc4aa-284e-4cb9-9fc5-bc2fb61fb68f",
    "markdown": "# preencher"
  },
  {
    "id": "c0b2f47b-7dfb-440c-8276-8690d2a4a1bf",
    "title": "Variáveis e Outputs",
    "description": "Parametrizar nossa infraestrutura usando variáveis de entrada e exibir resultados com outputs. Dessa forma, o código se torna mais flexível e reutilizável.",
    "tool": "Terraform",
    "level": "iniciante",
    "tags": [
      "Terraform",
      "Fundamentos",
      "Variable",
      "Output",
      "AWS"
    ],
    "date": "2025-06-08",
    "url": "/tutorials/c0b2f47b-7dfb-440c-8276-8690d2a4a1bf",
    "markdown": "# preencher"
  },
  {
    "id": "f82224ce-d909-4fea-9bcc-8a353b1b05f7",
    "title": "Terraform State",
    "description": "Compreender como o Terraform gerencia o estado dos recursos, a importância do arquivo de state e como trabalhar com backends remotos.",
    "tool": "Terraform",
    "level": "iniciante",
    "tags": [
      "Terraform",
      "Backend",
      "Fundamentos",
      "AWS"
    ],
    "date": "2025-06-08",
    "url": "/tutorials/f82224ce-d909-4fea-9bcc-8a353b1b05f7",
    "markdown": "# preencher"
  },
  {
    "id": "1ca38694-1270-4b9f-b46f-e16b2847a9db",
    "title": "Provisioners",
    "description": "Ensinar como executar comandos e scripts durante a criação dos recursos, utilizando provisioners como remote-exec e local-exec.",
    "tool": "Terraform",
    "level": "iniciante",
    "tags": [
      "Terraform",
      "Fundamentos",
      "Provisioner",
      "AWS"
    ],
    "date": "2025-06-08",
    "url": "/tutorials/1ca38694-1270-4b9f-b46f-e16b2847a9db",
    "markdown": "# Preencher"
  },
  {
    "id": "d60862af-f596-493e-aa07-46d1ebbff335",
    "title": "Módulos",
    "description": "Ensinar a criação e utilização de módulos no Terraform para modularizar a infraestrutura e melhorar a manutenção do código.",
    "tool": "Terraform",
    "level": "iniciante",
    "tags": [
      "Terraform",
      "Fundamentos",
      "Modules",
      "AWS",
      "VPC"
    ],
    "date": "2025-06-08",
    "url": "/tutorials/d60862af-f596-493e-aa07-46d1ebbff335",
    "markdown": "# Preencher"
  },
  {
    "id": "1d94e151-8ae0-4ab7-b402-313f531d7bd0",
    "title": "Meta Argumentos",
    "description": "Explorar os meta argumentos do Terraform, como  count, for_each, depends_on e lifecycle, que permitem maior controle e lógica na criação de recursos.",
    "tool": "Terraform",
    "level": "iniciante",
    "tags": [
      "Terraform",
      "Fundamentos",
      "Meta_arguments",
      "AWS"
    ],
    "date": "2025-06-08",
    "url": "/tutorials/1d94e151-8ae0-4ab7-b402-313f531d7bd0",
    "markdown": "# preencher"
  },
  {
    "id": "1ea403f4-0d4d-4b0f-9281-87d2cf00328b",
    "title": "Funções e Expressões",
    "description": "Demonstrar o uso das funções embutidas do Terraform e expressões para manipular dados, realizar transformações e lidar com lógicas condicionais.",
    "tool": "Terraform",
    "level": "iniciante",
    "tags": [
      "Terraform",
      "Fundamentos",
      "AWS",
      "Functions"
    ],
    "date": "2025-06-08",
    "url": "/tutorials/1ea403f4-0d4d-4b0f-9281-87d2cf00328b",
    "markdown": "# preencher"
  },
  {
    "id": "72a0de7a-ad07-4797-86d1-477e1581e0cc",
    "title": "Preparar o ferramental e ambiente",
    "description": "preencher",
    "tool": "CloudFormation",
    "level": "iniciante",
    "tags": [
      "Cloudformation",
      "Ambiente",
      "Fundamentos",
      "AWS"
    ],
    "date": "2025-06-08",
    "url": "/tutorials/72a0de7a-ad07-4797-86d1-477e1581e0cc",
    "markdown": "# Preencher"
  },
  {
    "id": "a5f7fbf7-3162-479d-a81c-04492f64c4d4",
    "title": "Introdução ao AWS Cloudformation",
    "description": "Preencher",
    "tool": "CloudFormation",
    "level": "iniciante",
    "tags": [
      "Cloudformation",
      "Ambiente",
      "Fundamentos",
      "AWS"
    ],
    "date": "2025-06-08",
    "url": "/tutorials/a5f7fbf7-3162-479d-a81c-04492f64c4d4",
    "markdown": "# preencher"
  },
  {
    "id": "25e43b39-c9d0-4fda-b38a-5d79d76b7825",
    "title": "Parametrização",
    "description": "Preencher",
    "tool": "CloudFormation",
    "level": "iniciante",
    "tags": [
      "Ambiente",
      "Fundamentos"
    ],
    "date": "2025-06-08",
    "url": "/tutorials/25e43b39-c9d0-4fda-b38a-5d79d76b7825",
    "markdown": "# preencher"
  },
  {
    "id": "70600cf9-b332-41c9-a2ed-eeb74a7ab512",
    "title": "Recursos",
    "description": "Preencher",
    "tool": "CloudFormation",
    "level": "iniciante",
    "tags": [
      "Ambiente",
      "Fundamentos",
      "AWS"
    ],
    "date": "2025-06-08",
    "url": "/tutorials/70600cf9-b332-41c9-a2ed-eeb74a7ab512",
    "markdown": "# Preencher"
  },
  {
    "id": "a3e233b2-822b-4a62-b4f6-61f36fc10f4a",
    "title": "Outputs",
    "description": "Preencher",
    "tool": "CloudFormation",
    "level": "iniciante",
    "tags": [
      "Ambiente",
      "Fundamentos",
      "AWS"
    ],
    "date": "2025-06-08",
    "url": "/tutorials/a3e233b2-822b-4a62-b4f6-61f36fc10f4a",
    "markdown": "# Preencher"
  },
  {
    "id": "63a64568-78d9-45ae-b448-ca9188480966",
    "title": "Mapeamentos",
    "description": "Preencher",
    "tool": "CloudFormation",
    "level": "iniciante",
    "tags": [
      "Ambiente",
      "Fundamentos",
      "AWS"
    ],
    "date": "2025-06-08",
    "url": "/tutorials/63a64568-78d9-45ae-b448-ca9188480966",
    "markdown": "# Preencher"
  },
  {
    "id": "6a882d36-409a-413b-82a5-bd59338ac108",
    "title": "Condições",
    "description": "Preencher",
    "tool": "CloudFormation",
    "level": "iniciante",
    "tags": [
      "Ambiente",
      "Fundamentos",
      "AWS"
    ],
    "date": "2025-06-08",
    "url": "/tutorials/6a882d36-409a-413b-82a5-bd59338ac108",
    "markdown": "# Preencher"
  },
  {
    "id": "15236da4-4326-43aa-9ef6-9aeed8dfe9cc",
    "title": "Cloudformation Drift",
    "description": "Preencher",
    "tool": "CloudFormation",
    "level": "iniciante",
    "tags": [
      "Ambiente",
      "Fundamentos",
      "AWS"
    ],
    "date": "2025-06-08",
    "url": "/tutorials/15236da4-4326-43aa-9ef6-9aeed8dfe9cc",
    "markdown": "# Preencher"
  }
];
