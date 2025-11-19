# EN

# COMPLETE Documentation — `*` and `&` in Go (Golang)

> This documentation covers, in detail, everything you need to know about the operators `&` (address-of) and `*` (indirection/dereference) in Go: pointer types, behavior, practical examples, pitfalls, best practices, interactions with `new`/`make`, `unsafe`, `interface{}`, methods, concurrency, escape analysis, and much more.

---

## Quick Summary

1. Basic concepts: what `&` and `*` are
2. Pointer types in Go
3. Syntax and practical examples (declare, assign, read, write)
4. `new` vs `make`
5. Pointers and zero values / `nil`
6. Pointers to structs, arrays, slices, maps, functions, and interfaces
7. Methods with pointer receiver vs value receiver
8. Pointers, GC, escape analysis (why `&x` can return address of a local variable)
9. `unsafe.Pointer`, `uintptr`, and pointer arithmetic — rules and dangers
10. Concurrency, atomics, and pointers
11. Pointer comparisons, equality, ordering
12. Best practices and anti-patterns
13. FAQ and common errors (panic: nil pointer, literal address, etc.)
14. Cheatsheet — quick references
15. Complete and commented examples

---

# 1. Basic Concepts

- `&x` — **address-of operator**: returns the memory address of `x`. The result has type `*T` if `x` has type `T`.
- `*p` — **indirection / dereference operator**: when `p` has type `*T`, `*p` accesses the underlying `T` value. Also used in type declarations: `*T` means “pointer to T”.

In simple terms: `&` gets the address; `*` accesses the value from the address.

---

# 2. Pointer Types in Go

- `*T` — pointer to values of type `T`.
  - Examples: `*int`, `*MyStruct`, `*[10]int`, `*interface{}`.

- Pointers are distinct types: `*int` ≠ `*uint`, `*T1` ≠ `*T2`.
- Pointers have zero value `nil`.
- Pointers themselves are values — they are copied on assignment (typically 4 or 8 bytes).

---

# 3. Syntax and Practical Examples

### Basic declaration and usage

```go
var x int = 42
var p *int = &x
fmt.Println(p)   // memory address
fmt.Println(*p)  // 42
*p = 100
fmt.Println(x)   // 100
```

### Short declaration and nil

```go
var p *int       // p == nil
if p == nil {
    fmt.Println("p is nil")
}
```

### Pointer to struct

```go
type Person struct {
    Name string
    Age  int
}

p := Person{"Ana", 30}
pp := &p
pp.Age = 31
```

> Note: `pp.Age` is allowed even though `pp` is `*Person` — Go automatically dereferences.

### Pointer to array

```go
arr := [3]int{1,2,3}
pa := &arr
(*pa)[0] = 10
```

### Pointer to slice / map / chan / func / interface

Slices, maps, and chans are reference types — so pointer-to-slice (`*[]T`) or pointer-to-map (`*map[K]V`) is allowed but rarely necessary.

```go
s := []int{1,2}
ps := &s
(*ps)[0] = 10
```

### Pointer to literal / composite literal

```go
p := &Person{"João", 25}
pa := &[]int{1,2,3}
pm := &map[string]int{"a":1}
```

---

# 4. `new` vs `make`

- `new(T)`:
  - Returns `*T`.
  - Allocates zeroed memory and returns pointer.
  - Example: `p := new(int)` ⇒ `p` is `*int`, `*p == 0`.

- `make(T, ...)`:
  - Only for built-in reference types: `slice`, `map`, `chan`.
  - Returns the initialized value itself (not a pointer).
  - Example: `s := make([]int, 0, 10)`

**Common mistakes**:
Using `new` for slices/maps (does NOT initialize internal structure).
Using `make` for non-supported types.

---

# 5. Pointers and Zero Value / `nil`

- Zero value of `*T` is `nil`.
- Dereferencing `nil` (`*p` when `p == nil`) causes:

```
panic: runtime error: invalid memory address or nil pointer dereference
```

---

# 6. Pointers to Different Types (Details)

### Structs

- `&T{...}` is idiomatic.
- Methods with pointer receiver can mutate the struct.
- Returning `*T` to a local variable is safe (escape analysis).

### Arrays

- `*[N]T` is pointer to array.
- Arrays and slices are different types.

### Slices and maps

- Already reference types.
- Pointer-to-slice useful only when you need to reassign the slice header.

```go
func appendInt(s *[]int, v int) {
    *s = append(*s, v)
}
```

### Pointer to function

- Rarely useful — functions are already reference types (can be nil).

### `interface{}`

- You can store `*T` in an interface.
- Confusing case:

```go
var p *int = nil
var i interface{} = p
fmt.Println(i == nil) // false
```

Because the interface holds type `*int` and value `nil`.

---

# 7. Methods: Pointer Receiver vs Value Receiver

- `(v T) M()` — receives a copy of `T`.
- `(v *T) M()` — receives pointer; can mutate original.

Rules:

- With a value `t`, you can call both pointer-receiver methods and value-receiver methods (compiler auto-converts when possible).
- With a pointer `p`, you can call either.

Example:

```go
type Counter struct { n int }

func (c *Counter) Inc() { c.n++ }
func (c Counter) Value() int { return c.n }

c := Counter{}
c.Inc()
fmt.Println(c.Value())
```

---

# 8. Pointers, GC, Escape Analysis

- Go's GC ensures memory is not freed while still referenced.
- Escape analysis decides whether a variable stays on stack or heap.

Example:

```go
func NewInt() *int {
    x := 10
    return &x // x escapes to heap
}
```

Returning address of local variable is safe.

---

# 9. `unsafe.Pointer`, `uintptr`, Pointer Arithmetic

- Go **forbids** pointer arithmetic.
- `unsafe` enables unsafe conversions:
  - `unsafe.Pointer` converts between arbitrary pointer types.
  - `uintptr` is integer representation of address.

Rules / dangers:

- Storing pointer in `uintptr` does NOT keep the object alive for GC.
- GC may move objects; converting through `uintptr` is dangerous.

Typical usage: memory tricks, C interop, byte reinterpretation.

Example:

```go
p := unsafe.Pointer(&x)
up := uintptr(p)
p2 := unsafe.Pointer(up)
```

---

# 10. Concurrency, `atomic`, and Pointers

`atomic.Pointer[T]` (Go 1.19+) provides safe atomic pointer operations:

```go
var p atomic.Pointer[MyStruct]
p.Store(&MyStruct{...})
ptr := p.Load()
```

Don’t access shared pointers concurrently without synchronization.

---

# 11. Comparisons, Equality, Ordering

- Pointers support `==` and `!=`.
- Cannot order pointers (`<`, `>`, etc.).
- `nil` comparable to all pointer types.

---

# 12. Best Practices and Anti-Patterns

**Best practices**

- Prefer values when types are small and immutable.

- Use pointer when:
  - You need to mutate original.
  - The type is large.
  - You want to represent optional fields.

- Prefer pointer receivers when method mutates or type is large.

- Avoid pointer-to-slice/map unless needed.

- Always check `nil` when required.

**Anti-patterns**

- Using `*[]T` or `*map[K]V` unnecessarily.
- Using pointers for small scalar fields without semantic need.
- Using `unsafe` without expert-level reasons.

---

# 13. FAQ and Common Errors

### Why does `&Person{...}` work?

Composite literals are addressable; the compiler allocates and returns address.

### Can I do pointer arithmetic like `p + 1`?

No.

### Why does `var p *int; fmt.Println(*p)` panic?

`p` is nil.

### Why is `interface{} != nil` even when holding a nil pointer?

Because the interface type is non-nil.

---

# 14. Cheatsheet

| Operation             | Syntax                    | Result                          |
| --------------------- | ------------------------- | ------------------------------- |
| address-of            | `p := &x`                 | `p` is `*T`                     |
| dereference           | `*p`                      | underlying `T`                  |
| allocate zeroed       | `p := new(T)`             | `*p` is zero                    |
| create slice/map/chan | `make([]T, n)`            | initialized value               |
| compare pointers      | `p == q`                  | compares addresses              |
| nil pointer panic     | `*nil`                    | panic                           |
| pointer arithmetic    | `p + 1`                   | not allowed                     |
| unsafe conversions    | unsafe + uintptr          | dangerous                       |
| methods               | pointer vs value receiver | choose based on mutability/size |

---

# 15. Complete and Commented Examples

### Example 1 — modifying argument through pointer

```go
package main

import "fmt"

func zero(p *int) {
    if p == nil {
        return
    }
    *p = 0
}

func main() {
    x := 10
    zero(&x)
    fmt.Println(x) // 0
}
```

### Example 2 — safe pointer return (escape analysis)

```go
package main

import "fmt"

func NewInt(v int) *int {
    x := v
    return &x
}

func main() {
    p := NewInt(7)
    fmt.Println(*p)
}
```

### Example 3 — slice vs pointer-to-slice

```go
package main

import "fmt"

func appendNoPtr(s []int, v int) []int {
    return append(s, v)
}

func appendWithPtr(s *[]int, v int) {
    *s = append(*s, v)
}

func main() {
    s := []int{1,2}
    s = appendNoPtr(s, 3)
    fmt.Println(s)

    appendWithPtr(&s, 4)
    fmt.Println(s)
}
```

### Example 4 — pointer receiver vs value receiver

```go
package main

import "fmt"

type Counter struct { n int }

func (c *Counter) Inc() { c.n++ }
func (c Counter) Val() int { return c.n }

func main() {
    c := Counter{}
    c.Inc()
    fmt.Println(c.Val()) // 1
}
```

### Example 5 — atomic pointer

```go
package main

import (
    "fmt"
    "sync/atomic"
)

type S struct { X int }

func main() {
    var p atomic.Pointer[S]
    p.Store(&S{X:10})
    s := p.Load()
    fmt.Println(s.X)
}
```

### Example 6 — `unsafe` conversions

```go
package main

import (
    "fmt"
    "unsafe"
)

func main() {
    var x int64 = 0x0102030405060708
    p := unsafe.Pointer(&x)
    pb := (*[8]byte)(p)
    fmt.Printf("%x\n", pb)
}
```

> WARNING: unsafe operations may break across Go versions.

---

# 16. Subtle Traps / Advanced Cases

### Taking address of composite expressions

- `&T{...}` allowed.
- `&a[i]` allowed.
- `&(x + y)` not allowed (non-addressable).

### Interface holding nil pointer

```go
var p *int = nil
var i interface{} = p
fmt.Println(i == nil) // false
```

### Using pointer fields to represent optional values

Common but increases complexity.

### Pointer arithmetic via `uintptr`

Dangerous: GC may move memory.

---

# 17. Performance / Style Recommendations

- Prefer values for small types.
- Prefer pointers for big structs.
- Don’t use pointers to slices/maps unless necessary.
- Document if a function accepts `nil`.

---

# 18. Pointer Bug Prevention Checklist

- [ ] Check for `nil` before dereferencing.
- [ ] Choose pointer vs value based on semantics.
- [ ] Avoid `unsafe` unless required.
- [ ] Use `atomic` or `Mutex` for shared pointers.
- [ ] Avoid `*interface{}` unless you know why.
- [ ] Understand escape analysis when returning `&x`.

---

# 19. Further Reading

- TGLP book chapters on methods and types.
- Study `sync/atomic` and `unsafe`.
- Use `go build -gcflags="-m"` to inspect escape analysis.

---

# 20. Full Example — small program using pointers, methods, and atomic

```go
package main

import (
    "fmt"
    "sync/atomic"
)

type Config struct {
    Name string
    Val  int
}

func (c *Config) UpdateName(n string) {
    c.Name = n
}

func main() {
    var cp atomic.Pointer[Config]
    cp.Store(&Config{Name: "init", Val: 1})

    cfg := cp.Load()
    fmt.Println("before:", cfg)
    cfg.UpdateName("changed")
    fmt.Println("after:", cp.Load())

    p := NewInt(99)
    fmt.Println(*p)
}

func NewInt(v int) *int {
    x := v
    return &x
}
```

---

## Short Conclusion

- `&` gets address, `*` dereferences.
- Use pointers for mutability, large types, or optional fields.
- `new` returns pointer; `make` initializes slice/map/chan.
- No pointer arithmetic. `unsafe` is dangerous.
- Pointer receivers allow mutation.
- Watch out for `nil`, interfaces holding pointers, escape analysis.

# PT

# Documentação COMPLETA — `*` e `&` em Go (Golang)

> Esta documentação cobre, em detalhes, tudo o que você precisa saber sobre os operadores `&` (address-of) e `*` (indirection/dereference) em Go: tipos de ponteiro, comportamento, exemplos práticos, armadilhas, boas práticas, interações com `new`/`make`, `unsafe`, `interface{}`, métodos, concorrência, escape analysis e muito mais.

---

## Sumário (rápido)

1. Conceitos básicos: o que são `&` e `*`
2. Tipos de ponteiro em Go
3. Sintaxe e exemplos práticos (declarar, atribuir, ler e escrever)
4. `new` vs `make`
5. Ponteiros e valores zero / `nil`
6. Ponteiros para structs, arrays, slices, maps, funções e interfaces
7. Métodos com receptor ponteiro vs receptor valor
8. Ponteiros, GC e escape analysis (por que `&x` pode retornar endereço de variável local)
9. `unsafe.Pointer`, `uintptr`, e aritmética de ponteiro — regras e perigos
10. Concorrência, atomics e ponteiros
11. Comparações, igualdade e ordenação de ponteiros
12. Boas práticas e anti-padrões
13. FAQ e erros comuns (panic: nil pointer, endereço de literal etc.)
14. Cheatsheet — referências rápidas
15. Exemplos completos e comentados

---

# 1. Conceitos básicos

- `&x` — operador **address-of**: retorna o endereço de memória de `x`. Resultado tem tipo `*T` se `x` tem tipo `T`.
- `*p` — operador **indirection / dereference**: quando `p` tem tipo `*T`, `*p` acessa o valor `T` apontado por `p`. Também usado em declarações de tipo: `*T` é "ponteiro para T".

Em termos simples: `&` pega o endereço; `*` acessa o valor a partir do endereço.

---

# 2. Tipos de ponteiro em Go

- `*T` — ponteiro para valores do tipo `T`.
  - Ex.: `*int`, `*MyStruct`, `*[10]int`, `*interface{}`.

- Ponteiros são tipos distintos: `*int` ≠ `*uint`, `*T1` ≠ `*T2` (mesmo que `T1` e `T2` tenham o mesmo tamanho).
- Ponteiros têm valor zero `nil`.
- Ponteiros são valores — podem ser passados por cópia (4/8 bytes conforme arquitetura).

---

# 3. Sintaxe e exemplos práticos

### Declaração e uso básico

```go
var x int = 42
var p *int = &x      // p aponta para x
fmt.Println(p)       // endereço em formato hexadecimal
fmt.Println(*p)      // 42
*p = 100             // altera x para 100
fmt.Println(x)       // 100
```

### Declaração curta e nil

```go
var p *int           // p == nil
if p == nil {
    fmt.Println("p é nil")
}
```

### Ponteiro para struct

```go
type Person struct {
    Name string
    Age  int
}

p := Person{"Ana", 30}
pp := &p              // *Person
pp.Age = 31           // sintaxe curta: (*pp).Age = 31 também funciona
```

> Observação: `pp.Age` é sintaticamente permitido mesmo que `pp` seja `*Person` — linguagem resolve automaticamente.

### Ponteiro para array

```go
arr := [3]int{1,2,3}
pa := &arr     // *[3]int
(*pa)[0] = 10
```

### Ponteiro para slice / map / chan / func / interface

- **Slice, map e chan** são _reference types_ — normalmente não é necessário usar um ponteiro para eles, pois já são referências internas (embora `*[]T` ou `*map[K]V` seja possível e às vezes útil).

```go
s := []int{1,2}
ps := &s          // *([]int) — válido, mas raramente necessário
(*ps)[0] = 10
```

### Ponteiro para literal / composição

Você pode obter endereço de literais compostos:

```go
p := &Person{"João", 25}  // permitido
pa := &[]int{1,2,3}       // permitido
pm := &map[string]int{"a":1} // permitido
```

---

# 4. `new` vs `make`

- `new(T)`:
  - Retorna `*T`.
  - Aloca zeroed memory e retorna ponteiro.
  - Ex.: `p := new(int)` => `p` é `*int` e `*p == 0`.

- `make(T, ...)`:
  - Somente para tipos internos: `slice`, `map`, `chan`.
  - Retorna valor do tipo (não ponteiro), inicializado para uso (com estrutura interna alocada).
  - Ex.: `s := make([]int, 0, 10)`, `m := make(map[string]int)`.

**Erros comuns**: usar `new` em vez de `make` para slice/map -> não inicializa estrutura interna; usar `make` em tipos não suportados -> compilação falha.

---

# 5. Ponteiros e valores zero / `nil`

- Valor zero de `*T` é `nil`.
- Realizar `*p` quando `p == nil` provoca `panic: runtime error: invalid memory address or nil pointer dereference`.
- Sempre verifice `nil` quando o ponteiro pode ser opcional ou não inicializado.

---

# 6. Ponteiros para diferentes tipos (detalhes)

### Structs

- `&T{...}` é idiomático e comum.
- Métodos com receptor ponteiro recebem `*T` e podem modificar o valor subjacente.
- Pode retornar `*T` referindo-se a variável local — escape analysis cuidará.

### Arrays

- `*[N]T` tem tamanho fixo.
- Tomar `&array` dá `* [N]T`. Atenção: slices (`[]T`) e arrays (`[N]T`) são diferentes.

### Slices e Maps

- Slices e maps já são referências internas. Ex.: `func f(s []int) { s[0]=1 }` modifica o slice do chamador.
- Usar `*[]T` ou `*map[K]V` é redundante na maioria dos casos, mas pode ser útil para alterar a fatia/map em si (por exemplo, tornar `s = append(s, ...)` no chamador — se você precisa reatribuir o cabeçalho, pode passar `*[]T`).

```go
func appendInt(s *[]int, v int) {
    *s = append(*s, v)
}
```

### Funções (ponteiro para função)

- `func()` é um tipo; `*func()` não costuma ser usado — funções são valores de referência, então já podem ser nil e passadas diretamente.
- Não é comum usar `*func()`.

### `interface{}`

- `interface{}` é um par (type, value). Você pode ter `*interface{}`, mas raramente necessário.
- Cuidado: `var i interface{} = nil` e `var p *int = nil` não são iguais; um `interface{}` que guarda `(*int)(nil)` **não** é `nil` — seu tipo não é nil.

Exemplo de confusão:

```go
var p *int = nil
var i interface{} = p
fmt.Println(i == nil) // false! porque i tem tipo *int, valor nil
```

---

# 7. Métodos: receptor ponteiro vs receptor valor

- `func (v T) M()` — receptor por valor: método recebe cópia do `T`.
- `func (v *T) M()` — receptor por ponteiro: método recebe `*T` e pode modificar o valor original.

Regras importantes:

- Se você tem `var t T`, pode chamar tanto `t.M()` (receptor valor) quanto `(&t).M()` para receptor ponteiro (compilador faz a conversão automática quando possível).
- Se você tem `var p *T`, pode chamar `p.M()` para receptor ponteiro; se `M` é receptor valor, `p.M()` também funciona (desreferencia automática).
- Métodos definidos em `*T` não fazem parte do conjunto de métodos do tipo `T` para algumas operações (por exemplo, quando o valor é uma **não-endereçável** literal em algumas conversões), mas na prática a conversão automática de chamada é conveniente.

Exemplo:

```go
type Counter struct { n int }

func (c *Counter) Inc() { c.n++ }
func (c Counter) Value() int { return c.n }

c := Counter{}
c.Inc()          // compilador chama (&c).Inc()
fmt.Println(c.Value())
```

---

# 8. Ponteiros, GC e escape analysis

- Go tem _garbage collector_. Não há "dangling pointer" como em C se você usar ponteiros normais — GC garante que o objeto referenciado não seja liberado enquanto houver referências vivas.
- **Escape analysis**: compilador decide se uma variável armazena na stack (pilha) ou heap. Se você retornar `&x` de uma função, o compilador fará `x` "escapar" para heap para que o ponteiro seja válido. Ex.:

```go
func NewInt() *int {
    x := 10
    return &x   // `x` escapa para heap
}
```

- Resultado: seguro retornar endereço de variável local. Performance: heap allocation possível; otimizável pelo compilador em casos.

---

# 9. `unsafe.Pointer`, `uintptr` e aritmética de ponteiro

- Go **não permite** aritmética de ponteiro com `*T`.
- `unsafe` permite conversões perigosas:
  - `unsafe.Pointer` pode converter entre ponteiros de tipos arbitrários.
  - `uintptr` é um inteiro que pode conter o valor numérico de um ponteiro.

- **Regras e perigos**:
  - Converter `uintptr` de/para `unsafe.Pointer` e então usar pode invalidar o destino se o GC mover objetos; ponteiro em `uintptr` não mantém o objeto vivo.
  - Nunca armazene ponteiros em `uintptr` e espere que o GC os rastreie.
  - Conversões seguras (mais ou menos):

    ```go
    p := unsafe.Pointer(&x)
    up := uintptr(p)
    // ... manipulação de up ...
    p2 := unsafe.Pointer(up)
    ```

    Mas isso é perigoso e pode quebrar com o GC. Use apenas quando necessário.

- Exemplos típicos: interfacing com C, manipulações de memória, drivers, serialização de estruturas em formato binário.

---

# 10. Concorrência, `atomic` e ponteiros

- Operações atômicas em ponteiros: package `sync/atomic` tem `atomic.Pointer[T]` (desde Go 1.19) e antes usava `unsafe.Pointer` com funções atômicas.
- Use `atomic.Pointer[T]` para trocar/referenciar ponteiros de forma segura sem locks.

```go
var p atomic.Pointer[MyStruct]
p.Store(&MyStruct{...})
ptr := p.Load()
```

- Evite condições de corrida ao ler/escrever ponteiros sem sincronização.

---

# 11. Comparações, igualdade e ordenação

- Ponteiros podem ser comparados por igualdade (`==` / `!=`) — compara o endereço.
- Comparar ponteiros de tipos diferentes é ilegal (tipos devem combinar).
- Não é permitida ordenação (`<`, `>`) entre ponteiros.
- `nil` é compatível com ponteiros: `p == nil`.

---

# 12. Boas práticas e anti-padrões

**Boas práticas**

- Prefira passar valores quando `T` for pequeno e imutável (por exemplo: `int`, structs pequenas). Use ponteiro quando:
  - você precisa modificar o valor do chamador;
  - o tipo é grande (copiar é caro);
  - você quer evitar cópias pesadas.

- Prefira métodos com receptor ponteiro quando o método modifica o receptor ou o tipo é grande.
- Use `&T{}` para construir e retornar ponteiros idiomaticamente.
- Para slices/maps, prefira passá-los por valor (já são referências). Só use `*[]T` quando precisa reatribuir o slice (cabeçalho).
- Cheque `nil` antes de deferenciar ponteiros.

**Anti-padrões**

- Passar `*[]T` ou `*map[K]V` sem necessidade.
- Usar ponteiros de tipos pequenos sem necessidade (ex.: `*int` para campos simples em structs — às vezes ok para distinguir "ausência", mas pode complicar).
- Manipular `unsafe.Pointer` sem necessidade.

---

# 13. FAQ e erros comuns

### Por que `&someLiteral` funciona (ex.: `&Person{...}`)?

Porque composite literals são endereçáveis em tempo de compilação; o compilador aloca o literal e retorna seu endereço.

### Posso fazer aritmética de ponteiro (p + 1) como em C?

Não. Go não permite aritmética de ponteiro diretamente. Use slices ou `unsafe` com extrema cautela.

### Por que `var p *int; fmt.Println(*p)` causa panic?

`p` é nil; dereferenciar um ponteiro nil dá `panic: runtime error: invalid memory address or nil pointer dereference`.

### Por que `var i interface{} = (*int)(nil); i == nil` é false?

`i` tem tipo `*int` (não-nil), valor `nil`. `i` não é `nil` porque seu tipo é definido. Para testar, use:

```go
if i == nil {
    // só true se tipo e valor forem nil
}
```

### Posso retornar `&x` de uma função?

Sim. Escape analysis fará `x` ir para heap se necessário.

---

# 14. Cheatsheet — operações rápidas

| Operação             |                     Sintaxe | Resultado                           |
| -------------------- | --------------------------: | ----------------------------------- |
| endereçar            |                   `p := &x` | `p` é `*T`                          |
| desreferenciar       |                        `*p` | valor `T`                           |
| criar zeroed         |               `p := new(T)` | `p *T`, `*p` = zero                 |
| criar slice/map/chan |              `make([]T, n)` | valor inicializado                  |
| comparar ponteiros   |                    `p == q` | compara endereço                    |
| pointer panic        |                      `*nil` | panic                               |
| pointer arithmetic   |                     `p + 1` | **não permitido**                   |
| convert com unsafe   | `unsafe.Pointer`, `uintptr` | perigoso, apenas quando necessário  |
| métodos              |  `(t T) M()` e `(t *T) M()` | escolha conforme mutabilidade/custo |

---

# 15. Exemplos completos e comentados

### Exemplo 1 — função que modifica o argumento via ponteiro

```go
package main

import "fmt"

func zero(p *int) {
    if p == nil {
        return
    }
    *p = 0
}

func main() {
    x := 10
    zero(&x)         // passa o endereço
    fmt.Println(x)   // 0
}
```

### Exemplo 2 — retorno de ponteiro seguro (escape analysis)

```go
package main

import "fmt"

func NewInt(v int) *int {
    x := v
    return &x  // x escapa para heap
}

func main() {
    p := NewInt(7)
    fmt.Println(*p) // 7
}
```

### Exemplo 3 — slice vs pointer to slice

```go
package main

import "fmt"

func appendNoPtr(s []int, v int) []int {
    return append(s, v) // precisa reassinar no chamador
}

func appendWithPtr(s *[]int, v int) {
    *s = append(*s, v)
}

func main() {
    s := []int{1,2}
    s = appendNoPtr(s, 3) // reatribuição obrigatória
    fmt.Println(s)        // [1 2 3]

    appendWithPtr(&s, 4)
    fmt.Println(s)        // [1 2 3 4]
}
```

### Exemplo 4 — método receptor ponteiro (modifica) vs valor (não modifica)

```go
package main

import "fmt"

type Counter struct { n int }

func (c *Counter) Inc() { c.n++ }   // modifica
func (c Counter) Val() int { return c.n } // não modifica

func main() {
    c := Counter{}
    c.Inc()
    fmt.Println(c.Val()) // 1
}
```

### Exemplo 5 — uso seguro de `atomic.Pointer`

```go
package main

import (
    "fmt"
    "sync/atomic"
)

type S struct { X int }

func main() {
    var p atomic.Pointer[S]
    p.Store(&S{X:10})
    s := p.Load()
    fmt.Println(s.X) // 10
}
```

### Exemplo 6 — `unsafe` conversões (com aviso)

```go
package main

import (
    "fmt"
    "unsafe"
)

func main() {
    var x int64 = 0x0102030405060708
    p := unsafe.Pointer(&x)
    pb := (*[8]byte)(p) // tratar int64 como array de bytes
    fmt.Printf("%x\n", pb) // output depende de endianness
}
```

> **AVISO**: exemplos com `unsafe` podem quebrar com futuras versões do compilador/GC; use com cautela.

---

# 16. Armadilhas sutis / casos avançados

### `&` em expressões compostas e precedência

- `&T{...}` é permitido.
- Em `&a[i]`, você pega endereço do elemento `i`.
- Tomar endereço de expressão não pode ser feito para resultados não-endereçáveis (ex.: `&(x + y)` é inválido).

### Interface contendo ponteiro `nil`

```go
var p *int = nil
var i interface{} = p
fmt.Println(i == nil) // false
```

Solução: teste o tipo dentro da interface, por exemplo:

```go
if p2, ok := i.(*int); ok && p2 == nil {
    // i holds (*int)(nil)
}
```

### Campos de struct como `*T` para representar ausência

Usar ponteiros em campos para expressar "valor ausente" é comum (ex.: `*string` para distinguir `""` de "não fornecido"). Mas isso aumenta complexidade e necessidade de verificar `nil`.

### Converter `*T` para `unsafe.Pointer` e para `uintptr` para aritmética

Risco de GC mover memória entre conversões — objeto pode ser recolhido/movido — só faça quando souber o que faz.

---

# 17. Recomendações de desempenho / estilo

- Prefira valores em APIs simples (ex.: `func Do(x T)`), especialmente se `T` é pequeno e imutável.
- Para structs grandes (> 32 bytes por exemplo), considere `*T` para evitar cópias.
- Evite usar ponteiros para tipos que já são referências: slices, maps, chans, funções.
- Documente claramente quando uma função/método aceita `nil` como argumento — e trate `nil` de forma segura.

---

# 18. Checklist para evitar bugs com ponteiros

- [ ] Verifique se o ponteiro pode ser `nil` antes de dereferenciar.
- [ ] Decida se deve usar valor ou ponteiro com base em mutabilidade/tamanho/semântica.
- [ ] Evite `unsafe` salvo necessidade absoluta.
- [ ] Para concorrência: use `sync/atomic` ou `sync.Mutex` ao acessar ponteiros compartilhados.
- [ ] Evite `*interface{}` a menos que entenda a implicação.
- [ ] Quando retornar `&x`, confie na escape analysis, mas revise performance se for crítico.

---

# 19. Recursos úteis (próximos passos)

- Leia os capítulos sobre tipos e métodos do _The Go Programming Language_ (Livro) para entender receptor/valor vs ponteiro e método sets.
- Estude `sync/atomic` e `unsafe` com exemplos controlados.
- Perfis de escape analysis (`go build -gcflags="-m"`) para ver quando variáveis escapam para heap.

---

# 20. Exemplo "completo" — pequena aplicação usando ponteiros, métodos e atomic

```go
package main

import (
    "fmt"
    "sync/atomic"
)

type Config struct {
    Name string
    Val  int
}

func (c *Config) UpdateName(n string) {
    c.Name = n
}

func main() {
    // atomic pointer usage
    var cp atomic.Pointer[Config]
    cp.Store(&Config{Name: "init", Val: 1})

    // load and modify safely
    cfg := cp.Load()
    fmt.Println("before:", cfg)
    cfg.UpdateName("changed")
    fmt.Println("after:", cp.Load())

    // show returning pointer from function
    p := NewInt(99)
    fmt.Println(*p)
}

func NewInt(v int) *int {
    x := v
    return &x
}
```

---

## Conclusão curta

- `&` pega o endereço, `*` desreferencia.
- Use ponteiros quando precisa alterar o valor original, evitar cópias grandes ou representar ausência.
- `new` retorna `*T` inicializado com zero; `make` é para slices/maps/chans.
- Aritmética de ponteiro não existe em Go; `unsafe` dá poder e riscos.
- Métodos com receptor ponteiro permitem mutação; receptor valor não.
- Fique atento ao `nil`, `interface{}` contendo ponteiro, escape analysis e ao uso de `atomic`/`unsafe`.
