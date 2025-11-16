# Documentação Completa e Organizada de Conceitos Fundamentais em Design de Sistemas

## **0. Visão Geral da Organização**

Para garantir máxima clareza, profundidade e fluidez lógica — essencial para um — os tópicos foram reorganizados seguindo uma ordem que acompanha a evolução natural do design de sistemas distribuídos:

1. **Fundamentos de Arquitetura e Estilo de Sistemas**
   - Monolítico vs Microserviços
   - Stateless vs Stateful
   - Idempotência

2. **Modelagem, Consistência e Estratégias de Dados**
   - Particionamento
   - Sharding
   - Replicação
   - CQRS
   - CAP Theorem

3. **Infraestrutura e Execução**
   - Containerização
   - Kubernetes

4. **Rede, Distribuição e Entrega de Conteúdo**
   - Reverse Proxy
   - Load Balancer
   - Cache
   - CDN

5. **Comunicação Assíncrona e Event-Driven**
   - Message Brokers

6. **Escalabilidade, Disponibilidade e Tolerância a Falhas**
   - Horizontal vs Vertical Scaling
   - Fault Tolerance
   - Rate Limiting e Segurança

7. **Observabilidade**
   - Logging
   - Tracing
   - Monitoramento

8. **Ciclo de Vida de Software**
   - CI/CD

---

# **1. Fundamentos de Arquitetura e Estilo de Sistemas**

## **1.1. Monolítico**

### Definição

Arquitetura onde toda aplicação opera como _um único componente_, contendo lógica de domínio, interface, banco de dados e integrações no mesmo deploy.

### Vantagens

- Simples para iniciar e desenvolver.
- Depuração direta (um único processo).
- Deploy único e fácil.

### Desvantagens

- Baixa escalabilidade independente.
- Deploy afeta todo o sistema.
- Cresce desorganizado (Big Ball of Mud).
- Menor resiliência.

---

## **1.2. Microserviços**

### Definição

Arquitetura composta por serviços pequenos, isolados e autônomos, comunicando-se via APIs ou mensageria.

### Vantagens

- Escalabilidade independente.
- Deploys isolados.
- Especialização por equipe.
- Observabilidade granular.

### Desvantagens

- Alta complexidade de comunicação.
- Orquestração mais difícil.
- Requer automação madura.

### Segurança

- Zero-trust.
- Rate limiting por serviço.
- API Gateway para centralizar políticas.

---

## **1.3. Stateless vs Stateful**

### Stateless

- Nenhuma informação de sessão no servidor.
- Recomendado para escalabilidade horizontal.
- Ideal para load balancers.

### Stateful

- Estado mantido dentro da instância.
- Requer sticky sessions.
- Escala mal.

### Comparação

| Critério       | Stateless | Stateful |
| -------------- | --------- | -------- |
| Escalabilidade | Excelente | Baixa    |
| Failover       | Simples   | Difícil  |
| Complexidade   | Baixa     | Alta     |

---

## **1.4. Idempotência**

### Definição

Uma operação é idempotente quando pode ser repetida diversas vezes sem alterar o resultado final.

### Exemplo

- `PUT /user/1`: idempotente.
- `POST /order`: não idempotente sem controle.

### Importância

- Evita duplicações em sistemas distribuídos.
- Essencial para replays de mensagens.
- Fundamental em APIs resilientes.

---

# **2. Modelagem, Consistência e Estratégias de Dados**

## **2.1. Particionamento**

### Definição

Divisão de dados em partes menores para distribuir carga.

### Tipos

- **Horizontal:** particiona linhas.
- **Vertical:** particiona colunas.

### Prós

- Melhora performance.
- Reduz índices grandes.

### Contras

- Queries entre partições são mais lentas.

---

## **2.2. Sharding**

### Definição

Tipo de particionamento horizontal distribuído entre múltiplos servidores.

### Vantagens

- Escalabilidade quase ilimitada.
- Reduz hotspots.

### Desvantagens

- Rebalanceamento complexo.
- Perda de joins fáceis.

---

## **2.3. Replicação**

### Definição

Cópia redundante dos dados em múltiplas instâncias.

### Modelos

- Master/Replica
- Multi-master

### Vantagens

- Alta disponibilidade.
- Failover automático.

### Desvantagens

- Lag de replicação.
- Conflitos no multi-master.

---

## **2.4. CQRS**

### Definição

Separação dos modelos de leitura e escrita para otimizar performance.

### Vantagens

- Escalabilidade independente.
- Leitura extremamente rápida.

### Desvantagens

- Complexidade arquitetural.

---

## **2.5. CAP Theorem**

### Definição

Sistemas distribuídos só podem garantir dois dos três atributos:

- Consistência
- Disponibilidade
- Tolerância a Partições

### Exemplos

- Cassandra: AP
- MongoDB cluster: CP

---

# **3. Infraestrutura e Execução**

## **3.1. Containerização**

### Definição

Empacotar aplicações com suas dependências usando contêineres.

### Exemplos

- Docker
- Podman

### Vantagens

- Isolamento.
- Portabilidade.
- Deploy repetível.

### Desvantagens

- Overhead leve.
- Requer registros (Docker Registry).

---

## **3.2. Kubernetes**

### Definição

Orquestração de contêineres para escalabilidade, segurança e automação.

### Funcionalidades

- Auto-escalamento (HPA).
- Self-healing.
- Service mesh.

### Prós

- Resiliente.
- Declarativo.
- Padrão global.

### Contras

- Curva de aprendizado alta.
- Muitas peças (Pods, Deployments, Services, Ingress...).

---

# **4. Rede, Distribuição e Entrega de Conteúdo**

## **4.1. Reverse Proxy**

### Função

Intermediário entre cliente e backend.

### Benefícios

- Oculta infraestrutura.
- TLS termination.
- Cache integrado.

---

## **4.2. Load Balancer**

### Função

Distribui requisições entre várias instâncias.

### Tipos

- L4
- L7

### Vantagens

- Alta disponibilidade.
- Escalabilidade.

### Desvantagens

- Custo de infraestrutura.

### Rate Limiting

- Regras baseadas em IP, token, usuário.
- Protege contra DoS.

---

## **4.3. Cache**

### Tipos

- In-memory (Redis, Memcached)
- CDN
- Application cache

### Vantagens

- Latência extremamente baixa.
- Redução de carga.

### Problemas

- Invalidação de cache.
- Dados desatualizados.

---

## **4.4. CDN**

### Função

Distribuir conteúdo estático globalmente.

### Vantagens

- Reduz latência.
- Protege origem contra picos.

### Desvantagens

- Conteúdo dinâmico limitado.

---

# **5. Comunicação Assíncrona e Brokers**

## **Message Brokers**

### Exemplos

- Kafka
- RabbitMQ
- AWS SQS

### Vantagens

- Desacoplamento.
- Retriable.
- Escalabilidade.

### Desvantagens

- Latência.
- Complexidade operacional.

### Segurança

- ACL, TLS, autenticação.

---

# **6. Escalabilidade e Resiliência**

## **6.1. Horizontal vs Vertical Scaling**

### Horizontal

- Adicionar instâncias.

### Vertical

- Aumentar recursos.

### Comparação

| Critério | Horizontal   | Vertical         |
| -------- | ------------ | ---------------- |
| Custos   | Distribuídos | Alto por máquina |
| Escala   | Alta         | Limitada         |

---

## **6.2. Fault Tolerance**

### Estratégias

- Health checks.
- Self-healing.
- Replicação.
- Redundância.

### Cenários

- Falha de rede.
- Falha de servidor.
- Latência alta.

---

## **6.3. Segurança e Rate Limiting**

### Controles

- WAF
- API Gateway
- mTLS
- Proteção contra DDoS

### Rate Limiting

- Token bucket
- Leaky bucket
- Redis-based counters

---

# **7. Observabilidade**

## **7.1. Logging**

### Tipos

- Estruturado
- Não estruturado

### Ferramentas

- Elastic Stack
- Loki

---

## **7.2. Tracing**

### Função

Rastrear requisições ponta a ponta.

### Ferramentas

- Jaeger
- Zipkin
- OpenTelemetry

---

## **7.3. Monitoramento**

### Métricas

- Latência
- TPS/QPS
- Erros

### Ferramentas

- Prometheus
- Grafana

---

# **8. CI/CD**

### Definição

Automação do fluxo de integração e entrega.

### Fases

- Build
- Testes
- Deploy

### Benefícios

- Deploys confiáveis.
- Menos erros humanos.
- Feedback rápido.

---

# **Conclusão Geral**

Esta documentação está estruturada de forma completa, organizada e aprofundada sobre design de sistemas modernos, cobrindo arquitetura, dados, infraestrutura, segurança, escalabilidade e observabilidade.

O objetivo é fornecer um guia definitivo para desenvolvedores e arquitetos de software que buscam construir sistemas robustos, escaláveis e resilientes.

Otimo para referencia rapida e estudo aprofundado.
