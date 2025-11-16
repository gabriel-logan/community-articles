# 📄 Documentação — Comparação Entre Kafka, RabbitMQ e Redis Como Broker

### Foco: Sistema de Ticket Booking (Alta Concorrência + Anti-oversell + Baixa Latência)

---

# 📌 1. Contexto do Sistema

No seu sistema de venda de ingressos:

- O risco principal é **overselling** / **race conditions**.
- O pico estimado é **50.000 usuários simultâneos**.
- A operação crítica é:
  **reservar + bloquear temporariamente + confirmar**.
- Você precisa **baixa latência**, **ordem garantida**, e **alto throughput**.

O broker entra principalmente para:

- Processos assíncronos (envio de e-mails, confirmação pós-pagamento, auditoria)
- Event Sourcing / Logs de operações
- Filas de reserva assíncrona (dependendo do design)
- Replicar eventos entre serviços

Com isso, abaixo está a comparação **profissional e detalhada** dos três brokers.

---

# 🥇 2. Kafka vs RabbitMQ vs Redis (Streams)

---

# 📦 **2.1 RabbitMQ**

### ✔️ **Prós**

- Latência muito baixa (ideal para filas rápidas).
- Excelente para **padrão fila → consumidor**.
- Fácil de implementar **Priority Queues**, **DLQs**, **Retries**, **Backoff**.
- Perfeito para **processamento transacional** e **work queues**.
- Suporta **ACK real** do consumidor, garantindo que a mensagem foi processada.
- Melhor opção quando você quer **garantia de entrega** (at-least-once) sem muita complexidade.
- A API é simples e direta.

### ❌ **Contras**

- Não foi projetado para **event streaming massivo**.
- Não escala tão bem quanto Kafka em throughput extremo.
- Ordem só garantida **por fila**, não por partição lógica.
- Trabalha com armazenamento em disco limitado — não é ideal para armazenar eventos por muito tempo.

### 🏹 **Quando escolher RabbitMQ no seu sistema**

- Quando você quiser:
  - Gerenciar reservas assíncronas rapidamente.
  - Garantir que cada pedido de reserva seja processado exatamente 1x.
  - Processar tarefas leves ou moderadas.
  - Baixa latência <10ms entre broker → consumer.

🏁 **PERFEITO para microserviço de confirmação de pagamento + envio de e-mail.**
🏁 **Adequado para reserva de assentos se você usar fila única por evento.**

---

# 🚀 **2.2 Kafka**

### ✔️ **Prós**

- O maior throughput do mercado.
- Escala para **milhões de mensagens por segundo**.
- Armazena eventos por **dias/semanas** (log imutável).
- Garantia de ordem por **partição**.
- Excelente para **auditoria**, **logs de reserva**, **replays**, **analytics**, **ML**, **fraude**.
- Altamente confiável e tolerante a falhas.
- Ideal para sistemas distribuídos globalmente.

### ❌ **Contras**

- Latência média maior que RabbitMQ/Redis.
- Não é bom para uso "fila de trabalho" tradicional.
- Não possui confirmação "mensagem processada".
  O "commit" é **offset-based**, não message-based.
- Requer mais infraestrutura, mais caro e mais complexo.
- Overkill para muitos cenários.

### 🏹 **Quando escolher Kafka no seu sistema**

Use Kafka se o sistema precisa:

- Reproduzir eventos (event sourcing)
- Consolidação / analytics de compra
- Pipeline de auditoria da venda
- Sincronização entre múltiplas regiões
- Fila massiva de eventos (>100k msg/s)

⚠️ **NÃO é a melhor escolha para a etapa crítica: "reservar ingresso e bloquear estoque".**
Kafka tem latência boa, mas não micro-latência e não garante processamento 1-por-um como RabbitMQ.

---

# ⚡ **2.3 Redis (Streams ou PubSub)**

> Aqui vamos considerar **Redis Streams**, pois PubSub não garante entrega.

### ✔️ **Prós**

- Ultra-rápido (in-memory).
- Latência baixíssima, perfeita para cenários críticos.
- Streams possuem:
  - ACK real
  - Consumer groups
  - Retenção configurável

- Fácil de usar e de operar.
- Perfeito para **fila de reserva de ingressos**, onde você quer **micro-latência** (<2ms).
- Redis pode ser usado também como **lock distribuído**, crucial para evitar oversell.

### ❌ **Contras**

- Persistência não é tão forte quanto Kafka.
- Se usado sem cluster → SPOF (risco).
- Streams não escalam tão absurdamente quanto Kafka.
- Gerenciamento de retenção exige cuidado (memória infinita não existe).

### 🏹 **Quando escolher Redis no seu sistema**

- Fazer lock distribuído para evitar oversell.
- Criar fila de reserva de ingressos **ultra rápida**.
- Manter estados temporários (sessões, reservas expiram em 10s etc).
- Reagir muito rápido (menos de 5ms) a eventos críticos.

Redis é o **melhor** para a parte mais sensível do sistema:
👉 _Controle de estoque + locking para impedir double-booking._

---

# 🎯 3. Qual é melhor especificamente para o seu Ticket System?

| Caso de Uso                                       | Melhor Broker         |
| ------------------------------------------------- | --------------------- |
| 🔥 **Evitar oversell / lock**                     | **Redis**             |
| 🔥 **Fila principal de reserva**                  | **Redis** ou RabbitMQ |
| 📬 Envio de e-mails, background jobs              | **RabbitMQ**          |
| 🗄️ Log de auditoria, analytics, replay de eventos | **Kafka**             |
| 🌎 Multi-região, eventos globais                  | **Kafka**             |
| ⚡ Baixíssima latência (0.1–2ms)                  | **Redis**             |
| ⛓️ Processamento 1:1 garantido                    | **RabbitMQ**          |

---

# 🧨 4. Recomendação Final Para o Seu Sistema

Se o objetivo é:
**Alta concorrência + Anti-overbooking + Menor latência possível**

A arquitetura recomendada é:

### **1️⃣ Redis → Camada crítica**

- Usado como **Distributed Lock** por ticket/tier.
- Usado como **fila rápida** para a reserva (Streams).
- Latência ridiculamente baixa.

### **2️⃣ RabbitMQ → Processamento assíncrono**

- E-mails de confirmação.
- Notificação ao usuário.
- Cancelamentos.
- Worker de expiração de reserva.

### **3️⃣ Kafka → Observabilidade e Auditoria**

- Log imutável de toda operação.
- Monitoramento para detectar fraude / bots.
- Histórico completo da venda.

---

# 🧱 5. Resumo Rápido dos Prós e Contras

## **RabbitMQ**

- ✔ Baixa latência
- ✔ Fácil
- ✔ Perfeito para filas 1-por-1
- ❌ Não escala como Kafka
- ❌ Não é ideal para logs longos

## **Kafka**

- ✔ Escala monstruosa
- ✔ Perfeito para analytics e histórico
- ✔ Garantia de ordem por partição
- ❌ Complexo
- ❌ Latência não é a melhor para reservas

## **Redis Streams**

- ✔ Latência absurdamente baixa
- ✔ Perfeito para lockers + reservas
- ✔ Fácil de operar
- ❌ Persistência limitada
- ❌ Não ideal para grandes volumes de long retention
