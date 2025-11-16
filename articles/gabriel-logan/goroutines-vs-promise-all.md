# 📘 Documentação Completa: Ponteiros (`*` e `&`), Goroutines e Comparação com `Promise.all`

Esta documentação cobre os seguintes tópicos essenciais para desenvolvedores Go e JavaScript:

- O significado de `*` e `&` no Go
- Como declarar e usar ponteiros corretamente
- Por que usar `*` dentro de funções mesmo quando o parâmetro já é um ponteiro
- O que são goroutines
- Comparação entre Goroutines e `Promise.all` do JavaScript

---

# 📍 1. Ponteiros no Go (`*` e `&`)

No Go, ponteiros permitem acessar e modificar valores diretamente na memória.

## 1.1. O operador `&` — **endereço de**

Retorna o **endereço de memória** de uma variável.

```go
x := 10
p := &x // p agora contém o endereço de x
```

- `x` → valor
- `&x` → endereço da variável na memória

---

## 1.2. O operador `*` — **valor apontado pelo ponteiro**

Usado para acessar o valor armazenado no endereço para o qual o ponteiro aponta.

```go
x := 10
p := &x
fmt.Println(*p) // 10

*p = 20         // modifica x via ponteiro
fmt.Println(x)   // 20
```

---

## 1.3. `*` na declaração de variáveis

O `*` também é usado na **definição do tipo**, não apenas para dereferenciar.

```go
var p *int // p é um ponteiro para int
```

Aqui o `*` significa: “este tipo é um ponteiro para um valor do tipo X”.

### Diferença entre os usos de `*`:

| Uso          | Significado                               |
| ------------ | ----------------------------------------- |
| `var p *int` | `p` é um **ponteiro para int**            |
| `p := &x`    | `p` recebe o endereço de `x`              |
| `*p`         | acessa o **valor armazenado** no endereço |
| `*p = 10`    | modifica o valor no endereço              |

---

## 1.4. Por que usar `*n` dentro da função se o parâmetro já é `*int`?

Considere:

```go
func incrementa(n *int) {
    *n = *n + 1
}
```

- No parâmetro: `n *int` diz que **n é um ponteiro para int**, ou seja, contém um endereço.
- Dentro da função: `*n` acessa o **valor** guardado naquele endereço.

Você só altera o conteúdo apontado usando `*n`.

---

# 🚀 2. Goroutines

Goroutines são **threads leves** administradas pelo runtime do Go.

```go
go func() {
    fmt.Println("Rodando em goroutine")
}()
```

Características:

- Extremamente leves (milhares ou milhões podem rodar)
- Podem rodar **em paralelo** se houver múltiplos núcleos
- Não retornam valores automaticamente
- Não possuem mecanismo interno de sincronização (nada espera elas por padrão)

---

# 🕒 3. Comparação: Goroutines vs `Promise.all` do JavaScript

## 3.1. O que `Promise.all` faz

- Inicia todas as promises **concorrentemente**
- Retorna uma promise que resolve **apenas quando todas terminam**
- Não bloqueia o event loop enquanto as operações assíncronas rodam
- Ainda assim, JavaScript é **single-thread** (exceto operações de I/O delegadas)

```js
const results = await Promise.all([p1, p2, p3]);
```

---

## 3.2. Como fazer o equivalente no Go

Use goroutines **+ `sync.WaitGroup`**.

```go
var wg sync.WaitGroup

for i := 0; i < 3; i++ {
    wg.Add(1)
    go func(id int) {
        defer wg.Done()
        fmt.Println("Tarefa:", id)
    }(i)
}

wg.Wait() // equivalente ao Promise.all
```

---

## 3.3. Diferenças fundamentais

| Característica                  | Goroutines                          | Promise.all                            |
| ------------------------------- | ----------------------------------- | -------------------------------------- |
| Execução paralela real          | ✔️ Sim, se houver múltiplos núcleos | ⚠️ Não (só concorrência)               |
| Lançamento de tarefas           | Instantâneo e leve                  | Depende da promise ser criada          |
| Precisa esperar manualmente?    | ✔️ Sim (WaitGroup ou channels)      | ❌ Não (Promise.all espera)            |
| Gerencia erro de todas as tasks | Manual                              | Promise.all falha na primeira rejeição |
| Overhead                        | Muito baixo                         | Médio                                  |

---

# 🧭 4. Resumo Geral

- `&x` → pega endereço
- `*p` → pega valor no endereço
- `var p *int` → define um ponteiro
- Goroutines rodando com `go func()` são **concorrentes e potencialmente paralelas**
- Para esperar várias goroutines → `sync.WaitGroup` (equivalente ao `Promise.all`)
- JavaScript é single-thread, Go é multi-thread
