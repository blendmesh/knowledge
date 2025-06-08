# Tutorial 1 – Preparar o ferramental e ambiente

## Objetivo

Neste tutorial introdutório, você aprenderá a preparar o seu ambiente de desenvolvimento para trabalhar com o Terraform. Iremos abordar a instalação do Terraform, a configuração do AWS CLI, a organização da estrutura do projeto e a validação do primeiro template.

## Conteúdo

1. Instalando o Terraform
- Para sistemas Unix/Linux:

```bash
wget https://releases.hashicorp.com/terraform/1.5.0/terraform_1.5.0_linux_amd64.zip
unzip terraform_1.5.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```

- Para Windows:
Baixe o executável no site da HashiCorp e adicione-o ao PATH do sistema.

2. Instalando e Configurando o AWS CLI

- Instale o AWS CLI baixando o instalador apropriado:

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

- Configure as credenciais com:

```bash
aws configure
```

- Informe a Access Key, Secret Key, região (por exemplo, us-east-1) e output format (json, text, etc.).

3. Organizando a Estrutura de Arquivos

Crie uma pasta para o seu projeto e, dentro dela, organize os arquivos da seguinte forma:

```
meu-projeto/
├── main.tf
├── variables.tf
├── outputs.tf
└── terraform.tfvars (opcional)
```

4. No arquivo main.tf, comece declarando o provider:

```tf
provider "aws" {
  region = var.aws_region
}
````

5. Validando a Configuração

Abra o terminal, navegue até a pasta do projeto e execute:

```bash
terraform init
terraform validate
```

6. Esses comandos garantem que o Terraform esteja instalado corretamente e que o seu template não contenha erros de sintaxe.

## Conclusão
Com esses passos, você terá configurado o ambiente para o uso do Terraform e estará pronto para prosseguir para os conceitos básicos. Este tutorial é a base sobre a qual você construirá conhecimentos mais avançados nos vídeos seguintes.